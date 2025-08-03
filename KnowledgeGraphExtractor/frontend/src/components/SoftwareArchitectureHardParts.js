import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Code,
  Database,
  GitBranch,
  Layers,
  Network,
  Settings,
  Target,
  Users,
  Zap,
  ChevronRight,
  ChevronDown,
  FileText,
  Lightbulb,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Upload,
  RotateCcw,
  Copy
} from 'lucide-react';
import './SoftwareArchitectureHardParts.css';

const SoftwareArchitectureHardParts = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({});
  const [theme, setTheme] = useState('architecture-blue');

  const themes = {
    'architecture-blue': {
      name: 'Architecture Blue',
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)'
    },
    'distributed-purple': {
      name: 'Distributed Purple',
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#8b5cf6',
      background: 'linear-gradient(135deg, #581c87 0%, #6d28d9 50%, #7c3aed 100%)'
    },
    'microservices-green': {
      name: 'Microservices Green',
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)'
    },
    'quantum-orange': {
      name: 'Quantum Orange',
      primary: '#ea580c',
      secondary: '#c2410c',
      accent: '#f97316',
      background: 'linear-gradient(135deg, #9a3412 0%, #c2410c 50%, #ea580c 100%)'
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const selectedTheme = themes[theme];
    root.style.setProperty('--theme-primary', selectedTheme.primary);
    root.style.setProperty('--theme-secondary', selectedTheme.secondary);
    root.style.setProperty('--theme-accent', selectedTheme.accent);
    root.style.setProperty('--theme-background', selectedTheme.background);
  }, [theme]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const tableOfContents = {
    preface: { title: "Preface", page: "xi" },
    chapters: [
      {
        id: "ch1",
        title: "What Happens When There Are No \"Best Practices\"?",
        page: 1,
        sections: [
          "Why \"The Hard Parts\"?",
          "Giving Timeless Advice About Software Architecture",
          "The Importance of Data in Architecture",
          "Architectural Decision Records",
          "Architecture Fitness Functions",
          "Using Fitness Functions",
          "Architecture Versus Design: Keeping Definitions Simple",
          "Introducing the Sysops Squad Saga"
        ]
      },
      {
        id: "ch2",
        title: "Discerning Coupling in Software Architecture",
        page: 25,
        sections: [
          "Architecture (Quantum | Quanta)",
          "Independently Deployable",
          "High Functional Cohesion",
          "High Static Coupling",
          "Dynamic Quantum Coupling",
          "Sysops Squad Saga: Understanding Quanta"
        ]
      }
    ],
    parts: [
      {
        title: "Part I: Pulling Things Apart",
        chapters: ["ch3", "ch4", "ch5", "ch6", "ch7"]
      },
      {
        title: "Part II: Putting Things Back Together", 
        chapters: ["ch8", "ch9", "ch10", "ch11", "ch12", "ch13", "ch14", "ch15"]
      }
    ]
  };

  const keyInsights = {
    fundamentals: {
      title: "Core Architecture Fundamentals",
      icon: <Target size={24} />,
      insights: [
        {
          category: "The Hard Parts Definition",
          icon: <Target size={20} />,
          content: "Software architecture is 'the stuff that's hard to change later' - focusing on foundational decisions without clear best practices. Emphasis on trade-off analysis over prescriptive solutions."
        },
        {
          category: "Trade-off Analysis Framework",
          icon: <Settings size={20} />,
          content: "Three-step process: 1) Find what parts are entangled together, 2) Analyze how they are coupled, 3) Assess trade-offs by determining impact of change on interdependent systems."
        },
        {
          category: "Architecture vs Design",
          icon: <Layers size={20} />,
          content: "Architecture: Foundational decisions that are hard to change. Design: More easily changeable implementation details. Focus on structural, foundational aspects."
        },
        {
          category: "Data Longevity Principle",
          icon: <Database size={20} />,
          content: "Tim Berners-Lee: 'Data is a precious thing and will last longer than the systems themselves.' Data outlasts the systems that process it."
        },
        {
          category: "Architecture Evolution",
          icon: <TrendingUp size={20} />,
          content: "10 years ago: SOA dominated. Today: Microservices favored. Driven by Linux viability, automation, containers, and Kubernetes emergence."
        }
      ]
    },
    quantum: {
      title: "Architecture Quantum Concepts",
      icon: <Zap size={24} />,
      insights: [
        {
          category: "Quantum Definition",
          icon: <Zap size={20} />,
          content: "An independently deployable artifact with high functional cohesion, high static coupling, and synchronous dynamic coupling. The fundamental unit of architecture analysis."
        },
        {
          category: "Independent Deployability",
          icon: <Upload size={20} />,
          content: "Each quantum represents a separate deployable unit. Monolith = single quantum. Microservices = potentially multiple quanta. Deployment boundaries matter."
        },
        {
          category: "Functional Cohesion",
          icon: <Users size={20} />,
          content: "High functional cohesion means related elements are grouped together. Overlaps with Domain-Driven Design's bounded context. Prevents quantum from becoming too broad."
        },
        {
          category: "Static Coupling Analysis",
          icon: <Layers size={20} />,
          content: "How static dependencies resolve via contracts. Includes OS dependencies, frameworks, libraries, operational requirements. Question: 'What's needed to bootstrap this service?'"
        },
        {
          category: "Dynamic Coupling Patterns",
          icon: <GitBranch size={20} />,
          content: "How quanta communicate at runtime. Synchronous (blocks until response) vs Asynchronous (fire-and-forget). Measured during actual runtime interactions."
        },
        {
          category: "Quantum by Architecture Style",
          icon: <Network size={20} />,
          content: "Monolithic: Always 1 quantum. Service-based: 1 quantum (shared DB). Microservices: Each service can be own quantum if properly decoupled. Shared database creates coupling point."
        }
      ]
    },
    dataArchitecture: {
      title: "Data Architecture Patterns",
      icon: <Database size={24} />,
      insights: [
        {
          category: "Operational vs Analytical Data",
          icon: <Database size={20} />,
          content: "Operational (OLTP): Sales, transactions, inventory - critical for daily operations. Analytical: Predictions, trending, BI - drives strategic decisions, not critical for daily ops."
        },
        {
          category: "Database Decomposition Process",
          icon: <GitBranch size={20} />,
          content: "5 steps: 1) Analyze DB and create data domains, 2) Assign tables to domains, 3) Separate connections, 4) Move schemas to separate servers, 5) Switch to independent servers."
        },
        {
          category: "Data Ownership Patterns",
          icon: <Users size={20} />,
          content: "Single: One service owns table. Common: Multiple services write (create dedicated owner). Joint: Multiple services in same domain write (use split/delegate techniques)."
        },
        {
          category: "Database Types Selection",
          icon: <Settings size={20} />,
          content: "Relational: ACID + complex queries. Key-Value: Simple lookups. Document: JSON/XML flexibility. Graph: Relationships. NewSQL: ACID + scaling. Time-Series: IoT/metrics."
        },
        {
          category: "Eventual Consistency Patterns",
          icon: <Clock size={20} />,
          content: "Background Sync: Nightly batch processes. Orchestrated Request: Mediator coordinates. Event-Based: Services communicate via events with durable subscribers."
        }
      ]
    },
    fitnessFunction: {
      title: "Architecture Fitness Functions",
      icon: <CheckCircle size={24} />,
      insights: [
        {
          category: "Fitness Function Definition",
          icon: <CheckCircle size={20} />,
          content: "Any mechanism that performs objective integrity assessment of architecture characteristics. Automated governance through 'executable checklists' that prevent architectural erosion."
        },
        {
          category: "Component Cycle Detection",
          icon: <RotateCcw size={20} />,
          content: "Prevents circular dependencies between components using tools like JDepend. Critical for maintaining modularity and avoiding Big Ball of Mud anti-pattern."
        },
        {
          category: "Layer Dependency Governance",
          icon: <Layers size={20} />,
          content: "ArchUnit and NetArchTest enforce layered architecture rules. Prevents presentation layer from directly accessing data layer, maintaining separation of concerns."
        },
        {
          category: "Component Dependency Restrictions",
          icon: <Shield size={20} />,
          content: "Restrict specific components from depending on others. Example: Ticket Maintenance cannot access Expert Profile. One fitness function per restriction rule."
        },
        {
          category: "Domain Governance",
          icon: <Target size={20} />,
          content: "Ensure only approved domains exist (ticket, customer, admin). Prevent inadvertent domain creation by development teams. Maintain bounded context integrity."
        },
        {
          category: "Coupling Threshold Monitoring",
          icon: <TrendingUp size={20} />,
          content: "Monitor total coupling (afferent + efferent) per component. Alert when threshold exceeded (e.g., >15 dependencies). Promotes component decomposition discussions."
        }
      ]
    },
    communicationPatterns: {
      title: "Communication & Saga Patterns",
      icon: <Network size={24} />,
      insights: [
        {
          category: "Eight Saga Patterns",
          icon: <Network size={20} />,
          content: "Based on 3 dimensions: Communication (Sync/Async), Consistency (Atomic/Eventual), Coordination (Orchestrated/Choreographed). Creates 8 distinct patterns for distributed workflows."
        },
        {
          category: "Epic Saga Pattern",
          icon: <Target size={20} />,
          content: "Synchronous, Atomic, Orchestrated. Traditional request-response with central coordination. Good for simple workflows with strong consistency needs."
        },
        {
          category: "Parallel Saga Pattern",
          icon: <GitBranch size={20} />,
          content: "Asynchronous, Eventual, Orchestrated. Event-driven with central orchestrator. Good for complex workflows with eventual consistency tolerance."
        },
        {
          category: "Anthology Saga Pattern",
          icon: <Users size={20} />,
          content: "Asynchronous, Eventual, Choreographed. Pure event-driven, distributed coordination. Best for highly decoupled, scalable systems."
        },
        {
          category: "Horror Story Pattern",
          icon: <AlertTriangle size={20} />,
          content: "Asynchronous, Atomic, Choreographed. Distributed transactions without coordinator. Avoid this pattern - extremely difficult to implement correctly."
        },
        {
          category: "Compensating Updates",
          icon: <RotateCcw size={20} />,
          content: "Reverse operations in distributed transactions. Challenges: No transactional isolation, other services may act on data, compensating updates can fail."
        }
      ]
    },
    modernPatterns: {
      title: "Modern Architecture Patterns",
      icon: <Lightbulb size={24} />,
      insights: [
        {
          category: "Microservices Quantum Analysis",
          icon: <Zap size={20} />,
          content: "Each microservice potentially forms own quantum if: independently deployable, own database, minimal shared dependencies, clear bounded context, autonomous team."
        },
        {
          category: "Service Mesh Benefits",
          icon: <Network size={20} />,
          content: "Traffic management, security policies, observability, resilience patterns. Language agnostic with operational consistency. Handles cross-cutting concerns via sidecars."
        },
        {
          category: "Cloud Native Patterns",
          icon: <Upload size={20} />,
          content: "Auto-scaling, managed services, serverless functions, event-driven architectures, container orchestration, infrastructure as code. Modern deployment strategies."
        },
        {
          category: "Distributed Data Access",
          icon: <Database size={20} />,
          content: "Interservice Communication, Column Schema Replication, Replicated Caching, Data Domain patterns. Each with specific trade-offs for latency, consistency, complexity."
        },
        {
          category: "Contract Patterns",
          icon: <FileText size={20} />,
          content: "Strict contracts (JSON Schema, GraphQL) vs Loose contracts (name-value pairs). Trade-off between certainty/tooling vs flexibility/decoupling."
        },
        {
          category: "Reuse Strategies",
          icon: <Copy size={20} />,
          content: "Code Replication (static, one-off), Shared Library (versioning challenges), Shared Service (bottleneck risk), Sidecars (infrastructure concerns)."
        }
      ]
    }
  };

  const practicalExamples = [
    {
      title: "Component Cycle Detection",
      language: "java",
      description: "Prevents circular dependencies between components using JDepend",
      code: `// Example 1-1: Fitness function to detect component cycles
public class CycleTest {
    private JDepend jdepend;

    @BeforeEach
    void init() {
        jdepend = new JDepend();
        jdepend.addDirectory("/path/to/project/persistence/classes");
        jdepend.addDirectory("/path/to/project/web/classes");
        jdepend.addDirectory("/path/to/project/thirdpartyjars");
    }

    @Test
    void testNoCycles() {
        Collection packages = jdepend.analyze();
        assertFalse(jdepend.containsCycles());
    }
}`
    },
    {
      title: "Layer Architecture Governance",
      language: "java",
      description: "ArchUnit fitness function to enforce layered architecture rules",
      code: `// Example 1-2: ArchUnit fitness function to govern layers
layeredArchitecture()
    .layer("Controller").definedBy("..controller..")
    .layer("Service").definedBy("..service..")
    .layer("Persistence").definedBy("..persistence..")
    .whereLayer("Controller").mayNotBeAccessedByAnyLayer()
    .whereLayer("Service").mayOnlyBeAccessedByLayers("Controller")
    .whereLayer("Persistence").mayOnlyBeAccessedByLayers("Service")`
    },
    {
      title: ".NET Layer Dependencies",
      language: "csharp",
      description: "NetArchTest for preventing direct dependencies between layers",
      code: `// Example 1-3: NetArchTest for layer dependencies
var result = Types.InCurrentDomain()
    .That()
    .ResideInNamespace("NetArchTest.SampleLibrary.Presentation")
    .ShouldNot()
    .HaveDependencyOn("NetArchTest.SampleLibrary.Data")
    .GetResult()
    .IsSuccessful;`
    },
    {
      title: "Component Dependency Restrictions",
      language: "java",
      description: "Restrict specific components from accessing others",
      code: `// Example 5-9: ArchUnit code for dependency restrictions
public void ticket_maintenance_cannot_access_expert_profile() {
    noClasses().that()
        .resideInAPackage("..ss.ticket.maintenance..")
        .should().accessClassesThat()
        .resideInAPackage("..ss.expert.profile..")
        .check(myClasses);
}`
    },
    {
      title: "Domain Governance",
      language: "java",
      description: "Ensure only approved domains exist in the application",
      code: `// Example 5-10: ArchUnit code for governing domains
public void restrict_domains() {
    classes()
        .should().resideInAPackage("..ss.ticket..")
        .orShould().resideInAPackage("..ss.customer..")
        .orShould().resideInAPackage("..ss.admin..")
        .check(myClasses);
}`
    },
    {
      title: "Database Table Split",
      language: "sql",
      description: "DDL for splitting tables to resolve joint ownership",
      code: `-- Example 9-1: DDL for splitting Product table
CREATE TABLE Inventory (
    product_id VARCHAR(10),
    inv_cnt INT
);

INSERT INTO Inventory VALUES (product_id, inv_cnt)
AS SELECT product_id, inv_cnt FROM Product;

COMMIT;

ALTER TABLE Product DROP COLUMN inv_cnt;`
    },
    {
      title: "Service Entry Point Annotation (Java)",
      language: "java",
      description: "Marker annotation for identifying service entry points",
      code: `// Example 8-1: Service entry point annotation
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface ServiceEntrypoint {}

/* Usage:
@ServiceEntrypoint
public class PaymentServiceAPI {
    // Service implementation
}
*/`
    },
    {
      title: "Service Entry Point Attribute (C#)",
      language: "csharp",
      description: "Marker attribute for identifying service entry points",
      code: `// Example 8-2: Service entry point attribute
[AttributeUsage(AttributeTargets.Class)]
class ServiceEntrypoint : Attribute {}

/* Usage:
[ServiceEntrypoint]
class PaymentServiceAPI {
    // Service implementation
}
*/`
    },
    {
      title: "Transactional Saga Annotation",
      language: "java",
      description: "Document and track distributed transaction patterns",
      code: `// Example 12-1: Transactional saga annotation
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Saga {
    public Transaction[] value();
    public enum Transaction {
        NEW_TICKET,
        CANCEL_TICKET,
        NEW_CUSTOMER,
        UNSUBSCRIBE,
        NEW_SUPPORT_CONTRACT
    }
}

// Usage:
@ServiceEntrypoint
@Saga({Transaction.NEW_TICKET, Transaction.CANCEL_TICKET})
public class TicketServiceAPI {
    // Service implementation
}`
    },
    {
      title: "Strict JSON Contract",
      language: "json",
      description: "JSON Schema for strict contract validation",
      code: `{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "properties": {
        "acct": {"type": "number"},
        "cusip": {"type": "string"},
        "shares": {"type": "number", "minimum": 100}
    },
    "required": ["acct", "cusip", "shares"]
}`
    },
    {
      title: "Loose JSON Contract",
      language: "json",
      description: "Simple name-value pairs for maximum flexibility",
      code: `{
    "name": "Mark",
    "status": "active",
    "joined": "2003"
}`
    },
    {
      title: "ADR Template",
      language: "markdown",
      description: "Template for documenting architectural decisions",
      code: `# ADR: [Short noun phrase containing the decision]

## Context
Short description of the problem and alternative solutions.

## Decision
The architecture decision with detailed justification.

## Consequences
Results, trade-offs, and impacts after applying the decision.`
    }
  ];

  const architecturePatterns = [
    {
      name: "Epic Saga",
      dimensions: "Synchronous, Atomic, Orchestrated",
      description: "Traditional request-response with central coordination. Mediator calls services synchronously in sequence.",
      useCase: "Simple workflows with strong consistency needs. Good error handling and rollback capabilities.",
      tradeoffs: "Pros: Strong consistency, clear error handling. Cons: Blocking calls, single point of failure."
    },
    {
      name: "Phone Tag Saga",
      dimensions: "Synchronous, Atomic, Choreographed",
      description: "Synchronous calls between services without central coordinator. Services call each other directly.",
      useCase: "Simple point-to-point workflows where services know about each other.",
      tradeoffs: "Pros: No central coordinator. Cons: Tight coupling, complex error handling."
    },
    {
      name: "Fairy Tale Saga",
      dimensions: "Synchronous, Eventual, Orchestrated",
      description: "Central orchestrator with synchronous calls but eventual consistency tolerance.",
      useCase: "Workflows where immediate response needed but eventual consistency acceptable.",
      tradeoffs: "Pros: Responsive, centralized control. Cons: Complexity in handling eventual consistency."
    },
    {
      name: "Time Travel Saga",
      dimensions: "Synchronous, Eventual, Choreographed",
      description: "Synchronous choreographed calls with eventual consistency. Complex coordination pattern.",
      useCase: "Rare pattern - typically avoided due to complexity.",
      tradeoffs: "Pros: No central coordinator. Cons: Very complex, difficult error handling."
    },
    {
      name: "Fantasy Fiction Saga",
      dimensions: "Asynchronous, Atomic, Orchestrated",
      description: "Central orchestrator using async messaging but requiring atomic consistency.",
      useCase: "High-throughput workflows requiring strong consistency guarantees.",
      tradeoffs: "Pros: Non-blocking, centralized control. Cons: Complex atomic consistency in async environment."
    },
    {
      name: "Horror Story",
      dimensions: "Asynchronous, Atomic, Choreographed",
      description: "Distributed atomic transactions without coordinator. Extremely difficult pattern.",
      useCase: "Avoid this pattern - nearly impossible to implement correctly in practice.",
      tradeoffs: "Pros: Theoretically decoupled. Cons: Practically impossible, complex failure scenarios."
    },
    {
      name: "Parallel Saga",
      dimensions: "Asynchronous, Eventual, Orchestrated",
      description: "Event-driven with central orchestrator managing eventual consistency workflows.",
      useCase: "Complex workflows with eventual consistency tolerance. Most common microservices pattern.",
      tradeoffs: "Pros: Scalable, resilient, good performance. Cons: Eventual consistency complexity."
    },
    {
      name: "Anthology Saga",
      dimensions: "Asynchronous, Eventual, Choreographed",
      description: "Pure event-driven, distributed coordination with eventual consistency.",
      useCase: "Highly decoupled, scalable systems. Best for loosely coupled domains.",
      tradeoffs: "Pros: Maximum decoupling, scalability. Cons: Complex debugging, eventual consistency."
    }
  ];

  const dataPatterns = [
    {
      name: "Interservice Communication",
      category: "Data Access",
      description: "Direct service-to-service calls for data access",
      pros: "Simple implementation, immediate consistency",
      cons: "Network latency, service availability dependencies, chatty interfaces"
    },
    {
      name: "Column Schema Replication",
      category: "Data Access",
      description: "Replicate specific columns to consuming services",
      pros: "Reduces network calls, faster access",
      cons: "Data synchronization complexity, storage overhead, eventual consistency"
    },
    {
      name: "Replicated Caching",
      category: "Data Access",
      description: "In-memory cache replicas across services (Hazelcast, Apache Ignite)",
      pros: "Eliminates network calls, high performance",
      cons: "Cache synchronization, memory overhead, complexity"
    },
    {
      name: "Data Domain",
      category: "Data Access",
      description: "Multiple services share access to data domain/schema",
      pros: "Reduced latency, shared data access",
      cons: "Potential security issues, looser bounded contexts"
    },
    {
      name: "Background Synchronization",
      category: "Eventual Consistency",
      description: "Nightly batch processes or periodic sync jobs",
      pros: "Simple implementation, good for non-critical sync",
      cons: "Longest consistency delay, complex change detection"
    },
    {
      name: "Orchestrated Request-Based",
      category: "Eventual Consistency",
      description: "Mediator coordinates distributed transaction with compensating actions",
      pros: "Better error handling, centralized control",
      cons: "Single point of failure, complex compensation logic"
    },
    {
      name: "Event-Based",
      category: "Eventual Consistency",
      description: "Services communicate through durable events and subscribers",
      pros: "Good responsiveness, service decoupling, timeliness",
      cons: "Complex error handling, dead letter queues, eventual consistency"
    }
  ];

  const reusePatternsData = [
    {
      name: "Code Replication",
      description: "Copy static, one-off code across services",
      whenToUse: "Highly static code with no bugs, simple annotations/attributes",
      pros: "No dependencies, simple deployment",
      cons: "Difficult updates, potential inconsistency"
    },
    {
      name: "Shared Library",
      description: "Common functionality in shared libraries with versioning",
      whenToUse: "Stable, reusable functionality across multiple services",
      pros: "Code consistency, centralized bug fixes",
      cons: "Dependency management, versioning complexity, deployment coordination"
    },
    {
      name: "Shared Service",
      description: "Centralized service for common functionality",
      whenToUse: "Complex business logic, frequently changing functionality",
      pros: "Single point of change, consistent behavior",
      cons: "Potential bottleneck, network dependency, versioning challenges"
    },
    {
      name: "Sidecars and Service Mesh",
      description: "Infrastructure concerns handled by sidecar proxies",
      whenToUse: "Cross-cutting concerns (logging, monitoring, security)",
      pros: "Language agnostic, operational consistency, separation of concerns",
      cons: "Operational complexity, network overhead, learning curve"
    }
  ];

  return (
    <div className="software-architecture-container">
      <div className="architecture-header">
        <div className="header-content">
          <div className="header-info">
            <BookOpen size={48} className="header-icon" />
            <div>
              <h1>Software Architecture: The Hard Parts</h1>
              <p>Modern Trade-Off Analyses for Distributed Architectures</p>
              <div className="authors">
                By Neal Ford, Mark Richards, Pramod Sadalage & Zhamak Dehghani
              </div>
            </div>
          </div>
          <div className="theme-selector">
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
              className="theme-dropdown"
            >
              {Object.entries(themes).map(([key, themeData]) => (
                <option key={key} value={key}>{themeData.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {[
          { id: 'overview', label: 'Overview', icon: <BookOpen size={16} /> },
          { id: 'toc', label: 'Table of Contents', icon: <FileText size={16} /> },
          { id: 'insights', label: 'Key Insights', icon: <Lightbulb size={16} /> },
          { id: 'examples', label: 'Code Examples', icon: <Code size={16} /> },
          { id: 'patterns', label: 'Architecture Patterns', icon: <Network size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="architecture-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="book-summary">
              <h2>About This Book</h2>
              <p>
                This book provides a systematic approach to tackling complex decisions in modern 
                distributed software architecture, emphasizing practical trade-off analysis over 
                prescriptive "best practices."
              </p>
              
              <div className="key-themes">
                <h3>Key Themes</h3>
                <div className="themes-grid">
                  <div className="theme-card">
                    <TrendingUp size={24} />
                    <h4>Trade-Off Analysis</h4>
                    <p>Central theme throughout - how to make decisions when there are no clear best practices</p>
                  </div>
                  <div className="theme-card">
                    <Network size={24} />
                    <h4>Distributed Challenges</h4>
                    <p>Focus on modern distributed systems and microservices architecture</p>
                  </div>
                  <div className="theme-card">
                    <Database size={24} />
                    <h4>Data Architecture</h4>
                    <p>Significant emphasis on data concerns in distributed systems</p>
                  </div>
                  <div className="theme-card">
                    <Settings size={24} />
                    <h4>Practical Patterns</h4>
                    <p>Real-world decomposition and integration patterns</p>
                  </div>
                </div>
              </div>

              <div className="book-structure">
                <h3>Book Structure</h3>
                <div className="structure-stats">
                  <div className="stat">
                    <span className="stat-number">~492</span>
                    <span className="stat-label">Total Pages</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">2</span>
                    <span className="stat-label">Major Parts</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">15</span>
                    <span className="stat-label">Core Chapters</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">3</span>
                    <span className="stat-label">Appendices</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'toc' && (
          <div className="toc-section">
            <h2>Table of Contents</h2>
            
            <div className="toc-item preface">
              <div className="toc-header">
                <FileText size={20} />
                <span className="toc-title">Preface</span>
                <span className="page-number">Page {tableOfContents.preface.page}</span>
              </div>
            </div>

            {tableOfContents.chapters.map((chapter) => (
              <div key={chapter.id} className="toc-item chapter">
                <div 
                  className="toc-header clickable"
                  onClick={() => toggleSection(chapter.id)}
                >
                  <div className="toc-left">
                    {expandedSections[chapter.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <span className="toc-title">{chapter.title}</span>
                  </div>
                  <span className="page-number">Page {chapter.page}</span>
                </div>
                
                {expandedSections[chapter.id] && (
                  <div className="toc-sections">
                    {chapter.sections.map((section, index) => (
                      <div key={index} className="toc-subsection">
                        <span>{section}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="parts-overview">
              <h3>Book Parts</h3>
              {tableOfContents.parts.map((part, index) => (
                <div key={index} className="part-card">
                  <h4>{part.title}</h4>
                  <p>Chapters {part.chapters.join(', ').replace(/ch/g, '')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-section">
            <h2>Key Insights from Chapters 1 & 2</h2>

            {Object.entries(keyInsights).map(([chapterKey, chapter]) => (
              <div key={chapterKey} className="chapter-insights">
                <div className="chapter-header">
                  {chapter.icon}
                  <h3>{chapter.title}</h3>
                </div>

                <div className="insights-grid">
                  {chapter.insights.map((insight, index) => (
                    <div key={index} className="insight-card">
                      <div className="insight-header">
                        {insight.icon}
                        <h4>{insight.category}</h4>
                      </div>
                      <p>{insight.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="learning-outcomes">
              <h3>Learning Outcomes</h3>
              <p>After studying these chapters, architects should be able to:</p>
              <div className="outcomes-grid">
                <div className="outcome-item">
                  <CheckCircle size={20} />
                  <span>Recognize when "best practices" don't apply and develop trade-off analysis skills</span>
                </div>
                <div className="outcome-item">
                  <CheckCircle size={20} />
                  <span>Distinguish between operational and analytical data concerns in architecture</span>
                </div>
                <div className="outcome-item">
                  <CheckCircle size={20} />
                  <span>Implement fitness functions for automated architecture governance</span>
                </div>
                <div className="outcome-item">
                  <CheckCircle size={20} />
                  <span>Analyze coupling using static and dynamic dimensions</span>
                </div>
                <div className="outcome-item">
                  <CheckCircle size={20} />
                  <span>Apply architecture quantum concepts to evaluate service boundaries</span>
                </div>
                <div className="outcome-item">
                  <CheckCircle size={20} />
                  <span>Perform systematic trade-off analysis using the three-step framework</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="examples-section">
            <h2>Practical Code Examples</h2>

            {practicalExamples.map((example, index) => (
              <div key={index} className="example-card">
                <div className="example-header">
                  <Code size={20} />
                  <h3>{example.title}</h3>
                  <span className="language-badge">{example.language}</span>
                </div>
                {example.description && (
                  <div className="example-description">
                    <p>{example.description}</p>
                  </div>
                )}
                <pre className="code-block">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}

            <div className="concepts-explanation">
              <h3>Key Concepts Explained</h3>

              <div className="concept-cards">
                <div className="concept-card">
                  <div className="concept-header">
                    <Database size={24} />
                    <h4>Data Types in Architecture</h4>
                  </div>
                  <div className="concept-content">
                    <div className="data-type">
                      <strong>Operational Data (OLTP)</strong>
                      <p>Sales, transactions, inventory - critical for daily operations. If interrupted, organization cannot function.</p>
                    </div>
                    <div className="data-type">
                      <strong>Analytical Data</strong>
                      <p>Used by data scientists for predictions, trending, business intelligence. Not critical for daily operations but drives strategic decisions.</p>
                    </div>
                  </div>
                </div>

                <div className="concept-card">
                  <div className="concept-header">
                    <Zap size={24} />
                    <h4>Architecture Quantum</h4>
                  </div>
                  <div className="concept-content">
                    <p><strong>Definition:</strong> An independently deployable artifact with high functional cohesion, high static coupling, and synchronous dynamic coupling.</p>
                    <div className="quantum-characteristics">
                      <div className="characteristic">
                        <strong>Independently Deployable:</strong> Each quantum = separate deployable unit
                      </div>
                      <div className="characteristic">
                        <strong>High Functional Cohesion:</strong> Related elements grouped together (bounded context)
                      </div>
                      <div className="characteristic">
                        <strong>Static Coupling:</strong> Dependencies needed to bootstrap the service
                      </div>
                    </div>
                  </div>
                </div>

                <div className="concept-card">
                  <div className="concept-header">
                    <Network size={24} />
                    <h4>Coupling Types</h4>
                  </div>
                  <div className="concept-content">
                    <div className="coupling-type">
                      <strong>Static Coupling</strong>
                      <p>"How things are wired together" - dependencies, frameworks, databases required for operation.</p>
                    </div>
                    <div className="coupling-type">
                      <strong>Dynamic Coupling</strong>
                      <p>"How things communicate at runtime" - synchronous/asynchronous communication patterns.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="patterns-section">
            <h2>Architecture Communication Patterns</h2>
            <p>Eight patterns based on three dimensions: Communication, Consistency, and Coordination</p>

            <div className="dimensions-explanation">
              <h3>Pattern Dimensions</h3>
              <div className="dimensions-grid">
                <div className="dimension">
                  <h4>Communication</h4>
                  <div className="dimension-options">
                    <span className="option">Synchronous</span>
                    <span className="vs">↔</span>
                    <span className="option">Asynchronous</span>
                  </div>
                </div>
                <div className="dimension">
                  <h4>Consistency</h4>
                  <div className="dimension-options">
                    <span className="option">Atomic</span>
                    <span className="vs">↔</span>
                    <span className="option">Eventual</span>
                  </div>
                </div>
                <div className="dimension">
                  <h4>Coordination</h4>
                  <div className="dimension-options">
                    <span className="option">Orchestrated</span>
                    <span className="vs">↔</span>
                    <span className="option">Choreographed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="patterns-grid">
              {architecturePatterns.map((pattern, index) => (
                <div key={index} className="pattern-card">
                  <div className="pattern-header">
                    <h4>{pattern.name}</h4>
                    <span className="pattern-dimensions">{pattern.dimensions}</span>
                  </div>
                  <p className="pattern-description">{pattern.description}</p>
                  <div className="pattern-usecase">
                    <strong>Use Case:</strong> {pattern.useCase}
                  </div>
                  <div className="pattern-tradeoffs">
                    <strong>Trade-offs:</strong> {pattern.tradeoffs}
                  </div>
                </div>
              ))}
            </div>

            <div className="additional-patterns">
              <h3>Data Access & Consistency Patterns</h3>
              <div className="patterns-grid">
                {dataPatterns.map((pattern, index) => (
                  <div key={index} className="pattern-card data-pattern">
                    <div className="pattern-header">
                      <h4>{pattern.name}</h4>
                      <span className="pattern-category">{pattern.category}</span>
                    </div>
                    <p className="pattern-description">{pattern.description}</p>
                    <div className="pattern-pros-cons">
                      <div className="pros">
                        <strong>Pros:</strong> {pattern.pros}
                      </div>
                      <div className="cons">
                        <strong>Cons:</strong> {pattern.cons}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3>Code Reuse Patterns</h3>
              <div className="patterns-grid">
                {reusePatternsData.map((pattern, index) => (
                  <div key={index} className="pattern-card reuse-pattern">
                    <div className="pattern-header">
                      <h4>{pattern.name}</h4>
                    </div>
                    <p className="pattern-description">{pattern.description}</p>
                    <div className="pattern-when">
                      <strong>When to Use:</strong> {pattern.whenToUse}
                    </div>
                    <div className="pattern-pros-cons">
                      <div className="pros">
                        <strong>Pros:</strong> {pattern.pros}
                      </div>
                      <div className="cons">
                        <strong>Cons:</strong> {pattern.cons}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="trade-off-framework">
              <h3>Trade-Off Analysis Framework</h3>
              <div className="framework-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Find Entangled Parts</h4>
                    <p>Identify what components are interconnected and interdependent</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Analyze Coupling</h4>
                    <p>Understand how components are coupled (static vs dynamic)</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Assess Trade-offs</h4>
                    <p>Determine the impact of change on interdependent systems</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftwareArchitectureHardParts;
