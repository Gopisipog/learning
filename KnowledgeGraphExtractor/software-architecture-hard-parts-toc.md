# Software Architecture: The Hard Parts - Table of Contents

**By Neal Ford, Mark Richards, Pramod Sadalage & Zhamak Dehghani**  
*Modern Trade-Off Analyses for Distributed Architectures*  
*O'Reilly Media, Inc.*

---

## Preface *(Page xi)*

## Chapter 1: What Happens When There Are No "Best Practices"? *(Page 1)*
- Why "The Hard Parts"?
- Giving Timeless Advice About Software Architecture
- The Importance of Data in Architecture
- Architectural Decision Records
- Architecture Fitness Functions
- Using Fitness Functions
- Architecture Versus Design: Keeping Definitions Simple
- Introducing the Sysops Squad Saga
  - Nonticketing Workflow
  - Ticketing Workflow
  - A Bad Scenario
  - Sysops Squad Architectural Components
  - Sysops Squad Data Model

---

## Part I: Pulling Things Apart

### Chapter 2: Discerning Coupling in Software Architecture *(Page 25)*
- Architecture (Quantum | Quanta)
- Independently Deployable
- High Functional Cohesion
- High Static Coupling
- Dynamic Quantum Coupling
- Sysops Squad Saga: Understanding Quanta

### Chapter 3: Architectural Modularity *(Page 45)*
- Modularity Drivers
  - Maintainability
  - Testability
  - Deployability
  - Scalability
  - Availability/Fault Tolerance
- Sysops Squad Saga: Creating a Business Case

### Chapter 4: Architectural Decomposition *(Page 63)*
- Is the Codebase Decomposable?
- Afferent and Efferent Coupling
- Abstractness and Instability
- Distance from the Main Sequence
- Component-Based Decomposition
- Tactical Forking
- Trade-Offs
- Sysops Squad Saga: Choosing a Decomposition Approach

### Chapter 5: Component-Based Decomposition Patterns *(Page 81)*
- Identify and Size Components Pattern
  - Pattern Description
  - Fitness Functions for Governance
  - Sysops Squad Saga: Sizing Components
- Gather Common Domain Components Pattern
  - Pattern Description
  - Fitness Functions for Governance
  - Sysops Squad Saga: Gathering Common Components
- Flatten Components Pattern
  - Pattern Description
  - Fitness Functions for Governance
  - Sysops Squad Saga: Flattening Components
- Determine Component Dependencies Pattern
  - Pattern Description
  - Fitness Functions for Governance
  - Sysops Squad Saga: Identifying Component Dependencies
- Create Component Domains Pattern
  - Pattern Description
  - Fitness Functions for Governance
  - Sysops Squad Saga: Creating Component Domains
- Create Domain Services Pattern
  - Pattern Description
  - Fitness Functions for Governance
  - Sysops Squad Saga: Creating Domain Services
- Summary

### Chapter 6: Pulling Apart Operational Data *(Page 131)*
- Data Decomposition Drivers
- Data Disintegrators
- Data Integrators
- Sysops Squad Saga: Justifying Database Decomposition
- Decomposing Monolithic Data
  - Step 1: Analyze Database and Create Data Domains
  - Step 2: Assign Tables to Data Domains
  - Step 3: Separate Database Connections to Data Domains
  - Step 4: Move Schemas to Separate Database Servers
  - Step 5: Switch Over to Independent Database Servers
- Selecting a Database Type
  - Relational Databases
  - Key-Value Databases
  - Document Databases
  - Column Family Databases
  - Graph Databases
  - NewSQL Databases
  - Cloud Native Databases
  - Time-Series Databases
- Sysops Squad Saga: Polyglot Databases

### Chapter 7: Service Granularity *(Page 185)*
- Granularity Disintegrators
  - Service Scope and Function
  - Code Volatility
  - Scalability and Throughput
  - Fault Tolerance
  - Security
  - Extensibility
- Granularity Integrators
  - Database Transactions
  - Workflow and Choreography
  - Shared Code
  - Data Relationships
- Finding the Right Balance
- Sysops Squad Saga: Ticket Assignment Granularity
- Sysops Squad Saga: Customer Registration Granularity

---

## Part II: Putting Things Back Together

### Chapter 8: Reuse Patterns *(Page 219)*
- Code Replication
  - When to Use
- Shared Library
  - Dependency Management and Change Control
  - Versioning Strategies
  - When To Use
- Shared Service
  - Change Risk
  - Performance
  - Scalability
  - Fault Tolerance
  - When to Use
- Sidecars and Service Mesh
  - When to Use
- Sysops Squad Saga: Common Infrastructure Logic
- Code Reuse: When Does It Add Value?
- Reuse via Platforms
- Sysops Squad Saga: Shared Domain Functionality

### Chapter 9: Data Ownership and Distributed Transactions *(Page 249)*
- Assigning Data Ownership
  - Single Ownership Scenario
  - Common Ownership Scenario
  - Joint Ownership Scenario
- Table Split Technique
- Data Domain Technique
- Delegate Technique
- Service Consolidation Technique
- Data Ownership Summary
- Distributed Transactions
- Eventual Consistency Patterns
  - Background Synchronization Pattern
  - Orchestrated Request-Based Pattern
  - Event-Based Pattern
- Sysops Squad Saga: Data Ownership for Ticket Processing

### Chapter 10: Distributed Data Access *(Page 283)*
- Interservice Communication Pattern
- Column Schema Replication Pattern
- Replicated Caching Pattern
- Data Domain Pattern
- Sysops Squad Saga: Data Access for Ticket Assignment

### Chapter 11: Managing Distributed Workflows *(Page 299)*
- Orchestration Communication Style
- Choreography Communication Style
- Workflow State Management
- Trade-Offs Between Orchestration and Choreography
- State Owner and Coupling
- Sysops Squad Saga: Managing Workflows

### Chapter 12: Transactional Sagas *(Page 323)*
- Transactional Saga Patterns
  - Epic Saga(sao) Pattern
  - Phone Tag Saga(sac) Pattern
  - Fairy Tale Saga(seo) Pattern
  - Time Travel Saga(sec) Pattern
  - Fantasy Fiction Saga(aao) Pattern
  - Horror Story(aac) Pattern
  - Parallel Saga(aeo) Pattern
  - Anthology Saga(aec) Pattern
- State Management and Eventual Consistency
- Saga State Machines
- Techniques for Managing Sagas
- Sysops Squad Saga: Atomic Transactions and Compensating Updates

### Chapter 13: Contracts *(Page 365)*
- Strict Versus Loose Contracts
- Trade-Offs Between Strict and Loose Contracts
- Contracts in Microservices
- Stamp Coupling
- Over-Coupling via Stamp Coupling
- Bandwidth
- Stamp Coupling for Workflow Management
- Sysops Squad Saga: Managing Ticketing Contracts

### Chapter 14: Managing Analytical Data *(Page 381)*
- Previous Approaches
  - The Data Warehouse
  - The Data Lake
- The Data Mesh
  - Definition of Data Mesh
  - Data Product Quantum
  - Data Mesh, Coupling, and Architecture Quantum
  - When to Use Data Mesh
- Sysops Squad Saga: Data Mesh

### Chapter 15: Build Your Own Trade-Off Analysis *(Page 399)*
- Finding Entangled Dimensions
- Coupling
- Analyze Coupling Points
- Assess Trade-Offs
- Trade-Off Techniques
  - Qualitative Versus Quantative Analysis
  - MECE Lists
  - The "Out-of-Context" Trap
  - Model Relevant Domain Cases
  - Prefer Bottom Line over Overwhelming Evidence
- Avoiding Snake Oil and Evangelism
- Sysops Squad Saga: Epilogue

---

## Appendices

### Appendix A: Concept and Term References *(Page 417)*

### Appendix B: Architecture Decision Record References *(Page 419)*

### Appendix C: Trade-Off References *(Page 421)*

### Index *(Page 425)*

---

## Book Structure Summary

- **Total Pages**: ~492 pages
- **Main Parts**: 2 major sections
- **Chapters**: 15 core chapters
- **Appendices**: 3 reference sections
- **Case Study**: Sysops Squad Saga (running example throughout)

## Key Themes

1. **Trade-Off Analysis** - Central theme throughout
2. **Distributed Architecture Challenges** - Focus on modern systems
3. **Data Architecture** - Significant emphasis on data concerns
4. **Practical Patterns** - Real-world decomposition and integration patterns
5. **Evolutionary Architecture** - Fitness functions and decision records

## About the Authors

- **Neal Ford** - Software Architect and Meme Wrangler at ThoughtWorks
- **Mark Richards** - Hands-on Software Architect and Trainer
- **Pramod Sadalage** - Data Architect at ThoughtWorks
- **Zhamak Dehghani** - Technology Principal at ThoughtWorks

This book provides a systematic approach to tackling complex decisions in modern distributed software architecture, emphasizing practical trade-off analysis over prescriptive "best practices."

---

# Chapter 1 & 2: Key Insights and Analysis

## Chapter 1: What Happens When There Are No "Best Practices"?

### 🎯 **Core Philosophy**

**The Central Problem**: Software architecture is "the stuff that's hard to change later" - this book focuses on those foundational, difficult-to-change decisions that architects must make without clear "best practices" to follow.

### 🔄 **The Evolution of Architecture Styles**

**Historical Context**:
- **10 years ago**: Orchestration-driven, service-oriented architecture dominated large enterprises
- **Today**: Microservices are the favored style for distributed systems
- **Why the shift?**:
  - Open source became viable for enterprises
  - Linux became operationally free with tools like Puppet and Chef
  - Automated environment provisioning enabled architectural revolution
  - Containers and orchestration tools (Kubernetes) emerged

**Key Insight**: Architecture styles evolve based on **constraints and capabilities available at the time**, not inherent superiority.

### 📊 **The Importance of Data in Architecture**

**Tim Berners-Lee Quote**: *"Data is a precious thing and will last longer than the systems themselves."*

**Two Critical Data Types**:

1. **Operational Data (OLTP)**:
   - Sales, transactions, inventory
   - Critical for day-to-day business operations
   - If interrupted, organization cannot function
   - Involves inserting, updating, deleting data

2. **Analytical Data**:
   - Used by data scientists and business analysts
   - Predictions, trending, business intelligence
   - Not critical for daily operations
   - Often non-relational (graph databases, snapshots)
   - Drives long-term strategic decisions

**Modern Challenge**: In microservices with bounded contexts, data has moved from implementation detail to architectural concern, creating many of the "hard parts" in modern architecture.

### 📝 **Architectural Decision Records (ADRs)**

**Purpose**: Document architecture decisions in short text files (1-2 pages)

**ADR Format Used in Book**:
- **ADR**: Short noun phrase containing the decision
- **Context**: Problem description and alternative solutions
- **Decision**: The choice made with detailed justification
- **Consequences**: Results, trade-offs, and impacts

**Value**: Provides historical context for decisions and reasoning behind architectural choices.

### 🏋️ **Architecture Fitness Functions**

**Definition**: *"Any mechanism that performs an objective integrity assessment of some architecture characteristic or combination of architecture characteristics."*

**Key Components**:

1. **Any Mechanism**:
   - Testing libraries for architecture structure
   - Monitors for operational characteristics
   - Chaos engineering for reliability testing

2. **Objective Integrity Assessment**:
   - Must be measurable (not "high performance" but specific metrics)
   - Avoid composite characteristics that can't be objectively measured

3. **Architecture Characteristics**:
   - Performance, scalability, security, etc.
   - Must be specific and testable

**Practical Examples**:

```java
// Fitness function to detect component cycles
public class CycleTest {
    private JDepend jdepend;

    @Test
    void testNoCycles() {
        Collection packages = jdepend.analyze();
        assertFalse(jdepend.containsCycles());
    }
}
```

```java
// Layer dependency verification
var result = Types.InCurrentDomain()
    .That()
    .ResideInNamespace("Presentation")
    .ShouldNot()
    .HaveDependencyOn("Data")
    .GetResult()
    .IsSuccessful;
```

**Philosophy**: Fitness functions are an "executable checklist" that prevents important principles from being skipped due to schedule pressure or oversight.

### 🏗️ **Architecture vs Design Distinction**

**Simple Definition**:
- **Architecture**: Foundational decisions that are hard to change
- **Design**: More easily changeable implementation details

**Focus**: This book concentrates on the foundational, structural parts of architecture.

### 📚 **The Sysops Squad Saga**

**Running Case Study**: A technical support company with:
- **Nonticketing Workflow**: Experts handle calls directly
- **Ticketing Workflow**: Structured problem ticket system
- **Components**: Login, billing, customer management, expert profiles, knowledge base
- **Data Model**: Users, tickets, expertise, locations, articles

---

## Chapter 2: Discerning Coupling in Software Architecture

### 🧩 **The Entanglement Problem**

**Core Challenge**: Software architecture creates multidimensional problems where multiple forces interact in interdependent ways, like a braid that entangles individual strands.

**Simple Coupling Definition**: *"Two parts of a software system are coupled if a change in one might cause a change in the other."*

### 🔍 **Trade-Off Analysis Framework**

**Three-Step Process**:
1. **Find what parts are entangled together**
2. **Analyze how they are coupled to one another**
3. **Assess trade-offs by determining the impact of change on interdependent systems**

**Central Question**: *"How do architects determine the size and communication styles for microservices?"*
- Too-small services → transactional and orchestration issues
- Too-large services → scale and distribution issues

### ⚛️ **Architecture Quantum**

**Definition**: *"An independently deployable artifact with high functional cohesion, high static coupling, and synchronous dynamic coupling."*

**Etymology**: From Latin "quantus" (how great/how many) - used in physics, law, and mathematics before software architecture.

**Three Key Characteristics**:

#### 1. **Independently Deployable**
- Each quantum = separate deployable unit
- Monolith = single quantum by definition
- Microservices = potentially multiple quanta
- **Forces inclusion of coupling points** (databases, shared resources)
- **Deployment boundaries matter**: Shared database with separate deployment cadence breaks quantum independence

#### 2. **High Functional Cohesion**
- **Structural**: Proximity of related elements (classes, components, services)
- **Domain**: Overlaps with Domain-Driven Design's bounded context
- **Goal**: Behavior and data implementing particular domain workflow
- **Scope Limitation**: Prevents quantum from becoming too broad

#### 3. **Static vs Dynamic Coupling**

### 🔗 **Static Coupling**

**Definition**: How static dependencies resolve within architecture via contracts

**Includes**:
- Operating system dependencies
- Frameworks and libraries
- Transitive dependency management
- Operational requirements for quantum to function

**Key Insight**: "What's required to bootstrap this service from scratch?"

**Architecture Style Analysis**:
- **Monolithic architectures**: Always quantum = 1 (single database coupling point)
- **Service-based architecture**: Still quantum = 1 (shared database)
- **Mediated event-driven**: Quantum = 1 (database + orchestrator coupling)
- **Broker event-driven**: Can be quantum = 1 if shared database
- **Microservices**: Each service can be its own quantum (if properly decoupled)
- **Micro-frontends**: Service + UI component = quantum

**Shared Database Impact**: Any shared database creates a coupling point that can reduce multiple services to a single quantum.

### ⚡ **Dynamic Coupling**

**Definition**: How quanta communicate at runtime (synchronous or asynchronous)

**Communication Styles**:

1. **Synchronous Communication**:
   - Requestor waits for response
   - Blocks until receiver returns value/status
   - Examples: gRPC, REST calls

2. **Asynchronous Communication**:
   - Caller posts message and continues processing
   - Uses message queues or similar mechanisms
   - Response via reply queue if needed
   - Allows parallel processing

### 📐 **Dynamic Coupling Dimensions**

**Three-Dimensional Analysis**:

1. **Communication**: Synchronous ↔ Asynchronous
2. **Consistency**: Atomic ↔ Eventual
3. **Coordination**: Orchestrated ↔ Choreographed

**Eight Pattern Combinations**:
- Epic Saga (synchronous, atomic, orchestrated)
- Phone Tag Saga (synchronous, atomic, choreographed)
- Fairy Tale Saga (synchronous, eventual, orchestrated)
- Time Travel Saga (synchronous, eventual, choreographed)
- Fantasy Fiction Saga (asynchronous, atomic, orchestrated)
- Horror Story (asynchronous, atomic, choreographed)
- Parallel Saga (asynchronous, eventual, orchestrated)
- Anthology Saga (asynchronous, eventual, choreographed)

### 🎯 **Key Architectural Insights**

1. **Coupling Analysis is Fundamental**: Before making trade-offs, architects must understand what's coupled and how

2. **Static vs Dynamic Distinction**:
   - Static = "How things are wired"
   - Dynamic = "How things communicate at runtime"

3. **Quantum Thinking**: Architecture quantum provides a useful unit of analysis for:
   - Deployment boundaries
   - Coupling analysis
   - Risk assessment
   - Team impact analysis

4. **Data as Coupling Point**: Databases often become the primary coupling point that determines quantum boundaries

5. **Trade-off Framework**: Understanding coupling dimensions enables systematic trade-off analysis rather than intuition-based decisions

### 🛠️ **Practical Applications**

**For Risk Analysis**: Static quantum coupling helps determine "if I change this, what might break?"

**For Team Organization**: Quantum boundaries help understand how teams might impact each other

**For Service Granularity**: Quantum analysis informs decisions about service size and boundaries

**For Technology Decisions**: Understanding coupling helps evaluate the impact of technology choices on architecture

---

## 🎓 **Learning Outcomes**

After studying these chapters, architects should be able to:

1. **Recognize when "best practices" don't apply** and develop trade-off analysis skills
2. **Distinguish between operational and analytical data** concerns in architecture
3. **Implement fitness functions** for automated architecture governance
4. **Analyze coupling** using static and dynamic dimensions
5. **Apply architecture quantum concepts** to evaluate service boundaries
6. **Perform systematic trade-off analysis** using the three-step framework
7. **Document decisions effectively** using ADRs
8. **Understand the evolution** of architecture styles and their driving forces
