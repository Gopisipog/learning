# Single Socket Channel Pattern - C# Implementation

## Overview

The **Single Socket Channel** pattern is a distributed systems pattern that maintains message ordering between a client and server while keeping connection costs low. This implementation demonstrates how to use a single TCP connection to ensure messages are processed in the correct order with built-in retry mechanisms.

## Problem Statement

In distributed systems, you often need to:
- Maintain the order of requests sent to a server
- Keep connection overhead low
- Handle network failures gracefully
- Ensure reliable message delivery

## Solution

Use a single TCP connection between client and server with:
- **Message queuing** for ordered processing
- **Sequence numbers** to track message order
- **Built-in retry mechanism** for failed messages
- **Automatic reconnection** on connection loss

## Key Benefits

1. **Message Ordering**: TCP guarantees in-order delivery within a single connection
2. **Low Overhead**: Single connection reduces resource usage
3. **Reliability**: Built-in retry and reconnection logic
4. **Simplicity**: Easier to manage than multiple connections

## Implementation Details

### Core Components

#### 1. SingleSocketChannel Class
- Manages the TCP connection to the server
- Queues messages for ordered sending
- Handles retries and reconnection
- Provides async/await interface for message sending

#### 2. Message Structure
```csharp
public class Message
{
    public string Id { get; set; }           // Unique identifier
    public string Type { get; set; }         // Message type
    public object Data { get; set; }         // Message payload
    public DateTime Timestamp { get; set; }  // When created
    public int SequenceNumber { get; set; }  // Order tracking
    public int RetryCount { get; set; }      // Retry attempts
}
```

#### 3. Response Structure
```csharp
public class MessageResponse
{
    public string MessageId { get; set; }    // Correlates to request
    public bool Success { get; set; }        // Success indicator
    public string Error { get; set; }        // Error message if failed
    public object Result { get; set; }       // Response data
    public int SequenceNumber { get; set; }  // Order tracking
}
```

### Key Features

#### Message Ordering
- Messages are queued in a `ConcurrentQueue<Message>`
- Each message gets a sequential number
- Background task sends messages one at a time
- TCP guarantees in-order delivery

#### Retry Mechanism
- Configurable retry count (default: 3)
- Exponential backoff between retries
- Failed messages complete with exception
- Automatic reconnection on connection loss

#### Connection Management
- Single TCP connection per client
- Automatic connection establishment
- Graceful handling of disconnections
- Connection status events

#### Thread Safety
- Thread-safe message queuing
- Concurrent message sending support
- Proper async/await patterns
- Cancellation token support

## Usage Example

### Basic Usage
```csharp
// Create client
var client = new SingleSocketChannel("localhost", 8080);

// Connect to server
await client.ConnectAsync();

// Send messages
var response1 = await client.SendMessageAsync("PING", null);
var response2 = await client.SendMessageAsync("ECHO", "Hello World");

// Cleanup
client.Dispose();
```

### Advanced Usage with Error Handling
```csharp
var client = new SingleSocketChannel("localhost", 8080, 
    maxRetries: 5, 
    retryDelay: TimeSpan.FromSeconds(2));

// Set up event handlers
client.OnConnectionStatusChanged += status => 
    Console.WriteLine($"Connection: {status}");
client.OnError += ex => 
    Console.WriteLine($"Error: {ex.Message}");

try
{
    await client.ConnectAsync();
    
    // Send with timeout
    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
    var response = await client.SendMessageAsync("CALCULATE", 
        new { operation = "ADD", a = 5, b = 3 }, cts.Token);
    
    Console.WriteLine($"Result: {response.Result}");
}
catch (Exception ex)
{
    Console.WriteLine($"Failed: {ex.Message}");
}
finally
{
    client.Dispose();
}
```

## Running the Demo

### Prerequisites
- .NET 8.0 or later
- Visual Studio 2022 or VS Code with C# extension

### Steps
1. **Build the project**:
   ```bash
   dotnet build
   ```

2. **Run the demo**:
   ```bash
   dotnet run
   ```

3. **What the demo shows**:
   - Server startup and client connection
   - Message ordering verification
   - Different message types (PING, ECHO, TIME, CALCULATE)
   - Concurrent message handling
   - Error handling scenarios
   - Connection statistics

### Expected Output
```
=== Single Socket Channel Pattern Demo ===

[SERVER] Server started on port 8080
Server started. Press any key to start client demo...

[CLIENT] Connection status: Connected
[SERVER] Client connected: 127.0.0.1:xxxxx

=== Testing message ordering ===
Queued message 1
Queued message 2
Queued message 3
Queued message 4
Queued message 5
Responses received:
  Seq 1: Message 1
  Seq 2: Message 2
  Seq 3: Message 3
  Seq 4: Message 4
  Seq 5: Message 5

=== Testing different message types ===
PING response: PONG
TIME response: 2024-01-15 10:30:45 UTC
CALCULATE response: 15.8
ECHO response: {"name":"John Doe","age":30,"items":["item1","item2","item3"]}
```

## Architecture Diagram

```
Client                          Server
┌─────────────────┐            ┌─────────────────┐
│ SingleSocket    │            │ SimpleServer    │
│ Channel         │            │                 │
│                 │            │                 │
│ ┌─────────────┐ │   TCP      │ ┌─────────────┐ │
│ │ Message     │ │ Connection │ │ Message     │ │
│ │ Queue       │ │◄──────────►│ │ Handler     │ │
│ └─────────────┘ │            │ └─────────────┘ │
│                 │            │                 │
│ ┌─────────────┐ │            │ ┌─────────────┐ │
│ │ Send Task   │ │            │ │ Response    │ │
│ └─────────────┘ │            │ │ Sender      │ │
│                 │            │ └─────────────┘ │
│ ┌─────────────┐ │            │                 │
│ │ Receive     │ │            │                 │
│ │ Task        │ │            │                 │
│ └─────────────┘ │            │                 │
└─────────────────┘            └─────────────────┘
```

## Best Practices

1. **Connection Management**:
   - Always dispose the client properly
   - Handle connection events
   - Implement proper retry logic

2. **Error Handling**:
   - Use try-catch blocks around message sending
   - Handle cancellation tokens
   - Monitor connection status

3. **Performance**:
   - Reuse the same client instance
   - Don't create too many concurrent messages
   - Monitor queue sizes

4. **Testing**:
   - Test with network failures
   - Verify message ordering
   - Test concurrent scenarios

## Real-World Applications

- **Database Replication**: Ensuring write operations are applied in order
- **Message Queues**: Maintaining message order for critical operations
- **Distributed Logging**: Preserving log entry sequence
- **State Machine Replication**: Ensuring state changes are applied correctly
- **Financial Systems**: Maintaining transaction order

## Related Patterns

- **Request Pipeline**: For overlapping request processing
- **Request Batch**: For grouping multiple requests
- **Leader Follower**: For coordinated updates
- **Write-Ahead Log**: For durable message ordering

This implementation provides a solid foundation for understanding and implementing the Single Socket Channel pattern in real-world distributed systems.
