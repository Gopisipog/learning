# Software Architecture: The Hard Parts - Comprehensive Hints

## 🎯 Core Philosophy & Principles

### The Hard Parts Definition
```
Software architecture is "the stuff that's hard to change later"
- Focus on foundational decisions without clear "best practices"
- Emphasis on trade-off analysis over prescriptive solutions
- Modern distributed systems create multidimensional problems
```

### Trade-Off Analysis Framework
```
1. Find what parts are entangled together
2. Analyze how they are coupled to one another  
3. Assess trade-offs by determining impact of change on interdependent systems
```

### Architecture vs Design
```
Architecture: Foundational decisions that are hard to change
Design: More easily changeable implementation details
```

## 📊 Data Architecture Fundamentals

### Data Types in Architecture
```java
// Operational Data (OLTP)
- Sales, transactions, inventory
- Critical for day-to-day business operations
- If interrupted, organization cannot function
- Involves inserting, updating, deleting data

// Analytical Data  
- Used by data scientists and business analysts
- Predictions, trending, business intelligence
- Not critical for daily operations
- Often non-relational (graph databases, snapshots)
- Drives long-term strategic decisions
```

### Data Importance Quote
```
"Data is a precious thing and will last longer than the systems themselves."
- Tim Berners-Lee
```

## 🏗️ Architecture Quantum Concepts

### Architecture Quantum Definition
```
An independently deployable artifact with:
- High functional cohesion
- High static coupling  
- Synchronous dynamic coupling

Example: A well-formed microservice within a workflow
```

### Static vs Dynamic Coupling
```java
// Static Coupling: "How things are wired together"
- Dependencies, frameworks, databases required for operation
- Question: "What's needed to bootstrap this service from scratch?"

// Dynamic Coupling: "How things communicate at runtime"  
- Synchronous/asynchronous communication patterns
- Measured during runtime interactions
```

### Quantum Analysis by Architecture Style
```
Monolithic architectures: Always quantum = 1 (single database)
Service-based architecture: Quantum = 1 (shared database)
Mediated event-driven: Quantum = 1 (database + orchestrator)
Broker event-driven: Can be quantum = 1 if shared database
Microservices: Each service can be its own quantum (if decoupled)
Micro-frontends: Service + UI component = quantum
```

## 🔧 Fitness Functions

### Fitness Function Definition
```
Any mechanism that performs an objective integrity assessment 
of some architecture characteristic or combination of characteristics
```

### Component Cycle Detection
```java
// Example 1-1: Fitness function to detect component cycles
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
}
```

### Layer Dependency Verification
```java
// Example 1-2: ArchUnit fitness function to govern layers
layeredArchitecture()
    .layer("Controller").definedBy("..controller..")
    .layer("Service").definedBy("..service..")
    .layer("Persistence").definedBy("..persistence..")
    .whereLayer("Controller").mayNotBeAccessedByAnyLayer()
    .whereLayer("Service").mayOnlyBeAccessedByLayers("Controller")
    .whereLayer("Persistence").mayOnlyBeAccessedByLayers("Service")
```

### .NET Layer Dependencies
```csharp
// Example 1-3: NetArchTest for layer dependencies
var result = Types.InCurrentDomain()
    .That()
    .ResideInNamespace("NetArchTest.SampleLibrary.Presentation")
    .ShouldNot()
    .HaveDependencyOn("NetArchTest.SampleLibrary.Data")
    .GetResult()
    .IsSuccessful;
```

### Component Dependency Restrictions
```java
// Example 5-9: ArchUnit code for governing dependency restrictions
public void ticket_maintenance_cannot_access_expert_profile() {
    noClasses().that()
        .resideInAPackage("..ss.ticket.maintenance..")
        .should().accessClassesThat()
        .resideInAPackage("..ss.expert.profile..")
        .check(myClasses);
}
```

### Domain Restrictions
```java
// Example 5-10: ArchUnit code for governing domains
public void restrict_domains() {
    classes()
        .should().resideInAPackage("..ss.ticket..")
        .orShould().resideInAPackage("..ss.customer..")
        .orShould().resideInAPackage("..ss.admin..")
        .check(myClasses);
}
```

## 📝 Architectural Decision Records (ADRs)

### ADR Template
```markdown
# ADR: [Short noun phrase containing the decision]

## Context
Short description of the problem and alternative solutions.

## Decision  
The architecture decision with detailed justification.

## Consequences
Results, trade-offs, and impacts after applying the decision.
```

### ADR Benefits
```
- Document architecture decisions in 1-2 page text files
- Provide historical context for decisions
- Show reasoning behind architectural choices
- Can be written in AsciiDoc, Markdown, or wiki templates
```

## 🔄 Communication Patterns

### Synchronous vs Asynchronous
```java
// Synchronous Communication
- Requestor waits for response from receiver
- Blocks until receiver returns value/status
- Examples: gRPC, REST calls

// Asynchronous Communication  
- Caller posts message and continues processing
- Uses message queues or similar mechanisms
- Response via reply queue if needed
- Allows parallel processing
```

### Eight Communication Patterns
```
Based on three dimensions:
1. Communication: Synchronous ↔ Asynchronous
2. Consistency: Atomic ↔ Eventual  
3. Coordination: Orchestrated ↔ Choreographed

Patterns:
- Epic Saga (synchronous, atomic, orchestrated)
- Phone Tag Saga (synchronous, atomic, choreographed)  
- Fairy Tale Saga (synchronous, eventual, orchestrated)
- Time Travel Saga (synchronous, eventual, choreographed)
- Fantasy Fiction Saga (asynchronous, atomic, orchestrated)
- Horror Story (asynchronous, atomic, choreographed)
- Parallel Saga (asynchronous, eventual, orchestrated)
- Anthology Saga (asynchronous, eventual, choreographed)
```

## 🗄️ Database Decomposition

### Database Decomposition Steps
```
Step 1: Analyze Database and Create Data Domains
Step 2: Assign Tables to Data Domains  
Step 3: Separate Database Connections to Data Domains
Step 4: Move Schemas to Separate Database Servers
Step 5: Switch Over to Independent Database Servers
```

### Database Types Selection
```
Relational Databases: ACID transactions, complex queries
Key-Value Databases: Simple lookups, high performance
Document Databases: JSON/XML documents, flexible schema
Column Family: Wide column stores, time-series data
Graph Databases: Relationships, social networks
NewSQL: ACID + horizontal scaling
Cloud Native: Managed services, auto-scaling
Time-Series: IoT data, metrics, monitoring
```

### Database View Example
```sql
-- Example 6-1: Database view with cross-domain joins (BEFORE)
CREATE VIEW [payment].[v_customer_contract]
AS
SELECT
    customer.customer_id, customer.customer_name,
    contract.contract_start_date, contract.contract_duration,
    billing.billing_date, billing.billing_amount
FROM payment.contract AS contract
INNER JOIN customer.customer AS customer
    ON ( contract.customer_id = customer.customer_id )
INNER JOIN payment.billing AS billing
    ON ( contract.contract_id = billing.contract_id )
WHERE contract.auto_renewal = 0

-- Example 6-2: Database view after domain separation (AFTER)
CREATE VIEW [payment].[v_customer_contract]
AS
SELECT
    billing.customer_id, contract.contract_start_date,
    contract.contract_duration, billing.billing_date,
    billing.billing_amount
FROM payment.contract AS contract
INNER JOIN payment.billing AS billing
    ON ( contract.contract_id = billing.contract_id )
WHERE contract.auto_renewal = 0
```

## 🔗 Service Granularity

### Granularity Disintegrators (Break Apart)
```
- Service Scope and Function: Single responsibility
- Code Volatility: Different change rates
- Scalability and Throughput: Different performance needs
- Fault Tolerance: Isolation requirements
- Security: Different access controls
- Extensibility: Independent evolution
```

### Granularity Integrators (Keep Together)
```
- Database Transactions: ACID requirements
- Workflow and Choreography: Complex interactions
- Shared Code: Common functionality
- Data Relationships: Tight data coupling
```

### Performance Considerations
```
Rule of thumb: Consider the percentage of requests requiring 
multiple services to communicate

- 30% multi-service, 70% atomic: OK to keep separate
- 70% multi-service, 30% atomic: Consider consolidation
- Critical requests in multi-service category: Consolidate
```

## 🔄 Data Ownership Patterns

### Single Ownership
```
One service owns and manages a specific table/data
- Clear responsibility
- Simple change control
- No conflicts
```

### Common Ownership  
```
Multiple services need to write to same table (e.g., Audit table)
Solution: Create dedicated service owner
- Audit Service owns Audit table
- Other services send async messages
- Use persistent queues for reliability
```

### Joint Ownership
```
Multiple services in same domain write to same table
Solutions:
1. Table Split Technique: Split table by responsibility
2. Data Domain Technique: Separate schemas
3. Delegate Technique: One service delegates to another
4. Service Consolidation: Merge services
```

### Table Split Example
```sql
-- Example 9-1: DDL for splitting Product table
CREATE TABLE Inventory (
    product_id VARCHAR(10),
    inv_cnt INT
);

INSERT INTO Inventory VALUES (product_id, inv_cnt)
AS SELECT product_id, inv_cnt FROM Product;

COMMIT;

ALTER TABLE Product DROP COLUMN inv_cnt;
```

## 🔄 Eventual Consistency Patterns

### Background Synchronization Pattern
```
- Longest time for data consistency (usually nightly batch)
- Good for non-critical sync requirements
- Background process must know what data changed
- Can use event streams, database triggers, or table deltas

Example: Customer unsubscribe
- Customer Profile Service removes data immediately
- Background process syncs Contract and Billing tables at night
- User gets immediate response, cleanup happens later
```

### Orchestrated Request-Based Pattern
```
- Mediator coordinates the distributed transaction
- Services called synchronously in sequence
- Rollback capability through compensating actions
- Better error handling than choreography
```

### Event-Based Pattern
```
- Services communicate through events
- Durable subscribers ensure eventual delivery
- Good responsiveness and service decoupling
- Complex error handling with dead letter queues

Advantages: Responsiveness, timeliness, decoupling
Disadvantages: Complex error handling, eventual consistency
```

## 📡 Distributed Data Access Patterns

### Interservice Communication Pattern
```
Direct service-to-service calls for data access
- Simple implementation
- Network latency issues
- Service availability dependencies
- Can create chatty interfaces
```

### Column Schema Replication Pattern
```
Replicate specific columns to consuming services
- Reduces network calls
- Data synchronization complexity
- Storage overhead
- Eventual consistency issues
```

### Replicated Caching Pattern
```java
// Example: Wishlist Service with replicated product cache
- Catalog Service owns product description cache
- Wishlist Service has read-only replica
- In-memory access eliminates network calls
- Cache synchronization required

Popular tools: Hazelcast, Apache Ignite, Oracle Coherence
```

### Data Domain Pattern
```
Multiple services share access to data domain
- Shared database/schema access
- Reduced network latency
- Potential security issues
- Looser bounded contexts
```

## 🔧 Reuse Patterns

### Code Replication
```java
// Example 8-1: Service entry point annotation (Java)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface ServiceEntrypoint {}

/* Usage:
@ServiceEntrypoint
public class PaymentServiceAPI {
    ...
}
*/
```

```csharp
// Example 8-2: Service entry point attribute (C#)
[AttributeUsage(AttributeTargets.Class)]
class ServiceEntrypoint : Attribute {}

/* Usage:
[ServiceEntrypoint]
class PaymentServiceAPI {
    ...
}
*/
```

### Shared Library Pattern
```
Benefits:
- Code consistency across services
- Centralized bug fixes
- Version control

Challenges:
- Dependency management
- Change control complexity
- Versioning strategies
- Deployment coordination
```

### Shared Service Pattern
```
Centralized service for common functionality
- Single point of change
- Potential bottleneck
- Versioning challenges
- Network dependency

Example: Discount Calculator Service
app/1.0/discountcalc?orderid=123
app/1.1/discountcalc?orderid=123
app/1.2/discountcalc?orderid=123
```

### Sidecars and Service Mesh
```
Infrastructure concerns handled by sidecar proxies
- Cross-cutting concerns (logging, monitoring, security)
- Language agnostic
- Operational complexity
- Network overhead
```

## 🎭 Transactional Saga Patterns

### Saga Annotations
```java
// Example 12-1: Transactional saga annotation (Java)
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
```

```csharp
// Example 12-2: Transactional saga attribute (C#)
[AttributeUsage(AttributeTargets.Class)]
class Saga : System.Attribute {
    public Transaction[] transaction;
    public enum Transaction {
        NEW_TICKET,
        CANCEL_TICKET,
        NEW_CUSTOMER,
        UNSUBSCRIBE,
        NEW_SUPPORT_CONTRACT
    };
}
```

### Saga Usage Example
```java
// Example 12-3: Using saga annotations
@ServiceEntrypoint
@Saga(Transaction.NEW_TICKET)
public class SurveyServiceAPI {
    ...
}

@ServiceEntrypoint
@Saga({Transaction.NEW_TICKET, Transaction.CANCEL_TICKET})
public class TicketServiceAPI {
    ...
}
```

### Compensating Updates Challenges
```
1. No transactional isolation in distributed transactions
2. Other services may act on data before transaction completes
3. Compensating updates can fail
4. Complex error handling scenarios
5. Data consistency issues during failures
```

## 📋 Contract Patterns

### Strict Contracts
```json
// Example 13-1: Strict JSON contract
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "properties": {
        "acct": {"type": "number"},
        "cusip": {"type": "string"},
        "shares": {"type": "number", "minimum": 100}
    },
    "required": ["acct", "cusip", "shares"]
}
```

### GraphQL Contract Examples
```graphql
# Example 13-2: Customer Wishlist Profile
type Profile {
    name: String
}

# Example 13-3: Customer Profile
type Profile {
    name: String
    addr1: String
    addr2: String
    country: String
    ...
}
```

### Loose Contracts
```json
// Example 13-4: Name-value pairs in JSON
{
    "name": "Mark",
    "status": "active",
    "joined": "2003"
}
```

### Contract Trade-offs
```
Strict Contracts:
+ Contract certainty and verification
+ Better tooling support
+ Clear expectations
- Tight coupling
- Brittle integration
- Change coordination overhead

Loose Contracts:
+ Extreme decoupling
+ Evolutionary architecture
+ Independent service changes
- Lack of contract certainty
- Runtime errors
- Increased testing burden
```

## 🌐 Stamp Coupling

### Stamp Coupling Definition
```
Passing entire data structures when only part is needed
- Creates unnecessary coupling
- Bandwidth waste
- Security exposure
- Maintenance overhead
```

### Bandwidth Impact Example
```
Scenario: 2,000 requests per second
- Full profile payload: 500 KB each = 1,000,000 KB/sec
- Name only payload: 200 bytes each = 400 KB/sec

Bandwidth reduction: 99.96%
```

### When to Use Stamp Coupling
```
Benefits:
- Workflow management simplification
- Reduced service calls
- Data consistency
- Performance optimization

Use cases:
- Complex workflows requiring multiple data elements
- High-frequency operations
- Batch processing scenarios
```

## 🔍 Component Analysis Patterns

### Component Metrics
```
Statements: Total source code statements in component
Files: Number of source files in component
Percent: Component size as percentage of total codebase
Standard Deviations: How far component size deviates from mean

Example: Component with 12,000 statements might be more complex than expected
```

### Component Dependency Analysis
```
Afferent Coupling (CA): Incoming dependencies
Efferent Coupling (CE): Outgoing dependencies
Total Coupling (CT): CA + CE

Breaking apart components can reduce coupling:
- Component A: 20 afferent dependencies
- Split into A1 (14 dependencies) + A2 (6 dependencies)
- Reduces coupling in A2 significantly
```

### Fitness Function Examples
```pseudocode
# Example 5-8: Limit total dependencies
LIST component_list = identify_components(root_directory)
FOREACH component IN component_list {
    total_coupling = count_dependencies(component)
    IF total_coupling > 15 {
        send_alert(component, total_coupling)
    }
}
```

## 🏗️ Architecture Evolution

### Historical Context
```
10 years ago: Orchestration-driven SOA dominated enterprises
- Shared resources emphasis
- Centralized orchestration
- Political constraints on open source
- Enterprise merger integration needs

Today: Microservices favored for distributed systems
- Open source viability
- Linux operational freedom
- Automated environment provisioning
- Container orchestration (Kubernetes)
```

### Architecture Style Evolution Drivers
```
Constraints and capabilities drive architectural choices:
- Technology maturity
- Operational capabilities
- Organizational structure
- Business requirements
- Regulatory environment
- Cost considerations
```

## 🎯 Trade-off Analysis Techniques

### Qualitative vs Quantitative Analysis
```
Qualitative: Subjective assessment based on experience
Quantitative: Measurable metrics and data-driven decisions

Best approach: Combine both for comprehensive analysis
```

### MECE Lists (Mutually Exclusive, Collectively Exhaustive)
```
Ensure analysis covers all possibilities without overlap
- Identify all relevant factors
- Avoid double-counting
- Ensure complete coverage
- Maintain clear boundaries
```

### Avoiding the "Out-of-Context" Trap
```
Consider specific organizational context:
- Team capabilities
- Technology constraints
- Business requirements
- Operational maturity
- Timeline pressures
```

### Model Relevant Domain Cases
```
Create specific scenarios for trade-off analysis:
- Happy path workflows
- Error conditions
- Edge cases
- Performance scenarios
- Failure modes
```

### Bottom Line Focus
```
Prefer actionable conclusions over overwhelming evidence
- Clear recommendations
- Specific next steps
- Measurable outcomes
- Risk mitigation strategies
```

## 🚀 Modern Architecture Considerations

### Microservices Quantum Analysis
```
Each microservice potentially forms its own quantum if:
- Independently deployable
- Own database/data store
- Minimal shared dependencies
- Clear bounded context
- Autonomous team ownership
```

### Service Mesh Benefits
```
- Traffic management
- Security policies
- Observability
- Resilience patterns
- Language agnostic
- Operational consistency
```

### Cloud Native Patterns
```
- Auto-scaling capabilities
- Managed services
- Serverless functions
- Event-driven architectures
- Container orchestration
- Infrastructure as code
```

## 📊 Monitoring and Observability

### Architecture Fitness Functions in Production
```
Continuous monitoring of architecture characteristics:
- Performance metrics
- Coupling measurements
- Dependency analysis
- Security compliance
- Scalability indicators
```

### Chaos Engineering
```
Proactive resilience testing:
- Fault injection
- Network partitions
- Service failures
- Resource constraints
- Recovery validation
```

## 🎓 Key Learning Outcomes

### Architect Capabilities
```
After mastering these concepts, architects should:
1. Recognize when "best practices" don't apply
2. Perform systematic trade-off analysis
3. Implement automated governance via fitness functions
4. Analyze coupling using multiple dimensions
5. Apply quantum concepts for service boundaries
6. Document decisions effectively with ADRs
7. Understand architecture style evolution
8. Design for eventual consistency
9. Manage distributed data effectively
10. Build evolvable architectures
```

### Decision-Making Framework
```
1. Identify entangled components
2. Analyze coupling relationships
3. Model relevant scenarios
4. Assess trade-offs systematically
5. Document decisions and rationale
6. Implement governance mechanisms
7. Monitor and evolve over time
```
```
