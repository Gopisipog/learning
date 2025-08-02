using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;

namespace DistributedPatterns.SingularUpdateQueue
{
    /// <summary>
    /// Represents an update operation to be processed
    /// </summary>
    public class UpdateOperation
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Type { get; set; }
        public object Data { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public TaskCompletionSource<UpdateResult> CompletionSource { get; set; }
        public string ClientId { get; set; }
    }

    /// <summary>
    /// Result of an update operation
    /// </summary>
    public class UpdateResult
    {
        public string OperationId { get; set; }
        public bool Success { get; set; }
        public string Error { get; set; }
        public object Result { get; set; }
        public DateTime ProcessedAt { get; set; }
        public long SequenceNumber { get; set; }
    }

    /// <summary>
    /// Singular Update Queue implementation for handling concurrent state updates safely
    /// without blocking all threads
    /// </summary>
    public class SingularUpdateQueue : IDisposable
    {
        private readonly ConcurrentQueue<UpdateOperation> _updateQueue;
        private readonly Thread _processingThread;
        private readonly CancellationTokenSource _cancellationTokenSource;
        private readonly ManualResetEventSlim _hasWork;
        
        private long _sequenceNumber = 0;
        private bool _isDisposed = false;
        private readonly object _stateLock = new object();
        
        // Simulated application state
        private readonly Dictionary<string, object> _applicationState;
        private readonly List<string> _operationLog;

        public event Action<UpdateOperation, UpdateResult> OnOperationProcessed;
        public event Action<Exception> OnError;
        public event Action<string> OnLog;

        public SingularUpdateQueue()
        {
            _updateQueue = new ConcurrentQueue<UpdateOperation>();
            _cancellationTokenSource = new CancellationTokenSource();
            _hasWork = new ManualResetEventSlim(false);
            _applicationState = new Dictionary<string, object>();
            _operationLog = new List<string>();

            // Start the single processing thread
            _processingThread = new Thread(ProcessUpdates)
            {
                Name = "SingularUpdateQueue-Processor",
                IsBackground = false
            };
            _processingThread.Start();

            OnLog?.Invoke("Singular Update Queue started with single processing thread");
        }

        /// <summary>
        /// Submits an update operation for processing (non-blocking for clients)
        /// </summary>
        public async Task<UpdateResult> SubmitUpdateAsync(string operationType, object data, string clientId = null)
        {
            if (_isDisposed)
                throw new ObjectDisposedException(nameof(SingularUpdateQueue));

            var operation = new UpdateOperation
            {
                Type = operationType,
                Data = data,
                ClientId = clientId ?? Thread.CurrentThread.ManagedThreadId.ToString(),
                CompletionSource = new TaskCompletionSource<UpdateResult>()
            };

            // Enqueue the operation (thread-safe, non-blocking)
            _updateQueue.Enqueue(operation);
            _hasWork.Set(); // Signal the processing thread

            OnLog?.Invoke($"Operation {operation.Type} queued by client {operation.ClientId}");

            // Return the task that will complete when the operation is processed
            return await operation.CompletionSource.Task;
        }

        /// <summary>
        /// Single thread that processes all updates sequentially
        /// </summary>
        private void ProcessUpdates()
        {
            OnLog?.Invoke("Processing thread started");

            while (!_cancellationTokenSource.Token.IsCancellationRequested)
            {
                try
                {
                    // Wait for work or cancellation
                    _hasWork.Wait(_cancellationTokenSource.Token);
                    _hasWork.Reset();

                    // Process all available operations
                    while (_updateQueue.TryDequeue(out var operation))
                    {
                        var result = ProcessSingleUpdate(operation);
                        
                        // Complete the operation for the waiting client
                        operation.CompletionSource.SetResult(result);
                        
                        OnOperationProcessed?.Invoke(operation, result);
                    }
                }
                catch (OperationCanceledException)
                {
                    // Expected when shutting down
                    break;
                }
                catch (Exception ex)
                {
                    OnError?.Invoke(ex);
                }
            }

            OnLog?.Invoke("Processing thread stopped");
        }

        /// <summary>
        /// Processes a single update operation (called only by the processing thread)
        /// </summary>
        private UpdateResult ProcessSingleUpdate(UpdateOperation operation)
        {
            var sequenceNum = Interlocked.Increment(ref _sequenceNumber);
            var result = new UpdateResult
            {
                OperationId = operation.Id,
                ProcessedAt = DateTime.UtcNow,
                SequenceNumber = sequenceNum
            };

            try
            {
                OnLog?.Invoke($"Processing operation {operation.Type} (Seq: {sequenceNum}) from client {operation.ClientId}");

                // Simulate processing time
                Thread.Sleep(10);

                // Process based on operation type
                switch (operation.Type?.ToUpper())
                {
                    case "SET":
                        result.Result = ProcessSetOperation(operation.Data);
                        break;

                    case "GET":
                        result.Result = ProcessGetOperation(operation.Data);
                        break;

                    case "INCREMENT":
                        result.Result = ProcessIncrementOperation(operation.Data);
                        break;

                    case "DELETE":
                        result.Result = ProcessDeleteOperation(operation.Data);
                        break;

                    case "BATCH":
                        result.Result = ProcessBatchOperation(operation.Data);
                        break;

                    case "SLOW":
                        // Simulate slow operation
                        Thread.Sleep(100);
                        result.Result = "Slow operation completed";
                        break;

                    case "ERROR":
                        throw new InvalidOperationException("Simulated error for testing");

                    default:
                        throw new ArgumentException($"Unknown operation type: {operation.Type}");
                }

                result.Success = true;
                
                // Log the operation
                lock (_stateLock)
                {
                    _operationLog.Add($"[{sequenceNum}] {operation.Type} by {operation.ClientId} at {result.ProcessedAt:HH:mm:ss.fff}");
                }

                OnLog?.Invoke($"Operation {operation.Type} completed successfully (Seq: {sequenceNum})");
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Error = ex.Message;
                OnLog?.Invoke($"Operation {operation.Type} failed: {ex.Message}");
            }

            return result;
        }

        private object ProcessSetOperation(object data)
        {
            if (data is not Dictionary<string, object> setData || 
                !setData.ContainsKey("key") || !setData.ContainsKey("value"))
            {
                throw new ArgumentException("SET operation requires 'key' and 'value'");
            }

            var key = setData["key"].ToString();
            var value = setData["value"];

            lock (_stateLock)
            {
                _applicationState[key] = value;
            }

            return $"Set {key} = {value}";
        }

        private object ProcessGetOperation(object data)
        {
            if (data is not Dictionary<string, object> getData || !getData.ContainsKey("key"))
            {
                throw new ArgumentException("GET operation requires 'key'");
            }

            var key = getData["key"].ToString();

            lock (_stateLock)
            {
                return _applicationState.TryGetValue(key, out var value) ? value : null;
            }
        }

        private object ProcessIncrementOperation(object data)
        {
            if (data is not Dictionary<string, object> incData || !incData.ContainsKey("key"))
            {
                throw new ArgumentException("INCREMENT operation requires 'key'");
            }

            var key = incData["key"].ToString();
            var increment = incData.ContainsKey("value") ? Convert.ToInt32(incData["value"]) : 1;

            lock (_stateLock)
            {
                var currentValue = _applicationState.TryGetValue(key, out var val) ? Convert.ToInt32(val) : 0;
                var newValue = currentValue + increment;
                _applicationState[key] = newValue;
                return newValue;
            }
        }

        private object ProcessDeleteOperation(object data)
        {
            if (data is not Dictionary<string, object> delData || !delData.ContainsKey("key"))
            {
                throw new ArgumentException("DELETE operation requires 'key'");
            }

            var key = delData["key"].ToString();

            lock (_stateLock)
            {
                var existed = _applicationState.Remove(key);
                return existed ? $"Deleted {key}" : $"Key {key} not found";
            }
        }

        private object ProcessBatchOperation(object data)
        {
            if (data is not Dictionary<string, object> batchData || !batchData.ContainsKey("operations"))
            {
                throw new ArgumentException("BATCH operation requires 'operations' array");
            }

            var operations = batchData["operations"] as object[];
            var results = new List<object>();

            foreach (var op in operations)
            {
                if (op is Dictionary<string, object> opData)
                {
                    var type = opData["type"].ToString();
                    var opResult = type.ToUpper() switch
                    {
                        "SET" => ProcessSetOperation(opData),
                        "GET" => ProcessGetOperation(opData),
                        "INCREMENT" => ProcessIncrementOperation(opData),
                        "DELETE" => ProcessDeleteOperation(opData),
                        _ => $"Unknown operation: {type}"
                    };
                    results.Add(opResult);
                }
            }

            return results;
        }

        /// <summary>
        /// Gets the current application state (thread-safe read)
        /// </summary>
        public Dictionary<string, object> GetCurrentState()
        {
            lock (_stateLock)
            {
                return new Dictionary<string, object>(_applicationState);
            }
        }

        /// <summary>
        /// Gets the operation log (thread-safe read)
        /// </summary>
        public List<string> GetOperationLog()
        {
            lock (_stateLock)
            {
                return new List<string>(_operationLog);
            }
        }

        /// <summary>
        /// Gets queue statistics
        /// </summary>
        public QueueStatistics GetStatistics()
        {
            return new QueueStatistics
            {
                QueueLength = _updateQueue.Count,
                TotalOperationsProcessed = _sequenceNumber,
                IsProcessing = _processingThread.IsAlive,
                StateSize = GetCurrentState().Count
            };
        }

        public void Dispose()
        {
            if (_isDisposed)
                return;

            _isDisposed = true;
            OnLog?.Invoke("Shutting down Singular Update Queue...");

            // Signal shutdown
            _cancellationTokenSource.Cancel();
            _hasWork.Set();

            // Wait for processing thread to complete
            if (_processingThread.IsAlive)
            {
                _processingThread.Join(TimeSpan.FromSeconds(5));
            }

            _hasWork.Dispose();
            _cancellationTokenSource.Dispose();

            OnLog?.Invoke("Singular Update Queue disposed");
        }
    }

    /// <summary>
    /// Statistics about the queue
    /// </summary>
    public class QueueStatistics
    {
        public int QueueLength { get; set; }
        public long TotalOperationsProcessed { get; set; }
        public bool IsProcessing { get; set; }
        public int StateSize { get; set; }
    }
}
