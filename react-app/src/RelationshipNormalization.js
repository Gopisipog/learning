import React, { useState } from 'react';
import './RelationshipNormalization.css';

const RelationshipNormalization = () => {
  const [selectedRelationships, setSelectedRelationships] = useState([]);
  const [selectedNormalizations, setSelectedNormalizations] = useState([]);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [viewMode, setViewMode] = useState('categories'); // 'categories' or 'all-items'
  const [expandedPrompts, setExpandedPrompts] = useState({}); // Track which prompts are expanded

  // Relationship types with dynamic details
  const relationshipTypes = [
    {
      id: 'sequential',
      title: 'Sequential Relationships',
      description: 'Operations that must execute in order',
      details: [
        'Dependency chains where output of first becomes input of second',
        'Pipeline processing with data transformation stages',
        'Step-by-step validation and processing workflows',
        'Database transaction sequences with rollback capabilities'
      ]
    },
    {
      id: 'parallel',
      title: 'Parallel Relationships', 
      description: 'Operations that can execute simultaneously',
      details: [
        'Independent operations that can run concurrently',
        'Synchronized parallel execution with shared resources',
        'Load balancing across multiple processing units',
        'Event-driven parallel workflows with coordination'
      ]
    },
    {
      id: 'conditional',
      title: 'Conditional Relationships',
      description: 'Operations based on runtime conditions',
      details: [
        'Alternative execution paths based on business rules',
        'Fallback mechanisms for error handling scenarios',
        'Feature flags controlling different code branches',
        'Dynamic routing based on user permissions or data'
      ]
    },
    {
      id: 'iterative',
      title: 'Iterative Relationships',
      description: 'Repeated operations building toward a goal',
      details: [
        'Loop-based processing with incremental progress tracking',
        'Accumulative operations building complex results',
        'Recursive algorithms with base case termination',
        'Batch processing with checkpoint and resume capabilities'
      ]
    }
  ];

  // Normalization techniques with dynamic details
  const normalizationTechniques = [
    {
      id: 'structural',
      title: 'Code Structure Normalization',
      description: 'Standardizing code organization patterns',
      details: [
        'Function extraction to eliminate code duplication',
        'Interface standardization for consistent API contracts',
        'Module organization following single responsibility principle',
        'Design pattern implementation for common solutions'
      ]
    },
    {
      id: 'dataflow',
      title: 'Data Flow Normalization',
      description: 'Standardizing data handling patterns',
      details: [
        'Parameter standardization using common data containers',
        'Return type normalization with Result<T> patterns',
        'Data transformation pipelines with consistent interfaces',
        'Serialization standards across different data formats'
      ]
    },
    {
      id: 'behavioral',
      title: 'Behavioral Normalization',
      description: 'Standardizing component behavior patterns',
      details: [
        'Command pattern for consistent action handling',
        'Strategy pattern for algorithm interchangeability',
        'Observer pattern for event-driven architectures',
        'State machine patterns for complex workflow management'
      ]
    },
    {
      id: 'architectural',
      title: 'Architectural Normalization',
      description: 'Standardizing system-level patterns',
      details: [
        'Dependency injection for loose coupling',
        'Middleware patterns for cross-cutting concerns',
        'Microservices communication standards',
        'API versioning and backward compatibility strategies'
      ]
    }
  ];

  const handleRelationshipChange = (relationshipId, detailIndex) => {
    const key = `${relationshipId}-${detailIndex}`;
    setSelectedRelationships(prev =>
      prev.includes(key)
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );

    // Auto-expand prompts when item is selected
    if (!selectedRelationships.includes(key)) {
      setExpandedPrompts(prev => ({
        ...prev,
        [key]: true
      }));
    }
  };

  const handleNormalizationChange = (normalizationId, detailIndex) => {
    const key = `${normalizationId}-${detailIndex}`;
    setSelectedNormalizations(prev =>
      prev.includes(key)
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );

    // Auto-expand prompts when item is selected
    if (!selectedNormalizations.includes(key)) {
      setExpandedPrompts(prev => ({
        ...prev,
        [key]: true
      }));
    }
  };

  const togglePromptExpansion = (key) => {
    setExpandedPrompts(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const generateReport = () => {
    const relationshipData = selectedRelationships.map(key => {
      const [typeId, detailIndex] = key.split('-');
      const type = relationshipTypes.find(r => r.id === typeId);
      return {
        category: 'Relationship',
        type: type.title,
        detail: type.details[parseInt(detailIndex)],
        implementation: getImplementationExample(type.id, parseInt(detailIndex)),
        explanation: getRelationshipExplanation(typeId, parseInt(detailIndex)),
        followUpPrompts: getRelationshipFollowUps(typeId, parseInt(detailIndex)),
        practiceQuestions: getRelationshipQuestions(typeId, parseInt(detailIndex))
      };
    });

    const normalizationData = selectedNormalizations.map(key => {
      const [typeId, detailIndex] = key.split('-');
      const type = normalizationTechniques.find(n => n.id === typeId);
      return {
        category: 'Normalization',
        type: type.title,
        detail: type.details[parseInt(detailIndex)],
        implementation: getNormalizationExample(type.id, parseInt(detailIndex)),
        explanation: getNormalizationExplanation(typeId, parseInt(detailIndex)),
        followUpPrompts: getNormalizationFollowUps(typeId, parseInt(detailIndex)),
        practiceQuestions: getNormalizationQuestions(typeId, parseInt(detailIndex))
      };
    });

    setReportData({
      relationships: relationshipData,
      normalizations: normalizationData,
      totalSelected: relationshipData.length + normalizationData.length,
      generatedAt: new Date().toLocaleString(),
      summary: generateReportSummary(relationshipData, normalizationData),
      recommendations: generateRecommendations(relationshipData, normalizationData)
    });
    setReportGenerated(true);
  };

  const getImplementationExample = (typeId, detailIndex) => {
    const examples = {
      sequential: [
        'const data = await fetchData(); const result = await processData(data);',
        'pipeline.addStage(validate).addStage(transform).addStage(save);',
        'try { validate(input); process(input); } catch(e) { rollback(); }',
        'await transaction.begin(); await operation1(); await operation2(); await transaction.commit();'
      ],
      parallel: [
        'Promise.all([operation1(), operation2(), operation3()]);',
        'await Promise.allSettled([task1, task2]).then(synchronize);',
        'loadBalancer.distribute([server1, server2, server3]);',
        'eventBus.emit("process", data); // Multiple handlers respond'
      ],
      conditional: [
        'const result = condition ? primaryOperation() : alternativeOperation();',
        'try { primaryService.call(); } catch { fallbackService.call(); }',
        'if (featureFlag.enabled) { newFeature(); } else { legacyFeature(); }',
        'const handler = userRole === "admin" ? adminHandler : userHandler;'
      ],
      iterative: [
        'for (const item of items) { progress += processItem(item); }',
        'const total = items.reduce((acc, item) => acc + item.value, 0);',
        'function factorial(n) { return n <= 1 ? 1 : n * factorial(n-1); }',
        'while (hasMore) { const batch = getBatch(); process(batch); checkpoint(); }'
      ]
    };
    return examples[typeId]?.[detailIndex] || 'Example implementation';
  };

  const getNormalizationExample = (typeId, detailIndex) => {
    const examples = {
      'code-structure': [
        'function extractCommonLogic() { /* shared implementation */ }',
        `// Interface Standardization for Consistent API Contracts
interface IDataProcessor<T> {
  validate(data: T): ValidationResult;
  process(data: T): Promise<ProcessResult<T>>;
  cleanup(): void;
}

interface IUserService {
  createUser(userData: CreateUserRequest): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  updateUser(id: string, updates: UpdateUserRequest): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
}

// Consistent implementation across different services
class DatabaseUserService implements IUserService {
  async createUser(userData: CreateUserRequest): Promise<User> {
    // Database-specific implementation with consistent contract
    const validation = this.validateUserData(userData);
    if (!validation.isValid) throw new ValidationError(validation.errors);
    return await this.db.users.create(userData);
  }
}

class ApiUserService implements IUserService {
  async createUser(userData: CreateUserRequest): Promise<User> {
    // API-specific implementation with same contract
    const validation = this.validateUserData(userData);
    if (!validation.isValid) throw new ValidationError(validation.errors);
    return await this.apiClient.post('/users', userData);
  }
}`,
        'class UserModule { constructor(private userService: UserService) {} }',
        'class UserFactory implements IFactory<User> { create(): User; }'
      ],
      'dataflow': [
        'class RequestDto { constructor(public data: any, public metadata: Meta) {} }',
        'type Result<T> = { success: boolean; data?: T; error?: string; }',
        'const pipeline = new DataPipeline<Input, Output>();',
        'const serializer = new JsonSerializer<UserData>();'
      ],
      'behavioral': [
        'class SaveCommand implements ICommand { execute(): Promise<void>; }',
        'class QuickSort implements ISortStrategy { sort(array: T[]): T[]; }',
        'observable.subscribe(observer => observer.update(data));',
        'stateMachine.transition("processing", "completed");'
      ],
      'architectural': [
        'constructor(@inject("UserService") private userService: IUserService) {}',
        'app.use(authMiddleware); app.use(loggingMiddleware);',
        'const response = await microservice.call("user-service", request);',
        'const v2Handler = apiVersion >= 2 ? newHandler : legacyHandler;'
      ]
    };
    return examples[typeId]?.[detailIndex] || 'Example implementation';
  };

  const getRelationshipExplanation = (typeId, detailIndex) => {
    const explanations = {
      sequential: [
        'Sequential relationships ensure that operations execute in a specific order, where each step depends on the completion of the previous one. This pattern is crucial for maintaining data consistency and preventing race conditions in software systems.',
        'Pipeline architectures break down complex processes into discrete stages, allowing for better modularity and parallel processing. Each stage can be optimized independently while maintaining the overall flow integrity.',
        'Error handling in sequential operations requires careful consideration of rollback mechanisms and state recovery. When one step fails, the system must be able to undo previous operations to maintain consistency.',
        'Checkpoint systems provide recovery points in long-running sequential processes, allowing for graceful restart from known good states rather than complete re-execution.'
      ],
      parallel: [
        'Parallel relationships enable concurrent execution of independent operations, significantly improving system performance and resource utilization. This pattern is essential for scalable software architectures.',
        'Load balancing distributes work across multiple processing units, ensuring optimal resource utilization and preventing bottlenecks. Effective load balancing requires understanding of workload characteristics and system capabilities.',
        'Synchronization mechanisms coordinate parallel operations when they need to share resources or reach consensus. Common patterns include locks, semaphores, and message passing.',
        'Result aggregation combines outputs from parallel operations into a coherent final result. This requires careful handling of partial failures and result ordering.'
      ],
      conditional: [
        'Conditional relationships implement decision-making logic in software systems, allowing for dynamic behavior based on runtime conditions. This pattern enables adaptive and responsive applications.',
        'Strategy patterns encapsulate different algorithms or behaviors, allowing runtime selection based on context. This promotes flexibility and maintainability in complex systems.',
        'Guard clauses provide early validation and error prevention, improving code readability and reducing nested conditional complexity.',
        'State machines model complex conditional logic with clear state transitions, making system behavior predictable and testable.'
      ],
      iterative: [
        'Iterative relationships process collections of data or repeat operations until specific conditions are met. This pattern is fundamental for data processing and algorithmic implementations.',
        'Functional programming approaches like map, filter, and reduce provide declarative ways to process collections, improving code clarity and reducing bugs.',
        'Recursive algorithms solve problems by breaking them into smaller subproblems, particularly useful for tree structures and mathematical computations.',
        'Batch processing with checkpoints enables handling of large datasets while providing recovery capabilities and progress tracking.'
      ]
    };
    return explanations[typeId]?.[detailIndex] || 'Detailed explanation of this relationship pattern.';
  };

  const getNormalizationExplanation = (typeId, detailIndex) => {
    const explanations = {
      'code-structure': [
        'Function extraction eliminates code duplication by identifying common logic and creating reusable functions. This improves maintainability and reduces the risk of inconsistent implementations across the codebase.',
        'Interface standardization creates consistent API contracts that define clear boundaries between components. By establishing uniform method signatures, return types, and error handling patterns, interfaces enable polymorphism, improve testability through mocking, and facilitate team collaboration by providing clear contracts. This approach allows different implementations to be swapped seamlessly while maintaining the same external behavior, making the system more flexible and maintainable.',
        'Module organization following single responsibility principle ensures that each module has a clear, focused purpose. This makes the codebase easier to understand, test, and modify.',
        'Design pattern implementation provides proven solutions to common problems, improving code quality and developer productivity through established best practices.'
      ],
      'dataflow': [
        'Parameter standardization using common data containers ensures consistent data handling across different parts of the system. This reduces integration complexity and improves data validation.',
        'Return type normalization with Result<T> patterns provides consistent error handling and makes success/failure states explicit. This improves code reliability and debugging capabilities.',
        'Data transformation pipelines with consistent interfaces enable composable data processing workflows. This promotes reusability and makes complex data transformations more manageable.',
        'Serialization standards across different data formats ensure consistent data exchange between systems and storage mechanisms, reducing integration issues.'
      ],
      'behavioral': [
        'Command pattern provides consistent action handling by encapsulating requests as objects. This enables features like undo/redo, queuing, and logging of operations.',
        'Strategy pattern enables algorithm interchangeability by defining a family of algorithms and making them interchangeable. This promotes flexibility and testability.',
        'Observer pattern facilitates event-driven architectures by defining a subscription mechanism for notifying multiple objects about state changes.',
        'State machine patterns manage complex workflow logic by explicitly modeling states and transitions, making system behavior predictable and easier to debug.'
      ],
      'architectural': [
        'Dependency injection promotes loose coupling by removing hard dependencies between components. This improves testability, flexibility, and maintainability of the system.',
        'Middleware patterns handle cross-cutting concerns like authentication, logging, and validation in a consistent manner across the application.',
        'Microservices communication standards ensure reliable and consistent inter-service communication, enabling scalable distributed architectures.',
        'API versioning and backward compatibility strategies allow systems to evolve while maintaining compatibility with existing clients and integrations.'
      ]
    };
    return explanations[typeId]?.[detailIndex] || 'Detailed explanation of this normalization technique.';
  };

  const getRelationshipFollowUps = (typeId, detailIndex) => {
    const followUps = {
      sequential: [
        ['How would you handle partial failures in a sequential pipeline?', 'What are the trade-offs between synchronous and asynchronous sequential processing?', 'How can you optimize sequential operations for better performance?'],
        ['What are the benefits of breaking down monolithic processes into pipeline stages?', 'How do you handle backpressure in data processing pipelines?', 'What monitoring strategies work best for pipeline architectures?'],
        ['What are the key principles of effective error handling in sequential systems?', 'How do you implement compensating transactions for rollback scenarios?', 'What are the differences between fail-fast and graceful degradation strategies?'],
        ['How do you determine optimal checkpoint intervals in long-running processes?', 'What data should be included in checkpoint states?', 'How do you handle checkpoint corruption or unavailability?']
      ],
      parallel: [
        ['What are the main challenges in coordinating parallel operations?', 'How do you handle shared state in parallel processing?', 'What are the performance implications of different parallelization strategies?'],
        ['How do you implement effective load balancing algorithms?', 'What metrics should you monitor for load balancing effectiveness?', 'How do you handle dynamic scaling in load-balanced systems?'],
        ['What are the trade-offs between different synchronization mechanisms?', 'How do you prevent deadlocks in concurrent systems?', 'What are the performance implications of various locking strategies?'],
        ['How do you handle partial failures in parallel operations?', 'What strategies work best for result ordering in parallel processing?', 'How do you implement timeout handling for parallel operations?']
      ],
      conditional: [
        ['How do you test complex conditional logic effectively?', 'What are the maintainability implications of deeply nested conditions?', 'How do you handle edge cases in conditional systems?'],
        ['How do you choose between different strategy implementations?', 'What are the performance implications of runtime strategy selection?', 'How do you handle strategy initialization and cleanup?'],
        ['How do you balance early validation with performance considerations?', 'What are the best practices for error message design in guard clauses?', 'How do you handle cascading validation failures?'],
        ['How do you design state machines for complex business workflows?', 'What are the testing strategies for state machine implementations?', 'How do you handle state persistence and recovery?']
      ],
      iterative: [
        ['How do you optimize iterative operations for large datasets?', 'What are the memory implications of different iteration strategies?', 'How do you handle early termination in iterative processes?'],
        ['What are the performance characteristics of functional vs imperative iteration?', 'How do you handle side effects in functional programming approaches?', 'What are the debugging strategies for functional pipelines?'],
        ['How do you prevent stack overflow in recursive algorithms?', 'What are the trade-offs between recursion and iteration?', 'How do you optimize tail-recursive functions?'],
        ['How do you determine optimal batch sizes for processing?', 'What are the recovery strategies for failed batch operations?', 'How do you handle progress reporting in batch processing?']
      ]
    };
    return followUps[typeId]?.[detailIndex] || ['What are the key considerations for this pattern?', 'How would you implement this in a production system?', 'What are the potential pitfalls to avoid?'];
  };

  const getNormalizationFollowUps = (typeId, detailIndex) => {
    const followUps = {
      'code-structure': [
        ['How do you identify candidates for function extraction?', 'What are the trade-offs between function granularity and readability?', 'How do you handle shared dependencies in extracted functions?'],
        ['How do you design interfaces that balance flexibility with stability over time?', 'What strategies work best for evolving interfaces without breaking existing implementations?', 'How do you handle interface versioning when supporting multiple client versions simultaneously?', 'What are the key principles for designing interfaces that promote loose coupling?', 'How do you ensure interface contracts are comprehensive enough to prevent implementation inconsistencies?'],
        ['How do you enforce single responsibility principle in large codebases?', 'What are the indicators that a module is violating SRP?', 'How do you refactor modules that have grown too large?'],
        ['How do you choose the right design pattern for a specific problem?', 'What are the maintenance implications of pattern overuse?', 'How do you document pattern usage for team understanding?']
      ],
      'dataflow': [
        ['How do you design data containers that are both type-safe and flexible?', 'What are the performance implications of parameter normalization?', 'How do you handle parameter validation in normalized systems?'],
        ['How do you design Result<T> types that provide meaningful error information?', 'What are the ergonomics considerations for Result type usage?', 'How do you handle nested Result types in complex operations?'],
        ['How do you design composable pipeline interfaces?', 'What are the error handling strategies in data pipelines?', 'How do you handle pipeline performance optimization?'],
        ['How do you choose between different serialization formats?', 'What are the security considerations in serialization standards?', 'How do you handle schema evolution in serialized data?']
      ],
      'behavioral': [
        ['How do you design command interfaces that are both simple and powerful?', 'What are the performance implications of command pattern usage?', 'How do you handle command validation and authorization?'],
        ['How do you design strategy interfaces that promote code reuse?', 'What are the dependency injection considerations for strategy patterns?', 'How do you handle strategy configuration and selection?'],
        ['How do you design observer interfaces that prevent memory leaks?', 'What are the threading considerations in observer patterns?', 'How do you handle observer notification ordering?'],
        ['How do you design state machines that are both expressive and maintainable?', 'What are the testing strategies for complex state machines?', 'How do you handle state machine persistence and recovery?']
      ],
      'architectural': [
        ['How do you design dependency injection containers that are both powerful and simple?', 'What are the performance implications of dependency injection?', 'How do you handle circular dependencies in DI systems?'],
        ['How do you design middleware that is both reusable and configurable?', 'What are the ordering considerations for middleware execution?', 'How do you handle middleware error propagation?'],
        ['How do you design service communication protocols that are both reliable and performant?', 'What are the security considerations in microservices communication?', 'How do you handle service discovery and load balancing?'],
        ['How do you design API versioning strategies that minimize breaking changes?', 'What are the client migration strategies for API evolution?', 'How do you handle deprecation and sunset of old API versions?']
      ]
    };
    return followUps[typeId]?.[detailIndex] || ['What are the implementation challenges for this technique?', 'How would you measure the effectiveness of this normalization?', 'What are the long-term maintenance considerations?'];
  };

  const getRelationshipQuestions = (typeId, detailIndex) => {
    const questions = {
      sequential: [
        ['Design a sequential data processing pipeline for user registration that includes validation, database storage, and email notification.', 'Implement error handling for a sequential payment processing system with rollback capabilities.', 'Create a sequential deployment pipeline with automated testing and rollback mechanisms.'],
        ['Design a multi-stage image processing pipeline that can handle different image formats and transformations.', 'Implement a data ingestion pipeline that processes files sequentially with error recovery.', 'Create a build pipeline that compiles, tests, and packages software components in sequence.'],
        ['Implement a transaction system with proper rollback mechanisms for database operations.', 'Design an error handling strategy for a sequential API call chain with retry logic.', 'Create a sequential workflow engine that can recover from failures at any step.'],
        ['Design a checkpoint system for a long-running data migration process.', 'Implement progress tracking and recovery for a sequential batch processing system.', 'Create a checkpoint mechanism for a multi-step machine learning training pipeline.']
      ],
      parallel: [
        ['Design a parallel processing system for handling multiple user requests simultaneously.', 'Implement a parallel data processing pipeline that can scale based on workload.', 'Create a parallel testing framework that can run tests concurrently.'],
        ['Implement a load balancer that distributes requests across multiple server instances.', 'Design a load balancing strategy for a microservices architecture.', 'Create a dynamic load balancing system that adapts to server performance.'],
        ['Design a synchronization mechanism for parallel workers accessing shared resources.', 'Implement a parallel algorithm with proper synchronization for data consistency.', 'Create a concurrent data structure with thread-safe operations.'],
        ['Implement a parallel map-reduce operation with result aggregation.', 'Design a parallel processing system that handles partial failures gracefully.', 'Create a parallel computation framework with result ordering guarantees.']
      ],
      conditional: [
        ['Design a conditional routing system for different user types in a web application.', 'Implement a feature flag system that enables conditional functionality.', 'Create a conditional validation system based on user input types.'],
        ['Implement a strategy pattern for different payment processing methods.', 'Design a conditional algorithm selection system based on data characteristics.', 'Create a strategy-based notification system for different communication channels.'],
        ['Design a validation system with guard clauses for API input validation.', 'Implement early return patterns for complex business logic validation.', 'Create a guard clause system for security authorization checks.'],
        ['Design a state machine for a complex order processing workflow.', 'Implement a conditional workflow engine for business process automation.', 'Create a state-based user interface navigation system.']
      ],
      iterative: [
        ['Design an iterative algorithm for processing large datasets with memory constraints.', 'Implement a pagination system for iterating through database records.', 'Create an iterative file processing system for large log files.'],
        ['Implement functional programming patterns for data transformation pipelines.', 'Design a functional approach to iterative data aggregation.', 'Create a functional programming solution for iterative calculations.'],
        ['Design a recursive algorithm for tree traversal with cycle detection.', 'Implement a recursive solution for hierarchical data processing.', 'Create a recursive algorithm for parsing nested data structures.'],
        ['Design a batch processing system for handling large volumes of transactions.', 'Implement an iterative data migration system with progress tracking.', 'Create a batch processing framework with error handling and recovery.']
      ]
    };
    return questions[typeId]?.[detailIndex] || ['Design a system that implements this relationship pattern.', 'Create a practical example of this pattern in a real-world scenario.', 'Implement error handling for this relationship type.'];
  };

  const getNormalizationQuestions = (typeId, detailIndex) => {
    const questions = {
      'code-structure': [
        ['Refactor a large monolithic function by extracting smaller, focused functions.', 'Design a set of interfaces for a plugin architecture system.', 'Implement function extraction for a complex data processing algorithm.'],
        ['Design a comprehensive interface standard for a payment processing system that supports multiple payment providers (credit cards, PayPal, cryptocurrency) while maintaining consistent error handling and transaction tracking.', 'Create a standardized interface for a content management system that allows different storage backends (database, file system, cloud storage) to be used interchangeably without changing client code.', 'Implement interface standardization for a notification system that supports multiple channels (email, SMS, push notifications, webhooks) with consistent delivery tracking and retry mechanisms.', 'Design interfaces for a multi-tenant SaaS application where different tenants can have custom business logic while maintaining consistent API contracts for core functionality.'],
        ['Refactor a large module into smaller modules following single responsibility principle.', 'Design a modular architecture for a complex business application.', 'Implement module organization for a scalable web application.'],
        ['Implement the Observer pattern for a real-time notification system.', 'Design a Factory pattern for creating different types of database connections.', 'Create a Strategy pattern for different sorting algorithms.']
      ],
      'dataflow': [
        ['Design a standardized parameter system for a REST API.', 'Implement parameter normalization for a data processing pipeline.', 'Create a type-safe parameter system for function calls.'],
        ['Implement a Result<T> type system for error handling in API calls.', 'Design a consistent return type system for database operations.', 'Create a normalized response format for microservices communication.'],
        ['Design a data transformation pipeline for ETL operations.', 'Implement a composable data processing system with consistent interfaces.', 'Create a data pipeline for real-time stream processing.'],
        ['Design a serialization standard for cross-platform data exchange.', 'Implement consistent serialization for different data formats (JSON, XML, Binary).', 'Create a serialization system that handles schema evolution.']
      ],
      'behavioral': [
        ['Implement the Command pattern for a text editor with undo/redo functionality.', 'Design a command system for a distributed task processing framework.', 'Create a command pattern implementation for API request handling.'],
        ['Implement the Strategy pattern for different compression algorithms.', 'Design a strategy system for different authentication methods.', 'Create a strategy pattern for different pricing calculation methods.'],
        ['Implement the Observer pattern for a model-view architecture.', 'Design an event-driven system using observer pattern for real-time updates.', 'Create an observer system for monitoring application health metrics.'],
        ['Design a state machine for a complex user workflow (e.g., order processing).', 'Implement a state machine for a game character behavior system.', 'Create a state machine for managing connection states in a network application.']
      ],
      'architectural': [
        ['Design a dependency injection system for a web application framework.', 'Implement dependency injection for a microservices architecture.', 'Create a DI container that supports different object lifetimes.'],
        ['Design a middleware system for cross-cutting concerns in a web API.', 'Implement middleware for authentication, logging, and error handling.', 'Create a configurable middleware pipeline for request processing.'],
        ['Design a communication protocol for microservices with service discovery.', 'Implement a reliable messaging system for distributed services.', 'Create a microservices architecture with proper service boundaries.'],
        ['Design an API versioning strategy that supports multiple client versions.', 'Implement backward compatibility for evolving API contracts.', 'Create a versioning system that handles deprecation and migration.']
      ]
    };
    return questions[typeId]?.[detailIndex] || ['Implement this normalization technique in a practical scenario.', 'Design a system that demonstrates this normalization approach.', 'Create a refactoring plan that applies this normalization technique.'];
  };

  const generateReportSummary = (relationshipData, normalizationData) => {
    const totalItems = relationshipData.length + normalizationData.length;
    const relationshipTypes = [...new Set(relationshipData.map(item => item.type))];
    const normalizationTypes = [...new Set(normalizationData.map(item => item.type))];

    return {
      totalItems,
      relationshipCount: relationshipData.length,
      normalizationCount: normalizationData.length,
      relationshipTypes,
      normalizationTypes,
      coverageAnalysis: {
        relationshipCoverage: `${relationshipTypes.length}/4 relationship types selected`,
        normalizationCoverage: `${normalizationTypes.length}/4 normalization types selected`,
        overallCoverage: `${totalItems}/32 total items selected (${Math.round((totalItems/32)*100)}%)`
      }
    };
  };

  const generateRecommendations = (relationshipData, normalizationData) => {
    const recommendations = [];
    const relationshipTypes = relationshipData.map(item => item.type);
    const normalizationTypes = normalizationData.map(item => item.type);

    // Relationship recommendations
    if (!relationshipTypes.includes('Sequential Relationships')) {
      recommendations.push('Consider exploring Sequential Relationships for ordered processing workflows and pipeline architectures.');
    }
    if (!relationshipTypes.includes('Parallel Relationships')) {
      recommendations.push('Parallel Relationships are crucial for scalable systems - consider studying load balancing and synchronization patterns.');
    }
    if (!relationshipTypes.includes('Conditional Relationships')) {
      recommendations.push('Conditional Relationships help with decision-making logic - explore strategy patterns and state machines.');
    }
    if (!relationshipTypes.includes('Iterative Relationships')) {
      recommendations.push('Iterative Relationships are fundamental for data processing - study functional programming and batch processing patterns.');
    }

    // Normalization recommendations
    if (!normalizationTypes.includes('Code Structure Normalization')) {
      recommendations.push('Code Structure Normalization improves maintainability - focus on function extraction and interface design.');
    }
    if (!normalizationTypes.includes('Data Flow Normalization')) {
      recommendations.push('Data Flow Normalization ensures consistent data handling - study Result types and pipeline patterns.');
    }
    if (!normalizationTypes.includes('Behavioral Normalization')) {
      recommendations.push('Behavioral Normalization standardizes component behavior - explore Command, Strategy, and Observer patterns.');
    }
    if (!normalizationTypes.includes('Architectural Normalization')) {
      recommendations.push('Architectural Normalization is key for scalable systems - study dependency injection and microservices patterns.');
    }

    // Combination recommendations
    if (relationshipData.length > 0 && normalizationData.length === 0) {
      recommendations.push('Consider balancing relationship patterns with normalization techniques for comprehensive system design.');
    }
    if (normalizationData.length > 0 && relationshipData.length === 0) {
      recommendations.push('Complement normalization techniques with relationship patterns for complete architectural understanding.');
    }

    return recommendations;
  };

  const clearSelections = () => {
    setSelectedRelationships([]);
    setSelectedNormalizations([]);
    setReportGenerated(false);
    setReportData(null);
    setExpandedPrompts({}); // Clear expanded prompts
  };

  const exportReport = () => {
    if (!reportData) return;

    const reportText = `
COMPREHENSIVE SOFTWARE DEVELOPMENT LEARNING REPORT
==================================================
Generated: ${reportData.generatedAt}
Total Items Selected: ${reportData.totalSelected}

LEARNING SUMMARY
================
${reportData.summary ? `
Coverage Analysis:
- ${reportData.summary.coverageAnalysis.relationshipCoverage}
- ${reportData.summary.coverageAnalysis.normalizationCoverage}
- ${reportData.summary.coverageAnalysis.overallCoverage}

Selected Relationship Types: ${reportData.summary.relationshipTypes.join(', ')}
Selected Normalization Types: ${reportData.summary.normalizationTypes.join(', ')}
` : ''}

LEARNING RECOMMENDATIONS
========================
${reportData.recommendations ? reportData.recommendations.map(rec => `• ${rec}`).join('\n') : 'No specific recommendations available.'}

RELATIONSHIP PATTERNS DEEP DIVE
===============================
${reportData.relationships.map(item => `
${item.type}
${'='.repeat(item.type.length)}

Pattern: ${item.detail}

Explanation:
${item.explanation}

Implementation Example:
${item.implementation}

Follow-up Questions:
${item.followUpPrompts.map(prompt => `• ${prompt}`).join('\n')}

Practice Challenges:
${item.practiceQuestions.map((question, idx) => `${idx + 1}. ${question}`).join('\n')}

${'─'.repeat(80)}
`).join('\n')}

NORMALIZATION TECHNIQUES DEEP DIVE
==================================
${reportData.normalizations.map(item => `
${item.type}
${'='.repeat(item.type.length)}

Technique: ${item.detail}

Explanation:
${item.explanation}

Implementation Example:
${item.implementation}

Follow-up Questions:
${item.followUpPrompts.map(prompt => `• ${prompt}`).join('\n')}

Practice Challenges:
${item.practiceQuestions.map((question, idx) => `${idx + 1}. ${question}`).join('\n')}

${'─'.repeat(80)}
`).join('\n')}

END OF REPORT
=============
This comprehensive report includes detailed explanations, follow-up questions, and practice challenges to enhance your learning experience in software development patterns and techniques.
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprehensive-learning-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filterItems = (items, category) => {
    if (filterCategory === 'all') return items;
    return items.filter(item => item.id.includes(filterCategory));
  };

  const searchItems = (items) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.some(detail => detail.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getFilteredRelationships = () => {
    return searchItems(filterItems(relationshipTypes, filterCategory));
  };

  const getFilteredNormalizations = () => {
    return searchItems(filterItems(normalizationTechniques, filterCategory));
  };

  // Flatten all items for pagination view
  const getAllItems = () => {
    const relationshipItems = relationshipTypes.flatMap(type =>
      type.details.map((detail, index) => ({
        id: `${type.id}-${index}`,
        category: 'Relationship',
        type: type.title,
        typeId: type.id,
        description: type.description,
        detail: detail,
        detailIndex: index,
        implementation: getImplementationExample(type.id, index),
        isSelected: selectedRelationships.includes(`${type.id}-${index}`)
      }))
    );

    const normalizationItems = normalizationTechniques.flatMap(type =>
      type.details.map((detail, index) => ({
        id: `${type.id}-${index}`,
        category: 'Normalization',
        type: type.title,
        typeId: type.id,
        description: type.description,
        detail: detail,
        detailIndex: index,
        implementation: getNormalizationExample(type.id, index),
        isSelected: selectedNormalizations.includes(`${type.id}-${index}`)
      }))
    );

    return [...relationshipItems, ...normalizationItems];
  };

  const getFilteredAllItems = () => {
    let items = getAllItems();

    // Apply category filter
    if (filterCategory !== 'all') {
      items = items.filter(item => item.typeId === filterCategory);
    }

    // Apply search filter
    if (searchTerm) {
      items = items.filter(item =>
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.detail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items;
  };

  const getPaginatedItems = () => {
    const filteredItems = getFilteredAllItems();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const filteredItems = getFilteredAllItems();
    return Math.ceil(filteredItems.length / itemsPerPage);
  };

  const handleItemToggle = (item) => {
    if (item.category === 'Relationship') {
      handleRelationshipChange(item.typeId, item.detailIndex);
    } else {
      handleNormalizationChange(item.typeId, item.detailIndex);
    }

    // Auto-expand prompts when item is selected in all-items view
    if (!item.isSelected) {
      setExpandedPrompts(prev => ({
        ...prev,
        [item.id]: true
      }));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="relationship-normalization">
      <div className="header">
        <h1>🔗 Software Development Relationships & Normalization</h1>
        <p className="subtitle">
          Explore how two sentences (code components) can work together and be normalized for better software architecture
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="controls-section">
        <div className="search-filter-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search relationships and normalizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="sequential">Sequential</option>
              <option value="parallel">Parallel</option>
              <option value="conditional">Conditional</option>
              <option value="iterative">Iterative</option>
              <option value="structural">Structural</option>
              <option value="dataflow">Data Flow</option>
              <option value="behavioral">Behavioral</option>
              <option value="architectural">Architectural</option>
            </select>

            <button
              className="advanced-toggle"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              ⚙️ {showAdvancedOptions ? 'Hide' : 'Show'} Advanced
            </button>

            <button
              className={`view-toggle ${viewMode === 'all-items' ? 'active' : ''}`}
              onClick={() => {
                setViewMode(viewMode === 'categories' ? 'all-items' : 'categories');
                setCurrentPage(1);
              }}
            >
              📋 {viewMode === 'categories' ? 'Show All Items' : 'Show Categories'}
            </button>
          </div>
        </div>

        {showAdvancedOptions && (
          <div className="advanced-options">
            <div className="quick-select">
              <h4>Quick Select:</h4>
              <button onClick={() => {
                const allRelationships = relationshipTypes.flatMap((type, typeIndex) =>
                  type.details.map((_, detailIndex) => `${type.id}-${detailIndex}`)
                );
                setSelectedRelationships(allRelationships);
              }}>
                Select All Relationships
              </button>
              <button onClick={() => {
                const allNormalizations = normalizationTechniques.flatMap((type, typeIndex) =>
                  type.details.map((_, detailIndex) => `${type.id}-${detailIndex}`)
                );
                setSelectedNormalizations(allNormalizations);
              }}>
                Select All Normalizations
              </button>
              <button onClick={() => {
                setSelectedRelationships([]);
                setSelectedNormalizations([]);
              }}>
                Clear All Selections
              </button>
            </div>
          </div>
        )}
      </div>

{viewMode === 'categories' ? (
        <div className="content-grid">
          {/* Relationships Section */}
          <div className="section relationships-section">
            <h2>🤝 Relationship Types</h2>
            <p>Select relationship patterns between code components:</p>

            {getFilteredRelationships().map(relationship => (
              <div key={relationship.id} className="category-card">
                <h3>{relationship.title}</h3>
                <p className="description">{relationship.description}</p>
                <div className="details-list">
                  {relationship.details.map((detail, index) => {
                    const key = `${relationship.id}-${index}`;
                    const isSelected = selectedRelationships.includes(key);
                    const isExpanded = expandedPrompts[key];

                    return (
                      <div key={index} className="detail-item-container">
                        <label className="detail-item">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleRelationshipChange(relationship.id, index)}
                          />
                          <span className="detail-text">{detail}</span>
                          {isSelected && (
                            <button
                              className="expand-prompts-btn"
                              onClick={() => togglePromptExpansion(key)}
                              title={isExpanded ? "Hide detailed prompts" : "Show detailed prompts"}
                            >
                              {isExpanded ? "🔼 Hide Details" : "🔽 Show Details"}
                            </button>
                          )}
                        </label>

                        {isSelected && isExpanded && (
                          <div className="prompt-details">
                            <div className="selected-topic-header">
                              <h4>🎯 Selected Topic: <span className="topic-title">{relationship.title}</span></h4>
                              <p className="topic-detail"><strong>Specific Pattern:</strong> {detail}</p>
                            </div>

                            <div className="explanation-section">
                              <h5>📖 Detailed Explanation for "{detail}"</h5>
                              <p className="explanation-text">
                                <strong>Context:</strong> This explanation covers the <em>{relationship.title}</em> pattern, specifically focusing on <em>"{detail}"</em>.
                                <br/><br/>
                                {getRelationshipExplanation(relationship.id, index)}
                              </p>
                            </div>

                            <div className="code-example">
                              <h5>💻 Implementation Example for "{detail}"</h5>
                              <pre className="implementation-code">
                                <code>{getImplementationExample(relationship.id, index)}</code>
                              </pre>
                            </div>

                            <div className="follow-up-section">
                              <h5>🤔 Follow-up Learning Prompts for "{detail}"</h5>
                              <p className="prompt-context">
                                <strong>Study Focus:</strong> Use these prompts to deepen your understanding of <em>{detail}</em> within the context of <em>{relationship.title}</em>.
                              </p>
                              <ul className="follow-up-list">
                                {getRelationshipFollowUps(relationship.id, index).map((prompt, idx) => (
                                  <li key={idx} className="follow-up-item">
                                    <strong>Q{idx + 1} ({relationship.title}):</strong> {prompt}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="practice-section">
                              <h5>🎯 Practice Challenges for "{detail}"</h5>
                              <p className="prompt-context">
                                <strong>Practice Goal:</strong> Apply your knowledge of <em>{detail}</em> from <em>{relationship.title}</em> through these hands-on challenges.
                              </p>
                              <ol className="practice-list">
                                {getRelationshipQuestions(relationship.id, index).map((question, idx) => (
                                  <li key={idx} className="practice-item">
                                    <strong>Challenge {idx + 1} ({relationship.title}):</strong> {question}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Normalization Section */}
          <div className="section normalization-section">
            <h2>⚙️ Normalization Techniques</h2>
            <p>Select normalization approaches for code standardization:</p>

            {getFilteredNormalizations().map(technique => (
              <div key={technique.id} className="category-card">
                <h3>{technique.title}</h3>
                <p className="description">{technique.description}</p>
                <div className="details-list">
                  {technique.details.map((detail, index) => {
                    const key = `${technique.id}-${index}`;
                    const isSelected = selectedNormalizations.includes(key);
                    const isExpanded = expandedPrompts[key];

                    return (
                      <div key={index} className="detail-item-container">
                        <label className="detail-item">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleNormalizationChange(technique.id, index)}
                          />
                          <span className="detail-text">{detail}</span>
                          {isSelected && (
                            <button
                              className="expand-prompts-btn"
                              onClick={() => togglePromptExpansion(key)}
                              title={isExpanded ? "Hide detailed prompts" : "Show detailed prompts"}
                            >
                              {isExpanded ? "🔼 Hide Details" : "🔽 Show Details"}
                            </button>
                          )}
                        </label>

                        {isSelected && isExpanded && (
                          <div className="prompt-details">
                            <div className="selected-topic-header">
                              <h4>🎯 Selected Topic: <span className="topic-title">{technique.title}</span></h4>
                              <p className="topic-detail"><strong>Specific Technique:</strong> {detail}</p>
                            </div>

                            <div className="explanation-section">
                              <h5>📖 Detailed Explanation for "{detail}"</h5>
                              <p className="explanation-text">
                                <strong>Context:</strong> This explanation covers the <em>{technique.title}</em> technique, specifically focusing on <em>"{detail}"</em>.
                                <br/><br/>
                                {getNormalizationExplanation(technique.id, index)}
                              </p>
                            </div>

                            <div className="code-example">
                              <h5>💻 Implementation Example for "{detail}"</h5>
                              <pre className="implementation-code">
                                <code>{getNormalizationExample(technique.id, index)}</code>
                              </pre>
                            </div>

                            <div className="follow-up-section">
                              <h5>🤔 Follow-up Learning Prompts for "{detail}"</h5>
                              <p className="prompt-context">
                                <strong>Study Focus:</strong> Use these prompts to deepen your understanding of <em>{detail}</em> within the context of <em>{technique.title}</em>.
                              </p>
                              <ul className="follow-up-list">
                                {getNormalizationFollowUps(technique.id, index).map((prompt, idx) => (
                                  <li key={idx} className="follow-up-item">
                                    <strong>Q{idx + 1} ({technique.title}):</strong> {prompt}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="practice-section">
                              <h5>🎯 Practice Challenges for "{detail}"</h5>
                              <p className="prompt-context">
                                <strong>Practice Goal:</strong> Apply your knowledge of <em>{detail}</em> from <em>{technique.title}</em> through these hands-on challenges.
                              </p>
                              <ol className="practice-list">
                                {getNormalizationQuestions(technique.id, index).map((question, idx) => (
                                  <li key={idx} className="practice-item">
                                    <strong>Challenge {idx + 1} ({technique.title}):</strong> {question}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="all-items-section">
          {/* Pagination Controls */}
          <div className="pagination-controls">
            <div className="pagination-info">
              <span className="items-count">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, getFilteredAllItems().length)} - {Math.min(currentPage * itemsPerPage, getFilteredAllItems().length)} of {getFilteredAllItems().length} items
              </span>
              <div className="items-per-page">
                <label>Items per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                  className="items-select"
                >
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </div>

          {/* All Items Grid */}
          <div className="items-grid">
            {getPaginatedItems().map(item => {
              const isExpanded = expandedPrompts[item.id];

              return (
                <div key={item.id} className={`item-card ${item.isSelected ? 'selected' : ''}`}>
                  <div className="item-header">
                    <div className="item-category">
                      <span className={`category-badge ${item.category.toLowerCase()}`}>
                        {item.category === 'Relationship' ? '🤝' : '⚙️'} {item.category}
                      </span>
                    </div>
                    <label className="item-checkbox">
                      <input
                        type="checkbox"
                        checked={item.isSelected}
                        onChange={() => handleItemToggle(item)}
                      />
                    </label>
                  </div>
                  <h3 className="item-type">{item.type}</h3>
                  <p className="item-description">{item.description}</p>
                  <p className="item-detail">{item.detail}</p>
                  <div className="item-implementation">
                    <h4>Implementation:</h4>
                    <code className="implementation-code">{item.implementation}</code>
                  </div>

                  {item.isSelected && (
                    <div className="item-prompts-section">
                      <button
                        className="expand-prompts-btn"
                        onClick={() => togglePromptExpansion(item.id)}
                        title={isExpanded ? "Hide detailed prompts" : "Show detailed prompts"}
                      >
                        {isExpanded ? "🔼 Hide Learning Details" : "🔽 Show Learning Details"}
                      </button>

                      {isExpanded && (
                        <div className="prompt-details">
                          <div className="selected-topic-header">
                            <h4>🎯 Selected Topic: <span className="topic-title">{item.type}</span></h4>
                            <p className="topic-detail"><strong>Category:</strong> {item.category} | <strong>Specific Focus:</strong> {item.detail}</p>
                          </div>

                          <div className="explanation-section">
                            <h5>📖 Detailed Explanation for "{item.detail}"</h5>
                            <p className="explanation-text">
                              <strong>Context:</strong> This explanation covers the <em>{item.type}</em> {item.category.toLowerCase()}, specifically focusing on <em>"{item.detail}"</em>.
                              <br/><br/>
                              {item.explanation}
                            </p>
                          </div>

                          <div className="follow-up-section">
                            <h5>🤔 Follow-up Learning Prompts for "{item.detail}"</h5>
                            <p className="prompt-context">
                              <strong>Study Focus:</strong> Use these prompts to deepen your understanding of <em>{item.detail}</em> within the context of <em>{item.type}</em>.
                            </p>
                            <ul className="follow-up-list">
                              {item.followUpPrompts.map((prompt, idx) => (
                                <li key={idx} className="follow-up-item">
                                  <strong>Q{idx + 1} ({item.type}):</strong> {prompt}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="practice-section">
                            <h5>🎯 Practice Challenges for "{item.detail}"</h5>
                            <p className="prompt-context">
                              <strong>Practice Goal:</strong> Apply your knowledge of <em>{item.detail}</em> from <em>{item.type}</em> through these hands-on challenges.
                            </p>
                            <ol className="practice-list">
                              {item.practiceQuestions.map((question, idx) => (
                                <li key={idx} className="practice-item">
                                  <strong>Challenge {idx + 1} ({item.type}):</strong> {question}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Navigation */}
          {getTotalPages() > 1 && (
            <div className="pagination-nav">
              <button
                className="page-btn"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                ⏮️ First
              </button>
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ⬅️ Previous
              </button>

              <div className="page-numbers">
                {Array.from({ length: getTotalPages() }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    page === getTotalPages() ||
                    Math.abs(page - currentPage) <= 2
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="page-ellipsis">...</span>
                      )}
                      <button
                        className={`page-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))
                }
              </div>

              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === getTotalPages()}
              >
                Next ➡️
              </button>
              <button
                className="page-btn"
                onClick={() => handlePageChange(getTotalPages())}
                disabled={currentPage === getTotalPages()}
              >
                Last ⏭️
              </button>
            </div>
          )}
        </div>
      )}

      {/* Control Panel */}
      <div className="control-panel">
        <div className="selection-summary">
          <span className="count">
            Selected: {selectedRelationships.length + selectedNormalizations.length} items
          </span>
          <span className="breakdown">
            ({selectedRelationships.length} relationships, {selectedNormalizations.length} normalizations)
          </span>
        </div>
        
        <div className="action-buttons">
          <button
            className="generate-btn"
            onClick={generateReport}
            disabled={selectedRelationships.length === 0 && selectedNormalizations.length === 0}
          >
            📊 Generate Report
          </button>
          {reportGenerated && (
            <button
              className="export-btn"
              onClick={exportReport}
            >
              📥 Export Report
            </button>
          )}
          <button
            className="clear-btn"
            onClick={clearSelections}
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Enhanced Report Section */}
      {reportGenerated && reportData && (
        <div className="report-section">
          <h2>📋 Comprehensive Learning Report</h2>
          <div className="report-header">
            <div className="report-meta">
              <span>Generated: {reportData.generatedAt}</span>
              <span>Total Items: {reportData.totalSelected}</span>
            </div>
          </div>

          {/* Report Summary */}
          {reportData.summary && (
            <div className="report-summary">
              <h3>📊 Learning Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <strong>Coverage Analysis:</strong>
                  <ul>
                    <li>{reportData.summary.coverageAnalysis.relationshipCoverage}</li>
                    <li>{reportData.summary.coverageAnalysis.normalizationCoverage}</li>
                    <li>{reportData.summary.coverageAnalysis.overallCoverage}</li>
                  </ul>
                </div>
                <div className="summary-item">
                  <strong>Selected Topics:</strong>
                  <div className="topic-tags">
                    {reportData.summary.relationshipTypes.map(type => (
                      <span key={type} className="topic-tag relationship">{type}</span>
                    ))}
                    {reportData.summary.normalizationTypes.map(type => (
                      <span key={type} className="topic-tag normalization">{type}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {reportData.recommendations && reportData.recommendations.length > 0 && (
            <div className="recommendations-section">
              <h3>💡 Learning Recommendations</h3>
              <ul className="recommendations-list">
                {reportData.recommendations.map((rec, index) => (
                  <li key={index} className="recommendation-item">{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="report-content">
            {reportData.relationships.length > 0 && (
              <div className="report-category">
                <h3>🔗 Relationship Patterns Deep Dive</h3>
                {reportData.relationships.map((item, index) => (
                  <div key={index} className="enhanced-report-item">
                    <div className="item-header">
                      <h4>{item.type}</h4>
                      <span className="category-badge relationship">Relationship</span>
                    </div>

                    <div className="item-content">
                      <div className="item-detail">
                        <strong>Pattern:</strong> {item.detail}
                      </div>

                      <div className="explanation-section">
                        <h5>📖 Detailed Explanation</h5>
                        <p className="explanation-text">{item.explanation}</p>
                      </div>

                      <div className="code-example">
                        <h5>💻 Implementation Example</h5>
                        <code>{item.implementation}</code>
                      </div>

                      <div className="follow-up-section">
                        <h5>🤔 Follow-up Questions</h5>
                        <ul className="follow-up-list">
                          {item.followUpPrompts.map((prompt, idx) => (
                            <li key={idx} className="follow-up-item">{prompt}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="practice-section">
                        <h5>🎯 Practice Challenges</h5>
                        <ol className="practice-list">
                          {item.practiceQuestions.map((question, idx) => (
                            <li key={idx} className="practice-item">{question}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reportData.normalizations.length > 0 && (
              <div className="report-category">
                <h3>⚙️ Normalization Techniques Deep Dive</h3>
                {reportData.normalizations.map((item, index) => (
                  <div key={index} className="enhanced-report-item">
                    <div className="item-header">
                      <h4>{item.type}</h4>
                      <span className="category-badge normalization">Normalization</span>
                    </div>

                    <div className="item-content">
                      <div className="item-detail">
                        <strong>Technique:</strong> {item.detail}
                      </div>

                      <div className="explanation-section">
                        <h5>📖 Detailed Explanation</h5>
                        <p className="explanation-text">{item.explanation}</p>
                      </div>

                      <div className="code-example">
                        <h5>💻 Implementation Example</h5>
                        <code>{item.implementation}</code>
                      </div>

                      <div className="follow-up-section">
                        <h5>🤔 Follow-up Questions</h5>
                        <ul className="follow-up-list">
                          {item.followUpPrompts.map((prompt, idx) => (
                            <li key={idx} className="follow-up-item">{prompt}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="practice-section">
                        <h5>🎯 Practice Challenges</h5>
                        <ol className="practice-list">
                          {item.practiceQuestions.map((question, idx) => (
                            <li key={idx} className="practice-item">{question}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipNormalization;
