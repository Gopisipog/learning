# Azure for Architects — Chapter 3 Notes

Design pattern – Networks, storage, messaging, and events

This file condenses Chapter 3 into practical, organized guidance with decision matrices, checklists, and pattern mappings so you can apply the material quickly during design and reviews.

---

## Executive summary

- Choose regions primarily by: (1) service availability, (2) data residency/compliance, (3) network latency to users, (4) cost differentials.
- Favor Azure Virtual Network (VNet) peering (regional or global) for low-latency private connectivity; use VPN/ExpressRoute for encryption or private on-premises connectivity.
- Deploy VNets with deliberate IP plans, subnet per tier, NSGs/ASGs for micro-segmentation, and Network Watcher for visibility.
- Select storage by access pattern and data shape; set correct redundancy (LRS/ZRS/GRS/GZRS/RA* variants) per availability and compliance needs; enable encryption and SAS over account keys.
- Use proven cloud patterns:
  - Messaging: Competing Consumers, Priority Queue, Queue-Based Load Leveling.
  - Performance & scalability: CQRS, Event Sourcing, Throttling, Retry, Circuit Breaker.
- Map patterns to Azure-native: Service Bus, Storage queues, App Service/AKS, Functions, Cosmos DB, SQL Database, and Application Gateway/Front Door.

---

## 1) Regions and Availability Zones

Key selection criteria (ref Chapter 3):
- Service availability varies by region; confirm availability before committing.
- Data residency/privacy requirements may mandate region selection.
- Latency (route-based, not purely geographic distance) impacts performance.
- Cost differs per region; evaluate TCO, not just unit price.

Decision checklist
- [ ] Are all required services/SKUs GA in the target region(s)?
- [ ] Do data sovereignty rules constrain region(s)?
- [ ] Have you measured latency from user PoPs (RUM/synthetic)?
- [ ] Have you compared cost and egress implications across candidate regions?
- [ ] Will you use Availability Zones in-region for higher SLA?

Common pitfalls
- Selecting a region where a dependency (e.g., Log Analytics, GZRS) is not supported.
- Assuming geographically closest region is lowest latency.
- Ignoring inter-region data egress and cross-zone costs.

---

## 2) Virtual Networks

Core benefits
- Isolation: per-tier subnets; independent life cycle and policy.
- Security: NSGs/ASGs, UDR/force tunneling, Azure Firewall, third-party NVA.
- Extensibility: Peer VNets regionally or globally; hybrid via VPN/ExpressRoute.

Design considerations
- Regions: VNet is regional; use peering for cross-region VNet connectivity.
- DNS: Use custom DNS if required; Azure-provided DNS for simple cases.
- IP plan: Avoid overlaps across on-prem/VNets; size with future growth in mind.
- Subnets: One per logical component/tier; apply NSGs at subnet and/or NIC.
- Security: NSGs (subnet/NIC), ASGs, Azure Firewall with Threat Intelligence.
- Monitoring: Enable Network Watcher (IP flow verify, next hop, packet captures, NSG flow logs), Log Analytics Network Performance Monitor.
- Deployment: Separate RG for networking; role boundaries (network admin Owner, app teams Contributor to consuming RGs); enforce with Policy.

Connectivity options
- Same region & subscription: VNet peering.
- Same region & different subscription/tenant: VNet peering (supports cross-sub/tenant) or VPN gateways if you need encryption without peering.
- Different regions: Global VNet peering (private, no gateways/public Internet) or VPN gateways.
- On-premises: Site-to-Site VPN (IPsec over Internet), Point-to-Site VPN (few clients), ExpressRoute (private circuit; highest reliability/latency; more cost).

When to choose peering vs gateways
- Choose VNet peering (regional/global) when:
  - Low latency private connectivity needed inside Azure.
  - No mandatory encryption between VNets (peering stays on Microsoft backbone).
  - No transitive routing required (unless using hub-and-spoke with NVA/Route Server.
- Choose VPN gateways when:
  - You require IPsec encryption for VNet-to-VNet traffic.
  - You need on-premises connectivity (S2S/P2S).
  - You cannot use peering due to policy/requirements.

ASCII topology sketches

Same region, peering

```
VNet1 (10.0.0.0/16)  <-- peering -->  VNet2 (10.1.0.0/16)
```

Cross-subscription, cross-region, global peering

```
VNet-A (West US) <== global peering ==> VNet-B (East US)
   |                                           |
  Spoke apps                                 Spoke apps
```

Hybrid connectivity patterns

- Site-to-Site VPN
```
On-Premises GW  ===IPsec over Internet===  VNet GW  -> Subnets/Apps
```
- ExpressRoute
```
On-Prem WAN  ==Private Circuit==  Microsoft Edge  === Private VNet(s)
``` 

Networking security quick wins
- Deny by default with NSGs; allow least privilege by port/IP.
- Use ASGs for role-based micro-segmentation across subnets.
- Centralize egress/ingress via Azure Firewall; enable Threat Intelligence.
- Log NSG flows and firewall logs to Log Analytics; alert on anomalies.

---

## 3) Storage

Storage types and when to use
- Blob storage: Unstructured objects (docs/images/backups), tiers: Hot/Cool/Archive.
- Table storage: NoSQL key-attribute store for simple structured data.
- Queue storage: Lightweight messaging (up to 64 KB/message; 7-day retention default).
- Files: SMB shares for lift-and-shift and shared content.
- Managed disks: Block storage for VMs.

Security & access
- Use SAS (account- or service-level) instead of account keys; rotate regularly.
- Enable encryption at rest: SSE (transparent) or ADE for VM disks; CSE for client-side.
- Use Private Endpoints to remove public exposure where possible.
- Enforce firewall and allowed networks when not using Private Link.

Redundancy options and guidance

| Redundancy | Copies | Scope | Notes/Use Cases |
|---|---:|---|---|
| LRS | 3 | Single DC | Cheapest; no zone/regional fault tolerance |
| ZRS | 3 | Multi-AZ | Zone fault tolerance within region; better durability |
| GRS | 6 | Primary (LRS) + Secondary (single DC) | Secondary for DR (not readable) |
| RA-GRS | 6 | Primary + Secondary (readable) | Read access to secondary |
| GZRS | 6 | Primary (ZRS) + Secondary (single DC) | Highest primary availability |
| RA-GZRS | 6 | Primary (ZRS) + Secondary (readable) | Highest primary availability + readable DR |

Decision tips
- Need in-region AZ resilience? Choose ZRS/GZRS.
- Need cross-region DR? Choose GRS/RA-GRS or GZRS/RA-GZRS.
- Need read from secondary? Choose RA-* variants.
- Compliance mandates single-region only? Use ZRS or LRS.

Performance and limits (illustrative per chapter guidance)
- General accounts: up to ~20k IOPS or ~60 MB/s per account; check current limits.
- Bandwidth varies by redundancy and geography; verify current documented targets.
- Premium disks/Blob (BlockBlobStorage) for high IOPS/low latency scenarios.

Concurrency models
- Optimistic: default for tables; detect write conflicts via ETags.
- Pessimistic: locks for SMB files; prevents concurrent updates.
- Last writer wins: queues/blobs/files via REST.

Best practices
- Co-locate storage with compute to avoid egress/latency.
- Use containers per client/use case with scoped SAS.
- Cache hot blobs; re-validate via Last-Modified.
- Rotate SAS keys; store secrets in Key Vault (not configs).
- Choose appropriate tier (Hot/Cool/Archive) per access pattern and lifecycle.

---

## 4) Cloud Design Patterns (Applied)

### 4.1 Messaging Patterns

Pattern: Competing Consumers
- Problem: Scale processing throughput, add resilience; each message should be processed once.
- Solution: Multiple consumers pull from a single queue; each claim messages and delete upon success.
- Azure mapping: Service Bus Queue (transactions, ordering, sessions) or Storage Queue (simple/cheap).
- Monitor: Queue depth, consumer lag, DLQ counts.
- Pitfalls: No idempotency in consumer; forgetting DLQ handling.

Pattern: Priority Queue
- Problem: Serve high-priority messages faster than others.
- Solution: Single queue with priority (if supported) or multiple queues by priority with dedicated consumers.
- Azure mapping: Service Bus (support for separate queues or custom prioritization layer). Storage queues via multi-queue approach.
- Monitor: SLA per priority class, starvation of low priority.

Pattern: Queue-Based Load Leveling
- Problem: Absorb spikes with limited downstream capacity; avoid timeouts.
- Solution: Queue between producer and consumer; consumers process at sustainable rate.
- Azure mapping: Service Bus/Storage Queue; Functions with Queue trigger; backpressure via scale rules.
- Monitor: Time-in-queue, max dequeue count, poison/DLQ.

Choosing Service Bus vs Storage Queue (rule of thumb)
- Use Service Bus when you need: FIFO (sessions), transactions, topics/subscriptions (pub/sub), larger message sizes (up to 256 KB/1 MB), DLQs, scheduled delivery.
- Use Storage Queue when you need: simple, massive scale, low cost, Azure Storage co-location, basic semantics (<= 64 KB messages).

### 4.2 Performance & Scalability Patterns

Pattern: CQRS (Command and Query Responsibility Segregation)
- Problem: Read and write workloads with divergent performance/shape; complex domain logic on writes.
- Solution: Separate models and stores for commands (writes) and queries (reads).
- Azure mapping: Writes to SQL/Service; project read views to SQL/Cosmos/Cache; use Functions or AKS for projections.
- Pitfalls: Complexity in consistency; eventual consistency acceptance required.

Pattern: Event Sourcing
- Problem: Preserve full history and rebuild state; improve auditability.
- Solution: Store events as the source of truth; derive current state by folding events.
- Azure mapping: Append-only store (Event Hubs/Service Bus + Cosmos DB/Blob); project to read models.
- Pitfalls: Event versioning, upcasters, replay costs; requires strong discipline.

Pattern: Throttling
- Problem: Protect services under burst load; meet SLOs.
- Solution: Limit concurrent requests per tenant/user; reject/queue/backoff.
- Azure mapping: API Management rate limits; Functions concurrency; App Gateway WAF rate limiting; custom tokens/leaky bucket.
- Monitor: 429 rates, latency percentiles, error budgets.

Pattern: Retry (with jitter)
- Problem: Transient faults (timeouts, 5xx) common in distributed systems.
- Solution: Retry with capped exponential backoff + jitter; classify retryable errors.
- Azure mapping: SDK retry policies (Storage, Service Bus, Cosmos DB); Polly in .NET; Functions bindings have built-in retry for some triggers.
- Pseudocode:
```
maxRetries = 5
baseDelay = 200ms
for i in 1..maxRetries:
  try op()
  catch transient:
    sleep random(0, baseDelay * 2^i)
    continue
  catch nonTransient:
    raise
```

Pattern: Circuit Breaker
- Problem: Avoid hammering failing dependencies; free up resources.
- Solution: Track failures; open circuit after threshold; half-open test; close on success.
- Azure mapping: Polly Circuit Breaker in .NET; APIM policies for backend health; custom in gateway.
- States: Closed -> Open (on threshold) -> Half-Open (probe) -> Closed (on success).

Pattern to Azure service mapping (quick reference)

| Pattern | Azure Services |
|---|---|
| Competing Consumers | Service Bus Queues, Storage Queues, Functions (Queue trigger) |
| Priority Queue | Service Bus (separate queues or topics with filters) |
| Load Leveling | Service Bus/Storage Queues + Auto-scale consumers |
| CQRS | SQL/Cosmos DB + Functions/AKS projections, Cache (Redis) |
| Event Sourcing | Event Hubs/Service Bus + Cosmos DB/Blob; Stream Analytics for projections |
| Throttling | API Management, App Gateway WAF policies, custom tokens |
| Retry | SDK retry policies, Polly, Functions retry (where supported) |
| Circuit Breaker | Polly, API Management, custom gateway logic |

---

## 5) Actionable checklists

VNet build checklist
- [ ] CIDR plan approved; no overlaps with on-prem/VNets
- [ ] Subnets per tier; NSGs at subnet and/or NIC; ASGs defined
- [ ] UDRs defined (spoke -> hub); Azure Firewall centralized egress
- [ ] Private Endpoints for PaaS; DNS zones/routing prepared
- [ ] Network Watcher enabled; NSG flow logs to Log Analytics
- [ ] RBAC and Policy applied; network RG separated

Storage checklist
- [ ] Correct redundancy (LRS/ZRS/GRS/GZRS/RA-*) for SLA/DR
- [ ] SSE enabled; ADE for VM disks; use Private Endpoints
- [ ] SAS for client access; rotate SAS; store secrets in Key Vault
- [ ] Lifecycle policies: Hot->Cool->Archive
- [ ] Concurrency strategy chosen (optimistic/pessimistic)

Messaging checklist
- [ ] Service Bus/Storage Queue choice documented
- [ ] DLQ behavior defined; poison handling and alerting in place
- [ ] Throughput and scale estimates; auto-scale rules defined
- [ ] Idempotency ensured in consumers; at-least-once semantics acknowledged

Patterns checklist
- [ ] Retry strategy with jitter; retryable errors identified
- [ ] Circuit breaker thresholds; health endpoints for dependencies
- [ ] Throttling policies (per user/tenant); 429 handling in clients
- [ ] CQRS/Event Sourcing consistency strategy defined

---

## 6) Common pitfalls and anti-patterns

- Overlapping IP ranges between Azure VNets and on-premises networks.
- Putting all app tiers into a single subnet/NSG; insufficient micro-segmentation.
- Relying on account keys for Storage access; missing SAS rotation.
- Using GRS when data residency prohibits secondary region replication.
- Coupling producers and consumers tightly; skipping DLQ design.
- Blind retries without backoff/jitter; retrying non-idempotent operations.
- Circuit breakers never reset due to lack of half-open probe.

---

## 7) Architecture recipes (reference compositions)

1) Multi-tier app (single region, high availability)
- App Gateway (WAF) -> Web tier (VMSS or App Service) -> API tier -> Service Bus queue (load leveling, competing consumers) -> Worker tier (AKS or Functions) -> Storage (GZRS) + SQL Database (zone redundant where applicable).
- VNet with subnets per tier; NSGs/ASGs; centralized egress via Azure Firewall; Private Endpoints for Storage/SQL.
- Patterns: Load Leveling, Competing Consumers, Retry + Circuit Breaker.

2) Cross-region DR (active/passive)
- Region A + Region B; Traffic Manager/Front Door for failover.
- Data: Storage RA-GZRS; SQL geo-secondary; queue mirroring strategy or recovery plan.
- Test failover processes and RTO/RPO.

3) Event-driven ingestion
- Producers -> Event Hubs -> Stream Analytics (optional) -> Cosmos DB (read model) and/or Data Lake -> Downstream consumers (Functions).
- Patterns: Event Sourcing (event archive), CQRS (read models), Retry/Throttling.

---

## 8) Quick reference

- VNet peering vs VPN gateways:
  - Peering: lowest latency on Azure backbone; no transitive routing by default; supports cross-sub/tenant; no encryption requirement.
  - VPN: IPsec encryption; on-premises connectivity; supports transitive via hub-and-spoke with NVA.
- Storage queue vs Service Bus:
  - Storage: simple, 64 KB msg, cheaper, massive scale.
  - Service Bus: rich features (DLQ, sessions, topics), larger messages, transactions.
- Redundancy picks:
  - In-region AZ HA: ZRS/GZRS.
  - Cross-region DR: (RA-)GRS/(RA-)GZRS.

---

## 9) Source links from the chapter

- Availability Zones overview: https://docs.microsoft.com/azure/availability-zones/az-overview
- Services supporting AZs: https://docs.microsoft.com/azure/availability-zones/az-overview#services-that-support-availability-zones
- VNet peering: Regional & Global: https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview
- ExpressRoute overview: https://docs.microsoft.com/azure/expressroute/expressroute-introduction
- Storage redundancy: https://docs.microsoft.com/azure/storage/common/storage-redundancy
- Design patterns catalog: https://docs.microsoft.com/azure/architecture/patterns

---

## 10) Appendix — ADR template (region/VNet/storage)

Title: [Decision] Choose primary region(s) and network/storage redundancy

Context
- Workload description; user geographies; compliance constraints.
- Dependencies and service availability requirements.

Options
1. Region A with AZs; ZRS for Storage; SQL ZR; single-region active.
2. Region A+B (active/passive); GZRS; SQL geo-secondary; TM/Front Door failover.
3. Region A+B (active/active); cross-region read/write; complex data consistency.

Decision
- Choose Option X because [...].

Consequences
- Pros: [...]
- Cons: [...]
- Follow-ups: latency tests; DR drills; cost monitoring.

---

End of chapter notes.
