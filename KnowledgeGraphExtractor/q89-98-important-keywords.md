# Q89–Q98: Important C# Keywords & Operators

Full modules with definitions, use cases, examples, pitfalls, MCQs, and scenarios.

---

## Q89. `this` keyword — What/When
- Refers to the current instance inside instance members. Disambiguates parameter vs field; passes current instance into other methods.
```csharp
public class Cart
{
    private readonly List<string> _items = new();
    public void Add(string item) => this._items.Add(item); // 'this' optional here
}
```
- Pitfalls: Using `this` in constructors to call other overloads can hide logic complexity.
- MCQ: `this` is valid in static methods? A) Yes B) No — Answer: B.

## Q90. `using` keyword (two meanings)
1) Namespace import: `using System.Text;`
2) Disposal scope: ensures `IDisposable.Dispose()` runs at scope exit.
```csharp
using var conn = new SqlConnection(cs); // C# 8 using declaration
await using var stream = File.OpenRead(path); // IAsyncDisposable
```
- Best practices: Always dispose `IDisposable` types; prefer `using`/`await using`.
- Pitfalls: Multiple disposals; ensure lifetime management in DI containers.
- MCQ: `using` ensures … A) compile-time import only B) deterministic disposal — Answer: B (for using statement).

## Q91. Using with other classes beyond DB
- Any `IDisposable`/`IAsyncDisposable` object (streams, HttpClient handlers, timers, etc.).
- Pitfalls: Disposing HttpClient instances frequently; prefer a shared or factory with handler pooling.

## Q92. `is` vs `as`
- `is`: type test (pattern matching)
```csharp
if (obj is string s && s.Length > 0) { /* ... */ }
```
- `as`: safe cast; returns null on failure
```csharp
var s = obj as string;
```
- MCQ: Which throws on invalid cast? A) cast operator `(T)` B) `as` — Answer: A.

## Q93. `readonly` vs `const`
- `const`: compile-time constants, implicit static; type must be primitive or string.
- `readonly`: runtime-assigned (ctor or field init); can be reference types.
```csharp
public class E
{
    public const double Pi = 3.14159;
    public readonly DateTime Created = DateTime.UtcNow;
}
```
- Pitfalls: Changing `const` requires recompilation of callers; prefer `static readonly` for libraries.

## Q94. `static` class — When to use
- Class cannot be instantiated or inherited; contains only static members.
- Use: pure utilities, extensions hosts. Avoid stateful statics.
```csharp
public static class MathEx { public static int Twice(int x) => x*2; }
```

## Q95. `var` vs `dynamic`
- `var`: compile-time typing with inference; type cannot change.
- `dynamic`: runtime binding; bypasses compile-time checks; exceptions at runtime on missing members.
```csharp
var a = 5; // int
dynamic d = "hi"; d = 3; // allowed; late-bound
```
- Best practices: Prefer `var` for readability with obvious types; avoid `dynamic` unless interop/expando needed.

## Q96. `enum` keyword — Use
- Named set of integral constants; default underlying type `int`; can customize.
```csharp
enum Status : byte { New=1, Active=2, Closed=3 }
```
- Flags pattern
```csharp
[Flags]
enum FilePerm { Read=1, Write=2, Exec=4 }
```

## Q97. Enum inheritance?
- Enums cannot inherit; they derive from `System.Enum`. You can specify underlying integral type.
- Pitfalls: Casting invalid values; validate or use `Enum.IsDefined` or switch with default.

## Q98. `yield` keyword — Use
- Produces an iterator as state machine; returns elements lazily.
```csharp
IEnumerable<int> Evens(int max){ for(int i=0;i<=max;i+=2) yield return i; }
foreach(var e in Evens(10)) Console.WriteLine(e);
```
- Best practices: Great for pipelines; keep iterators side-effect free; document deferred exec.
- Pitfalls: Deferred execution surprises; exceptions thrown at enumeration time.

---

## MCQs
1) Which is true? `const` vs `readonly`: A) `readonly` assigned only at runtime — Answer: True.
2) `var` infers: A) runtime B) compile-time — Answer: B.
3) `is` vs `as`: `as` returns null on failure — Answer: True.

## Scenarios
- Replace a `const` in shared lib with `static readonly` to avoid consumer rebuilds.
- Switch a loop-based builder to `yield return` to enable streaming large results.

## Takeaways
- Prefer deterministic and type-safe constructs; use `dynamic` sparingly.
- Understand lifecycle/disposal with `using`; apply pattern matching with `is`.

