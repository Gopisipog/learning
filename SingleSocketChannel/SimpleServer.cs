using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace DistributedPatterns.SingleSocketChannel
{
    /// <summary>
    /// Simple server implementation to demonstrate Single Socket Channel pattern
    /// </summary>
    public class SimpleServer : IDisposable
    {
        private readonly int _port;
        private TcpListener _listener;
        private bool _isRunning = false;
        private readonly CancellationTokenSource _cancellationTokenSource;

        public event Action<string> OnLog;
        public event Action<Exception> OnError;

        public SimpleServer(int port = 8080)
        {
            _port = port;
            _cancellationTokenSource = new CancellationTokenSource();
        }

        /// <summary>
        /// Starts the server and begins accepting connections
        /// </summary>
        public async Task StartAsync()
        {
            if (_isRunning)
                return;

            try
            {
                _listener = new TcpListener(IPAddress.Any, _port);
                _listener.Start();
                _isRunning = true;

                OnLog?.Invoke($"Server started on port {_port}");

                // Accept connections in background
                _ = Task.Run(AcceptConnectionsAsync, _cancellationTokenSource.Token);

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                OnError?.Invoke(ex);
                throw;
            }
        }

        /// <summary>
        /// Stops the server
        /// </summary>
        public void Stop()
        {
            if (!_isRunning)
                return;

            _isRunning = false;
            _cancellationTokenSource.Cancel();
            _listener?.Stop();

            OnLog?.Invoke("Server stopped");
        }

        /// <summary>
        /// Accepts incoming connections
        /// </summary>
        private async Task AcceptConnectionsAsync()
        {
            while (_isRunning && !_cancellationTokenSource.Token.IsCancellationRequested)
            {
                try
                {
                    var tcpClient = await _listener.AcceptTcpClientAsync();
                    OnLog?.Invoke($"Client connected: {tcpClient.Client.RemoteEndPoint}");

                    // Handle each client in a separate task
                    _ = Task.Run(() => HandleClientAsync(tcpClient), _cancellationTokenSource.Token);
                }
                catch (ObjectDisposedException)
                {
                    // Server is shutting down
                    break;
                }
                catch (Exception ex)
                {
                    OnError?.Invoke(ex);
                }
            }
        }

        /// <summary>
        /// Handles a single client connection
        /// </summary>
        private async Task HandleClientAsync(TcpClient client)
        {
            var clientEndpoint = client.Client.RemoteEndPoint?.ToString();
            
            try
            {
                using (client)
                using (var stream = client.GetStream())
                {
                    OnLog?.Invoke($"Handling client: {clientEndpoint}");

                    while (client.Connected && !_cancellationTokenSource.Token.IsCancellationRequested)
                    {
                        try
                        {
                            // Read message length
                            var lengthBytes = new byte[4];
                            var bytesRead = await stream.ReadAsync(lengthBytes, 0, 4, _cancellationTokenSource.Token);
                            
                            if (bytesRead == 0)
                            {
                                // Client disconnected
                                break;
                            }

                            var messageLength = BitConverter.ToInt32(lengthBytes, 0);
                            
                            // Read message data
                            var messageBytes = new byte[messageLength];
                            var totalRead = 0;
                            
                            while (totalRead < messageLength)
                            {
                                bytesRead = await stream.ReadAsync(messageBytes, totalRead, 
                                    messageLength - totalRead, _cancellationTokenSource.Token);
                                totalRead += bytesRead;
                            }

                            var json = Encoding.UTF8.GetString(messageBytes);
                            var message = JsonSerializer.Deserialize<Message>(json);

                            OnLog?.Invoke($"Received message from {clientEndpoint}: {message.Type} (Seq: {message.SequenceNumber})");

                            // Process the message and send response
                            var response = await ProcessMessageAsync(message);
                            await SendResponseAsync(stream, response);
                        }
                        catch (Exception ex)
                        {
                            OnError?.Invoke(ex);
                            break;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                OnError?.Invoke(ex);
            }
            finally
            {
                OnLog?.Invoke($"Client disconnected: {clientEndpoint}");
            }
        }

        /// <summary>
        /// Processes a received message and returns a response
        /// </summary>
        private async Task<MessageResponse> ProcessMessageAsync(Message message)
        {
            // Simulate processing time
            await Task.Delay(100);

            var response = new MessageResponse
            {
                MessageId = message.Id,
                SequenceNumber = message.SequenceNumber,
                Success = true
            };

            // Handle different message types
            switch (message.Type?.ToUpper())
            {
                case "PING":
                    response.Result = "PONG";
                    break;

                case "ECHO":
                    response.Result = message.Data;
                    break;

                case "TIME":
                    response.Result = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss UTC");
                    break;

                case "CALCULATE":
                    response.Result = ProcessCalculation(message.Data);
                    break;

                case "ERROR":
                    response.Success = false;
                    response.Error = "Simulated error for testing";
                    break;

                default:
                    response.Success = false;
                    response.Error = $"Unknown message type: {message.Type}";
                    break;
            }

            return response;
        }

        /// <summary>
        /// Processes a calculation request
        /// </summary>
        private object ProcessCalculation(object data)
        {
            try
            {
                if (data is JsonElement element)
                {
                    var operation = element.GetProperty("operation").GetString();
                    var a = element.GetProperty("a").GetDouble();
                    var b = element.GetProperty("b").GetDouble();

                    return operation?.ToUpper() switch
                    {
                        "ADD" => a + b,
                        "SUBTRACT" => a - b,
                        "MULTIPLY" => a * b,
                        "DIVIDE" => b != 0 ? a / b : throw new DivideByZeroException(),
                        _ => throw new ArgumentException($"Unknown operation: {operation}")
                    };
                }
                
                throw new ArgumentException("Invalid calculation data format");
            }
            catch (Exception ex)
            {
                throw new ArgumentException($"Calculation error: {ex.Message}");
            }
        }

        /// <summary>
        /// Sends a response back to the client
        /// </summary>
        private async Task SendResponseAsync(NetworkStream stream, MessageResponse response)
        {
            var json = JsonSerializer.Serialize(response);
            var data = Encoding.UTF8.GetBytes(json);
            var lengthPrefix = BitConverter.GetBytes(data.Length);

            await stream.WriteAsync(lengthPrefix, 0, lengthPrefix.Length);
            await stream.WriteAsync(data, 0, data.Length);
            await stream.FlushAsync();
        }

        public void Dispose()
        {
            Stop();
            _cancellationTokenSource?.Dispose();
        }
    }
}
