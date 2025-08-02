using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;
using System.Diagnostics;

namespace DistributedPatterns.SingularUpdateQueue
{
    /// <summary>
    /// Demonstration program for Singular Update Queue pattern
    /// </summary>
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("=== Singular Update Queue Pattern Demo ===\n");

            var queue = new SingularUpdateQueue();
            
            // Set up event handlers
            queue.OnLog += message => Console.WriteLine($"[QUEUE] {message}");
            queue.OnError += ex => Console.WriteLine($"[ERROR] {ex.Message}");
            queue.OnOperationProcessed += (op, result) => 
                Console.WriteLine($"[PROCESSED] {op.Type} by {op.ClientId} -> Seq: {result.SequenceNumber}, Success: {result.Success}");

            try
            {
                Console.WriteLine("=== Testing Sequential Operations ===");
                await TestSequentialOperations(queue);

                Console.WriteLine("\n=== Testing Concurrent Operations ===");
                await TestConcurrentOperations(queue);

                Console.WriteLine("\n=== Testing Different Operation Types ===");
                await TestOperationTypes(queue);

                Console.WriteLine("\n=== Testing Error Handling ===");
                await TestErrorHandling(queue);

                Console.WriteLine("\n=== Testing Performance Under Load ===");
                await TestPerformance(queue);

                Console.WriteLine("\n=== Final State and Statistics ===");
                DisplayFinalState(queue);
            }
            finally
            {
                queue.Dispose();
            }

            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }

        static async Task TestSequentialOperations(SingularUpdateQueue queue)
        {
            Console.WriteLine("Submitting 5 sequential SET operations...");

            for (int i = 1; i <= 5; i++)
            {
                var setData = new Dictionary<string, object>
                {
                    ["key"] = $"key{i}",
                    ["value"] = $"value{i}"
                };

                var result = await queue.SubmitUpdateAsync("SET", setData, $"Client-Sequential");
                Console.WriteLine($"  SET key{i} -> Seq: {result.SequenceNumber}, Result: {result.Result}");
            }
        }

        static async Task TestConcurrentOperations(SingularUpdateQueue queue)
        {
            Console.WriteLine("Submitting concurrent operations from multiple clients...");

            var tasks = new List<Task>();

            // Client 1: SET operations
            tasks.Add(Task.Run(async () =>
            {
                for (int i = 1; i <= 3; i++)
                {
                    var setData = new Dictionary<string, object>
                    {
                        ["key"] = $"concurrent{i}",
                        ["value"] = $"client1-value{i}"
                    };
                    
                    var result = await queue.SubmitUpdateAsync("SET", setData, "Client-1");
                    Console.WriteLine($"  Client-1 SET concurrent{i} -> Seq: {result.SequenceNumber}");
                    await Task.Delay(10);
                }
            }));

            // Client 2: INCREMENT operations
            tasks.Add(Task.Run(async () =>
            {
                for (int i = 1; i <= 3; i++)
                {
                    var incData = new Dictionary<string, object>
                    {
                        ["key"] = "counter",
                        ["value"] = i
                    };
                    
                    var result = await queue.SubmitUpdateAsync("INCREMENT", incData, "Client-2");
                    Console.WriteLine($"  Client-2 INCREMENT counter by {i} -> Seq: {result.SequenceNumber}, Result: {result.Result}");
                    await Task.Delay(15);
                }
            }));

            // Client 3: Mixed operations
            tasks.Add(Task.Run(async () =>
            {
                var operations = new[] { "SET", "GET", "SET" };
                for (int i = 0; i < operations.Length; i++)
                {
                    var opData = new Dictionary<string, object>
                    {
                        ["key"] = $"mixed{i}",
                        ["value"] = $"mixed-value{i}"
                    };
                    
                    var result = await queue.SubmitUpdateAsync(operations[i], opData, "Client-3");
                    Console.WriteLine($"  Client-3 {operations[i]} mixed{i} -> Seq: {result.SequenceNumber}");
                    await Task.Delay(20);
                }
            }));

            await Task.WhenAll(tasks);
        }

        static async Task TestOperationTypes(SingularUpdateQueue queue)
        {
            Console.WriteLine("Testing different operation types...");

            // Test GET operation
            var getData = new Dictionary<string, object> { ["key"] = "key1" };
            var getResult = await queue.SubmitUpdateAsync("GET", getData, "Tester");
            Console.WriteLine($"  GET key1 -> Result: {getResult.Result}");

            // Test INCREMENT operation
            var incData = new Dictionary<string, object> { ["key"] = "counter" };
            var incResult = await queue.SubmitUpdateAsync("INCREMENT", incData, "Tester");
            Console.WriteLine($"  INCREMENT counter -> Result: {incResult.Result}");

            // Test BATCH operation
            var batchData = new Dictionary<string, object>
            {
                ["operations"] = new object[]
                {
                    new Dictionary<string, object> { ["type"] = "SET", ["key"] = "batch1", ["value"] = "batchValue1" },
                    new Dictionary<string, object> { ["type"] = "SET", ["key"] = "batch2", ["value"] = "batchValue2" },
                    new Dictionary<string, object> { ["type"] = "GET", ["key"] = "batch1" }
                }
            };
            var batchResult = await queue.SubmitUpdateAsync("BATCH", batchData, "Tester");
            Console.WriteLine($"  BATCH operation -> Results: {string.Join(", ", (List<object>)batchResult.Result)}");

            // Test SLOW operation
            Console.WriteLine("  Starting SLOW operation (will take 100ms)...");
            var slowResult = await queue.SubmitUpdateAsync("SLOW", null, "Tester");
            Console.WriteLine($"  SLOW operation -> Result: {slowResult.Result}");

            // Test DELETE operation
            var delData = new Dictionary<string, object> { ["key"] = "key1" };
            var delResult = await queue.SubmitUpdateAsync("DELETE", delData, "Tester");
            Console.WriteLine($"  DELETE key1 -> Result: {delResult.Result}");
        }

        static async Task TestErrorHandling(SingularUpdateQueue queue)
        {
            Console.WriteLine("Testing error handling...");

            try
            {
                // Test invalid operation
                var result = await queue.SubmitUpdateAsync("INVALID", null, "ErrorTester");
                Console.WriteLine($"  Unexpected success: {result.Result}");
            }
            catch (Exception)
            {
                // Expected - the operation will fail but not crash the queue
            }

            // Test error operation
            var errorResult = await queue.SubmitUpdateAsync("ERROR", null, "ErrorTester");
            Console.WriteLine($"  ERROR operation -> Success: {errorResult.Success}, Error: {errorResult.Error}");

            // Verify queue is still working after errors
            var testData = new Dictionary<string, object> { ["key"] = "afterError", ["value"] = "stillWorking" };
            var testResult = await queue.SubmitUpdateAsync("SET", testData, "ErrorTester");
            Console.WriteLine($"  Recovery test -> Success: {testResult.Success}, Seq: {testResult.SequenceNumber}");
        }

        static async Task TestPerformance(SingularUpdateQueue queue)
        {
            Console.WriteLine("Testing performance with 100 concurrent operations...");

            var stopwatch = Stopwatch.StartNew();
            var tasks = new List<Task<UpdateResult>>();

            // Submit 100 operations concurrently
            for (int i = 0; i < 100; i++)
            {
                var setData = new Dictionary<string, object>
                {
                    ["key"] = $"perf{i}",
                    ["value"] = $"perfValue{i}"
                };
                
                tasks.Add(queue.SubmitUpdateAsync("SET", setData, $"PerfClient-{i % 10}"));
            }

            var results = await Task.WhenAll(tasks);
            stopwatch.Stop();

            var successCount = 0;
            var minSeq = long.MaxValue;
            var maxSeq = long.MinValue;

            foreach (var result in results)
            {
                if (result.Success)
                {
                    successCount++;
                    minSeq = Math.Min(minSeq, result.SequenceNumber);
                    maxSeq = Math.Max(maxSeq, result.SequenceNumber);
                }
            }

            Console.WriteLine($"  Completed {successCount}/100 operations in {stopwatch.ElapsedMilliseconds}ms");
            Console.WriteLine($"  Sequence range: {minSeq} to {maxSeq}");
            Console.WriteLine($"  Average time per operation: {stopwatch.ElapsedMilliseconds / 100.0:F2}ms");
        }

        static void DisplayFinalState(SingularUpdateQueue queue)
        {
            var stats = queue.GetStatistics();
            var state = queue.GetCurrentState();
            var log = queue.GetOperationLog();

            Console.WriteLine($"Queue Statistics:");
            Console.WriteLine($"  Queue Length: {stats.QueueLength}");
            Console.WriteLine($"  Total Operations Processed: {stats.TotalOperationsProcessed}");
            Console.WriteLine($"  Is Processing: {stats.IsProcessing}");
            Console.WriteLine($"  State Size: {stats.StateSize}");

            Console.WriteLine($"\nFinal Application State:");
            foreach (var kvp in state)
            {
                Console.WriteLine($"  {kvp.Key} = {kvp.Value}");
            }

            Console.WriteLine($"\nOperation Log (last 10 operations):");
            var recentOps = log.TakeLast(10);
            foreach (var op in recentOps)
            {
                Console.WriteLine($"  {op}");
            }
        }
    }
}
