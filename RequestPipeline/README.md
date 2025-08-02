# Request Pipeline Pattern - C# Implementation

## Overview

The **Request Pipeline** pattern improves throughput when processing multiple requests that have dependencies by pipelining requests to allow multiple requests to be processed concurrently while maintaining order.

## Problem Statement

In distributed systems, you often need to:
- Process requests through multiple sequential stages
- Improve overall throughput despite stage dependencies
- Handle varying processing times across stages
- Maintain request ordering through the pipeline
- Maximize resource utilization across all stages

## Solution

Use a pipeline architecture where:
- **Multiple Stages**: Each stage handles a specific part of request processing
- **Overlapping Execution**: Different requests can be in different stages simultaneously
- **Concurrent Processing**: Each stage can process multiple requests in parallel
- **Ordered Flow**: Requests flow through stages in submission order

## Key Benefits

1. **Improved Throughput**: Multiple requests processed simultaneously across stages
2. **Resource Utilization**: Each stage can run at optimal capacity
3. **Scalability**: Individual stages can be scaled independently
4. **Flexibility**: Different concurrency levels per stage
5. **Maintainability**:  separation of processing concerns

## Implementation Details

### Core Components

#### 1. RequestPipeline Class
- Manages multiple processing stages
- Coordinates request flow between stages
- Handles concurrent processing within stages
- Provides comprehensive monitoring and statistics
Clear
#### 2. PipelineRequest Structure
```csharp
public class PipelineRequest
{
    public string Id { get; set; }                    // Unique identifier
    public string Type { get; set; }                  // Request type
    public object Data { get; set; }                  // Request payload
    public DateTime SubmittedAt { get; set; }         // Submission timestamp
    public TaskCompletionSource<PipelineResult> CompletionSource { get; set; }  // Async completion
    public string ClientId { get; set; }              // Client identifier
    public Dictionary<string, object> Context { get; set; }  // Inter-stage data
    public List<string> ProcessingLog { get; set; }   // Processing audit trail
    public int CurrentStage { get; set; }             // Current stage index
}
```

#### 3. PipelineStage Configuration
```csharp
public class PipelineStage
{
    public string Name { get; set; }                  // Stage identifier
    public Func<PipelineRequest, Task<object>> Processor { get; set; }  // Processing function
    public int MaxConcurrency { get; set; }           // Concurrent request limit
    public TimeSpan Timeout { get; set; }             // Stage timeout
}
```

### Key Features

#### Multi-Stage Processing
- **Validation**: Input validation and sanitization
- **Authentication**: User authentication and authorization
- **Processing**: Core business logic execution
- **Finalization**: Result formatting and cleanup

#### Concurrent Stage Execution
- Each stage has configurable concurrency limits
- SemaphoreSlim controls concurrent request processing
- Independent stage processors run in parallel
- Requests flow between stages asynchronously

#### Request Ordering
- Requests maintain submission order through pipeline
- FIFO queues between stages preserve ordering
- Context preservation across stages
- Comprehensive processing logs

#### Error Handling
- Individual request failures don't affect pipeline
- Stage-specific timeout handling
- Graceful error propagation to clients
- Pipeline continues processing after errors

## Usage Example

### Basic Pipeline Setup
```csharp
var stages = new List<PipelineStage>
{
    new PipelineStage
    {
        Name = "Validation",
        MaxConcurrency = 3,
        Timeout = TimeSpan.FromSeconds(5),
        Processor = async (request) =>
        {
            await Task.Delay(50); // Simulate validation
            return $"Validated: {request.Type}";
        }
    },
    new PipelineStage
    {
        Name = "Processing",
        MaxConcurrency = 1,
        Timeout = TimeSpan.FromSeconds(15),
        Processor = async (request) =>
        {
            await Task.Delay(100); // Simulate processing
            return $"Processed: {request.Data}";
        }
    }
};

var pipeline = new RequestPipeline(stages);
```

### Submitting Requests
```csharp
// Submit single request
var result = await pipeline.SubmitRequestAsync("ORDER", orderData, "Client1");

// Submit concurrent requests
var tasks = new List<Task<PipelineResult>>();
for (int i = 0; i < 10; i++)
{
    tasks.Add(pipeline.SubmitRequestAsync("BATCH", $"Data-{i}", $"Client-{i}"));
}
var results = await Task.WhenAll(tasks);
```

### Event Monitoring
```csharp
pipeline.OnStageStarted += (stage, request) => 
    Console.WriteLine($"Request {request.Id} started stage {stage}");
    
pipeline.OnStageCompleted += (stage, request, result) => 
    Console.WriteLine($"Request {request.Id} completed stage {stage}");
    
pipeline.OnRequestCompleted += (request, result) => 
    Console.WriteLine($"Request {request.Id} completed in {result.TotalProcessingTime.TotalMilliseconds}ms");
```

## Running the Demo

### Prerequisites
- .NET 9.0 or later
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
   - Sequential request processing with stage overlap
   - Concurrent request handling across multiple stages
   - Pipeline overlap with mixed request types
   - Error handling and timeout scenarios
   - Performance testing with 20 concurrent requests
   - Detailed statistics and stage timing analysis

### Expected Output
```
=== Request Pipeline Pattern Demo ===

[PIPELINE] Request Pipeline initialized with 4 stages

=== Testing Sequential Requests ===
[STAGE] REQ-000001 started 'Validation'
[STAGE] REQ-000001 completed 'Validation' -> Validated: NORMAL
[STAGE] REQ-000001 started 'Authentication'
[STAGE] REQ-000001 completed 'Authentication' -> Authenticated: Client-Sequential
...

=== Testing Concurrent Requests ===
[STAGE] REQ-000004 started 'Validation'
[STAGE] REQ-000005 started 'Validation'
[STAGE] REQ-000006 started 'Validation'
...

Performance Results:
  Completed 20/20 requests in 2847ms
  Average request time: 284.7ms
  Overall throughput: 7.0 requests/second
```

## Architecture Diagram

```
Request Submission                    Pipeline Stages
┌─────────────┐                      ┌─────────────────────────────────┐
│ Client 1    │                      │ Stage 1: Validation (3 slots)  │
│ Client 2    │ SubmitRequestAsync   │ ┌─────┐ ┌─────┐ ┌─────┐         │
│ Client N    │─────────────────────►│ │ Req │ │ Req │ │ Req │         │
└─────────────┘                      │ │  A  │ │  B  │ │  C  │         │
                                     │ └─────┘ └─────┘ └─────┘         │
                                     └─────────────┬───────────────────┘
                                                   │
                                     ┌─────────────▼───────────────────┐
                                     │ Stage 2: Authentication (2 slots)│
                                     │ ┌─────┐ ┌─────┐                 │
                                     │ │ Req │ │ Req │                 │
                                     │ │  A  │ │  B  │                 │
                                     │ └─────┘ └─────┘                 │
                                     └─────────────┬───────────────────┘
                                                   │
                                     ┌─────────────▼───────────────────┐
                                     │ Stage 3: Processing (1 slot)    │
                                     │ ┌─────┐                         │
                                     │ │ Req │                         │
                                     │ │  A  │                         │
                                     │ └─────┘                         │
                                     └─────────────┬───────────────────┘
                                                   │
                                     ┌─────────────▼───────────────────┐
                                     │ Stage 4: Finalization (4 slots) │
                                     │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
                                     │ │ Req │ │ Req │ │ Req │ │ Req │ │
                                     │ │  A  │ │  B  │ │  C  │ │  D  │ │
                                     │ └─────┘ └─────┘ └─────┘ └─────┘ │
                                     └─────────────────────────────────┘
```

## Best Practices

1. **Stage Design**:
   - Keep stages focused on single responsibilities
   - Balance concurrency levels based on resource requirements
   - Set appropriate timeouts for each stage
   - Design for idempotency where possible

2. **Performance Optimization**:
   - Identify and optimize bottleneck stages
   - Scale high-concurrency stages appropriately
   - Monitor queue lengths and processing times
   - Use async/await patterns throughout

3. **Error Handling**:
   - Implement proper timeout handling
   - Log errors with sufficient context
   - Design graceful degradation strategies
   - Consider retry mechanisms for transient failures

4. **Monitoring**:
   - Track stage-specific metrics
   - Monitor overall pipeline throughput
   - Alert on queue buildup or timeout increases
   - Analyze stage timing patterns

## Real-World Applications

- **Web Request Processing**: HTTP request validation, authentication, business logic, response formatting
- **Message Processing**: Message validation, routing, transformation, delivery
- **Data Processing Pipelines**: Data ingestion, validation, transformation, storage
- **Image/Video Processing**: Upload, validation, processing, thumbnail generation, storage
- **Order Processing**: Validation, inventory check, payment processing, fulfillment
- **ETL Pipelines**: Extract, transform, load operations with parallel processing
- **API Gateway**: Rate limiting, authentication, routing, response transformation

## Related Patterns

- **Single Socket Channel**: For maintaining message order over network
- **Singular Update Queue**: For sequential state updates
- **Request Batch**: For grouping multiple requests efficiently
- **Circuit Breaker**: For handling stage failures gracefully

This implementation provides a robust foundation for building high-throughput request processing systems with clear separation of concerns and excellent observability.
