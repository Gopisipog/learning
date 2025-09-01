# Answers: Interview Questions from questions.txt

### Security headers (HTTP)
- Strict-Transport-Security (HSTS): force HTTPS and preload.
- Content-Security-Policy (CSP): restrict sources for scripts/styles/images; prefer nonces; avoid unsafe-inline.
- X-Content-Type-Options: nosniff to prevent MIME sniffing.
- Referrer-Policy: limit referer leakage (e.g., no-referrer, strict-origin-when-cross-origin).
- Frame embedding: use CSP frame-ancestors (preferred) or X-Frame-Options SAMEORIGIN/DENY.
- Permissions-Policy: disable powerful features by default (geolocation, camera, mic, etc.).
- Cross-Origin headers: COOP/COEP/CORP when isolation is needed; CORS for controlled sharing.

Example (ASP.NET Core):
```csharp
app.Use(async (context, next) =>
{
    context.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload";
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()";
    context.Response.Headers["Cross-Origin-Opener-Policy"] = "same-origin";
    context.Response.Headers["Cross-Origin-Resource-Policy"] = "same-origin";
    context.Response.Headers["Content-Security-Policy"] =
        "default-src 'self'; script-src 'self' 'nonce-{{nonce}}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'";
    await next();
});
```
Notes:
- Generate a per-request CSP nonce and emit it in script tags to avoid unsafe-inline.
- Use frame-ancestors instead of X-Frame-Options when CSP is present.
- Test with browser devtools and securityheaders.com before tightening further.

### Angular DI essentials (quick reference)
- Hierarchical injectors: injector tree; nearer provider overrides ancestors.
  - App root provider → shared instance app-wide.
  - Component provider → new instance for that component subtree.
- @Injectable({ providedIn }): tree-shakable registration location.
  - 'root' (singleton), 'any' (per lazy module), 'platform', or a specific NgModule.
- Providers in modules/components:
  - In NgModule.providers: shared by that injector (eager module ≈ app; lazy module ≈ feature scope).
  - In Component.providers: new instance per component instance (and its children).
- Prefer constructor injection: `constructor(private svc: UserService) {}` for typing/testability.
- Tokens for abstractions: use InjectionToken for interfaces or multiple impls.
  - Example:
    ```ts
    export const PAYMENT_GATEWAY = new InjectionToken<PaymentGateway>('PaymentGateway');
    @Component({ providers: [{ provide: PAYMENT_GATEWAY, useClass: StripeGateway }] })
    export class CheckoutComponent {
      constructor(@Inject(PAYMENT_GATEWAY) private gw: PaymentGateway) {}
    }
    ```
- Choosing scope:
  - App-wide services → providedIn: 'root'.
  - Feature-scoped (lazy module) state → provide in that lazy module.
  - Component-local, per-instance state → Component.providers.

### Anemic domain model and Over-abstracting (guidance)
- Anemic domain model: data-only objects; logic in services.
  - Risks: weak encapsulation, scattered rules, duplicated invariants, brittle tests.
- Over-abstracting: interfaces/factories/layers without present need.
  - Risks: indirection, cognitive load, accidental complexity, perf/debug costs.
- Do this:
  - Put behavior with data; enforce invariants in entities/value objects.
  - Create interfaces only for real variation points/testing seams/boundaries.
  - YAGNI: defer abstractions until duplication/variability appears twice.
  - Favor simple composition; measure value of new layers.
  - Heuristics: one-impl interface? inline; setter orchestration service? move rules into domain; wrap external details at boundaries.

Below are concise, high-signal answers mapped 1–115 to questions.txt.

1. Dependency injection on .NET Core & Angular — DI decouples creation from use; .NET Core uses IServiceCollection/ServiceProvider, lifetimes (Singleton/Scoped/Transient), constructor injection; Angular uses hierarchical injectors, @Injectable({providedIn}), providers in modules/components; prefer constructor injection and tokens for abstractions.
2. Request pipeline & Middlewares in .NET Core — Ordered middleware chain handles HTTP request/response; common: ExceptionHandling → HSTS/HTTPS → StaticFiles → Routing → CORS → AuthN/AuthZ → Endpoints; register via app.UseX/app.Map; order matters.
3. Authentication and Authorization (theory & impl) — AuthN verifies identity (cookies/JWT/OIDC); AuthZ enforces access via roles/policies/claims; ASP.NET Core: AddAuthentication().AddJwtBearer()/AddOpenIdConnect(); AddAuthorization(options => policies); use [Authorize]/[AllowAnonymous] and policies; store tokens securely on client.
4. Parent→child and vice versa in Angular — Parent→child: input bindings [prop]; child→parent: @Output EventEmitter; also shared services with RxJS Subjects/BehaviorSubject.
5. Clustered vs non-clustered indexes; CTE vs temp table — Clustered orders table rows (1 per table), non-clustered separate structure (many, can INCLUDE); CTE is a named subquery (good for recursion/readability), temp table is materialized with stats/indexes (good for reuse across steps).
6. Create table from another table without data — SELECT INTO with false predicate or TOP 0; e.g., SELECT TOP 0 * INTO NewT FROM OldT; or CREATE TABLE + INSERT if customizing types.
7. SOLID principles — S: single responsibility; O: open/closed (extend, don’t modify); L: Liskov substitution; I: interface segregation; D: dependency inversion; apply via interfaces, DI, composition, clear boundaries.
8. Caching in .NET Core — In-memory cache for single node; IDistributedCache/Redis for multi-node; cache HTTP via ResponseCaching/ETag; cache expensive queries with key + TTL + invalidation strategy; beware cache stampede (lock/early refresh).
9. Azure SQL vs local DB; App Insights vs server logs — Azure SQL: managed backups, HA/DR, scaling, security; App Insights: centralized telemetry, traces/metrics/dependency maps, distributed tracing and KQL, live metrics versus raw server logs.
10. How to secure API — TLS everywhere, proper auth (JWT/OIDC), input validation, rate limiting, CORS, scopes/claims, secrets in Key Vault, least privilege, OWASP ASVS checks, logging/alerts.
11. async/await functionality — Async methods free threads while awaiting I/O; await captures task completion; avoid blocking (.Result/Wait()); use ConfigureAwait(false) in libraries; propagate cancellation tokens.
12. Performance optimization in API — Measure first; async I/O; pooling and reuse; minimize allocations/serialization; compress; cache; pagination; database indexes; batching; use AsNoTracking; reduce chatty calls; GZIP/Brotli; HTTP/2; profiling.
13. Table variable, indexes, optimized proc performance — Table variables lack stats and have scope limits; temp tables can index and have stats; for procs: SARGable predicates, proper indexes, avoid RBAR, parameter sniffing mitigations.
14. Angular lifecycle hooks, security, DI, data passing — Hooks: ngOnInit/ngOnChanges/ngOnDestroy; security: route guards, DomSanitizer, HttpInterceptor for tokens, CSP; DI: providers/injectors; data passing via Inputs/Outputs/services.
15. Design patterns — Creational (Factory, Singleton, Builder), Structural (Adapter, Facade, Decorator), Behavioral (Strategy, Observer, Command); pick patterns to isolate change and improve testability.
16. Application migration experience — Assess inventory/deps, target runtime (.NET 8/9), upgrade path (try .NET Upgrade Assistant), fix API breaks, test suite, perf/observability, rollout with blue/green/feature flags.
17. Azure services used — Common stack: App Service/AKS, Azure SQL/Cosmos DB, Storage, Service Bus/Event Grid, Key Vault, App Insights/Log Analytics, Front Door/CDN, Redis Cache, Azure AD.
18. Explain SOLID and pseudo code for one — Example: Strategy for discount calculation: define IDiscount and inject concrete strategy; supports Open/Closed and DIP.
19. Multiple inheritance — C# classes don’t support multiple inheritance; use multiple interfaces and composition; default interface methods for reuse where appropriate.
20. Singleton pattern use case — Shared configuration/cache/client (e.g., HttpClient, Redis); in .NET Core register as Singleton; ensure thread-safety and no mutable shared state leaks.
21. .NET Core dependency injection — Register services in Program.cs via services.AddX(); inject via constructor; use options pattern (IOptions<T>), named HttpClient via IHttpClientFactory.
22. .NET Core Azure AD authentication — AddMicrosoftIdentityWebApi/AddOpenIdConnect with Azure AD app registration; validate audience/issuer; use roles/scopes claims; protect controllers with [Authorize].
23. Repository pattern — Abstracts data access behind an interface; improves testability; avoid anemic/over-abstracting over EF Core IQueryable unless adding domain logic; consider Specification pattern.
24. Generics — Type parameters (List<T>, Repository<T>) for type safety/reuse; constraints (where T: class, new()); variance for interfaces/delegates (in/out).
25. for vs foreach performance — for slightly faster on arrays due to bounds check predictability; foreach allocates an enumerator (struct for List<T>); prefer readability unless hot path.
26. Improve employee dashboard performance (incl. Redis) — Cache per-user widgets in Redis with TTL; async/parallel fetches; precompute aggregates; DB indexes; pagination; compress images; CDN for static; debounce filters.
27. Azure App Service vs Azure Functions — App Service: long-running web apps/APIs; Functions: event-driven, serverless, per-execution billing and auto-scale; choose by workload model/lifecycle.
28. Exception handling in SQL Server — TRY...CATCH around statements; use THROW for re-throw; XACT_STATE() for transaction recovery; log to error table.
29. CQRS design pattern — Separate command (writes) and query (reads) models; enables independent scaling, denormalized read stores, and event sourcing compatibility.
30. Ensure endpoint isn’t malware — Validate domains (allowlist), TLS cert pinning as feasible, verify content-type/size, AV scan uploads (Defender/ClamAV), sandbox processing, reputation services.
31. Secure API and performance optimization — Combine #10 and #12: enforce auth/claims, rate limiting, input validation; plus async I/O, caching, indexes, profiling.
32. Authentication and Authorization (again) — See #3; add token rotation/refresh, PKCE on SPA, store tokens in memory or cookie (HttpOnly + SameSite).
33. SOLID with example — See #7 and #18; e.g., Interface Segregation by splitting fat interfaces into IReader/IWriter; LSP by honoring base class contracts.
34. Dependency injection on .NET Core — See #21; prefer scoped for EF DbContext, singleton for stateless services, transient for lightweight.
35. Request pipeline & Middleware with example — app.Use(async (ctx,next)=>{ /* pre */ await next(); /* post */}); app.UseRouting(); app.UseAuthentication(); app.UseAuthorization(); app.MapControllers();
36. EF LINQ scenario guidance — Understand translation to SQL; avoid client eval; Include for navigation graphs; AsNoTracking for reads; projection to DTOs; use Any/Exists over Count>0.
37. Exception handling in .NET Core — Global exception middleware + ProblemDetails; use filters in MVC; log with ILogger; avoid catching and swallowing.
38. Azure services used — See #17; tailor to app needs (queues, cache, identity, monitoring).
39. CTE in SQL Server with example — WITH cte AS (SELECT ... ) SELECT ... FROM cte; great for recursion and readability; materialization depends on plan.
40. Joins scenario tips — Choose right join type, put predicates on indexed columns, beware accidental cross joins; use EXISTS for semi-joins when appropriate.
41. Output on count queries — In SQL Server COUNT(1), COUNT(*), COUNT(2) all return total row count; COUNT(column) counts non-NULLs.
42. SELECT COUNT(1) FROM employee — Returns row count (same as COUNT(*)).
43. SELECT COUNT(*) FROM employee — Returns row count; optimizer treats * efficiently.
44. SELECT COUNT(2) FROM employee — Returns row count (constant expression per row).
45. Work with large files in API — Stream (no buffering), multipart/chunked uploads, max request size config, virus scan, store to blob storage, return 202 for async processing, support range requests for downloads.
46. Pagination in EF Core and SQL — Use keyset pagination for stable pages (WHERE key < @lastKey ORDER BY key DESC); fallback to Skip/Take with proper index; include total count if needed.
47. How did you do AuthN/AuthZ — SPA uses OIDC/OAuth2 (PKCE) to get tokens; API validates JWT; roles/scopes map to policies; fine-grained [Authorize] on endpoints.
48. CTE and Procedures (assumed) — CTE: named result for a single statement; Stored Procedure: compiled T-SQL routine with parameters, can change state and return multiple result sets.
49. Given a SQL query — Approach: read from FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER; check indexes/selectivity; compute expected result on small sample.
50. What is DI and how in .NET Core — DI is inversion of control; register services (AddTransient/Scoped/Singleton), inject via constructor; avoid service locator.
51. Prop drilling in React — Passing props through many layers; mitigate with context, state management (Redux/Zustand), or component composition.
52. Ask for auth token in React and store for app — Use OIDC/OAuth client; store in memory or HttpOnly cookie; avoid localStorage if possible; attach via Authorization header in axios/fetch interceptor.
53. Design principles (Singleton, Repository, etc.) — Use Singleton for shared immutable services; Repository to abstract data; prefer composition, SOLID, YAGNI.
54. Rectify code for SOLID — Use Strategy pattern for discount; avoid if-else by polymorphism; inject IDiscountCalculator; open/closed compliance.
55. DiscountService code (given) — The refactor is on track, but RegularCustomer discount 0.5 should be 0.05; prefer enum→strategy mapping or DI container over manual selection; unit test per strategy.
56. Interface ICustomer snippet — Ensure interface segregates responsibilities; consider context-based Calculate method if rules expand.
57. RegularCustomer snippet — Fix math to 0.05; avoid magic numbers; consider configuration-driven strategies.
58. VIPCustomer snippet — Correct at 0.1; same suggestions as #57.
59. DiscountStrategy snippet — Follows Strategy pattern; could accept IDiscountFactory to choose strategy per customer type.
60. Main usage snippet — Favor DI container; inject IDiscountCalculator into controllers/services; avoid new-ing concrete types in Main.
61. Azure resources in my app — Likely: App Service, Azure SQL, Key Vault, Storage, Service Bus, App Insights, Redis Cache, Front Door; specify per app.
62. IQueryable vs IEnumerable; which faster — IQueryable builds expression trees executed by provider (DB), enabling server-side filtering; IEnumerable operates in-memory; speed depends on where work happens—prefer IQueryable for DB queries.
63. Considerations migrating to .NET 9 — Update SDK/TFM, NuGet package compatibility, nullable/ANALYZERS, trimming/AOT readiness, ASP.NET pipeline changes, test and perf; use Upgrade Assistant.
64. Request/response filters — ASP.NET MVC filters (action, resource, exception, result); for minimal APIs use endpoint filters; for HttpClient use delegating handlers.
65. Azure resources to deploy .NET app — App Service/AKS, Azure SQL/Cosmos, Storage, Key Vault, App Insights, Front Door, Redis Cache, VNet/Private Endpoints, Monitor/Alerts.

66. — 115. Additional answers
66. Domain modeling — Use DDD tactical patterns (entities/value objects/aggregates), enforce invariants in aggregate roots.
67. Logging best practices — Structured logs with correlation IDs; centralize with App Insights/KQL; log levels and sampling.
68. Rate limiting — ASP.NET Core rate limiter middleware with fixed/sliding window; store counters in memory/Redis.
69. Health checks — Use AspNetCore.Diagnostics.HealthChecks; expose /healthz; integrate with container orchestrators.
70. Configuration — Bind strongly typed options via IOptions; use Key Vault and appsettings.{env}.json; reloadOnChange.
71. Validation — FluentValidation/DataAnnotations; avoid throwing for validation errors; return ProblemDetails (422).
72. Background tasks — Hosted services for scheduled work; use durable queues (Azure Service Bus) for reliability.
73. EF Core transactions — Use DbContext.Database.BeginTransaction/UseTransaction; Outbox for integration events.
74. Idempotency — Idempotency keys for POST; safe retry patterns; dedupe in persistence.
75. Security headers — Use middleware to set HSTS, CSP, X-Content-Type-Options, X-Frame-Options.
76. CORS — Restrict origins/methods/headers; do not use AllowAny in prod.
77. API versioning — Use aspnet-api-versioning; deprecate older versions gradually.
78. OpenAPI — Swashbuckle to document and test; include auth flows.
79. GZip/Brotli — Response compression middleware; verify CPU trade-offs.
80. HttpClient — Use IHttpClientFactory; configure timeouts/retries/policies via Polly.
81. Connection pooling — Reuse DbContext per request (scoped); avoid opening/closing per query.
82. EF change tracking — Disable when not needed (AsNoTracking); Use NoTrackingWithIdentityResolution sparingly.
83. LINQ pitfalls — Deferred execution; be explicit with ToList() at boundaries.
84. SQL injection — Always parameterize; avoid string concatenation.
85. Secrets — Never check into repo; use Key Vault; managed identities.
86. CDN — Offload static assets; improve latency.
87. Content negotiation — Support JSON only unless needed; validate Accept header.
88. DTO mapping — Project with Select to avoid overfetch; use Mapster/AutoMapper judiciously.
89. Feature flags — Use Azure App Configuration/Feature Management; progressive delivery.
90. Blue/green — Deploy two slots; warm-up then swap.
91. Tracing — W3C TraceContext; propagate traceparent headers; OpenTelemetry.
92. Memory leaks — Watch singleton capturing scoped services; dispose IDisposable; analyze with dotMemory.
93. Threading — Avoid blocking on async; ensure ConfigureAwait(false) in libs.
94. Real-time — Use SignalR for push; scale with backplanes (Redis/Azure SignalR).
95. Testing — Unit tests for controllers/services; integration tests with WebApplicationFactory.
96. Authorization policies — Requirements/handlers for complex rules (time-based, resource-based).
97. Resource-based auth — IAuthorizationService.AuthorizeAsync(user, resource, requirement).
98. Database sharding — Use key-based sharding for scale; cross-shard queries via app layer.
99. Data consistency — Use transactions and eventual consistency where appropriate; sagas for workflows.
100. API gateways — Use YARP/NGINX/Front Door; cross-cutting concerns centralized.
101. Resilience — Retry with jitter, circuit breakers (Polly), timeouts, bulkheads.
102. WebSockets vs SSE — Pick based on duplex/scale; SignalR abstracts.
103. Build pipelines — CI/CD via GitHub Actions/Azure DevOps; run tests/lint/security scans.
104. Code quality — Analyzers, StyleCop, nullable reference types, code review checklists.
105. Dependency boundaries — Explicit application/core/infrastructure layers; minimize references inward.
106. Events — Use domain/integration events; ensure outbox/inbox for reliability.
107. Messages — Prefer contracts (schemas) with versioning; backward compatibility.
108. Serialization — System.Text.Json; custom converters for edge types; avoid dynamic.
109. Time handling — Use UTC in DB; IDateTimeProvider for testability; beware DST.
110. Numeric precision — Use decimal for money; configure column types.
111. Date ranges — Use half-open intervals [start, end); avoid off-by-one.
112. EF migrations — Use design-time factories; zero-downtime migrations.
113. Observability dashboards — SLOs, error budgets, golden signals (latency/saturation/errors/traffic).
114. Governance — Code owners, branch protection, secrets scanning.
115. Documentation — Architecture decision records (ADR), README with runbooks and troubleshooting.

