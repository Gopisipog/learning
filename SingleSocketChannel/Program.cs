using System;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;

namespace DistributedPatterns.SingleSocketChannel
{
    /// <summary>
    /// Demonstration program for Single Socket Channel pattern
    /// </summary>
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("=== Single Socket Channel Pattern Demo ===\n");

            // Start the server
            var server = new SimpleServer(8080);
            server.OnLog += message => Console.WriteLine($"[SERVER] {message}");
            server.OnError += ex => Console.WriteLine($"[SERVER ERROR] {ex.Message}");

            await server.StartAsync();
            Console.WriteLine("Server started. Press any key to start client demo...");
            Console.ReadKey();
            Console.WriteLine("\n");

            // Create and test the client
            await RunClientDemo();

            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();

            server.Dispose();
        }

        static async Task RunClientDemo()
        {
            var client = new SingleSocketChannel("localhost", 8080, maxRetries: 3);
            
            // Set up event handlers
            client.OnConnectionStatusChanged += status => 
                Console.WriteLine($"[CLIENT] Connection status: {status}");
            client.OnError += ex => 
                Console.WriteLine($"[CLIENT ERROR] {ex.Message}");

            try
            {
                Console.WriteLine("=== Connecting to server ===");
                await client.ConnectAsync();

                Console.WriteLine("\n=== Testing message ordering ===");
                await TestMessageOrdering(client);

                Console.WriteLine("\n=== Testing different message types ===");
                await TestMessageTypes(client);

                Console.WriteLine("\n=== Testing concurrent messages ===");
                await TestConcurrentMessages(client);

                Console.WriteLine("\n=== Testing error handling ===");
                await TestErrorHandling(client);

                Console.WriteLine("\n=== Connection statistics ===");
                Console.WriteLine($"Pending messages: {client.PendingMessageCount}");
                Console.WriteLine($"Waiting for response: {client.WaitingForResponseCount}");
                Console.WriteLine($"Connected: {client.IsConnected}");
            }
            finally
            {
                client.Dispose();
            }
        }

        static async Task TestMessageOrdering(SingleSocketChannel client)
        {
            Console.WriteLine("Sending 5 sequential messages to test ordering...");

            var tasks = new List<Task<MessageResponse>>();

            // Send multiple messages quickly
            for (int i = 1; i <= 5; i++)
            {
                var task = client.SendMessageAsync("ECHO", $"Message {i}");
                tasks.Add(task);
                Console.WriteLine($"Queued message {i}");
            }

            // Wait for all responses
            var responses = await Task.WhenAll(tasks);

            Console.WriteLine("Responses received:");
            foreach (var response in responses)
            {
                Console.WriteLine($"  Seq {response.SequenceNumber}: {response.Result}");
            }
        }

        static async Task TestMessageTypes(SingleSocketChannel client)
        {
            Console.WriteLine("Testing different message types...");

            // Test PING
            var pingResponse = await client.SendMessageAsync("PING", null);
            Console.WriteLine($"PING response: {pingResponse.Result}");

            // Test TIME
            var timeResponse = await client.SendMessageAsync("TIME", null);
            Console.WriteLine($"TIME response: {timeResponse.Result}");

            // Test CALCULATE
            var calcData = new { operation = "ADD", a = 10.5, b = 5.3 };
            var calcResponse = await client.SendMessageAsync("CALCULATE", calcData);
            Console.WriteLine($"CALCULATE response: {calcResponse.Result}");

            // Test ECHO with complex data
            var complexData = new { 
                name = "John Doe", 
                age = 30, 
                items = new[] { "item1", "item2", "item3" } 
            };
            var echoResponse = await client.SendMessageAsync("ECHO", complexData);
            Console.WriteLine($"ECHO response: {echoResponse.Result}");
        }

        static async Task TestConcurrentMessages(SingleSocketChannel client)
        {
            Console.WriteLine("Testing concurrent message sending...");

            var tasks = new List<Task>();

            // Send messages concurrently from multiple "threads"
            for (int i = 0; i < 3; i++)
            {
                int threadId = i;
                var task = Task.Run(async () =>
                {
                    for (int j = 1; j <= 3; j++)
                    {
                        try
                        {
                            var response = await client.SendMessageAsync("ECHO", 
                                $"Thread-{threadId}-Message-{j}");
                            Console.WriteLine($"Thread {threadId}: {response.Result} (Seq: {response.SequenceNumber})");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Thread {threadId} error: {ex.Message}");
                        }

                        // Small delay between messages
                        await Task.Delay(50);
                    }
                });
                tasks.Add(task);
            }

            await Task.WhenAll(tasks);
        }

        static async Task TestErrorHandling(SingleSocketChannel client)
        {
            Console.WriteLine("Testing error handling...");

            try
            {
                // Test server-side error
                var errorResponse = await client.SendMessageAsync("ERROR", null);
                Console.WriteLine($"Error response - Success: {errorResponse.Success}, Error: {errorResponse.Error}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception caught: {ex.Message}");
            }

            try
            {
                // Test unknown message type
                var unknownResponse = await client.SendMessageAsync("UNKNOWN_TYPE", "test data");
                Console.WriteLine($"Unknown type response - Success: {unknownResponse.Success}, Error: {unknownResponse.Error}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception caught: {ex.Message}");
            }

            try
            {
                // Test timeout (with cancellation token)
                using (var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2)))
                {
                    var timeoutResponse = await client.SendMessageAsync("PING", null, cts.Token);
                    Console.WriteLine($"Timeout test response: {timeoutResponse.Result}");
                }
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine("Operation was cancelled (timeout test)");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Timeout test exception: {ex.Message}");
            }
        }
    }
}
