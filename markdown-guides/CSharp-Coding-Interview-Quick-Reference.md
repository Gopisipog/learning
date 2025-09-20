# C# Coding Interview Quick Reference

## Table of Contents
1. [Basic Syntax & Data Types](#basic-syntax--data-types)
2. [Collections & Data Structures](#collections--data-structures)
3. [String Manipulation](#string-manipulation)
4. [LINQ & Lambda Expressions](#linq--lambda-expressions)
5. [Common Algorithms](#common-algorithms)
6. [Object-Oriented Programming](#object-oriented-programming)
7. [Exception Handling](#exception-handling)
8. [Time & Space Complexity](#time--space-complexity)
9. [Common Interview Patterns](#common-interview-patterns)
10. [Best Practices](#best-practices)

## Basic Syntax & Data Types

### **Variable Declaration**
```csharp
// Explicit typing
int number = 42;
string text = "Hello";
bool isTrue = true;
double price = 99.99;

// Implicit typing (var)
var name = "John";          // string
var count = 10;             // int
var items = new List<int>(); // List<int>

// Constants
const int MAX_SIZE = 100;
readonly DateTime createdAt = DateTime.Now;
```

### **Nullable Types**
```csharp
int? nullableInt = null;
string? nullableString = null; // C# 8.0+

// Null-conditional operators
string result = nullableString?.ToUpper() ?? "DEFAULT";
int length = nullableString?.Length ?? 0;
```

### **Arrays**
```csharp
// Declaration and initialization
int[] numbers = new int[5];
int[] values = {1, 2, 3, 4, 5};
int[] array = new int[] {1, 2, 3};

// Multi-dimensional arrays
int[,] matrix = new int[3, 3];
int[][] jaggedArray = new int[3][];

// Common operations
int length = array.Length;
Array.Sort(array);
Array.Reverse(array);
int index = Array.IndexOf(array, 3);
```

## Collections & Data Structures

### **List<T>**
```csharp
var list = new List<int> {1, 2, 3};

// Common operations
list.Add(4);                    // Add element
list.Insert(0, 0);             // Insert at index
list.Remove(2);                // Remove first occurrence
list.RemoveAt(1);              // Remove at index
list.Contains(3);              // Check if contains
list.Count;                    // Get count
list.Clear();                  // Remove all elements

// Useful methods
list.Find(x => x > 2);         // Find first match
list.FindAll(x => x > 2);      // Find all matches
list.Sort();                   // Sort in place
list.Reverse();                // Reverse in place
```

### **Dictionary<TKey, TValue>**
```csharp
var dict = new Dictionary<string, int>();

// Operations
dict["key"] = 42;              // Add/update
dict.Add("key2", 24);          // Add (throws if exists)
dict.TryGetValue("key", out int value); // Safe get
dict.ContainsKey("key");       // Check key exists
dict.Remove("key");            // Remove by key

// Iteration
foreach (var kvp in dict)
{
    Console.WriteLine($"{kvp.Key}: {kvp.Value}");
}
```

### **HashSet<T>**
```csharp
var set = new HashSet<int> {1, 2, 3};

// Operations
set.Add(4);                    // Add element
set.Remove(2);                 // Remove element
set.Contains(3);               // Check membership
set.UnionWith(otherSet);       // Union operation
set.IntersectWith(otherSet);   // Intersection
```

### **Queue<T> & Stack<T>**
```csharp
// Queue (FIFO)
var queue = new Queue<int>();
queue.Enqueue(1);              // Add to back
int first = queue.Dequeue();   // Remove from front
int peek = queue.Peek();       // Look at front

// Stack (LIFO)
var stack = new Stack<int>();
stack.Push(1);                 // Add to top
int top = stack.Pop();         // Remove from top
int peek = stack.Peek();       // Look at top
```

### **Priority Queue (C# 10+)**
```csharp
var pq = new PriorityQueue<string, int>();
pq.Enqueue("item", priority: 1);
string item = pq.Dequeue();
```

## String Manipulation

### **Common String Operations**
```csharp
string str = "Hello World";

// Basic operations
int length = str.Length;
char first = str[0];
string upper = str.ToUpper();
string lower = str.ToLower();
string trimmed = str.Trim();

// Searching
bool contains = str.Contains("World");
int index = str.IndexOf("World");
int lastIndex = str.LastIndexOf("l");
bool startsWith = str.StartsWith("Hello");
bool endsWith = str.EndsWith("World");

// Modification
string replaced = str.Replace("World", "Universe");
string substring = str.Substring(6, 5); // "World"
string[] parts = str.Split(' ');
string joined = string.Join(", ", parts);

// StringBuilder for multiple operations
var sb = new StringBuilder();
sb.Append("Hello");
sb.Append(" ");
sb.Append("World");
string result = sb.ToString();
```

### **String Formatting**
```csharp
// String interpolation (preferred)
string name = "John";
int age = 30;
string message = $"Hello {name}, you are {age} years old";

// String.Format
string formatted = string.Format("Hello {0}, you are {1}", name, age);

// Composite formatting
Console.WriteLine("Hello {0}, you are {1}", name, age);
```

## LINQ & Lambda Expressions

### **Common LINQ Operations**
```csharp
var numbers = new List<int> {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

// Filtering
var evens = numbers.Where(x => x % 2 == 0);
var first = numbers.First(x => x > 5);
var firstOrDefault = numbers.FirstOrDefault(x => x > 100);

// Projection
var squares = numbers.Select(x => x * x);
var strings = numbers.Select(x => x.ToString());

// Aggregation
int sum = numbers.Sum();
double average = numbers.Average();
int max = numbers.Max();
int min = numbers.Min();
int count = numbers.Count(x => x > 5);

// Grouping
var grouped = numbers.GroupBy(x => x % 2)
                    .Select(g => new { Key = g.Key, Values = g.ToList() });

// Ordering
var ascending = numbers.OrderBy(x => x);
var descending = numbers.OrderByDescending(x => x);

// Set operations
var list1 = new List<int> {1, 2, 3};
var list2 = new List<int> {3, 4, 5};
var union = list1.Union(list2);        // {1, 2, 3, 4, 5}
var intersect = list1.Intersect(list2); // {3}
var except = list1.Except(list2);      // {1, 2}
```

### **Lambda Expressions**
```csharp
// Basic lambda syntax
Func<int, bool> isEven = x => x % 2 == 0;
Func<int, int, int> add = (x, y) => x + y;
Action<string> print = message => Console.WriteLine(message);

// Multi-line lambdas
Func<int, string> describe = x =>
{
    if (x > 0) return "positive";
    if (x < 0) return "negative";
    return "zero";
};
```

## Common Algorithms

### **Searching**
```csharp
// Binary Search (array must be sorted)
public static int BinarySearch(int[] arr, int target)
{
    int left = 0, right = arr.Length - 1;
    
    while (left <= right)
    {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1; // Not found
}
```

### **Sorting**
```csharp
// Quick Sort
public static void QuickSort(int[] arr, int low, int high)
{
    if (low < high)
    {
        int pi = Partition(arr, low, high);
        QuickSort(arr, low, pi - 1);
        QuickSort(arr, pi + 1, high);
    }
}

private static int Partition(int[] arr, int low, int high)
{
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++)
    {
        if (arr[j] < pivot)
        {
            i++;
            (arr[i], arr[j]) = (arr[j], arr[i]); // Tuple swap
        }
    }
    
    (arr[i + 1], arr[high]) = (arr[high], arr[i + 1]);
    return i + 1;
}
```

### **Two Pointers Technique**
```csharp
// Two Sum (sorted array)
public static int[] TwoSum(int[] nums, int target)
{
    int left = 0, right = nums.Length - 1;
    
    while (left < right)
    {
        int sum = nums[left] + nums[right];
        if (sum == target) return new int[] {left, right};
        if (sum < target) left++;
        else right--;
    }
    
    return new int[] {-1, -1};
}
```

### **Sliding Window**
```csharp
// Maximum sum of k consecutive elements
public static int MaxSumSubarray(int[] arr, int k)
{
    int maxSum = 0, windowSum = 0;
    
    // Calculate sum of first window
    for (int i = 0; i < k; i++)
        windowSum += arr[i];
    
    maxSum = windowSum;
    
    // Slide the window
    for (int i = k; i < arr.Length; i++)
    {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.Max(maxSum, windowSum);
    }
    
    return maxSum;
}
```

## Object-Oriented Programming

### **Classes and Inheritance**
```csharp
public abstract class Animal
{
    public string Name { get; set; }
    protected int age;
    
    public Animal(string name)
    {
        Name = name;
    }
    
    public virtual void MakeSound()
    {
        Console.WriteLine("Some generic animal sound");
    }
    
    public abstract void Move();
}

public class Dog : Animal
{
    public Dog(string name) : base(name) { }
    
    public override void MakeSound()
    {
        Console.WriteLine("Woof!");
    }
    
    public override void Move()
    {
        Console.WriteLine("Running on four legs");
    }
}
```

### **Interfaces**
```csharp
public interface IComparable<T>
{
    int CompareTo(T other);
}

public interface IDisposable
{
    void Dispose();
}

public class Person : IComparable<Person>, IDisposable
{
    public string Name { get; set; }
    public int Age { get; set; }
    
    public int CompareTo(Person other)
    {
        return Age.CompareTo(other.Age);
    }
    
    public void Dispose()
    {
        // Cleanup resources
    }
}
```

### **Properties and Indexers**
```csharp
public class Student
{
    private string _name;
    
    // Auto-implemented property
    public int Age { get; set; }
    
    // Property with backing field
    public string Name
    {
        get => _name;
        set => _name = value?.Trim();
    }
    
    // Read-only property
    public string FullName => $"{Name} (Age: {Age})";
    
    // Indexer
    private Dictionary<string, int> _grades = new();
    public int this[string subject]
    {
        get => _grades.TryGetValue(subject, out int grade) ? grade : 0;
        set => _grades[subject] = value;
    }
}
```

## Exception Handling

### **Try-Catch-Finally**
```csharp
try
{
    int result = 10 / 0;
}
catch (DivideByZeroException ex)
{
    Console.WriteLine($"Division by zero: {ex.Message}");
}
catch (Exception ex)
{
    Console.WriteLine($"General error: {ex.Message}");
}
finally
{
    Console.WriteLine("This always executes");
}
```

### **Using Statement (IDisposable)**
```csharp
// Automatic resource cleanup
using (var file = new StreamReader("file.txt"))
{
    string content = file.ReadToEnd();
}

// C# 8.0+ using declaration
using var file = new StreamReader("file.txt");
string content = file.ReadToEnd();
// file.Dispose() called automatically at end of scope
```

## Time & Space Complexity

### **Common Complexities**
```csharp
// O(1) - Constant
dict["key"] = value;           // Dictionary access
list[index] = value;           // Array/List access by index

// O(log n) - Logarithmic
Array.BinarySearch(arr, value); // Binary search
// Balanced tree operations

// O(n) - Linear
list.Contains(value);          // Linear search
list.Sum();                    // Iterate through all elements

// O(n log n) - Linearithmic
Array.Sort(arr);               // Efficient sorting algorithms
list.OrderBy(x => x);          // LINQ sorting

// O(n²) - Quadratic
// Nested loops over same data
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        // Some operation
```

## Common Interview Patterns

### **Frequency Counter**
```csharp
public static bool IsAnagram(string s, string t)
{
    if (s.Length != t.Length) return false;
    
    var charCount = new Dictionary<char, int>();
    
    // Count characters in first string
    foreach (char c in s)
        charCount[c] = charCount.GetValueOrDefault(c, 0) + 1;
    
    // Subtract characters from second string
    foreach (char c in t)
    {
        if (!charCount.ContainsKey(c)) return false;
        charCount[c]--;
        if (charCount[c] == 0) charCount.Remove(c);
    }
    
    return charCount.Count == 0;
}
```

### **Multiple Pointers**
```csharp
public static bool IsPalindrome(string s)
{
    int left = 0, right = s.Length - 1;
    
    while (left < right)
    {
        if (s[left] != s[right]) return false;
        left++;
        right--;
    }
    
    return true;
}
```

### **Fast & Slow Pointers (Floyd's Cycle Detection)**
```csharp
public class ListNode
{
    public int val;
    public ListNode next;
}

public static bool HasCycle(ListNode head)
{
    if (head?.next == null) return false;
    
    ListNode slow = head, fast = head;
    
    while (fast?.next != null)
    {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow == fast) return true;
    }
    
    return false;
}
```

## Best Practices

### **Code Style**
```csharp
// Use meaningful names
var activeUsers = GetActiveUsers();
var isValidEmail = ValidateEmail(email);

// Prefer explicit types for clarity in complex scenarios
Dictionary<string, List<User>> userGroups = GetUserGroups();

// Use string interpolation
string message = $"User {user.Name} has {user.Points} points";

// Use null-conditional operators
int? length = user?.Name?.Length;

// Prefer LINQ for readability
var adults = users.Where(u => u.Age >= 18).ToList();
```

### **Performance Tips**
```csharp
// Use StringBuilder for multiple string concatenations
var sb = new StringBuilder();
foreach (var item in items)
    sb.AppendLine(item.ToString());

// Use HashSet for O(1) lookups instead of List.Contains()
var validIds = new HashSet<int> {1, 2, 3, 4, 5};
bool isValid = validIds.Contains(userId);

// Use appropriate collection types
// Dictionary<K,V> for key-value pairs
// HashSet<T> for unique items
// List<T> for ordered collections
// Queue<T>/Stack<T> for FIFO/LIFO

// Avoid unnecessary allocations in loops
var result = new List<string>(capacity: items.Count);
```

### **Common Gotchas**
```csharp
// Reference vs Value types
int a = 5;
int b = a;    // b gets copy of value
b = 10;       // a is still 5

var list1 = new List<int> {1, 2, 3};
var list2 = list1;  // list2 references same object
list2.Add(4);       // list1 now also contains 4

// String immutability
string str = "Hello";
str.ToUpper();      // Returns new string, doesn't modify str
str = str.ToUpper(); // Need to assign back

// Floating point precision
double result = 0.1 + 0.2; // Not exactly 0.3
bool equal = Math.Abs(result - 0.3) < 0.0001; // Better comparison
```

## Advanced Topics

### **Generics**
```csharp
// Generic class
public class GenericRepository<T> where T : class
{
    private List<T> _items = new List<T>();

    public void Add(T item) => _items.Add(item);
    public T GetById(int id) => _items[id];
    public IEnumerable<T> GetAll() => _items;
}

// Generic method
public static T Max<T>(T a, T b) where T : IComparable<T>
{
    return a.CompareTo(b) > 0 ? a : b;
}

// Multiple constraints
public class Service<T> where T : class, IDisposable, new()
{
    public T CreateInstance() => new T();
}
```

### **Delegates and Events**
```csharp
// Delegate declaration
public delegate void EventHandler(string message);
public delegate T Func<T>(T input);

// Using delegates
EventHandler handler = message => Console.WriteLine(message);
handler += message => File.WriteAllText("log.txt", message); // Multicast

// Built-in delegates
Action<string> action = Console.WriteLine;
Func<int, int, int> func = (x, y) => x + y;
Predicate<int> predicate = x => x > 0;

// Events
public class Publisher
{
    public event Action<string> OnMessageReceived;

    protected virtual void RaiseMessage(string message)
    {
        OnMessageReceived?.Invoke(message);
    }
}
```

### **Async/Await**
```csharp
// Async method
public async Task<string> GetDataAsync()
{
    using var client = new HttpClient();
    string result = await client.GetStringAsync("https://api.example.com");
    return result;
}

// Async enumerable (C# 8.0+)
public async IAsyncEnumerable<int> GetNumbersAsync()
{
    for (int i = 0; i < 10; i++)
    {
        await Task.Delay(100);
        yield return i;
    }
}

// Parallel processing
public async Task ProcessItemsAsync(IEnumerable<string> items)
{
    var tasks = items.Select(ProcessItemAsync);
    await Task.WhenAll(tasks);
}
```

### **Pattern Matching (C# 7.0+)**
```csharp
// Switch expressions (C# 8.0+)
public static string GetDayType(DayOfWeek day) => day switch
{
    DayOfWeek.Saturday or DayOfWeek.Sunday => "Weekend",
    DayOfWeek.Monday => "Start of work week",
    _ => "Weekday"
};

// Pattern matching with when
public static string Describe(object obj) => obj switch
{
    int i when i > 0 => "Positive integer",
    int i when i < 0 => "Negative integer",
    int => "Zero",
    string s when s.Length > 10 => "Long string",
    string => "Short string",
    null => "Null value",
    _ => "Unknown type"
};

// Tuple patterns
public static string GetQuadrant(int x, int y) => (x, y) switch
{
    (> 0, > 0) => "First quadrant",
    (< 0, > 0) => "Second quadrant",
    (< 0, < 0) => "Third quadrant",
    (> 0, < 0) => "Fourth quadrant",
    _ => "On axis"
};
```

## Data Structures Implementation

### **Binary Tree**
```csharp
public class TreeNode
{
    public int val;
    public TreeNode left;
    public TreeNode right;

    public TreeNode(int val = 0, TreeNode left = null, TreeNode right = null)
    {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// Tree traversals
public static void InorderTraversal(TreeNode root, List<int> result)
{
    if (root == null) return;

    InorderTraversal(root.left, result);
    result.Add(root.val);
    InorderTraversal(root.right, result);
}

public static void LevelOrderTraversal(TreeNode root)
{
    if (root == null) return;

    var queue = new Queue<TreeNode>();
    queue.Enqueue(root);

    while (queue.Count > 0)
    {
        TreeNode node = queue.Dequeue();
        Console.WriteLine(node.val);

        if (node.left != null) queue.Enqueue(node.left);
        if (node.right != null) queue.Enqueue(node.right);
    }
}
```

### **Graph Representation**
```csharp
// Adjacency List
public class Graph
{
    private Dictionary<int, List<int>> _adjacencyList;

    public Graph()
    {
        _adjacencyList = new Dictionary<int, List<int>>();
    }

    public void AddEdge(int source, int destination)
    {
        if (!_adjacencyList.ContainsKey(source))
            _adjacencyList[source] = new List<int>();
        if (!_adjacencyList.ContainsKey(destination))
            _adjacencyList[destination] = new List<int>();

        _adjacencyList[source].Add(destination);
        _adjacencyList[destination].Add(source); // For undirected graph
    }

    // DFS
    public void DFS(int start, HashSet<int> visited = null)
    {
        visited ??= new HashSet<int>();
        visited.Add(start);
        Console.WriteLine(start);

        if (_adjacencyList.ContainsKey(start))
        {
            foreach (int neighbor in _adjacencyList[start])
            {
                if (!visited.Contains(neighbor))
                    DFS(neighbor, visited);
            }
        }
    }

    // BFS
    public void BFS(int start)
    {
        var visited = new HashSet<int>();
        var queue = new Queue<int>();

        queue.Enqueue(start);
        visited.Add(start);

        while (queue.Count > 0)
        {
            int current = queue.Dequeue();
            Console.WriteLine(current);

            if (_adjacencyList.ContainsKey(current))
            {
                foreach (int neighbor in _adjacencyList[current])
                {
                    if (!visited.Contains(neighbor))
                    {
                        visited.Add(neighbor);
                        queue.Enqueue(neighbor);
                    }
                }
            }
        }
    }
}
```

## Dynamic Programming Patterns

### **Memoization**
```csharp
// Fibonacci with memoization
private static Dictionary<int, long> _fibCache = new Dictionary<int, long>();

public static long Fibonacci(int n)
{
    if (n <= 1) return n;

    if (_fibCache.ContainsKey(n))
        return _fibCache[n];

    long result = Fibonacci(n - 1) + Fibonacci(n - 2);
    _fibCache[n] = result;
    return result;
}
```

### **Tabulation (Bottom-up)**
```csharp
// Longest Common Subsequence
public static int LCS(string text1, string text2)
{
    int m = text1.Length, n = text2.Length;
    int[,] dp = new int[m + 1, n + 1];

    for (int i = 1; i <= m; i++)
    {
        for (int j = 1; j <= n; j++)
        {
            if (text1[i - 1] == text2[j - 1])
                dp[i, j] = dp[i - 1, j - 1] + 1;
            else
                dp[i, j] = Math.Max(dp[i - 1, j], dp[i, j - 1]);
        }
    }

    return dp[m, n];
}
```

## Interview Tips

### **Problem-Solving Approach**
1. **Understand the Problem**
   - Read carefully and ask clarifying questions
   - Identify inputs, outputs, and constraints
   - Work through examples manually

2. **Plan Your Solution**
   - Start with brute force approach
   - Identify patterns and optimizations
   - Consider edge cases

3. **Code Implementation**
   - Write clean, readable code
   - Use meaningful variable names
   - Add comments for complex logic

4. **Test Your Solution**
   - Walk through with examples
   - Consider edge cases (empty input, single element, etc.)
   - Analyze time and space complexity

### **Common Mistakes to Avoid**
```csharp
// Off-by-one errors
for (int i = 0; i <= arr.Length; i++) // Should be i < arr.Length

// Null reference exceptions
string result = str.ToUpper(); // Check if str is null first

// Integer overflow
int sum = int.MaxValue + 1; // Use long for large numbers

// Modifying collection while iterating
foreach (var item in list)
{
    if (condition) list.Remove(item); // Use for loop or ToList()
}
```

### **Optimization Techniques**
```csharp
// Use appropriate data structures
var lookup = new HashSet<int>(array); // O(1) lookup instead of O(n)

// Cache expensive computations
var cache = new Dictionary<string, ExpensiveResult>();

// Use StringBuilder for string building
var sb = new StringBuilder();
foreach (var item in items)
    sb.Append(item);

// Avoid unnecessary allocations
// Instead of: items.Where(x => x.IsActive).Count()
// Use: items.Count(x => x.IsActive)
```

This comprehensive quick reference covers the most important C# concepts and patterns commonly encountered in coding interviews. Practice implementing these patterns and understanding their time/space complexities for interview success.
