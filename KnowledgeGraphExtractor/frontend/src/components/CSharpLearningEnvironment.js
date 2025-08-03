import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Code, 
  Play, 
  CheckCircle, 
  Circle, 
  Star, 
  Target, 
  Layers, 
  Zap, 
  Search, 
  Filter, 
  Eye,
  Brain,
  Award,
  TrendingUp,
  Users,
  Settings,
  ArrowLeft,
  ArrowRight,
  Copy,
  Download,
  Bookmark,
  Hash,
  FileText,
  Terminal,
  Lightbulb,
  Puzzle,
  Trophy,
  Medal,
  Crown,
  Flame,
  RotateCcw
} from 'lucide-react';
import './CSharpLearningEnvironment.css';

const CSharpLearningEnvironment = () => {
  const [activeTab, setActiveTab] = useState('explorer');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [bookmarkedTopics, setBookmarkedTopics] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [theme, setTheme] = useState('csharp-classic');
  const [studyMode, setStudyMode] = useState(false);
  const [progress, setProgress] = useState({});

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('csharp-learning-progress');
    const savedCompleted = localStorage.getItem('csharp-completed-topics');
    const savedBookmarks = localStorage.getItem('csharp-bookmarked-topics');
    
    if (savedProgress) setProgress(JSON.parse(savedProgress));
    if (savedCompleted) setCompletedTopics(new Set(JSON.parse(savedCompleted)));
    if (savedBookmarks) setBookmarkedTopics(new Set(JSON.parse(savedBookmarks)));
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('csharp-learning-progress', JSON.stringify(progress));
    localStorage.setItem('csharp-completed-topics', JSON.stringify([...completedTopics]));
    localStorage.setItem('csharp-bookmarked-topics', JSON.stringify([...bookmarkedTopics]));
  }, [progress, completedTopics, bookmarkedTopics]);

  const csharpTopics = {
    fundamentals: [
      {
        id: 'comments',
        title: 'Comments',
        description: 'Single-line, multi-line, and XML documentation comments',
        difficulty: 'Beginner',
        category: 'fundamentals',
        estimatedTime: '15 min',
        keyPoints: [
          'Single-line comments with //',
          'Multi-line comments with /* */',
          'XML documentation with ///',
          'Best practices for code documentation'
        ],
        codeExample: `// Single-line comment

/* Multi-line comment
   spanning multiple lines */

/// <summary>
/// XML documentation comment for generating docs
/// </summary>
/// <param name="value">The input value</param>
/// <returns>The processed result</returns>
public string ProcessValue(string value)
{
    return value.ToUpper();
}`,
        practiceExercises: [
          'Add appropriate comments to a given code snippet',
          'Write XML documentation for a method',
          'Identify and fix poorly commented code'
        ]
      },
      {
        id: 'strings',
        title: 'Strings',
        description: 'String manipulation, interpolation, and modern string features',
        difficulty: 'Beginner',
        category: 'fundamentals',
        estimatedTime: '25 min',
        keyPoints: [
          'String interpolation with $""',
          'Verbatim strings with @""',
          'Raw string literals (C# 11+)',
          'Common string methods and operations'
        ],
        codeExample: `// String interpolation
string name = "Alice";
int age = 30;
string message = $"Hello, {name}! You are {age} years old.";

// Verbatim strings
string path = @"C:\Users\UserName\Documents";

// Raw string literals (C# 11+)
string json = """
{
    "name": "John Doe",
    "age": 30,
    "isActive": true
}
""";

// Common string operations
string text = "Hello, World!";
bool contains = text.Contains("World");
string upper = text.ToUpper();
string[] parts = text.Split(',');`,
        practiceExercises: [
          'Create a formatted string using interpolation',
          'Parse a JSON-like string using string methods',
          'Build a string manipulation utility class'
        ]
      },
      {
        id: 'basic-types',
        title: 'Basic Types and Literals',
        description: 'Value types, reference types, and type system fundamentals',
        difficulty: 'Beginner',
        category: 'fundamentals',
        estimatedTime: '30 min',
        keyPoints: [
          'Integer types (byte, short, int, long)',
          'Floating-point types (float, double, decimal)',
          'Boolean and character types',
          'DateTime and nullable types'
        ],
        codeExample: `// Integer types
int number = 42;
long bigNumber = 1_000_000L;
byte smallNumber = 255;

// Floating-point types
float precision = 3.14f;
double doublePrecision = 3.14159265359;
decimal highPrecision = 3.14159265359m;

// Boolean and character
bool isTrue = true;
char letter = 'A';

// DateTime and nullable
DateTime now = DateTime.Now;
int? nullableInt = null;

// Type inference
var inferredInt = 42;
var inferredString = "Hello";`,
        practiceExercises: [
          'Choose appropriate data types for different scenarios',
          'Work with nullable types and null-coalescing operators',
          'Convert between different numeric types safely'
        ]
      }
    ],
    controlFlow: [
      {
        id: 'if-else',
        title: 'If-Else Statements',
        description: 'Conditional logic and decision-making constructs',
        difficulty: 'Beginner',
        category: 'controlFlow',
        estimatedTime: '20 min',
        keyPoints: [
          'Basic if-else syntax',
          'Conditional (ternary) operator',
          'Null-conditional operators',
          'Pattern matching in conditions'
        ],
        codeExample: `// Basic if-else
if (temperature > 30)
{
    Console.WriteLine("It's hot!");
}
else if (temperature > 20)
{
    Console.WriteLine("It's warm");
}
else
{
    Console.WriteLine("It's cool");
}

// Ternary operator
string message = age >= 18 ? "Adult" : "Minor";

// Null-conditional operator
int? length = customer?.Name?.Length;

// Null-coalescing assignment (C# 8+)
userName ??= "Anonymous";`,
        practiceExercises: [
          'Create a grade calculator using if-else statements',
          'Implement input validation with null checks',
          'Build a simple decision tree for user choices'
        ]
      },
      {
        id: 'switch',
        title: 'Switch Statements and Expressions',
        description: 'Modern switch syntax and pattern matching',
        difficulty: 'Intermediate',
        category: 'controlFlow',
        estimatedTime: '25 min',
        keyPoints: [
          'Traditional switch statements',
          'Switch expressions (C# 8+)',
          'Pattern matching in switch',
          'When clauses and guards'
        ],
        codeExample: `// Traditional switch
switch (dayOfWeek)
{
    case DayOfWeek.Monday:
        Console.WriteLine("Start of work week");
        break;
    case DayOfWeek.Friday:
        Console.WriteLine("TGIF!");
        break;
    default:
        Console.WriteLine("Regular day");
        break;
}

// Switch expression (C# 8+)
string GetDayType(DayOfWeek day) => day switch
{
    DayOfWeek.Monday => "Start of work week",
    DayOfWeek.Friday => "End of work week",
    DayOfWeek.Saturday or DayOfWeek.Sunday => "Weekend",
    _ => "Midweek"
};

// Pattern matching with when
string GetShapeDescription(object shape) => shape switch
{
    Circle c when c.Radius > 10 => "Large circle",
    Circle _ => "Small circle",
    Rectangle { Width: 0 } => "Line",
    null => "No shape",
    _ => "Unknown shape"
};`,
        practiceExercises: [
          'Convert if-else chains to switch expressions',
          'Implement a calculator using switch expressions',
          'Create pattern matching for different object types'
        ]
      }
    ],
    methods: [
      {
        id: 'basic-methods',
        title: 'Methods and Functions',
        description: 'Method syntax, parameters, return values, and overloading',
        difficulty: 'Beginner',
        category: 'methods',
        estimatedTime: '30 min',
        keyPoints: [
          'Method declaration and syntax',
          'Parameters and return types',
          'Method overloading',
          'Static vs instance methods'
        ],
        codeExample: `// Basic method syntax
public int Add(int a, int b)
{
    return a + b;
}

// Static method
public static double CalculateArea(double radius)
{
    return Math.PI * radius * radius;
}

// Method overloading
public void Display(int value)
{
    Console.WriteLine($"Integer: {value}");
}

public void Display(string value)
{
    Console.WriteLine($"String: {value}");
}

// Optional parameters
public void Greet(string name, string greeting = "Hello")
{
    Console.WriteLine($"{greeting}, {name}!");
}

// Expression-bodied methods (C# 6+)
public int Multiply(int a, int b) => a * b;`,
        practiceExercises: [
          'Create a calculator class with basic arithmetic methods',
          'Implement method overloading for different data types',
          'Build a utility class with static helper methods'
        ]
      },
      {
        id: 'lambda-expressions',
        title: 'Lambda Expressions',
        description: 'Anonymous functions, delegates, and functional programming',
        difficulty: 'Intermediate',
        category: 'methods',
        estimatedTime: '25 min',
        keyPoints: [
          'Lambda syntax and structure',
          'Func and Action delegates',
          'Expression vs statement lambdas',
          'Closures and captured variables'
        ],
        codeExample: `// Func delegate (returns a value)
Func<int, int, int> add = (a, b) => a + b;
int sum = add(2, 3); // 5

// Action delegate (returns void)
Action<string> print = message => Console.WriteLine(message);
print("Hello Lambda!");

// Predicate delegate (returns bool)
Predicate<int> isEven = number => number % 2 == 0;
bool result = isEven(4); // true

// Multi-line lambda
Func<int, int> factorial = n =>
{
    int result = 1;
    for (int i = 1; i <= n; i++)
    {
        result *= i;
    }
    return result;
};

// Using with LINQ
var numbers = new[] { 1, 2, 3, 4, 5 };
var evenNumbers = numbers.Where(n => n % 2 == 0);
var doubled = numbers.Select(n => n * 2);`,
        practiceExercises: [
          'Create lambda expressions for common mathematical operations',
          'Use lambdas with LINQ to filter and transform collections',
          'Implement event handlers using lambda expressions'
        ]
      }
    ],
    classes: [
      {
        id: 'class-basics',
        title: 'Classes and Objects',
        description: 'Object-oriented programming fundamentals in C#',
        difficulty: 'Beginner',
        category: 'classes',
        estimatedTime: '35 min',
        keyPoints: [
          'Class declaration and instantiation',
          'Fields, properties, and methods',
          'Constructors and initialization',
          'Access modifiers and encapsulation'
        ],
        codeExample: `// Basic class definition
public class Person
{
    // Fields (private by convention)
    private string name;
    private int age;

    // Properties
    public string Name
    {
        get { return name; }
        set { name = value; }
    }

    // Auto-implemented property
    public int Age { get; set; }

    // Read-only property
    public bool IsAdult => Age >= 18;

    // Constructors
    public Person()
    {
        Name = "Unknown";
        Age = 0;
    }

    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }

    // Methods
    public void Introduce()
    {
        Console.WriteLine($"Hi, I'm {Name} and I'm {Age} years old.");
    }

    // Static members
    public static int MinimumAge { get; } = 0;

    public static bool IsValidAge(int age)
    {
        return age >= MinimumAge;
    }
}

// Usage
Person person = new Person("Alice", 30);
person.Introduce();
bool isAdult = person.IsAdult;`,
        practiceExercises: [
          'Create a BankAccount class with deposit and withdraw methods',
          'Implement a Student class with grades and GPA calculation',
          'Build a Car class with properties and behavior methods'
        ]
      },
      {
        id: 'inheritance',
        title: 'Inheritance and Polymorphism',
        description: 'Class inheritance, method overriding, and polymorphic behavior',
        difficulty: 'Intermediate',
        category: 'classes',
        estimatedTime: '40 min',
        keyPoints: [
          'Base and derived classes',
          'Method overriding with virtual/override',
          'Abstract classes and methods',
          'Polymorphism and type casting'
        ],
        codeExample: `// Base class
public class Animal
{
    public string Name { get; set; }

    public Animal(string name)
    {
        Name = name;
    }

    // Virtual method can be overridden
    public virtual void MakeSound()
    {
        Console.WriteLine("Some generic animal sound");
    }

    // Non-virtual method
    public void Sleep()
    {
        Console.WriteLine($"{Name} is sleeping");
    }
}

// Derived class
public class Dog : Animal
{
    public string Breed { get; set; }

    public Dog(string name, string breed) : base(name)
    {
        Breed = breed;
    }

    // Override base method
    public override void MakeSound()
    {
        Console.WriteLine("Woof!");
    }

    // New method specific to Dog
    public void Fetch()
    {
        Console.WriteLine($"{Name} is fetching the ball");
    }
}

// Abstract class
public abstract class Shape
{
    public abstract double Area { get; }
    public abstract double Perimeter();

    // Concrete method
    public void PrintInfo()
    {
        Console.WriteLine($"Area: {Area}, Perimeter: {Perimeter()}");
    }
}

// Polymorphism example
Animal myPet = new Dog("Fido", "Beagle");
myPet.MakeSound(); // Outputs "Woof!"

// Type checking and casting
if (myPet is Dog dog)
{
    dog.Fetch(); // Access Dog-specific method
}`,
        practiceExercises: [
          'Create a vehicle hierarchy with Car, Truck, and Motorcycle',
          'Implement a shape hierarchy with Circle, Rectangle, and Triangle',
          'Build an employee system with different employee types'
        ]
      }
    ],
    collections: [
      {
        id: 'arrays-lists',
        title: 'Arrays and Lists',
        description: 'Working with collections of data in C#',
        difficulty: 'Beginner',
        category: 'collections',
        estimatedTime: '30 min',
        keyPoints: [
          'Array declaration and initialization',
          'List<T> operations and methods',
          'Collection expressions (C# 12+)',
          'Iterating through collections'
        ],
        codeExample: `// Arrays
int[] numbers = new int[5];                    // Array of 5 integers
int[] initialized = { 1, 2, 3, 4, 5 };        // Initialized array
string[] names = { "Alice", "Bob", "Charlie" };

// Multi-dimensional arrays
int[,] matrix = new int[3, 3];
int[,] initialized2D = {
    { 1, 2, 3 },
    { 4, 5, 6 },
    { 7, 8, 9 }
};

// Lists
List<string> fruits = new List<string>();
fruits.Add("Apple");
fruits.Add("Banana");
fruits.AddRange(new[] { "Orange", "Grape" });

// Collection expressions (C# 12+)
int[] modernArray = [1, 2, 3, 4, 5];
List<string> modernList = ["Apple", "Banana", "Orange"];

// List operations
bool contains = fruits.Contains("Apple");
int index = fruits.IndexOf("Banana");
fruits.Remove("Grape");
fruits.RemoveAt(0);

// Iteration
foreach (string fruit in fruits)
{
    Console.WriteLine(fruit);
}

// LINQ operations
var longNames = fruits.Where(f => f.Length > 5);
var upperCased = fruits.Select(f => f.ToUpper());`,
        practiceExercises: [
          'Create a shopping cart using List<T>',
          'Implement a grade book with arrays and calculations',
          'Build a contact manager with search functionality'
        ]
      },
      {
        id: 'dictionaries-sets',
        title: 'Dictionaries and Sets',
        description: 'Key-value pairs with Dictionary<T,U> and unique collections with HashSet<T>',
        difficulty: 'Intermediate',
        category: 'collections',
        estimatedTime: '35 min',
        keyPoints: [
          'Dictionary<TKey, TValue> operations',
          'HashSet<T> for unique collections',
          'Performance characteristics',
          'Key comparison and equality'
        ],
        codeExample: `// Dictionary operations
Dictionary<string, int> ages = new Dictionary<string, int>
{
    ["Alice"] = 30,
    ["Bob"] = 25,
    ["Charlie"] = 35
};

// Adding and accessing
ages.Add("Diana", 28);
ages["Eve"] = 32; // Indexer syntax

// Safe access
if (ages.TryGetValue("Alice", out int aliceAge))
{
    Console.WriteLine($"Alice is {aliceAge} years old");
}

// Iteration
foreach (var kvp in ages)
{
    Console.WriteLine($"{kvp.Key}: {kvp.Value}");
}

// Keys and Values collections
var names = ages.Keys.ToList();
var ageValues = ages.Values.ToArray();

// HashSet for unique collections
HashSet<string> uniqueNames = new HashSet<string>
{
    "Alice", "Bob", "Charlie", "Alice" // Duplicate ignored
};

// Set operations
HashSet<string> group1 = new HashSet<string> { "Alice", "Bob", "Charlie" };
HashSet<string> group2 = new HashSet<string> { "Bob", "Diana", "Eve" };

var intersection = group1.Intersect(group2); // Bob
var union = group1.Union(group2);           // All unique names
var difference = group1.Except(group2);     // Alice, Charlie

// Custom equality comparer
var caseInsensitiveSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
caseInsensitiveSet.Add("Alice");
bool contains = caseInsensitiveSet.Contains("ALICE"); // true`,
        practiceExercises: [
          'Build a word frequency counter using Dictionary',
          'Implement a student grade tracker with Dictionary<string, List<int>>',
          'Create a unique visitor tracker using HashSet'
        ]
      },
      {
        id: 'advanced-collections',
        title: 'Advanced Collections',
        description: 'Specialized collections: Queue, Stack, LinkedList, and concurrent collections',
        difficulty: 'Advanced',
        category: 'collections',
        estimatedTime: '40 min',
        keyPoints: [
          'Queue<T> and Stack<T> operations',
          'LinkedList<T> for efficient insertion/removal',
          'Concurrent collections for thread safety',
          'Performance trade-offs and use cases'
        ],
        codeExample: `// Queue (FIFO - First In, First Out)
Queue<string> taskQueue = new Queue<string>();
taskQueue.Enqueue("Task 1");
taskQueue.Enqueue("Task 2");
taskQueue.Enqueue("Task 3");

while (taskQueue.Count > 0)
{
    string task = taskQueue.Dequeue();
    Console.WriteLine($"Processing: {task}");
}

// Stack (LIFO - Last In, First Out)
Stack<string> undoStack = new Stack<string>();
undoStack.Push("Action 1");
undoStack.Push("Action 2");
undoStack.Push("Action 3");

// Undo operations
while (undoStack.Count > 0)
{
    string action = undoStack.Pop();
    Console.WriteLine($"Undoing: {action}");
}

// LinkedList for efficient insertion/removal
LinkedList<int> numbers = new LinkedList<int>();
var node1 = numbers.AddFirst(1);
var node2 = numbers.AddAfter(node1, 2);
var node3 = numbers.AddLast(3);

// Insert in middle efficiently
numbers.AddBefore(node3, 2.5);

// Concurrent collections (thread-safe)
using System.Collections.Concurrent;

ConcurrentDictionary<string, int> concurrentDict = new ConcurrentDictionary<string, int>();
concurrentDict.TryAdd("key1", 1);
concurrentDict.AddOrUpdate("key2", 2, (key, oldValue) => oldValue + 1);

ConcurrentQueue<string> concurrentQueue = new ConcurrentQueue<string>();
concurrentQueue.Enqueue("item1");
if (concurrentQueue.TryDequeue(out string item))
{
    Console.WriteLine($"Dequeued: {item}");
}

// SortedDictionary and SortedSet
SortedDictionary<string, int> sortedDict = new SortedDictionary<string, int>
{
    ["Charlie"] = 3,
    ["Alice"] = 1,
    ["Bob"] = 2
}; // Automatically sorted by key

SortedSet<int> sortedNumbers = new SortedSet<int> { 3, 1, 4, 1, 5 };
// Contains: 1, 3, 4, 5 (sorted and unique)`,
        practiceExercises: [
          'Implement a browser history using Stack',
          'Create a print queue system using Queue',
          'Build a music playlist with LinkedList for efficient reordering'
        ]
      }
    ],
    generics: [
      {
        id: 'generic-basics',
        title: 'Generic Fundamentals',
        description: 'Introduction to generic types, methods, and type parameters',
        difficulty: 'Intermediate',
        category: 'generics',
        estimatedTime: '30 min',
        keyPoints: [
          'Generic type parameters and syntax',
          'Type safety and performance benefits',
          'Generic methods and classes',
          'Multiple type parameters'
        ],
        codeExample: `// Generic class with single type parameter
public class Container<T>
{
    private T _value;

    public Container(T value)
    {
        _value = value;
    }

    public T GetValue()
    {
        return _value;
    }

    public void SetValue(T value)
    {
        _value = value;
    }

    public bool IsEmpty()
    {
        return _value == null;
    }
}

// Usage
Container<int> intContainer = new Container<int>(42);
Container<string> stringContainer = new Container<string>("Hello");

// Generic methods
public static T GetDefault<T>()
{
    return default(T);
}

public static void Swap<T>(ref T a, ref T b)
{
    T temp = a;
    a = b;
    b = temp;
}

// Usage of generic methods
int x = 10, y = 20;
Swap(ref x, ref y); // Type inference - no need to specify <int>

string defaultString = GetDefault<string>(); // null
int defaultInt = GetDefault<int>();          // 0

// Multiple type parameters
public class Pair<TFirst, TSecond>
{
    public TFirst First { get; set; }
    public TSecond Second { get; set; }

    public Pair(TFirst first, TSecond second)
    {
        First = first;
        Second = second;
    }

    public override string ToString()
    {
        return $"({First}, {Second})";
    }
}

// Usage
var nameAge = new Pair<string, int>("Alice", 30);
var coordinates = new Pair<double, double>(10.5, 20.3);`,
        practiceExercises: [
          'Create a generic Stack<T> class with Push, Pop, and Peek methods',
          'Implement a generic Repository<T> pattern for data access',
          'Build a generic Result<T> type for error handling'
        ]
      },
      {
        id: 'generic-constraints',
        title: 'Generic Constraints',
        description: 'Constraining generic types with where clauses and type restrictions',
        difficulty: 'Advanced',
        category: 'generics',
        estimatedTime: '35 min',
        keyPoints: [
          'Where clauses and constraint types',
          'Class, struct, and interface constraints',
          'Constructor and reference type constraints',
          'Multiple constraints and inheritance'
        ],
        codeExample: `// Class constraint - T must be a reference type
public class Repository<T> where T : class
{
    private List<T> _items = new List<T>();

    public void Add(T item)
    {
        if (item != null) // Can check for null because T is reference type
        {
            _items.Add(item);
        }
    }
}

// Struct constraint - T must be a value type
public class Calculator<T> where T : struct
{
    public T Add(T a, T b)
    {
        // Can use dynamic for arithmetic operations
        return (T)((dynamic)a + (dynamic)b);
    }
}

// Interface constraint
public interface IComparable<T>
{
    int CompareTo(T other);
}

public class Sorter<T> where T : IComparable<T>
{
    public void Sort(List<T> items)
    {
        items.Sort(); // Can call Sort because T implements IComparable<T>
    }
}

// Constructor constraint - T must have parameterless constructor
public class Factory<T> where T : new()
{
    public T CreateInstance()
    {
        return new T(); // Can call new() because of constraint
    }
}

// Multiple constraints
public class BusinessEntity<T>
    where T : class, IComparable<T>, new()
{
    public T CreateAndCompare(T other)
    {
        T newInstance = new T();           // new() constraint
        int comparison = newInstance.CompareTo(other); // IComparable constraint
        return newInstance;                // class constraint allows null checks
    }
}

// Inheritance constraint
public class Animal { }
public class Dog : Animal { }

public class AnimalShelter<T> where T : Animal
{
    private List<T> _animals = new List<T>();

    public void AddAnimal(T animal)
    {
        _animals.Add(animal);
    }
}

// Usage
AnimalShelter<Dog> dogShelter = new AnimalShelter<Dog>(); // Valid
// AnimalShelter<string> invalidShelter; // Compile error - string is not Animal

// Covariance and Contravariance
public interface ICovariant<out T> // Covariant
{
    T GetValue();
}

public interface IContravariant<in T> // Contravariant
{
    void SetValue(T value);
}

// Example usage
ICovariant<Dog> dogProvider = null;
ICovariant<Animal> animalProvider = dogProvider; // Valid - covariance

IContravariant<Animal> animalConsumer = null;
IContravariant<Dog> dogConsumer = animalConsumer; // Valid - contravariance`,
        practiceExercises: [
          'Create a generic Validator<T> with IValidatable constraint',
          'Implement a generic Cache<T> with class and IDisposable constraints',
          'Build a generic Comparer<T> with IComparable constraint'
        ]
      },
      {
        id: 'generic-collections',
        title: 'Generic Collections Deep Dive',
        description: 'Advanced generic collection patterns and custom implementations',
        difficulty: 'Advanced',
        category: 'generics',
        estimatedTime: '45 min',
        keyPoints: [
          'IEnumerable<T> and ICollection<T> interfaces',
          'Custom generic collection implementations',
          'Yield return with generics',
          'Generic collection performance patterns'
        ],
        codeExample: `// Custom generic collection implementing IEnumerable<T>
public class CircularBuffer<T> : IEnumerable<T>
{
    private readonly T[] _buffer;
    private int _head;
    private int _tail;
    private int _count;

    public CircularBuffer(int capacity)
    {
        _buffer = new T[capacity];
    }

    public int Capacity => _buffer.Length;
    public int Count => _count;
    public bool IsFull => _count == Capacity;
    public bool IsEmpty => _count == 0;

    public void Add(T item)
    {
        _buffer[_tail] = item;
        _tail = (_tail + 1) % Capacity;

        if (IsFull)
        {
            _head = (_head + 1) % Capacity; // Overwrite oldest
        }
        else
        {
            _count++;
        }
    }

    public T GetOldest()
    {
        if (IsEmpty)
            throw new InvalidOperationException("Buffer is empty");

        T item = _buffer[_head];
        _head = (_head + 1) % Capacity;
        _count--;
        return item;
    }

    // IEnumerable<T> implementation
    public IEnumerator<T> GetEnumerator()
    {
        int current = _head;
        for (int i = 0; i < _count; i++)
        {
            yield return _buffer[current];
            current = (current + 1) % Capacity;
        }
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}

// Generic tree structure
public class TreeNode<T>
{
    public T Value { get; set; }
    public List<TreeNode<T>> Children { get; set; }

    public TreeNode(T value)
    {
        Value = value;
        Children = new List<TreeNode<T>>();
    }

    public void AddChild(T value)
    {
        Children.Add(new TreeNode<T>(value));
    }

    // Depth-first traversal using yield
    public IEnumerable<T> DepthFirstTraversal()
    {
        yield return Value;

        foreach (var child in Children)
        {
            foreach (var descendant in child.DepthFirstTraversal())
            {
                yield return descendant;
            }
        }
    }

    // Breadth-first traversal
    public IEnumerable<T> BreadthFirstTraversal()
    {
        var queue = new Queue<TreeNode<T>>();
        queue.Enqueue(this);

        while (queue.Count > 0)
        {
            var current = queue.Dequeue();
            yield return current.Value;

            foreach (var child in current.Children)
            {
                queue.Enqueue(child);
            }
        }
    }
}

// Generic repository pattern with constraints
public interface IEntity
{
    int Id { get; set; }
}

public class GenericRepository<T> where T : class, IEntity, new()
{
    private readonly List<T> _entities = new List<T>();
    private int _nextId = 1;

    public void Add(T entity)
    {
        entity.Id = _nextId++;
        _entities.Add(entity);
    }

    public T GetById(int id)
    {
        return _entities.FirstOrDefault(e => e.Id == id);
    }

    public IEnumerable<T> GetAll()
    {
        return _entities.AsReadOnly();
    }

    public void Update(T entity)
    {
        var existing = GetById(entity.Id);
        if (existing != null)
        {
            var index = _entities.IndexOf(existing);
            _entities[index] = entity;
        }
    }

    public bool Delete(int id)
    {
        var entity = GetById(id);
        return entity != null && _entities.Remove(entity);
    }
}

// Usage examples
var buffer = new CircularBuffer<int>(3);
buffer.Add(1);
buffer.Add(2);
buffer.Add(3);
buffer.Add(4); // Overwrites 1

foreach (int value in buffer)
{
    Console.WriteLine(value); // Prints 2, 3, 4
}

var tree = new TreeNode<string>("Root");
tree.AddChild("Child1");
tree.AddChild("Child2");

foreach (string value in tree.DepthFirstTraversal())
{
    Console.WriteLine(value);
}`,
        practiceExercises: [
          'Implement a generic LRU (Least Recently Used) Cache',
          'Create a generic Binary Search Tree with traversal methods',
          'Build a generic Observer pattern implementation'
        ]
      }
    ],
    loops: [
      {
        id: 'for-loops',
        title: 'For Loops',
        description: 'Iteration with for loops and variations',
        difficulty: 'Beginner',
        category: 'loops',
        estimatedTime: '20 min',
        keyPoints: [
          'Basic for loop syntax',
          'Multiple loop variables',
          'Nested loops',
          'Break and continue statements'
        ],
        codeExample: `// Basic for loop
for (int i = 0; i < 10; i++)
{
    Console.WriteLine($"Iteration {i}");
}

// Multiple variables
for (int i = 0, j = 10; i < j; i++, j--)
{
    Console.WriteLine($"i = {i}, j = {j}");
}

// Nested loops
for (int row = 0; row < 3; row++)
{
    for (int col = 0; col < 3; col++)
    {
        Console.WriteLine($"Position [{row},{col}]");
    }
}

// Break and continue
for (int i = 0; i < 10; i++)
{
    if (i % 2 == 0) continue; // Skip even numbers
    if (i > 7) break;         // Exit when > 7
    Console.WriteLine(i);     // Prints 1, 3, 5, 7
}`,
        practiceExercises: [
          'Create multiplication tables using nested loops',
          'Implement a number guessing game with loops',
          'Build a pattern printer using for loops'
        ]
      },
      {
        id: 'while-loops',
        title: 'While and Do-While Loops',
        description: 'Condition-based iteration with while loops',
        difficulty: 'Beginner',
        category: 'loops',
        estimatedTime: '20 min',
        keyPoints: [
          'While loop syntax and usage',
          'Do-while loop differences',
          'Loop conditions and termination',
          'Infinite loops and prevention'
        ],
        codeExample: `// While loop
int count = 0;
while (count < 5)
{
    Console.WriteLine($"Count: {count}");
    count++;
}

// Do-while loop (executes at least once)
int number;
do
{
    Console.Write("Enter a positive number: ");
    number = int.Parse(Console.ReadLine());
} while (number <= 0);

// Reading until end of input
string line;
while ((line = Console.ReadLine()) != null)
{
    if (line.ToLower() == "quit")
        break;
    Console.WriteLine($"You entered: {line}");
}

// Infinite loop with break condition
while (true)
{
    Console.Write("Enter command (or 'exit'): ");
    string command = Console.ReadLine();

    if (command == "exit")
        break;

    ProcessCommand(command);
}`,
        practiceExercises: [
          'Create a menu-driven program using while loops',
          'Implement input validation with do-while',
          'Build a simple calculator with continuous operation'
        ]
      },
      {
        id: 'foreach-loops',
        title: 'Foreach Loops and Iterators',
        description: 'Iterating over collections with foreach and custom iterators',
        difficulty: 'Intermediate',
        category: 'loops',
        estimatedTime: '25 min',
        keyPoints: [
          'Foreach loop syntax',
          'IEnumerable and IEnumerator interfaces',
          'Yield keyword for custom iterators',
          'Performance considerations'
        ],
        codeExample: `// Basic foreach
string[] names = { "Alice", "Bob", "Charlie" };
foreach (string name in names)
{
    Console.WriteLine($"Hello, {name}!");
}

// Foreach with index (using LINQ)
foreach (var (name, index) in names.Select((n, i) => (n, i)))
{
    Console.WriteLine($"{index}: {name}");
}

// Custom iterator using yield
public static IEnumerable<int> GetEvenNumbers(int max)
{
    for (int i = 0; i <= max; i += 2)
    {
        yield return i;
    }
}

// Usage of custom iterator
foreach (int even in GetEvenNumbers(10))
{
    Console.WriteLine(even); // 0, 2, 4, 6, 8, 10
}

// Fibonacci sequence iterator
public static IEnumerable<int> Fibonacci()
{
    int a = 0, b = 1;
    while (true)
    {
        yield return a;
        (a, b) = (b, a + b);
    }
}

// Take first 10 Fibonacci numbers
foreach (int fib in Fibonacci().Take(10))
{
    Console.WriteLine(fib);
}`,
        practiceExercises: [
          'Create a custom iterator for prime numbers',
          'Implement a range iterator with step values',
          'Build a file processor using foreach'
        ]
      }
    ]
  };

  const themes = {
    'csharp-classic': {
      name: 'C# Classic',
      primary: '#239B56',
      secondary: '#28B463',
      accent: '#58D68D',
      gradient: 'linear-gradient(135deg, #239B56 0%, #28B463 50%, #58D68D 100%)'
    },
    'dotnet-modern': {
      name: '.NET Modern',
      primary: '#512BD4',
      secondary: '#6F42C1',
      accent: '#8E44AD',
      gradient: 'linear-gradient(135deg, #512BD4 0%, #6F42C1 50%, #8E44AD 100%)'
    },
    'visual-studio': {
      name: 'Visual Studio',
      primary: '#0078D4',
      secondary: '#106EBE',
      accent: '#40E0D0',
      gradient: 'linear-gradient(135deg, #0078D4 0%, #106EBE 50%, #40E0D0 100%)'
    },
    'code-dark': {
      name: 'Code Dark',
      primary: '#FF6B35',
      secondary: '#F7931E',
      accent: '#FFD23F',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%)'
    }
  };

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[theme];
    root.style.setProperty('--theme-primary', currentTheme.primary);
    root.style.setProperty('--theme-secondary', currentTheme.secondary);
    root.style.setProperty('--theme-accent', currentTheme.accent);
    root.style.setProperty('--theme-gradient', currentTheme.gradient);
  }, [theme]);

  const toggleCompletion = (topicId) => {
    const newCompleted = new Set(completedTopics);
    if (newCompleted.has(topicId)) {
      newCompleted.delete(topicId);
    } else {
      newCompleted.add(topicId);
    }
    setCompletedTopics(newCompleted);
  };

  const toggleBookmark = (topicId) => {
    const newBookmarks = new Set(bookmarkedTopics);
    if (newBookmarks.has(topicId)) {
      newBookmarks.delete(topicId);
    } else {
      newBookmarks.add(topicId);
    }
    setBookmarkedTopics(newBookmarks);
  };

  const getAllTopics = () => {
    return Object.values(csharpTopics).flat();
  };

  const getFilteredTopics = () => {
    const allTopics = getAllTopics();
    return allTopics.filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           topic.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  return (
    <div className={`csharp-learning-environment ${theme}`}>
      <div className="learning-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <Hash size={32} />
            </div>
            <div>
              <h1>C# Learning Environment</h1>
              <p>Master C# programming with interactive lessons and hands-on practice</p>
            </div>
          </div>
          
          <div className="header-controls">
            <div className="theme-selector">
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="theme-select"
              >
                {Object.entries(themes).map(([key, themeData]) => (
                  <option key={key} value={key}>{themeData.name}</option>
                ))}
              </select>
            </div>
            
            <button 
              className={`study-mode-btn ${studyMode ? 'active' : ''}`}
              onClick={() => setStudyMode(!studyMode)}
            >
              <Brain size={16} />
              Study Mode
            </button>
          </div>
        </div>
        
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
            onClick={() => setActiveTab('explorer')}
          >
            <Search size={16} />
            Topic Explorer
          </button>
          <button 
            className={`tab-btn ${activeTab === 'study' ? 'active' : ''}`}
            onClick={() => setActiveTab('study')}
          >
            <BookOpen size={16} />
            Study Guide
          </button>
          <button 
            className={`tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            <Code size={16} />
            Code Practice
          </button>
          <button 
            className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            <TrendingUp size={16} />
            Progress Tracker
          </button>
        </div>
      </div>

      <div className="learning-content">
        {activeTab === 'explorer' && (
          <div className="topic-explorer">
            <div className="explorer-controls">
              <div className="search-filter-bar">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="filter-dropdown">
                  <Filter size={16} />
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="fundamentals">Fundamentals</option>
                    <option value="controlFlow">Control Flow</option>
                    <option value="loops">Loops</option>
                    <option value="methods">Methods</option>
                    <option value="classes">Classes</option>
                    <option value="collections">Collections</option>
                    <option value="generics">Generics</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="topics-grid">
              {getFilteredTopics().map(topic => (
                <div 
                  key={topic.id} 
                  className={`topic-card ${completedTopics.has(topic.id) ? 'completed' : ''}`}
                  onClick={() => setSelectedTopic(topic)}
                >
                  <div className="topic-header">
                    <div className="topic-title">
                      <h3>{topic.title}</h3>
                      <div className="topic-badges">
                        <span className={`difficulty ${topic.difficulty.toLowerCase()}`}>
                          {topic.difficulty}
                        </span>
                        <span className="estimated-time">
                          <Target size={12} />
                          {topic.estimatedTime}
                        </span>
                      </div>
                    </div>
                    
                    <div className="topic-actions">
                      <button
                        className={`bookmark-btn ${bookmarkedTopics.has(topic.id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(topic.id);
                        }}
                      >
                        <Bookmark size={16} />
                      </button>
                      
                      <button
                        className={`complete-btn ${completedTopics.has(topic.id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompletion(topic.id);
                        }}
                      >
                        {completedTopics.has(topic.id) ? <CheckCircle size={16} /> : <Circle size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <p className="topic-description">{topic.description}</p>
                  
                  <div className="topic-preview">
                    <h4>Key Points:</h4>
                    <ul>
                      {topic.keyPoints.slice(0, 2).map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                      {topic.keyPoints.length > 2 && <li>+ {topic.keyPoints.length - 2} more...</li>}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'study' && (
          <StudyGuide
            topics={getAllTopics()}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            completedTopics={completedTopics}
            toggleCompletion={toggleCompletion}
          />
        )}

        {activeTab === 'practice' && (
          <CodePractice
            topics={getAllTopics()}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressTracker
            topics={getAllTopics()}
            completedTopics={completedTopics}
            bookmarkedTopics={bookmarkedTopics}
          />
        )}
      </div>
    </div>
  );
};

// Study Guide Component
const StudyGuide = ({ topics, selectedTopic, setSelectedTopic, completedTopics, toggleCompletion }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const groupedTopics = {
    fundamentals: topics.filter(t => t.category === 'fundamentals'),
    controlFlow: topics.filter(t => t.category === 'controlFlow'),
    loops: topics.filter(t => t.category === 'loops'),
    methods: topics.filter(t => t.category === 'methods'),
    classes: topics.filter(t => t.category === 'classes'),
    collections: topics.filter(t => t.category === 'collections'),
    generics: topics.filter(t => t.category === 'generics')
  };

  if (!selectedTopic) {
    return (
      <div className="study-guide-overview">
        <div className="study-guide-header">
          <Brain size={48} />
          <div>
            <h2>C# Study Guide</h2>
            <p>Comprehensive learning paths for mastering C# programming</p>
          </div>
        </div>

        <div className="study-categories">
          {Object.entries(groupedTopics).map(([category, categoryTopics]) => (
            <div key={category} className="study-category">
              <div className="category-header">
                <h3>{category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
                <span className="topic-count">{categoryTopics.length} topics</span>
              </div>

              <div className="study-topic-grid">
                {categoryTopics.map(topic => (
                  <div
                    key={topic.id}
                    className={`study-topic-card ${completedTopics.has(topic.id) ? 'completed' : ''}`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="topic-card-header">
                      <h4>{topic.title}</h4>
                      <div className="topic-badges">
                        <span className={`difficulty ${topic.difficulty.toLowerCase()}`}>
                          {topic.difficulty}
                        </span>
                        {completedTopics.has(topic.id) && (
                          <span className="completed-badge">
                            <CheckCircle size={16} /> Completed
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="topic-description">{topic.description}</p>

                    <div className="topic-meta">
                      <div className="estimated-time">
                        <Target size={14} />
                        <strong>Time:</strong> {topic.estimatedTime}
                      </div>
                      <div className="key-points-preview">
                        <strong>Key Points:</strong> {topic.keyPoints.length} concepts
                      </div>
                    </div>

                    <div className="study-actions">
                      <button className="study-btn primary">
                        <BookOpen size={16} /> Start Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="study-stats">
          <div className="stat">
            <span className="stat-number">{topics.length}</span>
            <span className="stat-label">Total Topics</span>
          </div>
          <div className="stat">
            <span className="stat-number">{completedTopics.size}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat">
            <span className="stat-number">{Math.round((completedTopics.size / topics.length) * 100)}%</span>
            <span className="stat-label">Progress</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detailed-study-guide">
      <div className="study-header">
        <div className="topic-info">
          <button
            className="back-to-overview-btn"
            onClick={() => setSelectedTopic(null)}
          >
            <ArrowLeft size={16} /> Back to All Topics
          </button>
          <h2>{selectedTopic.title}</h2>
          <div className="topic-meta-info">
            <span className={`difficulty ${selectedTopic.difficulty.toLowerCase()}`}>
              {selectedTopic.difficulty}
            </span>
            <span className="estimated-time">
              <Target size={14} />
              {selectedTopic.estimatedTime}
            </span>
          </div>
        </div>

        <div className="study-nav">
          <button
            className={`nav-btn ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <Eye size={16} />
            Overview
          </button>
          <button
            className={`nav-btn ${activeSection === 'concepts' ? 'active' : ''}`}
            onClick={() => setActiveSection('concepts')}
          >
            <Lightbulb size={16} />
            Key Concepts
          </button>
          <button
            className={`nav-btn ${activeSection === 'code' ? 'active' : ''}`}
            onClick={() => setActiveSection('code')}
          >
            <Code size={16} />
            Code Examples
          </button>
          <button
            className={`nav-btn ${activeSection === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveSection('practice')}
          >
            <Puzzle size={16} />
            Practice
          </button>
        </div>
      </div>

      <div className="study-content">
        {activeSection === 'overview' && (
          <div className="overview-section">
            <div className="topic-description-card">
              <h3>What You'll Learn</h3>
              <p>{selectedTopic.description}</p>
            </div>

            <div className="learning-objectives">
              <h3>Learning Objectives</h3>
              <ul>
                {selectedTopic.keyPoints.map((point, index) => (
                  <li key={index}>
                    <CheckCircle size={16} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="topic-actions">
              <button
                className={`complete-topic-btn ${completedTopics.has(selectedTopic.id) ? 'completed' : ''}`}
                onClick={() => toggleCompletion(selectedTopic.id)}
              >
                {completedTopics.has(selectedTopic.id) ? (
                  <>
                    <CheckCircle size={16} />
                    Mark as Incomplete
                  </>
                ) : (
                  <>
                    <Circle size={16} />
                    Mark as Complete
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeSection === 'concepts' && (
          <div className="concepts-section">
            <h3>Key Concepts</h3>
            <div className="concepts-grid">
              {selectedTopic.keyPoints.map((concept, index) => (
                <div key={index} className="concept-card">
                  <div className="concept-number">{index + 1}</div>
                  <div className="concept-content">
                    <h4>{concept}</h4>
                    <p>Understanding this concept is essential for mastering {selectedTopic.title.toLowerCase()}.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'code' && (
          <div className="code-section">
            <div className="code-example-card">
              <div className="code-header">
                <h3>Code Example</h3>
                <div className="code-actions">
                  <button className="copy-btn">
                    <Copy size={16} />
                    Copy
                  </button>
                  <button className="run-btn">
                    <Play size={16} />
                    Run
                  </button>
                </div>
              </div>
              <pre className="code-block">
                <code>{selectedTopic.codeExample}</code>
              </pre>
            </div>
          </div>
        )}

        {activeSection === 'practice' && (
          <div className="practice-section">
            <h3>Practice Exercises</h3>
            <div className="exercises-list">
              {selectedTopic.practiceExercises.map((exercise, index) => (
                <div key={index} className="exercise-card">
                  <div className="exercise-header">
                    <h4>Exercise {index + 1}</h4>
                    <span className="exercise-difficulty">Practice</span>
                  </div>
                  <p>{exercise}</p>
                  <div className="exercise-actions">
                    <button className="start-exercise-btn">
                      <Play size={16} />
                      Start Exercise
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Code Practice Component
const CodePractice = ({ topics, selectedTopic, setSelectedTopic }) => {
  const [activeCode, setActiveCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput('Code executed successfully!\nOutput: Hello, C# World!');
      setIsRunning(false);
    }, 1500);
  };

  if (!selectedTopic) {
    return (
      <div className="code-practice-overview">
        <div className="practice-header">
          <Terminal size={48} />
          <div>
            <h2>Code Practice Environment</h2>
            <p>Interactive coding exercises to reinforce your C# learning</p>
          </div>
        </div>

        <div className="practice-categories">
          {topics.map(topic => (
            <div
              key={topic.id}
              className="practice-topic-card"
              onClick={() => setSelectedTopic(topic)}
            >
              <div className="practice-card-header">
                <h3>{topic.title}</h3>
                <span className={`difficulty ${topic.difficulty.toLowerCase()}`}>
                  {topic.difficulty}
                </span>
              </div>
              <p>{topic.description}</p>
              <div className="practice-info">
                <span className="exercise-count">
                  <Puzzle size={14} />
                  {topic.practiceExercises.length} exercises
                </span>
                <span className="estimated-time">
                  <Target size={14} />
                  {topic.estimatedTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="code-practice-environment">
      <div className="practice-header">
        <button
          className="back-to-overview-btn"
          onClick={() => setSelectedTopic(null)}
        >
          <ArrowLeft size={16} /> Back to Practice Topics
        </button>
        <h2>{selectedTopic.title} - Code Practice</h2>
      </div>

      <div className="code-practice-layout">
        <div className="code-editor-section">
          <div className="editor-header">
            <h3>Code Editor</h3>
            <div className="editor-actions">
              <button className="run-btn" onClick={runCode} disabled={isRunning}>
                {isRunning ? <Settings className="spinning" size={16} /> : <Play size={16} />}
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
              <button className="reset-btn">
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>

          <div className="code-editor">
            <textarea
              value={activeCode || selectedTopic.codeExample}
              onChange={(e) => setActiveCode(e.target.value)}
              placeholder="Write your C# code here..."
              className="code-textarea"
            />
          </div>

          <div className="output-section">
            <h4>Output</h4>
            <div className="output-console">
              <pre>{output || 'Run your code to see output here...'}</pre>
            </div>
          </div>
        </div>

        <div className="practice-sidebar">
          <div className="example-code">
            <h3>Reference Code</h3>
            <pre className="reference-code">
              <code>{selectedTopic.codeExample}</code>
            </pre>
          </div>

          <div className="practice-exercises">
            <h3>Practice Exercises</h3>
            {selectedTopic.practiceExercises.map((exercise, index) => (
              <div key={index} className="exercise-item">
                <h4>Exercise {index + 1}</h4>
                <p>{exercise}</p>
                <button className="try-exercise-btn">
                  <Code size={14} />
                  Try This Exercise
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Tracker Component
const ProgressTracker = ({ topics, completedTopics, bookmarkedTopics }) => {
  const totalTopics = topics.length;
  const completedCount = completedTopics.size;
  const progressPercentage = Math.round((completedCount / totalTopics) * 100);

  const categoryProgress = {
    fundamentals: {
      total: topics.filter(t => t.category === 'fundamentals').length,
      completed: topics.filter(t => t.category === 'fundamentals' && completedTopics.has(t.id)).length
    },
    controlFlow: {
      total: topics.filter(t => t.category === 'controlFlow').length,
      completed: topics.filter(t => t.category === 'controlFlow' && completedTopics.has(t.id)).length
    },
    loops: {
      total: topics.filter(t => t.category === 'loops').length,
      completed: topics.filter(t => t.category === 'loops' && completedTopics.has(t.id)).length
    }
  };

  const achievements = [
    {
      id: 'first-topic',
      name: 'First Steps',
      description: 'Complete your first topic',
      icon: <Star size={24} />,
      unlocked: completedCount >= 1
    },
    {
      id: 'fundamentals-master',
      name: 'Fundamentals Master',
      description: 'Complete all fundamental topics',
      icon: <Trophy size={24} />,
      unlocked: categoryProgress.fundamentals.completed === categoryProgress.fundamentals.total && categoryProgress.fundamentals.total > 0
    },
    {
      id: 'halfway-hero',
      name: 'Halfway Hero',
      description: 'Complete 50% of all topics',
      icon: <Medal size={24} />,
      unlocked: progressPercentage >= 50
    },
    {
      id: 'csharp-champion',
      name: 'C# Champion',
      description: 'Complete all topics',
      icon: <Crown size={24} />,
      unlocked: progressPercentage === 100
    }
  ];

  return (
    <div className="progress-tracker">
      <div className="overall-progress">
        <h2>Overall Progress</h2>
        <div className="progress-circle">
          <div
            className="circle-progress"
            style={{ '--progress': progressPercentage }}
          >
            <div className="progress-text">{progressPercentage}%</div>
          </div>
        </div>
        <p>{completedCount} of {totalTopics} topics completed</p>
      </div>

      <div className="category-breakdown">
        <h3>Progress by Category</h3>
        {Object.entries(categoryProgress).map(([category, data]) => (
          <div key={category} className="category-progress">
            <div className="category-header">
              <span className="category-name">
                {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
              </span>
              <span className="category-stats">
                {data.completed}/{data.total}
              </span>
            </div>
            <div className="category-bar">
              <div
                className="category-fill"
                style={{ width: `${data.total > 0 ? (data.completed / data.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="achievements">
        <h3>Achievements</h3>
        <div className="achievement-grid">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`achievement ${achievement.unlocked ? 'unlocked' : ''}`}
            >
              {achievement.icon}
              <span>{achievement.name}</span>
              <p>{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bookmarked-topics">
        <h3>Bookmarked Topics</h3>
        {bookmarkedTopics.size === 0 ? (
          <p className="no-bookmarks">No bookmarked topics yet. Bookmark topics you want to revisit!</p>
        ) : (
          <div className="bookmarks-list">
            {topics.filter(topic => bookmarkedTopics.has(topic.id)).map(topic => (
              <div key={topic.id} className="bookmark-item">
                <Bookmark size={16} />
                <span>{topic.title}</span>
                <span className={`difficulty ${topic.difficulty.toLowerCase()}`}>
                  {topic.difficulty}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CSharpLearningEnvironment;
