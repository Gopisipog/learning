# Q74 — What is a Destructor? (C#/.NET Finalizer)

This module turns Q74 from your 500q set ("What is Destructor?") into an interview‑ready, educational reference with explanations, best practices, examples, MCQs, and scenarios.

---

## TL;DR
- In C#, a "destructor" is actually a **finalizer**: `~ClassName() { ... }`
- It is called by the **GC** (garbage collector), not by your code, and runs on a special finalizer thread.
- Use it only as a last‑resort safeguard to release **unmanaged resources** (file handles, OS handles) when `Dispose` wasn’t called.
- Prefer the **IDisposable/Dispose pattern** and **SafeHandle**; avoid finalizers unless absolutely necessary.
- Finalizers are non‑deterministic (you can’t know when they run) and add performance overhead.

---

## Key Facts
- Only for **classes** (not structs). Syntax: `~ClassName()` (no parameters, no access modifiers, no overloading).
- Compiles to `protected override void Finalize()` and auto‑calls `base.Finalize()`.
- The **GC enqueues** objects with finalizers into a finalization queue; a dedicated thread later invokes them.
- Not guaranteed to run on abrupt termination (e.g., `Environment.FailFast`, process kill).
- Use `GC.SuppressFinalize(this)` inside `Dispose()` when you’ve already cleaned up to remove the object from the finalization queue.
- Prefer **SafeHandle** (which already has its own finalizer), so your class often doesn’t need one.

---

## C# Syntax (Finalizer)
```csharp
class NativeResourceHolder
{
    // Finalizer: avoid unless you really own unmanaged resources
    ~NativeResourceHolder()
    {
        // Release unmanaged resources as a last resort
        // DO NOT reference other managed objects here—they may already be collected
    }
}
```

---

## The Dispose Pattern (Recommended)
When your class owns resources, implement `IDisposable`. If you own **only managed** resources, you typically do NOT add a finalizer.

```csharp
public sealed class ImageProcessor : IDisposable
{
    private bool _disposed;
    private readonly FileStream _stream; // managed resource (it itself implements IDisposable)

    public ImageProcessor(string path)
    {
        _stream = new FileStream(path, FileMode.Open, FileAccess.Read);
    }

    // Public Dispose for callers (deterministic cleanup)
    public void Dispose()
    {
        if (_disposed) return;
        _stream?.Dispose(); // dispose managed resources
        _disposed = true;
        // No finalizer, so no need to SuppressFinalize
    }
}
```

### Dispose Pattern (With Finalizer) — only if unmanaged resources are directly owned
```csharp
public class UnmanagedBufferOwner : IDisposable
{
    private bool _disposed;
    private IntPtr _nativePtr; // imagine you received this from native code

    public UnmanagedBufferOwner(IntPtr nativePtr)
    {
        _nativePtr = nativePtr;
    }

    ~UnmanagedBufferOwner() // finalizer (last resort)
    {
        Dispose(false);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this); // remove from finalization queue
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;

        // Free unmanaged memory regardless of 'disposing'
        if (_nativePtr != IntPtr.Zero)
        {
            FreeNative(_nativePtr); // P/Invoke to release
            _nativePtr = IntPtr.Zero;
        }

        // If disposing == true, free other managed IDisposable fields here
        // (Not shown: they may have already been collected if called from finalizer)

        _disposed = true;
    }

    [System.Runtime.InteropServices.DllImport("NativeLib")]
    private static extern void FreeNative(IntPtr p);
}
```

### Prefer SafeHandle Instead of Finalizer
```csharp
using Microsoft.Win32.SafeHandles;
using System.Runtime.InteropServices;

public sealed class SafeHandleOwner : IDisposable
{
    private readonly SafeFileHandle _handle; // SafeHandle already has its own finalizer

    public SafeHandleOwner(string path)
    {
        // Example: open a handle via P/Invoke, then wrap it in a SafeHandle
        IntPtr raw = OpenHandle(path);
        _handle = new SafeFileHandle(raw, ownsHandle: true);
    }

    public void Dispose()
    {
        _handle?.Dispose(); // deterministic release; no class finalizer needed
    }

    [DllImport("SomeNative.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern IntPtr OpenHandle(string path);
}
```

---

## How Finalization Works (Lifecycle)
1. Object with finalizer becomes unreachable.
2. GC moves it to the **finalization queue** instead of reclaiming immediately.
3. Finalizer thread eventually runs `~ClassName()`.
4. Object becomes reachable again only during finalization; after that, it’s eligible for collection in a later GC.

Implication: Finalizable objects survive at least **two** GC cycles, which can add memory pressure (performance cost).

---

## C# vs C++
- C++ destructors run **deterministically** at scope exit; C# finalizers are **non‑deterministic** and GC‑driven.
- In C#, use `using`/`await using` and `IDisposable/IAsyncDisposable` rather than relying on finalizers.

---

## Do / Don’t Checklist
**Do**
- Implement `IDisposable` for deterministic cleanup
- Use `using` / `await using`
- Wrap native handles in **SafeHandle**
- Call `GC.SuppressFinalize(this)` inside `Dispose()` if you have a finalizer
- Keep finalizer minimal; only release unmanaged resources

**Don’t**
- Don’t access other managed objects in a finalizer
- Don’t add finalizers for classes that only hold managed resources
- Don’t assume finalizers always run (crashes, abrupt termination)
- Don’t perform blocking or long operations in finalizers

---

## Common Interview Follow‑ups
- When do you use a finalizer vs `IDisposable`?
- Why is finalization non‑deterministic?
- How do `SafeHandle`, `Dispose`, and finalizers relate?
- What does `GC.SuppressFinalize` do and when do you call it?
- Can structs have destructors in C#? (No — only classes)

---

## Mini MCQs
1) Which is true about C# destructors?
- A. They can have parameters
- B. They are called deterministically
- C. They compile to `Finalize` and are GC‑invoked
- D. They can be overloaded

Answer: **C**

2) What should you prefer for releasing resources?
- A. Finalizers only
- B. `IDisposable`/`Dispose` (and `using`) with SafeHandle when needed
- C. Manual GC invocation

Answer: **B**

3) What does `GC.SuppressFinalize(this)` do?
- A. Forces finalizer to run now
- B. Removes the object from the finalization queue if already disposed
- C. Deletes the object immediately

Answer: **B**

4) Finalizers…
- A. May not run on process crash or `Environment.FailFast`
- B. Are guaranteed before app exit
- C. Can reference any managed object safely

Answer: **A**

---

## Scenario Prompts
- You built a class that P/Invokes to allocate a native buffer. Show the correct `IDisposable` pattern and explain whether you need a finalizer.
- You use `FileStream` and `SqlConnection` in a service. How should you structure your code to ensure deterministic cleanup without finalizers?
- Production shows rising Gen2 GCs and memory. You discover many finalizable objects—what’s the impact and how do you fix it?

---

## Quick Pseudocode Cheat‑Sheet
```pseudo
class MaybeFinalizable:
  method Dispose():
    if alreadyDisposed: return
    release managed resources
    if class has finalizer:
      GC.SuppressFinalize(this)
    mark disposed

  finalizer ~MaybeFinalizable():
    // last resort
    release unmanaged resources only
```

---

## Takeaways
- In C#, "destructor" means **finalizer**—a non‑deterministic GC callback.
- Prefer `IDisposable` + `using` for deterministic cleanup; use finalizers only as a safety net for unmanaged resources.
- Embrace **SafeHandle** to avoid writing your own finalizers in most cases.

