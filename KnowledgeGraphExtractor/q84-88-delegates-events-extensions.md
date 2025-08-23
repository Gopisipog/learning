# Q84–Q88: Extension Methods, Delegates, Multicast & Events (C#)

Full modules with definitions, use cases, code, pitfalls, MCQs, and scenarios.

---

## Q84. Extension Methods — What and When?

- Essentials: Static methods that appear as instance methods on the extended type via `this` modifier on first param.
- Use cases: Fluent APIs, helper methods on closed types (e.g., `string`, `IEnumerable<T>`), non-invasive enhancements.
- Example
```csharp
public static class StringExtensions
{
    public static bool IsNullOrWhite(this string? s) => string.IsNullOrWhiteSpace(s);
}
// usage
bool b = " ".IsNullOrWhite();
```
- Best practices: Keep in dedicated `*Extensions` static classes; avoid name collisions with instance members.
- Pitfalls: Discoverability, ambiguity, overuse; can’t access private members.
- MCQ: Extension methods must be in … A) static class B) any class C) instance class. Answer: A.
- Scenario: Add `ToSafeInt()` to parse strings without littering `int.TryParse` everywhere.


### Resolution & Versioning Notes
- Instance methods always win over extension methods during overload resolution.
- Extension methods are visible only when their static class namespace is in scope via `using`.
- You can disambiguate by calling explicitly: `StringExtensions.IsNullOrWhite(str)`.
- Moving/renaming the extensions' namespace is a compile-time breaking change for callers (they must update `using`).


### Deep Dive: Extension Methods (Expanded)

- Definition: Add reusable functionality to existing types without inheritance. Compiler rewrites `obj.Ext()` to `ExtClass.Ext(obj)`.
- Rules: static class, static method, first parameter prefixed with `this` of the type being extended.

```csharp
public static class StringExtensions2
{
    public static int ToSafeInt(this string? s, int fallback = 0)
        => int.TryParse(s, out var v) ? v : fallback;

    public static string Truncate(this string? s, int max)
        => string.IsNullOrEmpty(s) || s!.Length <= max ? s ?? string.Empty : s.Substring(0, max) + "...";
}

public static class EnumerableExtensions
{
    public static IEnumerable<IEnumerable<T>> Batch<T>(this IEnumerable<T> source, int size)
    {
        if (source is null) throw new ArgumentNullException(nameof(source));
        if (size <= 0) throw new ArgumentOutOfRangeException(nameof(size));
        var chunk = new List<T>(size);
        foreach (var item in source)
        {
            chunk.Add(item);
            if (chunk.Count == size)
            {
                yield return chunk;
                chunk = new List<T>(size);
            }
        }
        if (chunk.Count > 0) yield return chunk;
    }

    public static IEnumerable<T> WhereIf<T>(this IEnumerable<T> source, bool condition, Func<T, bool> predicate)
        => condition ? source.Where(predicate) : source;
}
```

Guidance:
- Organize per type (StringExtensions, EnumerableExtensions). Keep namespaces stable for discoverability.
- Prefer null-safe implementations. Avoid heavy computations inside frequently called extensions.
- Be mindful of overload resolution: real instance members win over extensions.

## Q85. Delegates — What and When?

- Essentials: Type-safe function pointers; represent method signatures and enable callbacks.
- Use cases: Event handlers, strategy injection, LINQ/lambdas, background work callbacks.
- Example
```csharp
public delegate int Calc(int a,int b);
int Add(int x,int y)=> x+y;
Calc c = Add; int r = c(2,3);
// Prefer built-in Func/Action/Predicate
Func<int,int,int> f = (x,y) => x+y;
```
- Best practices: Prefer `Func<>`/`Action<>` over custom delegates unless naming improves clarity.
- Pitfalls: Captured variables (closures), lifetime issues in async contexts.
- MCQ: Delegate is … A) class B) interface C) type-safe function pointer (class). Answer: C (delegate type).
- Scenario: Strategy delegate to plug scoring logic in a rules engine.

## Q86. Multicast Delegates

- Essentials: Delegates combine invocation lists with `+` or `+=`; used by events to notify multiple subscribers.

```csharp
// Basic multicast
Action notify = () => Console.WriteLine("A");
notify += () => Console.WriteLine("B");
notify(); // prints A then B
```

### Safe Per‑Subscriber Invocation
```csharp

### Multicast Error Handling Patterns
- Snapshot + try/catch per handler
- Logging or metrics per subscriber to isolate noisy handlers
- Optional parallel invocation for independent handlers (be mindful of thread-safety)
```csharp
var handlers = notify.GetInvocationList().Cast<Action>().ToArray();
Parallel.ForEach(handlers, h =>
{
    try { h(); }
    catch (Exception ex) { Console.Error.WriteLine(ex); }
});
```

foreach (var d in notify.GetInvocationList())
{
    try { ((Action)d)(); }
    catch (Exception ex) { Console.Error.WriteLine(ex); }
}
```
- Prevents one failing handler from aborting the rest.

### Loop Capture Gotcha (and Fix)
```csharp
var actions = new List<Action>();
for (int i = 0; i < 3; i++)
{
    int copy = i;               // FIX: capture a local copy per iteration
    actions.Add(() => Console.WriteLine(copy));
}
foreach (var a in actions) a(); // prints 0,1,2 (not 2,2,2)
```

- Return values: For `Func<T>`, only last subscriber’s return value is returned; not ideal for aggregation.
- Best practices: Use `Action` for one-way notifications; avoid relying on return values.
- Pitfalls: Exceptions from subscribers can stop chain; wrap invocation or iterate `GetInvocationList()`.
- MCQ: Multicast returns … A) first B) last C) sum. Answer: B (last result for `Func<>`).
- Scenario: Log-and-audit hooks combined into one multicast delegate.

### Aggregating Results Safely
If you need to aggregate results from multiple handlers, avoid relying on `Func<T>` return (last one wins). Instead, iterate handlers and collect results:
```csharp
var results = new List<bool>();
foreach (var d in notifyBool.GetInvocationList())
{
    var func = (Func<bool>)d;
    results.Add(func());
}
bool allOk = results.All(x => x);
```


## Q87. Anonymous Delegates


### Delegates vs Func/Action
- `delegate` declarations create new types; `Func<>`/`Action<>` are generic delegate types built into BCL.
- Prefer `Func<>`/`Action<>` for simplicity unless a named delegate expresses domain intent (e.g., `PriceCalculator`).
```csharp
public delegate decimal PriceCalculator(decimal amount);
PriceCalculator calc = a => a * 1.18m; // domain-friendly
Func<decimal, decimal> calc2 = a => a * 1.18m; // generic form
```


### Captured Variables & Async
- Captured variables live on the heap; be mindful in long-lived async callbacks.
- Prefer local copies for loop indices; cancel tokens to manage lifetime.
```csharp
var cts = new CancellationTokenSource();
for (int i = 0; i < 3; i++)
{
    int copy = i;
    _ = Task.Run(async () =>
    {
        await Task.Delay(100, cts.Token);
        Console.WriteLine(copy);
    }, cts.Token);
}
cts.CancelAfter(TimeSpan.FromSeconds(5));
```

- Essentials: Inline delegate creation without a named method. Now superseded by lambdas for most cases.
- Example
```csharp
Func<int,int> square = delegate(int x) { return x*x; };
// preferred
Func<int,int> square2 = x => x*x;
```
- Best practices: Use lambdas for brevity; anonymous delegates still useful when needing parameter attributes.
- Pitfalls: Capturing loop variables incorrectly; use `foreach (var local in list)` pattern.
- MCQ: Anonymous delegates are replaced mainly by … A) events B) lambdas C) tasks. Answer: B.
- Scenario: Quick callback in test setup without creating a named method.


### Thread‑Safe Event Pattern (Snapshot + OnXxx)
```csharp
public class Downloader
{
    public event EventHandler<ProgressEventArgs>? Progress;

    protected virtual void OnProgress(ProgressEventArgs e)
    {
        var handler = Progress; // snapshot to avoid race
        handler?.Invoke(this, e);
    }

    public void Tick() => OnProgress(new ProgressEventArgs(percentage: 50));
}

public sealed record ProgressEventArgs(int Percentage) : EventArgs;
```
- Expose protected virtual `OnXxx` for derived types.
- Snapshot the delegate to avoid null race conditions between check and invoke.

### Subscription Lifetime
- Always unsubscribe (`-=`) or use `IDisposable` wrappers for long‑lived publishers to avoid memory leaks.
- Consider weak events or reactive streams (`IObservable<T>`) when many subscriptions come and go.

## Q88. Events vs Delegates (Differences)

- Delegates: Function types; can be invoked directly and can be multicast.
- Events: Accessor over delegate that restricts invocation to the declaring class; consumers can only `+=`/`-=`.
- Example
```csharp
public class Downloader
{
    public event EventHandler? Progress; // event wraps a delegate
    public void Tick() => Progress?.Invoke(this, EventArgs.Empty);
}
```
- Best practices: Use events for pub-sub; expose `EventHandler/TEventArgs` or typed `EventHandler<T>`.
- Pitfalls: Event leaks (unsubscribed handlers) keep publishers alive; weak events or `using` patterns help.
- MCQ: Who can invoke an event? A) any subscriber B) only declaring class C) anyone with reference. Answer: B.
- Scenario: UI button click uses event to notify multiple subscribers safely.

---

## Practice Scenarios
- Build a small pub-sub with events and show how unsubscribing prevents memory leaks.
- Replace custom delegate types with `Func<>`/`Action<>` and compare readability.

## Takeaways
- Extension methods extend closed types safely.
- Delegates are function types; multicast enables fan-out; events wrap delegates to control invocation.



---

## Understanding Hints (Cheat‑Sheet)

- Mental model: "Delegate = function type; Event = controlled multicast of a delegate; Extension = static sugar that looks like instance method."
- Remember precedence: Instance methods win over extension methods during overload resolution.
- Discoverability tip: Extensions appear when you import their namespace; add `using MyApp.Extensions;` in files that need them.
- Multicast returns: Only the last `Func<...>` return is preserved—iterate `GetInvocationList()` if you need to aggregate results.
- Fault isolation: Wrap each delegate invocation (or use snapshot and iterate) so one bad subscriber doesn’t break others.
- Loop capture: In `for` loops, capture a local copy (`int copy = i;`) before closing over it.
- Events vs delegates: Prefer `event` for public notifications so only the publisher can invoke. Expose `EventHandler`/`EventHandler<T>`.
- Unsubscribe to avoid leaks: Long‑lived publishers + short‑lived subscribers require `-=` (or weak events/IDisposable subscriptions).
- Thread‑safe event raise: Snapshot the event to a local variable before invoking (`var h = Progress; h?.Invoke(...)`).
- Extension method boundaries: Don’t put business logic that needs private state into an extension—you can’t access it.
- Prefer Func/Action: Use built‑ins unless a named delegate improves domain readability (e.g., `PriceCalculator`).
- Async events caution: If handlers are async, consider `Func<object?, TArgs, Task>` or use IAsyncEnumerable/IObserver patterns.
- Testing tip: For events, expose a way to synchronously trigger state changes; assert subscribers were invoked (or verify calls in mocks).
- Performance tip: Keep extension methods small; LINQ‑like extensions chain well but allocate—profile hot paths.
  - Why: Each LINQ operator (e.g., Where/Select) composes an iterator object and often a delegate; closures in lambdas may also allocate. Materializers like ToList/ToArray allocate full buffers. In hot paths, these add up.
  - When it matters: Per‑request code, tight loops, large data scans, or performance‑critical services. Outside hot paths, LINQ readability usually wins.
  - Mitigate: Prefer a single pass; avoid repeated enumeration; cache ToList() if enumerating multiple times; pre‑size lists; consider plain loops; avoid capturing outer variables; profile before/after.
  - Example
    ```csharp
    // LINQ pipeline (allocates iterator objects and delegates)
    int SumEvensLinq(IEnumerable<int> source)
        => source.Where(x => (x & 1) == 0).Select(x => x * 2).Sum();

    // Single-pass loop (often fewer allocations, faster in hot paths)
    int SumEvensLoop(IEnumerable<int> source)
    {
        int sum = 0;
        foreach (var x in source)
        {
            if ((x & 1) != 0) continue;
            sum += x * 2;
        }
        return sum;
    }
    ```
  - Measure: Use BenchmarkDotNet (MemoryDiagnoser) or dotnet‑counters/PerfView to compare time and allocations on real workloads.
- Namespaces: Group extensions by target type (e.g., `StringExtensions`, `EnumerableExtensions`) for clean imports.

what do you mean by allocate-profile hot paths
Short answer
Allocate = create objects on the heap (e.g., LINQ iterators, closures, new arrays/lists), which increases GC work
Hot paths = code that runs very frequently or is latency‑critical (e.g., per request, tight loops, event dispatch)
Profile hot paths = measure where time and allocations really happen, then optimize only those places
So “LINQ‑like extensions chain well but allocate—profile hot paths” means: LINQ/extension chains are great for clarity but do create small objects. Don’t micro‑optimize everywhere; first measure where it matters (hot paths) and reduce allocations only there.

What counts as “allocation” here
LINQ iterators: Where/Select/OrderBy create iterator objects
Lambdas/closures: Capturing outer variables allocates a closure object
Materializers: ToList/ToArray allocate full buffers
Delegates: Multicast lists and delegate instances
Boxing: Converting value types to object/interface
These allocations increase GC pressure and may impact throughput/latency in hot sections.

What’s a “hot path”
Per‑request or per‑message code in services
Tight loops over large collections
Frequently fired events or multicast notifications
Serialization/deserialization and mapping pipelines
Code in the critical 95th/99th percentile latency path
How to profile quickly
Visual Studio (Diagnostics/Profiler): CPU + Allocation
Debug > Performance Profiler > check .NET Object Allocation Tracking + CPU Usage > Start
dotnet-counters (live quick check)
dotnet-counters monitor --process-id
Watch GC Heap Size, Allocation Rate, % Time in GC
dotnet-trace / PerfView (deep dives)
Capture ETW traces and inspect allocation/CPU hotspots
BenchmarkDotNet (micro-bench)
For isolated comparisons (e.g., LINQ chain vs single-pass loop), with MemoryDiagnoser
When to act vs leave it
Act: High allocation rate, frequent Gen 0/1 GCs, noticeable % Time in GC, or hot path shows many small transient objects
Leave it: Cold code or no measurable impact—readability is more valuable
Typical fixes that help
Reduce materialization: Don’t ToList repeatedly; enumerate once; cache results if reused
Single-pass loops: Replace multi-operator pipelines in hot loops with one loop
Pre-size collections: new List(expectedCount)
Avoid capturing: Use static lambdas/local functions to avoid closure objects
Avoid boxing: Use generics over object; prefer struct enumerators where available
Combine filters: Merge adjacent Where into one predicate
Event/delegate paths: Iterate GetInvocationList and reuse delegates where possible