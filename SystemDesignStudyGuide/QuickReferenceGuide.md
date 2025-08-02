# System Design Quick Reference Guide
## 40 Essential Concepts - Cheat Sheet

### 🏗️ **Foundation & Performance (1-10)**

| Concept | Key Principle | When to Use | Trade-offs |
|---------|---------------|-------------|------------|
| **1. Scalability** | Default to stateless horizontal scale | Need to handle growth | Vertical: Simple but limited; Horizontal: Complex but unlimited |
| **2. Latency & Throughput** | Know P50/P95/P99 and tradeoffs | Performance optimization | Lower latency often reduces throughput |
| **3. Capacity Estimation** | Estimate QPS, storage, bandwidth | System sizing | Accuracy vs speed of estimation |
| **4. Networking Basics** | TCP reliable, UDP fast, HTTP stateless | Protocol selection | Reliability vs performance |
| **5. SQL vs NoSQL** | Decide by access patterns, joins, consistency | Database selection | ACID vs BASE, structure vs flexibility |
| **6. Data Modeling** | Structure to optimize hot queries | Schema design | Query performance vs data integrity |
| **7. Indexing** | Right indexes help reads, wrong ones hurt writes | Query optimization | Read speed vs write speed vs storage |
| **8. Normalization** | Normalize for writes, denormalize for reads | Data organization | Data integrity vs query performance |
| **9. Caching** | App/DB/CDN; write-through/back, TTLs | Performance improvement | Speed vs consistency vs complexity |
| **10. Cache Invalidation** | TTLs, versioning, stampede protection | Cache consistency | Freshness vs performance vs complexity |

### 🔧 **Infrastructure & Distribution (11-20)**

| Concept | Key Principle | When to Use | Trade-offs |
|---------|---------------|-------------|------------|
| **11. Load Balancing** | L4/L7, RR, least-connections, hashing | Distribute traffic | Simplicity vs intelligence vs overhead |
| **12. CDN & Edge** | Serve static content near users | Global content delivery | Cost vs performance vs complexity |
| **13. Sharding** | Hash/range/geo; handle hot keys, rebalancing | Scale beyond single DB | Performance vs complexity vs consistency |
| **14. Replication** | Sync/async, leader/follower, read replicas | High availability & read scaling | Consistency vs availability vs cost |
| **15. Consistency Models** | Strong, eventual, causal | Data consistency requirements | Consistency vs availability vs performance |
| **16. CAP Theorem** | In partition, pick A or C | Distributed system design | Must choose between consistency and availability |
| **17. Concurrency** | Locks, MVCC, retries | Handle concurrent access | Safety vs performance vs complexity |
| **18. Multithreading** | Pools, contention, switching | Parallel processing | Performance vs complexity vs resource usage |
| **19. Idempotency** | Same request, same effect | Reliable operations | Safety vs implementation complexity |
| **20. Rate Limiting** | Fairness and protection | Protect against abuse | Protection vs user experience |

### 📡 **Communication & Integration (21-30)**

| Concept | Key Principle | When to Use | Trade-offs |
|---------|---------------|-------------|------------|
| **21. Queues & Streams** | Kafka, RabbitMQ; smooth spikes | Async communication | Reliability vs latency vs complexity |
| **22. Backpressure** | Manage slow consumers/load shedding | Handle overload | System stability vs request loss |
| **23. Delivery Semantics** | At-most/least/exactly-once | Message reliability | Reliability vs performance vs complexity |
| **24. API Design** | REST vs gRPC; human vs machine optimized | Interface design | Human-friendly vs performance |
| **25. API Versioning** | Additive only; never break clients | API evolution | Backward compatibility vs clean design |
| **26. AuthN & AuthZ** | OAuth2, JWT, RBAC/ABAC | Security implementation | Security vs performance vs complexity |
| **27. Resilience** | Circuit breakers, timeouts, retries | Handle failures | Reliability vs complexity vs latency |
| **28. Observability** | Logs, metrics, traces, SLI/SLO | System monitoring | Visibility vs overhead vs cost |
| **29. Health Checks** | Detect failures, auto-replace | Failure detection | Accuracy vs overhead vs response time |
| **30. Redundancy** | Avoid SPOFs; use multi-AZ/region | High availability | Availability vs cost vs complexity |

### 🏗️ **Advanced Architecture (31-40)**

| Concept | Key Principle | When to Use | Trade-offs |
|---------|---------------|-------------|------------|
| **31. Service Discovery** | Dynamic endpoints, central config | Microservices architecture | Flexibility vs complexity vs single point of failure |
| **32. Deployment** | Canary, blue/green, rollbacks | Safe releases | Safety vs speed vs resource usage |
| **33. Monolith vs Microservices** | Split only if ops cost justified | Architecture decisions | Simplicity vs scalability vs operational overhead |
| **34. Distributed Transactions** | Use sagas, avoid 2PC | Cross-service consistency | Consistency vs complexity vs performance |
| **35. Event Sourcing/CQRS** | Append-only logs, split models | Complex business domains | Auditability vs complexity vs storage |
| **36. Consensus** | Raft, Paxos, quorum reads/writes | Distributed agreement | Consistency vs availability vs performance |
| **37. Data Privacy** | Encryption, GDPR/CCPA | Regulatory compliance | Privacy vs performance vs complexity |
| **38. Disaster Recovery** | Backups, RPO/RTO, test it | Business continuity | Recovery speed vs cost vs complexity |
| **39. Serialization** | JSON, Avro, Proto | Data exchange | Human-readable vs performance vs schema evolution |
| **40. Real-Time Delivery** | Polling, SSE, WebSockets | Real-time features | Real-time vs resource usage vs complexity |

---

## 🎯 **Decision Framework**

### **Performance Optimization Priority**
1. **Measure First**: Use metrics to identify bottlenecks
2. **Cache Strategically**: Add caching at appropriate levels
3. **Scale Horizontally**: Prefer stateless horizontal scaling
4. **Optimize Queries**: Use proper indexing and data modeling
5. **Async Where Possible**: Use queues and async processing

### **Reliability Patterns**
1. **Circuit Breakers**: Prevent cascading failures
2. **Timeouts & Retries**: Handle transient failures
3. **Bulkhead**: Isolate critical resources
4. **Redundancy**: Eliminate single points of failure
5. **Graceful Degradation**: Maintain core functionality

### **Scalability Checklist**
- [ ] Stateless application design
- [ ] Horizontal scaling capability
- [ ] Database sharding strategy
- [ ] Caching at multiple levels
- [ ] Async processing for heavy operations
- [ ] Load balancing across instances
- [ ] CDN for static content
- [ ] Monitoring and alerting

### **Security Essentials**
- [ ] Authentication and authorization
- [ ] Data encryption (at rest and in transit)
- [ ] Input validation and sanitization
- [ ] Rate limiting and DDoS protection
- [ ] Security headers and HTTPS
- [ ] Regular security audits
- [ ] Principle of least privilege

### **Common Interview Calculations**

#### **Capacity Estimation Formulas**
- **Daily Active Users (DAU)**: Total users × activity rate
- **Queries Per Second (QPS)**: DAU × actions per user / 86400
- **Peak QPS**: Average QPS × peak factor (2-3x)
- **Storage**: Records × record size × replication factor
- **Bandwidth**: QPS × average request/response size

#### **Performance Benchmarks**
- **Memory Access**: 100 nanoseconds
- **SSD Random Read**: 150 microseconds
- **Network Round Trip**: 500 microseconds (same datacenter)
- **Database Query**: 1-10 milliseconds
- **Cross-continent Network**: 150 milliseconds

#### **Scale References**
- **Small Scale**: 1K-10K users, 10-100 QPS
- **Medium Scale**: 100K-1M users, 1K-10K QPS
- **Large Scale**: 10M-100M users, 100K-1M QPS
- **Massive Scale**: 1B+ users, 10M+ QPS

---

## 📚 **Study Tips**

### **Memorization Techniques**
1. **Acronyms**: Create memorable acronyms for concept groups
2. **Visual Diagrams**: Draw architecture diagrams repeatedly
3. **Real Examples**: Associate concepts with real-world systems
4. **Practice Problems**: Solve capacity estimation daily
5. **Teach Others**: Explain concepts to reinforce learning

### **Interview Preparation**
1. **Start Broad**: Begin with high-level architecture
2. **Dive Deep**: Focus on 2-3 components in detail
3. **Consider Trade-offs**: Always discuss alternatives
4. **Scale Gradually**: Start simple, then add complexity
5. **Ask Questions**: Clarify requirements throughout

### **Continuous Learning**
1. **Read Engineering Blogs**: Follow major tech companies
2. **Study Real Systems**: Analyze open-source architectures
3. **Practice Regularly**: Design systems weekly
4. **Stay Updated**: Follow industry trends and new technologies
5. **Build Projects**: Implement concepts hands-on

This quick reference guide provides essential information for rapid review and interview preparation. Use it alongside the comprehensive study guide for complete mastery of system design concepts.
