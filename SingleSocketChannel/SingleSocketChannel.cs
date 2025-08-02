using System;
using System.Collections.Concurrent;
using System.IO;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace DistributedPatterns.SingleSocketChannel
{
    /// <summary>
    /// Represents a message to be sent through the single socket channel
    /// </summary>
    public class Message
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Type { get; set; }
        public object Data { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public int SequenceNumber { get; set; }
        public int RetryCount { get; set; } = 0;
    }

    /// <summary>
    /// Response from the server for a message
    /// </summary>
    public class MessageResponse
    {
        public string MessageId { get; set; }
        public bool Success { get; set; }
        public string Error { get; set; }
        public object Result { get; set; }
        public int SequenceNumber { get; set; }
    }

    /// <summary>
    /// Single Socket Channel implementation for maintaining message order
    /// while keeping connection costs low
    /// </summary>
    public class SingleSocketChannel : IDisposable
    {
        private readonly string _serverHost;
        private readonly int _serverPort;
        private readonly int _maxRetries;
        private readonly TimeSpan _retryDelay;
        private readonly TimeSpan _connectionTimeout;

        private TcpClient _tcpClient;
        private NetworkStream _networkStream;
        private readonly ConcurrentQueue<Message> _messageQueue;
        private readonly ConcurrentDictionary<string, TaskCompletionSource<MessageResponse>> _pendingMessages;
        
        private int _sequenceNumber = 0;
        private bool _isConnected = false;
        private bool _isDisposed = false;
        private readonly object _connectionLock = new object();
        
        private Task _sendTask;
        private Task _receiveTask;
        private readonly CancellationTokenSource _cancellationTokenSource;

        public event Action<string> OnConnectionStatusChanged;
        public event Action<Exception> OnError;

        public SingleSocketChannel(string serverHost, int serverPort, 
            int maxRetries = 3, TimeSpan? retryDelay = null, TimeSpan? connectionTimeout = null)
        {
            _serverHost = serverHost ?? throw new ArgumentNullException(nameof(serverHost));
            _serverPort = serverPort;
            _maxRetries = maxRetries;
            _retryDelay = retryDelay ?? TimeSpan.FromSeconds(1);
            _connectionTimeout = connectionTimeout ?? TimeSpan.FromSeconds(10);

            _messageQueue = new ConcurrentQueue<Message>();
            _pendingMessages = new ConcurrentDictionary<string, TaskCompletionSource<MessageResponse>>();
            _cancellationTokenSource = new CancellationTokenSource();
        }

        /// <summary>
        /// Establishes connection to the server and starts message processing
        /// </summary>
        public async Task ConnectAsync()
        {
            if (_isDisposed)
                throw new ObjectDisposedException(nameof(SingleSocketChannel));

            bool shouldConnect = false;
            lock (_connectionLock)
            {
                if (_isConnected)
                    return;
                shouldConnect = true;
            }

            if (shouldConnect)
            {
                try
                {
                    _tcpClient = new TcpClient();

                    // Set connection timeout
                    var connectTask = _tcpClient.ConnectAsync(_serverHost, _serverPort);
                    if (await Task.WhenAny(connectTask, Task.Delay(_connectionTimeout)) != connectTask)
                    {
                        throw new TimeoutException($"Connection to {_serverHost}:{_serverPort} timed out");
                    }

                    _networkStream = _tcpClient.GetStream();

                    lock (_connectionLock)
                    {
                        _isConnected = true;
                    }

                    // Start background tasks for sending and receiving
                    _sendTask = Task.Run(SendMessagesAsync, _cancellationTokenSource.Token);
                    _receiveTask = Task.Run(ReceiveMessagesAsync, _cancellationTokenSource.Token);

                    OnConnectionStatusChanged?.Invoke("Connected");
                }
                catch (Exception ex)
                {
                    lock (_connectionLock)
                    {
                        _isConnected = false;
                    }
                    OnError?.Invoke(ex);
                    throw;
                }
            }
        }

        /// <summary>
        /// Sends a message through the single socket channel with ordering guarantees
        /// </summary>
        public async Task<MessageResponse> SendMessageAsync(string messageType, object data, 
            CancellationToken cancellationToken = default)
        {
            if (_isDisposed)
                throw new ObjectDisposedException(nameof(SingleSocketChannel));

            if (!_isConnected)
                await ConnectAsync();

            var message = new Message
            {
                Type = messageType,
                Data = data,
                SequenceNumber = Interlocked.Increment(ref _sequenceNumber)
            };

            var tcs = new TaskCompletionSource<MessageResponse>();
            _pendingMessages[message.Id] = tcs;

            // Add message to queue for ordered processing
            _messageQueue.Enqueue(message);

            try
            {
                // Wait for response with cancellation support
                using (cancellationToken.Register(() => tcs.TrySetCanceled()))
                {
                    return await tcs.Task;
                }
            }
            finally
            {
                _pendingMessages.TryRemove(message.Id, out _);
            }
        }

        /// <summary>
        /// Background task that sends messages in order
        /// </summary>
        private async Task SendMessagesAsync()
        {
            while (!_cancellationTokenSource.Token.IsCancellationRequested)
            {
                try
                {
                    if (_messageQueue.TryDequeue(out var message))
                    {
                        await SendSingleMessageAsync(message);
                    }
                    else
                    {
                        // No messages to send, wait a bit
                        await Task.Delay(10, _cancellationTokenSource.Token);
                    }
                }
                catch (Exception ex)
                {
                    OnError?.Invoke(ex);
                    
                    // If connection is lost, try to reconnect
                    if (!_isConnected)
                    {
                        await TryReconnectAsync();
                    }
                }
            }
        }

        /// <summary>
        /// Sends a single message with retry logic
        /// </summary>
        private async Task SendSingleMessageAsync(Message message)
        {
            var json = JsonSerializer.Serialize(message);
            var data = Encoding.UTF8.GetBytes(json);
            var lengthPrefix = BitConverter.GetBytes(data.Length);

            for (int attempt = 0; attempt <= _maxRetries; attempt++)
            {
                try
                {
                    if (!_isConnected || _networkStream == null)
                    {
                        throw new InvalidOperationException("Not connected to server");
                    }

                    // Send length prefix followed by message data
                    await _networkStream.WriteAsync(lengthPrefix, 0, lengthPrefix.Length);
                    await _networkStream.WriteAsync(data, 0, data.Length);
                    await _networkStream.FlushAsync();

                    return; // Success
                }
                catch (Exception ex)
                {
                    message.RetryCount = attempt + 1;
                    
                    if (attempt == _maxRetries)
                    {
                        // Max retries reached, fail the message
                        if (_pendingMessages.TryRemove(message.Id, out var tcs))
                        {
                            tcs.SetException(new InvalidOperationException(
                                $"Failed to send message after {_maxRetries} retries", ex));
                        }
                        return;
                    }

                    // Wait before retry
                    await Task.Delay(_retryDelay, _cancellationTokenSource.Token);
                    
                    // Try to reconnect if connection is lost
                    if (!_isConnected)
                    {
                        await TryReconnectAsync();
                    }
                }
            }
        }

        /// <summary>
        /// Background task that receives responses from server
        /// </summary>
        private async Task ReceiveMessagesAsync()
        {
            var buffer = new byte[4096];
            
            while (!_cancellationTokenSource.Token.IsCancellationRequested)
            {
                try
                {
                    if (!_isConnected || _networkStream == null)
                    {
                        await Task.Delay(100, _cancellationTokenSource.Token);
                        continue;
                    }

                    // Read length prefix
                    var lengthBytes = new byte[4];
                    var bytesRead = await _networkStream.ReadAsync(lengthBytes, 0, 4, _cancellationTokenSource.Token);
                    
                    if (bytesRead == 0)
                    {
                        // Connection closed
                        _isConnected = false;
                        OnConnectionStatusChanged?.Invoke("Disconnected");
                        continue;
                    }

                    var messageLength = BitConverter.ToInt32(lengthBytes, 0);
                    
                    // Read message data
                    var messageBytes = new byte[messageLength];
                    var totalRead = 0;
                    
                    while (totalRead < messageLength)
                    {
                        bytesRead = await _networkStream.ReadAsync(messageBytes, totalRead, 
                            messageLength - totalRead, _cancellationTokenSource.Token);
                        totalRead += bytesRead;
                    }

                    var json = Encoding.UTF8.GetString(messageBytes);
                    var response = JsonSerializer.Deserialize<MessageResponse>(json);

                    // Complete the pending message
                    if (_pendingMessages.TryRemove(response.MessageId, out var tcs))
                    {
                        tcs.SetResult(response);
                    }
                }
                catch (Exception ex)
                {
                    OnError?.Invoke(ex);
                    _isConnected = false;
                    OnConnectionStatusChanged?.Invoke("Disconnected");
                }
            }
        }

        /// <summary>
        /// Attempts to reconnect to the server
        /// </summary>
        private async Task TryReconnectAsync()
        {
            if (_isConnected)
                return;

            try
            {
                _tcpClient?.Close();
                _networkStream?.Close();
                
                await Task.Delay(_retryDelay);
                await ConnectAsync();
            }
            catch (Exception ex)
            {
                OnError?.Invoke(ex);
            }
        }

        /// <summary>
        /// Gets the current connection status
        /// </summary>
        public bool IsConnected => _isConnected;

        /// <summary>
        /// Gets the number of pending messages in the queue
        /// </summary>
        public int PendingMessageCount => _messageQueue.Count;

        /// <summary>
        /// Gets the number of messages waiting for responses
        /// </summary>
        public int WaitingForResponseCount => _pendingMessages.Count;

        public void Dispose()
        {
            if (_isDisposed)
                return;

            _isDisposed = true;
            _cancellationTokenSource.Cancel();

            try
            {
                _sendTask?.Wait(TimeSpan.FromSeconds(5));
                _receiveTask?.Wait(TimeSpan.FromSeconds(5));
            }
            catch (Exception ex)
            {
                OnError?.Invoke(ex);
            }

            _networkStream?.Close();
            _tcpClient?.Close();
            _cancellationTokenSource.Dispose();

            // Complete any pending messages with cancellation
            foreach (var pending in _pendingMessages.Values)
            {
                pending.TrySetCanceled();
            }

            OnConnectionStatusChanged?.Invoke("Disposed");
        }
    }
}
