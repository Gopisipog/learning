# Q75–Q83: Constructors, Object Creation, and Method Parameters (C#)

This module converts Q75–Q83 from your 500q set into full learning units with definitions, examples, best practices, pitfalls, MCQs, and scenarios.

---

## Q75. Can you create object of class with private constructor in C#?

- Essentials: A private constructor prevents external instantiation. You cannot create an instance using `new` outside the class. Common uses: Singleton, static factory, utility classes, enforcing factories.
- Example
```csharp
public sealed class AppConfig
{
    private static readonly AppConfig _instance = new AppConfig();
    public static AppConfig Instance => _instance;
    public string Name { get; } = "Prod";
    private AppConfig() { } // prevents external new
}
// Usage: var x = AppConfig.Instance; // OK; new AppConfig() // compile error
```
- Best practices: Pair with a public static accessor (Singleton) or static Create methods. Keep thread-safety in mind.
- Pitfalls: Hard to unit test if you hide all constructors; consider dependency injection and factories.
- MCQ: Private ctor allows instantiation … A) from anywhere B) only via class members C) via reflection only. Answer: B (reflection possible but not typical).
- Scenario: Enforce only one instance and preload configuration at startup.

## Q76. Constructor order: base vs derived

- Essentials: When creating a derived object, base constructors run first (top-down), then derived.
- Example
```csharp
class Base { public Base(){ Console.Write("B"); } }
class Child : Base { public Child(){ Console.Write("C"); } }
// new Child() prints "BC"
```
- Best practices: Initialize base state in base; avoid calling virtual methods from ctors.
- Pitfalls: Side-effects in base ctor may depend on uninitialized derived state.
- MCQ: Order is … A) Derived then Base B) Base then Derived C) Random. Answer: B.
- Scenario: Ensure required base resources are ready before child logic executes.

## Q77. What is a Method in C#?

- Essentials: A named block of code that can be invoked, with a signature (name + parameter types). Supports return values, parameters, access modifiers, static/instance.
- Example
```csharp
public int Add(int a, int b) => a + b;
```
- Best practices: Small, single-responsibility; meaningful names; prefer expression-bodied for trivial logic.
- Pitfalls: Large parameter lists—use parameter objects.
- MCQ: Signature includes … A) name + param types B) return type C) body only. Answer: A.
- Scenario: Extract method for repeated calculation to reduce duplication.

## Q78. Pass by Value vs Pass by Reference

- Essentials: By default, parameters are passed by value (copy of reference or value). `ref` passes by reference (must be initialized), allowing callee to modify caller variable.
- Example
```csharp
void IncVal(int x){ x++; } // no effect
void IncRef(ref int x){ x++; }
int a=1; IncVal(a); // a==1; IncRef(ref a); // a==2
```
- Best practices: Prefer value unless mutation is needed. Consider returning a new value instead of `ref`.
- Pitfalls: Misunderstanding reference-type by-value (copy of reference) vs actual by-reference (`ref`).
- MCQ: `ref` requires … A) initialization B) none C) optional. Answer: A.
- Scenario: Performance-sensitive method updates a struct counter via `ref` to avoid copy.

## Q79. Return more than one value

- Essentials: Use tuples, `out` parameters, custom DTOs/records.
- Example (tuple & out)
```csharp
public (int sum,int diff) Calc(int x,int y)=> (x+y, x-y);
public bool TryParseInt(string s, out int value) => int.TryParse(s, out value);
```
- Best practices: Prefer descriptive records for public APIs; use `Try*` pattern with `out` for parsing.
- Pitfalls: Overusing multiple outs reduces readability.
- MCQ: Best for public API: A) many `out`s B) tuple with named elements C) DTO/record. Answer: C.
- Scenario: Return both result and diagnostics using a record: `record Result<T>(T Value, string[] Warnings)`.

## Q80. `out` vs `ref`

- Essentials: `out` lets callee assign before use; caller need not initialize. `ref` requires caller init and allows read/write by callee.
- Example
```csharp
bool TryDivide(int a,int b, out double q){ if(b==0){ q=0; return false;} q=(double)a/b; return true; }
```
- Best practices: `Try*` methods use `out`; use `ref` only when mutation semantics are required.
- Pitfalls: Overusing can complicate code; prefer return objects for complex outputs.
- MCQ: Which requires initialization by caller? A) out B) ref. Answer: B.
- Scenario: Parsing configs where failure should not throw—use `Try*` with `out`.

## Q81. `params` keyword

- Essentials: Allows variable number of arguments (must be last parameter, single array type).
- Example
```csharp
int Sum(params int[] xs) => xs.Sum();
Sum(1,2,3); Sum(new[]{4,5});
```
- Best practices: Keep overloads minimal; avoid ambiguity with collections.
- Pitfalls: Boxing with `params object[]`; performance sensitive loops.
- MCQ: How many `params` per method? A) many B) one C) none. Answer: B (one and last).
- Scenario: Logging helper accepting arbitrary values.

## Q82. Optional parameters

- Essentials: Parameters with default values at compile-time.
- Example
```csharp
void Notify(string msg, bool urgent=false){ /*...*/ }
Notify("Hi"); // urgent=false
```
- Best practices: Prefer overloads in public libraries if versioning/CLS compliance matters; optional params are baked at call sites.
- Pitfalls: Changing default later may not affect already-compiled callers.
- MCQ: Defaults are … A) runtime B) compile-time. Answer: B.
- Scenario: API with evolving feature flags—prefer overloads for binary compatibility.

## Q83. Named parameters

- Essentials: Callers specify `name: value` to improve readability and skip some optional parameters.
- Example
```csharp
void PlaceOrder(string sku,int qty,bool gift=false,string note=""){}
PlaceOrder(sku:"A-42", qty:3, note:"wrap");
```
- Best practices: Preserve parameter order for readability; use names in tests for clarity.
- Pitfalls: Reordering parameters may break callers relying on position.
- MCQ: Named args allow skipping … A) required B) optional C) first param only. Answer: B.
- Scenario: Many-parameter methods become clearer by naming args in call sites.

---

## Practice Scenarios
- Refactor a utility with many overloads into one method using `params` and named/optional parameters where appropriate.
- Convert a tuple-returning method into a record type for a public API and justify the change.

## Takeaways
- Prefer deterministic, readable signatures: use `out`/`ref` sparingly.
- Optional/named/params improve ergonomics but watch versioning and performance.
- Private constructors enforce creation patterns; DI/factories keep testability high.

