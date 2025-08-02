import React, { useState, useEffect } from 'react';
import './DistributedSystemsPatterns.css';

const DistributedSystemsPatternsMicrofrontend = () => {
  const [selectedCategory, setSelectedCategory] = useState('communication');
  const [studyMode, setStudyMode] = useState('overview'); // overview, flashcards, quiz, printable
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyProgress, setStudyProgress] = useState({});
  const [selectedPatterns, setSelectedPatterns] = useState([]);

  // Distributed Systems Patterns organized by category
  const patterns = {
    communication: {
      title: "🔗 Communication Patterns",
      description: "Patterns for reliable communication between distributed nodes",
      patterns: [
        {
          id: 'single-socket-channel',
          name: 'Single Socket Channel',
          problem: 'How to maintain order of requests sent to a server while keeping connection costs low?',
          solution: 'Use a single TCP connection between follower and leader to ensure message ordering with built-in retry mechanism.',
          keyPoints: [
            'Maintains message order using TCP guarantees',
            'Reduces connection overhead',
            'Built-in retry mechanism for lost messages',
            'Serializes updates using Singular Update Queue'
          ],
          useCases: ['Leader-Follower communication', 'Database replication', 'Message ordering'],
          demoStatus: '✅ Successfully implemented and tested in C# - Full working demo available',
          implementation: `// Single Socket Channel Implementation
class SingleSocketChannel {
  constructor(serverAddress) {
    this.socket = new Socket(serverAddress);
    this.messageQueue = new Queue();
    this.isConnected = false;
  }
  
  async connect() {
    try {
      await this.socket.connect();
      this.isConnected = true;
      this.startMessageProcessor();
    } catch (error) {
      console.error('Connection failed:', error);
      setTimeout(() => this.connect(), 1000); // Retry
    }
  }
  
  sendMessage(message) {
    if (this.isConnected) {
      this.socket.send(message);
    } else {
      this.messageQueue.enqueue(message);
    }
  }
  
  startMessageProcessor() {
    // Process queued messages in order
    while (!this.messageQueue.isEmpty()) {
      const message = this.messageQueue.dequeue();
      this.socket.send(message);
    }
  }
}`,
          relatedPatterns: ['Singular Update Queue', 'Leader Follower', 'Heartbeat'],
          difficulty: 'Beginner',
          category: 'Communication',
          notes: {
            csharpImplementation: {
              title: 'C# Implementation Reference - Production Ready',
              description: 'Complete working implementation with demo server and comprehensive testing',
              location: 'SingleSocketChannel/ directory',
              keyFeatures: [
                'SingleSocketChannel.cs - Main pattern implementation with async/await',
                'SimpleServer.cs - Demo server supporting multiple message types',
                'Program.cs - Comprehensive demonstration with all test scenarios',
                'Message ordering verification with sequence numbers',
                'Concurrent message handling from multiple threads',
                'Built-in retry logic with configurable attempts and delays',
                'Automatic reconnection on connection failures',
                'Error handling for server-side and network errors',
                'Connection lifecycle management with proper disposal',
                'Real-time statistics tracking (pending messages, connection status)'
              ],
              demoResults: {
                messageOrdering: 'Successfully demonstrated 5 sequential messages processed in exact order (Seq 1-5)',
                messageTypes: 'Tested PING, TIME, CALCULATE, ECHO with complex JSON data',
                concurrentHandling: '3 threads sending 3 messages each, all processed in order (Seq 10-18)',
                errorHandling: 'Graceful handling of server errors and unknown message types',
                connectionStats: 'Zero pending messages, proper connection status tracking',
                performance: '21 messages processed successfully with zero connection overhead'
              },
              technicalDetails: {
                protocol: 'Length-prefixed message framing over TCP',
                serialization: 'System.Text.Json for message serialization',
                threading: 'Background tasks for send/receive with ConcurrentQueue',
                reliability: 'Configurable retry count (default: 3) with exponential backoff',
                connectionManagement: 'Single persistent TCP connection with auto-reconnect'
              },
              bestPractices: [
                'Always dispose client properly to release resources',
                'Handle connection events for monitoring',
                'Use cancellation tokens for timeout scenarios',
                'Monitor queue sizes to prevent memory issues',
                'Implement proper error handling around message sending',
                'Reuse same client instance for efficiency'
              ]
            },
            patternBenefits: {
              ordering: 'TCP guarantees in-order delivery within single connection',
              efficiency: 'Single connection reduces resource usage vs multiple connections',
              reliability: 'Built-in retry and reconnection logic handles network failures',
              simplicity: 'Easier to manage than multiple connection patterns'
            },
            realWorldApplications: [
              'Database replication - Ensuring write operations applied in order',
              'Message queues - Maintaining message order for critical operations',
              'Financial systems - Preserving transaction sequence',
              'Distributed logging - Maintaining log entry chronological order',
              'State machine replication - Ensuring state changes applied correctly'
            ],
            implementationNotes: {
              keyClasses: {
                'SingleSocketChannel': 'Main client class with connection management and message queuing',
                'Message': 'Structured message with ID, type, data, sequence number, retry count',
                'MessageResponse': 'Response structure with correlation ID and result data',
                'SimpleServer': 'Demo server handling multiple concurrent clients'
              },
              coreFeatures: {
                'Message Ordering': 'ConcurrentQueue ensures FIFO processing with sequence numbers',
                'Connection Management': 'Single TCP connection with automatic reconnection',
                'Error Handling': 'Retry logic with exponential backoff and proper exception propagation',
                'Thread Safety': 'Thread-safe operations using concurrent collections',
                'Async Patterns': 'Modern C# async/await throughout for non-blocking operations'
              }
            }
          }
        },
        {
          id: 'singular-update-queue',
          name: 'Singular Update Queue',
          problem: 'How to handle concurrent state updates safely without blocking all threads?',
          solution: 'Use a single thread with a work queue to process state changes one-at-a-time while allowing concurrent submissions.',
          keyPoints: [
            'Single thread processes updates sequentially',
            'Multiple clients can submit concurrently',
            'Non-blocking for submitting clients',
            'Maintains consistency without locks'
          ],
          useCases: ['Write-Ahead Log processing', 'State machine updates', 'Event processing'],
          implementation: `// Singular Update Queue Implementation
class SingularUpdateQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }
  
  async submitUpdate(updateFunction) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        update: updateFunction,
        resolve,
        reject
      });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }
  
  async processQueue() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const { update, resolve, reject } = this.queue.shift();
      
      try {
        const result = await update();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
    
    this.processing = false;
  }
}`,
          relatedPatterns: ['Single Socket Channel', 'Write-Ahead Log', 'Request Pipeline'],
          difficulty: 'Intermediate',
          category: 'Communication',
          demoStatus: '✅ Successfully implemented and tested in C# - Full working demo available',
          notes: {
            csharpImplementation: {
              title: 'C# Implementation Reference - Production Ready',
              description: 'Complete working implementation with comprehensive testing and performance analysis',
              location: 'SingularUpdateQueue/ directory',
              keyFeatures: [
                'SingularUpdateQueue.cs - Main pattern implementation with single processing thread',
                'Program.cs - Comprehensive demonstration with all test scenarios',
                'UpdateOperation & UpdateResult - Structured operation handling',
                'Single dedicated processing thread for sequential updates',
                'ConcurrentQueue for thread-safe operation submissions',
                'TaskCompletionSource for async client responses',
                'ManualResetEventSlim for efficient thread signaling',
                'Comprehensive error handling and recovery',
                'Real-time statistics and operation logging',
                'Graceful shutdown with proper resource disposal'
              ],
              demoResults: {
                sequentialOperations: 'Successfully processed 5 sequential SET operations in exact order (Seq 1-5)',
                concurrentOperations: 'Multiple clients (Client-1, Client-2, Client-3) submitting concurrently, all processed sequentially',
                operationTypes: 'Tested SET, GET, INCREMENT, DELETE, BATCH, SLOW operations successfully',
                errorHandling: 'Graceful handling of invalid operations and simulated errors without queue disruption',
                performanceTest: '100 concurrent operations completed in 1571ms (15.71ms average per operation)',
                finalStatistics: '122 total operations processed, 113 state entries, zero queue backlog'
              },
              technicalDetails: {
                threading: 'Single dedicated processing thread with ConcurrentQueue for submissions',
                signaling: 'ManualResetEventSlim for efficient thread coordination',
                asyncPattern: 'TaskCompletionSource for non-blocking client interface',
                errorHandling: 'Individual operation failures isolated, queue continues processing',
                performance: 'Sequential processing with concurrent submissions, ~64 ops/second sustained'
              },
              bestPractices: [
                'Monitor queue length to prevent memory issues during high load',
                'Implement backpressure mechanisms for sustained high throughput',
                'Keep individual operations lightweight and fast',
                'Use batch operations for multiple related updates',
                'Handle operation timeouts appropriately',
                'Log errors for debugging and monitoring',
                'Dispose queue properly to release thread resources'
              ]
            },
            patternBenefits: {
              threadSafety: 'Single processing thread eliminates race conditions and complex locking',
              nonBlocking: 'Clients submit operations and receive async results without blocking',
              consistency: 'Sequential processing ensures data integrity and predictable state',
              performance: 'Concurrent submissions with efficient single-threaded processing',
              simplicity: 'Easier to reason about than complex multi-threaded synchronization'
            },
            realWorldApplications: [
              'Configuration management - Safe updates to distributed configuration',
              'Counter services - Atomic increment/decrement operations across system',
              'State machines - Sequential state transitions with consistency guarantees',
              'Cache coordination - Ordered cache updates and invalidation',
              'Database write coordination - Ensuring write operation ordering',
              'Event processing - Sequential event handling with ordering guarantees',
              'Resource allocation - Thread-safe resource management and allocation'
            ],
            implementationNotes: {
              keyClasses: {
                'SingularUpdateQueue': 'Main queue class with single processing thread and concurrent submissions',
                'UpdateOperation': 'Structured operation with ID, type, data, completion source, and client info',
                'UpdateResult': 'Result structure with success status, sequence number, and processing timestamp',
                'QueueStatistics': 'Real-time statistics for monitoring queue health and performance'
              },
              coreFeatures: {
                'Single Thread Processing': 'Dedicated thread processes all operations sequentially using ConcurrentQueue',
                'Concurrent Submissions': 'Multiple clients can submit operations simultaneously without blocking',
                'Async Interface': 'TaskCompletionSource provides non-blocking async/await pattern for clients',
                'Operation Ordering': 'Sequential processing with sequence numbers ensures predictable ordering',
                'Error Isolation': 'Individual operation failures don\'t affect queue or other operations'
              },
              performanceCharacteristics: {
                'Throughput': '~64 operations per second sustained (100 ops in 1571ms)',
                'Latency': '15.71ms average per operation including processing time',
                'Concurrency': 'Supports unlimited concurrent client submissions',
                'Memory': 'Efficient queue management with zero backlog after processing',
                'Scalability': 'Single thread bottleneck but eliminates synchronization overhead'
              }
            }
          }
        },
        {
          id: 'request-pipeline',
          name: 'Request Pipeline',
          problem: 'How to improve throughput when processing multiple requests that have dependencies?',
          solution: 'Pipeline requests to allow multiple requests to be processed concurrently while maintaining order.',
          keyPoints: [
            'Overlaps request processing stages',
            'Maintains request ordering',
            'Improves overall throughput',
            'Handles backpressure gracefully'
          ],
          useCases: ['Database query processing', 'Network request handling', 'Batch processing'],
          implementation: `// Request Pipeline Implementation
class RequestPipeline {
  constructor(stages) {
    this.stages = stages;
    this.queues = stages.map(() => []);
    this.processing = stages.map(() => false);
  }

  async processRequest(request) {
    // Add to first stage
    this.queues[0].push(request);
    this.processStage(0);

    return request.promise;
  }

  async processStage(stageIndex) {
    if (this.processing[stageIndex] || this.queues[stageIndex].length === 0) {
      return;
    }

    this.processing[stageIndex] = true;

    while (this.queues[stageIndex].length > 0) {
      const request = this.queues[stageIndex].shift();

      try {
        const result = await this.stages[stageIndex](request);

        if (stageIndex < this.stages.length - 1) {
          // Move to next stage
          this.queues[stageIndex + 1].push({ ...request, result });
          this.processStage(stageIndex + 1);
        } else {
          // Final stage - resolve
          request.resolve(result);
        }
      } catch (error) {
        request.reject(error);
      }
    }

    this.processing[stageIndex] = false;
  }
}`,
          relatedPatterns: ['Request Batch', 'Request Waiting List', 'Singular Update Queue'],
          difficulty: 'Advanced',
          category: 'Communication',
          demoStatus: '✅ Successfully implemented and tested in C# - Full working demo available',
          notes: {
            csharpImplementation: {
              title: 'C# Implementation Reference - Production Ready',
              description: 'Complete working implementation with multi-stage pipeline and comprehensive performance analysis',
              location: 'RequestPipeline/ directory',
              keyFeatures: [
                'RequestPipeline.cs - Main pattern implementation with multi-stage processing',
                'Program.cs - Comprehensive demonstration with all test scenarios',
                'PipelineRequest & PipelineResult - Structured request/response handling',
                'Multi-stage pipeline with configurable concurrency per stage',
                'Overlapping execution across pipeline stages',
                'SemaphoreSlim-based concurrency control per stage',
                'Comprehensive request tracking and audit logging',
                'Stage-specific timeout handling and error isolation',
                'Real-time statistics and performance monitoring',
                'Graceful shutdown with proper resource disposal'
              ],
              demoResults: {
                sequentialRequests: 'Successfully processed 3 sequential requests with stage overlap demonstration',
                concurrentRequests: '5 concurrent requests processed with varying completion times (351-785ms)',
                pipelineOverlap: 'Mixed FAST/NORMAL/SLOW requests showing pipeline stage overlap benefits',
                errorHandling: 'Graceful handling of validation errors, processing errors, and timeouts',
                performanceTest: '20 concurrent requests completed in 1866ms (10.7 requests/second throughput)',
                stageTimings: 'Validation: 61.8ms, Authentication: 77.5ms, Processing: 81.2ms, Finalization: 31.0ms'
              },
              technicalDetails: {
                architecture: '4-stage pipeline: Validation → Authentication → Processing → Finalization',
                concurrency: 'Per-stage concurrency limits (Validation: 3, Authentication: 2, Processing: 1, Finalization: 4)',
                coordination: 'ConcurrentQueue between stages with SemaphoreSlim concurrency control',
                errorHandling: 'Individual request failures isolated, pipeline continues processing',
                performance: 'Average 1102ms per request with 10.7 requests/second sustained throughput'
              },
              bestPractices: [
                'Design stages with single responsibilities and appropriate concurrency',
                'Identify and optimize bottleneck stages (Processing stage with concurrency=1)',
                'Set appropriate timeouts per stage based on expected processing time',
                'Monitor queue lengths and stage utilization for performance tuning',
                'Implement comprehensive logging for request tracking and debugging',
                'Use async/await patterns throughout for non-blocking operations',
                'Design for graceful degradation and error isolation'
              ]
            },
            patternBenefits: {
              throughput: 'Multiple requests processed simultaneously across different pipeline stages',
              resourceUtilization: 'Each stage runs at optimal capacity with independent scaling',
              flexibility: 'Different concurrency levels per stage based on resource requirements',
              maintainability: 'Clear separation of processing concerns across stages',
              scalability: 'Individual stages can be scaled independently based on bottlenecks'
            },
            realWorldApplications: [
              'Web request processing - HTTP validation, authentication, business logic, response formatting',
              'Message processing - Message validation, routing, transformation, delivery',
              'Data processing pipelines - Data ingestion, validation, transformation, storage',
              'Image/video processing - Upload, validation, processing, thumbnail generation, storage',
              'Order processing - Validation, inventory check, payment processing, fulfillment',
              'ETL pipelines - Extract, transform, load operations with parallel processing',
              'API gateway - Rate limiting, authentication, routing, response transformation'
            ],
            implementationNotes: {
              keyClasses: {
                'RequestPipeline': 'Main pipeline coordinator with multi-stage processing and concurrency control',
                'PipelineRequest': 'Request structure with context, logging, and completion tracking',
                'PipelineResult': 'Result structure with success status, timing data, and stage breakdown',
                'PipelineStage': 'Stage configuration with processor function, concurrency, and timeout',
                'PipelineStatistics': 'Real-time statistics for monitoring pipeline health and performance'
              },
              coreFeatures: {
                'Multi-Stage Processing': 'Configurable pipeline stages with independent processors and concurrency',
                'Overlapping Execution': 'Different requests can be in different stages simultaneously',
                'Concurrency Control': 'SemaphoreSlim manages concurrent request processing per stage',
                'Request Ordering': 'FIFO queues between stages maintain submission order',
                'Error Isolation': 'Individual request failures don\'t affect pipeline or other requests'
              },
              performanceCharacteristics: {
                'Throughput': '10.7 requests per second sustained (20 requests in 1866ms)',
                'Latency': '1102ms average per request (range: 342-1865ms)',
                'Concurrency': 'Up to 10 concurrent requests across all stages simultaneously',
                'Bottleneck': 'Processing stage (concurrency=1) identified as primary bottleneck',
                'Efficiency': 'Stage overlap reduces overall processing time vs sequential processing'
              }
            }
          }
        },
        {
          id: 'request-batch',
          name: 'Request Batch',
          problem: 'How to improve efficiency when processing many small requests that can be grouped together?',
          solution: 'Collect multiple requests into batches and process them together to reduce overhead and improve throughput.',
          keyPoints: [
            'Groups multiple requests for efficiency',
            'Reduces per-request overhead',
            'Improves network and I/O utilization',
            'Configurable batch size and timeout'
          ],
          useCases: ['Database bulk operations', 'Network request batching', 'Log aggregation'],
          implementation: `// Request Batch Implementation
class RequestBatch {
  constructor(maxBatchSize = 100, maxWaitTime = 50) {
    this.maxBatchSize = maxBatchSize;
    this.maxWaitTime = maxWaitTime;
    this.currentBatch = [];
    this.batchTimer = null;
  }

  async addRequest(request) {
    return new Promise((resolve, reject) => {
      this.currentBatch.push({
        request,
        resolve,
        reject,
        timestamp: Date.now()
      });

      // Process batch if it's full
      if (this.currentBatch.length >= this.maxBatchSize) {
        this.processBatch();
      } else if (this.batchTimer === null) {
        // Start timer for partial batch
        this.batchTimer = setTimeout(() => {
          this.processBatch();
        }, this.maxWaitTime);
      }
    });
  }

  async processBatch() {
    if (this.currentBatch.length === 0) return;

    // Clear timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    const batch = this.currentBatch;
    this.currentBatch = [];

    try {
      // Process all requests in the batch
      const requests = batch.map(item => item.request);
      const results = await this.processBatchRequests(requests);

      // Resolve individual promises
      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      // Reject all promises in case of batch failure
      batch.forEach(item => {
        item.reject(error);
      });
    }
  }

  async processBatchRequests(requests) {
    // Implement batch processing logic
    return Promise.all(requests.map(req => this.processRequest(req)));
  }

  async processRequest(request) {
    // Individual request processing
    return { result: \`Processed: \${request.data}\` };
  }
}`,
          relatedPatterns: ['Request Pipeline', 'Request Waiting List', 'Singular Update Queue'],
          difficulty: 'Intermediate',
          category: 'Communication'
        },
        {
          id: 'request-waiting-list',
          name: 'Request Waiting List',
          problem: 'How to handle requests when the system is temporarily unavailable or overloaded?',
          solution: 'Queue incoming requests in a waiting list and process them when the system becomes available.',
          keyPoints: [
            'Queues requests during unavailability',
            'Prevents request loss during outages',
            'Implements backpressure handling',
            'Supports priority-based processing'
          ],
          useCases: ['System maintenance windows', 'Overload protection', 'Circuit breaker pattern'],
          implementation: `// Request Waiting List Implementation
class RequestWaitingList {
  constructor(maxQueueSize = 1000) {
    this.maxQueueSize = maxQueueSize;
    this.waitingQueue = [];
    this.isProcessing = false;
    this.systemAvailable = true;
  }

  async submitRequest(request, priority = 0) {
    if (this.systemAvailable && this.waitingQueue.length === 0) {
      return this.processRequest(request);
    }

    // Add to waiting list
    return new Promise((resolve, reject) => {
      if (this.waitingQueue.length >= this.maxQueueSize) {
        reject(new Error('Queue is full'));
        return;
      }

      const queueItem = {
        request,
        resolve,
        reject,
        priority,
        timestamp: Date.now()
      };

      // Insert based on priority
      this.insertByPriority(queueItem);

      // Start processing if system becomes available
      if (this.systemAvailable && !this.isProcessing) {
        this.processWaitingList();
      }
    });
  }

  insertByPriority(item) {
    let inserted = false;
    for (let i = 0; i < this.waitingQueue.length; i++) {
      if (this.waitingQueue[i].priority < item.priority) {
        this.waitingQueue.splice(i, 0, item);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      this.waitingQueue.push(item);
    }
  }

  async processWaitingList() {
    if (this.isProcessing || !this.systemAvailable) return;

    this.isProcessing = true;

    while (this.waitingQueue.length > 0 && this.systemAvailable) {
      const item = this.waitingQueue.shift();

      try {
        const result = await this.processRequest(item.request);
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }
    }

    this.isProcessing = false;
  }

  setSystemAvailability(available) {
    this.systemAvailable = available;

    if (available && !this.isProcessing) {
      this.processWaitingList();
    }
  }

  async processRequest(request) {
    // Simulate request processing
    await new Promise(resolve => setTimeout(resolve, 10));
    return { result: \`Processed: \${request.data}\` };
  }
}`,
          relatedPatterns: ['Request Batch', 'Request Pipeline', 'Circuit Breaker'],
          difficulty: 'Intermediate',
          category: 'Communication'
        }
      ]
    },
    timing: {
      title: "⏰ Timing & Synchronization",
      description: "Patterns for handling time and synchronization in distributed systems",
      patterns: [
        {
          id: 'clock-bound-wait',
          name: 'Clock-Bound Wait',
          problem: 'How to handle clock uncertainty when reading/writing timestamped values across cluster nodes?',
          solution: 'Wait until clock values on all nodes are guaranteed to be above the timestamp before proceeding.',
          keyPoints: [
            'Accounts for maximum clock offset',
            'Ensures external consistency',
            'Prevents reading stale data',
            'Adds controlled latency for correctness'
          ],
          useCases: ['Distributed databases', 'Timestamp-based versioning', 'Global consistency'],
          implementation: `// Clock-Bound Wait Implementation
class ClockBoundWait {
  constructor(maxClockOffset = 10) { // 10ms default
    this.maxClockOffset = maxClockOffset;
  }
  
  async writeWithTimestamp(key, value, timestamp) {
    // Wait for clock uncertainty
    const waitUntil = timestamp + this.maxClockOffset;
    const currentTime = Date.now();
    
    if (currentTime < waitUntil) {
      await this.sleep(waitUntil - currentTime);
    }
    
    // Now safe to write
    return this.store.write(key, value, timestamp);
  }
  
  async readWithTimestamp(timestamp) {
    // Ensure we don't read before timestamp is safe
    const waitUntil = timestamp + this.maxClockOffset;
    const currentTime = Date.now();
    
    if (currentTime < waitUntil) {
      await this.sleep(waitUntil - currentTime);
    }
    
    return this.store.read(timestamp);
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}`,
          relatedPatterns: ['Hybrid Clock', 'Lamport Clock', 'Versioned Value'],
          difficulty: 'Advanced',
          category: 'Timing'
        },
        {
          id: 'lamport-clock',
          name: 'Lamport Clock',
          problem: 'How to order events in a distributed system without synchronized physical clocks?',
          solution: 'Use logical timestamps that increment with each event and update based on message exchanges.',
          keyPoints: [
            'Logical time ordering',
            'Happens-before relationship',
            'No need for synchronized clocks',
            'Partial ordering of events'
          ],
          useCases: ['Event ordering', 'Causal consistency', 'Distributed debugging'],
          implementation: `// Lamport Clock Implementation
class LamportClock {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.time = 0;
  }
  
  tick() {
    this.time += 1;
    return this.time;
  }
  
  sendMessage(message) {
    const timestamp = this.tick();
    return {
      ...message,
      timestamp,
      nodeId: this.nodeId
    };
  }
  
  receiveMessage(message) {
    // Update clock based on received message
    this.time = Math.max(this.time, message.timestamp) + 1;
    
    return {
      ...message,
      receivedAt: this.time
    };
  }
  
  compare(event1, event2) {
    if (event1.timestamp < event2.timestamp) return -1;
    if (event1.timestamp > event2.timestamp) return 1;
    
    // If timestamps equal, use node ID for total ordering
    if (event1.nodeId < event2.nodeId) return -1;
    if (event1.nodeId > event2.nodeId) return 1;
    
    return 0;
  }
}`,
          relatedPatterns: ['Hybrid Clock', 'Vector Clock', 'Happened-Before'],
          difficulty: 'Intermediate',
          category: 'Timing'
        },
        {
          id: 'hybrid-clock',
          name: 'Hybrid Clock',
          problem: 'How to combine benefits of physical and logical clocks for better event ordering?',
          solution: 'Combine physical timestamps with logical counters to get both wall-clock time and causal ordering.',
          keyPoints: [
            'Combines physical and logical time',
            'Preserves wall-clock ordering when possible',
            'Handles clock skew gracefully',
            'Better than pure logical clocks for debugging'
          ],
          useCases: ['Distributed databases', 'Event sourcing', 'Conflict resolution'],
          implementation: `// Hybrid Clock Implementation
class HybridClock {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.logicalTime = 0;
    this.lastPhysicalTime = 0;
  }
  
  now() {
    const physicalTime = Date.now();
    
    if (physicalTime > this.lastPhysicalTime) {
      this.lastPhysicalTime = physicalTime;
      this.logicalTime = 0;
    } else {
      this.logicalTime += 1;
    }
    
    return {
      physical: this.lastPhysicalTime,
      logical: this.logicalTime,
      nodeId: this.nodeId
    };
  }
  
  update(remoteTimestamp) {
    const physicalTime = Date.now();
    const maxPhysical = Math.max(physicalTime, remoteTimestamp.physical);
    
    if (maxPhysical === this.lastPhysicalTime) {
      this.logicalTime = Math.max(this.logicalTime, remoteTimestamp.logical) + 1;
    } else if (maxPhysical === physicalTime) {
      this.lastPhysicalTime = physicalTime;
      this.logicalTime = Math.max(0, remoteTimestamp.logical + 1);
    } else {
      this.lastPhysicalTime = remoteTimestamp.physical;
      this.logicalTime = remoteTimestamp.logical + 1;
    }
    
    return this.now();
  }
  
  compare(ts1, ts2) {
    if (ts1.physical !== ts2.physical) {
      return ts1.physical - ts2.physical;
    }
    if (ts1.logical !== ts2.logical) {
      return ts1.logical - ts2.logical;
    }
    return ts1.nodeId.localeCompare(ts2.nodeId);
  }
}`,
          relatedPatterns: ['Lamport Clock', 'Clock-Bound Wait', 'Versioned Value'],
          difficulty: 'Advanced',
          category: 'Timing'
        },
        {
          id: 'generation-clock',
          name: 'Generation Clock',
          problem: 'How to detect stale data and ensure clients read the most recent version after leader changes?',
          solution: 'Use a generation number that increments with each leader election to detect stale reads.',
          keyPoints: [
            'Increments with each leader election',
            'Detects stale data from old leaders',
            'Ensures read-after-write consistency',
            'Simple integer-based versioning'
          ],
          useCases: ['Leader election', 'Stale read detection', 'Data versioning'],
          implementation: `// Generation Clock Implementation
class GenerationClock {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.generation = 0;
    this.isLeader = false;
    this.lastKnownLeaderGeneration = 0;
  }

  becomeLeader() {
    this.generation += 1;
    this.isLeader = true;
    this.lastKnownLeaderGeneration = this.generation;

    console.log(\`Node \${this.nodeId} became leader with generation \${this.generation}\`);
    return this.generation;
  }

  stepDown() {
    this.isLeader = false;
    console.log(\`Node \${this.nodeId} stepped down from leadership\`);
  }

  writeData(key, value) {
    if (!this.isLeader) {
      throw new Error('Only leader can write data');
    }

    const record = {
      key,
      value,
      generation: this.generation,
      timestamp: Date.now(),
      leaderId: this.nodeId
    };

    return this.persistRecord(record);
  }

  readData(key, clientGeneration = 0) {
    const record = this.getRecord(key);

    if (!record) {
      return null;
    }

    // Check if client has stale generation
    if (clientGeneration > 0 && record.generation < clientGeneration) {
      throw new Error(\`Stale read detected. Record generation: \${record.generation}, Client expected: \${clientGeneration}\`);
    }

    return {
      ...record,
      isStale: record.generation < this.lastKnownLeaderGeneration
    };
  }

  updateLeaderGeneration(leaderGeneration) {
    if (leaderGeneration > this.lastKnownLeaderGeneration) {
      this.lastKnownLeaderGeneration = leaderGeneration;

      // Step down if we're leader but see higher generation
      if (this.isLeader && leaderGeneration > this.generation) {
        this.stepDown();
      }
    }
  }

  getCurrentGeneration() {
    return this.generation;
  }

  getLastKnownLeaderGeneration() {
    return this.lastKnownLeaderGeneration;
  }

  persistRecord(record) {
    // Persist to storage
    return record;
  }

  getRecord(key) {
    // Retrieve from storage
    return null;
  }
}`,
          relatedPatterns: ['Leader Follower', 'Emergent Leader', 'Hybrid Clock'],
          difficulty: 'Intermediate',
          category: 'Timing'
        },
        {
          id: 'heartbeat',
          name: 'Heartbeat',
          problem: 'How to detect if a node in a distributed system has failed or become unresponsive?',
          solution: 'Send periodic heartbeat messages between nodes to detect failures and maintain cluster membership.',
          keyPoints: [
            'Periodic health check messages',
            'Configurable timeout intervals',
            'Failure detection mechanism',
            'Cluster membership management'
          ],
          useCases: ['Failure detection', 'Cluster membership', 'Load balancer health checks'],
          implementation: `// Heartbeat Implementation
class HeartbeatManager {
  constructor(nodeId, heartbeatInterval = 1000, timeoutThreshold = 3000) {
    this.nodeId = nodeId;
    this.heartbeatInterval = heartbeatInterval;
    this.timeoutThreshold = timeoutThreshold;
    this.peers = new Map();
    this.heartbeatTimer = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startHeartbeatTimer();
    console.log(\`Heartbeat manager started for node \${this.nodeId}\`);
  }

  stop() {
    this.isRunning = false;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    console.log(\`Heartbeat manager stopped for node \${this.nodeId}\`);
  }

  addPeer(peerId, address) {
    this.peers.set(peerId, {
      id: peerId,
      address,
      lastHeartbeat: Date.now(),
      isAlive: true,
      consecutiveFailures: 0
    });
  }

  removePeer(peerId) {
    this.peers.delete(peerId);
  }

  startHeartbeatTimer() {
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeats();
      this.checkPeerHealth();
    }, this.heartbeatInterval);
  }

  async sendHeartbeats() {
    const heartbeatMessage = {
      type: 'HEARTBEAT',
      from: this.nodeId,
      timestamp: Date.now(),
      sequence: this.getNextSequence()
    };

    for (const [peerId, peer] of this.peers) {
      try {
        await this.sendMessage(peer.address, heartbeatMessage);
      } catch (error) {
        console.warn(\`Failed to send heartbeat to \${peerId}:\`, error.message);
      }
    }
  }

  receiveHeartbeat(message) {
    const peer = this.peers.get(message.from);
    if (peer) {
      peer.lastHeartbeat = Date.now();
      peer.isAlive = true;
      peer.consecutiveFailures = 0;

      // Send heartbeat response
      this.sendHeartbeatResponse(message.from);
    }
  }

  checkPeerHealth() {
    const now = Date.now();

    for (const [peerId, peer] of this.peers) {
      const timeSinceLastHeartbeat = now - peer.lastHeartbeat;

      if (timeSinceLastHeartbeat > this.timeoutThreshold) {
        peer.consecutiveFailures += 1;

        if (peer.isAlive) {
          peer.isAlive = false;
          this.onPeerFailure(peerId, peer);
        }
      }
    }
  }

  onPeerFailure(peerId, peer) {
    console.warn(\`Peer \${peerId} detected as failed after \${peer.consecutiveFailures} consecutive failures\`);

    // Notify failure handlers
    this.notifyFailureHandlers(peerId, peer);
  }

  getAliveNodes() {
    return Array.from(this.peers.values()).filter(peer => peer.isAlive);
  }

  getFailedNodes() {
    return Array.from(this.peers.values()).filter(peer => !peer.isAlive);
  }

  async sendMessage(address, message) {
    // Implement network communication
    return Promise.resolve();
  }

  sendHeartbeatResponse(peerId) {
    // Send response back to peer
  }

  getNextSequence() {
    return Date.now();
  }

  notifyFailureHandlers(peerId, peer) {
    // Notify registered failure handlers
  }
}`,
          relatedPatterns: ['Leader Follower', 'Emergent Leader', 'Gossip Dissemination'],
          difficulty: 'Beginner',
          category: 'Timing'
        }
      ]
    },
    consensus: {
      title: "🤝 Consensus & Leadership",
      description: "Patterns for achieving agreement and leadership in distributed systems",
      patterns: [
        {
          id: 'leader-follower',
          name: 'Leader Follower',
          problem: 'How to coordinate updates across multiple nodes while maintaining consistency?',
          solution: 'Designate one node as leader to handle all writes, with followers replicating the changes.',
          keyPoints: [
            'Single point of coordination',
            'Leader handles all writes',
            'Followers replicate changes',
            'Provides strong consistency'
          ],
          useCases: ['Database replication', 'Distributed consensus', 'State machine replication'],
          implementation: `// Leader Follower Implementation
class LeaderFollower {
  constructor(nodeId, nodes) {
    this.nodeId = nodeId;
    this.nodes = nodes;
    this.isLeader = false;
    this.currentTerm = 0;
    this.log = [];
    this.followers = new Set();
  }

  async becomeLeader() {
    this.isLeader = true;
    this.currentTerm += 1;

    // Send heartbeats to establish leadership
    for (const node of this.nodes) {
      if (node !== this.nodeId) {
        await this.sendHeartbeat(node);
      }
    }
  }

  async appendEntry(entry) {
    if (!this.isLeader) {
      throw new Error('Only leader can append entries');
    }

    const logEntry = {
      term: this.currentTerm,
      index: this.log.length,
      data: entry,
      timestamp: Date.now()
    };

    this.log.push(logEntry);

    // Replicate to followers
    const promises = Array.from(this.followers).map(follower =>
      this.replicateToFollower(follower, logEntry)
    );

    // Wait for majority acknowledgment
    const responses = await Promise.allSettled(promises);
    const successCount = responses.filter(r => r.status === 'fulfilled').length;

    if (successCount >= Math.floor(this.followers.size / 2)) {
      return { success: true, index: logEntry.index };
    } else {
      throw new Error('Failed to achieve majority consensus');
    }
  }

  async replicateToFollower(follower, entry) {
    // Send entry to follower and wait for acknowledgment
    return this.sendMessage(follower, {
      type: 'APPEND_ENTRY',
      entry,
      term: this.currentTerm,
      leaderId: this.nodeId
    });
  }
}`,
          relatedPatterns: ['Emergent Leader', 'Majority Quorum', 'Heartbeat'],
          difficulty: 'Intermediate',
          category: 'Consensus'
        },
        {
          id: 'emergent-leader',
          name: 'Emergent Leader',
          problem: 'How to elect a leader when the current leader fails or when starting a new cluster?',
          solution: 'Use an election algorithm where nodes vote for themselves or others to emerge as the new leader.',
          keyPoints: [
            'Democratic leader election',
            'Handles leader failures',
            'Prevents split-brain scenarios',
            'Uses voting mechanisms'
          ],
          useCases: ['Leader election', 'Fault tolerance', 'Cluster coordination'],
          implementation: `// Emergent Leader Implementation (Raft-style)
class EmergentLeader {
  constructor(nodeId, nodes) {
    this.nodeId = nodeId;
    this.nodes = nodes;
    this.state = 'FOLLOWER'; // FOLLOWER, CANDIDATE, LEADER
    this.currentTerm = 0;
    this.votedFor = null;
    this.votes = new Set();
    this.electionTimeout = null;
  }

  startElection() {
    this.state = 'CANDIDATE';
    this.currentTerm += 1;
    this.votedFor = this.nodeId;
    this.votes.clear();
    this.votes.add(this.nodeId);

    // Request votes from other nodes
    for (const node of this.nodes) {
      if (node !== this.nodeId) {
        this.requestVote(node);
      }
    }

    // Set election timeout
    this.resetElectionTimeout();
  }

  async requestVote(nodeId) {
    const response = await this.sendMessage(nodeId, {
      type: 'VOTE_REQUEST',
      term: this.currentTerm,
      candidateId: this.nodeId,
      lastLogIndex: this.log.length - 1,
      lastLogTerm: this.getLastLogTerm()
    });

    if (response.voteGranted) {
      this.votes.add(nodeId);

      // Check if we have majority
      if (this.votes.size > Math.floor(this.nodes.length / 2)) {
        this.becomeLeader();
      }
    }
  }

  handleVoteRequest(request) {
    if (request.term > this.currentTerm) {
      this.currentTerm = request.term;
      this.votedFor = null;
      this.state = 'FOLLOWER';
    }

    const voteGranted = (
      request.term >= this.currentTerm &&
      (this.votedFor === null || this.votedFor === request.candidateId) &&
      this.isLogUpToDate(request.lastLogIndex, request.lastLogTerm)
    );

    if (voteGranted) {
      this.votedFor = request.candidateId;
      this.resetElectionTimeout();
    }

    return { voteGranted, term: this.currentTerm };
  }

  becomeLeader() {
    this.state = 'LEADER';
    this.clearElectionTimeout();

    // Send heartbeats to maintain leadership
    this.startHeartbeats();
  }

  resetElectionTimeout() {
    this.clearElectionTimeout();
    const timeout = 150 + Math.random() * 150; // 150-300ms
    this.electionTimeout = setTimeout(() => {
      if (this.state !== 'LEADER') {
        this.startElection();
      }
    }, timeout);
  }
}`,
          relatedPatterns: ['Leader Follower', 'Majority Quorum', 'Generation Clock'],
          difficulty: 'Advanced',
          category: 'Consensus'
        },
        {
          id: 'majority-quorum',
          name: 'Majority Quorum',
          problem: 'How to ensure consistency when some nodes might be unavailable or partitioned?',
          solution: 'Require majority of nodes to agree before committing any operation to ensure consistency.',
          keyPoints: [
            'Requires majority agreement',
            'Tolerates minority failures',
            'Prevents split-brain',
            'Ensures strong consistency'
          ],
          useCases: ['Distributed consensus', 'Configuration management', 'Leader election'],
          implementation: `// Majority Quorum Implementation
class MajorityQuorum {
  constructor(nodeId, nodes) {
    this.nodeId = nodeId;
    this.nodes = nodes;
    this.quorumSize = Math.floor(nodes.length / 2) + 1;
    this.pendingOperations = new Map();
  }

  async executeOperation(operation) {
    const operationId = this.generateOperationId();
    const proposal = {
      id: operationId,
      operation,
      timestamp: Date.now(),
      proposer: this.nodeId
    };

    // Store pending operation
    this.pendingOperations.set(operationId, {
      proposal,
      votes: new Set([this.nodeId]),
      responses: new Map()
    });

    // Send proposal to all nodes
    const promises = this.nodes
      .filter(node => node !== this.nodeId)
      .map(node => this.sendProposal(node, proposal));

    try {
      const responses = await Promise.allSettled(promises);
      return this.processResponses(operationId, responses);
    } catch (error) {
      this.pendingOperations.delete(operationId);
      throw error;
    }
  }

  async sendProposal(nodeId, proposal) {
    const response = await this.sendMessage(nodeId, {
      type: 'PROPOSAL',
      proposal
    });

    return { nodeId, response };
  }

  processResponses(operationId, responses) {
    const pending = this.pendingOperations.get(operationId);
    if (!pending) return null;

    // Count successful responses
    responses.forEach(result => {
      if (result.status === 'fulfilled' && result.value.response.accepted) {
        pending.votes.add(result.value.nodeId);
        pending.responses.set(result.value.nodeId, result.value.response);
      }
    });

    // Check if we have quorum
    if (pending.votes.size >= this.quorumSize) {
      // Execute operation
      const result = this.applyOperation(pending.proposal.operation);

      // Notify all nodes of commitment
      this.broadcastCommit(operationId, result);

      this.pendingOperations.delete(operationId);
      return result;
    } else {
      this.pendingOperations.delete(operationId);
      throw new Error('Failed to achieve quorum');
    }
  }

  handleProposal(proposal) {
    // Validate proposal
    if (this.isValidProposal(proposal)) {
      return { accepted: true, nodeId: this.nodeId };
    } else {
      return { accepted: false, reason: 'Invalid proposal' };
    }
  }

  isValidProposal(proposal) {
    // Add validation logic here
    return proposal && proposal.operation && proposal.proposer;
  }

  applyOperation(operation) {
    // Apply the operation to local state
    return this.executeLocalOperation(operation);
  }
}`,
          relatedPatterns: ['Leader Follower', 'Paxos', 'Consistent Core'],
          difficulty: 'Advanced',
          category: 'Consensus'
        },
        {
          id: 'paxos',
          name: 'Paxos',
          problem: 'How to achieve consensus in a distributed system where nodes can fail and messages can be lost?',
          solution: 'Use a multi-phase protocol with proposers, acceptors, and learners to reach agreement on values.',
          keyPoints: [
            'Multi-phase consensus protocol',
            'Tolerates node failures and message loss',
            'Guarantees safety and liveness',
            'Forms basis for many distributed systems'
          ],
          useCases: ['Distributed consensus', 'Configuration management', 'State machine replication'],
          implementation: `// Simplified Paxos Implementation
class PaxosNode {
  constructor(nodeId, nodes) {
    this.nodeId = nodeId;
    this.nodes = nodes;
    this.proposalNumber = 0;
    this.acceptedProposal = null;
    this.acceptedValue = null;
    this.promisedProposal = null;
  }

  // Phase 1: Prepare
  async propose(value) {
    this.proposalNumber += 1;
    const proposalId = \`\${this.proposalNumber}-\${this.nodeId}\`;

    console.log(\`Proposing value "\${value}" with proposal \${proposalId}\`);

    // Send prepare requests to majority of acceptors
    const preparePromises = this.nodes.map(node =>
      this.sendPrepare(node, proposalId)
    );

    const prepareResponses = await Promise.allSettled(preparePromises);
    const successfulResponses = prepareResponses
      .filter(r => r.status === 'fulfilled' && r.value.promised)
      .map(r => r.value);

    // Check if we have majority
    if (successfulResponses.length <= Math.floor(this.nodes.length / 2)) {
      throw new Error('Failed to get majority in prepare phase');
    }

    // Phase 2: Accept
    // Use highest-numbered accepted value, or our value if none
    let valueToPropose = value;
    let highestAcceptedProposal = -1;

    for (const response of successfulResponses) {
      if (response.acceptedProposal &&
          this.compareProposals(response.acceptedProposal, highestAcceptedProposal) > 0) {
        highestAcceptedProposal = response.acceptedProposal;
        valueToPropose = response.acceptedValue;
      }
    }

    // Send accept requests
    const acceptPromises = this.nodes.map(node =>
      this.sendAccept(node, proposalId, valueToPropose)
    );

    const acceptResponses = await Promise.allSettled(acceptPromises);
    const acceptedCount = acceptResponses
      .filter(r => r.status === 'fulfilled' && r.value.accepted)
      .length;

    if (acceptedCount <= Math.floor(this.nodes.length / 2)) {
      throw new Error('Failed to get majority in accept phase');
    }

    console.log(\`Consensus reached on value: \${valueToPropose}\`);
    return valueToPropose;
  }

  // Acceptor: Handle prepare request
  handlePrepare(proposalId) {
    if (!this.promisedProposal ||
        this.compareProposals(proposalId, this.promisedProposal) > 0) {

      this.promisedProposal = proposalId;

      return {
        promised: true,
        acceptedProposal: this.acceptedProposal,
        acceptedValue: this.acceptedValue
      };
    }

    return { promised: false };
  }

  // Acceptor: Handle accept request
  handleAccept(proposalId, value) {
    if (!this.promisedProposal ||
        this.compareProposals(proposalId, this.promisedProposal) >= 0) {

      this.acceptedProposal = proposalId;
      this.acceptedValue = value;

      return { accepted: true };
    }

    return { accepted: false };
  }

  compareProposals(proposal1, proposal2) {
    if (!proposal2) return 1;
    if (!proposal1) return -1;

    const [num1, node1] = proposal1.split('-');
    const [num2, node2] = proposal2.split('-');

    if (parseInt(num1) !== parseInt(num2)) {
      return parseInt(num1) - parseInt(num2);
    }

    return node1.localeCompare(node2);
  }

  async sendPrepare(node, proposalId) {
    // Simulate network call
    return node.handlePrepare(proposalId);
  }

  async sendAccept(node, proposalId, value) {
    // Simulate network call
    return node.handleAccept(proposalId, value);
  }
}`,
          relatedPatterns: ['Majority Quorum', 'Leader Follower', 'Consistent Core'],
          difficulty: 'Expert',
          category: 'Consensus'
        },
        {
          id: 'consistent-core',
          name: 'Consistent Core',
          problem: 'How to maintain strong consistency for critical metadata while allowing eventual consistency for other data?',
          solution: 'Use a small cluster of nodes to maintain strongly consistent core data, with larger clusters for eventually consistent data.',
          keyPoints: [
            'Small cluster for critical metadata',
            'Strong consistency for core operations',
            'Eventual consistency for bulk data',
            'Reduces coordination overhead'
          ],
          useCases: ['Metadata management', 'Configuration storage', 'Cluster coordination'],
          implementation: `// Consistent Core Implementation
class ConsistentCore {
  constructor(coreNodes, dataNodes) {
    this.coreNodes = coreNodes; // Small set for consistency
    this.dataNodes = dataNodes; // Larger set for data
    this.metadata = new Map();
    this.isCoreMember = coreNodes.includes(this.nodeId);
  }

  // Core operations - strongly consistent
  async updateMetadata(key, value) {
    if (!this.isCoreMember) {
      throw new Error('Only core members can update metadata');
    }

    // Use consensus among core nodes
    const proposal = {
      type: 'METADATA_UPDATE',
      key,
      value,
      timestamp: Date.now()
    };

    const consensus = await this.reachCoreConsensus(proposal);
    if (consensus.success) {
      this.metadata.set(key, value);

      // Propagate to data nodes eventually
      this.propagateToDataNodes(key, value);

      return { success: true, value };
    }

    throw new Error('Failed to reach consensus on metadata update');
  }

  async getMetadata(key) {
    // Always read from core for consistency
    if (this.isCoreMember) {
      return this.metadata.get(key);
    }

    // Non-core nodes query core
    return this.queryCore(key);
  }

  // Data operations - eventually consistent
  async storeData(key, data) {
    // Check metadata constraints
    const constraints = await this.getMetadata(\`constraints:\${key}\`);
    if (constraints && !this.validateConstraints(data, constraints)) {
      throw new Error('Data violates metadata constraints');
    }

    // Store on multiple data nodes
    const replicas = this.selectDataReplicas(key);
    const promises = replicas.map(node =>
      this.storeOnNode(node, key, data)
    );

    // Wait for majority
    const results = await Promise.allSettled(promises);
    const successCount = results.filter(r => r.status === 'fulfilled').length;

    if (successCount >= Math.ceil(replicas.length / 2)) {
      return { success: true, replicas: successCount };
    }

    throw new Error('Failed to store data on majority of replicas');
  }

  async getData(key) {
    // Read from any available replica
    const replicas = this.selectDataReplicas(key);

    for (const node of replicas) {
      try {
        const data = await this.readFromNode(node, key);
        if (data) return data;
      } catch (error) {
        console.warn(\`Failed to read from \${node}:\`, error.message);
      }
    }

    return null;
  }

  async reachCoreConsensus(proposal) {
    // Implement consensus algorithm among core nodes
    const votes = await Promise.allSettled(
      this.coreNodes.map(node => this.sendProposal(node, proposal))
    );

    const approvals = votes.filter(v =>
      v.status === 'fulfilled' && v.value.approved
    ).length;

    return {
      success: approvals > Math.floor(this.coreNodes.length / 2),
      approvals
    };
  }

  propagateToDataNodes(key, value) {
    // Asynchronously propagate metadata to data nodes
    this.dataNodes.forEach(node => {
      this.sendMetadataUpdate(node, key, value).catch(error => {
        console.warn(\`Failed to propagate to \${node}:\`, error.message);
      });
    });
  }

  selectDataReplicas(key) {
    // Select subset of data nodes for this key
    const hash = this.hashKey(key);
    const replicationFactor = 3;

    return this.dataNodes
      .sort((a, b) => this.hashKey(a + key) - this.hashKey(b + key))
      .slice(0, replicationFactor);
  }

  validateConstraints(data, constraints) {
    // Validate data against metadata constraints
    return true;
  }

  hashKey(key) {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash);
  }
}`,
          relatedPatterns: ['Majority Quorum', 'Paxos', 'Leader Follower'],
          difficulty: 'Advanced',
          category: 'Consensus'
        }
      ]
    },
    storage: {
      title: "💾 Storage & Persistence",
      description: "Patterns for reliable data storage and persistence in distributed systems",
      patterns: [
        {
          id: 'replicated-log',
          name: 'Replicated Log',
          problem: 'How to maintain consistent ordering of operations across multiple nodes?',
          solution: 'Maintain an ordered log of operations that is replicated across all nodes in the same order.',
          keyPoints: [
            'Ordered sequence of operations',
            'Replicated across all nodes',
            'Ensures consistent state',
            'Supports replay and recovery'
          ],
          useCases: ['State machine replication', 'Event sourcing', 'Database replication'],
          implementation: `// Replicated Log Implementation
class ReplicatedLog {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.log = [];
    this.commitIndex = -1;
    this.lastApplied = -1;
    this.nextIndex = new Map();
    this.matchIndex = new Map();
  }

  async appendEntry(entry) {
    const logEntry = {
      term: this.currentTerm,
      index: this.log.length,
      data: entry,
      timestamp: Date.now()
    };

    this.log.push(logEntry);

    // Replicate to followers
    if (this.isLeader) {
      await this.replicateToFollowers(logEntry);
    }

    return logEntry.index;
  }

  async replicateToFollowers(entry) {
    const promises = this.followers.map(async (follower) => {
      const nextIndex = this.nextIndex.get(follower) || 0;
      const prevLogIndex = nextIndex - 1;
      const prevLogTerm = prevLogIndex >= 0 ? this.log[prevLogIndex].term : 0;

      const request = {
        term: this.currentTerm,
        leaderId: this.nodeId,
        prevLogIndex,
        prevLogTerm,
        entries: this.log.slice(nextIndex),
        leaderCommit: this.commitIndex
      };

      try {
        const response = await this.sendAppendEntries(follower, request);

        if (response.success) {
          this.nextIndex.set(follower, this.log.length);
          this.matchIndex.set(follower, this.log.length - 1);
        } else {
          // Decrement nextIndex and retry
          const currentNext = this.nextIndex.get(follower) || 0;
          this.nextIndex.set(follower, Math.max(0, currentNext - 1));
        }

        return response;
      } catch (error) {
        console.error(\`Failed to replicate to \${follower}:\`, error);
        return { success: false, error };
      }
    });

    const responses = await Promise.allSettled(promises);

    // Update commit index if majority succeeded
    this.updateCommitIndex();

    return responses;
  }

  handleAppendEntries(request) {
    // Reset election timeout
    this.resetElectionTimeout();

    // Check term
    if (request.term < this.currentTerm) {
      return { success: false, term: this.currentTerm };
    }

    // Check log consistency
    if (request.prevLogIndex >= 0) {
      if (this.log.length <= request.prevLogIndex ||
          this.log[request.prevLogIndex].term !== request.prevLogTerm) {
        return { success: false, term: this.currentTerm };
      }
    }

    // Append new entries
    if (request.entries.length > 0) {
      // Remove conflicting entries
      this.log = this.log.slice(0, request.prevLogIndex + 1);

      // Append new entries
      this.log.push(...request.entries);
    }

    // Update commit index
    if (request.leaderCommit > this.commitIndex) {
      this.commitIndex = Math.min(request.leaderCommit, this.log.length - 1);
      this.applyCommittedEntries();
    }

    return { success: true, term: this.currentTerm };
  }

  updateCommitIndex() {
    // Find highest index replicated on majority
    for (let i = this.log.length - 1; i > this.commitIndex; i--) {
      if (this.log[i].term === this.currentTerm) {
        let replicationCount = 1; // Count self

        for (const matchIndex of this.matchIndex.values()) {
          if (matchIndex >= i) {
            replicationCount++;
          }
        }

        if (replicationCount > Math.floor(this.followers.length / 2)) {
          this.commitIndex = i;
          this.applyCommittedEntries();
          break;
        }
      }
    }
  }

  applyCommittedEntries() {
    while (this.lastApplied < this.commitIndex) {
      this.lastApplied++;
      const entry = this.log[this.lastApplied];
      this.applyToStateMachine(entry.data);
    }
  }
}`,
          relatedPatterns: ['Leader Follower', 'Segmented Log', 'Write-Ahead Log'],
          difficulty: 'Advanced',
          category: 'Storage'
        },
        {
          id: 'segmented-log',
          name: 'Segmented Log',
          problem: 'How to manage large log files efficiently and enable parallel processing and cleanup?',
          solution: 'Split the log into multiple segments based on size or time, allowing independent processing and cleanup.',
          keyPoints: [
            'Divides log into manageable segments',
            'Enables parallel processing',
            'Facilitates log cleanup and archival',
            'Improves performance and scalability'
          ],
          useCases: ['Log management', 'Event streaming', 'Database write-ahead logs'],
          implementation: `// Segmented Log Implementation
class SegmentedLog {
  constructor(segmentSize = 1024 * 1024, maxSegments = 100) {
    this.segmentSize = segmentSize;
    this.maxSegments = maxSegments;
    this.segments = [];
    this.currentSegment = this.createNewSegment();
    this.nextOffset = 0;
  }

  append(data) {
    const entry = {
      offset: this.nextOffset++,
      timestamp: Date.now(),
      data: data,
      size: this.calculateSize(data)
    };

    // Check if current segment is full
    if (this.currentSegment.size + entry.size > this.segmentSize) {
      this.rolloverSegment();
    }

    this.currentSegment.entries.push(entry);
    this.currentSegment.size += entry.size;
    this.currentSegment.lastOffset = entry.offset;

    return entry.offset;
  }

  read(offset) {
    // Find the segment containing this offset
    const segment = this.findSegmentForOffset(offset);
    if (!segment) {
      throw new Error(\`Offset \${offset} not found\`);
    }

    // Find entry in segment
    const entry = segment.entries.find(e => e.offset === offset);
    if (!entry) {
      throw new Error(\`Entry at offset \${offset} not found\`);
    }

    return entry;
  }

  readRange(startOffset, endOffset) {
    const results = [];

    for (const segment of this.segments) {
      if (segment.lastOffset < startOffset) continue;
      if (segment.firstOffset > endOffset) break;

      for (const entry of segment.entries) {
        if (entry.offset >= startOffset && entry.offset <= endOffset) {
          results.push(entry);
        }
      }
    }

    return results;
  }

  rolloverSegment() {
    // Close current segment
    this.currentSegment.closed = true;
    this.currentSegment.closedAt = Date.now();

    // Add to segments list
    this.segments.push(this.currentSegment);

    // Create new segment
    this.currentSegment = this.createNewSegment();

    // Cleanup old segments if needed
    this.cleanupOldSegments();
  }

  createNewSegment() {
    const segmentId = this.segments.length;
    return {
      id: segmentId,
      firstOffset: this.nextOffset,
      lastOffset: this.nextOffset - 1,
      entries: [],
      size: 0,
      createdAt: Date.now(),
      closed: false
    };
  }

  findSegmentForOffset(offset) {
    // Check current segment first
    if (offset >= this.currentSegment.firstOffset) {
      return this.currentSegment;
    }

    // Binary search through closed segments
    let left = 0;
    let right = this.segments.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const segment = this.segments[mid];

      if (offset >= segment.firstOffset && offset <= segment.lastOffset) {
        return segment;
      } else if (offset < segment.firstOffset) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return null;
  }

  cleanupOldSegments() {
    if (this.segments.length <= this.maxSegments) return;

    // Remove oldest segments
    const toRemove = this.segments.length - this.maxSegments;
    const removedSegments = this.segments.splice(0, toRemove);

    // Archive or delete removed segments
    removedSegments.forEach(segment => {
      this.archiveSegment(segment);
    });
  }

  archiveSegment(segment) {
    console.log(\`Archiving segment \${segment.id} with \${segment.entries.length} entries\`);
    // Implement archival logic (e.g., move to cold storage)
  }

  calculateSize(data) {
    return JSON.stringify(data).length;
  }

  getStats() {
    return {
      totalSegments: this.segments.length + 1,
      totalEntries: this.segments.reduce((sum, s) => sum + s.entries.length, 0) + this.currentSegment.entries.length,
      totalSize: this.segments.reduce((sum, s) => sum + s.size, 0) + this.currentSegment.size,
      oldestOffset: this.segments.length > 0 ? this.segments[0].firstOffset : this.currentSegment.firstOffset,
      newestOffset: this.nextOffset - 1
    };
  }
}`,
          relatedPatterns: ['Replicated Log', 'Write-Ahead Log', 'Low Watermark'],
          difficulty: 'Intermediate',
          category: 'Storage'
        },
        {
          id: 'low-watermark',
          name: 'Low Watermark',
          problem: 'How to track the minimum progress across all consumers to safely clean up processed data?',
          solution: 'Maintain a low watermark indicating the lowest offset that all consumers have processed.',
          keyPoints: [
            'Tracks minimum consumer progress',
            'Enables safe data cleanup',
            'Prevents data loss during cleanup',
            'Coordinates multiple consumers'
          ],
          useCases: ['Log cleanup', 'Garbage collection', 'Consumer coordination'],
          implementation: `// Low Watermark Implementation
class LowWatermarkTracker {
  constructor() {
    this.consumers = new Map();
    this.lowWatermark = 0;
    this.cleanupCallbacks = [];
  }

  registerConsumer(consumerId, initialOffset = 0) {
    this.consumers.set(consumerId, {
      id: consumerId,
      lastProcessedOffset: initialOffset,
      lastUpdated: Date.now(),
      isActive: true
    });

    this.updateLowWatermark();
    console.log(\`Consumer \${consumerId} registered with offset \${initialOffset}\`);
  }

  updateConsumerProgress(consumerId, processedOffset) {
    const consumer = this.consumers.get(consumerId);
    if (!consumer) {
      throw new Error(\`Consumer \${consumerId} not registered\`);
    }

    if (processedOffset < consumer.lastProcessedOffset) {
      throw new Error(\`Offset cannot go backwards for consumer \${consumerId}\`);
    }

    consumer.lastProcessedOffset = processedOffset;
    consumer.lastUpdated = Date.now();
    consumer.isActive = true;

    this.updateLowWatermark();
  }

  updateLowWatermark() {
    if (this.consumers.size === 0) {
      return;
    }

    const activeConsumers = Array.from(this.consumers.values())
      .filter(c => c.isActive);

    if (activeConsumers.length === 0) {
      return;
    }

    const newLowWatermark = Math.min(
      ...activeConsumers.map(c => c.lastProcessedOffset)
    );

    if (newLowWatermark > this.lowWatermark) {
      const oldWatermark = this.lowWatermark;
      this.lowWatermark = newLowWatermark;

      console.log(\`Low watermark updated from \${oldWatermark} to \${newLowWatermark}\`);

      // Trigger cleanup callbacks
      this.triggerCleanup(oldWatermark, newLowWatermark);
    }
  }

  removeConsumer(consumerId) {
    const consumer = this.consumers.get(consumerId);
    if (consumer) {
      this.consumers.delete(consumerId);
      this.updateLowWatermark();
      console.log(\`Consumer \${consumerId} removed\`);
    }
  }

  markConsumerInactive(consumerId) {
    const consumer = this.consumers.get(consumerId);
    if (consumer) {
      consumer.isActive = false;
      console.log(\`Consumer \${consumerId} marked as inactive\`);
    }
  }

  getLowWatermark() {
    return this.lowWatermark;
  }

  getConsumerProgress() {
    return Array.from(this.consumers.values()).map(c => ({
      id: c.id,
      lastProcessedOffset: c.lastProcessedOffset,
      lastUpdated: c.lastUpdated,
      isActive: c.isActive,
      lag: this.getLag(c)
    }));
  }

  getLag(consumer) {
    // Calculate lag from the highest consumer
    const maxOffset = Math.max(
      ...Array.from(this.consumers.values()).map(c => c.lastProcessedOffset)
    );
    return maxOffset - consumer.lastProcessedOffset;
  }

  onCleanup(callback) {
    this.cleanupCallbacks.push(callback);
  }

  triggerCleanup(oldWatermark, newWatermark) {
    this.cleanupCallbacks.forEach(callback => {
      try {
        callback(oldWatermark, newWatermark);
      } catch (error) {
        console.error('Error in cleanup callback:', error);
      }
    });
  }

  // Periodic health check for consumers
  checkConsumerHealth(timeoutMs = 30000) {
    const now = Date.now();
    let updated = false;

    for (const [consumerId, consumer] of this.consumers) {
      if (consumer.isActive && (now - consumer.lastUpdated) > timeoutMs) {
        console.warn(\`Consumer \${consumerId} appears to be stale, marking inactive\`);
        consumer.isActive = false;
        updated = true;
      }
    }

    if (updated) {
      this.updateLowWatermark();
    }
  }

  getStats() {
    const consumers = Array.from(this.consumers.values());
    return {
      lowWatermark: this.lowWatermark,
      totalConsumers: consumers.length,
      activeConsumers: consumers.filter(c => c.isActive).length,
      maxOffset: consumers.length > 0 ? Math.max(...consumers.map(c => c.lastProcessedOffset)) : 0,
      totalLag: consumers.reduce((sum, c) => sum + this.getLag(c), 0)
    };
  }
}`,
          relatedPatterns: ['Segmented Log', 'High Watermark', 'Consumer Groups'],
          difficulty: 'Intermediate',
          category: 'Storage'
        },
        {
          id: 'high-watermark',
          name: 'High Watermark',
          problem: 'How to track the highest committed offset to ensure data consistency and prevent reading uncommitted data?',
          solution: 'Maintain a high watermark indicating the highest offset that has been successfully replicated and committed.',
          keyPoints: [
            'Tracks highest committed offset',
            'Prevents reading uncommitted data',
            'Ensures data consistency',
            'Coordinates replication progress'
          ],
          useCases: ['Replication coordination', 'Read consistency', 'Commit tracking'],
          implementation: `// High Watermark Implementation
class HighWatermarkManager {
  constructor(replicationFactor = 3) {
    this.replicationFactor = replicationFactor;
    this.replicas = new Map();
    this.highWatermark = 0;
    this.lastCommittedOffset = -1;
    this.pendingWrites = new Map();
  }

  addReplica(replicaId, initialOffset = 0) {
    this.replicas.set(replicaId, {
      id: replicaId,
      lastAckedOffset: initialOffset,
      lastUpdated: Date.now(),
      isHealthy: true
    });

    this.updateHighWatermark();
    console.log(\`Replica \${replicaId} added with offset \${initialOffset}\`);
  }

  updateReplicaProgress(replicaId, ackedOffset) {
    const replica = this.replicas.get(replicaId);
    if (!replica) {
      throw new Error(\`Replica \${replicaId} not found\`);
    }

    if (ackedOffset < replica.lastAckedOffset) {
      throw new Error(\`Replica \${replicaId} offset cannot go backwards\`);
    }

    replica.lastAckedOffset = ackedOffset;
    replica.lastUpdated = Date.now();
    replica.isHealthy = true;

    this.updateHighWatermark();
    this.checkPendingCommits();
  }

  updateHighWatermark() {
    const healthyReplicas = Array.from(this.replicas.values())
      .filter(r => r.isHealthy);

    if (healthyReplicas.length < this.replicationFactor) {
      console.warn(\`Insufficient healthy replicas: \${healthyReplicas.length}/\${this.replicationFactor}\`);
      return;
    }

    // Sort by acked offset and take the nth replica (where n = replicationFactor)
    const sortedOffsets = healthyReplicas
      .map(r => r.lastAckedOffset)
      .sort((a, b) => a - b);

    const newHighWatermark = sortedOffsets[this.replicationFactor - 1];

    if (newHighWatermark > this.highWatermark) {
      const oldWatermark = this.highWatermark;
      this.highWatermark = newHighWatermark;

      console.log(\`High watermark updated from \${oldWatermark} to \${newHighWatermark}\`);
      this.onHighWatermarkUpdate(oldWatermark, newHighWatermark);
    }
  }

  async writeData(offset, data) {
    // Record pending write
    this.pendingWrites.set(offset, {
      data,
      timestamp: Date.now(),
      replicatedTo: new Set()
    });

    // Replicate to all replicas
    const replicationPromises = Array.from(this.replicas.keys()).map(replicaId =>
      this.replicateToReplica(replicaId, offset, data)
    );

    // Wait for replication factor acknowledgments
    const results = await Promise.allSettled(replicationPromises);
    const successCount = results.filter(r => r.status === 'fulfilled').length;

    if (successCount >= this.replicationFactor) {
      return { success: true, replicated: successCount };
    } else {
      this.pendingWrites.delete(offset);
      throw new Error(\`Failed to replicate to sufficient replicas: \${successCount}/\${this.replicationFactor}\`);
    }
  }

  async replicateToReplica(replicaId, offset, data) {
    try {
      // Simulate replication
      await this.sendReplicationRequest(replicaId, offset, data);

      const pending = this.pendingWrites.get(offset);
      if (pending) {
        pending.replicatedTo.add(replicaId);
      }

      return { replicaId, success: true };
    } catch (error) {
      console.error(\`Replication to \${replicaId} failed:\`, error.message);
      throw error;
    }
  }

  checkPendingCommits() {
    for (const [offset, pending] of this.pendingWrites) {
      if (offset <= this.highWatermark) {
        // This write is now committed
        this.lastCommittedOffset = Math.max(this.lastCommittedOffset, offset);
        this.pendingWrites.delete(offset);

        this.onCommit(offset, pending.data);
      }
    }
  }

  canRead(offset) {
    return offset <= this.highWatermark;
  }

  getHighWatermark() {
    return this.highWatermark;
  }

  getLastCommittedOffset() {
    return this.lastCommittedOffset;
  }

  getReplicaStatus() {
    return Array.from(this.replicas.values()).map(r => ({
      id: r.id,
      lastAckedOffset: r.lastAckedOffset,
      lag: this.highWatermark - r.lastAckedOffset,
      isHealthy: r.isHealthy,
      lastUpdated: r.lastUpdated
    }));
  }

  markReplicaUnhealthy(replicaId) {
    const replica = this.replicas.get(replicaId);
    if (replica) {
      replica.isHealthy = false;
      console.warn(\`Replica \${replicaId} marked as unhealthy\`);
      this.updateHighWatermark();
    }
  }

  onHighWatermarkUpdate(oldWatermark, newWatermark) {
    // Override in subclasses for custom behavior
    console.log(\`High watermark advanced: \${oldWatermark} -> \${newWatermark}\`);
  }

  onCommit(offset, data) {
    // Override in subclasses for custom behavior
    console.log(\`Data committed at offset \${offset}\`);
  }

  async sendReplicationRequest(replicaId, offset, data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
    return { success: true };
  }
}`,
          relatedPatterns: ['Low Watermark', 'Replicated Log', 'Leader Follower'],
          difficulty: 'Advanced',
          category: 'Storage'
        }
      ]
    },
    partitioning: {
      title: "🔀 Partitioning & Distribution",
      description: "Patterns for distributing data and load across multiple nodes",
      patterns: [
        {
          id: 'key-range-partitions',
          name: 'Key Range Partitions',
          problem: 'How to distribute data across multiple nodes while maintaining range query capabilities?',
          solution: 'Partition data based on key ranges, where each partition handles a contiguous range of keys.',
          keyPoints: [
            'Maintains key ordering within partitions',
            'Enables efficient range queries',
            'Supports dynamic partition splitting',
            'May create hotspots with skewed data'
          ],
          useCases: ['Distributed databases', 'Time-series data', 'Ordered data storage'],
          implementation: `// Key Range Partitions Implementation
class KeyRangePartitioner {
  constructor() {
    this.partitions = [];
    this.partitionMap = new Map();
  }

  createPartition(startKey, endKey, nodeId) {
    const partition = {
      id: this.generatePartitionId(),
      startKey,
      endKey,
      nodeId,
      size: 0,
      keyCount: 0,
      createdAt: Date.now()
    };

    this.partitions.push(partition);
    this.sortPartitions();
    this.updatePartitionMap();

    return partition;
  }

  findPartition(key) {
    // Binary search for the partition containing this key
    let left = 0;
    let right = this.partitions.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const partition = this.partitions[mid];

      if (this.isKeyInRange(key, partition)) {
        return partition;
      } else if (key < partition.startKey) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return null;
  }

  put(key, value) {
    const partition = this.findPartition(key);
    if (!partition) {
      throw new Error(\`No partition found for key: \${key}\`);
    }

    // Store data on the appropriate node
    return this.storeOnNode(partition.nodeId, key, value);
  }

  get(key) {
    const partition = this.findPartition(key);
    if (!partition) {
      return null;
    }

    return this.retrieveFromNode(partition.nodeId, key);
  }

  rangeQuery(startKey, endKey) {
    const results = [];

    // Find all partitions that overlap with the range
    for (const partition of this.partitions) {
      if (this.rangesOverlap(startKey, endKey, partition.startKey, partition.endKey)) {
        const partitionResults = this.rangeQueryOnNode(
          partition.nodeId,
          Math.max(startKey, partition.startKey),
          Math.min(endKey, partition.endKey)
        );
        results.push(...partitionResults);
      }
    }

    return results.sort((a, b) => a.key.localeCompare(b.key));
  }

  splitPartition(partitionId, splitKey) {
    const partitionIndex = this.partitions.findIndex(p => p.id === partitionId);
    if (partitionIndex === -1) {
      throw new Error(\`Partition \${partitionId} not found\`);
    }

    const originalPartition = this.partitions[partitionIndex];

    if (!this.isKeyInRange(splitKey, originalPartition)) {
      throw new Error(\`Split key \${splitKey} not in partition range\`);
    }

    // Create new partition for the upper range
    const newPartition = {
      id: this.generatePartitionId(),
      startKey: splitKey,
      endKey: originalPartition.endKey,
      nodeId: this.selectNodeForNewPartition(),
      size: 0,
      keyCount: 0,
      createdAt: Date.now()
    };

    // Update original partition to cover lower range
    originalPartition.endKey = splitKey;

    // Add new partition
    this.partitions.push(newPartition);
    this.sortPartitions();
    this.updatePartitionMap();

    // Migrate data for the new partition
    this.migrateData(originalPartition, newPartition, splitKey);

    return newPartition;
  }

  mergePartitions(partition1Id, partition2Id) {
    const p1Index = this.partitions.findIndex(p => p.id === partition1Id);
    const p2Index = this.partitions.findIndex(p => p.id === partition2Id);

    if (p1Index === -1 || p2Index === -1) {
      throw new Error('One or both partitions not found');
    }

    const p1 = this.partitions[p1Index];
    const p2 = this.partitions[p2Index];

    // Ensure partitions are adjacent
    if (p1.endKey !== p2.startKey && p2.endKey !== p1.startKey) {
      throw new Error('Partitions are not adjacent');
    }

    // Determine the merged partition
    const mergedPartition = {
      id: this.generatePartitionId(),
      startKey: p1.startKey < p2.startKey ? p1.startKey : p2.startKey,
      endKey: p1.endKey > p2.endKey ? p1.endKey : p2.endKey,
      nodeId: p1.nodeId, // Use first partition's node
      size: p1.size + p2.size,
      keyCount: p1.keyCount + p2.keyCount,
      createdAt: Date.now()
    };

    // Remove old partitions and add merged one
    this.partitions.splice(Math.max(p1Index, p2Index), 1);
    this.partitions.splice(Math.min(p1Index, p2Index), 1);
    this.partitions.push(mergedPartition);

    this.sortPartitions();
    this.updatePartitionMap();

    // Migrate data from second partition to first
    this.migrateData(p2, mergedPartition, null);

    return mergedPartition;
  }

  isKeyInRange(key, partition) {
    return key >= partition.startKey && key < partition.endKey;
  }

  rangesOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
  }

  sortPartitions() {
    this.partitions.sort((a, b) => a.startKey.localeCompare(b.startKey));
  }

  updatePartitionMap() {
    this.partitionMap.clear();
    this.partitions.forEach(partition => {
      this.partitionMap.set(partition.id, partition);
    });
  }

  generatePartitionId() {
    return \`partition-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
  }

  selectNodeForNewPartition() {
    // Simple round-robin selection
    const nodes = [...new Set(this.partitions.map(p => p.nodeId))];
    return nodes[this.partitions.length % nodes.length] || 'node-1';
  }

  async storeOnNode(nodeId, key, value) {
    // Implement network call to store data
    return { success: true, nodeId, key };
  }

  async retrieveFromNode(nodeId, key) {
    // Implement network call to retrieve data
    return { key, value: \`value-for-\${key}\`, nodeId };
  }

  async rangeQueryOnNode(nodeId, startKey, endKey) {
    // Implement network call for range query
    return [{ key: startKey, value: \`value-for-\${startKey}\` }];
  }

  async migrateData(fromPartition, toPartition, splitKey) {
    // Implement data migration logic
    console.log(\`Migrating data from partition \${fromPartition.id} to \${toPartition.id}\`);
  }
}`,
          relatedPatterns: ['Fixed Partitions', 'Consistent Hashing', 'Shard'],
          difficulty: 'Advanced',
          category: 'Partitioning'
        },
        {
          id: 'fixed-partitions',
          name: 'Fixed Partitions',
          problem: 'How to distribute data evenly across nodes when the data distribution is unknown or highly variable?',
          solution: 'Use a fixed number of partitions with hash-based assignment to distribute data evenly.',
          keyPoints: [
            'Fixed number of partitions',
            'Hash-based data distribution',
            'Even load distribution',
            'Simple partition management'
          ],
          useCases: ['Hash tables', 'Load balancing', 'Distributed caching'],
          implementation: `// Fixed Partitions Implementation
class FixedPartitioner {
  constructor(partitionCount, nodes) {
    this.partitionCount = partitionCount;
    this.nodes = nodes;
    this.partitionToNode = this.assignPartitionsToNodes();
  }

  assignPartitionsToNodes() {
    const assignment = new Map();

    for (let i = 0; i < this.partitionCount; i++) {
      const nodeIndex = i % this.nodes.length;
      assignment.set(i, this.nodes[nodeIndex]);
    }

    return assignment;
  }

  getPartition(key) {
    const hash = this.hashKey(key);
    return hash % this.partitionCount;
  }

  getNode(key) {
    const partition = this.getPartition(key);
    return this.partitionToNode.get(partition);
  }

  put(key, value) {
    const node = this.getNode(key);
    const partition = this.getPartition(key);

    return this.storeOnNode(node, partition, key, value);
  }

  get(key) {
    const node = this.getNode(key);
    const partition = this.getPartition(key);

    return this.retrieveFromNode(node, partition, key);
  }

  hashKey(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash);
  }

  rebalance(newNodes) {
    const oldAssignment = new Map(this.partitionToNode);
    this.nodes = newNodes;
    this.partitionToNode = this.assignPartitionsToNodes();

    // Find partitions that need to be moved
    const migrations = [];
    for (let partition = 0; partition < this.partitionCount; partition++) {
      const oldNode = oldAssignment.get(partition);
      const newNode = this.partitionToNode.get(partition);

      if (oldNode !== newNode) {
        migrations.push({
          partition,
          from: oldNode,
          to: newNode
        });
      }
    }

    return this.executeMigrations(migrations);
  }

  async executeMigrations(migrations) {
    const results = [];

    for (const migration of migrations) {
      try {
        await this.migratePartition(migration.partition, migration.from, migration.to);
        results.push({ ...migration, success: true });
      } catch (error) {
        results.push({ ...migration, success: false, error: error.message });
      }
    }

    return results;
  }

  async migratePartition(partition, fromNode, toNode) {
    console.log(\`Migrating partition \${partition} from \${fromNode} to \${toNode}\`);
    // Implement actual migration logic
    return { success: true };
  }

  async storeOnNode(node, partition, key, value) {
    // Implement storage on specific node
    return { success: true, node, partition, key };
  }

  async retrieveFromNode(node, partition, key) {
    // Implement retrieval from specific node
    return { key, value: \`value-for-\${key}\`, node, partition };
  }

  getPartitionDistribution() {
    const distribution = new Map();

    for (const node of this.nodes) {
      distribution.set(node, []);
    }

    for (let partition = 0; partition < this.partitionCount; partition++) {
      const node = this.partitionToNode.get(partition);
      distribution.get(node).push(partition);
    }

    return distribution;
  }
}`,
          relatedPatterns: ['Key Range Partitions', 'Consistent Hashing', 'Hash Partitioning'],
          difficulty: 'Intermediate',
          category: 'Partitioning'
        }
      ]
    },
    reliability: {
      title: "🛡️ Reliability & Fault Tolerance",
      description: "Patterns for building resilient and fault-tolerant distributed systems",
      patterns: [
        {
          id: 'idempotent-receiver',
          name: 'Idempotent Receiver',
          problem: 'How to handle duplicate messages safely when network retries can cause the same message to be delivered multiple times?',
          solution: 'Design message handlers to be idempotent, producing the same result regardless of how many times they are executed.',
          keyPoints: [
            'Safe to execute multiple times',
            'Handles duplicate messages gracefully',
            'Maintains system consistency',
            'Uses unique message identifiers'
          ],
          useCases: ['Message processing', 'API endpoints', 'Event handling'],
          implementation: `// Idempotent Receiver Implementation
class IdempotentReceiver {
  constructor() {
    this.processedMessages = new Map();
    this.messageResults = new Map();
    this.cleanupInterval = 60000; // 1 minute
    this.maxAge = 300000; // 5 minutes

    this.startCleanupTimer();
  }

  async processMessage(message) {
    const messageId = this.extractMessageId(message);

    if (!messageId) {
      throw new Error('Message must have a unique identifier');
    }

    // Check if we've already processed this message
    if (this.processedMessages.has(messageId)) {
      const existingResult = this.messageResults.get(messageId);
      console.log(\`Duplicate message \${messageId} detected, returning cached result\`);
      return existingResult;
    }

    try {
      // Process the message
      const result = await this.handleMessage(message);

      // Store the result for future duplicate detection
      this.processedMessages.set(messageId, {
        timestamp: Date.now(),
        messageHash: this.hashMessage(message)
      });
      this.messageResults.set(messageId, result);

      console.log(\`Message \${messageId} processed successfully\`);
      return result;

    } catch (error) {
      // Don't cache failed processing attempts
      console.error(\`Failed to process message \${messageId}:\`, error.message);
      throw error;
    }
  }

  async handleMessage(message) {
    // Override this method with actual message processing logic
    switch (message.type) {
      case 'USER_CREATED':
        return this.handleUserCreated(message);
      case 'ORDER_PLACED':
        return this.handleOrderPlaced(message);
      case 'PAYMENT_PROCESSED':
        return this.handlePaymentProcessed(message);
      default:
        throw new Error(\`Unknown message type: \${message.type}\`);
    }
  }

  async handleUserCreated(message) {
    const { userId, email, name } = message.data;

    // Check if user already exists (idempotent check)
    const existingUser = await this.getUserById(userId);
    if (existingUser) {
      console.log(\`User \${userId} already exists, skipping creation\`);
      return { userId, status: 'already_exists' };
    }

    // Create user
    await this.createUser({ userId, email, name });
    return { userId, status: 'created' };
  }

  async handleOrderPlaced(message) {
    const { orderId, userId, items, total } = message.data;

    // Check if order already exists
    const existingOrder = await this.getOrderById(orderId);
    if (existingOrder) {
      console.log(\`Order \${orderId} already exists, skipping creation\`);
      return { orderId, status: 'already_exists' };
    }

    // Validate user exists
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(\`User \${userId} not found\`);
    }

    // Create order (atomic operation)
    await this.createOrder({ orderId, userId, items, total });
    await this.updateInventory(items);

    return { orderId, status: 'created', total };
  }

  async handlePaymentProcessed(message) {
    const { paymentId, orderId, amount, status } = message.data;

    // Check if payment already processed
    const existingPayment = await this.getPaymentById(paymentId);
    if (existingPayment) {
      console.log(\`Payment \${paymentId} already processed\`);
      return { paymentId, status: existingPayment.status };
    }

    // Process payment idempotently
    if (status === 'success') {
      await this.recordPayment({ paymentId, orderId, amount, status });
      await this.updateOrderStatus(orderId, 'paid');
    } else {
      await this.recordPayment({ paymentId, orderId, amount, status });
      await this.updateOrderStatus(orderId, 'payment_failed');
    }

    return { paymentId, status };
  }

  extractMessageId(message) {
    return message.id || message.messageId || message.uuid;
  }

  hashMessage(message) {
    // Create a hash of the message content for additional verification
    const content = JSON.stringify({
      type: message.type,
      data: message.data,
      timestamp: message.timestamp
    });

    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash + content.charCodeAt(i)) & 0xffffffff;
    }
    return hash;
  }

  startCleanupTimer() {
    setInterval(() => {
      this.cleanupOldMessages();
    }, this.cleanupInterval);
  }

  cleanupOldMessages() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [messageId, info] of this.processedMessages) {
      if (now - info.timestamp > this.maxAge) {
        this.processedMessages.delete(messageId);
        this.messageResults.delete(messageId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(\`Cleaned up \${cleanedCount} old message records\`);
    }
  }

  // Mock database operations (replace with actual implementations)
  async getUserById(userId) {
    return { userId, email: \`user\${userId}@example.com\` };
  }

  async createUser(userData) {
    console.log('Creating user:', userData);
    return userData;
  }

  async getOrderById(orderId) {
    return null; // Simulate order not found
  }

  async createOrder(orderData) {
    console.log('Creating order:', orderData);
    return orderData;
  }

  async updateInventory(items) {
    console.log('Updating inventory for items:', items);
  }

  async getPaymentById(paymentId) {
    return null; // Simulate payment not found
  }

  async recordPayment(paymentData) {
    console.log('Recording payment:', paymentData);
    return paymentData;
  }

  async updateOrderStatus(orderId, status) {
    console.log(\`Updating order \${orderId} status to \${status}\`);
  }

  getStats() {
    return {
      processedMessages: this.processedMessages.size,
      cachedResults: this.messageResults.size,
      oldestMessage: this.getOldestMessageAge(),
      newestMessage: this.getNewestMessageAge()
    };
  }

  getOldestMessageAge() {
    if (this.processedMessages.size === 0) return 0;

    const timestamps = Array.from(this.processedMessages.values()).map(info => info.timestamp);
    return Date.now() - Math.min(...timestamps);
  }

  getNewestMessageAge() {
    if (this.processedMessages.size === 0) return 0;

    const timestamps = Array.from(this.processedMessages.values()).map(info => info.timestamp);
    return Date.now() - Math.max(...timestamps);
  }
}`,
          relatedPatterns: ['At-Least-Once Delivery', 'Exactly-Once Processing', 'Message Deduplication'],
          difficulty: 'Intermediate',
          category: 'Reliability'
        },
        {
          id: 'lease',
          name: 'Lease',
          problem: 'How to grant temporary exclusive access to a resource while ensuring it can be reclaimed if the holder fails?',
          solution: 'Grant time-limited leases that automatically expire, requiring periodic renewal to maintain access.',
          keyPoints: [
            'Time-limited exclusive access',
            'Automatic expiration on failure',
            'Periodic renewal required',
            'Prevents resource deadlocks'
          ],
          useCases: ['Distributed locking', 'Leader election', 'Resource management'],
          implementation: `// Lease Implementation
class LeaseManager {
  constructor(defaultLeaseDuration = 30000) {
    this.defaultLeaseDuration = defaultLeaseDuration;
    this.leases = new Map();
    this.renewalTimers = new Map();

    this.startExpirationChecker();
  }

  async acquireLease(resourceId, clientId, duration = this.defaultLeaseDuration) {
    const now = Date.now();
    const existingLease = this.leases.get(resourceId);

    // Check if resource is already leased and not expired
    if (existingLease && existingLease.expiresAt > now) {
      if (existingLease.clientId === clientId) {
        // Client already holds the lease, extend it
        return this.renewLease(resourceId, clientId, duration);
      } else {
        throw new Error(\`Resource \${resourceId} is already leased by \${existingLease.clientId}\`);
      }
    }

    // Grant new lease
    const lease = {
      resourceId,
      clientId,
      grantedAt: now,
      expiresAt: now + duration,
      duration,
      renewalCount: 0
    };

    this.leases.set(resourceId, lease);

    console.log(\`Lease granted to \${clientId} for resource \${resourceId}, expires at \${new Date(lease.expiresAt)}\`);

    return {
      leaseId: this.generateLeaseId(resourceId, clientId),
      expiresAt: lease.expiresAt,
      duration
    };
  }

  async renewLease(resourceId, clientId, duration = this.defaultLeaseDuration) {
    const lease = this.leases.get(resourceId);

    if (!lease) {
      throw new Error(\`No lease found for resource \${resourceId}\`);
    }

    if (lease.clientId !== clientId) {
      throw new Error(\`Lease for resource \${resourceId} is held by \${lease.clientId}, not \${clientId}\`);
    }

    const now = Date.now();
    if (lease.expiresAt <= now) {
      throw new Error(\`Lease for resource \${resourceId} has already expired\`);
    }

    // Extend the lease
    lease.expiresAt = now + duration;
    lease.renewalCount += 1;

    console.log(\`Lease renewed for \${clientId} on resource \${resourceId}, new expiration: \${new Date(lease.expiresAt)}\`);

    return {
      leaseId: this.generateLeaseId(resourceId, clientId),
      expiresAt: lease.expiresAt,
      renewalCount: lease.renewalCount
    };
  }

  async releaseLease(resourceId, clientId) {
    const lease = this.leases.get(resourceId);

    if (!lease) {
      console.warn(\`No lease found for resource \${resourceId}\`);
      return { success: false, reason: 'lease_not_found' };
    }

    if (lease.clientId !== clientId) {
      throw new Error(\`Cannot release lease: resource \${resourceId} is held by \${lease.clientId}, not \${clientId}\`);
    }

    this.leases.delete(resourceId);

    // Clear any renewal timers
    const timerId = \`\${resourceId}:\${clientId}\`;
    if (this.renewalTimers.has(timerId)) {
      clearTimeout(this.renewalTimers.get(timerId));
      this.renewalTimers.delete(timerId);
    }

    console.log(\`Lease released by \${clientId} for resource \${resourceId}\`);

    return { success: true };
  }

  isLeaseValid(resourceId, clientId) {
    const lease = this.leases.get(resourceId);

    if (!lease) {
      return false;
    }

    if (lease.clientId !== clientId) {
      return false;
    }

    return lease.expiresAt > Date.now();
  }

  getLeaseInfo(resourceId) {
    const lease = this.leases.get(resourceId);

    if (!lease) {
      return null;
    }

    const now = Date.now();
    return {
      resourceId: lease.resourceId,
      clientId: lease.clientId,
      grantedAt: lease.grantedAt,
      expiresAt: lease.expiresAt,
      timeRemaining: Math.max(0, lease.expiresAt - now),
      isExpired: lease.expiresAt <= now,
      renewalCount: lease.renewalCount
    };
  }

  startExpirationChecker() {
    setInterval(() => {
      this.checkExpiredLeases();
    }, 5000); // Check every 5 seconds
  }

  checkExpiredLeases() {
    const now = Date.now();
    const expiredLeases = [];

    for (const [resourceId, lease] of this.leases) {
      if (lease.expiresAt <= now) {
        expiredLeases.push({ resourceId, lease });
      }
    }

    for (const { resourceId, lease } of expiredLeases) {
      console.log(\`Lease expired for client \${lease.clientId} on resource \${resourceId}\`);
      this.leases.delete(resourceId);
      this.onLeaseExpired(resourceId, lease);
    }
  }

  onLeaseExpired(resourceId, lease) {
    // Override this method to handle lease expiration
    console.log(\`Handling expiration of lease for resource \${resourceId}\`);
  }

  setupAutoRenewal(resourceId, clientId, renewalInterval) {
    const timerId = \`\${resourceId}:\${clientId}\`;

    // Clear existing timer
    if (this.renewalTimers.has(timerId)) {
      clearTimeout(this.renewalTimers.get(timerId));
    }

    const timer = setInterval(async () => {
      try {
        await this.renewLease(resourceId, clientId);
        console.log(\`Auto-renewed lease for \${clientId} on \${resourceId}\`);
      } catch (error) {
        console.error(\`Auto-renewal failed for \${clientId} on \${resourceId}:\`, error.message);
        clearInterval(timer);
        this.renewalTimers.delete(timerId);
      }
    }, renewalInterval);

    this.renewalTimers.set(timerId, timer);
  }

  generateLeaseId(resourceId, clientId) {
    return \`\${resourceId}:\${clientId}:\${Date.now()}\`;
  }

  getAllLeases() {
    return Array.from(this.leases.values()).map(lease => ({
      ...lease,
      timeRemaining: Math.max(0, lease.expiresAt - Date.now()),
      isExpired: lease.expiresAt <= Date.now()
    }));
  }

  getStats() {
    const now = Date.now();
    const leases = Array.from(this.leases.values());

    return {
      totalLeases: leases.length,
      activeLeases: leases.filter(l => l.expiresAt > now).length,
      expiredLeases: leases.filter(l => l.expiresAt <= now).length,
      averageRenewalCount: leases.length > 0 ?
        leases.reduce((sum, l) => sum + l.renewalCount, 0) / leases.length : 0
    };
  }
}`,
          relatedPatterns: ['Distributed Lock', 'Leader Election', 'Heartbeat'],
          difficulty: 'Intermediate',
          category: 'Reliability'
        },
        {
          id: 'follower-reads',
          name: 'Follower Reads',
          problem: 'How to scale read operations while maintaining reasonable consistency in a leader-follower setup?',
          solution: 'Allow read operations from follower nodes while providing mechanisms to ensure read consistency when needed.',
          keyPoints: [
            'Scales read throughput',
            'May return slightly stale data',
            'Configurable consistency levels',
            'Reduces load on leader'
          ],
          useCases: ['Read scaling', 'Geographic distribution', 'Load balancing'],
          implementation: `// Follower Reads Implementation
class FollowerReadsManager {
  constructor(leaderId, followerIds) {
    this.leaderId = leaderId;
    this.followerIds = followerIds;
    this.replicationLag = new Map();
    this.consistencyLevel = 'eventual'; // eventual, strong, bounded_staleness
    this.maxStaleness = 5000; // 5 seconds for bounded staleness

    this.initializeReplicationTracking();
  }

  async read(key, options = {}) {
    const {
      consistencyLevel = this.consistencyLevel,
      maxStaleness = this.maxStaleness,
      preferredFollower = null
    } = options;

    switch (consistencyLevel) {
      case 'strong':
        return this.strongRead(key);
      case 'bounded_staleness':
        return this.boundedStalnessRead(key, maxStaleness);
      case 'eventual':
        return this.eventualRead(key, preferredFollower);
      default:
        throw new Error(\`Unknown consistency level: \${consistencyLevel}\`);
    }
  }

  async strongRead(key) {
    // Always read from leader for strong consistency
    console.log(\`Performing strong read for key \${key} from leader\`);
    return this.readFromNode(this.leaderId, key);
  }

  async boundedStalnessRead(key, maxStaleness) {
    // Find followers that are within the staleness bound
    const suitableFollowers = this.followerIds.filter(followerId => {
      const lag = this.replicationLag.get(followerId) || 0;
      return lag <= maxStaleness;
    });

    if (suitableFollowers.length === 0) {
      console.log(\`No followers within staleness bound, reading from leader\`);
      return this.readFromNode(this.leaderId, key);
    }

    // Select a random suitable follower
    const selectedFollower = suitableFollowers[
      Math.floor(Math.random() * suitableFollowers.length)
    ];

    console.log(\`Performing bounded staleness read for key \${key} from follower \${selectedFollower}\`);
    return this.readFromNode(selectedFollower, key);
  }

  async eventualRead(key, preferredFollower = null) {
    let selectedFollower;

    if (preferredFollower && this.followerIds.includes(preferredFollower)) {
      selectedFollower = preferredFollower;
    } else {
      // Select follower with lowest lag
      selectedFollower = this.selectBestFollower();
    }

    if (!selectedFollower) {
      console.log(\`No followers available, reading from leader\`);
      return this.readFromNode(this.leaderId, key);
    }

    console.log(\`Performing eventual read for key \${key} from follower \${selectedFollower}\`);

    try {
      return await this.readFromNode(selectedFollower, key);
    } catch (error) {
      console.warn(\`Follower read failed, falling back to leader: \${error.message}\`);
      return this.readFromNode(this.leaderId, key);
    }
  }

  selectBestFollower() {
    if (this.followerIds.length === 0) {
      return null;
    }

    // Select follower with minimum replication lag
    let bestFollower = this.followerIds[0];
    let minLag = this.replicationLag.get(bestFollower) || Infinity;

    for (const followerId of this.followerIds) {
      const lag = this.replicationLag.get(followerId) || Infinity;
      if (lag < minLag) {
        minLag = lag;
        bestFollower = followerId;
      }
    }

    return bestFollower;
  }

  async readFromNode(nodeId, key) {
    // Simulate network call to read from specific node
    const startTime = Date.now();

    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, Math.random() * 10));

      const value = \`value-for-\${key}-from-\${nodeId}\`;
      const readTime = Date.now() - startTime;

      return {
        key,
        value,
        nodeId,
        timestamp: Date.now(),
        readLatency: readTime,
        replicationLag: this.replicationLag.get(nodeId) || 0
      };
    } catch (error) {
      throw new Error(\`Failed to read from node \${nodeId}: \${error.message}\`);
    }
  }

  updateReplicationLag(followerId, lagMs) {
    this.replicationLag.set(followerId, lagMs);
    console.log(\`Updated replication lag for \${followerId}: \${lagMs}ms\`);
  }

  initializeReplicationTracking() {
    // Initialize lag tracking for all followers
    this.followerIds.forEach(followerId => {
      this.replicationLag.set(followerId, 0);
    });

    // Start periodic lag monitoring
    this.startLagMonitoring();
  }

  startLagMonitoring() {
    setInterval(() => {
      this.monitorReplicationLag();
    }, 1000); // Check every second
  }

  async monitorReplicationLag() {
    for (const followerId of this.followerIds) {
      try {
        const lag = await this.measureReplicationLag(followerId);
        this.updateReplicationLag(followerId, lag);
      } catch (error) {
        console.error(\`Failed to measure lag for \${followerId}: \${error.message}\`);
        // Set high lag to avoid using this follower
        this.updateReplicationLag(followerId, Infinity);
      }
    }
  }

  async measureReplicationLag(followerId) {
    // Get latest committed offset from leader
    const leaderOffset = await this.getLatestOffset(this.leaderId);

    // Get latest applied offset from follower
    const followerOffset = await this.getLatestOffset(followerId);

    // Calculate lag based on timestamp difference
    const lag = leaderOffset.timestamp - followerOffset.timestamp;

    return Math.max(0, lag);
  }

  async getLatestOffset(nodeId) {
    // Mock implementation - get latest offset and timestamp
    return {
      offset: Math.floor(Math.random() * 1000),
      timestamp: Date.now() - (nodeId === this.leaderId ? 0 : Math.random() * 2000)
    };
  }

  addFollower(followerId) {
    if (!this.followerIds.includes(followerId)) {
      this.followerIds.push(followerId);
      this.replicationLag.set(followerId, 0);
      console.log(\`Added follower \${followerId}\`);
    }
  }

  removeFollower(followerId) {
    const index = this.followerIds.indexOf(followerId);
    if (index > -1) {
      this.followerIds.splice(index, 1);
      this.replicationLag.delete(followerId);
      console.log(\`Removed follower \${followerId}\`);
    }
  }

  getReplicationStatus() {
    return {
      leader: this.leaderId,
      followers: this.followerIds.map(id => ({
        id,
        replicationLag: this.replicationLag.get(id) || 0,
        isHealthy: (this.replicationLag.get(id) || 0) < this.maxStaleness
      }))
    };
  }

  setConsistencyLevel(level) {
    const validLevels = ['eventual', 'bounded_staleness', 'strong'];
    if (!validLevels.includes(level)) {
      throw new Error(\`Invalid consistency level: \${level}\`);
    }

    this.consistencyLevel = level;
    console.log(\`Consistency level set to: \${level}\`);
  }

  getStats() {
    const lags = Array.from(this.replicationLag.values()).filter(lag => lag !== Infinity);

    return {
      totalFollowers: this.followerIds.length,
      healthyFollowers: lags.filter(lag => lag <= this.maxStaleness).length,
      averageLag: lags.length > 0 ? lags.reduce((sum, lag) => sum + lag, 0) / lags.length : 0,
      maxLag: lags.length > 0 ? Math.max(...lags) : 0,
      minLag: lags.length > 0 ? Math.min(...lags) : 0
    };
  }
}`,
          relatedPatterns: ['Leader Follower', 'Read Replicas', 'Eventual Consistency'],
          difficulty: 'Advanced',
          category: 'Reliability'
        },
        {
          id: 'gossip-dissemination',
          name: 'Gossip Dissemination',
          problem: 'How to efficiently spread information across all nodes in a large distributed system?',
          solution: 'Use a gossip protocol where nodes periodically exchange information with random peers to eventually reach all nodes.',
          keyPoints: [
            'Epidemic-style information spread',
            'Eventually reaches all nodes',
            'Fault-tolerant and scalable',
            'Configurable gossip frequency'
          ],
          useCases: ['Cluster membership', 'Configuration updates', 'Failure detection'],
          implementation: `// Gossip Dissemination Implementation
class GossipNode {
  constructor(nodeId, peers = []) {
    this.nodeId = nodeId;
    this.peers = new Set(peers);
    this.data = new Map();
    this.versions = new Map();
    this.gossipInterval = 1000; // 1 second
    this.fanout = 3; // Number of peers to gossip with each round
    this.isRunning = false;

    this.initializeVersionVector();
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.gossipTimer = setInterval(() => {
      this.performGossipRound();
    }, this.gossipInterval);

    console.log(\`Gossip node \${this.nodeId} started\`);
  }

  stop() {
    this.isRunning = false;
    if (this.gossipTimer) {
      clearInterval(this.gossipTimer);
      this.gossipTimer = null;
    }

    console.log(\`Gossip node \${this.nodeId} stopped\`);
  }

  addPeer(peerId) {
    this.peers.add(peerId);
    this.initializeVersionForPeer(peerId);
    console.log(\`Added peer \${peerId} to node \${this.nodeId}\`);
  }

  removePeer(peerId) {
    this.peers.delete(peerId);
    console.log(\`Removed peer \${peerId} from node \${this.nodeId}\`);
  }

  updateData(key, value) {
    const currentVersion = this.versions.get(key) || 0;
    const newVersion = currentVersion + 1;

    this.data.set(key, {
      value,
      version: newVersion,
      timestamp: Date.now(),
      origin: this.nodeId
    });

    this.versions.set(key, newVersion);

    console.log(\`Node \${this.nodeId} updated \${key} to version \${newVersion}\`);
  }

  getData(key) {
    const entry = this.data.get(key);
    return entry ? entry.value : null;
  }

  performGossipRound() {
    if (this.peers.size === 0) return;

    // Select random peers to gossip with
    const selectedPeers = this.selectRandomPeers();

    for (const peerId of selectedPeers) {
      this.gossipWithPeer(peerId);
    }
  }

  selectRandomPeers() {
    const peerArray = Array.from(this.peers);
    const numPeers = Math.min(this.fanout, peerArray.length);
    const selected = [];

    for (let i = 0; i < numPeers; i++) {
      const randomIndex = Math.floor(Math.random() * peerArray.length);
      const peer = peerArray.splice(randomIndex, 1)[0];
      selected.push(peer);
    }

    return selected;
  }

  async gossipWithPeer(peerId) {
    try {
      // Create gossip message with our data
      const gossipMessage = this.createGossipMessage();

      // Send gossip message and receive response
      const response = await this.sendGossipMessage(peerId, gossipMessage);

      // Process the response
      this.processGossipResponse(peerId, response);

    } catch (error) {
      console.error(\`Gossip with peer \${peerId} failed: \${error.message}\`);
    }
  }

  createGossipMessage() {
    const message = {
      from: this.nodeId,
      timestamp: Date.now(),
      data: {},
      versions: {}
    };

    // Include all our data and versions
    for (const [key, entry] of this.data) {
      message.data[key] = entry;
      message.versions[key] = entry.version;
    }

    return message;
  }

  async sendGossipMessage(peerId, message) {
    // Simulate network call
    await new Promise(resolve => setTimeout(resolve, Math.random() * 10));

    // Mock response from peer
    return {
      from: peerId,
      timestamp: Date.now(),
      data: {
        [\`peer-data-\${peerId}\`]: {
          value: \`value-from-\${peerId}\`,
          version: Math.floor(Math.random() * 10),
          timestamp: Date.now(),
          origin: peerId
        }
      },
      versions: {
        [\`peer-data-\${peerId}\`]: Math.floor(Math.random() * 10)
      }
    };
  }

  processGossipResponse(peerId, response) {
    let updatesReceived = 0;

    // Process each piece of data in the response
    for (const [key, remoteEntry] of Object.entries(response.data)) {
      const localEntry = this.data.get(key);

      if (!localEntry || this.shouldUpdateEntry(localEntry, remoteEntry)) {
        this.data.set(key, remoteEntry);
        this.versions.set(key, remoteEntry.version);
        updatesReceived++;

        console.log(\`Node \${this.nodeId} received update for \${key} from \${peerId} (version \${remoteEntry.version})\`);
      }
    }

    if (updatesReceived > 0) {
      console.log(\`Node \${this.nodeId} received \${updatesReceived} updates from \${peerId}\`);
    }
  }

  shouldUpdateEntry(localEntry, remoteEntry) {
    // Update if remote version is higher
    if (remoteEntry.version > localEntry.version) {
      return true;
    }

    // If versions are equal, use timestamp as tiebreaker
    if (remoteEntry.version === localEntry.version) {
      return remoteEntry.timestamp > localEntry.timestamp;
    }

    return false;
  }

  initializeVersionVector() {
    // Initialize version tracking
    this.versions.clear();
  }

  initializeVersionForPeer(peerId) {
    // Initialize version tracking for new peer
    // This could be expanded for more sophisticated version vectors
  }

  handleIncomingGossip(message) {
    // Handle gossip message received from another node
    this.processGossipResponse(message.from, message);

    // Return our data as response
    return this.createGossipMessage();
  }

  getAllData() {
    const result = {};
    for (const [key, entry] of this.data) {
      result[key] = {
        value: entry.value,
        version: entry.version,
        origin: entry.origin,
        timestamp: entry.timestamp
      };
    }
    return result;
  }

  getStats() {
    const now = Date.now();
    const entries = Array.from(this.data.values());

    return {
      nodeId: this.nodeId,
      totalPeers: this.peers.size,
      totalEntries: entries.length,
      averageAge: entries.length > 0 ?
        entries.reduce((sum, entry) => sum + (now - entry.timestamp), 0) / entries.length : 0,
      isRunning: this.isRunning,
      gossipInterval: this.gossipInterval,
      fanout: this.fanout
    };
  }

  setGossipInterval(intervalMs) {
    this.gossipInterval = intervalMs;

    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  setFanout(fanout) {
    this.fanout = Math.max(1, fanout);
  }
}`,
          relatedPatterns: ['Heartbeat', 'Membership Protocol', 'Epidemic Broadcast'],
          difficulty: 'Advanced',
          category: 'Reliability'
        }
      ]
    }
  };

  // Get all patterns for flashcards
  const getAllPatterns = () => {
    return Object.values(patterns).flatMap(category => category.patterns);
  };

  // Initialize study progress
  useEffect(() => {
    const allPatterns = getAllPatterns();
    const initialProgress = {};
    allPatterns.forEach(pattern => {
      initialProgress[pattern.id] = {
        studied: false,
        confidence: 0,
        lastReviewed: null
      };
    });
    setStudyProgress(initialProgress);
  }, []);

  const handlePatternSelect = (patternId) => {
    setSelectedPatterns(prev => 
      prev.includes(patternId) 
        ? prev.filter(id => id !== patternId)
        : [...prev, patternId]
    );
  };

  const markAsStudied = (patternId) => {
    setStudyProgress(prev => ({
      ...prev,
      [patternId]: {
        ...prev[patternId],
        studied: true,
        lastReviewed: new Date().toISOString()
      }
    }));
  };

  const updateConfidence = (patternId, confidence) => {
    setStudyProgress(prev => ({
      ...prev,
      [patternId]: {
        ...prev[patternId],
        confidence
      }
    }));
  };

  // Flashcard Mode Component
  const FlashcardMode = ({ patterns, selectedPatterns, studyProgress, updateConfidence, markAsStudied }) => {
    const studyPatterns = selectedPatterns.length > 0
      ? patterns.filter(p => selectedPatterns.includes(p.id))
      : patterns;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const currentPattern = studyPatterns[currentIndex];

    const nextCard = () => {
      setShowAnswer(false);
      setCurrentIndex((prev) => (prev + 1) % studyPatterns.length);
    };

    const prevCard = () => {
      setShowAnswer(false);
      setCurrentIndex((prev) => (prev - 1 + studyPatterns.length) % studyPatterns.length);
    };

    const handleConfidence = (level) => {
      updateConfidence(currentPattern.id, level);
      markAsStudied(currentPattern.id);
      setTimeout(nextCard, 500);
    };

    if (studyPatterns.length === 0) {
      return (
        <div className="no-patterns">
          <h3>📚 No Patterns Selected</h3>
          <p>Please select some patterns from the Overview mode to study with flashcards.</p>
        </div>
      );
    }

    return (
      <div className="flashcard-mode">
        <div className="flashcard-header">
          <h3>🃏 Flashcard Study Mode</h3>
          <div className="progress-info">
            <span>Card {currentIndex + 1} of {studyPatterns.length}</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentIndex + 1) / studyPatterns.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flashcard-container">
          <div className={`flashcard ${showAnswer ? 'flipped' : ''}`}>
            <div className="flashcard-front">
              <div className="card-header">
                <h2>{currentPattern.name}</h2>
                <span className={`difficulty ${currentPattern.difficulty.toLowerCase()}`}>
                  {currentPattern.difficulty}
                </span>
              </div>
              <div className="card-content">
                <h3>❓ Problem</h3>
                <p>{currentPattern.problem}</p>
              </div>
              <button
                className="flip-btn"
                onClick={() => setShowAnswer(true)}
              >
                🔄 Show Solution
              </button>
            </div>

            <div className="flashcard-back">
              <div className="card-header">
                <h2>{currentPattern.name}</h2>
                <span className={`difficulty ${currentPattern.difficulty.toLowerCase()}`}>
                  {currentPattern.difficulty}
                </span>
              </div>
              <div className="card-content">
                <div className="solution-section">
                  <h3>✅ Solution</h3>
                  <p>{currentPattern.solution}</p>
                </div>

                <div className="key-points-section">
                  <h3>🔑 Key Points</h3>
                  <ul>
                    {currentPattern.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="use-cases-section">
                  <h3>🎯 Use Cases</h3>
                  <div className="use-cases">
                    {currentPattern.useCases.map((useCase, index) => (
                      <span key={index} className="use-case-tag">{useCase}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="confidence-buttons">
                <h4>How confident are you with this pattern?</h4>
                <div className="confidence-options">
                  <button
                    className="confidence-btn low"
                    onClick={() => handleConfidence(1)}
                  >
                    😕 Need More Practice
                  </button>
                  <button
                    className="confidence-btn medium"
                    onClick={() => handleConfidence(2)}
                  >
                    😐 Getting There
                  </button>
                  <button
                    className="confidence-btn high"
                    onClick={() => handleConfidence(3)}
                  >
                    😊 Confident
                  </button>
                  <button
                    className="confidence-btn expert"
                    onClick={() => handleConfidence(4)}
                  >
                    🤓 Expert Level
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flashcard-controls">
          <button className="nav-btn" onClick={prevCard}>
            ⬅️ Previous
          </button>
          <button
            className="flip-btn-alt"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? '🔄 Show Problem' : '🔄 Show Solution'}
          </button>
          <button className="nav-btn" onClick={nextCard}>
            Next ➡️
          </button>
        </div>
      </div>
    );
  };

  // Quiz Mode Component
  const QuizMode = ({ patterns, selectedPatterns, studyProgress, updateConfidence }) => {
    const studyPatterns = selectedPatterns.length > 0
      ? patterns.filter(p => selectedPatterns.includes(p.id))
      : patterns;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [quizQuestions, setQuizQuestions] = useState([]);

    useEffect(() => {
      generateQuizQuestions();
    }, [studyPatterns]);

    const generateQuizQuestions = () => {
      const questions = studyPatterns.map(pattern => {
        const otherPatterns = studyPatterns.filter(p => p.id !== pattern.id);
        const wrongAnswers = otherPatterns
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(p => p.solution);

        const allAnswers = [pattern.solution, ...wrongAnswers]
          .sort(() => Math.random() - 0.5);

        return {
          id: pattern.id,
          question: `What is the solution for: ${pattern.problem}`,
          answers: allAnswers,
          correctAnswer: pattern.solution,
          pattern: pattern
        };
      });

      setQuizQuestions(questions.sort(() => Math.random() - 0.5));
    };

    const handleAnswerSelect = (answer) => {
      setSelectedAnswer(answer);
    };

    const submitAnswer = () => {
      const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
      if (isCorrect) {
        setScore(prev => prev + 1);
        updateConfidence(quizQuestions[currentQuestion].id, 3);
      } else {
        updateConfidence(quizQuestions[currentQuestion].id, 1);
      }
      setShowResult(true);
    };

    const nextQuestion = () => {
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentQuestion(prev => prev + 1);
    };

    const restartQuiz = () => {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
      generateQuizQuestions();
    };

    if (studyPatterns.length === 0) {
      return (
        <div className="no-patterns">
          <h3>🎯 No Patterns Selected</h3>
          <p>Please select some patterns from the Overview mode to take the quiz.</p>
        </div>
      );
    }

    if (currentQuestion >= quizQuestions.length) {
      return (
        <div className="quiz-complete">
          <h2>🎉 Quiz Complete!</h2>
          <div className="final-score">
            <span className="score">{score}</span>
            <span className="total">/ {quizQuestions.length}</span>
          </div>
          <div className="score-percentage">
            {Math.round((score / quizQuestions.length) * 100)}%
          </div>
          <button className="restart-btn" onClick={restartQuiz}>
            🔄 Restart Quiz
          </button>
        </div>
      );
    }

    const question = quizQuestions[currentQuestion];

    return (
      <div className="quiz-mode">
        <div className="quiz-header">
          <h3>🎯 Quiz Mode</h3>
          <div className="quiz-progress">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>Score: {score}/{currentQuestion}</span>
          </div>
        </div>

        <div className="quiz-question">
          <h2>{question.pattern.name}</h2>
          <p className="question-text">{question.question}</p>

          <div className="answer-options">
            {question.answers.map((answer, index) => (
              <button
                key={index}
                className={`answer-option ${selectedAnswer === answer ? 'selected' : ''} ${
                  showResult ? (answer === question.correctAnswer ? 'correct' :
                               answer === selectedAnswer ? 'incorrect' : '') : ''
                }`}
                onClick={() => !showResult && handleAnswerSelect(answer)}
                disabled={showResult}
              >
                {answer}
              </button>
            ))}
          </div>

          {!showResult && selectedAnswer && (
            <button className="submit-btn" onClick={submitAnswer}>
              Submit Answer
            </button>
          )}

          {showResult && (
            <div className="result-section">
              <div className={`result ${selectedAnswer === question.correctAnswer ? 'correct' : 'incorrect'}`}>
                {selectedAnswer === question.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
              </div>
              <div className="explanation">
                <h4>💡 Explanation</h4>
                <p>{question.pattern.solution}</p>
              </div>
              {currentQuestion < quizQuestions.length - 1 && (
                <button className="next-btn" onClick={nextQuestion}>
                  Next Question ➡️
                </button>
              )}
              {currentQuestion === quizQuestions.length - 1 && (
                <button className="finish-btn" onClick={nextQuestion}>
                  Finish Quiz 🏁
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Printable Mode Component
  const PrintableMode = ({ patterns, selectedPatterns }) => {
    const studyPatterns = selectedPatterns.length > 0
      ? patterns.filter(p => selectedPatterns.includes(p.id))
      : patterns;

    const printFlashcards = () => {
      window.print();
    };

    return (
      <div className="printable-mode">
        <div className="print-header no-print">
          <h3>🖨️ Printable Flashcards</h3>
          <p>Generate printable flashcards for offline study</p>
          <div className="print-controls">
            <button className="print-btn" onClick={printFlashcards}>
              🖨️ Print Flashcards
            </button>
            <span className="pattern-count">
              {studyPatterns.length} patterns selected
            </span>
          </div>
        </div>

        <div className="printable-cards">
          {studyPatterns.map((pattern, index) => (
            <div key={pattern.id} className="printable-card">
              <div className="card-front">
                <div className="card-number">#{index + 1}</div>
                <h2>{pattern.name}</h2>
                <div className="difficulty-badge">{pattern.difficulty}</div>
                <div className="problem-section">
                  <h3>Problem</h3>
                  <p>{pattern.problem}</p>
                </div>
                <div className="cut-line">✂️ Cut along this line ✂️</div>
              </div>

              <div className="card-back">
                <div className="card-number">#{index + 1} - Answer</div>
                <h2>{pattern.name}</h2>
                <div className="solution-section">
                  <h3>Solution</h3>
                  <p>{pattern.solution}</p>
                </div>
                <div className="key-points">
                  <h4>Key Points:</h4>
                  <ul>
                    {pattern.keyPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="use-cases">
                  <h4>Use Cases:</h4>
                  <p>{pattern.useCases.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="microfrontend-container" data-microfrontend="distributed-systems-patterns">
      <div className="microfrontend-header">
        <span className="microfrontend-badge">🏗️ Microfrontend</span>
        <h2>Distributed Systems Patterns Learning Hub</h2>
        <p className="subtitle">Master 25 essential patterns with interactive flashcards and comprehensive examples</p>
      </div>

      {/* Study Mode Selector */}
      <div className="study-mode-selector">
        <button 
          className={`mode-btn ${studyMode === 'overview' ? 'active' : ''}`}
          onClick={() => setStudyMode('overview')}
        >
          📚 Overview
        </button>
        <button 
          className={`mode-btn ${studyMode === 'flashcards' ? 'active' : ''}`}
          onClick={() => setStudyMode('flashcards')}
        >
          🃏 Flashcards
        </button>
        <button 
          className={`mode-btn ${studyMode === 'quiz' ? 'active' : ''}`}
          onClick={() => setStudyMode('quiz')}
        >
          🎯 Quiz
        </button>
        <button 
          className={`mode-btn ${studyMode === 'printable' ? 'active' : ''}`}
          onClick={() => setStudyMode('printable')}
        >
          🖨️ Printable
        </button>
      </div>

      {studyMode === 'overview' && (
        <div className="overview-mode">
          {/* Category Tabs */}
          <div className="category-tabs">
            {Object.keys(patterns).map(category => (
              <button
                key={category}
                className={`tab-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {patterns[category].title}
              </button>
            ))}
          </div>

          {/* Category Content */}
          <div className="category-content">
            <div className="category-header">
              <h2>{patterns[selectedCategory].title}</h2>
              <p className="category-description">{patterns[selectedCategory].description}</p>
            </div>

            <div className="patterns-grid">
              {patterns[selectedCategory].patterns.map(pattern => (
                <div key={pattern.id} className="pattern-card">
                  <div className="pattern-header">
                    <h3>{pattern.name}</h3>
                    <div className="pattern-meta">
                      <span className={`difficulty ${pattern.difficulty.toLowerCase()}`}>
                        {pattern.difficulty}
                      </span>
                      <label className="pattern-select">
                        <input
                          type="checkbox"
                          checked={selectedPatterns.includes(pattern.id)}
                          onChange={() => handlePatternSelect(pattern.id)}
                        />
                        Study
                      </label>
                    </div>
                  </div>

                  <div className="pattern-content">
                    <div className="problem-section">
                      <h4>❓ Problem</h4>
                      <p>{pattern.problem}</p>
                    </div>

                    <div className="solution-section">
                      <h4>✅ Solution</h4>
                      <p>{pattern.solution}</p>
                    </div>

                    <div className="key-points-section">
                      <h4>🔑 Key Points</h4>
                      <ul>
                        {pattern.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pattern-footer">
                    <button
                      className="study-btn"
                      onClick={() => markAsStudied(pattern.id)}
                    >
                      {studyProgress[pattern.id]?.studied ? '✅ Studied' : '📖 Mark as Studied'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {studyMode === 'flashcards' && (
        <FlashcardMode
          patterns={getAllPatterns()}
          selectedPatterns={selectedPatterns}
          studyProgress={studyProgress}
          updateConfidence={updateConfidence}
          markAsStudied={markAsStudied}
        />
      )}

      {studyMode === 'quiz' && (
        <QuizMode
          patterns={getAllPatterns()}
          selectedPatterns={selectedPatterns}
          studyProgress={studyProgress}
          updateConfidence={updateConfidence}
        />
      )}

      {studyMode === 'printable' && (
        <PrintableMode
          patterns={getAllPatterns()}
          selectedPatterns={selectedPatterns}
        />
      )}
    </div>
  );
};

// Export metadata for the microfrontend
export const metadata = {
  name: 'distributed-systems-patterns',
  version: '1.0.0',
  description: 'Comprehensive learning hub for distributed systems patterns with flashcards and interactive features',
  author: 'Learning Platform',
  dependencies: ['react', 'react-dom'],
  routes: ['/distributed-patterns'],
  capabilities: [
    'pattern-learning',
    'flashcard-system',
    'printable-cards',
    'progress-tracking',
    'interactive-examples',
    'code-implementations'
  ],
  tags: ['distributed-systems', 'patterns', 'architecture', 'flashcards', 'learning']
};

export default DistributedSystemsPatternsMicrofrontend;
