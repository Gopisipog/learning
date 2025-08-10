using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// Demonstrates Q84–Q88: Extension Methods, Delegates (single/multicast), Anonymous Delegates/Lambdas, and Events

namespace Q8488Sample
{
    // ------------------------ Q84: Extension Methods ------------------------
    public static class StringExtensions
    {
        public static bool IsNullOrWhite(this string? s) => string.IsNullOrWhiteSpace(s);
        public static int ToSafeInt(this string? s, int fallback = 0) => int.TryParse(s, out var v) ? v : fallback;
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

    // ------------------------ Q85–Q86: Delegates (single/multicast) ------------------------
    public delegate decimal PriceCalculator(decimal amount); // Example of a named delegate type

    public class Notifier
    {
        // Multicast delegate field (for demo; events recommended for public APIs)
        public Action? OnNotify;

        public void NotifyAll()
        {
            // Safe per-subscriber invocation: no single handler can break the chain
            foreach (var d in OnNotify?.GetInvocationList() ?? Array.Empty<Delegate>())
            {
                try { ((Action)d)(); }
                catch (Exception ex) { Console.WriteLine($"Handler error: {ex.Message}"); }
            }
        }
    }

    // ------------------------ Q88: Events (thread-safe pattern) ------------------------
    public class Downloader
    {
        public event EventHandler<int>? Progress; // progress percentage

        public async Task RunAsync(CancellationToken token = default)
        {
            for (int p = 0; p <= 100; p += 25)
            {
                token.ThrowIfCancellationRequested();
                await Task.Delay(50, token);
                OnProgress(p);
            }
        }

        protected virtual void OnProgress(int value)
        {
            // Thread-safe snapshot pattern
            var handler = Progress;
            handler?.Invoke(this, value);
        }
    }

    internal class Program
    {
        static async Task Main()
        {
            Console.WriteLine("=== Q84: Extension Methods ===");
            string? s = "  ";
            Console.WriteLine($"IsNullOrWhite: {s.IsNullOrWhite()}");
            Console.WriteLine($"ToSafeInt('123a', fallback=0): {"123a".ToSafeInt(0)}");
            Console.WriteLine($"Truncate: {"This is a long sentence".Truncate(10)}");

            var items = Enumerable.Range(1, 10);
            Console.WriteLine("Batch size 4:");
            foreach (var batch in items.Batch(4)) Console.WriteLine(string.Join(", ", batch));
            Console.WriteLine("WhereIf (even numbers only):");
            foreach (var n in items.WhereIf(true, x => x % 2 == 0)) Console.WriteLine(n);

            Console.WriteLine("\n=== Q85: Delegates & Func/Action ===");
            PriceCalculator calc = a => a * 1.18m; // named delegate
            Func<decimal, decimal> calc2 = a => a * 1.18m; // generic delegate
            Console.WriteLine($"Price via delegate: {calc(100)}; via Func: {calc2(100)}");

            Console.WriteLine("\n=== Q86: Multicast Delegates ===");
            var notifier = new Notifier();
            notifier.OnNotify += () => Console.WriteLine("A");
            notifier.OnNotify += () => Console.WriteLine("B");
            notifier.OnNotify += () => throw new InvalidOperationException("demo");
            notifier.OnNotify += () => Console.WriteLine("C");
            notifier.NotifyAll(); // expects A, B, error, C

            // Aggregating results from multiple handlers
            Func<bool>? notifyBool = null;
            notifyBool += () => true;
            notifyBool += () => false;
            var results = new List<bool>();
            foreach (var d in notifyBool.GetInvocationList()) results.Add(((Func<bool>)d)());
            Console.WriteLine($"All OK? {results.All(x => x)}");

            Console.WriteLine("\n=== Q87: Anonymous Delegates & Captures ===");
            var actions = new List<Action>();
            for (int i = 0; i < 3; i++)
            {
                int copy = i; // important capture fix
                actions.Add(() => Console.Write(copy));
            }
            Console.WriteLine();
            actions.ForEach(a => a()); // prints 0 1 2

            Console.WriteLine("\nCaptured variables with async:");
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
            var tasks = new List<Task>();
            for (int i = 0; i < 3; i++)
            {
                int copy = i;
                tasks.Add(Task.Run(async () =>
                {
                    await Task.Delay(50, cts.Token);
                    Console.Write(copy);
                }, cts.Token));
            }
            await Task.WhenAll(tasks);
            Console.WriteLine();

            Console.WriteLine("\n=== Q88: Events (thread-safe raising) ===");
            var dl = new Downloader();
            dl.Progress += (sender, p) => Console.WriteLine($"Progress: {p}%");
            await dl.RunAsync();

            Console.WriteLine("\nDone.");
        }
    }
}

