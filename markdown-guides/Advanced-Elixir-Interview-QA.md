# Advanced Elixir Interview Questions and Answers (20 Q&A)

## 1. How does the BEAM scheduler work and why does it matter for Elixir concurrency?

**Answer:**
The BEAM VM uses **preemptive scheduling** with thousands to millions of lightweight processes. Each BEAM scheduler maps to an OS thread and runs a reduction-count based loop; after a fixed number of function calls (reductions), a process yields so others can run. This prevents any single process from blocking the VM and gives soft real-time responsiveness. For Elixir, this means you can safely spawn many processes (`Task`, `GenServer`, etc.) without worrying about manual thread management or coarse-grained locks.

---

## 2. What is a dirty scheduler in BEAM and when would you use dirty NIFs?

**Answer:**
Dirty schedulers are special BEAM schedulers for **long-running or blocking native code** (NIFs). Normal NIFs must return quickly; otherwise they block a scheduler and hurt latency. Marking a NIF as **dirty** (`ERL_NIF_DIRTY_JOB_CPU_BOUND` or `IO_BOUND`) makes it run on dirty schedulers, isolating blocking work. You use dirty NIFs when you must call native code that cannot be made fast/non-blocking (e.g., heavy crypto, image processing) but still want to protect BEAM’s responsiveness.

---

## 3. Explain the difference between `GenServer.call/3` and `GenServer.cast/2` and when to use each.

**Answer:**
- `GenServer.call/3` is **synchronous**: the caller sends a request and waits for a reply or timeout. It is used when you need a **result** or confirmation.
- `GenServer.cast/2` is **asynchronous**: it sends a fire-and-forget message and never waits for a reply. It is used for side-effect operations where the caller does not care about the immediate result.

Use `call` for queries or commands where the client must know success/return value; use `cast` for logging, best-effort updates, or when decoupling caller latency from server work is important.

---

## 4. What are supervision strategies (`:one_for_one`, `:one_for_all`, `:rest_for_one`) and when would you choose each?

**Answer:**
- `:one_for_one`: Only the crashed child is restarted. Use for **independent** processes.
- `:one_for_all`: If one child crashes, **all** children are terminated and then all restarted. Use when children are **tightly coupled** and share state or assumptions.
- `:rest_for_one`: If a child crashes, it and all children **started after it** are restarted. Use when you have a **dependency chain**—later children depend on earlier ones.

Choosing the right strategy models failure relationships explicitly and keeps your supervision tree coherent.

---

## 5. How does `Registry` compare to `:global` and `:gproc` for process registration?

**Answer:**
- `Registry` is an Elixir standard module for **local, sharded registries** offering unique and duplicate keys with efficient ETS-backed lookups.
- `:global` is Erlang’s distributed, globally consistent registry; it’s simpler but can become a bottleneck in large clusters.
- `:gproc` (external lib) offers richer features (properties, subscriptions) but adds dependency and complexity.

Use `Registry` for most **local node** name → PID mappings or pub/sub; use `:global` for simple, small-scale cross-node registration; consider `:gproc` when you need advanced features.

---

## 6. Explain how ETS tables work and when to use ETS vs a GenServer.

**Answer:**
ETS (Erlang Term Storage) is an in-memory storage system managed by the BEAM. Tables live outside process heaps and are accessed by PIDs that own or have permissions. Reads and writes are O(1) operations.

Use **ETS** when you need:
- Shared, mutable in-memory state with high read/write throughput.
- Fast lookups that would bottleneck a GenServer as a single process.

Use a **GenServer** when:
- You need serialized access, invariants, or complex transactional logic around the state.
- You want to encapsulate side effects, validation, and behaviour behind a process.

Often, a GenServer **owns** an ETS table and mediates access.

---

## 7. What is a `DynamicSupervisor` and how does it differ from a regular Supervisor?

**Answer:**
A `DynamicSupervisor` manages children started **dynamically at runtime** rather than via a fixed child spec list. You use `DynamicSupervisor.start_child/2` to start children on demand.

In contrast, a regular `Supervisor` defines its children statically in `init/1`. Use `DynamicSupervisor` when the **number of workers is not known ahead of time** or must scale with load, like per-connection processes, per-user sessions, or job processes.

---

## 8. How does Elixir handle code upgrades in production (hot code loading)?

**Answer:**
BEAM supports **hot code loading**, where two versions of a module can coexist. Advanced deployments use OTP releases and tools like `:release_handler` or Distillery/Elixir releases to apply upgrades via **appup/relup** instructions.

In practice, many Elixir systems do rolling restarts via orchestration (Kubernetes, Systemd) instead of manual hot upgrades. Hot code loading is still useful for **short-lived changes** or when zero downtime is crucial and the upgrade path is carefully designed.

---

## 9. What is `Flow` and how does it relate to `GenStage`?

**Answer:**
`GenStage` is a low-level abstraction for **producer–consumer pipelines** with back-pressure. You wire producers, producer-consumers, and consumers manually.

`Flow` is a higher-level abstraction built on `GenStage` that provides **parallel, flow-based data processing** using familiar operations (`map`, `reduce`, `partition`). You use `Flow` when you want parallelism and back-pressure without managing stages manually; reach for raw `GenStage` when you need fine-grained control over stages and demand.

---

## 10. How do `Task.async/await` and `Task.Supervisor` differ in usage?

**Answer:**
- `Task.async/await` spawns a linked task and waits for the result. If the task crashes, the caller also crashes unless you trap exits.
- `Task.Supervisor` supervises tasks; you can start supervised tasks with `Task.Supervisor.async_nolink/2` or `start_child/2`, configure restart/shutdown, and run tasks from remote nodes.

Use plain `Task.async/await` for **simple, short-lived concurrent work** in the same supervision context. Use `Task.Supervisor` when tasks are part of your **supervision tree**, must be isolated, or run across nodes.

---

## 11. Explain the difference between `Stream` and `Flow` for large data processing.

**Answer:**
- `Stream` provides **lazy, single-node, single-scheduler** pipelines. It saves memory by computing values on demand but doesn’t add parallelism by itself.
- `Flow` adds **parallelism and partitioning** on top of `GenStage`, processing large or infinite streams across multiple schedulers, with back-pressure and grouping.

Use `Stream` when you just need laziness and memory efficiency; use `Flow` when you also need **parallel execution and throughput**.

---

## 12. How does pattern matching work on maps and structs, and how can it help with API design?

**Answer:**
Pattern matching on maps/structs lets you **declare the shape of data** you expect:

```elixir
%User{id: id, role: :admin} = current_user
```

This both asserts the type (`%User{}` struct) and extracts fields (`id`) while enforcing guards (role is `:admin`). For API design, you can:
- Use **structs** to model domain concepts.
- Pattern match in function heads to route behaviour.
- Provide clear, declarative contracts instead of defensive `if`/`case` trees.

---

## 13. What are guards in function heads and when should you move logic into a guard vs the body?

**Answer:**
Guards are boolean expressions in function heads (`when`) that refine pattern matches:

```elixir
def handle(%User{age: age} = user) when age >= 18, do: ...
```

They must use a restricted set of **guard-safe** functions (no arbitrary side effects). Use guards when:
- The condition is part of the **function’s dispatch logic**.
- You want multiple clauses optimized by the compiler.

Move complex or side-effecting logic into the function body to maintain readability and avoid guard limitations.

---

## 14. How does `with` work, and how can you use it to model success/failure pipelines?

**Answer:**
`with` chains pattern matches and short-circuits on the first non-matching clause:

```elixir
with {:ok, user} <- fetch_user(id),
     {:ok, plan} <- fetch_plan(user),
     {:ok, result} <- bill(user, plan) do
  {:ok, result}
else
  {:error, reason} -> {:error, reason}
end
```

It’s ideal for **sequential operations that may fail**, using tagged tuples. It keeps success logic linear while centralizing error handling in the `else` block.

---

## 15. What are some strategies for handling errors and timeouts in `GenServer` calls?

**Answer:**
- Set explicit **timeouts** in `GenServer.call/3` and handle `{:EXIT, {:timeout, _}}` if trapping exits.
- Use **`handle_info/2`** for timeout messages (`Process.send_after/3`).
- Return tagged tuples like `{:error, :busy}` when under load.
- Use **circuit-breaker patterns** (e.g., via libraries) if the server depends on flaky external systems.
- Supervise the GenServer appropriately and avoid long-running work inside callbacks; delegate to `Task`s if needed.

---

## 16. How does distribution work in Elixir/Erlang nodes, and what are some caveats?

**Answer:**
Nodes connect over TCP using **Erlang distribution**. You name nodes (`--name`/`--sname`), share a **cookie** for authentication, and then can send messages to remote PIDs and use global behaviors.

Caveats:
- Distribution is not encrypted by default; use **TLS or a VPN** in production.
- Network partitions can cause **netsplits**, so design for partial failure.
- Latency and message ordering are not guaranteed across nodes; design protocols accordingly.

---

## 17. What is `:mnesia` and when might you use it instead of a traditional database?

**Answer:**
`:mnesia` is a distributed, soft real-time DB built into Erlang/BEAM, supporting transactions, replication, and RAM/disk tables. It is ideal for:
- **Cluster-local**, low-latency configuration or metadata.
- Telecom-style workloads with small, highly available datasets.

You typically **don’t** use it as a general-purpose primary store for web apps (Postgres is still more common), but it can be a strong fit for **stateful, cluster-internal data**.

---

## 18. How do you profile and optimize performance in an Elixir application?

**Answer:**
Common tools and steps:
- Use `:observer` or `:observer_cli` to inspect processes, message queues, and ETS tables.
- Use `:fprof`, `:eprof`, or `:cprof` for function-level profiling.
- Use `telemetry` events with tools like `oban`, Phoenix, Ecto, and visualize via LiveDashboard.
- Look for **long message queues**, **hot processes**, and **NIF bottlenecks**.

Optimization typically means: reduce unnecessary allocations, avoid long-running GenServer callbacks, add concurrency with processes or `Flow`, and push heavy work off to background jobs.

---

## 19. How do `mix` environments (`dev`, `test`, `prod`) affect configuration and releases?

**Answer:**
`mix` environments control which config files apply (`config/dev.exs`, `config/test.exs`, `config/prod.exs`) and which dependencies or compilation options are used. For releases, you usually build in `MIX_ENV=prod`, which:
- Enables production config (e.g., logger level, endpoint settings).
- Excludes dev/test-only deps.
- Produces optimized BEAM bytecode.

Understanding environments ensures you don’t accidentally rely on dev-only behaviour in production.

---

## 20. How would you design a fault-tolerant job processing system in Elixir using OTP principles?

**Answer:**
A typical design:
- A **`DynamicSupervisor`** that starts one process per job.
- A **queue** (e.g., from DB, Redis, SQS, or ETS) that feeds jobs.
- Worker processes implemented as `GenServer` or `Task` modules that handle a single job, report success/failure, and then terminate.
- Supervisors with appropriate strategies and **back-off** on repeated failures.
- Telemetry hooks for monitoring throughput and error rates.

Libraries like **Oban** implement these patterns on top of Postgres; understanding OTP lets you reason about supervision trees, retries, and isolation.

