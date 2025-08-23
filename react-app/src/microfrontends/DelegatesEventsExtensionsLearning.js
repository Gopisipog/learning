import React, { useMemo, useState } from 'react';
import './microfrontend.css';

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    points: [
      'Extension methods: static sugar that looks like instance methods (this on first param).',
      'Delegates: type-safe function types; Func/Action are built-in generic delegates.',
      'Multicast delegates: one-to-many invocation; handle errors per-subscriber.',
      'Anonymous delegates/lambdas: inline functions; beware captured variables in loops/async.',
      'Events: controlled multicast—only the publisher can invoke; use EventHandler / EventHandler<T>.'
    ]
  },
  {
    id: 'extensions',
    title: 'Extension Methods',
    code: `public static class StringExtensions\n{\n    public static bool IsNullOrWhite(this string? s) => string.IsNullOrWhiteSpace(s);\n    public static int ToSafeInt(this string? s, int fallback = 0) => int.TryParse(s, out var v) ? v : fallback;\n    public static string Truncate(this string? s, int max)\n        => string.IsNullOrEmpty(s) || s!.Length <= max ? s ?? string.Empty : s.Substring(0, max) + \"...\";\n}\n\npublic static class EnumerableExtensions\n{\n    public static IEnumerable<IEnumerable<T>> Batch<T>(this IEnumerable<T> source, int size) { /*...*/ }\n    public static IEnumerable<T> WhereIf<T>(this IEnumerable<T> source, bool condition, Func<T,bool> pred)\n        => condition ? source.Where(pred) : source;\n}`,
    notes: [
      'Rules: static class + static method; first parameter has this modifier for the target type.',
      'Instance method precedence: real instance methods win over extensions during overload resolution.',
      'Discoverability: consumers must import the namespace where the extension class lives.',
      'Use cases: fluent APIs, helpers for closed types (string, DateTime), custom LINQ-like utilities.'
    ]
  },
  {
    id: 'delegates',
    title: 'Delegates & Func/Action',
    code: `public delegate decimal PriceCalculator(decimal amount);\nPriceCalculator calc = a => a * 1.18m;\nFunc<decimal, decimal> calc2 = a => a * 1.18m;`,
    notes: [
      'Prefer Func/Action for simplicity; use named delegates when domain names add clarity.',
      'Closures: capturing outer variables allocates; consider static lambdas/local functions for hot paths.'
    ]
  },
  {
    id: 'multicast',
    title: 'Multicast Delegates',
    code: `Action notify = () => Console.WriteLine(\"A\");\nnotify += () => Console.WriteLine(\"B\");\n// Safe per-subscriber invocation\nforeach (var d in notify.GetInvocationList())\n{\n    try { ((Action)d)(); }\n    catch (Exception ex) { Console.Error.WriteLine(ex); }\n}`,
    notes: [
      'Aggregation: do not rely on last-return semantics of Func—iterate GetInvocationList and combine results.',
      'Error isolation: wrap each subscriber so one failure does not stop the rest.',
      'Parallelizing handlers is possible but ensure thread-safety.'
    ]
  },
  {
    id: 'anonymous',
    title: 'Anonymous Delegates & Captures',
    code: `var actions = new List<Action>();\nfor (int i = 0; i < 3; i++)\n{\n    int copy = i; // capture fix\n    actions.Add(() => Console.Write(copy));\n}`,
    notes: [
      'Loop-capture fix: copy the loop variable to a local before using in the closure.',
      'Async: manage lifetimes with CancellationToken; beware long-lived captured state.'
    ]
  },
  {
    id: 'events',
    title: 'Events (Thread-safe pattern)',
    code: `public class Downloader\n{\n    public event EventHandler<int>? Progress;\n    protected virtual void OnProgress(int p) { var h = Progress; h?.Invoke(this, p); }\n}`,
    notes: [
      'Only the declaring type can invoke events; subscribers use += / -= only.',
      'Snapshot the event to a local before invoking to avoid race between null-check and call.',
      'Unsubscribe to avoid leaks for long-lived publishers.'
    ]
  },
  {
    id: 'hints',
    title: 'Understanding Hints',
    points: [
      'Instance vs extension precedence: instance wins.',
      'Multicast returns: last Func result wins—aggregate manually if needed.',
      'Profile hot paths before micro-optimizing LINQ and closures.'
    ]
  }
];

const mcqs = [
  {
    q: 'Where must an extension method be defined?',
    choices: ['Any class', 'Static class', 'Instance class'],
    answer: 1,
    explain: 'Extension methods must be static methods inside a static class.'
  },
  {
    q: 'Who can invoke an event?',
    choices: ['Any subscriber', 'Only the declaring class', 'Anyone with a reference'],
    answer: 1,
    explain: 'Events restrict invocation to the declaring class; subscribers can only add/remove handlers.'
  },
  {
    q: 'Multicast Func<T> returns which value?',
    choices: ['First handler', 'Last handler', 'Aggregate of all'],
    answer: 1,
    explain: 'For Func, only the last subscriber return is surfaced; iterate GetInvocationList to aggregate.'
  },
  {
    q: 'How to fix loop variable capture in closures?',
    choices: ['Use dynamic', 'Capture a local copy per iteration', 'Use async/await'],
    answer: 1,
    explain: 'Copy the loop variable to a local variable (e.g., int copy = i) before closing over it.'
  }
];

function CodeBlock({ code }) {
  return (
    <pre className="code"><code>{code}</code></pre>
  );
}

function MCQCard({ item, index, onAnswer, userAnswer }) {
  return (
    <div className="card">
      <div className="card-header">MCQ {index + 1}</div>
      <div className="card-body">
        <p className="question">{item.q}</p>
        <div className="choices">
          {item.choices.map((c, i) => (
            <button
              key={i}
              className={`choice ${userAnswer?.choice === i ? 'selected' : ''}`}
              onClick={() => onAnswer(index, i)}
            >{c}</button>
          ))}
        </div>
        {userAnswer && (
          <div className={`explain ${userAnswer.choice === item.answer ? 'correct' : 'incorrect'}`}>
            {userAnswer.choice === item.answer ? '✅ Correct: ' : '❌ Incorrect: '}
            {item.explain}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DelegatesEventsExtensionsLearning() {
  const [active, setActive] = useState('overview');
  const [answers, setAnswers] = useState({});

  const current = useMemo(() => sections.find(s => s.id === active), [active]);

  const onAnswer = (idx, choice) => {
    setAnswers(prev => ({ ...prev, [idx]: { choice } }));
  };

  return (
    <div className="microfrontend-container">
      <header className="mf-header">
        <h1>Delegates, Events & Extension Methods (Q84–Q88)</h1>
        <p className="subtitle">Learn the core concepts with examples, hints, and MCQs.</p>
      </header>

      <nav className="tab-nav">
        {sections.map(s => (
          <button
            key={s.id}
            className={`tab ${active === s.id ? 'active' : ''}`}
            onClick={() => setActive(s.id)}
          >{s.title}</button>
        ))}
      </nav>

      <main className="mf-content">
        {current?.points && (
          <ul className="bullets">
            {current.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        )}
        {current?.notes && (
          <ul className="bullets">
            {current.notes.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        )}
        {current?.code && <CodeBlock code={current.code} />}

        {active === 'overview' && (
          <section className="mcq-grid">
            {mcqs.map((m, idx) => (
              <MCQCard
                key={idx}
                item={m}
                index={idx}
                onAnswer={onAnswer}
                userAnswer={answers[idx]}
              />
            ))}
          </section>
        )}

        <footer className="mf-footer">
          <div className="hint">Tip: Open the runnable sample at KnowledgeGraphExtractor/samples/q84-88-sample to see these concepts in action.</div>
        </footer>
      </main>
    </div>
  );
}

