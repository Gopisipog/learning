import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { 
  BookOpen, 
  CheckCircle, 
  Circle, 
  Star, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Shield, 
  Settings,
  AlertTriangle,
  Database,
  Zap
} from 'lucide-react';
import './DataIntensiveAppsNotes.css';

const DataIntensiveAppsNotes = () => {
  const [completedSections, setCompletedSections] = useState(new Set());
  const [bookmarks, setBookmarks] = useState(new Set());
  const [notes, setNotes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTheme, setCurrentTheme] = useState('purple');

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('dataIntensiveApps_progress');
    const savedBookmarks = localStorage.getItem('dataIntensiveApps_bookmarks');
    const savedNotes = localStorage.getItem('dataIntensiveApps_notes');
    const savedTheme = localStorage.getItem('dataIntensiveApps_theme');

    if (savedProgress) setCompletedSections(new Set(JSON.parse(savedProgress)));
    if (savedBookmarks) setBookmarks(new Set(JSON.parse(savedBookmarks)));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedTheme) setCurrentTheme(savedTheme);
  }, []);

  // Save progress to localStorage
  const saveProgress = () => {
    localStorage.setItem('dataIntensiveApps_progress', JSON.stringify([...completedSections]));
    localStorage.setItem('dataIntensiveApps_bookmarks', JSON.stringify([...bookmarks]));
    localStorage.setItem('dataIntensiveApps_notes', JSON.stringify(notes));
    localStorage.setItem('dataIntensiveApps_theme', currentTheme);
  };

  const toggleSection = (sectionId) => {
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(sectionId)) {
      newCompleted.delete(sectionId);
    } else {
      newCompleted.add(sectionId);
    }
    setCompletedSections(newCompleted);
    setTimeout(saveProgress, 100);
  };

  const toggleBookmark = (sectionId) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(sectionId)) {
      newBookmarks.delete(sectionId);
    } else {
      newBookmarks.add(sectionId);
    }
    setBookmarks(newBookmarks);
    setTimeout(saveProgress, 100);
  };

  const updateNote = (sectionId, note) => {
    setNotes(prev => ({ ...prev, [sectionId]: note }));
    setTimeout(saveProgress, 500);
  };

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    setTimeout(saveProgress, 100);
  };

  const themes = {
    purple: {
      name: '🟣 Purple Gradient',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      primary: '#667eea',
      secondary: '#764ba2'
    },
    ocean: {
      name: '🌊 Ocean Blue',
      gradient: 'linear-gradient(135deg, #0077be 0%, #00a8cc 100%)',
      primary: '#0077be',
      secondary: '#00a8cc'
    },
    sunset: {
      name: '🌅 Sunset Orange',
      gradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
      primary: '#ff7e5f',
      secondary: '#feb47b'
    },
    forest: {
      name: '🌲 Forest Green',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      primary: '#11998e',
      secondary: '#38ef7d'
    },
    midnight: {
      name: '🌙 Midnight Dark',
      gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      primary: '#2c3e50',
      secondary: '#34495e'
    },
    cherry: {
      name: '🍒 Cherry Blossom',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      primary: '#ff9a9e',
      secondary: '#fecfef'
    },
    cyber: {
      name: '🤖 Cyber Neon',
      gradient: 'linear-gradient(135deg, #0f3460 0%, #e94560 100%)',
      primary: '#0f3460',
      secondary: '#e94560'
    },
    gold: {
      name: '✨ Golden Hour',
      gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
      primary: '#f7971e',
      secondary: '#ffd200'
    }
  };

  const chapterData = {
    title: "Chapter 1: Reliable, Scalable and Maintainable Applications",
    author: "Martin Kleppmann",
    book: "Designing Data-Intensive Applications",
    
    overview: {
      description: "This chapter explores the fundamental principles of building data-intensive applications, focusing on three key concerns: reliability, scalability, and maintainability. It establishes the theoretical foundation for understanding how modern distributed systems handle massive amounts of data while remaining robust and performant.",
      keyQuote: "The Internet was done so well that most people think of it as a natural resource like the Pacific Ocean, rather than something that was man-made.",
      theoreticalFoundation: "Data-intensive applications represent a paradigm shift from compute-intensive systems. While compute-intensive applications are limited by CPU power, data-intensive applications face challenges in data volume, complexity, and velocity of change. This fundamental difference drives architectural decisions and system design patterns.",
      learningObjectives: [
        "Understand what makes applications data-intensive vs compute-intensive",
        "Learn the three pillars of good system design: reliability, scalability, maintainability",
        "Explore different types of faults and how to handle them",
        "Understand load parameters and performance metrics",
        "Learn approaches for building maintainable systems",
        "Master the theoretical foundations of distributed data systems",
        "Understand the CAP theorem implications for real systems",
        "Learn about consistency models and their trade-offs"
      ],
      modernContext: {
        title: "Why Data-Intensive Applications Matter Today",
        points: [
          "Data volumes are growing exponentially - from gigabytes to petabytes",
          "Real-time processing requirements are becoming standard",
          "Global distribution of users demands low-latency access",
          "Microservices architecture increases system complexity",
          "Cloud computing enables elastic scaling but introduces new challenges"
        ]
      }
    },

    sections: [
      {
        id: 'thinking-about-data-systems',
        title: 'Thinking About Data Systems',
        icon: Database,
        keyPoints: [
          'Modern applications are typically data-intensive, not compute-intensive',
          'Standard building blocks: databases, caches, search indexes, stream processing, batch processing',
          'Different tools have different characteristics and use cases',
          'Applications often combine multiple tools to create composite data systems',
          'The boundaries between traditional categories are blurring',
          'Data systems must handle both OLTP and OLAP workloads',
          'Real-time and batch processing are converging (Lambda architecture)'
        ],
        theoreticalFoundations: {
          title: 'Theoretical Foundations of Data Systems',
          concepts: [
            {
              name: 'Data System Taxonomy',
              description: 'Understanding the fundamental categories and their evolution',
              details: [
                'OLTP (Online Transaction Processing): Handle user-facing requests with low latency',
                'OLAP (Online Analytical Processing): Handle complex queries over large datasets',
                'Hybrid systems (HTAP): Handle both transactional and analytical workloads',
                'Stream processing: Handle continuous data flows in real-time',
                'Batch processing: Handle large volumes of data in scheduled jobs'
              ]
            },
            {
              name: 'CAP Theorem Implications',
              description: 'How the CAP theorem shapes data system design decisions',
              details: [
                'Consistency: All nodes see the same data simultaneously',
                'Availability: System remains operational even during failures',
                'Partition tolerance: System continues despite network failures',
                'Real systems must choose between CP (consistent) or AP (available)',
                'Modern systems use eventual consistency to balance trade-offs'
              ]
            },
            {
              name: 'Data Model Evolution',
              description: 'How data models have evolved to meet modern requirements',
              details: [
                'Relational model: Strong consistency, ACID properties, SQL',
                'Document model: Flexible schema, JSON-like documents, NoSQL',
                'Graph model: Relationships as first-class citizens, complex queries',
                'Column-family: Wide tables, efficient for analytical workloads',
                'Multi-model: Support multiple data models in single system'
              ]
            }
          ]
        },
        concepts: [
          {
            term: 'Data-Intensive Applications',
            definition: 'Applications where the primary challenges are data volume, complexity, and rate of change rather than CPU power. These systems are characterized by their need to store, retrieve, search, and process data efficiently.',
            examples: ['Social media platforms', 'E-commerce sites', 'Analytics systems', 'IoT data platforms', 'Financial trading systems'],
            characteristics: [
              'Data volume exceeds single machine capacity',
              'Complex data relationships and queries',
              'High read/write throughput requirements',
              'Need for real-time and batch processing',
              'Geographic distribution requirements'
            ]
          },
          {
            term: 'Composite Data Systems',
            definition: 'Systems that combine multiple specialized tools (databases, caches, search indexes) behind a unified API to create a cohesive data platform',
            examples: ['Application with separate cache and database', 'System with search index and primary storage', 'Lambda architecture with batch and stream processing'],
            designPrinciples: [
              'Each tool optimized for specific use case',
              'Unified API hides complexity from applications',
              'Data consistency maintained across components',
              'Fault tolerance through redundancy',
              'Performance optimization through specialization'
            ]
          },
          {
            term: 'Polyglot Persistence',
            definition: 'Using different data storage technologies to handle varying data storage needs within a single application',
            examples: ['Redis for caching, PostgreSQL for transactions, Elasticsearch for search', 'MongoDB for content, Neo4j for relationships, InfluxDB for time series'],
            benefits: [
              'Optimal tool for each data type and access pattern',
              'Better performance through specialization',
              'Reduced complexity in individual components',
              'Flexibility to evolve different parts independently'
            ]
          },
          {
            term: 'Data Locality',
            definition: 'The principle of keeping related data physically close to minimize access latency and maximize throughput',
            examples: ['Columnar storage for analytics', 'Partitioning by geographic region', 'Co-locating related microservices'],
            techniques: [
              'Horizontal partitioning (sharding)',
              'Vertical partitioning (column stores)',
              'Geographic partitioning',
              'Temporal partitioning (time-based)',
              'Functional partitioning (by feature)'
            ]
          }
        ],
        architecturalPatterns: {
          title: 'Common Architectural Patterns',
          patterns: [
            {
              name: 'Lambda Architecture',
              description: 'Combines batch and stream processing for comprehensive data processing',
              components: ['Batch layer (historical data)', 'Speed layer (real-time data)', 'Serving layer (query interface)'],
              useCase: 'Systems requiring both real-time and historical analytics'
            },
            {
              name: 'Kappa Architecture',
              description: 'Stream-only architecture that processes all data as streams',
              components: ['Stream processing layer', 'Serving layer with replayable logs'],
              useCase: 'Systems where all data can be treated as streams'
            },
            {
              name: 'CQRS (Command Query Responsibility Segregation)',
              description: 'Separates read and write operations using different models',
              components: ['Command model (writes)', 'Query model (reads)', 'Event store'],
              useCase: 'Systems with complex business logic and different read/write patterns'
            }
          ]
        },
        practicalExample: {
          title: 'Modern E-commerce Platform Architecture',
          description: 'A comprehensive example showing how multiple data systems work together in a real-world application',
          components: {
            'User Service': 'PostgreSQL for user profiles and authentication',
            'Product Catalog': 'Elasticsearch for search, MongoDB for product details',
            'Inventory': 'Redis for real-time stock levels, PostgreSQL for persistence',
            'Orders': 'PostgreSQL for ACID transactions, Kafka for event streaming',
            'Analytics': 'ClickHouse for real-time analytics, Hadoop for batch processing',
            'Recommendations': 'Neo4j for relationship graphs, ML models in TensorFlow'
          },
          dataFlow: 'User Request → API Gateway → Microservices → Data Stores → Event Streams → Analytics',
          challenges: [
            'Maintaining consistency across services',
            'Handling distributed transactions',
            'Managing data synchronization',
            'Ensuring fault tolerance',
            'Optimizing for different access patterns'
          ]
        }
      },
      
      {
        id: 'reliability',
        title: 'Reliability',
        icon: Shield,
        keyPoints: [
          'System continues working correctly even when things go wrong',
          'Faults are different from failures - faults are component issues, failures are system-wide',
          'Three main types of faults: hardware, software, human',
          'Fault tolerance is about preventing faults from causing failures',
          'Reliability is measured in terms of MTBF (Mean Time Between Failures)',
          'Redundancy and replication are key strategies for fault tolerance',
          'Graceful degradation allows systems to continue with reduced functionality',
          'Chaos engineering helps validate fault tolerance mechanisms'
        ],
        theoreticalFoundations: {
          title: 'Reliability Theory and Fault Models',
          concepts: [
            {
              name: 'Fault Tolerance Models',
              description: 'Mathematical frameworks for understanding system reliability',
              details: [
                'Fail-stop model: Components either work correctly or stop completely',
                'Fail-slow model: Components may respond slowly but correctly',
                'Byzantine fault model: Components may behave arbitrarily or maliciously',
                'Crash-recovery model: Components may crash but can recover with persistent state',
                'Network partition model: Components may be temporarily unreachable'
              ]
            },
            {
              name: 'Reliability Metrics',
              description: 'Quantitative measures of system reliability',
              details: [
                'MTBF (Mean Time Between Failures): Average time between system failures',
                'MTTR (Mean Time To Recovery): Average time to restore service after failure',
                'Availability = MTBF / (MTBF + MTTR): Percentage of time system is operational',
                'RTO (Recovery Time Objective): Maximum acceptable downtime',
                'RPO (Recovery Point Objective): Maximum acceptable data loss'
              ]
            },
            {
              name: 'Redundancy Strategies',
              description: 'Different approaches to building fault-tolerant systems',
              details: [
                'Active redundancy: Multiple components process requests simultaneously',
                'Passive redundancy: Backup components activated when primary fails',
                'N+1 redundancy: N components needed, 1 spare for fault tolerance',
                'Geographic redundancy: Components distributed across locations',
                'Temporal redundancy: Retry operations to handle transient failures'
              ]
            }
          ]
        },
        concepts: [
          {
            term: 'Fault vs Failure',
            definition: 'Fault: one component deviating from spec. Failure: system stops providing required service to users',
            examples: ['Fault: disk crash', 'Failure: entire application down'],
            theory: 'The distinction is crucial for building fault-tolerant systems. A well-designed system can experience many faults without any failures visible to users.',
            metrics: [
              'Fault rate: Number of faults per unit time',
              'Fault coverage: Percentage of faults that are detected',
              'Fault latency: Time between fault occurrence and detection'
            ]
          },
          {
            term: 'Hardware Faults',
            definition: 'Random, independent failures of physical components with predictable statistical properties',
            examples: ['Disk crashes (10-50 years MTBF)', 'RAM failures (10-40 years MTBF)', 'Power outages', 'Network cable unplugged'],
            characteristics: [
              'Usually independent and uncorrelated',
              'Follow exponential failure distributions',
              'Can be mitigated through redundancy',
              'Becoming more frequent as systems scale'
            ],
            mitigationStrategies: [
              'RAID for disk redundancy',
              'ECC memory for RAM error correction',
              'Dual power supplies and UPS systems',
              'Network redundancy with multiple paths',
              'Hot-swappable components'
            ]
          },
          {
            term: 'Software Errors',
            definition: 'Systematic errors that are correlated across nodes and often triggered by specific conditions',
            examples: ['Bug causing all servers to crash', 'Runaway process consuming resources', 'Cascading failures', 'Memory leaks', 'Deadlocks'],
            characteristics: [
              'Often correlated across multiple nodes',
              'Triggered by specific input or conditions',
              'Can cause cascading failures',
              'Harder to predict than hardware failures'
            ],
            types: [
              'Logic errors in application code',
              'Race conditions in concurrent systems',
              'Resource exhaustion (memory, disk, connections)',
              'Infinite loops or recursive calls',
              'Incorrect error handling'
            ],
            mitigationStrategies: [
              'Comprehensive testing (unit, integration, chaos)',
              'Code reviews and static analysis',
              'Circuit breakers to prevent cascading failures',
              'Resource limits and quotas',
              'Graceful degradation mechanisms'
            ]
          },
          {
            term: 'Human Errors',
            definition: 'Configuration errors and operational mistakes by humans, often the leading cause of outages',
            examples: ['Configuration errors (leading cause of outages)', 'Deployment mistakes', 'Operational errors', 'Accidental data deletion'],
            statistics: [
              'Responsible for 70% of outages in many organizations',
              'Often occur during maintenance windows',
              'Frequently involve configuration changes',
              'Can have cascading effects across systems'
            ],
            commonCauses: [
              'Complex configuration files',
              'Lack of proper testing environments',
              'Insufficient documentation',
              'Time pressure during incidents',
              'Inadequate training or knowledge transfer'
            ],
            mitigationStrategies: [
              'Infrastructure as Code (IaC)',
              'Automated deployment pipelines',
              'Comprehensive monitoring and alerting',
              'Rollback mechanisms',
              'Sandbox environments for testing',
              'Clear operational procedures',
              'Regular training and drills'
            ]
          },
          {
            term: 'Byzantine Failures',
            definition: 'Failures where components may behave arbitrarily, including sending conflicting information to different parts of the system',
            examples: ['Malicious attacks', 'Corrupted data transmission', 'Clock synchronization issues', 'Network partitions with partial connectivity'],
            theory: 'Named after the Byzantine Generals Problem, these failures are the most challenging to handle as the system cannot distinguish between correct and incorrect behavior.',
            algorithms: [
              'PBFT (Practical Byzantine Fault Tolerance)',
              'Blockchain consensus mechanisms',
              'Byzantine agreement protocols',
              'Authenticated Byzantine agreement'
            ]
          },
          {
            term: 'Graceful Degradation',
            definition: 'The ability of a system to continue operating with reduced functionality when some components fail',
            examples: ['Serving cached data when database is down', 'Disabling non-essential features during high load', 'Fallback to simpler algorithms'],
            designPrinciples: [
              'Identify critical vs non-critical functionality',
              'Design fallback mechanisms',
              'Implement feature toggles',
              'Use circuit breakers for external dependencies',
              'Prioritize core user journeys'
            ]
          }
        ],
        strategies: [
          'Add hardware redundancy (RAID, dual power supplies)',
          'Use software fault-tolerance techniques',
          'Design systems to minimize human error opportunities',
          'Provide sandbox environments for safe experimentation',
          'Implement thorough testing at all levels',
          'Enable quick recovery from errors',
          'Set up detailed monitoring and telemetry'
        ],
        practicalExample: {
          title: 'Netflix Chaos Monkey',
          description: 'Netflix deliberately kills random services to ensure fault-tolerance mechanisms work correctly',
          insight: 'Deliberately inducing faults helps ensure fault-tolerance machinery is exercised and tested'
        }
      },

      {
        id: 'scalability',
        title: 'Scalability',
        icon: TrendingUp,
        keyPoints: [
          'Ability to cope with increased load gracefully',
          'Not a binary property - must discuss specific growth scenarios',
          'Requires understanding current load parameters and bottlenecks',
          'Performance can be measured by throughput or response time',
          'Horizontal scaling (scale-out) vs vertical scaling (scale-up)',
          'Linear scalability is the ideal but rarely achieved in practice',
          'Amdahl\'s Law limits the benefits of parallelization',
          'Load testing and capacity planning are essential for scalability'
        ],
        theoreticalFoundations: {
          title: 'Scalability Theory and Models',
          concepts: [
            {
              name: 'Scalability Laws',
              description: 'Mathematical principles governing system scalability',
              details: [
                'Amdahl\'s Law: Speedup limited by sequential portion of work',
                'Gustafson\'s Law: Scalability improves with larger problem sizes',
                'Universal Scalability Law: Accounts for coherency costs in distributed systems',
                'Little\'s Law: Relationship between throughput, latency, and concurrency',
                'Queueing Theory: Mathematical analysis of waiting lines and service rates'
              ]
            },
            {
              name: 'Scaling Patterns',
              description: 'Common approaches to achieving scalability',
              details: [
                'Horizontal scaling: Add more machines to handle increased load',
                'Vertical scaling: Add more power (CPU, RAM) to existing machines',
                'Functional decomposition: Split system by feature or service',
                'Data partitioning: Split data across multiple storage systems',
                'Caching: Store frequently accessed data in fast storage'
              ]
            },
            {
              name: 'Performance Models',
              description: 'Mathematical models for predicting system performance',
              details: [
                'Closed-loop model: Fixed number of concurrent users',
                'Open-loop model: Arrival rate independent of system state',
                'M/M/1 queue: Single server with Poisson arrivals and exponential service',
                'M/M/c queue: Multiple servers with shared queue',
                'Network of queues: Complex systems modeled as connected queues'
              ]
            }
          ]
        },
        concepts: [
          {
            term: 'Load Parameters',
            definition: 'Quantitative measures that describe the current demand on your system',
            examples: ['Requests per second', 'Read/write ratio', 'Active users', 'Cache hit rate', 'Data volume', 'Concurrent connections'],
            categories: [
              'Volume metrics: Total amount of data or requests',
              'Velocity metrics: Rate of change or processing speed',
              'Concurrency metrics: Number of simultaneous operations',
              'Complexity metrics: Computational or query complexity'
            ],
            measurementTechniques: [
              'Application Performance Monitoring (APM)',
              'Infrastructure monitoring (CPU, memory, network)',
              'Business metrics (active users, transactions)',
              'Synthetic monitoring and load testing'
            ]
          },
          {
            term: 'Fan-out',
            definition: 'Number of requests to other services needed to serve one incoming request, or the number of recipients for a single message',
            examples: ['Twitter: one tweet → writes to many follower timelines', 'Microservices: one API call → multiple service calls', 'Database: one write → multiple replica updates'],
            types: [
              'Fan-out on write: Precompute results when data is written',
              'Fan-out on read: Compute results when data is requested',
              'Hybrid approach: Combine both strategies based on usage patterns'
            ],
            scalingChallenges: [
              'High fan-out can create bottlenecks',
              'Celebrity problem: Users with many followers',
              'Thundering herd: Many requests triggered simultaneously',
              'Cascade failures: One slow service affects many others'
            ]
          },
          {
            term: 'Throughput',
            definition: 'Number of records, transactions, or requests processed per unit time',
            examples: ['Records/second in Hadoop job', 'Transactions/second in database', 'Messages/second in queue', 'Queries/second in search engine'],
            factors: [
              'CPU processing power and efficiency',
              'I/O bandwidth and latency',
              'Network capacity and latency',
              'Concurrency and parallelization',
              'Algorithm efficiency and optimization'
            ],
            optimizationStrategies: [
              'Batch processing to amortize overhead',
              'Pipelining to overlap operations',
              'Parallel processing across multiple cores/machines',
              'Caching to reduce repeated work',
              'Compression to reduce I/O overhead'
            ]
          },
          {
            term: 'Response Time',
            definition: 'Time between client sending request and receiving complete response',
            examples: ['Web page load time', 'API call duration', 'Database query time', 'Cache lookup time'],
            components: [
              'Network latency: Time for data to travel over network',
              'Queueing delay: Time waiting in system queues',
              'Service time: Actual processing time',
              'Serialization/deserialization overhead'
            ],
            factors: [
              'Geographic distance between client and server',
              'System load and resource contention',
              'Algorithm complexity and efficiency',
              'I/O operations and blocking calls',
              'Garbage collection and memory management'
            ]
          },
          {
            term: 'Percentiles',
            definition: 'Statistical measures that show the value below which a percentage of observations fall',
            examples: ['p50 (median): 50% of requests faster', 'p95: 95% of requests faster', 'p99: 99% of requests faster', 'p999: 99.9% of requests faster'],
            importance: [
              'Averages hide outliers and don\'t represent user experience',
              'Tail latencies (p95, p99) often determine user satisfaction',
              'High percentiles reveal system bottlenecks and issues',
              'SLA targets typically based on percentiles, not averages'
            ],
            calculation: [
              'Sort all response times in ascending order',
              'Find value at specified percentage position',
              'Use approximation algorithms for large datasets',
              'Consider time windows for real-time monitoring'
            ]
          },
          {
            term: 'Scalability Bottlenecks',
            definition: 'System components that limit overall scalability and performance',
            examples: ['Database connections', 'Single-threaded components', 'Shared state', 'Network bandwidth', 'Memory capacity'],
            identification: [
              'Performance profiling and monitoring',
              'Load testing with increasing load',
              'Resource utilization analysis',
              'Queueing theory analysis',
              'Bottleneck analysis tools'
            ],
            resolution: [
              'Horizontal scaling of bottleneck component',
              'Caching to reduce load on bottleneck',
              'Asynchronous processing to decouple components',
              'Load balancing to distribute load',
              'Algorithm optimization to reduce resource usage'
            ]
          },
          {
            term: 'Elastic Scalability',
            definition: 'Ability to automatically scale resources up or down based on current demand',
            examples: ['Auto-scaling groups in cloud', 'Kubernetes horizontal pod autoscaler', 'Database read replicas', 'CDN edge servers'],
            challenges: [
              'Predicting future load accurately',
              'Scaling delays and startup times',
              'State management during scaling',
              'Cost optimization vs performance',
              'Avoiding oscillation and thrashing'
            ],
            strategies: [
              'Predictive scaling based on historical patterns',
              'Reactive scaling based on current metrics',
              'Scheduled scaling for known patterns',
              'Multi-metric scaling for complex workloads',
              'Circuit breakers to prevent cascade failures'
            ]
          }
        ],
        twitterExample: {
          title: 'Twitter Scaling Challenge',
          approaches: [
            {
              name: 'Approach 1: Pull Model',
              description: 'Store tweets globally, query on timeline read',
              pros: ['Simple writes'],
              cons: ['Expensive timeline reads', 'Complex joins']
            },
            {
              name: 'Approach 2: Push Model',
              description: 'Pre-compute timelines, write to follower caches',
              pros: ['Fast timeline reads'],
              cons: ['Expensive writes for users with many followers']
            },
            {
              name: 'Hybrid Approach',
              description: 'Push for most users, pull for celebrities',
              pros: ['Best of both worlds'],
              cons: ['More complex implementation']
            }
          ],
          metrics: {
            'Tweet posts': '4.6k/sec average, 12k/sec peak',
            'Timeline reads': '300k/sec',
            'Fan-out writes': '345k/sec (75 followers average)'
          }
        }
      },

      {
        id: 'maintainability',
        title: 'Maintainability',
        icon: Settings,
        keyPoints: [
          'Making life better for engineering and operations teams',
          'Three design principles: operability, simplicity, evolvability',
          'Most software cost is in maintenance, not initial development',
          'Good abstractions reduce complexity and cognitive load',
          'Technical debt accumulates over time and must be managed',
          'Conway\'s Law: System design reflects organizational structure',
          'Documentation and knowledge sharing are critical for maintainability',
          'Automated testing enables confident changes and refactoring'
        ],
        theoreticalFoundations: {
          title: 'Software Maintainability Theory',
          concepts: [
            {
              name: 'Software Evolution Laws',
              description: 'Fundamental principles governing how software systems change over time',
              details: [
                'Lehman\'s Laws of Software Evolution',
                'Law of Continuing Change: Systems must evolve or become obsolete',
                'Law of Increasing Complexity: Complexity increases unless work is done to reduce it',
                'Law of Self-Regulation: Evolution process is self-regulating',
                'Law of Conservation of Organizational Stability: Average activity rate is invariant'
              ]
            },
            {
              name: 'Complexity Theory',
              description: 'Understanding different types of complexity in software systems',
              details: [
                'Essential complexity: Inherent to the problem domain',
                'Accidental complexity: Introduced by tools, technologies, or poor design',
                'Cyclomatic complexity: Measure of code complexity based on control flow',
                'Cognitive complexity: Mental effort required to understand code',
                'Architectural complexity: Complexity arising from system structure'
              ]
            },
            {
              name: 'Technical Debt Theory',
              description: 'Framework for understanding and managing technical debt',
              details: [
                'Deliberate vs inadvertent debt',
                'Prudent vs reckless debt',
                'Interest payments: Ongoing cost of maintaining poor code',
                'Debt principal: Cost to fix the underlying issue',
                'Debt quadrants: Classification framework for different types of debt'
              ]
            }
          ]
        },
        concepts: [
          {
            term: 'Operability',
            definition: 'Making life easy for operations teams to keep the system running smoothly in production',
            examples: ['Good monitoring and alerting', 'Predictable behavior', 'Comprehensive documentation', 'Self-healing capabilities'],
            principles: [
              'Visibility: Provide insight into system behavior and health',
              'Controllability: Enable operators to control system behavior',
              'Automation: Reduce manual operational tasks',
              'Standardization: Use consistent patterns and practices',
              'Resilience: Design for operational failures and recovery'
            ],
            practices: [
              'Comprehensive logging and metrics collection',
              'Health checks and readiness probes',
              'Graceful shutdown and startup procedures',
              'Configuration management and version control',
              'Disaster recovery and backup procedures',
              'Capacity planning and performance monitoring',
              'Security monitoring and incident response'
            ],
            antipatterns: [
              'Silent failures without logging or alerting',
              'Complex deployment procedures',
              'Hardcoded configuration values',
              'Lack of monitoring and observability',
              'Manual scaling and recovery processes'
            ]
          },
          {
            term: 'Simplicity',
            definition: 'Managing complexity through good abstractions and avoiding unnecessary complications',
            examples: ['Clean APIs with clear contracts', 'Consistent naming conventions', 'Avoiding premature optimization', 'Single responsibility principle'],
            complexitySources: [
              'State space explosion: Too many possible system states',
              'Tight coupling: Components depend on each other\'s internals',
              'Tangled dependencies: Circular or unclear dependency relationships',
              'Inconsistent abstractions: Similar concepts handled differently',
              'Premature optimization: Complex solutions for simple problems'
            ],
            simplificationStrategies: [
              'Domain-driven design: Model software after business domain',
              'Separation of concerns: Each component has single responsibility',
              'Layered architecture: Clear abstraction levels',
              'Interface segregation: Small, focused interfaces',
              'Composition over inheritance: Flexible component assembly'
            ],
            measurementMetrics: [
              'Cyclomatic complexity: Number of linearly independent paths',
              'Coupling metrics: Degree of interdependence between modules',
              'Cohesion metrics: Degree of relatedness within modules',
              'Lines of code: Simple measure of system size',
              'Number of dependencies: External complexity measure'
            ]
          },
          {
            term: 'Evolvability',
            definition: 'Making change easy through flexible architecture and design patterns (also called extensibility, modifiability, or plasticity)',
            examples: ['Modular architecture', 'Plugin systems', 'API versioning', 'Feature flags', 'Database migrations'],
            designPrinciples: [
              'Open/Closed Principle: Open for extension, closed for modification',
              'Dependency Inversion: Depend on abstractions, not concretions',
              'Loose Coupling: Minimize dependencies between components',
              'High Cohesion: Group related functionality together',
              'Information Hiding: Encapsulate implementation details'
            ],
            architecturalPatterns: [
              'Microservices: Independent, deployable services',
              'Event-driven architecture: Loose coupling through events',
              'Plugin architecture: Extensible through plugins',
              'Layered architecture: Clear separation of concerns',
              'Hexagonal architecture: Isolate core business logic'
            ],
            changeManagement: [
              'Version control and branching strategies',
              'Automated testing and continuous integration',
              'Feature flags for gradual rollouts',
              'Database schema migration tools',
              'API versioning and backward compatibility',
              'Blue-green deployments for zero-downtime updates'
            ]
          },
          {
            term: 'Technical Debt',
            definition: 'The implied cost of additional rework caused by choosing an easy solution now instead of a better approach that would take longer',
            examples: ['Quick fixes that need proper solutions', 'Outdated dependencies', 'Missing tests', 'Poor documentation', 'Hardcoded values'],
            types: [
              'Code debt: Poor code quality, duplication, complexity',
              'Design debt: Poor architectural decisions',
              'Test debt: Insufficient or poor-quality tests',
              'Documentation debt: Missing or outdated documentation',
              'Infrastructure debt: Outdated tools and environments'
            ],
            management: [
              'Regular debt assessment and prioritization',
              'Allocate time for debt reduction in sprints',
              'Refactoring as part of feature development',
              'Code quality gates and standards',
              'Technical debt tracking and visualization'
            ],
            consequences: [
              'Increased development time for new features',
              'Higher bug rates and production issues',
              'Reduced team productivity and morale',
              'Difficulty onboarding new team members',
              'Increased maintenance costs over time'
            ]
          },
          {
            term: 'Conway\'s Law',
            definition: 'Organizations design systems that mirror their own communication structure',
            examples: ['Team structure reflected in API design', 'Organizational silos creating system boundaries', 'Communication patterns affecting software architecture'],
            implications: [
              'Team structure influences software architecture',
              'Communication overhead affects system design',
              'Organizational changes may require architectural changes',
              'Cross-functional teams enable better integration',
              'Conway\'s Law can be used intentionally (Inverse Conway Maneuver)'
            ],
            strategies: [
              'Design team structure to match desired architecture',
              'Use cross-functional teams for integrated systems',
              'Establish clear communication channels',
              'Regular architecture reviews and alignment',
              'Consider organizational impact of technical decisions'
            ]
          },
          {
            term: 'Observability',
            definition: 'The ability to understand the internal state of a system based on its external outputs',
            examples: ['Distributed tracing', 'Structured logging', 'Metrics and monitoring', 'Error tracking', 'Performance profiling'],
            pillars: [
              'Metrics: Numerical measurements over time',
              'Logs: Discrete events with context',
              'Traces: Request flow through distributed system',
              'Profiles: Resource usage and performance characteristics'
            ],
            benefits: [
              'Faster incident detection and resolution',
              'Better understanding of system behavior',
              'Data-driven optimization decisions',
              'Improved debugging and troubleshooting',
              'Enhanced capacity planning and scaling'
            ],
            implementation: [
              'Instrument code with telemetry collection',
              'Use correlation IDs for request tracing',
              'Implement structured logging with context',
              'Set up alerting based on SLIs and SLOs',
              'Create dashboards for system visibility'
            ]
          }
        ],
        operabilityPrinciples: [
          'Provide visibility into runtime behavior and internals',
          'Provide good support for automation and integration',
          'Avoid dependency on individual machines',
          'Provide good documentation and operational model',
          'Provide good default behavior with freedom to override',
          'Self-heal where appropriate, but give admins manual control',
          'Exhibit predictable behavior, minimizing surprises'
        ],
        complexitySources: [
          'Explosion of state space',
          'Tight coupling of modules',
          'Tangled dependencies',
          'Inconsistent naming and terminology',
          'Hacks for performance problems',
          'Special-casing to work around issues'
        ]
      }
    ],

    keyTakeaways: [
      'Reliability, scalability, and maintainability are the three pillars of good system design',
      'Fault tolerance is about preventing faults from becoming failures through redundancy and graceful degradation',
      'Scalability discussions must be specific about load growth scenarios and bottlenecks',
      'Percentiles are better than averages for understanding user experience and tail latencies',
      'Maintainability is crucial since most software cost is in maintenance, not initial development',
      'Good abstractions are key to managing complexity and enabling system evolution',
      'Different applications have different requirements - no one-size-fits-all solution exists',
      'Data-intensive applications face challenges in volume, velocity, and variety of data',
      'Composite data systems combine specialized tools behind unified APIs',
      'Hardware faults are random and independent, software faults are systematic and correlated',
      'Human errors are the leading cause of outages and require process improvements',
      'Amdahl\'s Law limits the benefits of parallelization in distributed systems',
      'Load parameters must be carefully chosen to represent actual system bottlenecks',
      'Fan-out patterns significantly impact system scalability and performance',
      'Technical debt accumulates over time and must be actively managed',
      'Conway\'s Law shows that organizational structure influences system architecture',
      'Observability is essential for understanding and operating complex distributed systems',
      'Chaos engineering helps validate fault tolerance mechanisms in production',
      'Elastic scalability requires careful design to avoid oscillation and cost optimization',
      'The CAP theorem forces trade-offs between consistency, availability, and partition tolerance'
    ],

    quiz: [
      {
        question: 'What is the difference between a fault and a failure?',
        options: [
          'There is no difference',
          'A fault is one component deviating from spec, a failure is when the system stops providing required service',
          'A fault is worse than a failure',
          'A failure is a type of fault'
        ],
        correct: 1,
        explanation: 'A fault is usually defined as one component deviating from its spec, whereas a failure is when the system as a whole stops providing the required service to the user. Good fault-tolerant systems can experience many faults without any failures.'
      },
      {
        question: 'Why are percentiles better than averages for measuring response time?',
        options: [
          'They are easier to calculate',
          'They tell you how many users actually experienced specific delays',
          'They are always lower than averages',
          'They are required by law'
        ],
        correct: 1,
        explanation: 'Percentiles tell you how many users actually experienced that delay, while averages can be misleading because they don\'t show the distribution of response times. High percentiles (p95, p99) reveal tail latencies that significantly impact user experience.'
      },
      {
        question: 'What are the three main design principles for maintainability?',
        options: [
          'Speed, accuracy, reliability',
          'Operability, simplicity, evolvability',
          'Performance, security, scalability',
          'Cost, time, quality'
        ],
        correct: 1,
        explanation: 'The three design principles for maintainability are operability (making life easy for operations), simplicity (managing complexity through good abstractions), and evolvability (making change easy).'
      },
      {
        question: 'According to Amdahl\'s Law, what limits the speedup achievable through parallelization?',
        options: [
          'The number of available processors',
          'The sequential portion of the work that cannot be parallelized',
          'The network bandwidth between processors',
          'The memory capacity of the system'
        ],
        correct: 1,
        explanation: 'Amdahl\'s Law states that the speedup of a program using multiple processors is limited by the sequential portion of the program. Even with infinite processors, the speedup cannot exceed 1/(sequential fraction).'
      },
      {
        question: 'What is the primary characteristic that distinguishes data-intensive applications from compute-intensive applications?',
        options: [
          'Data-intensive applications use more CPU power',
          'Data-intensive applications are limited by data volume, complexity, and rate of change rather than CPU power',
          'Data-intensive applications are always distributed',
          'Data-intensive applications don\'t need databases'
        ],
        correct: 1,
        explanation: 'Data-intensive applications are characterized by challenges in data volume, complexity, and rate of change, while compute-intensive applications are primarily limited by CPU power. This fundamental difference drives different architectural approaches.'
      },
      {
        question: 'In Twitter\'s scaling example, why did they switch from approach 1 (pull model) to approach 2 (push model)?',
        options: [
          'Approach 1 was too expensive to implement',
          'The rate of timeline reads was much higher than the rate of tweet writes',
          'Approach 1 didn\'t support real-time updates',
          'Approach 2 provided better data consistency'
        ],
        correct: 1,
        explanation: 'Twitter switched because timeline reads (300k/sec) were almost two orders of magnitude higher than tweet writes (4.6k/sec), making it more efficient to do more work at write time and less at read time.'
      },
      {
        question: 'What does Conway\'s Law state about software architecture?',
        options: [
          'Software complexity always increases over time',
          'Organizations design systems that mirror their communication structure',
          'The best architecture is always microservices',
          'Technical debt should be paid off immediately'
        ],
        correct: 1,
        explanation: 'Conway\'s Law states that organizations design systems that mirror their own communication structure. This means team organization and communication patterns directly influence software architecture and system boundaries.'
      },
      {
        question: 'Which type of fault is typically the most challenging to handle in distributed systems?',
        options: [
          'Hardware faults',
          'Software errors',
          'Human errors',
          'Byzantine failures'
        ],
        correct: 3,
        explanation: 'Byzantine failures are the most challenging because components may behave arbitrarily or maliciously, making it difficult to distinguish between correct and incorrect behavior. They require sophisticated consensus algorithms to handle properly.'
      },
      {
        question: 'What is the main benefit of using composite data systems?',
        options: [
          'They are always faster than single systems',
          'Each component can be optimized for its specific use case while providing a unified interface',
          'They eliminate the need for data consistency',
          'They are easier to implement than monolithic systems'
        ],
        correct: 1,
        explanation: 'Composite data systems allow each component to be optimized for its specific use case (e.g., cache for speed, database for consistency, search index for queries) while hiding this complexity behind a unified API.'
      },
      {
        question: 'Why is observability crucial for maintaining complex distributed systems?',
        options: [
          'It eliminates the need for testing',
          'It provides visibility into system behavior to understand, debug, and optimize the system',
          'It automatically fixes system problems',
          'It reduces the cost of running systems'
        ],
        correct: 1,
        explanation: 'Observability provides the ability to understand the internal state of a system based on its external outputs through metrics, logs, and traces. This visibility is essential for debugging, optimization, and maintaining complex distributed systems.'
      }
    ]
  };

  const filteredSections = chapterData.sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.keyPoints.some(point => point.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div
      className="data-intensive-notes"
      style={{
        background: themes[currentTheme].gradient,
        '--theme-primary': themes[currentTheme].primary,
        '--theme-secondary': themes[currentTheme].secondary
      }}
    >
      <div className="notes-header">
        <div className="book-info">
          <BookOpen size={32} />
          <div>
            <h1>{chapterData.title}</h1>
            <p className="book-meta">
              <strong>{chapterData.book}</strong> by {chapterData.author}
            </p>
          </div>
        </div>
        
        <div className="progress-info">
          <div className="progress-stats">
            <span>{completedSections.size}/{chapterData.sections.length} sections completed</span>
            <span>{bookmarks.size} bookmarked</span>
          </div>
          <div className="header-controls">
            <div className="theme-selector">
              <label htmlFor="theme-select">🎨 Theme:</label>
              <select
                id="theme-select"
                value={currentTheme}
                onChange={(e) => changeTheme(e.target.value)}
                className="theme-select"
              >
                {Object.entries(themes).map(([key, theme]) => (
                  <option key={key} value={key}>{theme.name}</option>
                ))}
              </select>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <Tabs className="notes-tabs">
        <TabList>
          <Tab><Target size={16} /> Overview</Tab>
          <Tab><BookOpen size={16} /> Sections</Tab>
          <Tab><Lightbulb size={16} /> Key Takeaways</Tab>
          <Tab><CheckCircle size={16} /> Quiz</Tab>
        </TabList>

        <TabPanel>
          <div className="overview-panel">
            <div className="overview-card">
              <h3>Chapter Overview</h3>
              <p>{chapterData.overview.description}</p>

              <blockquote>
                <em>"{chapterData.overview.keyQuote}"</em>
                <cite>— Alan Kay</cite>
              </blockquote>

              <div className="theoretical-foundation">
                <h4>🧠 Theoretical Foundation</h4>
                <p>{chapterData.overview.theoreticalFoundation}</p>
              </div>

              <div className="modern-context">
                <h4>🌐 {chapterData.overview.modernContext.title}</h4>
                <ul>
                  {chapterData.overview.modernContext.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              <h4>🎯 Learning Objectives</h4>
              <ul>
                {chapterData.overview.learningObjectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <SectionsPanel
            sections={filteredSections}
            completedSections={completedSections}
            bookmarks={bookmarks}
            notes={notes}
            toggleSection={toggleSection}
            toggleBookmark={toggleBookmark}
            updateNote={updateNote}
          />
        </TabPanel>

        <TabPanel>
          <div className="takeaways-panel">
            <h3>Key Takeaways from Chapter 1</h3>
            <div className="takeaways-grid">
              {chapterData.keyTakeaways.map((takeaway, index) => (
                <div key={index} className="takeaway-card">
                  <Zap size={20} />
                  <p>{takeaway}</p>
                </div>
              ))}
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="quiz-panel">
            <h3>Test Your Understanding</h3>
            {chapterData.quiz.map((question, index) => (
              <QuizQuestion key={index} question={question} questionIndex={index} />
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

const SectionsPanel = ({
  sections,
  completedSections,
  bookmarks,
  notes,
  toggleSection,
  toggleBookmark,
  updateNote
}) => {
  const [selectedSection, setSelectedSection] = useState(sections[0]?.id || null);
  const [activeSubSection, setActiveSubSection] = useState('overview');

  const currentSection = sections.find(s => s.id === selectedSection);

  return (
    <div className="sections-panel-new">
      <div className="sections-sidebar">
        <h3>📚 Chapter Sections</h3>
        <div className="section-list">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`section-item ${selectedSection === section.id ? 'active' : ''}`}
              >
                <div className="section-item-header">
                  <IconComponent size={20} />
                  <span className="section-name">{section.title}</span>
                </div>
                <div className="section-status">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(section.id);
                    }}
                    className={`status-btn ${bookmarks.has(section.id) ? 'bookmarked' : ''}`}
                  >
                    <Star size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(section.id);
                    }}
                    className={`status-btn ${completedSections.has(section.id) ? 'completed' : ''}`}
                  >
                    {completedSections.has(section.id) ? <CheckCircle size={14} /> : <Circle size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section-content-area">
        {currentSection && (
          <>
            <div className="section-header-new">
              <div className="section-title-new">
                <currentSection.icon size={28} />
                <h2>{currentSection.title}</h2>
              </div>

              <div className="subsection-tabs">
                <button
                  onClick={() => setActiveSubSection('overview')}
                  className={`subsection-tab ${activeSubSection === 'overview' ? 'active' : ''}`}
                >
                  📋 Overview
                </button>
                {currentSection.theoreticalFoundations && (
                  <button
                    onClick={() => setActiveSubSection('theory')}
                    className={`subsection-tab ${activeSubSection === 'theory' ? 'active' : ''}`}
                  >
                    🔬 Theory
                  </button>
                )}
                <button
                  onClick={() => setActiveSubSection('concepts')}
                  className={`subsection-tab ${activeSubSection === 'concepts' ? 'active' : ''}`}
                >
                  🧠 Concepts
                </button>
                {(currentSection.strategies || currentSection.twitterExample || currentSection.practicalExample || currentSection.architecturalPatterns) && (
                  <button
                    onClick={() => setActiveSubSection('examples')}
                    className={`subsection-tab ${activeSubSection === 'examples' ? 'active' : ''}`}
                  >
                    💡 Examples
                  </button>
                )}
                <button
                  onClick={() => setActiveSubSection('notes')}
                  className={`subsection-tab ${activeSubSection === 'notes' ? 'active' : ''}`}
                >
                  📝 Notes
                </button>
              </div>
            </div>

            <div className="subsection-content">
              {activeSubSection === 'overview' && (
                <div className="overview-subsection">
                  <div className="key-points-card">
                    <h4>🎯 Key Points</h4>
                    <div className="points-grid">
                      {currentSection.keyPoints.map((point, index) => (
                        <div key={index} className="point-card">
                          <span className="point-number">{index + 1}</span>
                          <p>{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSubSection === 'theory' && currentSection.theoreticalFoundations && (
                <div className="theory-subsection">
                  <div className="theory-header">
                    <h4>🔬 {currentSection.theoreticalFoundations.title}</h4>
                  </div>
                  <div className="theory-concepts-grid">
                    {currentSection.theoreticalFoundations.concepts.map((concept, index) => (
                      <div key={index} className="theory-concept-card">
                        <div className="theory-concept-header">
                          <h5>{concept.name}</h5>
                          <span className="theory-badge">Theory {index + 1}</span>
                        </div>
                        <p className="theory-description">{concept.description}</p>
                        <div className="theory-details">
                          <h6>Key Points:</h6>
                          <ul>
                            {concept.details.map((detail, i) => (
                              <li key={i}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSubSection === 'concepts' && currentSection.concepts && (
                <div className="concepts-subsection">
                  <div className="concepts-grid">
                    {currentSection.concepts.map((concept, index) => (
                      <div key={index} className="concept-card-new">
                        <div className="concept-header">
                          <h4>{concept.term}</h4>
                          <span className="concept-badge">Concept {index + 1}</span>
                        </div>
                        <p className="concept-definition">{concept.definition}</p>
                        {concept.examples && (
                          <div className="concept-examples">
                            <strong>Examples:</strong>
                            <ul>
                              {concept.examples.map((example, i) => (
                                <li key={i}>{example}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSubSection === 'examples' && (
                <div className="examples-subsection">
                  {currentSection.strategies && (
                    <div className="strategies-card">
                      <h4>🛠️ Strategies & Best Practices</h4>
                      <div className="strategies-grid">
                        {currentSection.strategies.map((strategy, index) => (
                          <div key={index} className="strategy-item">
                            <span className="strategy-number">{index + 1}</span>
                            <p>{strategy}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentSection.twitterExample && (
                    <div className="twitter-example-card">
                      <h4>🐦 {currentSection.twitterExample.title}</h4>
                      <div className="approaches-grid">
                        {currentSection.twitterExample.approaches.map((approach, index) => (
                          <div key={index} className="approach-card-new">
                            <h5>{approach.name}</h5>
                            <p>{approach.description}</p>
                            <div className="pros-cons-new">
                              <div className="pros-new">
                                <strong>✅ Pros:</strong>
                                <ul>
                                  {approach.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                                </ul>
                              </div>
                              <div className="cons-new">
                                <strong>❌ Cons:</strong>
                                <ul>
                                  {approach.cons.map((con, i) => <li key={i}>{con}</li>)}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="metrics-card">
                        <h5>📊 Key Metrics</h5>
                        <div className="metrics-grid">
                          {Object.entries(currentSection.twitterExample.metrics).map(([key, value]) => (
                            <div key={key} className="metric-item">
                              <span className="metric-label">{key}</span>
                              <span className="metric-value">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSection.architecturalPatterns && (
                    <div className="architectural-patterns-card">
                      <h4>🏗️ {currentSection.architecturalPatterns.title}</h4>
                      <div className="patterns-grid">
                        {currentSection.architecturalPatterns.patterns.map((pattern, index) => (
                          <div key={index} className="pattern-card">
                            <h5>{pattern.name}</h5>
                            <p>{pattern.description}</p>
                            <div className="pattern-components">
                              <strong>Components:</strong>
                              <ul>
                                {pattern.components.map((component, i) => (
                                  <li key={i}>{component}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="pattern-usecase">
                              <strong>Use Case:</strong> {pattern.useCase}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentSection.practicalExample && (
                    <div className="practical-example-card">
                      <h4>🔧 {currentSection.practicalExample.title}</h4>
                      <p>{currentSection.practicalExample.description}</p>

                      {currentSection.practicalExample.components && (
                        <div className="components-grid">
                          <h5>System Components:</h5>
                          {Object.entries(currentSection.practicalExample.components).map(([key, value]) => (
                            <div key={key} className="component-item">
                              <strong>{key}:</strong> {value}
                            </div>
                          ))}
                        </div>
                      )}

                      {currentSection.practicalExample.dataFlow && (
                        <div className="diagram-card">
                          <h5>Data Flow:</h5>
                          <code>{currentSection.practicalExample.dataFlow}</code>
                        </div>
                      )}

                      {currentSection.practicalExample.challenges && (
                        <div className="challenges-section">
                          <h5>Key Challenges:</h5>
                          <ul>
                            {currentSection.practicalExample.challenges.map((challenge, i) => (
                              <li key={i}>{challenge}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentSection.practicalExample.insight && (
                        <div className="insight-card">
                          <Lightbulb size={16} />
                          <em>{currentSection.practicalExample.insight}</em>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeSubSection === 'notes' && (
                <div className="notes-subsection">
                  <div className="notes-card">
                    <h4>📝 Personal Notes</h4>
                    <textarea
                      placeholder={`Add your personal notes about "${currentSection.title}"...`}
                      value={notes[currentSection.id] || ''}
                      onChange={(e) => updateNote(currentSection.id, e.target.value)}
                      rows={10}
                      className="notes-textarea"
                    />
                    <div className="notes-tips">
                      <p><strong>💡 Tips:</strong> Use this space to summarize key insights, add your own examples, or note questions for further research.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const QuizQuestion = ({ question, questionIndex }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
  };

  return (
    <div className="quiz-question">
      <h4>Question {questionIndex + 1}</h4>
      <p>{question.question}</p>
      
      <div className="quiz-options">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`quiz-option ${
              selectedAnswer === index
                ? index === question.correct
                  ? 'correct'
                  : 'incorrect'
                : ''
            }`}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="quiz-explanation">
          <div className={`result ${selectedAnswer === question.correct ? 'correct' : 'incorrect'}`}>
            {selectedAnswer === question.correct ? (
              <>
                <CheckCircle size={16} />
                <span>Correct!</span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} />
                <span>Incorrect</span>
              </>
            )}
          </div>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default DataIntensiveAppsNotes;
