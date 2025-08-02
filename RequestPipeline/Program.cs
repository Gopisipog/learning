using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;
using System.Diagnostics;
using System.Linq;

namespace DistributedPatterns.RequestPipeline
{
    /// <summary>
    /// Demonstration program for Request Pipeline pattern
    /// </summary>
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("=== Request Pipeline Pattern Demo ===\n");

            // Create pipeline stages
            var stages = CreatePipelineStages();
            var pipeline = new RequestPipeline(stages);
            
            // Set up event handlers
            pipeline.OnLog += message => Console.WriteLine($"[PIPELINE] {message}");
            pipeline.OnError += ex => Console.WriteLine($"[ERROR] {ex.Message}");
            pipeline.OnStageStarted += (stage, request) => 
                Console.WriteLine($"[STAGE] {request.Id} started '{stage}'");
            pipeline.OnStageCompleted += (stage, request, result) => 
                Console.WriteLine($"[STAGE] {request.Id} completed '{stage}' -> {result}");
            pipeline.OnRequestCompleted += (request, result) => 
                Console.WriteLine($"[COMPLETED] {request.Id} -> Success: {result.Success}, Time: {result.TotalProcessingTime.TotalMilliseconds:F1}ms");

            try
            {
                Console.WriteLine("=== Testing Sequential Requests ===");
                await TestSequentialRequests(pipeline);

                Console.WriteLine("\n=== Testing Concurrent Requests ===");
                await TestConcurrentRequests(pipeline);

                Console.WriteLine("\n=== Testing Pipeline Overlap ===");
                await TestPipelineOverlap(pipeline);

                Console.WriteLine("\n=== Testing Error Handling ===");
                await TestErrorHandling(pipeline);

                Console.WriteLine("\n=== Testing Performance Under Load ===");
                await TestPerformance(pipeline);

                Console.WriteLine("\n=== Pipeline Statistics ===");
                DisplayStatistics(pipeline);
            }
            finally
            {
                pipeline.Dispose();
            }

            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }

        static List<PipelineStage> CreatePipelineStages()
        {
            return new List<PipelineStage>
            {
                new PipelineStage
                {
                    Name = "Validation",
                    MaxConcurrency = 3,
                    Timeout = TimeSpan.FromSeconds(5),
                    Processor = async (request) =>
                    {
                        // Simulate validation processing
                        await Task.Delay(50);
                        
                        if (request.Type == "INVALID")
                            throw new ArgumentException("Invalid request type");
                            
                        return $"Validated: {request.Type}";
                    }
                },
                new PipelineStage
                {
                    Name = "Authentication",
                    MaxConcurrency = 2,
                    Timeout = TimeSpan.FromSeconds(10),
                    Processor = async (request) =>
                    {
                        // Simulate authentication processing
                        await Task.Delay(75);
                        
                        var clientId = request.ClientId ?? "anonymous";
                        return $"Authenticated: {clientId}";
                    }
                },
                new PipelineStage
                {
                    Name = "Processing",
                    MaxConcurrency = 1, // Bottleneck stage
                    Timeout = TimeSpan.FromSeconds(15),
                    Processor = async (request) =>
                    {
                        // Simulate main processing
                        var processingTime = request.Type switch
                        {
                            "FAST" => 25,
                            "SLOW" => 200,
                            "TIMEOUT" => 20000, // Will timeout
                            _ => 100
                        };
                        
                        await Task.Delay(processingTime);
                        
                        if (request.Type == "ERROR")
                            throw new InvalidOperationException("Processing failed");
                            
                        return $"Processed: {request.Data}";
                    }
                },
                new PipelineStage
                {
                    Name = "Finalization",
                    MaxConcurrency = 4,
                    Timeout = TimeSpan.FromSeconds(5),
                    Processor = async (request) =>
                    {
                        // Simulate finalization
                        await Task.Delay(30);
                        
                        var processingResult = request.Context["Stage_2_Result"];
                        return $"Finalized: {processingResult}";
                    }
                }
            };
        }

        static async Task TestSequentialRequests(RequestPipeline pipeline)
        {
            Console.WriteLine("Submitting 3 sequential requests...");

            for (int i = 1; i <= 3; i++)
            {
                var result = await pipeline.SubmitRequestAsync("NORMAL", $"Data-{i}", $"Client-Sequential");
                Console.WriteLine($"  Request {i} completed: {result.Success}, Time: {result.TotalProcessingTime.TotalMilliseconds:F1}ms");
                
                if (result.Success)
                {
                    Console.WriteLine($"    Result: {result.Result}");
                    Console.WriteLine($"    Stage timings: {string.Join(", ", result.StageTimings.Select(kvp => $"{kvp.Key}:{kvp.Value.TotalMilliseconds:F0}ms"))}");
                }
            }
        }

        static async Task TestConcurrentRequests(RequestPipeline pipeline)
        {
            Console.WriteLine("Submitting 5 concurrent requests...");

            var tasks = new List<Task<PipelineResult>>();

            for (int i = 1; i <= 5; i++)
            {
                var task = pipeline.SubmitRequestAsync("NORMAL", $"ConcurrentData-{i}", $"Client-{i}");
                tasks.Add(task);
                Console.WriteLine($"  Queued request {i}");
            }

            var results = await Task.WhenAll(tasks);

            Console.WriteLine("Concurrent request results:");
            for (int i = 0; i < results.Length; i++)
            {
                var result = results[i];
                Console.WriteLine($"  Request {i + 1}: Success={result.Success}, Time={result.TotalProcessingTime.TotalMilliseconds:F1}ms");
            }
        }

        static async Task TestPipelineOverlap(RequestPipeline pipeline)
        {
            Console.WriteLine("Testing pipeline overlap with mixed request types...");

            var tasks = new List<Task<PipelineResult>>();
            var requestTypes = new[] { "FAST", "NORMAL", "SLOW", "FAST", "NORMAL" };

            for (int i = 0; i < requestTypes.Length; i++)
            {
                var task = pipeline.SubmitRequestAsync(requestTypes[i], $"OverlapData-{i}", $"OverlapClient-{i}");
                tasks.Add(task);
                Console.WriteLine($"  Submitted {requestTypes[i]} request {i}");
                
                // Small delay to show overlap
                await Task.Delay(20);
            }

            var results = await Task.WhenAll(tasks);

            Console.WriteLine("Pipeline overlap results:");
            for (int i = 0; i < results.Length; i++)
            {
                var result = results[i];
                Console.WriteLine($"  {requestTypes[i]} Request {i}: Time={result.TotalProcessingTime.TotalMilliseconds:F1}ms");
            }
        }

        static async Task TestErrorHandling(RequestPipeline pipeline)
        {
            Console.WriteLine("Testing error handling...");

            var errorTests = new[]
            {
                ("INVALID", "Validation error test"),
                ("ERROR", "Processing error test"),
                ("TIMEOUT", "Timeout test"),
                ("NORMAL", "Recovery test")
            };

            foreach (var (type, description) in errorTests)
            {
                try
                {
                    Console.WriteLine($"  Testing: {description}");
                    var result = await pipeline.SubmitRequestAsync(type, "ErrorTestData", "ErrorClient");
                    
                    Console.WriteLine($"    Result: Success={result.Success}");
                    if (!result.Success)
                    {
                        Console.WriteLine($"    Error: {result.Error}");
                    }
                    else
                    {
                        Console.WriteLine($"    Time: {result.TotalProcessingTime.TotalMilliseconds:F1}ms");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"    Exception: {ex.Message}");
                }
            }
        }

        static async Task TestPerformance(RequestPipeline pipeline)
        {
            Console.WriteLine("Testing performance with 20 concurrent requests...");

            var stopwatch = Stopwatch.StartNew();
            var tasks = new List<Task<PipelineResult>>();

            // Submit 20 requests concurrently
            for (int i = 0; i < 20; i++)
            {
                var requestType = i % 3 == 0 ? "FAST" : "NORMAL";
                tasks.Add(pipeline.SubmitRequestAsync(requestType, $"PerfData-{i}", $"PerfClient-{i % 5}"));
            }

            var results = await Task.WhenAll(tasks);
            stopwatch.Stop();

            var successCount = results.Count(r => r.Success);
            var avgTime = results.Where(r => r.Success).Average(r => r.TotalProcessingTime.TotalMilliseconds);
            var minTime = results.Where(r => r.Success).Min(r => r.TotalProcessingTime.TotalMilliseconds);
            var maxTime = results.Where(r => r.Success).Max(r => r.TotalProcessingTime.TotalMilliseconds);

            Console.WriteLine($"  Completed {successCount}/20 requests in {stopwatch.ElapsedMilliseconds}ms");
            Console.WriteLine($"  Average request time: {avgTime:F1}ms");
            Console.WriteLine($"  Min/Max request time: {minTime:F1}ms / {maxTime:F1}ms");
            Console.WriteLine($"  Overall throughput: {20.0 / stopwatch.Elapsed.TotalSeconds:F1} requests/second");

            // Show stage timing breakdown
            var stageTimings = new Dictionary<string, List<double>>();
            foreach (var result in results.Where(r => r.Success))
            {
                foreach (var timing in result.StageTimings)
                {
                    if (!stageTimings.ContainsKey(timing.Key))
                        stageTimings[timing.Key] = new List<double>();
                    stageTimings[timing.Key].Add(timing.Value.TotalMilliseconds);
                }
            }

            Console.WriteLine("  Average stage timings:");
            foreach (var stage in stageTimings)
            {
                Console.WriteLine($"    {stage.Key}: {stage.Value.Average():F1}ms");
            }
        }

        static void DisplayStatistics(RequestPipeline pipeline)
        {
            var stats = pipeline.GetStatistics();

            Console.WriteLine($"Pipeline Statistics:");
            Console.WriteLine($"  Total Stages: {stats.TotalStages}");
            Console.WriteLine($"  Total Requests Processed: {stats.TotalRequestsProcessed}");
            Console.WriteLine($"  Is Running: {stats.IsRunning}");

            Console.WriteLine($"  Stage Queue Lengths:");
            foreach (var stage in stats.StageQueueLengths)
            {
                Console.WriteLine($"    {stage.Key}: {stage.Value} pending");
            }

            Console.WriteLine($"  Stage Concurrency (Available/Max):");
            foreach (var stage in stats.StageMaxConcurrency)
            {
                var available = stats.StageAvailableSlots[stage.Key];
                Console.WriteLine($"    {stage.Key}: {available}/{stage.Value}");
            }
        }
    }
}
