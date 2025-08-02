import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { 
  BookOpen, 
  CheckCircle, 
  Circle, 
  Star, 
  Lightbulb, 
  Target, 
  Database,
  FileText,
  Share2,
  AlertTriangle,
  Zap
} from 'lucide-react';
import './DataIntensiveAppsNotes.css';

const DataModelsNotes = () => {
  const [completedSections, setCompletedSections] = useState(new Set());
  const [bookmarks, setBookmarks] = useState(new Set());
  const [notes, setNotes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTheme, setCurrentTheme] = useState('purple');

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('dataModels_progress');
    const savedBookmarks = localStorage.getItem('dataModels_bookmarks');
    const savedNotes = localStorage.getItem('dataModels_notes');
    const savedTheme = localStorage.getItem('dataModels_theme');

    if (savedProgress) setCompletedSections(new Set(JSON.parse(savedProgress)));
    if (savedBookmarks) setBookmarks(new Set(JSON.parse(savedBookmarks)));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedTheme) setCurrentTheme(savedTheme);
  }, []);

  // Save progress to localStorage
  const saveProgress = () => {
    localStorage.setItem('dataModels_progress', JSON.stringify([...completedSections]));
    localStorage.setItem('dataModels_bookmarks', JSON.stringify([...bookmarks]));
    localStorage.setItem('dataModels_notes', JSON.stringify(notes));
    localStorage.setItem('dataModels_theme', currentTheme);
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

  const chapterData = {
    title: "Chapter 2: Data Models and Query Languages",
    author: "Martin Kleppmann",
    book: "Designing Data-Intensive Applications",
    
    overview: {
      description: "This chapter explores the fundamental data models that underpin modern applications: relational, document, and graph models. It examines how the choice of data model profoundly affects how we think about problems and structure solutions.",
      keyQuote: "The limits of my language mean the limits of my world.",
      quoteAuthor: "Ludwig Wittgenstein",
      theoreticalFoundation: "Data models form the foundation of how we represent and manipulate information in software systems. Each model embodies different assumptions about data relationships, query patterns, and application requirements. The choice of data model has profound implications for application architecture, performance, and maintainability.",
      learningObjectives: [
        "Understand the evolution from hierarchical to relational to NoSQL data models",
        "Master the trade-offs between relational and document models",
        "Learn when and how to use graph databases for complex relationships",
        "Understand query languages: SQL, MapReduce, Cypher, SPARQL, Datalog",
        "Explore schema-on-read vs schema-on-write approaches",
        "Understand the object-relational impedance mismatch",
        "Learn about data locality and its performance implications",
        "Master the theoretical foundations of different data models"
      ],
      modernContext: {
        title: "Why Data Models Matter More Than Ever",
        points: [
          "Polyglot persistence: Using multiple data models in single applications",
          "NoSQL movement: Challenging relational model dominance",
          "Big Data requirements: Volume, velocity, variety driving new models",
          "Microservices architecture: Each service can choose optimal data model",
          "Real-time analytics: Need for both OLTP and OLAP capabilities",
          "Graph analytics: Social networks and recommendation systems",
          "Schema evolution: Agile development requires flexible data models"
        ]
      }
    },

    sections: [
      {
        id: 'relational-vs-document',
        title: 'Relational vs Document Models',
        icon: Database,
        keyPoints: [
          'Relational model: Edgar Codd\'s 1970 proposal that dominated for 30+ years',
          'Document model: JSON/XML documents with nested structures',
          'Object-relational impedance mismatch: Translation between objects and tables',
          'NoSQL movement: Scalability, open source, specialized queries, schema flexibility',
          'One-to-many relationships: Natural fit for document model',
          'Many-to-many relationships: Better handled by relational model',
          'Schema-on-read vs schema-on-write: Different approaches to data validation'
        ],
        theoreticalFoundations: {
          title: 'Theoretical Foundations of Data Models',
          concepts: [
            {
              name: 'Relational Model Theory',
              description: 'Mathematical foundation based on set theory and predicate logic',
              details: [
                'Relations as sets of tuples with no duplicate rows',
                'Relational algebra: Selection, projection, join, union operations',
                'Normalization theory: 1NF, 2NF, 3NF, BCNF to eliminate redundancy',
                'ACID properties: Atomicity, Consistency, Isolation, Durability',
                'Codd\'s 12 rules: Defining what makes a truly relational system'
              ]
            },
            {
              name: 'Document Model Theory',
              description: 'Semi-structured data model based on hierarchical organization',
              details: [
                'Tree-structured data with nested objects and arrays',
                'Schema flexibility through dynamic typing',
                'Aggregate-oriented design: Related data stored together',
                'Denormalization strategies: Trading storage for query performance',
                'Eventual consistency models: BASE properties vs ACID'
              ]
            },
            {
              name: 'Impedance Mismatch Theory',
              description: 'Fundamental disconnect between object-oriented and relational paradigms',
              details: [
                'Object identity vs relational keys: Different identity concepts',
                'Inheritance vs tables: Mapping object hierarchies to flat structures',
                'Associations vs foreign keys: Different relationship representations',
                'Encapsulation vs normalization: Conflicting design principles',
                'Polymorphism vs static schemas: Dynamic vs static type systems'
              ]
            }
          ]
        },
        concepts: [
          {
            term: 'Relational Model',
            definition: 'Edgar Codd\'s 1970 mathematical model organizing data into relations (tables) of tuples (rows)',
            examples: ['SQL databases: PostgreSQL, MySQL, Oracle', 'ACID transactions', 'Normalized schemas'],
            characteristics: [
              'Data organized into tables with rows and columns',
              'Strong consistency through ACID properties',
              'Declarative query language (SQL)',
              'Schema-on-write with strict data validation',
              'Excellent support for complex queries and joins'
            ],
            advantages: [
              'Mature ecosystem with decades of optimization',
              'Strong consistency guarantees',
              'Powerful query capabilities with SQL',
              'Well-understood by developers and DBAs',
              'Excellent tooling and vendor support'
            ],
            disadvantages: [
              'Object-relational impedance mismatch',
              'Rigid schema makes evolution difficult',
              'Horizontal scaling challenges',
              'Performance issues with complex joins',
              'Not ideal for hierarchical data structures'
            ]
          },
          {
            term: 'Document Model',
            definition: 'Semi-structured data model storing data as documents (JSON, XML, BSON) with nested structures',
            examples: ['MongoDB', 'CouchDB', 'Amazon DocumentDB', 'JSON columns in PostgreSQL'],
            characteristics: [
              'Hierarchical data structures with nesting',
              'Schema flexibility and dynamic fields',
              'Better locality for one-to-many relationships',
              'Natural fit for object-oriented programming',
              'Aggregate-oriented design patterns'
            ],
            advantages: [
              'Eliminates object-relational impedance mismatch',
              'Schema flexibility enables agile development',
              'Better performance for document-centric queries',
              'Natural representation of hierarchical data',
              'Easier horizontal scaling'
            ],
            disadvantages: [
              'Poor support for many-to-many relationships',
              'Limited query capabilities compared to SQL',
              'Potential for data duplication and inconsistency',
              'Lack of standardized query language',
              'Weaker consistency guarantees'
            ]
          },
          {
            term: 'Object-Relational Impedance Mismatch',
            definition: 'The conceptual disconnect between object-oriented programming and relational database models',
            examples: ['ORM frameworks: Hibernate, ActiveRecord', 'Manual mapping code', 'Data transfer objects'],
            manifestations: [
              'Object identity vs primary keys: Different identity concepts',
              'Inheritance vs table structures: Mapping class hierarchies',
              'Associations vs foreign keys: Different relationship models',
              'Encapsulation vs normalization: Conflicting design goals',
              'Collections vs result sets: Different data access patterns'
            ],
            solutions: [
              'Object-Relational Mapping (ORM) frameworks',
              'Data Access Object (DAO) patterns',
              'Repository pattern for data access abstraction',
              'Document databases for object-like storage',
              'GraphQL for flexible data fetching'
            ]
          },
          {
            term: 'Schema-on-Read vs Schema-on-Write',
            definition: 'Two approaches to data validation: at write time (traditional) vs read time (NoSQL)',
            examples: ['Schema-on-write: SQL DDL', 'Schema-on-read: JSON parsing in application'],
            comparison: [
              'Schema-on-write: Structure enforced by database',
              'Schema-on-read: Structure interpreted by application',
              'Write-time: Static typing analogy',
              'Read-time: Dynamic typing analogy',
              'Trade-offs between flexibility and safety'
            ],
            useCase: [
              'Schema-on-write: Stable, well-defined data structures',
              'Schema-on-read: Evolving schemas and heterogeneous data',
              'Hybrid approaches: Optional schema validation',
              'Migration strategies: Gradual schema evolution'
            ]
          },
          {
            term: 'Data Locality',
            definition: 'The principle of storing related data physically close together to improve access performance',
            examples: ['Document storage', 'Column families', 'Clustered indexes', 'Denormalization'],
            benefits: [
              'Reduced disk seeks for related data access',
              'Better cache utilization',
              'Improved query performance for hierarchical data',
              'Reduced network round trips in distributed systems'
            ],
            tradeoffs: [
              'Increased storage requirements due to duplication',
              'Complex update operations for denormalized data',
              'Potential for data inconsistency',
              'Reduced flexibility for different access patterns'
            ]
          }
        ],
        historicalContext: {
          title: 'Evolution of Data Models',
          timeline: [
            {
              era: '1960s-1970s',
              model: 'Hierarchical Model (IMS)',
              description: 'Tree-structured data, similar to modern document databases',
              limitations: ['Difficult many-to-many relationships', 'Manual navigation required']
            },
            {
              era: '1970s',
              model: 'Network Model (CODASYL)',
              description: 'Graph-like structure with multiple parents per record',
              limitations: ['Complex access paths', 'Difficult to modify', 'Imperative queries']
            },
            {
              era: '1970s-2000s',
              model: 'Relational Model',
              description: 'Mathematical foundation with declarative queries',
              advantages: ['Query optimizer', 'Data independence', 'ACID properties']
            },
            {
              era: '2000s-Present',
              model: 'NoSQL Movement',
              description: 'Document, key-value, column-family, and graph databases',
              drivers: ['Web scale', 'Agile development', 'Big data', 'Cloud computing']
            }
          ]
        },
        practicalExample: {
          title: 'LinkedIn Profile: Relational vs Document Comparison',
          description: 'Comparing how a LinkedIn profile would be modeled in relational vs document databases',
          relationalApproach: {
            tables: ['users', 'positions', 'education', 'contact_info'],
            advantages: ['Normalized data', 'No duplication', 'Easy to update organization info'],
            disadvantages: ['Multiple joins required', 'Complex queries', 'Poor locality']
          },
          documentApproach: {
            structure: 'Single JSON document with nested arrays',
            advantages: ['Single query to fetch profile', 'Better locality', 'Natural object mapping'],
            disadvantages: ['Data duplication', 'Difficult to update organization info', 'Limited querying']
          },
          hybridApproach: {
            description: 'Using both models strategically',
            strategy: 'Document for profile display, relational for analytics and complex queries'
          }
        }
      },

      {
        id: 'nosql-movement',
        title: 'The NoSQL Movement',
        icon: FileText,
        keyPoints: [
          'NoSQL originally meant "Not Only SQL", not "No SQL"',
          'Driven by web-scale requirements and agile development needs',
          'Four main categories: Document, Key-Value, Column-Family, Graph',
          'CAP theorem: Choose between Consistency, Availability, Partition tolerance',
          'BASE properties: Basically Available, Soft state, Eventual consistency',
          'Polyglot persistence: Using multiple data models in one application',
          'Trade-offs: Flexibility vs consistency, scalability vs complexity'
        ],
        theoreticalFoundations: {
          title: 'NoSQL Theoretical Framework',
          concepts: [
            {
              name: 'CAP Theorem',
              description: 'Fundamental theorem about distributed systems trade-offs',
              details: [
                'Consistency: All nodes see the same data simultaneously',
                'Availability: System remains operational during failures',
                'Partition tolerance: System continues despite network failures',
                'Can only guarantee two of three properties simultaneously',
                'Real systems choose CP (consistent) or AP (available) during partitions'
              ]
            },
            {
              name: 'BASE Properties',
              description: 'Alternative to ACID for distributed systems',
              details: [
                'Basically Available: System guarantees availability',
                'Soft state: State may change over time without input',
                'Eventual consistency: System will become consistent over time',
                'Optimistic approach to consistency',
                'Better suited for distributed, high-scale systems'
              ]
            },
            {
              name: 'Consistency Models',
              description: 'Different levels of consistency guarantees',
              details: [
                'Strong consistency: All reads receive most recent write',
                'Eventual consistency: System will converge to consistent state',
                'Causal consistency: Causally related operations are ordered',
                'Session consistency: Consistency within a user session',
                'Monotonic read consistency: No going backwards in time'
              ]
            }
          ]
        },
        nosqlCategories: {
          title: 'Four Categories of NoSQL Databases',
          categories: [
            {
              name: 'Document Databases',
              description: 'Store data as documents (JSON, XML, BSON)',
              examples: ['MongoDB', 'CouchDB', 'Amazon DocumentDB'],
              useCase: 'Content management, catalogs, user profiles',
              advantages: ['Schema flexibility', 'Natural object mapping', 'Good locality'],
              disadvantages: ['Limited querying', 'Eventual consistency', 'No joins']
            },
            {
              name: 'Key-Value Stores',
              description: 'Simple key-value pairs with high performance',
              examples: ['Redis', 'Amazon DynamoDB', 'Riak'],
              useCase: 'Caching, session storage, shopping carts',
              advantages: ['High performance', 'Simple model', 'Easy scaling'],
              disadvantages: ['Limited querying', 'No relationships', 'Simple data model']
            },
            {
              name: 'Column-Family',
              description: 'Wide tables with dynamic columns',
              examples: ['Cassandra', 'HBase', 'Amazon SimpleDB'],
              useCase: 'Time-series data, IoT, analytics',
              advantages: ['Efficient for sparse data', 'Good compression', 'Scalable'],
              disadvantages: ['Complex data modeling', 'Limited transactions', 'Eventual consistency']
            },
            {
              name: 'Graph Databases',
              description: 'Nodes and edges for relationship-heavy data',
              examples: ['Neo4j', 'Amazon Neptune', 'ArangoDB'],
              useCase: 'Social networks, recommendations, fraud detection',
              advantages: ['Natural relationships', 'Traversal queries', 'Pattern matching'],
              disadvantages: ['Scaling challenges', 'Complex queries', 'Specialized use cases']
            }
          ]
        }
      },

      {
        id: 'graph-data-models',
        title: 'Graph-like Data Models',
        icon: Share2,
        keyPoints: [
          'Graphs excel at modeling complex relationships and interconnected data',
          'Two main models: Property graphs and Triple-stores (RDF)',
          'Query languages: Cypher, SPARQL, Datalog for different graph models',
          'Graph algorithms: PageRank, shortest path, community detection',
          'Use cases: Social networks, recommendation engines, fraud detection',
          'Advantages: Natural relationship modeling, flexible schema, powerful traversals',
          'Challenges: Scaling, complex queries, specialized expertise required'
        ],
        theoreticalFoundations: {
          title: 'Graph Theory and Database Applications',
          concepts: [
            {
              name: 'Graph Theory Fundamentals',
              description: 'Mathematical foundation of graph databases',
              details: [
                'Vertices (nodes) and edges (relationships) as basic elements',
                'Directed vs undirected graphs: Relationship directionality',
                'Weighted graphs: Edges with associated values',
                'Graph algorithms: Traversal, shortest path, centrality measures',
                'Graph properties: Connectivity, cycles, planarity'
              ]
            },
            {
              name: 'Property Graph Model',
              description: 'Graph model with properties on vertices and edges',
              details: [
                'Vertices: Unique ID, labels, properties (key-value pairs)',
                'Edges: Unique ID, start/end vertices, label, properties',
                'Schema flexibility: No restrictions on connections',
                'Efficient traversal: Indexes on both directions',
                'Multi-relational: Different edge types in same graph'
              ]
            },
            {
              name: 'RDF Triple-Store Model',
              description: 'Graph model based on subject-predicate-object triples',
              details: [
                'Triples: (subject, predicate, object) statements',
                'URIs: Global identifiers for resources',
                'Literals: Primitive values (strings, numbers)',
                'Semantic web: Machine-readable data exchange',
                'SPARQL: Standard query language for RDF'
              ]
            }
          ]
        }
      }
    ],

    keyTakeaways: [
      'Data models profoundly affect how we think about and solve problems',
      'Each data model optimizes for different use cases and access patterns',
      'The relational model excels at complex queries and many-to-many relationships',
      'Document models provide better locality and schema flexibility for hierarchical data',
      'Graph models are ideal for highly interconnected data with complex relationships',
      'Object-relational impedance mismatch drives adoption of document databases',
      'Schema-on-read enables agile development but requires careful application logic',
      'NoSQL doesn\'t mean "no schema" - it means schema-on-read with implicit structure',
      'Polyglot persistence allows optimal data model choice per use case',
      'Query languages reflect the underlying data model assumptions and capabilities',
      'CAP theorem forces trade-offs between consistency, availability, and partition tolerance',
      'BASE properties (Basically Available, Soft state, Eventual consistency) complement ACID',
      'Data locality improves performance but may increase storage and complexity',
      'Historical evolution: Hierarchical → Network → Relational → NoSQL reflects changing needs',
      'Document databases excel at one-to-many relationships but struggle with many-to-many',
      'Graph databases provide natural relationship modeling but face scaling challenges',
      'The choice of data model has profound implications for application architecture',
      'Modern applications often use multiple data models (polyglot persistence)',
      'Schema evolution strategies differ significantly between relational and NoSQL systems',
      'Query optimization techniques vary greatly across different data models'
    ],

    quiz: [
      {
        question: 'What is the object-relational impedance mismatch?',
        options: [
          'A performance problem in databases',
          'The disconnect between object-oriented programming and relational data models',
          'A type of database corruption',
          'A network connectivity issue'
        ],
        correct: 1,
        explanation: 'The object-relational impedance mismatch refers to the conceptual disconnect between object-oriented programming languages and relational databases, requiring translation layers like ORMs to bridge the gap between objects and tables.'
      },
      {
        question: 'What is the main advantage of document databases for one-to-many relationships?',
        options: [
          'They are faster than relational databases',
          'They provide better data locality by storing related data together',
          'They use less storage space',
          'They are easier to install'
        ],
        correct: 1,
        explanation: 'Document databases store related data together in a single document, providing better locality and eliminating the need for joins when accessing hierarchical data structures like user profiles with positions and education.'
      },
      {
        question: 'According to the CAP theorem, what trade-off must distributed systems make?',
        options: [
          'Between speed and accuracy',
          'Between consistency, availability, and partition tolerance (can only guarantee two)',
          'Between cost and performance',
          'Between security and usability'
        ],
        correct: 1,
        explanation: 'The CAP theorem states that distributed systems can only guarantee two out of three properties: Consistency (all nodes see the same data), Availability (system remains operational), and Partition tolerance (system continues despite network failures).'
      },
      {
        question: 'What does "schema-on-read" mean in the context of document databases?',
        options: [
          'The schema is defined when reading data from disk',
          'The data structure is interpreted by the application when reading, not enforced by the database',
          'Reading data requires a predefined schema',
          'The schema is automatically generated when reading data'
        ],
        correct: 1,
        explanation: 'Schema-on-read means the structure of data is implicit and only interpreted when the data is read by the application, in contrast to schema-on-write where the database enforces structure when data is written.'
      },
      {
        question: 'Why are graph databases particularly well-suited for social network applications?',
        options: [
          'They are faster than other databases',
          'They naturally model relationships and enable efficient traversal queries',
          'They use less memory',
          'They are easier to set up'
        ],
        correct: 1,
        explanation: 'Graph databases excel at modeling relationships (friendships, follows, likes) and enable efficient traversal queries to find connections, mutual friends, or recommendation paths that would be complex and slow in relational databases.'
      },
      {
        question: 'What was the main limitation of the hierarchical data model (like IBM\'s IMS) that led to the development of the relational model?',
        options: [
          'It was too slow',
          'It couldn\'t handle many-to-many relationships well and required manual navigation',
          'It used too much storage',
          'It was too expensive'
        ],
        correct: 1,
        explanation: 'The hierarchical model struggled with many-to-many relationships and required developers to manually navigate access paths, making it difficult to query data in flexible ways. The relational model solved this with declarative queries and automatic query optimization.'
      },
      {
        question: 'In the context of NoSQL databases, what do BASE properties stand for?',
        options: [
          'Basic, Available, Secure, Efficient',
          'Basically Available, Soft state, Eventual consistency',
          'Backup, Archive, Store, Execute',
          'Batch, Atomic, Sequential, Efficient'
        ],
        correct: 1,
        explanation: 'BASE properties are an alternative to ACID for distributed systems: Basically Available (system guarantees availability), Soft state (state may change without input), and Eventual consistency (system will become consistent over time).'
      },
      {
        question: 'What is polyglot persistence?',
        options: [
          'Using multiple programming languages in one application',
          'Using different data storage technologies for different data storage needs within a single application',
          'Storing data in multiple languages',
          'Using multiple database vendors'
        ],
        correct: 1,
        explanation: 'Polyglot persistence means using different data storage technologies (relational, document, graph, key-value) within a single application, choosing the optimal data model for each specific use case rather than forcing everything into one model.'
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
              <label htmlFor="theme-select-ch2">🎨 Theme:</label>
              <select
                id="theme-select-ch2"
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
                <cite>— {chapterData.overview.quoteAuthor}</cite>
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
            <h3>Key Takeaways from Chapter 2</h3>
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

// Reuse the SectionsPanel and QuizQuestion components from DataIntensiveAppsNotes
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
                {currentSection.concepts && (
                  <button
                    onClick={() => setActiveSubSection('concepts')}
                    className={`subsection-tab ${activeSubSection === 'concepts' ? 'active' : ''}`}
                  >
                    🧠 Concepts
                  </button>
                )}
                {(currentSection.historicalContext || currentSection.nosqlCategories || currentSection.practicalExample) && (
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
                        {concept.characteristics && (
                          <div className="concept-section">
                            <strong>Characteristics:</strong>
                            <ul>
                              {concept.characteristics.map((char, i) => (
                                <li key={i}>{char}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {concept.advantages && (
                          <div className="concept-section advantages">
                            <strong>✅ Advantages:</strong>
                            <ul>
                              {concept.advantages.map((adv, i) => (
                                <li key={i}>{adv}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {concept.disadvantages && (
                          <div className="concept-section disadvantages">
                            <strong>❌ Disadvantages:</strong>
                            <ul>
                              {concept.disadvantages.map((dis, i) => (
                                <li key={i}>{dis}</li>
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
                  {currentSection.historicalContext && (
                    <div className="historical-context-card">
                      <h4>📜 {currentSection.historicalContext.title}</h4>
                      <div className="timeline">
                        {currentSection.historicalContext.timeline.map((era, index) => (
                          <div key={index} className="timeline-item">
                            <div className="timeline-era">{era.era}</div>
                            <div className="timeline-content">
                              <h5>{era.model}</h5>
                              <p>{era.description}</p>
                              {era.limitations && (
                                <div className="timeline-limitations">
                                  <strong>Limitations:</strong>
                                  <ul>
                                    {era.limitations.map((limit, i) => (
                                      <li key={i}>{limit}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {era.advantages && (
                                <div className="timeline-advantages">
                                  <strong>Advantages:</strong>
                                  <ul>
                                    {era.advantages.map((adv, i) => (
                                      <li key={i}>{adv}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {era.drivers && (
                                <div className="timeline-drivers">
                                  <strong>Drivers:</strong>
                                  <ul>
                                    {era.drivers.map((driver, i) => (
                                      <li key={i}>{driver}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentSection.nosqlCategories && (
                    <div className="nosql-categories-card">
                      <h4>🗂️ {currentSection.nosqlCategories.title}</h4>
                      <div className="categories-grid">
                        {currentSection.nosqlCategories.categories.map((category, index) => (
                          <div key={index} className="category-card">
                            <h5>{category.name}</h5>
                            <p>{category.description}</p>
                            <div className="category-details">
                              <div className="category-examples">
                                <strong>Examples:</strong> {category.examples.join(', ')}
                              </div>
                              <div className="category-usecase">
                                <strong>Use Case:</strong> {category.useCase}
                              </div>
                              <div className="category-pros-cons">
                                <div className="category-advantages">
                                  <strong>✅ Advantages:</strong>
                                  <ul>
                                    {category.advantages.map((adv, i) => (
                                      <li key={i}>{adv}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="category-disadvantages">
                                  <strong>❌ Disadvantages:</strong>
                                  <ul>
                                    {category.disadvantages.map((dis, i) => (
                                      <li key={i}>{dis}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
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

                      <div className="example-comparison">
                        {currentSection.practicalExample.relationalApproach && (
                          <div className="approach-section">
                            <h5>🗃️ Relational Approach</h5>
                            <div className="approach-details">
                              <div><strong>Tables:</strong> {currentSection.practicalExample.relationalApproach.tables.join(', ')}</div>
                              <div className="approach-pros-cons">
                                <div className="approach-advantages">
                                  <strong>✅ Advantages:</strong>
                                  <ul>
                                    {currentSection.practicalExample.relationalApproach.advantages.map((adv, i) => (
                                      <li key={i}>{adv}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="approach-disadvantages">
                                  <strong>❌ Disadvantages:</strong>
                                  <ul>
                                    {currentSection.practicalExample.relationalApproach.disadvantages.map((dis, i) => (
                                      <li key={i}>{dis}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentSection.practicalExample.documentApproach && (
                          <div className="approach-section">
                            <h5>📄 Document Approach</h5>
                            <div className="approach-details">
                              <div><strong>Structure:</strong> {currentSection.practicalExample.documentApproach.structure}</div>
                              <div className="approach-pros-cons">
                                <div className="approach-advantages">
                                  <strong>✅ Advantages:</strong>
                                  <ul>
                                    {currentSection.practicalExample.documentApproach.advantages.map((adv, i) => (
                                      <li key={i}>{adv}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="approach-disadvantages">
                                  <strong>❌ Disadvantages:</strong>
                                  <ul>
                                    {currentSection.practicalExample.documentApproach.disadvantages.map((dis, i) => (
                                      <li key={i}>{dis}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentSection.practicalExample.hybridApproach && (
                          <div className="approach-section hybrid">
                            <h5>🔄 Hybrid Approach</h5>
                            <p>{currentSection.practicalExample.hybridApproach.description}</p>
                            <div className="hybrid-strategy">
                              <strong>Strategy:</strong> {currentSection.practicalExample.hybridApproach.strategy}
                            </div>
                          </div>
                        )}
                      </div>
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

export default DataModelsNotes;
