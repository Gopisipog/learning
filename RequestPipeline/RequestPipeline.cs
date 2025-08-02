using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DistributedPatterns.RequestPipeline
{
    /// <summary>
    /// Represents a request flowing through the pipeline
    /// </summary>
    public class PipelineRequest
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Type { get; set; }
        public object Data { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public TaskCompletionSource<PipelineResult> CompletionSource { get; set; }
        public string ClientId { get; set; }
        public Dictionary<string, object> Context { get; set; } = new();
        public List<string> ProcessingLog { get; set; } = new();
        public int CurrentStage { get; set; } = 0;
    }

    /// <summary>
    /// Result of pipeline processing
    /// </summary>
    public class PipelineResult
    {
        public string RequestId { get; set; }
        public bool Success { get; set; }
        public string Error { get; set; }
        public object Result { get; set; }
        public DateTime CompletedAt { get; set; }
        public TimeSpan TotalProcessingTime { get; set; }
        public List<string> ProcessingLog { get; set; } = new();
        public Dictionary<string, TimeSpan> StageTimings { get; set; } = new();
    }

    /// <summary>
    /// Represents a processing stage in the pipeline
    /// </summary>
    public class PipelineStage
    {
        public string Name { get; set; }
        public Func<PipelineRequest, Task<object>> Processor { get; set; }
        public int MaxConcurrency { get; set; } = 1;
        public TimeSpan Timeout { get; set; } = TimeSpan.FromSeconds(30);
    }

    /// <summary>
    /// Request Pipeline implementation for overlapping request processing stages
    /// while maintaining order
    /// </summary>
    public class RequestPipeline : IDisposable
    {
        private readonly List<PipelineStage> _stages;
        private readonly List<ConcurrentQueue<PipelineRequest>> _stageQueues;
        private readonly List<SemaphoreSlim> _stageSemaphores;
        private readonly List<Task> _stageProcessors;
        private readonly CancellationTokenSource _cancellationTokenSource;
        
        private bool _isDisposed = false;
        private long _requestCounter = 0;

        public event Action<string, PipelineRequest> OnStageStarted;
        public event Action<string, PipelineRequest, object> OnStageCompleted;
        public event Action<PipelineRequest, PipelineResult> OnRequestCompleted;
        public event Action<Exception> OnError;
        public event Action<string> OnLog;

        public RequestPipeline(List<PipelineStage> stages)
        {
            _stages = stages ?? throw new ArgumentNullException(nameof(stages));
            _cancellationTokenSource = new CancellationTokenSource();
            
            // Initialize queues and semaphores for each stage
            _stageQueues = new List<ConcurrentQueue<PipelineRequest>>();
            _stageSemaphores = new List<SemaphoreSlim>();
            _stageProcessors = new List<Task>();

            for (int i = 0; i < _stages.Count; i++)
            {
                _stageQueues.Add(new ConcurrentQueue<PipelineRequest>());
                _stageSemaphores.Add(new SemaphoreSlim(_stages[i].MaxConcurrency, _stages[i].MaxConcurrency));
                
                // Start processor for this stage
                int stageIndex = i; // Capture for closure
                var processor = Task.Run(() => ProcessStage(stageIndex), _cancellationTokenSource.Token);
                _stageProcessors.Add(processor);
            }

            OnLog?.Invoke($"Request Pipeline initialized with {_stages.Count} stages");
        }

        /// <summary>
        /// Submits a request for pipeline processing
        /// </summary>
        public async Task<PipelineResult> SubmitRequestAsync(string requestType, object data, string clientId = null)
        {
            if (_isDisposed)
                throw new ObjectDisposedException(nameof(RequestPipeline));

            var requestId = Interlocked.Increment(ref _requestCounter);
            var request = new PipelineRequest
            {
                Id = $"REQ-{requestId:D6}",
                Type = requestType,
                Data = data,
                ClientId = clientId ?? Thread.CurrentThread.ManagedThreadId.ToString(),
                CompletionSource = new TaskCompletionSource<PipelineResult>()
            };

            request.ProcessingLog.Add($"Request {request.Id} submitted at {request.SubmittedAt:HH:mm:ss.fff}");
            
            // Add to first stage queue
            _stageQueues[0].Enqueue(request);
            
            OnLog?.Invoke($"Request {request.Id} ({request.Type}) submitted by {request.ClientId}");

            // Return the task that will complete when pipeline processing is done
            return await request.CompletionSource.Task;
        }

        /// <summary>
        /// Processes requests for a specific stage
        /// </summary>
        private async Task ProcessStage(int stageIndex)
        {
            var stage = _stages[stageIndex];
            var queue = _stageQueues[stageIndex];
            var semaphore = _stageSemaphores[stageIndex];

            OnLog?.Invoke($"Stage processor started for '{stage.Name}' (Stage {stageIndex})");

            while (!_cancellationTokenSource.Token.IsCancellationRequested)
            {
                try
                {
                    // Wait for requests in the queue
                    if (queue.TryDequeue(out var request))
                    {
                        // Wait for available slot in this stage
                        await semaphore.WaitAsync(_cancellationTokenSource.Token);

                        try
                        {
                            // Process request in this stage (potentially in parallel with other requests)
                            _ = Task.Run(async () =>
                            {
                                try
                                {
                                    await ProcessRequestInStage(request, stageIndex);
                                }
                                finally
                                {
                                    semaphore.Release();
                                }
                            }, _cancellationTokenSource.Token);
                        }
                        catch
                        {
                            semaphore.Release();
                            throw;
                        }
                    }
                    else
                    {
                        // No requests available, wait a bit
                        await Task.Delay(10, _cancellationTokenSource.Token);
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

            OnLog?.Invoke($"Stage processor stopped for '{stage.Name}' (Stage {stageIndex})");
        }

        /// <summary>
        /// Processes a single request in a specific stage
        /// </summary>
        private async Task ProcessRequestInStage(PipelineRequest request, int stageIndex)
        {
            var stage = _stages[stageIndex];
            var stageStartTime = DateTime.UtcNow;

            try
            {
                request.CurrentStage = stageIndex;
                request.ProcessingLog.Add($"Stage '{stage.Name}' started at {stageStartTime:HH:mm:ss.fff}");
                
                OnStageStarted?.Invoke(stage.Name, request);
                OnLog?.Invoke($"Request {request.Id} started stage '{stage.Name}'");

                // Process the request in this stage with timeout
                using var cts = new CancellationTokenSource(stage.Timeout);
                var stageResult = await stage.Processor(request);

                var stageEndTime = DateTime.UtcNow;
                var stageDuration = stageEndTime - stageStartTime;
                
                request.ProcessingLog.Add($"Stage '{stage.Name}' completed at {stageEndTime:HH:mm:ss.fff} (Duration: {stageDuration.TotalMilliseconds:F1}ms)");
                
                // Store stage result in context
                request.Context[$"Stage_{stageIndex}_Result"] = stageResult;
                request.Context[$"Stage_{stageIndex}_Duration"] = stageDuration;

                OnStageCompleted?.Invoke(stage.Name, request, stageResult);
                OnLog?.Invoke($"Request {request.Id} completed stage '{stage.Name}' in {stageDuration.TotalMilliseconds:F1}ms");

                // Move to next stage or complete
                if (stageIndex < _stages.Count - 1)
                {
                    // Add to next stage queue
                    _stageQueues[stageIndex + 1].Enqueue(request);
                }
                else
                {
                    // Final stage - complete the request
                    CompleteRequest(request, stageResult);
                }
            }
            catch (OperationCanceledException)
            {
                var error = $"Stage '{stage.Name}' timed out after {stage.Timeout.TotalSeconds}s";
                request.ProcessingLog.Add($"Stage '{stage.Name}' timed out at {DateTime.UtcNow:HH:mm:ss.fff}");
                CompleteRequestWithError(request, error);
            }
            catch (Exception ex)
            {
                var error = $"Stage '{stage.Name}' failed: {ex.Message}";
                request.ProcessingLog.Add($"Stage '{stage.Name}' failed at {DateTime.UtcNow:HH:mm:ss.fff}: {ex.Message}");
                CompleteRequestWithError(request, error);
            }
        }

        /// <summary>
        /// Completes a request successfully
        /// </summary>
        private void CompleteRequest(PipelineRequest request, object finalResult)
        {
            var completedAt = DateTime.UtcNow;
            var totalTime = completedAt - request.SubmittedAt;

            var result = new PipelineResult
            {
                RequestId = request.Id,
                Success = true,
                Result = finalResult,
                CompletedAt = completedAt,
                TotalProcessingTime = totalTime,
                ProcessingLog = new List<string>(request.ProcessingLog)
            };

            // Extract stage timings
            for (int i = 0; i < _stages.Count; i++)
            {
                if (request.Context.TryGetValue($"Stage_{i}_Duration", out var duration))
                {
                    result.StageTimings[_stages[i].Name] = (TimeSpan)duration;
                }
            }

            result.ProcessingLog.Add($"Request {request.Id} completed at {completedAt:HH:mm:ss.fff} (Total: {totalTime.TotalMilliseconds:F1}ms)");

            OnRequestCompleted?.Invoke(request, result);
            OnLog?.Invoke($"Request {request.Id} completed successfully in {totalTime.TotalMilliseconds:F1}ms");

            request.CompletionSource.SetResult(result);
        }

        /// <summary>
        /// Completes a request with an error
        /// </summary>
        private void CompleteRequestWithError(PipelineRequest request, string error)
        {
            var completedAt = DateTime.UtcNow;
            var totalTime = completedAt - request.SubmittedAt;

            var result = new PipelineResult
            {
                RequestId = request.Id,
                Success = false,
                Error = error,
                CompletedAt = completedAt,
                TotalProcessingTime = totalTime,
                ProcessingLog = new List<string>(request.ProcessingLog)
            };

            result.ProcessingLog.Add($"Request {request.Id} failed at {completedAt:HH:mm:ss.fff}: {error}");

            OnRequestCompleted?.Invoke(request, result);
            OnLog?.Invoke($"Request {request.Id} failed: {error}");

            request.CompletionSource.SetResult(result);
        }

        /// <summary>
        /// Gets pipeline statistics
        /// </summary>
        public PipelineStatistics GetStatistics()
        {
            var stats = new PipelineStatistics
            {
                TotalStages = _stages.Count,
                TotalRequestsProcessed = _requestCounter,
                IsRunning = !_isDisposed
            };

            for (int i = 0; i < _stages.Count; i++)
            {
                stats.StageQueueLengths[_stages[i].Name] = _stageQueues[i].Count;
                stats.StageMaxConcurrency[_stages[i].Name] = _stages[i].MaxConcurrency;
                stats.StageAvailableSlots[_stages[i].Name] = _stageSemaphores[i].CurrentCount;
            }

            return stats;
        }

        public void Dispose()
        {
            if (_isDisposed)
                return;

            _isDisposed = true;
            OnLog?.Invoke("Shutting down Request Pipeline...");

            // Signal shutdown
            _cancellationTokenSource.Cancel();

            // Wait for all stage processors to complete
            try
            {
                Task.WaitAll(_stageProcessors.ToArray(), TimeSpan.FromSeconds(5));
            }
            catch (Exception ex)
            {
                OnError?.Invoke(ex);
            }

            // Dispose resources
            foreach (var semaphore in _stageSemaphores)
            {
                semaphore.Dispose();
            }

            _cancellationTokenSource.Dispose();
            OnLog?.Invoke("Request Pipeline disposed");
        }
    }

    /// <summary>
    /// Statistics about the pipeline
    /// </summary>
    public class PipelineStatistics
    {
        public int TotalStages { get; set; }
        public long TotalRequestsProcessed { get; set; }
        public bool IsRunning { get; set; }
        public Dictionary<string, int> StageQueueLengths { get; set; } = new();
        public Dictionary<string, int> StageMaxConcurrency { get; set; } = new();
        public Dictionary<string, int> StageAvailableSlots { get; set; } = new();
    }
}
