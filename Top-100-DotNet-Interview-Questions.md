# 🎯 Top 100 .NET Interview Questions & Answers

## **Chapter 1: OOPS & C# - Basics (Questions 1-10)**

### **Q1: What is C#? What is the difference between C# and .NET?**
**Answer:**
- **C#** is an object-oriented programming language which runs on the .NET framework
- **.NET** is a framework for building and running software's and applications
- C# is the programming language, .NET is the platform/runtime environment

### **Q2: What is OOPS? What are the main concepts of OOPS?** ⭐ Very Important
**Answer:**
**OOPS (Object-Oriented Programming System)** main concepts:
1. **Encapsulation** - Bundling data and methods together, hiding internal details
2. **Inheritance** - Creating new classes based on existing classes
3. **Polymorphism** - Same interface, different implementations
4. **Abstraction** - Hiding complex implementation details, showing only essential features

### **Q3: What are the advantages of OOPS?** ⭐ Very Important
**Answer:**
1. **Modularity** - Code is organized into separate, interchangeable components
2. **Reusability** - Classes can be reused in different applications
3. **Maintainability** - Easier to maintain and modify code
4. **Scalability** - Easy to add new features without affecting existing code
5. **Data Security** - Encapsulation provides data hiding and security
6. **Problem Solving** - Breaks complex problems into smaller, manageable objects

### **Q4: What are the limitations of OOPS?**
**Answer:**
1. **Performance Overhead** - Object creation and method calls have overhead
2. **Complexity** - Can be over-engineered for simple problems
3. **Learning Curve** - Requires understanding of OOP concepts
4. **Memory Usage** - Objects consume more memory than procedural code
5. **Design Complexity** - Requires careful planning and design

### **Q5: What are Classes and Objects?**
**Answer:**
- **Class** - Blueprint or template that defines properties and methods
- **Object** - Instance of a class, actual entity created from the class template

```csharp
// Class definition
public class Car
{
    public string Brand { get; set; }
    public string Model { get; set; }
    
    public void Start()
    {
        Console.WriteLine($"{Brand} {Model} is starting...");
    }
}

// Object creation
Car myCar = new Car();
myCar.Brand = "Toyota";
myCar.Model = "Camry";
myCar.Start();
```

### **Q6: What are the types of classes in C#?**
**Answer:**
1. **Abstract Class** - Cannot be instantiated, contains abstract methods
2. **Sealed Class** - Cannot be inherited
3. **Static Class** - Cannot be instantiated, all members are static
4. **Partial Class** - Class definition split across multiple files
5. **Generic Class** - Class with type parameters

```csharp
// Abstract class
public abstract class Animal
{
    public abstract void MakeSound();
}

// Sealed class
public sealed class FinalClass
{
    public void Method() { }
}

// Static class
public static class MathHelper
{
    public static int Add(int a, int b) => a + b;
}
```

### **Q7: Is it possible to prevent object creation of a class in C#?**
**Answer:**
Yes, several ways:
1. **Private Constructor** - Prevents external instantiation
2. **Abstract Class** - Cannot be directly instantiated
3. **Static Class** - Cannot be instantiated at all

```csharp
// Private constructor (Singleton pattern)
public class Singleton
{
    private static Singleton _instance;
    private Singleton() { } // Private constructor
    
    public static Singleton Instance
    {
        get { return _instance ??= new Singleton(); }
    }
}

// Abstract class
public abstract class Shape
{
    public abstract double GetArea();
}
```

### **Q8: What is Property?**
**Answer:**
**Properties** provide controlled access to private fields with get and set accessors.

```csharp
public class Person
{
    private string _name;
    private int _age;
    
    // Property with full implementation
    public string Name
    {
        get { return _name; }
        set 
        { 
            if (!string.IsNullOrEmpty(value))
                _name = value; 
        }
    }
    
    // Auto-implemented property
    public int Age { get; set; }
    
    // Read-only property
    public string FullInfo => $"{Name} is {Age} years old";
}
```

### **Q9: What is the difference between Property and Function?**
**Answer:**

| **Property** | **Function/Method** |
|-------------|-------------------|
| Represents data/state | Represents behavior/action |
| Uses get/set accessors | Uses parameters and return values |
| No parentheses when accessing | Requires parentheses when calling |
| Should be lightweight | Can perform complex operations |
| Can be used in expressions | Executes specific logic |

```csharp
public class Example
{
    // Property
    public string Name { get; set; }
    
    // Method/Function
    public string GetFormattedName(string prefix)
    {
        return $"{prefix}: {Name}";
    }
    
    // Usage
    public void Demo()
    {
        Name = "John";              // Property assignment
        string result = GetFormattedName("Mr"); // Method call
    }
}
```

### **Q10: What are Namespaces?**
**Answer:**
**Namespaces** organize code into logical groups and prevent naming conflicts.

```csharp
// Defining namespace
namespace MyCompany.ProjectName.Utilities
{
    public class StringHelper
    {
        public static string Reverse(string input)
        {
            return new string(input.Reverse().ToArray());
        }
    }
}

// Using namespace
using MyCompany.ProjectName.Utilities;
using System;

namespace MyApplication
{
    class Program
    {
        static void Main()
        {
            string reversed = StringHelper.Reverse("Hello");
            Console.WriteLine(reversed); // "olleH"
        }
    }
}
```

## **Chapter 2: Collections & Interfaces (Questions 11-25)**

### **Q11: What is IEnumerable interface?**
**Answer:**
**IEnumerable** interface is used when we want to **ITERATE** among our collection classes using a **FOREACH** loop.

- IEnumerable internally uses IEnumerator only to iterate the collection via foreach loop
- IEnumerable simplifies the use of IEnumerator

```csharp
public class NumberCollection : IEnumerable<int>
{
    private List<int> numbers = new List<int>();
    
    public void Add(int number) => numbers.Add(number);
    
    public IEnumerator<int> GetEnumerator()
    {
        return numbers.GetEnumerator();
    }
    
    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}

// Usage
var collection = new NumberCollection();
collection.Add(1);
collection.Add(2);

foreach (int number in collection) // IEnumerable enables this
{
    Console.WriteLine(number);
}
```

### **Q12: What is the difference between IEnumerable and IQueryable in C#? Why to use IQueryable for SQL queries?**
**Answer:**

| **IEnumerable** | **IQueryable** |
|----------------|----------------|
| Used with in-memory collection | Better for getting result from database |
| Brings all results from database then filters at code side | Filters result at database only |
| Network load and performance issue | Less network load and better performance |
| System.Collections namespace | System.Linq namespace |

**IQueryable** inherited from IEnumerable interface, so anything you can do with IEnumerable, you can also do with IQueryable.

```csharp
// IEnumerable - loads all data then filters (BAD for large datasets)
IEnumerable<User> users = context.Users.AsEnumerable();
var activeUsers = users.Where(u => u.IsActive); // Filters in memory

// IQueryable - filters at database level (GOOD)
IQueryable<User> usersQuery = context.Users;
var activeUsersQuery = usersQuery.Where(u => u.IsActive); // Filters in SQL
```

## **Chapter 3: Constructors (Questions 13-20)**

### **Q13: What is a Constructor? When to use constructor in real applications?**
**Answer:**
**Constructor** is a special method that is automatically called when an object is created.

**When to use:**
1. **Initialize object state** - Set initial values for properties
2. **Dependency injection** - Inject required dependencies
3. **Validation** - Ensure object is created in valid state
4. **Resource allocation** - Allocate necessary resources

```csharp
public class DatabaseConnection
{
    private string connectionString;
    private ILogger logger;
    
    // Constructor with dependency injection
    public DatabaseConnection(string connectionString, ILogger logger)
    {
        // Validation
        if (string.IsNullOrEmpty(connectionString))
            throw new ArgumentException("Connection string cannot be empty");
            
        // Initialization
        this.connectionString = connectionString;
        this.logger = logger;
        
        // Setup
        InitializeConnection();
    }
    
    private void InitializeConnection()
    {
        logger.LogInfo("Database connection initialized");
    }
}
```

## **Chapter 4: Assemblies (Questions 21-30)**

### **Q14: What is Assembly?**
**Answer:**
**Assembly** is unit of deployment like EXE or a DLL. When you create code and build the solution, the .NET Framework converts your code into Intermediate Language and places it inside the assembly (dll), which you can find inside bin folder.

**Types of assemblies:**
1. **Private assembly** - Can be used by a single application only, not accessible outside
2. **Public/shared assembly** - Libraries that multiple applications can use, registered in GAC
3. **Satellite assembly** - Contains resources only, no executable code

```csharp
// Assembly information
[assembly: AssemblyTitle("My Application")]
[assembly: AssemblyDescription("Sample .NET Application")]
[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyFileVersion("1.0.0.0")]

// Loading assembly at runtime
Assembly assembly = Assembly.LoadFrom("MyLibrary.dll");
Type type = assembly.GetType("MyLibrary.Calculator");
object calculator = Activator.CreateInstance(type);
```

## **Chapter 5: Multithreading & Async (Questions 31-45)**

### **Q15: What is the difference between Process and Thread?**
**Answer:**
- **Process** is an instance of a program with its own memory space and system resources
- **Thread** is the smallest unit of process, that shares memory and resources with other threads within the same process

### **Q16: Explain Multithreading?** ⭐ Very Important
**Answer:**
**Multithreading** refers to the ability to execute multiple threads of code concurrently within a single process.

- Allows you to perform multiple tasks simultaneously (e.g., downloading data while displaying progress bar)
- To create multithreaded applications in C#, use **SYSTEM.THREADING** namespace

```csharp
using System.Threading;

public class MultithreadingExample
{
    public void StartMultipleThreads()
    {
        // Create and start threads
        Thread thread1 = new Thread(DoWork);
        Thread thread2 = new Thread(DoWork);
        
        thread1.Start("Thread 1");
        thread2.Start("Thread 2");
        
        // Wait for threads to complete
        thread1.Join();
        thread2.Join();
    }
    
    private void DoWork(object threadName)
    {
        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine($"{threadName}: {i}");
            Thread.Sleep(1000);
        }
    }
}
```

### **Q17: What is the difference between synchronous and asynchronous programming? What is the role of Task?** ⭐ Very Important
**Answer:**
- **Synchronous programming** - Tasks are executed in sequential manner
- **Asynchronous programming** - Tasks can be executed independently of each other

**Task** provides a higher-level abstraction for asynchronous operations.

```csharp
// Synchronous
public void SynchronousExample()
{
    DownloadFile("file1.txt");    // Waits for completion
    DownloadFile("file2.txt");    // Starts after file1 completes
    ProcessFiles();               // Starts after both downloads
}

// Asynchronous
public async Task AsynchronousExample()
{
    Task download1 = DownloadFileAsync("file1.txt");
    Task download2 = DownloadFileAsync("file2.txt");
    
    await Task.WhenAll(download1, download2); // Both run concurrently
    ProcessFiles();
}
```

### **Q18: What is the difference between Threads and Tasks? What are the advantages of Tasks over Threads?**
**Answer:**
- **Thread** is a general programming concept
- **Task** is Microsoft's creation in .NET to simplify the use of Threads
- Tasks are like a wrapper over Threads
- Tasks internally use threads only

**Advantages of Tasks over Threads:**
1. **Simplified Code** - Easier to write and understand
2. **Exception handling** - Better exception propagation
3. **Return results** - Tasks can return values, threads cannot easily
4. **Chaining and parent/child** - Easy composition, difficult with threads

```csharp
// Thread example (more complex)
Thread thread = new Thread(() =>
{
    // Cannot easily return value
    // Exception handling is complex
    DoSomeWork();
});
thread.Start();
thread.Join();

// Task example (simpler)
Task<int> task = Task.Run(() =>
{
    // Can return value
    // Better exception handling
    return DoSomeWork();
});

int result = await task; // Easy to get result
```

### **Q19: What is the role of Async and Await?** ⭐ Very Important
**Answer:**
**async/await** pattern enables asynchronous programming without blocking the calling thread.

```csharp
public class AsyncExample
{
    // Async method
    public async Task<string> GetDataAsync()
    {
        using HttpClient client = new HttpClient();
        
        // await suspends execution until operation completes
        // but doesn't block the thread
        string result = await client.GetStringAsync("https://api.example.com");
        
        return result;
    }
    
    // Calling async method
    public async Task ProcessDataAsync()
    {
        try
        {
            string data = await GetDataAsync();
            Console.WriteLine($"Received: {data}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
```

## **Chapter 6: SQL & Database (Questions 46-60)**

### **Q20: What are Stored Procedures and Functions? What's the difference?**
**Answer:**

| **Stored Procedure** | **Function** |
|---------------------|-------------|
| Can have input and output parameters | Only input parameters |
| Can perform DML operations | Cannot perform DML operations |
| Cannot be used in SELECT statements | Can be used in SELECT statements |
| Can return multiple values | Returns single value |
| Can have transaction control | Cannot have transaction control |

```sql
-- Stored Procedure
CREATE PROCEDURE proc_name 
(
    @Ename varchar(50),
    @EId int output
)
AS
BEGIN
    INSERT INTO Employee (EmpName) VALUES (@Ename)
    SELECT @EId = SCOPE_IDENTITY()
END

-- Function
CREATE FUNCTION function_name(@param int)
RETURNS int
AS
BEGIN
    DECLARE @result int
    SELECT @result = COUNT(*) FROM Employee WHERE DeptId = @param
    RETURN @result
END
```

### **Q21: SQL Performance Optimization Tips**
**Answer:**
1. **Use SET NOCOUNT ON** - Reduces network traffic
2. **Specify column names** instead of using *
3. **Use schema name** before objects
4. **Use EXISTS()** instead of COUNT()
5. **Use TRANSACTION** when required only
6. **Avoid DYNAMIC QUERIES** - Vulnerable to SQL injection

```sql
-- Good practices
SET NOCOUNT ON

-- Specific columns instead of *
SELECT EmpID, Name FROM dbo.Employee

-- Use EXISTS instead of COUNT
IF EXISTS (SELECT 1 FROM dbo.Employees WHERE DeptId = @DeptId)
    -- Do something

-- Use schema names
SELECT EmpID, Name FROM dbo.Employee
```

## **Chapter 7: ASP.NET & Web Development (Questions 61-75)**

### **Q22: What is the advantage of MVC over Web Forms?**
**Answer:**
**Web Forms Issues:**
- One aspx file has one aspx.cs file (tight coupling)
- UI (aspx) is tightly coupled with logic in code-behind (.aspx.cs)

**MVC Advantages:**
1. **Separation of concerns** - Clean separation of UI, business logic, and data
2. **Multiple view support** - One controller can interact with multiple views
3. **Change accommodation** - UI changes don't affect business logic
4. **Testability** - Better support for test-driven development
5. **Lightweight** - Request and response are lighter than WebForms
6. **Full ASP.NET features** - Almost all WebForms features available

```csharp
// MVC Controller
public class ProductController : Controller
{
    private readonly IProductService _productService;
    
    public ProductController(IProductService productService)
    {
        _productService = productService;
    }
    
    public ActionResult Index()
    {
        var products = _productService.GetAllProducts();
        return View(products);
    }
    
    public ActionResult Details(int id)
    {
        var product = _productService.GetProduct(id);
        return View(product);
    }
}
```

### **Q23: What are different types of Authentication in ASP.NET?**
**Answer:**
1. **Forms Authentication** - Cookie-based authentication using database credentials
2. **Passport Authentication** - Centralized authentication service by Microsoft
3. **Token Authentication** - Uses JSON Web Tokens (JWT) for SPAs and APIs
4. **Windows Authentication** - Uses Windows credentials for intranet scenarios

```csharp
// JWT Token Authentication
[Authorize]
public class ApiController : ControllerBase
{
    [HttpGet]
    public IActionResult GetSecureData()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Ok($"Secure data for user: {userId}");
    }
}

// Configure JWT in Startup.cs
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "your-issuer",
            ValidAudience = "your-audience",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your-secret-key"))
        };
    });
```

### **Q24: What is Scaffolding in ASP.NET MVC?**
**Answer:**
**Scaffolding** is a technique that generates code for common web applications. The scaffolding code includes controllers, views, and data access code automatically generated to help developers create web applications quickly with less manual coding.

```bash
# Generate scaffolded controller with views
dotnet aspnet-codegenerator controller -name ProductController -m Product -dc ApplicationDbContext --relativeFolderPath Controllers --useDefaultLayout --referenceScriptLibraries
```

### **Q25: What is Bundling and Minification?**
**Answer:**
- **BUNDLING** - Combines multiple JavaScript (.js) or CSS (.css) files so they can be downloaded as a unit, reducing HTTP requests
- **MINIFICATION** - Removes whitespace and performs compression to make files as small as possible

```csharp
// Bundle configuration
public class BundleConfig
{
    public static void RegisterBundles(BundleCollection bundles)
    {
        // JavaScript bundle
        bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            "~/Scripts/jquery-{version}.js"));
            
        // CSS bundle
        bundles.Add(new StyleBundle("~/Content/css").Include(
            "~/Content/bootstrap.css",
            "~/Content/site.css"));
    }
}
```

## **Chapter 8: String Operations & Methods (Questions 26-35)**

### **Q26: What are the important string methods in C#?**
**Answer:**
**Key String Methods:**

1. **Concatenation (+)**: Combines two or more strings
```csharp
string str1 = "This is one"; 
string str2 = "This is two"; 
string str3 = str1 + str2;
//Output: This is one This is two
```

2. **Replace**: Replace(a,b) is used to replace a string with another string
```csharp
string str1 = "This is one";
string str2 = str1.Replace("one", "two");
//Output: This is two
```

3. **Trim**: Trim() is used to trim the white spaces in a string at the end
```csharp
string str1 = "This is one    "; 
str1.Trim();
//Output: "This is one"
```

4. **Contains**: Check if a string contains a pattern of substring or not
```csharp
string str = "This is test";
bool result = str.Contains("test");
//Output: true
```

### **Q27: What is the difference between String and StringBuilder?** ⭐ Very Important
**Answer:**

| **String** | **StringBuilder** |
|------------|-------------------|
| String is IMMUTABLE in C# | StringBuilder is MUTABLE in C# |
| Creates new object for each modification | Modifies existing buffer |
| Performance issue with multiple concatenations | Better performance for multiple operations |
| Thread-safe | Not thread-safe |

```csharp
// String (inefficient for multiple operations)
string result = "";
for (int i = 0; i < 1000; i++)
{
    result += i.ToString(); // Creates new string object each time
}

// StringBuilder (efficient for multiple operations)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++)
{
    sb.Append(i.ToString()); // Modifies existing buffer
}
string result = sb.ToString();
```

## **Chapter 9: Exception Handling (Questions 28-32)**

### **Q28: What is the difference between throw and throw ex?** ⭐ Very Important
**Answer:**
- **throw**: Preserves the whole stack trace (BEST PRACTICE)
- **throw ex**: Resets the stack trace to current location

```csharp
public void DivideZerobyZero()
{
    try
    {
        int i = 10;
        int j = 0;
        int k = i / j;
    }
    catch (Exception ex)
    {
        throw; // Preserves original stack trace
        // throw ex; // Would reset stack trace (BAD)
    }
}
```

**Stack Trace Example:**
```
Error:
at Throw_ex_and_throw.Program.DivideZerobyZero() in D:\InterviewHappy\_InterviewHappy-Hindi\31-Oct-2022\OOP_CSharp_Code\Throw_ex_Throw\Program.cs:line 28
at Throw_ex_and_throw.Program.Main(String[] args) in D:\InterviewHappy\_InterviewHappy-Hindi\31-Oct-2022\OOP_CSharp_Code\Throw_ex_Throw\Program.cs:line 15
```

**Best Practice**: Use `throw` as it preserves the whole stack trace.

## **Chapter 10: Generics & Collections (Questions 33-37)**

### **Q29: Explain Generics in C#? When and why to use?** ⭐ Very Important
**Answer:**
**Generics** allow you to create classes, methods, and interfaces that work with different data types while maintaining type safety.

**Benefits:**
1. **Type Safety** - Compile-time type checking
2. **Performance** - No boxing/unboxing for value types
3. **Code Reusability** - Same code works with different types
4. **IntelliSense Support** - Better IDE support

```csharp
// Generic class
public class Repository<T> where T : class
{
    private List<T> _items = new List<T>();
    
    public void Add(T item) => _items.Add(item);
    public T GetById(int id) => _items[id];
    public IEnumerable<T> GetAll() => _items;
}

// Generic method
public T GetMax<T>(T a, T b) where T : IComparable<T>
{
    return a.CompareTo(b) > 0 ? a : b;
}

// Usage
var userRepo = new Repository<User>();
var productRepo = new Repository<Product>();
int maxValue = GetMax(10, 20);
```

### **Q30: What is the difference between var and dynamic?** ⭐ Very Important
**Answer:**

| **var** | **dynamic** |
|---------|-------------|
| Type decided at COMPILE time | Type decided at RUN time |
| Strongly typed | Weakly typed |
| IntelliSense support available | No IntelliSense support |
| Type safety at compile time | Runtime type checking |

```csharp
// var - compile-time type inference
var name = "John"; // Compiler knows this is string
var age = 25;      // Compiler knows this is int
// name = 123;     // Compile error - cannot assign int to string

// dynamic - runtime type resolution
dynamic value = "Hello";
Console.WriteLine(value.Length); // Works at runtime
value = 123;
Console.WriteLine(value + 10);   // Works at runtime
// Console.WriteLine(value.Length); // Runtime error - int has no Length property
```

## **Chapter 11: Enums & Keywords (Questions 38-42)**

### **Q31: What is Enum keyword used for?**
**Answer:**
**Enum** is a special "class" that represents a group of constants.

**Key Points:**
- Enum is a sealed class type, so it cannot be inherited
- By default, enum values start from 0
- You can assign custom values to enum members

```csharp
// Basic enum
public enum Days
{
    Monday,    // 0
    Tuesday,   // 1
    Wednesday, // 2
    Thursday,  // 3
    Friday,    // 4
    Saturday,  // 5
    Sunday     // 6
}

// Enum with custom values
public enum HttpStatusCode
{
    OK = 200,
    NotFound = 404,
    InternalServerError = 500
}

// Usage
Days today = Days.Monday;
HttpStatusCode status = HttpStatusCode.OK;

// Convert enum to string
string dayName = today.ToString(); // "Monday"

// Parse string to enum
Days parsedDay = (Days)Enum.Parse(typeof(Days), "Tuesday");
```

### **Q32: What is the yield keyword?**
**Answer:**
The **yield** keyword acts as an iterator blocker and generates or returns values one at a time.

**Benefits:**
- **Memory Efficient** - Values generated on-demand
- **Lazy Evaluation** - Only computes values when needed
- **State Preservation** - Maintains state between calls

```csharp
public class YieldExample
{
    // yield return - returns values one by one
    public static IEnumerable<int> GetNumbers()
    {
        Console.WriteLine("Starting generation...");
        
        for (int i = 1; i <= 5; i++)
        {
            Console.WriteLine($"Generating {i}");
            yield return i; // Returns value and pauses execution
        }
        
        Console.WriteLine("Generation complete");
    }
    
    // yield break - stops iteration
    public static IEnumerable<int> GetEvenNumbers(int max)
    {
        for (int i = 0; i <= max; i++)
        {
            if (i > 10)
                yield break; // Stops iteration
                
            if (i % 2 == 0)
                yield return i;
        }
    }
    
    // Usage
    public static void Demo()
    {
        foreach (int number in GetNumbers())
        {
            Console.WriteLine($"Received: {number}");
            // Output shows interleaved generation and consumption
        }
    }
}
```

## **Chapter 12: LINQ (Questions 43-47)**

### **Q33: What is LINQ? When to use LINQ in real applications?** ⭐ Very Important
**Answer:**
**LINQ (Language Integrated Query)** is uniform query syntax in C# to retrieve data from different sources.

**When to use LINQ:**
1. **Data Filtering** - Filter collections based on conditions
2. **Data Transformation** - Transform data from one format to another
3. **Data Aggregation** - Calculate sums, averages, counts
4. **Data Sorting** - Sort collections
5. **Data Grouping** - Group related data

```csharp
var employees = new List<Employee>
{
    new Employee { Name = "John", Age = 30, Department = "IT", Salary = 50000 },
    new Employee { Name = "Jane", Age = 25, Department = "HR", Salary = 45000 },
    new Employee { Name = "Bob", Age = 35, Department = "IT", Salary = 60000 }
};

// Filtering
var itEmployees = employees.Where(e => e.Department == "IT");

// Transformation
var employeeNames = employees.Select(e => e.Name);

// Aggregation
var averageSalary = employees.Average(e => e.Salary);
var totalEmployees = employees.Count();

// Sorting
var sortedByAge = employees.OrderBy(e => e.Age);

// Grouping
var groupedByDept = employees.GroupBy(e => e.Department);
```

### **Q34: What are the advantages & disadvantages of LINQ?**
**Answer:**
**Advantages of LINQ:**
1. **Easy and simple syntax** to Learn
2. **Improved code readability**
3. **Improved performance** (with IQueryable)
4. **Type safety** - Compile-time checking

**Disadvantages of LINQ:**
1. **Limited support** for some data sources
2. **Difficult to maintain and debug** complex queries
3. **Performance overhead** for simple operations
4. **Learning curve** for complex scenarios

```csharp
// Advantage: Readable and type-safe
var result = employees
    .Where(e => e.Age > 25)
    .OrderBy(e => e.Name)
    .Select(e => new { e.Name, e.Salary })
    .ToList();

// Disadvantage: Complex debugging
var complexQuery = employees
    .Where(e => e.Department == "IT")
    .GroupBy(e => e.Age)
    .Where(g => g.Count() > 1)
    .SelectMany(g => g)
    .OrderByDescending(e => e.Salary);
```

### **Q35: What is Lambda Expressions? What is the use in real applications?**
**Answer:**
**Lambda expression** is used to simplify the syntax of anonymous methods.

**Real Application Uses:**
1. **Event Handling** - Simplified event handlers
2. **LINQ Queries** - Filtering and transformation
3. **Functional Programming** - Higher-order functions
4. **Async Programming** - Task continuations

```csharp
// Traditional anonymous method
List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Old way - anonymous method
var evenNumbers1 = numbers.Where(delegate(int n) { return n % 2 == 0; });

// Lambda expression - much cleaner
var evenNumbers2 = numbers.Where(n => n % 2 == 0);

// Multiple parameters
var result = numbers.Where((n, index) => n > 5 && index < 8);

// Lambda in event handling
button.Click += (sender, e) => MessageBox.Show("Button clicked!");

// Lambda with multiple statements
var processed = numbers.Select(n => 
{
    var squared = n * n;
    var doubled = squared * 2;
    return doubled;
});
```

### **Q36: What is the difference between First and FirstOrDefault methods in LINQ?** ⭐ Very Important
**Answer:**

| **First()** | **FirstOrDefault()** |
|-------------|---------------------|
| Returns the first value | Returns the first value |
| NOT able to handle null values | Able to handle null values |
| Throws exception if no element found | Returns default value if no element found |
| Use when you're sure element exists | Use when element might not exist |

```csharp
var numbers = new List<int> { 1, 2, 3, 4, 5 };
var emptyList = new List<int>();

// First() - throws exception if no element
try
{
    var first = numbers.First(n => n > 3);        // Returns 4
    var notFound = emptyList.First();             // Throws InvalidOperationException
}
catch (InvalidOperationException ex)
{
    Console.WriteLine("No element found");
}

// FirstOrDefault() - returns default value if no element
var firstOrDefault = numbers.FirstOrDefault(n => n > 3);    // Returns 4
var notFoundDefault = emptyList.FirstOrDefault();          // Returns 0 (default for int)
var notFoundString = new List<string>().FirstOrDefault();  // Returns null (default for string)

// Best practice: Use FirstOrDefault when element might not exist
var user = users.FirstOrDefault(u => u.Id == userId);
if (user != null)
{
    // Process user
}
```

## **Chapter 13: Database Concepts (Questions 48-50)**

### **Q37: What is the difference between DBMS and RDBMS?**
**Answer:**

| **DBMS** | **RDBMS** |
|----------|-----------|
| DBMS stores data as file | RDBMS stores data in TABULAR form |
| No relationship between data | Data is stored in the form of tables which are RELATED to each other (Foreign key relationship) |
| Normalization is not present | NORMALIZATION is present |
| It deals with small quantity of data | It deals with LARGE amount of data |
| Examples: XML | Examples: MySQL, PostgreSQL, SQL Server, Oracle, Microsoft Access |

```sql
-- RDBMS Example: Related tables with foreign key
CREATE TABLE Department (
    DeptId INT PRIMARY KEY,
    DeptName VARCHAR(50)
);

CREATE TABLE Employee (
    EmpId INT PRIMARY KEY,
    EmpName VARCHAR(50),
    DeptId INT,
    FOREIGN KEY (DeptId) REFERENCES Department(DeptId)
);

-- Query with relationship
SELECT e.EmpName, d.DeptName 
FROM Employee e 
INNER JOIN Department d ON e.DeptId = d.DeptId;
```

### **Q38: What is Database Cursor?**
**Answer:**
**Database Cursor** is a control which enables traversal/iteration over the rows or records in the table.

**5 Step Process:**
1. **Declare** - Define the cursor
2. **Open** - Open the cursor
3. **Fetch** - Fetch data using while loop
4. **Close** - Close the cursor
5. **Deallocate** - Free memory

**LIMITATION:**
A cursor is a MEMORY resident set of pointers. It occupies lots of memory from your system which is not good for performance.

```sql
-- Cursor example
DECLARE @EmpId INT, @EmpName VARCHAR(50)

-- 1. Declare cursor
DECLARE emp_cursor CURSOR FOR
SELECT EmpId, EmpName FROM Employee

-- 2. Open cursor
OPEN emp_cursor

-- 3. Fetch data
FETCH NEXT FROM emp_cursor INTO @EmpId, @EmpName

WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT 'Employee: ' + @EmpName
    FETCH NEXT FROM emp_cursor INTO @EmpId, @EmpName
END

-- 4. Close cursor
CLOSE emp_cursor

-- 5. Deallocate cursor
DEALLOCATE emp_cursor
```

### **Q39: What is the difference between @@IDENTITY and SCOPE_IDENTITY()?**
**Answer:**
Both are used to get the last value generated in the identity column of the table.

- **@@IDENTITY**: Returns the last identity value generated within the current session, regardless of the scope. This will return a value generated by an INSERT statement in a trigger, stored procedure or batch of T-SQL statements.

- **SCOPE_IDENTITY()**: Returns the last identity value generated within the current session and current scope (more precise and safer).

```sql
-- Example table
CREATE TABLE Employee (
    EmpId INT IDENTITY(1,1) PRIMARY KEY,
    EmpName VARCHAR(50)
);

-- Insert and get identity
INSERT INTO Employee (EmpName) VALUES ('John Doe');

SELECT @@IDENTITY;        -- Returns last identity (any scope)
SELECT SCOPE_IDENTITY();  -- Returns last identity (current scope only)

-- In stored procedure
CREATE PROCEDURE AddEmployee
    @EmpName VARCHAR(50),
    @NewEmpId INT OUTPUT
AS
BEGIN
    INSERT INTO Employee (EmpName) VALUES (@EmpName)
    SET @NewEmpId = SCOPE_IDENTITY()  -- Safer choice
END
```

### **Q40: How to find 3rd highest salary from Employee table?**
**Answer:**
**3-Step Approach:**

1. **First select TOP 3 salaries** in descending order
2. **Put the result in "Result"** and then do order by ASC
3. **Select top 1 salary** from result set

```sql
-- Complete query for 3rd highest salary
SELECT TOP 1 SALARY
FROM (
    SELECT DISTINCT TOP 3 SALARY
    FROM tbl_Employees 
    ORDER BY SALARY DESC
) RESULT 
ORDER BY SALARY

-- Step-by-step breakdown:

-- Step 1: Get top 3 highest salaries
SELECT DISTINCT TOP 3 SALARY
FROM tbl_Employees 
ORDER BY SALARY DESC

-- Step 2: Order them ascending (lowest of top 3 first)
-- Step 3: Take the first one (which is 3rd highest overall)
```

**Alternative approaches:**
```sql
-- Using ROW_NUMBER()
SELECT SALARY 
FROM (
    SELECT SALARY, ROW_NUMBER() OVER (ORDER BY SALARY DESC) as RowNum
    FROM tbl_Employees
) ranked
WHERE RowNum = 3;

-- Using OFFSET/FETCH (SQL Server 2012+)
SELECT DISTINCT SALARY
FROM tbl_Employees
ORDER BY SALARY DESC
OFFSET 2 ROWS FETCH NEXT 1 ROWS ONLY;
```

## **Chapter 14: Magic Tables & Triggers (Questions 51-55)**

### **Q41: What are Magic Tables in SQL Server?**
**Answer:**
**Magic tables** are temporary logical tables created by SQL Server whenever there are insertion, deletion, or update (DML) operations.

**Types of magic tables:**
1. **INSERTED** - When any insert query executed, the recently inserted row gets added to the INSERTED magic table
2. **DELETED** - When any delete query executed, the recently deleted row gets added to the DELETED magic table

**In UPDATE case:** The updated row gets stored in INSERTED magic table and the old row gets stored in the DELETED magic table.

**Use of magic tables:** TRIGGERS

```sql
-- Example trigger using magic tables
CREATE TRIGGER tr_Employee_Audit
ON Employee
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    -- For INSERT operations
    IF EXISTS (SELECT * FROM INSERTED) AND NOT EXISTS (SELECT * FROM DELETED)
    BEGIN
        INSERT INTO EmployeeAudit (Action, EmpId, EmpName, ActionDate)
        SELECT 'INSERT', EmpId, EmpName, GETDATE()
        FROM INSERTED
    END
    
    -- For DELETE operations
    IF EXISTS (SELECT * FROM DELETED) AND NOT EXISTS (SELECT * FROM INSERTED)
    BEGIN
        INSERT INTO EmployeeAudit (Action, EmpId, EmpName, ActionDate)
        SELECT 'DELETE', EmpId, EmpName, GETDATE()
        FROM DELETED
    END
    
    -- For UPDATE operations
    IF EXISTS (SELECT * FROM INSERTED) AND EXISTS (SELECT * FROM DELETED)
    BEGIN
        INSERT INTO EmployeeAudit (Action, EmpId, OldName, NewName, ActionDate)
        SELECT 'UPDATE', i.EmpId, d.EmpName, i.EmpName, GETDATE()
        FROM INSERTED i
        INNER JOIN DELETED d ON i.EmpId = d.EmpId
    END
END
```

### **Q42: What are Triggers? What are the types of Triggers?**
**Answer:**
**Triggers** are stored programs which are AUTOMATICALLY executed or fired when some events (insert, delete, and update) occur.

**Types of Triggers:**
1. **DML Triggers** - Fire on INSERT, UPDATE, DELETE
2. **DDL Triggers** - Fire on CREATE, ALTER, DROP
3. **LOGON Triggers** - Fire when user logs in

**DML Trigger Types:**
- **AFTER Triggers** - Execute after the triggering event
- **INSTEAD OF Triggers** - Execute instead of the triggering event

```sql
-- INSTEAD OF Trigger Example
CREATE VIEW vw_EmployeeDetails AS
SELECT e.EmpId, e.EmpName, d.DeptName
FROM Employee e
INNER JOIN Department d ON e.DeptId = d.DeptId

-- INSTEAD OF trigger on view
CREATE TRIGGER tr_InsertEmployee
ON vw_EmployeeDetails
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @DeptId INT
    
    -- Get department ID
    SELECT @DeptId = DeptId FROM Department 
    WHERE DeptName = (SELECT DeptName FROM INSERTED)
    
    -- Insert into actual table
    INSERT INTO Employee (EmpName, DeptId)
    SELECT EmpName, @DeptId FROM INSERTED
END
```

## **Chapter 15: Views & Database Objects (Questions 56-60)**

### **Q43: What is a View? What are the advantages of Views?**
**Answer:**
A **View** is a VIRTUAL table which consists of a subset of data contained in single table or more than one table.

```sql
CREATE VIEW [India-Customers] AS 
SELECT CustomerName, ContactName 
FROM Customers
WHERE Country = 'India';
```

**Advantages of Views:**
1. **Indexed Views** to improve performance
2. **Extra security** - DBA can hide actual table names and expose views for Read operations only
3. **Data abstraction** - Hide complex joins from end users
4. **Simplified queries** - Complex logic encapsulated in view
5. **Consistent interface** - Standardized data access

```sql
-- Complex view example
CREATE VIEW vw_EmployeeSummary AS
SELECT 
    e.EmpId,
    e.EmpName,
    d.DeptName,
    e.Salary,
    CASE 
        WHEN e.Salary > 50000 THEN 'High'
        WHEN e.Salary > 30000 THEN 'Medium'
        ELSE 'Low'
    END AS SalaryGrade
FROM Employee e
INNER JOIN Department d ON e.DeptId = d.DeptId
WHERE e.IsActive = 1;

-- Usage
SELECT * FROM vw_EmployeeSummary WHERE SalaryGrade = 'High';
```

## **Chapter 16: ASP.NET MVC - Advanced (Questions 61-70)**

### **Q44: What is MVC? Explain MVC Life cycle.** ⭐ Very Important
**Answer:**
**MVC** is a framework for building web applications using MVC (Model View Controller) architecture.

1. **Model** represents the data
2. **View** displays the data  
3. **Controller** acts as interface between Model and View to process business logic

**MVC Request Processing Pipeline:**
1. **Routing** - URL routing determines which controller/action to call
2. **Controller Creation** - Controller instance is created
3. **Action Execution** - Action method is executed
4. **Result Execution** - ActionResult is processed
5. **View Rendering** - View is rendered and returned to client

```csharp
// MVC Controller Example
public class ProductController : Controller
{
    private readonly IProductService _productService;
    
    public ProductController(IProductService productService)
    {
        _productService = productService;
    }
    
    // Action method
    public ActionResult Index()
    {
        var products = _productService.GetAllProducts(); // Model
        return View(products); // View
    }
    
    [HttpPost]
    public ActionResult Create(Product product)
    {
        if (ModelState.IsValid)
        {
            _productService.CreateProduct(product);
            return RedirectToAction("Index");
        }
        return View(product);
    }
}
```

### **Q45: What are the different return types of a controller Action method?** ⭐ Very Important
**Answer:**
**Controller Action Return Types:**

1. **ViewResult** - Returns a view
2. **PartialViewResult** - Returns a partial view
3. **RedirectResult** - Redirects to another URL
4. **RedirectToRouteResult** - Redirects to another action
5. **ContentResult** - Returns plain text
6. **JsonResult** - Returns JSON data
7. **FileResult** - Returns a file
8. **EmptyResult** - Returns nothing

```csharp
public class ActionResultController : Controller
{
    // ViewResult
    public ActionResult Index()
    {
        return View();
    }
    
    // PartialViewResult
    public ActionResult GetPartialView()
    {
        return PartialView("_ProductList");
    }
    
    // RedirectResult
    public ActionResult RedirectToGoogle()
    {
        return Redirect("https://www.google.com");
    }
    
    // RedirectToRouteResult
    public ActionResult RedirectToHome()
    {
        return RedirectToAction("Index", "Home");
    }
    
    // JsonResult
    public ActionResult GetJsonData()
    {
        var data = new { Name = "John", Age = 30 };
        return Json(data, JsonRequestBehavior.AllowGet);
    }
    
    // ContentResult
    public ActionResult GetPlainText()
    {
        return Content("This is plain text");
    }
    
    // FileResult
    public ActionResult DownloadFile()
    {
        byte[] fileBytes = System.IO.File.ReadAllBytes(@"c:\temp\file.pdf");
        return File(fileBytes, "application/pdf", "download.pdf");
    }
}
```

### **Q46: What are Filters and their types in MVC?** ⭐ Very Important
**Answer:**
**Filters** provide a way to run code before or after specific stages in the request processing pipeline.

**Types of Filters:**
1. **Authorization Filters** - Run first, check if user is authorized
2. **Action Filters** - Run before and after action execution
3. **Result Filters** - Run before and after result execution
4. **Exception Filters** - Run when an exception occurs

```csharp
// Custom Action Filter
public class LogActionFilter : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        // Code before action execution
        var actionName = context.ActionDescriptor.ActionName;
        var controllerName = context.ActionDescriptor.ControllerDescriptor.ControllerName;
        
        System.Diagnostics.Debug.WriteLine($"Executing: {controllerName}.{actionName}");
        base.OnActionExecuting(context);
    }
    
    public override void OnActionExecuted(ActionExecutedContext context)
    {
        // Code after action execution
        System.Diagnostics.Debug.WriteLine("Action execution completed");
        base.OnActionExecuted(context);
    }
}

// Custom Authorization Filter
public class CustomAuthFilter : AuthorizeAttribute
{
    protected override bool AuthorizeCore(HttpContextBase httpContext)
    {
        // Custom authorization logic
        return httpContext.User.Identity.IsAuthenticated;
    }
}

// Usage
[LogActionFilter]
[CustomAuthFilter]
public class ProductController : Controller
{
    public ActionResult Index()
    {
        return View();
    }
}
```

### **Q47: What is Authentication and Authorization in ASP.NET MVC?** ⭐ Very Important
**Answer:**
- **Authentication** - Process of identifying WHO the user is
- **Authorization** - Process of determining WHAT the authenticated user can access

```csharp
// Authentication setup in web.config
<system.web>
    <authentication mode="Forms">
        <forms loginUrl="~/Account/Login" timeout="2880" />
    </authentication>
</system.web>

// Authorization in Controller
[Authorize] // Requires authentication
public class AdminController : Controller
{
    [Authorize(Roles = "Admin")] // Requires Admin role
    public ActionResult ManageUsers()
    {
        return View();
    }
    
    [Authorize(Users = "john@example.com")] // Specific user only
    public ActionResult SpecialAction()
    {
        return View();
    }
}

// Custom Authorization
public class CustomAuthorizeAttribute : AuthorizeAttribute
{
    protected override bool AuthorizeCore(HttpContextBase httpContext)
    {
        // Custom logic
        var user = httpContext.User;
        return user.Identity.IsAuthenticated && user.IsInRole("Manager");
    }
}
```

### **Q48: What is Output Caching in MVC? How to implement it?**
**Answer:**
**Output Caching** stores the rendered output of an action method in memory to improve performance by avoiding repeated processing.

```csharp
public class ProductController : Controller
{
    // Cache for 60 seconds
    [OutputCache(Duration = 60)]
    public ActionResult Index()
    {
        var products = GetProductsFromDatabase(); // Expensive operation
        return View(products);
    }
    
    // Cache with parameters
    [OutputCache(Duration = 300, VaryByParam = "id")]
    public ActionResult Details(int id)
    {
        var product = GetProductById(id);
        return View(product);
    }
    
    // Cache by user
    [OutputCache(Duration = 120, VaryByParam = "none", VaryByCustom = "user")]
    public ActionResult UserProfile()
    {
        var profile = GetCurrentUserProfile();
        return View(profile);
    }
    
    // Disable caching
    [OutputCache(Duration = 0, NoStore = true)]
    public ActionResult RealTimeData()
    {
        var data = GetRealTimeData();
        return Json(data, JsonRequestBehavior.AllowGet);
    }
}

// Global.asax for custom vary by
public override string GetVaryByCustomString(HttpContext context, string custom)
{
    if (custom == "user")
    {
        return context.User.Identity.Name;
    }
    return base.GetVaryByCustomString(context, custom);
}
```

### **Q49: What is Routing in MVC?**
**Answer:**
**Routing** in MVC is the process of mapping a URL request to a specific controller action.

```csharp
// Route configuration in RouteConfig.cs
public class RouteConfig
{
    public static void RegisterRoutes(RouteCollection routes)
    {
        routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
        
        // Custom route
        routes.MapRoute(
            name: "ProductDetails",
            url: "Product/{id}",
            defaults: new { controller = "Product", action = "Details" },
            constraints: new { id = @"\d+" } // Only numeric IDs
        );
        
        // Default route
        routes.MapRoute(
            name: "Default",
            url: "{controller}/{action}/{id}",
            defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
        );
    }
}
```

### **Q50: Explain Attribute Based Routing in MVC?** ⭐ Very Important
**Answer:**
**Attribute-based routing** allows you to define routes directly on controller actions using attributes.

```csharp
[RoutePrefix("api/products")]
public class ProductApiController : Controller
{
    // GET: api/products
    [Route("")]
    [HttpGet]
    public ActionResult GetAllProducts()
    {
        return Json(GetProducts(), JsonRequestBehavior.AllowGet);
    }
    
    // GET: api/products/5
    [Route("{id:int}")]
    [HttpGet]
    public ActionResult GetProduct(int id)
    {
        return Json(GetProductById(id), JsonRequestBehavior.AllowGet);
    }
    
    // POST: api/products
    [Route("")]
    [HttpPost]
    public ActionResult CreateProduct(Product product)
    {
        // Create logic
        return Json(new { success = true });
    }
    
    // GET: api/products/category/electronics
    [Route("category/{categoryName}")]
    [HttpGet]
    public ActionResult GetProductsByCategory(string categoryName)
    {
        return Json(GetProductsByCategory(categoryName), JsonRequestBehavior.AllowGet);
    }
    
    // GET: api/products/search?q=laptop&minPrice=100
    [Route("search")]
    [HttpGet]
    public ActionResult SearchProducts(string q, decimal? minPrice = null)
    {
        return Json(SearchProducts(q, minPrice), JsonRequestBehavior.AllowGet);
    }
}

// Enable attribute routing in RouteConfig
public static void RegisterRoutes(RouteCollection routes)
{
    routes.MapMvcAttributeRoutes(); // Enable attribute routing
    
    // Conventional routes...
}
```

## **Chapter 17: Web Forms & State Management (Questions 66-75)**

### **Q51: What are the different techniques for state management in ASP.NET?**
**Answer:**
**Client-side state management:**
1. **ViewState** - Stored in hidden field on page at client side
2. **Control State** - Similar to ViewState but for control-specific data
3. **Hidden Fields** - Store data in hidden form fields
4. **Cookies** - Store small amounts of data on client browser
5. **QueryString** - Pass data through URL parameters (not secure, visible to all)

**Server-side state management:**
1. **Session State** - Store user-specific data on server
2. **Application State** - Store data shared by all users
3. **Caching** - Store frequently accessed data in memory

```csharp
// ViewState example
protected void Page_Load(object sender, EventArgs e)
{
    if (!IsPostBack)
    {
        ViewState["UserName"] = "John Doe";
    }
}

protected void Button1_Click(object sender, EventArgs e)
{
    string userName = ViewState["UserName"].ToString();
}

// Session example
protected void StoreInSession()
{
    Session["UserId"] = 123;
    Session["UserName"] = "John Doe";
}

protected void RetrieveFromSession()
{
    if (Session["UserId"] != null)
    {
        int userId = (int)Session["UserId"];
        string userName = Session["UserName"].ToString();
    }
}

// Application state example
protected void Application_Start()
{
    Application["TotalVisitors"] = 0;
}

protected void IncrementVisitors()
{
    Application.Lock();
    Application["TotalVisitors"] = (int)Application["TotalVisitors"] + 1;
    Application.UnLock();
}
```

### **Q52: What is Session state? What are the different session state management modes?**
**Answer:**
**Session state** is a mechanism that enables you to store data on server side for multiple requests. It allows you to persist data between pages.

**Session State Management Modes:**
1. **In-Process Session State** - Default mode, session data stored in memory on same web server
2. **State Server Session State** - Session data stored in separate ASP.NET State Service process
3. **SQL Server Session State** - Session data stored in SQL Server database (highest reliability and scalability)

```xml
<!-- web.config session configuration -->
<system.web>
    <!-- In-Process (default) -->
    <sessionState mode="InProc" timeout="20" />
    
    <!-- State Server -->
    <sessionState mode="StateServer" 
                  stateConnectionString="tcpip=127.0.0.1:42424" 
                  timeout="20" />
    
    <!-- SQL Server -->
    <sessionState mode="SQLServer" 
                  sqlConnectionString="server=localhost;Integrated Security=true" 
                  timeout="20" />
</system.web>
```

**Session Usage:**
```csharp
// Store data in session
Session["UserInfo"] = new UserInfo { Id = 1, Name = "John" };

// Retrieve data from session
UserInfo user = Session["UserInfo"] as UserInfo;

// Check if session exists
if (Session["UserInfo"] != null)
{
    // Process user data
}

// Remove session data
Session.Remove("UserInfo");
Session.Clear(); // Remove all session data
Session.Abandon(); // End session
```

### **Q53: What is the difference between Cookies and Sessions?**
**Answer:**

| **Cookies** | **Sessions** |
|-------------|-------------|
| Stored on CLIENT side (browser) | Stored on SERVER side |
| Can persist across browser sessions | Expires when browser closes or timeout |
| Limited size (4KB per cookie) | No size limitation (limited by server memory) |
| Can be disabled by user | Cannot be disabled by user |
| Less secure (visible to user) | More secure (server-side storage) |
| Faster access (no server round trip) | Slower (requires server lookup) |

```csharp
// Cookie example
protected void SetCookie()
{
    HttpCookie cookie = new HttpCookie("UserPreference");
    cookie.Value = "Theme=Dark;Language=English";
    cookie.Expires = DateTime.Now.AddDays(30);
    Response.Cookies.Add(cookie);
}

protected void GetCookie()
{
    HttpCookie cookie = Request.Cookies["UserPreference"];
    if (cookie != null)
    {
        string preference = cookie.Value;
    }
}

// Session example (by default uses browser cookie for session ID)
protected void SetSession()
{
    Session["UserData"] = new { Name = "John", Role = "Admin" };
}

// Cookieless session (session ID passed via URL)
```

```xml
<sessionState mode="InProc" cookieless="true" timeout="20" />
<!-- URL becomes: http://site.com/(S(sessionid))/page.aspx -->
```

### **Q54: What is the difference between DataSet and DataReader?**
**Answer:**

| **DataSet** | **DataReader** |
|-------------|----------------|
| **Disconnected Architecture** - Don't need to connect always to get data | **Connected Architecture** - Directly interacting with database |
| Can update the database via DataAdapter | **Read only** - Cannot update database |
| Can hold data from multiple tables | Can read data from single result set |
| **Fast and robust** - Data will not lose in case of power failure | Less secure and not robust |
| More memory consumption | Less memory consumption |

```csharp
// DataSet Example (Disconnected)
public DataSet GetEmployeesDataSet()
{
    string connectionString = "Server=.;Database=Company;Integrated Security=true";
    using (SqlConnection connection = new SqlConnection(connectionString))
    {
        SqlDataAdapter adapter = new SqlDataAdapter("SELECT * FROM Employee", connection);
        DataSet dataSet = new DataSet();
        
        // Fill DataSet (connection opens and closes automatically)
        adapter.Fill(dataSet, "Employee");
        
        // Can work with data offline
        DataTable employeeTable = dataSet.Tables["Employee"];
        
        // Modify data
        DataRow newRow = employeeTable.NewRow();
        newRow["EmpName"] = "New Employee";
        employeeTable.Rows.Add(newRow);
        
        // Update database later
        adapter.Update(dataSet, "Employee");
        
        return dataSet;
    }
}

// DataReader Example (Connected)
public void ReadEmployeesDataReader()
{
    string connectionString = "Server=.;Database=Company;Integrated Security=true";
    using (SqlConnection connection = new SqlConnection(connectionString))
    {
        connection.Open(); // Must explicitly open connection
        
        SqlCommand command = new SqlCommand("SELECT EmpId, EmpName FROM Employee", connection);
        using (SqlDataReader reader = command.ExecuteReader())
        {
            while (reader.Read()) // Forward-only reading
            {
                int empId = reader.GetInt32("EmpId");
                string empName = reader.GetString("EmpName");
                Console.WriteLine($"ID: {empId}, Name: {empName}");
            }
        } // Reader automatically closed
    } // Connection automatically closed
}
```

### **Q55: What are the different Execute methods in ADO.NET?**
**Answer:**
**3 Main Execute Methods:**

1. **EXECUTESCALAR()** - Returns SINGLE value from database
2. **EXECUTENONQUERY()** - Used for INSERT, UPDATE, DELETE operations (returns affected rows count)
3. **EXECUTEREADER()** - Retrieves data from database (returns DataReader for SELECT operations)

```csharp
public class ADOExecuteMethods
{
    private string connectionString = "Server=.;Database=Company;Integrated Security=true";
    
    // 1. ExecuteScalar - Single value
    public int GetEmployeeCount()
    {
        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            connection.Open();
            SqlCommand command = new SqlCommand("SELECT COUNT(*) FROM Employee", connection);
            
            // Returns single value (first column of first row)
            int count = (int)command.ExecuteScalar();
            return count;
        }
    }
    
    public string GetEmployeeName(int empId)
    {
        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            connection.Open();
            SqlCommand command = new SqlCommand("SELECT EmpName FROM Employee WHERE EmpId = @EmpId", connection);
            command.Parameters.AddWithValue("@EmpId", empId);
            
            object result = command.ExecuteScalar();
            return result?.ToString();
        }
    }
    
    // 2. ExecuteNonQuery - INSERT, UPDATE, DELETE
    public int InsertEmployee(string empName, int deptId)
    {
        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            connection.Open();
            SqlCommand command = new SqlCommand(
                "INSERT INTO Employee (EmpName, DeptId) VALUES (@EmpName, @DeptId)", 
                connection);
            
            command.Parameters.AddWithValue("@EmpName", empName);
            command.Parameters.AddWithValue("@DeptId", deptId);
            
            // Returns number of affected rows
            int rowsAffected = command.ExecuteNonQuery();
            return rowsAffected;
        }
    }
    
    public int UpdateEmployeeSalary(int empId, decimal newSalary)
    {
        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            connection.Open();
            SqlCommand command = new SqlCommand(
                "UPDATE Employee SET Salary = @Salary WHERE EmpId = @EmpId", 
                connection);
            
            command.Parameters.AddWithValue("@Salary", newSalary);
            command.Parameters.AddWithValue("@EmpId", empId);
            
            return command.ExecuteNonQuery();
        }
    }
    
    // 3. ExecuteReader - SELECT operations
    public List<Employee> GetAllEmployees()
    {
        List<Employee> employees = new List<Employee>();
        
        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            connection.Open();
            SqlCommand command = new SqlCommand("SELECT EmpId, EmpName, Salary FROM Employee", connection);
            
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    employees.Add(new Employee
                    {
                        EmpId = reader.GetInt32("EmpId"),
                        EmpName = reader.GetString("EmpName"),
                        Salary = reader.GetDecimal("Salary")
                    });
                }
            }
        }
        
        return employees;
    }
}
```

### **Q56: What is ORM? What is Entity Framework?**
**Answer:**
**ORM (Object-Relational Mapper)** is for mapping objects in your application with database tables. It's like a wrapper to make database calls simple and easy.

**Entity Framework** is Microsoft's ORM framework that enables .NET developers to work with databases using .NET objects.

**Benefits of Entity Framework:**
1. **Eliminates boilerplate code** - No need to write repetitive ADO.NET code
2. **LINQ support** - Query database using LINQ
3. **Change tracking** - Automatically tracks entity changes
4. **Migration support** - Database schema versioning
5. **Multiple database support** - SQL Server, MySQL, PostgreSQL, etc.

```csharp
// Traditional ADO.NET approach
public List<Employee> GetEmployeesADO()
{
    var employees = new List<Employee>();
    using (var connection = new SqlConnection(connectionString))
    {
        connection.Open();
        var command = new SqlCommand("SELECT * FROM Employee", connection);
        using (var reader = command.ExecuteReader())
        {
            while (reader.Read())
            {
                employees.Add(new Employee
                {
                    EmpId = (int)reader["EmpId"],
                    EmpName = reader["EmpName"].ToString(),
                    Salary = (decimal)reader["Salary"]
                });
            }
        }
    }
    return employees;
}

// Entity Framework approach
public class CompanyContext : DbContext
{
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Department> Departments { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(connectionString);
    }
}

public List<Employee> GetEmployeesEF()
{
    using (var context = new CompanyContext())
    {
        // Simple LINQ query - EF generates SQL automatically
        return context.Employees
            .Where(e => e.IsActive)
            .OrderBy(e => e.EmpName)
            .ToList();
    }
}
```

### **Q57: What are the different approaches in Entity Framework?**
**Answer:**
**3 Main Approaches:**

1. **Database First** - Database is created first, then entity model is generated from it
2. **Code First** - Data model is created using C# classes, then database schema is generated
3. **Model First** - Data model is created using visual tools, then database schema is generated

```csharp
// 1. Database First - Generated from existing database
// Entities are auto-generated from database tables
public partial class Employee
{
    public int EmpId { get; set; }
    public string EmpName { get; set; }
    public int? DeptId { get; set; }
    public virtual Department Department { get; set; }
}

// 2. Code First - Define entities in code
public class Employee
{
    [Key]
    public int EmpId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string EmpName { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Salary { get; set; }
    
    public int DeptId { get; set; }
    
    [ForeignKey("DeptId")]
    public virtual Department Department { get; set; }
}

public class Department
{
    [Key]
    public int DeptId { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string DeptName { get; set; }
    
    public virtual ICollection<Employee> Employees { get; set; }
}

// DbContext for Code First
public class CompanyContext : DbContext
{
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Department> Departments { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Fluent API configuration
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Department)
            .WithMany(d => d.Employees)
            .HasForeignKey(e => e.DeptId);
    }
}

// 3. Model First - Visual designer approach (less common now)
// Uses .edmx files with visual designer
```

### **Q58: How to add records to Student table in database using EF?**
**Answer:**

```csharp
// 1. Install Entity Framework
// Install-Package EntityFramework

// 2. Create the data model for the student entity
public class Student
{
    [Key]
    public int StudentId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    public int Age { get; set; }
    
    public DateTime EnrollmentDate { get; set; }
}

// 3. Create the database context
public class SchoolContext : DbContext
{
    public DbSet<Student> Students { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Server=.;Database=School;Integrated Security=true");
    }
}

// 4. Add data to student table
public class StudentService
{
    public void AddStudent()
    {
        using (var context = new SchoolContext())
        {
            // Create new student
            var student = new Student
            {
                Name = "John Doe",
                Email = "john.doe@email.com",
                Age = 20,
                EnrollmentDate = DateTime.Now
            };
            
            // Add to context
            context.Students.Add(student);
            
            // Save changes to database
            context.SaveChanges();
            
            Console.WriteLine($"Student added with ID: {student.StudentId}");
        }
    }
    
    // Add multiple students
    public void AddMultipleStudents()
    {
        using (var context = new SchoolContext())
        {
            var students = new List<Student>
            {
                new Student { Name = "Alice Smith", Email = "alice@email.com", Age = 19, EnrollmentDate = DateTime.Now },
                new Student { Name = "Bob Johnson", Email = "bob@email.com", Age = 21, EnrollmentDate = DateTime.Now },
                new Student { Name = "Carol Brown", Email = "carol@email.com", Age = 20, EnrollmentDate = DateTime.Now }
            };
            
            context.Students.AddRange(students);
            context.SaveChanges();
            
            Console.WriteLine($"Added {students.Count} students");
        }
    }
    
    // Async version
    public async Task AddStudentAsync()
    {
        using (var context = new SchoolContext())
        {
            var student = new Student
            {
                Name = "Jane Doe",
                Email = "jane.doe@email.com",
                Age = 22,
                EnrollmentDate = DateTime.Now
            };
            
            await context.Students.AddAsync(student);
            await context.SaveChangesAsync();
            
            Console.WriteLine($"Student added asynchronously with ID: {student.StudentId}");
        }
    }
}
```

### **Q59: What is DbContext and DbSet in Entity Framework?**
**Answer:**
- **DbContext** is a class in Entity Framework that helps in creating communication between the database and the domain/entity class
- **DbSet** class represents an entity set that can be used for create, read, update, and delete operations

```csharp
// DbContext example
public class CompanyContext : DbContext
{
    // DbSet properties - represent tables
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<Project> Projects { get; set; }
    
    // Connection configuration
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Server=.;Database=Company;Integrated Security=true");
    }
    
    // Model configuration
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure relationships
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Department)
            .WithMany(d => d.Employees)
            .HasForeignKey(e => e.DeptId);
        
        // Configure table names
        modelBuilder.Entity<Employee>().ToTable("tbl_Employee");
        
        // Configure properties
        modelBuilder.Entity<Employee>()
            .Property(e => e.Salary)
            .HasColumnType("decimal(18,2)");
    }
}

// Using DbContext and DbSet
public class EmployeeService
{
    public void CRUDOperations()
    {
        using (var context = new CompanyContext())
        {
            // CREATE - Add new employee
            var newEmployee = new Employee
            {
                EmpName = "John Doe",
                Salary = 50000,
                DeptId = 1
            };
            context.Employees.Add(newEmployee);
            context.SaveChanges();
            
            // READ - Get employees
            var employees = context.Employees
                .Where(e => e.Salary > 40000)
                .Include(e => e.Department) // Eager loading
                .ToList();
            
            // UPDATE - Modify employee
            var employee = context.Employees.Find(1);
            if (employee != null)
            {
                employee.Salary = 55000;
                context.SaveChanges();
            }
            
            // DELETE - Remove employee
            var empToDelete = context.Employees.Find(2);
            if (empToDelete != null)
            {
                context.Employees.Remove(empToDelete);
                context.SaveChanges();
            }
        }
    }
    
    // Async operations
    public async Task AsyncOperations()
    {
        using (var context = new CompanyContext())
        {
            // Async read
            var employees = await context.Employees
                .Where(e => e.IsActive)
                .ToListAsync();
            
            // Async add
            var newEmployee = new Employee { EmpName = "Jane Smith", Salary = 60000 };
            await context.Employees.AddAsync(newEmployee);
            await context.SaveChangesAsync();
        }
    }
}
```

### **Q60: What is the difference between .NET Framework and .NET Core?** ⭐ Very Important
**Answer:**

| **.NET Framework** | **.NET Core** |
|-------------------|---------------|
| Windows only | **Cross-platform** (Windows, Linux, macOS) |
| Monolithic framework | **Modular** - Install only what you need |
| System-wide installation | **Side-by-side** deployment |
| Closed source | **Open source** |
| Larger memory footprint | **Lightweight** and faster |
| IIS dependency | **Self-hosted** or multiple web servers |
| Full .NET API surface | **Subset of .NET Framework APIs** |
| Windows-specific features | **Cloud-optimized** |

```csharp
// .NET Framework project structure (Web.config based)
public class Global : HttpApplication
{
    protected void Application_Start()
    {
        RouteConfig.RegisterRoutes(RouteTable.Routes);
        BundleConfig.RegisterBundles(BundleTable.Bundles);
    }
}

// .NET Core project structure (Startup.cs based)
public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }
    
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
}

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Dependency injection configuration
        services.AddControllers();
        services.AddScoped<IUserService, UserService>();
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // Request pipeline configuration
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        
        app.UseRouting();
        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}

// .NET 5/6+ - Unified platform
// .NET 5 is the next major release after .NET Core 3.1
// The word 'Core' is dropped to emphasize that .NET 5+ is the future
// Recently, Microsoft has introduced .NET 6, .NET 7, .NET 8
```

### **Q61: What is Metapackage in .NET Core?**
**Answer:**
**Metapackage** is a consolidated package of many dependencies.

```csharp
// Example: Microsoft.AspNetCore.All metapackage includes:
// - Microsoft.AspNetCore
// - Microsoft.AspNetCore.Authentication
// - Microsoft.AspNetCore.Authorization
// - Microsoft.AspNetCore.Mvc
// - Microsoft.EntityFrameworkCore
// - And many more...

// In .csproj file
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
  </PropertyGroup>
  
  <ItemGroup>
    <!-- Instead of adding individual packages -->
    <PackageReference Include="Microsoft.AspNetCore.All" Version="2.1.0" />
    
    <!-- Or use the newer approach with individual packages -->
    <PackageReference Include="Microsoft.AspNetCore.Mvc" Version="6.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="6.0.0" />
  </ItemGroup>
</Project>

// Benefits of Metapackages:
// 1. Simplified package management
// 2. Version compatibility guaranteed
// 3. Reduced package reference complexity
// 4. Easier project setup

// Note: In newer .NET versions, explicit metapackages are less common
// The SDK includes most common packages by default
```

### **Q62: What is Dependency Injection? What are the advantages?** ⭐ Very Important
**Answer:**
**Dependency Injection (DI)** is a software design pattern in which we inject the dependency object of a class into another class.

**Advantages of Dependency Injection:**
1. **Flexibility** - DI allows you to easily change the behavior of an application without modifying its code
2. **Easier unit testing** - DI makes it easy to unit test your code by allowing you to easily replace real dependencies with mock objects
3. **Independent modules** - By separating dependencies, it becomes easier to make changes to your code without affecting the rest of the system
4. **Reusability** - DI promotes reuse of components by making them independent of their environment

```csharp
// Without Dependency Injection (Tightly Coupled)
public class OrderService
{
    private EmailService _emailService; // Direct dependency
    private DatabaseService _databaseService; // Direct dependency
    
    public OrderService()
    {
        _emailService = new EmailService(); // Hard-coded dependency
        _databaseService = new DatabaseService(); // Hard-coded dependency
    }
    
    public void ProcessOrder(Order order)
    {
        _databaseService.SaveOrder(order);
        _emailService.SendConfirmation(order.CustomerEmail);
    }
}

// With Dependency Injection (Loosely Coupled)
public interface IEmailService
{
    void SendConfirmation(string email);
}

public interface IDatabaseService
{
    void SaveOrder(Order order);
}

public class OrderService
{
    private readonly IEmailService _emailService;
    private readonly IDatabaseService _databaseService;
    
    // Dependencies injected through constructor
    public OrderService(IEmailService emailService, IDatabaseService databaseService)
    {
        _emailService = emailService;
        _databaseService = databaseService;
    }
    
    public void ProcessOrder(Order order)
    {
        _databaseService.SaveOrder(order);
        _emailService.SendConfirmation(order.CustomerEmail);
    }
}

// Service Registration in Startup.cs
public void ConfigureServices(IServiceCollection services)
{
    // Register services with different lifetimes
    services.AddScoped<IEmailService, EmailService>();
    services.AddScoped<IDatabaseService, DatabaseService>();
    services.AddScoped<OrderService>();
}

// Service Lifetimes
public void ConfigureServiceLifetimes(IServiceCollection services)
{
    // Singleton - Single instance for entire application lifetime
    services.AddSingleton<IConfiguration, Configuration>();
    services.AddSingleton<ILogger, FileLogger>();
    
    // Scoped - Single instance per HTTP request
    services.AddScoped<IUserService, UserService>();
    services.AddScoped<IOrderService, OrderService>();
    
    // Transient - New instance every time requested
    services.AddTransient<IEmailService, EmailService>();
    services.AddTransient<IGuidGenerator, GuidGenerator>();
}

// Controller with DI
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;
    
    public OrdersController(OrderService orderService)
    {
        _orderService = orderService; // Injected automatically
    }
    
    [HttpPost]
    public ActionResult CreateOrder(Order order)
    {
        _orderService.ProcessOrder(order);
        return Ok();
    }
}

// Unit Testing with DI (using Moq)
[Test]
public void ProcessOrder_ShouldSaveAndSendEmail()
{
    // Arrange
    var mockEmailService = new Mock<IEmailService>();
    var mockDatabaseService = new Mock<IDatabaseService>();
    var orderService = new OrderService(mockEmailService.Object, mockDatabaseService.Object);
    
    var order = new Order { CustomerEmail = "test@example.com" };
    
    // Act
    orderService.ProcessOrder(order);
    
    // Assert
    mockDatabaseService.Verify(x => x.SaveOrder(order), Times.Once);
    mockEmailService.Verify(x => x.SendConfirmation("test@example.com"), Times.Once);
}
```

### **Q63: How to use Dependency Injection in Views in ASP.NET Core?**
**Answer:**
You can inject services directly into Razor views using the `@inject` directive.

```csharp
// Service interface and implementation
public interface IViewDataService
{
    string GetWelcomeMessage();
    List<string> GetNavigationItems();
    UserInfo GetCurrentUser();
}

public class ViewDataService : IViewDataService
{
    public string GetWelcomeMessage()
    {
        return $"Welcome! Today is {DateTime.Now:dddd, MMMM dd, yyyy}";
    }
    
    public List<string> GetNavigationItems()
    {
        return new List<string> { "Home", "Products", "About", "Contact" };
    }
    
    public UserInfo GetCurrentUser()
    {
        return new UserInfo { Name = "John Doe", Role = "Admin" };
    }
}

// Register service in Startup.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddScoped<IViewDataService, ViewDataService>();
    services.AddControllersWithViews();
}

// Using @inject in Razor view
@inject IViewDataService ViewDataService
@{
    ViewData["Title"] = "Home Page";
    var welcomeMessage = ViewDataService.GetWelcomeMessage();
    var navigationItems = ViewDataService.GetNavigationItems();
    var currentUser = ViewDataService.GetCurrentUser();
}

<div class="container">
    <h1>@welcomeMessage</h1>
    
    <div class="user-info">
        <p>Logged in as: <strong>@currentUser.Name</strong> (@currentUser.Role)</p>
    </div>
    
    <nav>
        <ul class="nav-list">
            @foreach (var item in navigationItems)
            {
                <li><a href="/@item.ToLower()">@item</a></li>
            }
        </ul>
    </nav>
</div>

// Alternative: Using IServiceProvider
@inject IServiceProvider ServiceProvider
@{
    var emailService = ServiceProvider.GetService<IEmailService>();
    var userService = ServiceProvider.GetRequiredService<IUserService>();
}

// Partial view with DI
@* _UserProfile.cshtml *@
@inject IUserService UserService
@{
    var userProfile = await UserService.GetCurrentUserProfileAsync();
}

<div class="user-profile">
    <img src="@userProfile.AvatarUrl" alt="@userProfile.Name" />
    <h3>@userProfile.Name</h3>
    <p>@userProfile.Email</p>
</div>

// Layout with DI
@* _Layout.cshtml *@
@inject IConfiguration Configuration
@inject IWebHostEnvironment Environment
<!DOCTYPE html>
<html>
<head>
    <title>@ViewData["Title"] - @Configuration["AppSettings:AppName"]</title>
    @if (Environment.IsDevelopment())
    {
        <link rel="stylesheet" href="~/css/site.dev.css" />
    }
    else
    {
        <link rel="stylesheet" href="~/css/site.min.css" />
    }
</head>
<body>
    @RenderBody()
</body>
</html>
```
### **Q64: What is the difference between IEnumerable and IQueryable in C#? Why to use IQueryable for SQL queries?** ⭐ Very Important
**Answer:**

| **IEnumerable** | **IQueryable** |
|----------------|----------------|
| Used with in-memory collection | Better for getting result from database |
| Brings all results from database then filters at code side | Filters result at database only |
| Network load and performance issue | Less network load and better performance |
| System.Collections namespace | System.Linq namespace |

**IQueryable** inherited from IEnumerable interface, so anything you can do with IEnumerable, you can also do with IQueryable.

```csharp
// IEnumerable - loads all data then filters (BAD for large datasets)
IEnumerable<User> users = context.Users.AsEnumerable();
var activeUsers = users.Where(u => u.IsActive); // Filters in memory

// IQueryable - filters at database level (GOOD)
IQueryable<User> usersQuery = context.Users;
var activeUsersQuery = usersQuery.Where(u => u.IsActive); // Filters in SQL

// Example with performance difference
public class UserService
{
    // BAD: IEnumerable approach
    public List<User> GetActiveUsersIEnumerable()
    {
        using (var context = new AppContext())
        {
            // This loads ALL users into memory first
            IEnumerable<User> allUsers = context.Users.AsEnumerable();
            
            // Then filters in C# code (inefficient)
            return allUsers.Where(u => u.IsActive && u.Age > 18).ToList();
        }
        // SQL Generated: SELECT * FROM Users
        // Then filtering happens in C# memory
    }
    
    // GOOD: IQueryable approach
    public List<User> GetActiveUsersIQueryable()
    {
        using (var context = new AppContext())
        {
            // This creates a query expression
            IQueryable<User> query = context.Users;
            
            // Builds the query (not executed yet)
            query = query.Where(u => u.IsActive && u.Age > 18);
            
            // Executes optimized SQL query
            return query.ToList();
        }
        // SQL Generated: SELECT * FROM Users WHERE IsActive = 1 AND Age > 18
    }
}
```

## **Chapter 7: OOPS & C# - Constructors (Questions 65-70)**

### **Q65: What is a Constructor? When to use constructor in real applications?**
**Answer:**
**Constructor** is a special method that is automatically called when an object is created.

**When to use constructors in real applications:**
1. **Initialize required properties** - Set mandatory values
2. **Dependency injection** - Inject required services
3. **Validation** - Ensure object is in valid state
4. **Resource allocation** - Open connections, files, etc.

```csharp
public class Employee
{
    public int EmpId { get; set; }
    public string EmpName { get; set; }
    public decimal Salary { get; set; }
    public DateTime HireDate { get; set; }
    
    // Default constructor
    public Employee()
    {
        HireDate = DateTime.Now; // Set default hire date
    }
    
    // Parameterized constructor
    public Employee(string empName, decimal salary)
    {
        if (string.IsNullOrEmpty(empName))
            throw new ArgumentException("Employee name cannot be empty");
        if (salary <= 0)
            throw new ArgumentException("Salary must be positive");
            
        EmpName = empName;
        Salary = salary;
        HireDate = DateTime.Now;
    }
    
    // Constructor with dependency injection
    public Employee(string empName, decimal salary, ILogger logger)
    {
        EmpName = empName;
        Salary = salary;
        HireDate = DateTime.Now;
        logger.Log($"Employee {empName} created with salary {salary}");
    }
}

// Real-world example: Database connection class
public class DatabaseConnection
{
    private readonly string _connectionString;
    private readonly ILogger _logger;
    
    public DatabaseConnection(string connectionString, ILogger logger)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        
        // Validate connection string
        if (!IsValidConnectionString(_connectionString))
            throw new ArgumentException("Invalid connection string");
            
        _logger.Log("Database connection initialized");
    }
    
    private bool IsValidConnectionString(string connectionString)
    {
        // Validation logic
        return !string.IsNullOrEmpty(connectionString) && connectionString.Contains("Server=");
    }
}
```

### **Q66: What are the types of constructors in C#?**
**Answer:**
**5 Types of Constructors:**

1. **Default Constructor** - No parameters
2. **Parameterized Constructor** - With parameters
3. **Copy Constructor** - Creates object from another object
4. **Static Constructor** - Initializes static members
5. **Private Constructor** - Prevents external instantiation

```csharp
public class ConstructorTypes
{
    public string Name { get; set; }
    public int Age { get; set; }
    private static int _instanceCount;
    
    // 1. Default Constructor
    public ConstructorTypes()
    {
        Name = "Unknown";
        Age = 0;
        _instanceCount++;
    }
    
    // 2. Parameterized Constructor
    public ConstructorTypes(string name, int age)
    {
        Name = name;
        Age = age;
        _instanceCount++;
    }
    
    // 3. Copy Constructor
    public ConstructorTypes(ConstructorTypes other)
    {
        Name = other.Name;
        Age = other.Age;
        _instanceCount++;
    }
    
    // 4. Static Constructor (called once when class is first used)
    static ConstructorTypes()
    {
        _instanceCount = 0;
        Console.WriteLine("Static constructor called");
    }
    
    // 5. Private Constructor (Singleton pattern)
    private ConstructorTypes(bool isPrivate)
    {
        Name = "Private Instance";
        Age = 0;
    }
    
    public static ConstructorTypes CreatePrivateInstance()
    {
        return new ConstructorTypes(true);
    }
}

// Usage examples
public class ConstructorDemo
{
    public static void Demo()
    {
        // Default constructor
        var obj1 = new ConstructorTypes();
        
        // Parameterized constructor
        var obj2 = new ConstructorTypes("John", 25);
        
        // Copy constructor
        var obj3 = new ConstructorTypes(obj2);
        
        // Private constructor (through factory method)
        var obj4 = ConstructorTypes.CreatePrivateInstance();
    }
}
```

### **Q67: What is Constructor Chaining in C#?**
**Answer:**
**Constructor Chaining** is calling one constructor from another constructor using `this` or `base` keyword.

```csharp
public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int Age { get; set; }
    public DateTime CreatedDate { get; set; }
    
    // Primary constructor with all parameters
    public Person(string firstName, string lastName, int age)
    {
        FirstName = firstName;
        LastName = lastName;
        Age = age;
        CreatedDate = DateTime.Now;
        Console.WriteLine("Primary constructor called");
    }
    
    // Constructor chaining using 'this' keyword
    public Person(string firstName, string lastName) : this(firstName, lastName, 0)
    {
        Console.WriteLine("Two-parameter constructor called");
    }
    
    // Constructor chaining using 'this' keyword
    public Person(string firstName) : this(firstName, "Unknown", 0)
    {
        Console.WriteLine("One-parameter constructor called");
    }
    
    // Default constructor chaining
    public Person() : this("Unknown", "Unknown", 0)
    {
        Console.WriteLine("Default constructor called");
    }
}

// Inheritance with constructor chaining
public class Employee : Person
{
    public string EmployeeId { get; set; }
    public decimal Salary { get; set; }
    
    // Constructor chaining using 'base' keyword
    public Employee(string firstName, string lastName, int age, string employeeId, decimal salary)
        : base(firstName, lastName, age) // Calls parent constructor
    {
        EmployeeId = employeeId;
        Salary = salary;
        Console.WriteLine("Employee constructor called");
    }
    
    // Chaining to another constructor in same class
    public Employee(string firstName, string lastName, string employeeId)
        : this(firstName, lastName, 0, employeeId, 0)
    {
        Console.WriteLine("Employee simplified constructor called");
    }
}

// Usage
public class ConstructorChainingDemo
{
    public static void Demo()
    {
        // This will call: Default -> One-parameter -> Two-parameter -> Primary
        var person = new Person();
        
        // This will call: Employee simplified -> Employee full -> Person primary
        var employee = new Employee("John", "Doe", "EMP001");
    }
}
```

### **Q68: What is the difference between Constructor and Method?**
**Answer:**

| **Constructor** | **Method** |
|----------------|------------|
| **Special method** called automatically when object is created | **Regular method** called explicitly |
| **Same name** as class name | **Any name** can be given |
| **No return type** (not even void) | **Must have return type** (void or specific type) |
| **Cannot be inherited** | **Can be inherited** |
| **Cannot be virtual, abstract, or override** | **Can be virtual, abstract, or override** |
| **Used for initialization** | **Used for functionality** |

```csharp
public class ConstructorVsMethod
{
    private string _name;
    private int _age;
    
    // CONSTRUCTOR
    public ConstructorVsMethod(string name, int age) // No return type
    {
        _name = name; // Initialization
        _age = age;   // Initialization
        Console.WriteLine("Constructor called - Object initialized");
    }
    
    // METHOD
    public void SetName(string name) // Has return type (void)
    {
        _name = name; // Functionality
        Console.WriteLine("SetName method called");
    }
    
    // METHOD with return type
    public string GetFullInfo() // Returns string
    {
        return $"Name: {_name}, Age: {_age}"; // Functionality
    }
    
    // METHOD can be virtual
    public virtual void DisplayInfo()
    {
        Console.WriteLine($"Name: {_name}, Age: {_age}");
    }
    
    // Constructor CANNOT be virtual (this would cause compilation error)
    // public virtual ConstructorVsMethod() { } // ERROR!
}

// Usage comparison
public class Demo
{
    public static void Main()
    {
        // Constructor called automatically during object creation
        var obj = new ConstructorVsMethod("John", 25); // Constructor executes
        
        // Methods called explicitly
        obj.SetName("Jane");        // Method call
        string info = obj.GetFullInfo(); // Method call with return value
        obj.DisplayInfo();          // Method call
    }
}
```

### **Q69: Can we have multiple constructors in a class?**
**Answer:**
**Yes**, we can have multiple constructors in a class. This is called **Constructor Overloading**.

```csharp
public class Student
{
    public int StudentId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public int Age { get; set; }
    public string Course { get; set; }
    
    // Constructor 1: Default constructor
    public Student()
    {
        StudentId = 0;
        Name = "Unknown";
        Email = "unknown@email.com";
        Age = 18;
        Course = "General";
    }
    
    // Constructor 2: With ID and Name
    public Student(int studentId, string name)
    {
        StudentId = studentId;
        Name = name;
        Email = "unknown@email.com";
        Age = 18;
        Course = "General";
    }
    
    // Constructor 3: With ID, Name, and Email
    public Student(int studentId, string name, string email)
    {
        StudentId = studentId;
        Name = name;
        Email = email;
        Age = 18;
        Course = "General";
    }
    
    // Constructor 4: With all parameters
    public Student(int studentId, string name, string email, int age, string course)
    {
        StudentId = studentId;
        Name = name;
        Email = email;
        Age = age;
        Course = course;
    }
    
    // Constructor 5: Copy constructor
    public Student(Student other)
    {
        StudentId = other.StudentId;
        Name = other.Name;
        Email = other.Email;
        Age = other.Age;
        Course = other.Course;
    }
}

// Real-world example: Database connection with multiple options
public class DatabaseConnection
{
    public string Server { get; set; }
    public string Database { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public int Timeout { get; set; }
    
    // Constructor 1: Windows Authentication
    public DatabaseConnection(string server, string database)
    {
        Server = server;
        Database = database;
        Username = null; // Windows Auth
        Password = null; // Windows Auth
        Timeout = 30;
    }
    
    // Constructor 2: SQL Server Authentication
    public DatabaseConnection(string server, string database, string username, string password)
    {
        Server = server;
        Database = database;
        Username = username;
        Password = password;
        Timeout = 30;
    }
    
    // Constructor 3: With custom timeout
    public DatabaseConnection(string server, string database, string username, string password, int timeout)
    {
        Server = server;
        Database = database;
        Username = username;
        Password = password;
        Timeout = timeout;
    }
    
    // Constructor 4: From connection string
    public DatabaseConnection(string connectionString)
    {
        ParseConnectionString(connectionString);
        Timeout = 30;
    }
    
    private void ParseConnectionString(string connectionString)
    {
        // Parse connection string logic
        var parts = connectionString.Split(';');
        foreach (var part in parts)
        {
            var keyValue = part.Split('=');
            if (keyValue.Length == 2)
            {
                switch (keyValue[0].Trim().ToLower())
                {
                    case "server":
                        Server = keyValue[1].Trim();
                        break;
                    case "database":
                        Database = keyValue[1].Trim();
                        break;
                    // Add more parsing logic
                }
            }
        }
    }
}

// Usage examples
public class ConstructorOverloadingDemo
{
    public static void Demo()
    {
        // Using different constructors
        var student1 = new Student(); // Default
        var student2 = new Student(1, "John"); // ID and Name
        var student3 = new Student(2, "Jane", "jane@email.com"); // ID, Name, Email
        var student4 = new Student(3, "Bob", "bob@email.com", 20, "Computer Science"); // All parameters
        var student5 = new Student(student4); // Copy constructor
        
        // Database connection examples
        var db1 = new DatabaseConnection("localhost", "MyDB"); // Windows Auth
        var db2 = new DatabaseConnection("localhost", "MyDB", "user", "pass"); // SQL Auth
        var db3 = new DatabaseConnection("Server=localhost;Database=MyDB;Integrated Security=true"); // Connection string
    }
}
```

### **Q70: What is Static Constructor? When to use it?**
**Answer:**
**Static Constructor** is used to initialize static members of a class. It's called automatically before any static member is accessed or any instance is created.

**Characteristics:**
- Called only **once** during application lifetime
- **No access modifiers** (public, private, etc.)
- **No parameters**
- **Cannot be called explicitly**
- Executes before any instance constructor

```csharp
public class ConfigurationManager
{
    public static string DatabaseConnectionString { get; private set; }
    public static string ApiBaseUrl { get; private set; }
    public static Dictionary<string, string> AppSettings { get; private set; }
    private static readonly object _lock = new object();
    
    // Static constructor - called once when class is first used
    static ConfigurationManager()
    {
        Console.WriteLine("Static constructor called - Loading configuration...");
        
        // Initialize static members
        LoadConfiguration();
        
        Console.WriteLine("Configuration loaded successfully");
    }
    
    // Instance constructor
    public ConfigurationManager()
    {
        Console.WriteLine("Instance constructor called");
    }
    
    private static void LoadConfiguration()
    {
        // Simulate loading configuration from file/database
        DatabaseConnectionString = "Server=localhost;Database=MyApp;Integrated Security=true";
        ApiBaseUrl = "https://api.myapp.com";
        
        AppSettings = new Dictionary<string, string>
        {
            { "MaxRetries", "3" },
            { "TimeoutSeconds", "30" },
            { "EnableLogging", "true" }
        };
    }
    
    public static string GetSetting(string key)
    {
        return AppSettings.ContainsKey(key) ? AppSettings[key] : null;
    }
}

// Real-world example: Logger with static initialization
public class Logger
{
    private static string _logFilePath;
    private static StreamWriter _logWriter;
    private static readonly object _lockObject = new object();
    
    // Static constructor - initialize logging infrastructure
    static Logger()
    {
        try
        {
            // Create logs directory if it doesn't exist
            string logsDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
            Directory.CreateDirectory(logsDirectory);
            
            // Set log file path with timestamp
            _logFilePath = Path.Combine(logsDirectory, $"app_{DateTime.Now:yyyyMMdd}.log");
            
            // Initialize log writer
            _logWriter = new StreamWriter(_logFilePath, append: true);
            _logWriter.AutoFlush = true;
            
            // Log initialization
            _logWriter.WriteLine($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Logger initialized");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to initialize logger: {ex.Message}");
        }
    }
    
    public static void Log(string message)
    {
        lock (_lockObject)
        {
            try
            {
                _logWriter?.WriteLine($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Logging failed: {ex.Message}");
            }
        }
    }
    
    public static void LogError(string message, Exception exception)
    {
        Log($"ERROR: {message} - {exception}");
    }
}

// Example: Database connection pool with static initialization
public class ConnectionPool
{
    private static readonly Queue<IDbConnection> _connections;
    private static readonly string _connectionString;
    private static readonly int _poolSize;
    
    // Static constructor - initialize connection pool
    static ConnectionPool()
    {
        Console.WriteLine("Initializing connection pool...");
        
        _connectionString = ConfigurationManager.DatabaseConnectionString;
        _poolSize = int.Parse(ConfigurationManager.GetSetting("ConnectionPoolSize") ?? "10");
        _connections = new Queue<IDbConnection>();
        
        // Pre-create connections
        for (int i = 0; i < _poolSize; i++)
        {
            var connection = new SqlConnection(_connectionString);
            _connections.Enqueue(connection);
        }
        
        Console.WriteLine($"Connection pool initialized with {_poolSize} connections");
    }
    
    public static IDbConnection GetConnection()
    {
        lock (_connections)
        {
            if (_connections.Count > 0)
            {
                return _connections.Dequeue();
            }
            
            // Create new connection if pool is empty
            return new SqlConnection(_connectionString);
        }
    }
    
    public static void ReturnConnection(IDbConnection connection)
    {
        lock (_connections)
        {
            if (_connections.Count < _poolSize)
            {
                _connections.Enqueue(connection);
            }
            else
            {
                connection.Dispose(); // Dispose excess connections
            }
        }
    }
}

// Usage demonstration
public class StaticConstructorDemo
{
    public static void Main()
    {
        Console.WriteLine("Application started");
        
        // First access to ConfigurationManager triggers static constructor
        string dbConnection = ConfigurationManager.DatabaseConnectionString;
        Console.WriteLine($"DB Connection: {dbConnection}");
        
        // Static constructor already called, won't be called again
        string apiUrl = ConfigurationManager.ApiBaseUrl;
        Console.WriteLine($"API URL: {apiUrl}");
        
        // Logger static constructor called on first use
        Logger.Log("Application started successfully");
        
        // Connection pool static constructor called on first use
        var connection = ConnectionPool.GetConnection();
        Console.WriteLine("Got connection from pool");
        
        // Create instances (instance constructors called)
        var config1 = new ConfigurationManager();
        var config2 = new ConfigurationManager();
    }
}
```

## **Chapter 8: Web API & HTTP (Questions 71-80)**

### **Q71: What is Web API? What are the advantages of Web API?**
**Answer:**
**Web API** is a framework for building HTTP-based services that can be consumed by various clients like web applications, mobile apps, and desktop applications.

**Advantages of Web API:**
1. **Platform Independent** - Can be consumed by any client that supports HTTP
2. **Lightweight** - Uses standard HTTP protocols
3. **Multiple formats** - Supports JSON, XML, and other formats
4. **RESTful** - Follows REST architectural principles
5. **Testable** - Easy to test using tools like Postman
6. **Scalable** - Can handle multiple concurrent requests

```csharp
// Web API Controller example
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    
    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }
    
    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        var products = await _productService.GetAllProductsAsync();
        return Ok(products);
    }
    
    // GET: api/products/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        
        if (product == null)
        {
            return NotFound($"Product with ID {id} not found");
        }
        
        return Ok(product);
    }
    
    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var product = await _productService.CreateProductAsync(productDto);
        
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }
    
    // PUT: api/products/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto productDto)
    {
        if (id != productDto.Id)
        {
            return BadRequest("ID mismatch");
        }
        
        var updated = await _productService.UpdateProductAsync(productDto);
        
        if (!updated)
        {
            return NotFound($"Product with ID {id} not found");
        }
        
        return NoContent();
    }
    
    // DELETE: api/products/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var deleted = await _productService.DeleteProductAsync(id);
        
        if (!deleted)
        {
            return NotFound($"Product with ID {id} not found");
        }
        
        return NoContent();
    }
    
    // GET: api/products/search?name=laptop&category=electronics
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Product>>> SearchProducts(
        [FromQuery] string name = null,
        [FromQuery] string category = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null)
    {
        var products = await _productService.SearchProductsAsync(name, category, minPrice, maxPrice);
        return Ok(products);
    }
}

// Product models
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public DateTime CreatedDate { get; set; }
}

public class CreateProductDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    
    [StringLength(500)]
    public string Description { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Required]
    public string Category { get; set; }
}

public class UpdateProductDto
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    
    [StringLength(500)]
    public string Description { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Required]
    public string Category { get; set; }
}

// Startup configuration
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddScoped<IProductService, ProductService>();
        
        // Add Swagger for API documentation
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Products API", Version = "v1" });
        });
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Products API v1"));
        }
        
        app.UseRouting();
        app.UseAuthorization();
        
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
```

### **Q72: What is the difference between HttpResponseMessage and IHttpActionResult?**
**Answer:**
In Web API version 2.0, **IHttpActionResult/IActionResult** was introduced as a replacement for **HttpResponseMessage**.

**Benefits of IHttpActionResult:**
1. **Readability** - More readable with simple methods like `NotFound()` and `Ok()`
2. **Testability** - Easier to test and mock return values
3. **Flexibility** - Easy customization without manual HttpResponseMessage construction

```csharp
// OLD WAY: Using HttpResponseMessage (Web API 1.0)
public class ProductsControllerOld : ApiController
{
    public HttpResponseMessage GetProduct(int id)
    {
        var product = GetProductFromDatabase(id);
        
        if (product == null)
        {
            // Manual HttpResponseMessage creation
            return Request.CreateResponse(HttpStatusCode.NotFound, 
                new { Message = $"Product with ID {id} not found" });
        }
        
        // Manual HttpResponseMessage creation
        return Request.CreateResponse(HttpStatusCode.OK, product);
    }
    
    public HttpResponseMessage CreateProduct(Product product)
    {
        if (product == null)
        {
            return Request.CreateResponse(HttpStatusCode.BadRequest, 
                new { Message = "Product data is required" });
        }
        
        try
        {
            var createdProduct = SaveProductToDatabase(product);
            
            var response = Request.CreateResponse(HttpStatusCode.Created, createdProduct);
            response.Headers.Location = new Uri(Request.RequestUri, $"/api/products/{createdProduct.Id}");
            
            return response;
        }
        catch (Exception ex)
        {
            return Request.CreateResponse(HttpStatusCode.InternalServerError, 
                new { Message = "Error creating product", Error = ex.Message });
        }
    }
}

// NEW WAY: Using IHttpActionResult/IActionResult (Web API 2.0+)
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // Much cleaner and more readable
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await GetProductFromDatabaseAsync(id);
        
        if (product == null)
        {
            return NotFound($"Product with ID {id} not found"); // Simple and clean
        }
        
        return Ok(product); // Simple and clean
    }
    
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        if (product == null)
        {
            return BadRequest("Product data is required"); // Simple validation
        }
        
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState); // Automatic model validation
        }
        
        try
        {
            var createdProduct = await SaveProductToDatabaseAsync(product);
            
            // CreatedAtAction automatically sets location header
            return CreatedAtAction(nameof(GetProduct), 
                new { id = createdProduct.Id }, createdProduct);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error creating product", Error = ex.Message });
        }
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {
        if (id != product.Id)
        {
            return BadRequest("ID mismatch");
        }
        
        var existingProduct = await GetProductFromDatabaseAsync(id);
        if (existingProduct == null)
        {
            return NotFound();
        }
        
        await UpdateProductInDatabaseAsync(product);
        
        return NoContent(); // 204 No Content for successful update
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await GetProductFromDatabaseAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        
        await DeleteProductFromDatabaseAsync(id);
        
        return NoContent(); // 204 No Content for successful deletion
    }
    
    // Custom ActionResult example
    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<Product>>> GetFeaturedProducts()
    {
        var products = await GetFeaturedProductsAsync();
        
        if (!products.Any())
        {
            return Ok(new List<Product>()); // Return empty list instead of NotFound
        }
        
        return Ok(products);
    }
    
    // File download example
    [HttpGet("{id}/image")]
    public async Task<IActionResult> GetProductImage(int id)
    {
        var product = await GetProductFromDatabaseAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        
        var imageBytes = await GetProductImageAsync(id);
        if (imageBytes == null)
        {
            return NotFound("Product image not found");
        }
        
        return File(imageBytes, "image/jpeg", $"product_{id}.jpg");
    }
}

// Custom ActionResult for complex scenarios
public class CustomActionResult : IActionResult
{
    private readonly object _data;
    private readonly HttpStatusCode _statusCode;
    
    public CustomActionResult(object data, HttpStatusCode statusCode)
    {
        _data = data;
        _statusCode = statusCode;
    }
    
    public async Task ExecuteResultAsync(ActionContext context)
    {
        var response = context.HttpContext.Response;
        response.StatusCode = (int)_statusCode;
        response.ContentType = "application/json";
        
        var json = JsonSerializer.Serialize(_data);
        await response.WriteAsync(json);
    }
}

// Unit testing comparison
[TestClass]
public class ProductsControllerTests
{
    // Testing IActionResult (EASY)
    [TestMethod]
    public async Task GetProduct_ReturnsNotFound_WhenProductDoesNotExist()
    {
        // Arrange
        var controller = new ProductsController(mockService.Object);
        
        // Act
        var result = await controller.GetProduct(999);
        
        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(NotFoundObjectResult));
        var notFoundResult = result.Result as NotFoundObjectResult;
        Assert.AreEqual("Product with ID 999 not found", notFoundResult.Value);
    }
    
    // Testing HttpResponseMessage (MORE COMPLEX)
    [TestMethod]
    public void GetProduct_Old_ReturnsNotFound_WhenProductDoesNotExist()
    {
        // Arrange
        var controller = new ProductsControllerOld();
        controller.Request = new HttpRequestMessage();
        controller.Configuration = new HttpConfiguration();
        
        // Act
        var response = controller.GetProduct(999);
        
        // Assert
        Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);
        // More complex assertion for content...
    }
}
```

### **Q73: What are HTTP Status Codes? List important status codes.**
**Answer:**
**HTTP Status Codes** are three-digit numbers that indicate the result of an HTTP request.

**Categories:**
- **1xx** - Informational responses
- **2xx** - Success responses
- **3xx** - Redirection responses
- **4xx** - Client error responses
- **5xx** - Server error responses

```csharp
// Important HTTP Status Codes in Web API
[ApiController]
[Route("api/[controller]")]
public class StatusCodeExamplesController : ControllerBase
{
    // 200 OK - Successful GET, PUT, PATCH
    [HttpGet("{id}")]
    public ActionResult<User> GetUser(int id)
    {
        var user = GetUserFromDatabase(id);
        return Ok(user); // 200 OK
    }
    
    // 201 Created - Successful POST
    [HttpPost]
    public ActionResult<User> CreateUser(CreateUserDto userDto)
    {
        var user = CreateUserInDatabase(userDto);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user); // 201 Created
    }
    
    // 204 No Content - Successful DELETE, PUT with no response body
    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        var deleted = DeleteUserFromDatabase(id);
        if (!deleted)
            return NotFound(); // 404 Not Found
            
        return NoContent(); // 204 No Content
    }
    
    // 400 Bad Request - Invalid request data
    [HttpPost("validate")]
    public IActionResult ValidateUser(User user)
    {
        if (user == null)
            return BadRequest("User data is required"); // 400 Bad Request
            
        if (!ModelState.IsValid)
            return BadRequest(ModelState); // 400 Bad Request with validation errors
            
        return Ok("User is valid");
    }
    
    // 401 Unauthorized - Authentication required
    [HttpGet("profile")]
    [Authorize]
    public IActionResult GetProfile()
    {
        if (!User.Identity.IsAuthenticated)
            return Unauthorized(); // 401 Unauthorized
            
        return Ok(GetUserProfile());
    }
    
    // 403 Forbidden - Insufficient permissions
    [HttpDelete("admin/{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteUserAsAdmin(int id)
    {
        if (!User.IsInRole("Admin"))
            return Forbid(); // 403 Forbidden
            
        DeleteUserFromDatabase(id);
        return NoContent();
    }
    
    // 404 Not Found - Resource not found
    [HttpGet("search/{username}")]
    public ActionResult<User> FindUser(string username)
    {
        var user = FindUserByUsername(username);
        if (user == null)
            return NotFound($"User '{username}' not found"); // 404 Not Found
            
        return Ok(user);
    }
    
    // 409 Conflict - Resource conflict
    [HttpPost("register")]
    public ActionResult<User> RegisterUser(RegisterUserDto userDto)
    {
        if (UserExists(userDto.Email))
            return Conflict($"User with email '{userDto.Email}' already exists"); // 409 Conflict
            
        var user = CreateUser(userDto);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }
    
    // 422 Unprocessable Entity - Validation errors
    [HttpPost("complex-validation")]
    public IActionResult CreateUserWithComplexValidation(User user)
    {
        var validationErrors = ValidateUserBusinessRules(user);
        if (validationErrors.Any())
        {
            return UnprocessableEntity(validationErrors); // 422 Unprocessable Entity
        }
        
        var createdUser = CreateUserInDatabase(user);
        return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
    }
    
    // 500 Internal Server Error - Server error
    [HttpGet("error-demo")]
    public IActionResult ErrorDemo()
    {
        try
        {
            // Simulate database error
            throw new Exception("Database connection failed");
        }
        catch (Exception ex)
        {
            // Log the error
            LogError(ex);
            
            return StatusCode(500, new { 
                Message = "An internal server error occurred",
                RequestId = HttpContext.TraceIdentifier
            }); // 500 Internal Server Error
        }
    }
    
    // Custom status codes
    [HttpPost("custom-status")]
    public IActionResult CustomStatusExample()
    {
        // 418 I'm a teapot (RFC 2324)
        return StatusCode(418, "I'm a teapot");
    }
}

// Complete list of important status codes
public static class HttpStatusCodes
{
    // 1xx Informational
    public const int Continue = 100;
    public const int Processing = 102;
    
    // 2xx Success
    public const int OK = 200;
    public const int Created = 201;
    public const int Accepted = 202;
    public const int NoContent = 204;
    public const int PartialContent = 206;
    
    // 3xx Redirection
    public const int MovedPermanently = 301;
    public const int Found = 302;
    public const int NotModified = 304;
    public const int TemporaryRedirect = 307;
    public const int PermanentRedirect = 308;
    
    // 4xx Client Errors
    public const int BadRequest = 400;
    public const int Unauthorized = 401;
    public const int Forbidden = 403;
    public const int NotFound = 404;
    public const int MethodNotAllowed = 405;
    public const int Conflict = 409;
    public const int Gone = 410;
    public const int UnprocessableEntity = 422;
    public const int TooManyRequests = 429;
    
    // 5xx Server Errors
    public const int InternalServerError = 500;
    public const int NotImplemented = 501;
    public const int BadGateway = 502;
    public const int ServiceUnavailable = 503;
    public const int GatewayTimeout = 504;
}

// Global exception handling middleware
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    
    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }
    
    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var response = new
        {
            Message = "An error occurred",
            RequestId = context.TraceIdentifier
        };
        
        switch (exception)
        {
            case ArgumentNullException:
            case ArgumentException:
                context.Response.StatusCode = 400; // Bad Request
                response = new { Message = "Invalid request data", Details = exception.Message };
                break;
                
            case UnauthorizedAccessException:
                context.Response.StatusCode = 401; // Unauthorized
                response = new { Message = "Unauthorized access" };
                break;
                
            case KeyNotFoundException:
                context.Response.StatusCode = 404; // Not Found
                response = new { Message = "Resource not found" };
                break;
                
            default:
                context.Response.StatusCode = 500; // Internal Server Error
                response = new { Message = "An internal server error occurred" };
                break;
        }
        
        var jsonResponse = JsonSerializer.Serialize(response);
        await context.Response.WriteAsync(jsonResponse);
    }
}
```

### **Q74: What is Content Negotiation in Web API?**
**Answer:**
**Content Negotiation** is the process of selecting the best representation for a response when there are multiple representations available.

```csharp
// Content Negotiation example
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // Supports multiple content types based on Accept header
    [HttpGet("{id}")]
    public ActionResult<Product> GetProduct(int id)
    {
        var product = GetProductFromDatabase(id);
        if (product == null)
            return NotFound();
            
        // Will return JSON, XML, or other format based on Accept header
        return Ok(product);
    }
    
    // Explicit content type specification
    [HttpGet("{id}/json")]
    [Produces("application/json")]
    public ActionResult<Product> GetProductAsJson(int id)
    {
        var product = GetProductFromDatabase(id);
        return Ok(product); // Always returns JSON
    }
    
    [HttpGet("{id}/xml")]
    [Produces("application/xml")]
    public ActionResult<Product> GetProductAsXml(int id)
    {
        var product = GetProductFromDatabase(id);
        return Ok(product); // Always returns XML
    }
    
    // Multiple supported formats
    [HttpGet("{id}/flexible")]
    [Produces("application/json", "application/xml", "text/csv")]
    public ActionResult<Product> GetProductFlexible(int id)
    {
        var product = GetProductFromDatabase(id);
        return Ok(product); // Returns format based on Accept header
    }
    
    // Custom content negotiation
    [HttpGet("{id}/custom")]
    public IActionResult GetProductCustom(int id)
    {
        var product = GetProductFromDatabase(id);
        if (product == null)
            return NotFound();
        
        var acceptHeader = Request.Headers["Accept"].ToString();
        
        switch (acceptHeader.ToLower())
        {
            case "application/json":
                return Ok(product);
                
            case "application/xml":
                return new ContentResult
                {
                    Content = SerializeToXml(product),
                    ContentType = "application/xml",
                    StatusCode = 200
                };
                
            case "text/csv":
                return new ContentResult
                {
                    Content = SerializeToCsv(product),
                    ContentType = "text/csv",
                    StatusCode = 200
                };
                
            default:
                return Ok(product); // Default to JSON
        }
    }
}

// Startup configuration for content negotiation
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers(options =>
        {
            // Add XML formatter
            options.OutputFormatters.Add(new XmlDataContractSerializerOutputFormatter());
            options.InputFormatters.Add(new XmlDataContractSerializerInputFormatter(options));
            
            // Respect Accept header
            options.RespectBrowserAcceptHeader = true;
            
            // Return 406 Not Acceptable if format not supported
            options.ReturnHttpNotAcceptable = true;
        })
        .AddXmlSerializerFormatters(); // Add XML support
        
        // Custom formatter example
        services.Configure<MvcOptions>(options =>
        {
            options.OutputFormatters.Add(new CsvOutputFormatter());
        });
    }
}

// Custom CSV formatter
public class CsvOutputFormatter : TextOutputFormatter
{
    public CsvOutputFormatter()
    {
        SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("text/csv"));
        SupportedEncodings.Add(Encoding.UTF8);
        SupportedEncodings.Add(Encoding.Unicode);
    }
    
    protected override bool CanWriteType(Type type)
    {
        return typeof(IEnumerable).IsAssignableFrom(type) || 
               type.GetProperties().Any();
    }
    
    public override async Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
    {
        var response = context.HttpContext.Response;
        var buffer = new StringBuilder();
        
        if (context.Object is IEnumerable<object> enumerable)
        {
            foreach (var item in enumerable)
            {
                FormatCsv(buffer, item);
            }
        }
        else
        {
            FormatCsv(buffer, context.Object);
        }
        
        await response.WriteAsync(buffer.ToString(), selectedEncoding);
    }
    
    private static void FormatCsv(StringBuilder buffer, object item)
    {
        var properties = item.GetType().GetProperties();
        
        // Header (only for first item)
        if (buffer.Length == 0)
        {
            buffer.AppendLine(string.Join(",", properties.Select(p => p.Name)));
        }
        
        // Data
        var values = properties.Select(p => p.GetValue(item)?.ToString() ?? "");
        buffer.AppendLine(string.Join(",", values));
    }
}

// Client-side content negotiation examples
public class ApiClient
{
    private readonly HttpClient _httpClient;
    
    public ApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
    
    // Request JSON
    public async Task<Product> GetProductAsJsonAsync(int id)
    {
        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));
        
        var response = await _httpClient.GetAsync($"api/products/{id}");
        var json = await response.Content.ReadAsStringAsync();
        
        return JsonSerializer.Deserialize<Product>(json);
    }
    
    // Request XML
    public async Task<Product> GetProductAsXmlAsync(int id)
    {
        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/xml"));
        
        var response = await _httpClient.GetAsync($"api/products/{id}");
        var xml = await response.Content.ReadAsStringAsync();
        
        // Deserialize XML to Product object
        return DeserializeXml<Product>(xml);
    }
    
    // Request CSV
    public async Task<string> GetProductAsCsvAsync(int id)
    {
        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("text/csv"));
        
        var response = await _httpClient.GetAsync($"api/products/{id}");
        return await response.Content.ReadAsStringAsync();
    }
    
    // Multiple accept types with quality values
    public async Task<string> GetProductWithPreferencesAsync(int id)
    {
        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json", 1.0)); // Preferred
        _httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/xml", 0.8));  // Second choice
        _httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("text/csv", 0.5));        // Last resort
        
        var response = await _httpClient.GetAsync($"api/products/{id}");
        return await response.Content.ReadAsStringAsync();
    }
}
```

### **Q75: What is CORS? How to enable CORS in Web API?**
**Answer:**
**CORS (Cross-Origin Resource Sharing)** is a security feature that allows or restricts web pages to access resources from other domains.

**Why CORS is needed:**
- Browsers enforce **Same-Origin Policy** by default
- Prevents malicious websites from accessing your API
- CORS provides controlled access to cross-origin requests

```csharp
// Enable CORS in ASP.NET Core Web API

// 1. Startup.cs configuration
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        
        // Add CORS services
        services.AddCors(options =>
        {
            // Policy 1: Allow specific origins
            options.AddPolicy("AllowSpecificOrigins", builder =>
            {
                builder.WithOrigins("https://localhost:3000", "https://myapp.com")
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials();
            });
            
            // Policy 2: Allow any origin (Development only)
            options.AddPolicy("AllowAll", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
            
            // Policy 3: Restrictive policy
            options.AddPolicy("RestrictivePolicy", builder =>
            {
                builder.WithOrigins("https://trustedsite.com")
                       .WithMethods("GET", "POST")
                       .WithHeaders("Content-Type", "Authorization")
                       .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
            });
        });
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            // Use permissive CORS in development
            app.UseCors("AllowAll");
        }
        else
        {
            // Use restrictive CORS in production
            app.UseCors("AllowSpecificOrigins");
        }
        
        app.UseRouting();
        app.UseAuthorization();
        
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}

// 2. Controller-level CORS
[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowSpecificOrigins")] // Apply CORS policy to entire controller
public class ProductsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetProducts()
    {
        return Ok(GetAllProducts());
    }
    
    [HttpGet("{id}")]
    [EnableCors("RestrictivePolicy")] // Override with different policy for specific action
    public ActionResult<Product> GetProduct(int id)
    {
        var product = GetProductById(id);
        return product != null ? Ok(product) : NotFound();
    }
    
    [HttpPost]
    [DisableCors] // Disable CORS for specific action
    public ActionResult<Product> CreateProduct(Product product)
    {
        var createdProduct = CreateNewProduct(product);
        return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, createdProduct);
    }
}

// 3. Advanced CORS configuration
public class AdvancedCorsStartup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("DynamicCorsPolicy", builder =>
            {
                builder.SetIsOriginAllowed(origin =>
                {
                    // Dynamic origin validation
                    var allowedDomains = new[] { "localhost", "myapp.com", "api.myapp.com" };
                    var uri = new Uri(origin);
                    return allowedDomains.Any(domain => uri.Host.EndsWith(domain));
                })
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
            });
            
            // Environment-specific CORS
            options.AddPolicy("EnvironmentSpecific", builder =>
            {
                var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                
                if (environment == "Development")
                {
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                }
                else if (environment == "Staging")
                {
                    builder.WithOrigins("https://staging.myapp.com")
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                }
                else // Production
                {
                    builder.WithOrigins("https://myapp.com", "https://www.myapp.com")
                           .WithMethods("GET", "POST", "PUT", "DELETE")
                           .WithHeaders("Content-Type", "Authorization");
                }
            });
        });
    }
}

// 4. Custom CORS middleware
public class CustomCorsMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<CustomCorsMiddleware> _logger;
    
    public CustomCorsMiddleware(RequestDelegate next, ILogger<CustomCorsMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        var origin = context.Request.Headers["Origin"].FirstOrDefault();
        
        if (!string.IsNullOrEmpty(origin))
        {
            _logger.LogInformation($"CORS request from origin: {origin}");
            
            // Custom origin validation logic
            if (IsAllowedOrigin(origin))
            {
                context.Response.Headers.Add("Access-Control-Allow-Origin", origin);
                context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
                context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
            }
            else
            {
                _logger.LogWarning($"CORS request blocked from origin: {origin}");
            }
        }
        
        // Handle preflight requests
        if (context.Request.Method == "OPTIONS")
        {
            context.Response.StatusCode = 200;
            return;
        }
        
        await _next(context);
    }
    
    private bool IsAllowedOrigin(string origin)
    {
        // Custom validation logic
        var allowedOrigins = new[]
        {
            "https://localhost:3000",
            "https://myapp.com",
            "https://www.myapp.com"
        };
        
        return allowedOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase);
    }
}

// 5. CORS with authentication
[ApiController]
[Route("api/[controller]")]
public class SecureController : ControllerBase
{
    [HttpGet]
    [EnableCors("AllowSpecificOrigins")]
    [Authorize] // Requires authentication
    public ActionResult<string> GetSecureData()
    {
        return Ok($"Secure data for user: {User.Identity.Name}");
    }
    
    [HttpPost("login")]
    [EnableCors("AllowSpecificOrigins")]
    public ActionResult<object> Login(LoginModel model)
    {
        // Validate credentials
        if (ValidateCredentials(model.Username, model.Password))
        {
            var token = GenerateJwtToken(model.Username);
            
            // Set secure cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None, // Required for cross-origin cookies
                Expires = DateTime.UtcNow.AddHours(1)
            };
            
            Response.Cookies.Append("auth-token", token, cookieOptions);
            
            return Ok(new { Message = "Login successful", Token = token });
        }
        
        return Unauthorized("Invalid credentials");
    }
}

// 6. Client-side CORS handling
public class CorsAwareApiClient
{
    private readonly HttpClient _httpClient;
    
    public CorsAwareApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
        
        // Set up for CORS requests
        _httpClient.DefaultRequestHeaders.Add("X-Requested-With", "XMLHttpRequest");
    }
    
    public async Task<T> GetAsync<T>(string endpoint)
    {
        try
        {
            var response = await _httpClient.GetAsync(endpoint);
            
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<T>(json);
            }
            
            throw new HttpRequestException($"Request failed: {response.StatusCode}");
        }
        catch (HttpRequestException ex) when (ex.Message.Contains("CORS"))
        {
            throw new InvalidOperationException("CORS policy blocked this request", ex);
        }
    }
    
    public async Task<T> PostAsync<T>(string endpoint, object data)
    {
        var json = JsonSerializer.Serialize(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync(endpoint, content);
        
        if (response.IsSuccessStatusCode)
        {
            var responseJson = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(responseJson);
        }
        
        throw new HttpRequestException($"Request failed: {response.StatusCode}");
    }
}
```

### **Q76: What is Authentication vs Authorization?**
**Answer:**

| **Authentication** | **Authorization** |
|-------------------|-------------------|
| **Who are you?** | **What can you do?** |
| Verifies identity | Verifies permissions |
| Login process | Access control |
| Username/Password, JWT, OAuth | Roles, Claims, Policies |
| Happens first | Happens after authentication |

```csharp
// Authentication & Authorization in ASP.NET Core Web API

// 1. JWT Authentication setup
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        
        // Add Authentication
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "https://myapi.com",
                    ValidAudience = "https://myapi.com",
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes("your-super-secret-key-here"))
                };
            });
        
        // Add Authorization
        services.AddAuthorization(options =>
        {
            // Role-based authorization
            options.AddPolicy("AdminOnly", policy => 
                policy.RequireRole("Admin"));
            
            options.AddPolicy("ManagerOrAdmin", policy => 
                policy.RequireRole("Manager", "Admin"));
            
            // Claim-based authorization
            options.AddPolicy("CanEditProducts", policy => 
                policy.RequireClaim("permission", "products.edit"));
            
            // Custom policy
            options.AddPolicy("MinimumAge", policy => 
                policy.Requirements.Add(new MinimumAgeRequirement(18)));
        });
        
        // Register custom authorization handler
        services.AddScoped<IAuthorizationHandler, MinimumAgeHandler>();
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseRouting();
        
        // Authentication middleware (must come before Authorization)
        app.UseAuthentication(); // WHO are you?
        app.UseAuthorization();  // WHAT can you do?
        
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}

// 2. Authentication Controller
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;
    
    public AuthController(IUserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
    }
    
    // AUTHENTICATION - Login endpoint
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        // Validate credentials (AUTHENTICATION)
        var user = await _userService.ValidateCredentialsAsync(request.Username, request.Password);
        
        if (user == null)
        {
            return Unauthorized("Invalid username or password");
        }
        
        // Generate JWT token
        var token = GenerateJwtToken(user);
        
        return Ok(new LoginResponse
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Roles = user.Roles
            }
        });
    }
    
    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]);
        
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.
            new Claim(ClaimTypes.Email, user.Email)
        };
        
        // Add role claims
        foreach (var role in user.Roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }
        
        // Add custom claims
        claims.Add(new Claim("permission", "products.read"));
        if (user.Roles.Contains("Admin"))
        {
            claims.Add(new Claim("permission", "products.edit"));
            claims.Add(new Claim("permission", "users.manage"));
        }
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = _configuration["JwtSettings:Issuer"],
            Audience = _configuration["JwtSettings:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), 
                SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

// 3. Authorization examples in controllers
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // No authentication required
    [HttpGet("public")]
    public ActionResult<IEnumerable<Product>> GetPublicProducts()
    {
        return Ok(GetPublicProductList());
    }
    
    // AUTHENTICATION required (any authenticated user)
    [HttpGet]
    [Authorize] // Must be authenticated
    public ActionResult<IEnumerable<Product>> GetProducts()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Ok(GetProductsForUser(userId));
    }
    
    // ROLE-BASED AUTHORIZATION
    [HttpPost]
    [Authorize(Roles = "Admin,Manager")] // Must have Admin OR Manager role
    public ActionResult<Product> CreateProduct(Product product)
    {
        var createdProduct = CreateNewProduct(product);
        return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, createdProduct);
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // Must have Admin role
    public IActionResult DeleteProduct(int id)
    {
        DeleteProductById(id);
        return NoContent();
    }
    
    // POLICY-BASED AUTHORIZATION
    [HttpPut("{id}")]
    [Authorize(Policy = "CanEditProducts")] // Must have specific claim
    public IActionResult UpdateProduct(int id, Product product)
    {
        UpdateProductById(id, product);
        return NoContent();
    }
    
    // MULTIPLE AUTHORIZATION REQUIREMENTS
    [HttpGet("admin-only")]
    [Authorize(Policy = "AdminOnly")]
    [Authorize(Policy = "MinimumAge")]
    public ActionResult<object> GetAdminData()
    {
        return Ok(new { Message = "Admin data", User = User.Identity.Name });
    }
    
    // CUSTOM AUTHORIZATION LOGIC
    [HttpGet("{id}")]
    public ActionResult<Product> GetProduct(int id)
    {
        var product = GetProductById(id);
        if (product == null)
            return NotFound();
        
        // Custom authorization logic
        if (product.IsPrivate && !User.IsInRole("Admin"))
        {
            // Check if user owns this product
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (product.OwnerId.ToString() != userId)
            {
                return Forbid("You don't have permission to view this product");
            }
        }
        
        return Ok(product);
    }
}

// 4. Custom Authorization Requirement and Handler
public class MinimumAgeRequirement : IAuthorizationRequirement
{
    public int MinimumAge { get; }
    
    public MinimumAgeRequirement(int minimumAge)
    {
        MinimumAge = minimumAge;
    }
}

public class MinimumAgeHandler : AuthorizationHandler<MinimumAgeRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        MinimumAgeRequirement requirement)
    {
        var dateOfBirthClaim = context.User.FindFirst("date_of_birth");
        
        if (dateOfBirthClaim != null && DateTime.TryParse(dateOfBirthClaim.Value, out var dateOfBirth))
        {
            var age = DateTime.Today.Year - dateOfBirth.Year;
            if (dateOfBirth.Date > DateTime.Today.AddYears(-age))
                age--;
            
            if (age >= requirement.MinimumAge)
            {
                context.Succeed(requirement);
            }
        }
        
        return Task.CompletedTask;
    }
}

// 5. Resource-based Authorization
public interface IAuthorizationService
{
    Task<AuthorizationResult> AuthorizeAsync(ClaimsPrincipal user, object resource, string policy);
}

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IAuthorizationService _authorizationService;
    
    public DocumentsController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }
    
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<Document>> GetDocument(int id)
    {
        var document = GetDocumentById(id);
        if (document == null)
            return NotFound();
        
        // Resource-based authorization
        var authResult = await _authorizationService.AuthorizeAsync(
            User, document, "CanViewDocument");
        
        if (!authResult.Succeeded)
        {
            return Forbid("You don't have permission to view this document");
        }
        
        return Ok(document);
    }
    
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateDocument(int id, Document document)
    {
        var existingDocument = GetDocumentById(id);
        if (existingDocument == null)
            return NotFound();
        
        // Resource-based authorization
        var authResult = await _authorizationService.AuthorizeAsync(
            User, existingDocument, "CanEditDocument");
        
        if (!authResult.Succeeded)
        {
            return Forbid("You don't have permission to edit this document");
        }
        
        UpdateDocumentById(id, document);
        return NoContent();
    }
}

// 6. Models and DTOs
public class LoginRequest
{
    [Required]
    public string Username { get; set; }
    
    [Required]
    public string Password { get; set; }
}

public class LoginResponse
{
    public string Token { get; set; }
    public UserDto User { get; set; }
}

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public List<string> Roles { get; set; }
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public List<string> Roles { get; set; }
    public DateTime DateOfBirth { get; set; }
}
```

### **Q77: What is JWT Token? How to implement JWT authentication?**
**Answer:**
**JWT (JSON Web Token)** is a compact, URL-safe token format used for securely transmitting information between parties.

**JWT Structure:** `Header.Payload.Signature`

```csharp
// Complete JWT Authentication Implementation

// 1. JWT Service
public interface IJwtService
{
    string GenerateToken(User user);
    ClaimsPrincipal ValidateToken(string token);
    bool IsTokenValid(string token);
}

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;
    private readonly byte[] _secretKey;
    
    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
        _secretKey = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]);
    }
    
    public string GenerateToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, 
                new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(), 
                ClaimValueTypes.Integer64),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };
        
        // Add roles
        foreach (var role in user.Roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }
        
        // Add custom claims
        claims.Add(new Claim("department", user.Department));
        claims.Add(new Claim("employee_id", user.EmployeeId));
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(
                int.Parse(_configuration["JwtSettings:ExpirationMinutes"])),
            Issuer = _configuration["JwtSettings:Issuer"],
            Audience = _configuration["JwtSettings:Audience"],
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(_secretKey),
                SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    
    public ClaimsPrincipal ValidateToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidAudience = _configuration["JwtSettings:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(_secretKey),
                ClockSkew = TimeSpan.Zero // Remove default 5-minute tolerance
            };
            
            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
            return principal;
        }
        catch
        {
            return null;
        }
    }
    
    public bool IsTokenValid(string token)
    {
        return ValidateToken(token) != null;
    }
    
    public string RefreshToken(string expiredToken)
    {
        var principal = GetPrincipalFromExpiredToken(expiredToken);
        if (principal == null)
            return null;
        
        var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = GetUserById(int.Parse(userId)); // Get from database
        
        return GenerateToken(user);
    }
    
    private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = false, // Don't validate lifetime for refresh
            ValidateIssuerSigningKey = true,
            ValidIssuer = _configuration["JwtSettings:Issuer"],
            ValidAudience = _configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(_secretKey)
        };
        
        try
        {
            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
            return principal;
        }
        catch
        {
            return null;
        }
    }
}

// 2. Authentication Controller with JWT
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IJwtService _jwtService;
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;
    
    public AuthController(IJwtService jwtService, IUserService userService, ILogger<AuthController> logger)
    {
        _jwtService = jwtService;
        _userService = userService;
        _logger = logger;
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        try
        {
            // Validate credentials
            var user = await _userService.ValidateCredentialsAsync(request.Username, request.Password);
            
            if (user == null)
            {
                _logger.LogWarning($"Failed login attempt for username: {request.Username}");
                return Unauthorized(new { Message = "Invalid username or password" });
            }
            
            // Generate JWT token
            var token = _jwtService.GenerateToken(user);
            
            // Generate refresh token
            var refreshToken = GenerateRefreshToken();
            await _userService.SaveRefreshTokenAsync(user.Id, refreshToken);
            
            _logger.LogInformation($"User {user.Username} logged in successfully");
            
            return Ok(new LoginResponse
            {
                AccessToken = token,
                RefreshToken = refreshToken,
                ExpiresIn = 3600, // 1 hour
                TokenType = "Bearer",
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Roles = user.Roles
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { Message = "An error occurred during login" });
        }
    }
    
    [HttpPost("refresh")]
    public async Task<ActionResult<TokenResponse>> RefreshToken(RefreshTokenRequest request)
    {
        try
        {
            // Validate refresh token
            var isValidRefreshToken = await _userService.ValidateRefreshTokenAsync(request.RefreshToken);
            if (!isValidRefreshToken)
            {
                return Unauthorized(new { Message = "Invalid refresh token" });
            }
            
            // Generate new access token
            var newAccessToken = _jwtService.RefreshToken(request.AccessToken);
            if (newAccessToken == null)
            {
                return Unauthorized(new { Message = "Invalid access token" });
            }
            
            // Generate new refresh token
            var newRefreshToken = GenerateRefreshToken();
            await _userService.UpdateRefreshTokenAsync(request.RefreshToken, newRefreshToken);
            
            return Ok(new TokenResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                ExpiresIn = 3600,
                TokenType = "Bearer"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return StatusCode(500, new { Message = "An error occurred during token refresh" });
        }
    }
    
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                await _userService.RevokeRefreshTokensAsync(int.Parse(userId));
                _logger.LogInformation($"User {userId} logged out successfully");
            }
            
            return Ok(new { Message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return StatusCode(500, new { Message = "An error occurred during logout" });
        }
    }
    
    [HttpGet("profile")]
    [Authorize]
    public ActionResult<UserProfileResponse> GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var username = User.FindFirst(ClaimTypes.Name)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        
        return Ok(new UserProfileResponse
        {
            Id = int.Parse(userId),
            Username = username,
            Email = email,
            Roles = roles,
            Claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList()
        });
    }
    
    private string GenerateRefreshToken()
    {
        var randomBytes = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }
        return Convert.ToBase64String(randomBytes);
    }
}

// 3. Custom JWT Middleware
public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IJwtService _jwtService;
    private readonly ILogger<JwtMiddleware> _logger;
    
    public JwtMiddleware(RequestDelegate next, IJwtService jwtService, ILogger<JwtMiddleware> logger)
    {
        _next = next;
        _jwtService = jwtService;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        var token = ExtractTokenFromHeader(context.Request);
        
        if (!string.IsNullOrEmpty(token))
        {
            try
            {
                var principal = _jwtService.ValidateToken(token);
                if (principal != null)
                {
                    context.User = principal;
                    _logger.LogDebug($"JWT token validated for user: {principal.Identity.Name}");
                }
                else
                {
                    _logger.LogWarning("Invalid JWT token provided");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating JWT token");
            }
        }
        
        await _next(context);
    }
    
    private string ExtractTokenFromHeader(HttpRequest request)
    {
        var authHeader = request.Headers["Authorization"].FirstOrDefault();
        
        if (authHeader != null && authHeader.StartsWith("Bearer "))
        {
            return authHeader.Substring("Bearer ".Length).Trim();
        }
        
        return null;
    }
}

// 4. Startup Configuration
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        
        // Register JWT service
        services.AddScoped<IJwtService, JwtService>();
        
        // Configure JWT authentication
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration["JwtSettings:Issuer"],
                    ValidAudience = Configuration["JwtSettings:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(Configuration["JwtSettings:SecretKey"])),
                    ClockSkew = TimeSpan.Zero
                };
                
                // Handle JWT events
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = context =>
                    {
                        Console.WriteLine($"Token validated for user: {context.Principal.Identity.Name}");
                        return Task.CompletedTask;
                    }
                };
            });
        
        services.AddAuthorization();
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseRouting();
        
        // Add custom JWT middleware (optional, if not using built-in JWT)
        // app.UseMiddleware<JwtMiddleware>();
        
        app.UseAuthentication();
        app.UseAuthorization();
        
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}

// 5. Configuration (appsettings.json)
/*
{
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-that-is-at-least-256-bits-long",
    "Issuer": "https://yourapi.com",
    "Audience": "https://yourapi.com",
    "ExpirationMinutes": 60
  }
}
*/

// 6. DTOs
public class LoginRequest
{
    [Required]
    public string Username { get; set; }
    
    [Required]
    public string Password { get; set; }
}

public class LoginResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public int ExpiresIn { get; set; }
    public string TokenType { get; set; }
    public UserDto User { get; set; }
}

public class RefreshTokenRequest
{
    [Required]
    public string AccessToken { get; set; }
    
    [Required]
    public string RefreshToken { get; set; }
}

public class TokenResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public int ExpiresIn { get; set; }
    public string TokenType { get; set; }
}

public class UserProfileResponse
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public List<string> Roles { get; set; }
    public object Claims { get; set; }
}
```

### **Q78: What is Middleware in ASP.NET Core? How to create custom middleware?**
**Answer:**
**Middleware** is software that sits between different applications or components and facilitates communication. In ASP.NET Core, middleware components handle HTTP requests and responses in a pipeline.

```csharp
// 1. Understanding Middleware Pipeline
public class Startup
{
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // Middleware pipeline - ORDER MATTERS!
        
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage(); // 1. Exception handling
        }
        
        app.UseHttpsRedirection();  // 2. HTTPS redirection
        app.UseStaticFiles();       // 3. Static files
        app.UseRouting();           // 4. Routing
        app.UseAuthentication();    // 5. Authentication
        app.UseAuthorization();     // 6. Authorization
        
        // Custom middleware
        app.UseMiddleware<RequestLoggingMiddleware>();
        app.UseMiddleware<PerformanceMiddleware>();
        
        app.UseEndpoints(endpoints =>  // 7. Endpoints
        {
            endpoints.MapControllers();
        });
    }
}

// 2. Custom Middleware - Request Logging
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;
    
    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        // Before request processing
        var startTime = DateTime.UtcNow;
        var requestId = Guid.NewGuid().ToString();
        
        _logger.LogInformation($"[{requestId}] Request started: {context.Request.Method} {context.Request.Path}");
        
        // Add request ID to response headers
        context.Response.Headers.Add("X-Request-ID", requestId);
        
        try
        {
            // Call next middleware in pipeline
            await _next(context);
        }
        finally
        {
            // After request processing
            var duration = DateTime.UtcNow - startTime;
            _logger.LogInformation($"[{requestId}] Request completed: {context.Response.StatusCode} in {duration.TotalMilliseconds}ms");
        }
    }
}

// 3. Performance Monitoring Middleware
public class PerformanceMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<PerformanceMiddleware> _logger;
    
    public PerformanceMiddleware(RequestDelegate next, ILogger<PerformanceMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        
        await _next(context);
        
        stopwatch.Stop();
        var responseTime = stopwatch.ElapsedMilliseconds;
        
        // Add performance header
        context.Response.Headers.Add("X-Response-Time", $"{responseTime}ms");
        
        // Log slow requests
        if (responseTime > 1000) // Slower than 1 second
        {
            _logger.LogWarning($"Slow request detected: {context.Request.Method} {context.Request.Path} took {responseTime}ms");
        }
        
        // Log to performance monitoring system
        LogPerformanceMetrics(context, responseTime);
    }
    
    private void LogPerformanceMetrics(HttpContext context, long responseTime)
    {
        var metrics = new
        {
            Method = context.Request.Method,
            Path = context.Request.Path.Value,
            StatusCode = context.Response.StatusCode,
            ResponseTime = responseTime,
            Timestamp = DateTime.UtcNow,
            UserAgent = context.Request.Headers["User-Agent"].FirstOrDefault(),
            IPAddress = context.Connection.RemoteIpAddress?.ToString()
        };
        
        // Send to monitoring service (e.g., Application Insights, Prometheus)
        _logger.LogInformation($"Performance: {JsonSerializer.Serialize(metrics)}");
    }
}

// 4. Authentication Middleware
public class CustomAuthenticationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<CustomAuthenticationMiddleware> _logger;
    
    public CustomAuthenticationMiddleware(RequestDelegate next, ILogger<CustomAuthenticationMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        // Check for API key in header
        var apiKey = context.Request.Headers["X-API-Key"].FirstOrDefault();
        
        if (!string.IsNullOrEmpty(apiKey))
        {
            var isValidApiKey = await ValidateApiKeyAsync(apiKey);
            
            if (isValidApiKey)
            {
                // Set user identity
                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, "API User"),
                    new Claim(ClaimTypes.NameIdentifier, apiKey),
                    new Claim("auth_method", "api_key")
                };
                
                var identity = new ClaimsIdentity(claims, "ApiKey");
                context.User = new ClaimsPrincipal(identity);
                
                _logger.LogInformation($"API key authentication successful for key: {apiKey.Substring(0, 8)}...");
            }
            else
            {
                _logger.LogWarning($"Invalid API key attempted: {apiKey}");
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Invalid API key");
                return;
            }
        }
        
        await _next(context);
    }
    
    private async Task<bool> ValidateApiKeyAsync(string apiKey)
    {
        // Validate against database or cache
        var validApiKeys = new[] { "api-key-123", "api-key-456", "api-key-789" };
        return validApiKeys.Contains(apiKey);
    }
}

// 5. Error Handling Middleware
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;
    
    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }
    
    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var response = new ErrorResponse
        {
            RequestId = context.TraceIdentifier,
            Timestamp = DateTime.UtcNow
        };
        
        switch (exception)
        {
            case ValidationException validationEx:
                context.Response.StatusCode = 400;
                response.Message = "Validation failed";
                response.Details = validationEx.Message;
                break;
                
            case UnauthorizedAccessException:
                context.Response.StatusCode = 401;
                response.Message = "Unauthorized access";
                break;
                
            case KeyNotFoundException:
                context.Response.StatusCode = 404;
                response.Message = "Resource not found";
                break;
                
            case TimeoutException:
                context.Response.StatusCode = 408;
                response.Message = "Request timeout";
                break;
                
            default:
                context.Response.StatusCode = 500;
                response.Message = "An internal server error occurred";
                
                // Include stack trace in development
                if (_environment.IsDevelopment())
                {
                    response.Details = exception.ToString();
                }
                break;
        }
        
        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });
        
        await context.Response.WriteAsync(jsonResponse);
    }
}

// 6. Rate Limiting Middleware
public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMemoryCache _cache;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    private readonly RateLimitOptions _options;
    
    public RateLimitingMiddleware(RequestDelegate next, IMemoryCache cache, 
        ILogger<RateLimitingMiddleware> logger, IOptions<RateLimitOptions> options)
    {
        _next = next;
        _cache = cache;
        _logger = logger;
        _options = options.Value;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        var clientId = GetClientIdentifier(context);
        var cacheKey = $"rate_limit_{clientId}";
        
        var requestCount = _cache.Get<int>(cacheKey);
        
        if (requestCount >= _options.MaxRequests)
        {
            _logger.LogWarning($"Rate limit exceeded for client: {clientId}");
            
            context.Response.StatusCode = 429; // Too Many Requests
            context.Response.Headers.Add("Retry-After", _options.WindowSizeInSeconds.ToString());
            
            await context.Response.WriteAsync("Rate limit exceeded. Please try again later.");
            return;
        }
        
        // Increment request count
        _cache.Set(cacheKey, requestCount + 1, TimeSpan.FromSeconds(_options.WindowSizeInSeconds));
        
        // Add rate limit headers
        context.Response.Headers.Add("X-RateLimit-Limit", _options.MaxRequests.ToString());
        context.Response.Headers.Add("X-RateLimit-Remaining", (_options.MaxRequests - requestCount - 1).ToString());
        
        await _next(context);
    }
    
    private string GetClientIdentifier(HttpContext context)
    {
        // Use API key if available
        var apiKey = context.Request.Headers["X-API-Key"].FirstOrDefault();
        if (!string.IsNullOrEmpty(apiKey))
            return $"api_{apiKey}";
        
        // Use IP address as fallback
        return $"ip_{context.Connection.RemoteIpAddress}";
    }
}

// 7. CORS Middleware (Custom Implementation)
public class CustomCorsMiddleware
{
    private readonly RequestDelegate _next;
    private readonly CorsOptions _options;
    
    public CustomCorsMiddleware(RequestDelegate next, IOptions<CorsOptions> options)
    {
        _next = next;
        _options = options.Value;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        var origin = context.Request.Headers["Origin"].FirstOrDefault();
        
        if (!string.IsNullOrEmpty(origin) && _options.AllowedOrigins.Contains(origin))
        {
            context.Response.Headers.Add("Access-Control-Allow-Origin", origin);
            context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
            context.Response.Headers.Add("Access-Control-Allow-Methods", string.Join(", ", _options.AllowedMethods));
            context.Response.Headers.Add("Access-Control-Allow-Headers", string.Join(", ", _options.AllowedHeaders));
        }
        
        // Handle preflight requests
        if (context.Request.Method == "OPTIONS")
        {
            context.Response.StatusCode = 200;
            return;
        }
        
        await _next(context);
    }
}

// 8. Configuration and Registration
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddMemoryCache();
        
        // Configure options
        services.Configure<RateLimitOptions>(Configuration.GetSection("RateLimit"));
        services.Configure<CorsOptions>(Configuration.GetSection("Cors"));
        
        // Register middleware dependencies
        services.AddScoped<IUserService, UserService>();
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // Global exception handling (should be first)
        app.UseMiddleware<GlobalExceptionMiddleware>();
        
        // Performance monitoring
        app.UseMiddleware<PerformanceMiddleware>();
        
        // Request logging
        app.UseMiddleware<RequestLoggingMiddleware>();
        
        // Rate limiting
        app.UseMiddleware<RateLimitingMiddleware>();
        
        // Custom CORS
        app.UseMiddleware<CustomCorsMiddleware>();
        
        // Custom authentication
        app.UseMiddleware<CustomAuthenticationMiddleware>();
        
        app.UseRouting();
        app.UseAuthorization();
        
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}

// 9. Supporting Classes
public class ErrorResponse
{
    public string Message { get; set; }
    public string Details { get; set; }
    public string RequestId { get; set; }
    public DateTime Timestamp { get; set; }
}

public class RateLimitOptions
{
    public int MaxRequests { get; set; } = 100;
    public int WindowSizeInSeconds { get; set; } = 60;
}

public class CorsOptions
{
    public List<string> AllowedOrigins { get; set; } = new();
    public List<string> AllowedMethods { get; set; } = new();
    public List<string> AllowedHeaders { get; set; } = new();
}

// 10. Extension Methods for Cleaner Registration
public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RequestLoggingMiddleware>();
    }
    
    public static IApplicationBuilder UsePerformanceMonitoring(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<PerformanceMiddleware>();
    }
    
    public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<GlobalExceptionMiddleware>();
    }
    
    public static IApplicationBuilder UseRateLimiting(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RateLimitingMiddleware>();
    }
}

// Usage with extension methods
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.UseGlobalExceptionHandling();
    app.UsePerformanceMonitoring();
    app.UseRequestLogging();
    app.UseRateLimiting();
    
    app.UseRouting();
    app.UseEndpoints(endpoints => endpoints.MapControllers());
}
```

### **Q79: What is Caching? What are the types of caching in ASP.NET Core?**
**Answer:**
**Caching** is a technique to store frequently accessed data in memory for faster retrieval.

**Types of Caching in ASP.NET Core:**
1. **In-Memory Caching** - Data stored in application memory
2. **Distributed Caching** - Data stored in external cache (Redis, SQL Server)
3. **Response Caching** - Cache entire HTTP responses
4. **Output Caching** - Cache rendered output

```csharp
// 1. In-Memory Caching
public class ProductService
{
    private readonly IMemoryCache _cache;
    private readonly IProductRepository _repository;
    private readonly ILogger<ProductService> _logger;
    
    public ProductService(IMemoryCache cache, IProductRepository repository, ILogger<ProductService> logger)
    {
        _cache = cache;
        _repository = repository;
        _logger = logger;
    }
    
    public async Task<Product> GetProductAsync(int id)
    {
        string cacheKey = $"product_{id}";
        
        // Try to get from cache first
        if (_cache.TryGetValue(cacheKey, out Product cachedProduct))
        {
            _logger.LogInformation($"Product {id} retrieved from cache");
            return cachedProduct;
        }
        
        // Not in cache, get from database
        var product = await _repository.GetByIdAsync(id);
        
        if (product != null)
        {
            // Cache for 30 minutes
            var cacheOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30),
                SlidingExpiration = TimeSpan.FromMinutes(5), // Extend if accessed
                Priority = CacheItemPriority.Normal
            };
            
            // Add cache eviction callback
            cacheOptions.RegisterPostEvictionCallback((key, value, reason, state) =>
            {
                _logger.LogInformation($"Cache entry {key} was evicted. Reason: {reason}");
            });
            
            _cache.Set(cacheKey, product, cacheOptions);
            _logger.LogInformation($"Product {id} cached for 30 minutes");
        }
        
        return product;
    }
    
    public async Task<List<Product>> GetProductsByCategoryAsync(string category)
    {
        string cacheKey = $"products_category_{category}";
        
        if (_cache.TryGetValue(cacheKey, out List<Product> cachedProducts))
        {
            return cachedProducts;
        }
        
        var products = await _repository.GetByCategoryAsync(category);
        
        // Cache with dependency on category changes
        var cacheOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1),
            Size = products.Count // For memory management
        };
        
        _cache.Set(cacheKey, products, cacheOptions);
        
        return products;
    }
    
    public void InvalidateProductCache(int productId)
    {
        string cacheKey = $"product_{productId}";
        _cache.Remove(cacheKey);
        _logger.LogInformation($"Cache invalidated for product {productId}");
    }
    
    public void InvalidateCategoryCache(string category)
    {
        string cacheKey = $"products_category_{category}";
        _cache.Remove(cacheKey);
    }
}

// 2. Distributed Caching (Redis)
public class DistributedProductService
{
    private readonly IDistributedCache _distributedCache;
    private readonly IProductRepository _repository;
    private readonly ILogger<DistributedProductService> _logger;
    
    public DistributedProductService(IDistributedCache distributedCache, 
        IProductRepository repository, ILogger<DistributedProductService> logger)
    {
        _distributedCache = distributedCache;
        _repository = repository;
        _logger = logger;
    }
    
    public async Task<Product> GetProductAsync(int id)
    {
        string cacheKey = $"product_{id}";
        
        // Try to get from distributed cache
        var cachedProductJson = await _distributedCache.GetStringAsync(cacheKey);
        
        if (!string.IsNullOrEmpty(cachedProductJson))
        {
            var cachedProduct = JsonSerializer.Deserialize<Product>(cachedProductJson);
            _logger.LogInformation($"Product {id} retrieved from distributed cache");
            return cachedProduct;
        }
        
        // Not in cache, get from database
        var product = await _repository.GetByIdAsync(id);
        
        if (product != null)
        {
            // Cache in distributed cache
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(2),
                SlidingExpiration = TimeSpan.FromMinutes(30)
            };
            
            var productJson = JsonSerializer.Serialize(product);
            await _distributedCache.SetStringAsync(cacheKey, productJson, cacheOptions);
            
            _logger.LogInformation($"Product {id} cached in distributed cache");
        }
        
        return product;
    }
    
    public async Task<byte[]> GetProductImageAsync(int productId)
    {
        string cacheKey = $"product_image_{productId}";
        
        // Get binary data from cache
        var cachedImage = await _distributedCache.GetAsync(cacheKey);
        
        if (cachedImage != null)
        {
            _logger.LogInformation($"Product image {productId} retrieved from cache");
            return cachedImage;
        }
        
        // Load from storage
        var imageData = await LoadProductImageFromStorageAsync(productId);
        
        if (imageData != null)
        {
            // Cache binary data
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1)
            };
            
            await _distributedCache.SetAsync(cacheKey, imageData, cacheOptions);
        }
        
        return imageData;
    }
    
    public async Task InvalidateProductCacheAsync(int productId)
    {
        string cacheKey = $"product_{productId}";
        await _distributedCache.RemoveAsync(cacheKey);
        
        // Also invalidate related caches
        string imageCacheKey = $"product_image_{productId}";
        await _distributedCache.RemoveAsync(imageCacheKey);
    }
}

// 3. Response Caching
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    
    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }
    
    // Cache response for 5 minutes
    [HttpGet]
    [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        var products = await _productService.GetAllProductsAsync();
        return Ok(products);
    }
    
    // Cache with VaryByQueryKeys
    [HttpGet("search")]
    [ResponseCache(Duration = 600, VaryByQueryKeys = new[] { "category", "price" })]
    public async Task<ActionResult<IEnumerable<Product>>> SearchProducts(
        [FromQuery] string category = null,
        [FromQuery] decimal? price = null)
    {
        var products = await _productService.SearchProductsAsync(category, price);
        return Ok(products);
    }
    
    // No caching for dynamic data
    [HttpGet("{id}")]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _productService.GetProductAsync(id);
        return product != null ? Ok(product) : NotFound();
    }
    
    // Cache with custom headers
    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<Product>>> GetFeaturedProducts()
    {
        var products = await _productService.GetFeaturedProductsAsync();
        
        // Set custom cache headers
        Response.Headers.Add("Cache-Control", "public, max-age=1800"); // 30 minutes
        Response.Headers.Add("ETag", GenerateETag(products));
        
        return Ok(products);
    }
    
    private string GenerateETag(IEnumerable<Product> products)
    {
        var hash = products.Select(p => $"{p.Id}_{p.LastModified:yyyyMMddHHmmss}").Aggregate((a, b) => a + b);
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(hash));
    }
}

// 4. Custom Cache Service
public interface ICacheService
{
    Task<T> GetAsync<T>(string key);
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);
    Task RemoveAsync(string key);
    Task RemoveByPatternAsync(string pattern);
}

public class HybridCacheService : ICacheService
{
    private readonly IMemoryCache _memoryCache;
    private readonly IDistributedCache _distributedCache;
    private readonly ILogger<HybridCacheService> _logger;
    
    public HybridCacheService(IMemoryCache memoryCache, IDistributedCache distributedCache, 
        ILogger<HybridCacheService> logger)
    {
        _memoryCache = memoryCache;
        _distributedCache = distributedCache;
        _logger = logger;
    }
    
    public async Task<T> GetAsync<T>(string key)
    {
        // Try memory cache first (fastest)
        if (_memoryCache.TryGetValue(key, out T memoryValue))
        {
            _logger.LogDebug($"Cache hit in memory for key: {key}");
            return memoryValue;
        }
        
        // Try distributed cache
        var distributedValue = await _distributedCache.GetStringAsync(key);
        if (!string.IsNullOrEmpty(distributedValue))
        {
            var value = JsonSerializer.Deserialize<T>(distributedValue);
            
            // Store in memory cache for faster access
            _memoryCache.Set(key, value, TimeSpan.FromMinutes(5));
            
            _logger.LogDebug($"Cache hit in distributed cache for key: {key}");
            return value;
        }
        
        _logger.LogDebug($"Cache miss for key: {key}");
        return default(T);
    }
    
    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        var exp = expiration ?? TimeSpan.FromMinutes(30);
        
        // Set in memory cache
        _memoryCache.Set(key, value, exp);
        
        // Set in distributed cache
        var json = JsonSerializer.Serialize(value);
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = exp
        };
        
        await _distributedCache.SetStringAsync(key, json, options);
        
        _logger.LogDebug($"Value cached with key: {key}, expiration: {exp}");
    }
    
    public async Task RemoveAsync(string key)
    {
        _memoryCache.Remove(key);
        await _distributedCache.RemoveAsync(key);
        
        _logger.LogDebug($"Cache removed for key: {key}");
    }
    
    public async Task RemoveByPatternAsync(string pattern)
    {
        // This is a simplified implementation
        // In production, you might need a more sophisticated approach
        
        if (pattern.EndsWith("*"))
        {
            var prefix = pattern.TrimEnd('*');
            
            // For memory cache, you'd need to track keys or use a library like LazyCache
            // For Redis, you can use SCAN command
            
            _logger.LogInformation($"Removing cache entries matching pattern: {pattern}");
        }
    }
}

// 5. Startup Configuration
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        
        // Add memory caching
        services.AddMemoryCache(options =>
        {
            options.SizeLimit = 1024; // Limit memory usage
        });
        
        // Add distributed caching (Redis)
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = Configuration.GetConnectionString("Redis");
            options.InstanceName = "MyApp";
        });
        
        // Alternative: SQL Server distributed cache
        // services.AddDistributedSqlServerCache(options =>
        // {
        //     options.ConnectionString = Configuration.GetConnectionString("DefaultConnection");
        //     options.SchemaName = "dbo";
        //     options.TableName = "CacheEntries";
        // });
        
        // Add response caching
        services.AddResponseCaching(options =>
        {
            options.MaximumBodySize = 1024 * 1024; // 1MB
            options.UseCaseSensitivePaths = false;
        });
        
        // Register custom cache service
        services.AddScoped<ICacheService, HybridCacheService>();
        services.AddScoped<IProductService, ProductService>();
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseResponseCaching();
        
        app.UseRouting();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}

// 6. Cache Invalidation Strategies
public class CacheInvalidationService
{
    private readonly ICacheService _cacheService;
    private readonly ILogger<CacheInvalidationService> _logger;
    
    public CacheInvalidationService(ICacheService cacheService, ILogger<CacheInvalidationService> logger)
    {
        _cacheService = cacheService;
        _logger = logger;
    }
    
    public async Task InvalidateProductCacheAsync(int productId)
    {
        var keysToInvalidate = new[]
        {
            $"product_{productId}",
            $"product_image_{productId}",
            "products_featured",
            "products_all"
        };
        
        foreach (var key in keysToInvalidate)
        {
            await _cacheService.RemoveAsync(key);
        }
        
        // Invalidate category caches
        await _cacheService.RemoveByPatternAsync("products_category_*");
        
        _logger.LogInformation($"Invalidated cache for product {productId}");
    }
    
    public async Task InvalidateUserCacheAsync(int userId)
    {
        await _cacheService.RemoveByPatternAsync($"user_{userId}_*");
        _logger.LogInformation($"Invalidated cache for user {userId}");
    }
}
```

### **Q80: What is the difference between TempData, ViewData, and ViewBag?**
**Answer:**

| **TempData** | **ViewData** | **ViewBag** |
|-------------|-------------|-------------|
| **Persists across redirects** | **Single request only** | **Single request only** |
| Uses session internally | Dictionary-based | Dynamic properties |
| **Survives redirect** | **Dies after request** | **Dies after request** |
| `TempData["key"] = value` | `ViewData["key"] = value` | `ViewBag.Key = value` |
| **Best for redirect scenarios** | **Best for view-specific data** | **Best for simple scenarios** |

```csharp
// Controller demonstrating all three approaches
[Controller]
public class DataTransferController : Controller
{
    // 1. TempData - Survives redirects
    public IActionResult CreateUser(User user)
    {
        try
        {
            // Save user to database
            var savedUser = SaveUserToDatabase(user);
            
            // TempData survives the redirect
            TempData["SuccessMessage"] = $"User {user.Name} created successfully!";
            TempData["UserId"] = savedUser.Id;
            TempData["UserData"] = JsonSerializer.Serialize(savedUser); // Complex objects
            
            // Redirect to success page - TempData will be available
            return RedirectToAction("UserCreated");
        }
        catch (Exception ex)
        {
            TempData["ErrorMessage"] = $"Error creating user: {ex.Message}";
            return RedirectToAction("CreateUserForm");
        }
    }
    
    public IActionResult UserCreated()
    {
        // TempData is available after redirect
        ViewBag.Message = TempData["SuccessMessage"];
        ViewBag.UserId = TempData["UserId"];
        
        // Keep TempData for another request
        TempData.Keep("UserData");
        
        return View();
    }
    
    // 2. ViewData - Single request only
    public IActionResult UserProfile(int id)
    {
        var user = GetUserById(id);
        
        // ViewData - dictionary approach
        ViewData["PageTitle"] = $"Profile - {user.Name}";
        ViewData["User"] = user;
        ViewData["Departments"] = GetDepartments(); // For dropdown
        ViewData["IsEditMode"] = false;
        ViewData["LastLoginDate"] = user.LastLoginDate?.ToString("yyyy-MM-dd");
        
        return View();
    }
    
    // 3. ViewBag - Dynamic properties
    public IActionResult EditUser(int id)
    {
        var user = GetUserById(id);
        
        // ViewBag - dynamic approach
        ViewBag.PageTitle = $"Edit User - {user.Name}";
        ViewBag.User = user;
        ViewBag.Departments = GetDepartments();
        ViewBag.IsEditMode = true;
        ViewBag.Countries = GetCountries();
        ViewBag.Roles = GetRoles();
        
        return View();
    }
    
    // 4. Comparison in action methods
    public IActionResult ComparisonDemo()
    {
        // TempData - for data that needs to survive redirects
        TempData["RedirectMessage"] = "This will survive a redirect";
        TempData["ComplexObject"] = JsonSerializer.Serialize(new { Id = 1, Name = "Test" });
        
        // ViewData - dictionary-based, compile-time checking
        ViewData["Title"] = "Comparison Demo";
        ViewData["Items"] = new List<string> { "Item1", "Item2", "Item3" };
        ViewData["Count"] = 42;
        
        // ViewBag - dynamic, no compile-time checking
        ViewBag.Title = "Comparison Demo"; // Same as ViewData["Title"]
        ViewBag.Items = new List<string> { "Item1", "Item2", "Item3" };
        ViewBag.Count = 42;
        ViewBag.CurrentDate = DateTime.Now;
        
        return View();
    }
    
    // 5. Advanced TempData usage
    public IActionResult ProcessOrder(Order order)
    {
        try
        {
            var result = ProcessOrderInDatabase(order);
            
            // Store complex data in TempData
            TempData["OrderResult"] = JsonSerializer.Serialize(new
            {
                OrderId = result.OrderId,
                TotalAmount = result.TotalAmount,
                Items = result.Items.Select(i => new { i.Name, i.Quantity, i.Price })
            });
            
            // Store simple messages
            TempData["SuccessMessage"] = "Order processed successfully!";
            TempData["ShowConfirmation"] = true;
            
            return RedirectToAction("OrderConfirmation", new { id = result.OrderId });
        }
        catch (ValidationException ex)
        {
            // Store validation errors for display after redirect
            TempData["ValidationErrors"] = JsonSerializer.Serialize(ex.Errors);
            return RedirectToAction("CreateOrder");
        }
        catch (Exception ex)
        {
            TempData["ErrorMessage"] = "An error occurred while processing your order.";
            TempData["ErrorDetails"] = ex.Message;
            return RedirectToAction("OrderError");
        }
    }
    
    public IActionResult OrderConfirmation(int id)
    {
        // Retrieve TempData after redirect
        if (TempData["OrderResult"] != null)
        {
            var orderData = JsonSerializer.Deserialize<dynamic>(TempData["OrderResult"].ToString());
            ViewBag.OrderData = orderData;
        }
        
        ViewBag.SuccessMessage = TempData["SuccessMessage"];
        ViewBag.ShowConfirmation = TempData["ShowConfirmation"] ?? false;
        
        return View();
    }
    
    // 6. Working with forms and validation
    [HttpGet]
    public IActionResult CreateProduct()
    {
        // ViewBag for form data
        ViewBag.Categories = GetCategoriesSelectList();
        ViewBag.Suppliers = GetSuppliersSelectList();
        ViewBag.IsEditMode = false;
        
        // ViewData for page metadata
        ViewData["PageTitle"] = "Create New Product";
        ViewData["FormAction"] = "Create";
        
        return View();
    }
    
    [HttpPost]
    public IActionResult CreateProduct(Product product)
    {
        if (!ModelState.IsValid)
        {
            // Repopulate ViewBag/ViewData for form redisplay
            ViewBag.Categories = GetCategoriesSelectList();
            ViewBag.Suppliers = GetSuppliersSelectList();
            ViewBag.IsEditMode = false;
            ViewData["PageTitle"] = "Create New Product";
            ViewData["FormAction"] = "Create";
            
            // Add custom error message
            ViewBag.ErrorMessage = "Please correct the errors below.";
            
            return View(product); // Return same view with validation errors
        }
        
        try
        {
            var savedProduct = SaveProduct(product);
            
            // Use TempData for success message after redirect
            TempData["SuccessMessage"] = $"Product '{product.Name}' created successfully!";
            TempData["ProductId"] = savedProduct.Id;
            
            return RedirectToAction("ProductDetails", new { id = savedProduct.Id });
        }
        catch (Exception ex)
        {
            // Use TempData for error message after redirect
            TempData["ErrorMessage"] = $"Error creating product: {ex.Message}";
            return RedirectToAction("CreateProduct");
        }
    }
}

// Views demonstrating usage

// UserProfile.cshtml - Using ViewData
/*
@{
    ViewData["Title"] = ViewData["PageTitle"];
    var user = ViewData["User"] as User;
    var departments = ViewData["Departments"] as List<Department>;
    var isEditMode = (bool)(ViewData["IsEditMode"] ?? false);
}

<h2>@ViewData["PageTitle"]</h2>

<div class="user-info">
    <p><strong>Name:</strong> @user.Name</p>
    <p><strong>Email:</strong> @user.Email</p>
    <p><strong>Department:</strong> 
        @{
            var userDept = departments?.FirstOrDefault(d => d.Id == user.DepartmentId);
        }
        @(userDept?.Name ?? "Not assigned")
    </p>
    
    @if (!isEditMode)
    {
        <a href="@Url.Action("EditUser", new { id = user.Id })" class="btn btn-primary">Edit</a>
    }
</div>
*/

// EditUser.cshtml - Using ViewBag
/*
@{
    ViewData["Title"] = ViewBag.PageTitle;
}

<h2>@ViewBag.PageTitle</h2>

@using (Html.BeginForm())
{
    <div class="form-group">
        <label>Name:</label>
        @Html.TextBoxFor(m => m.Name, new { @class = "form-control" })
    </div>
    
    <div class="form-group">
        <label>Department:</label>
        @Html.DropDownListFor(m => m.DepartmentId, 
            new SelectList(ViewBag.Departments, "Id", "Name"), 
            "Select Department", new { @class = "form-control" })
    </div>
    
    <div class="form-group">
        <label>Country:</label>
        @Html.DropDownListFor(m => m.CountryId, 
            new SelectList(ViewBag.Countries, "Id", "Name"), 
            "Select Country", new { @class = "form-control" })
    </div>
    
    <div class="form-group">
        <label>Roles:</label>
        @foreach (var role in ViewBag.Roles)
        {
            <div class="checkbox">
                <label>
                    @Html.CheckBox($"SelectedRoles[{role.Id}]") @role.Name
                </label>
            </div>
        }
    </div>
    
    <button type="submit" class="btn btn-success">Save Changes</button>
}
*/

// OrderConfirmation.cshtml - Using TempData
/*
@{
    ViewData["Title"] = "Order Confirmation";
}

<h2>Order Confirmation</h2>

@if (TempData["SuccessMessage"] != null)
{
    <div class="alert alert-success">
        @TempData["SuccessMessage"]
    </div>
}

@if (ViewBag.ShowConfirm*/

### **Q81: What is Entity Framework? What are Code First, Database First, and Model First approaches?**
**Answer:**
**Entity Framework (EF)** is an Object-Relational Mapping (ORM) framework that enables .NET developers to work with databases using .NET objects.

**Three Development Approaches:**

```csharp
// 1. CODE FIRST - Define classes, generate database
public class BlogContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Post> Posts { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Server=.;Database=BlogDB;Trusted_Connection=true;");
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure entities using Fluent API
        modelBuilder.Entity<Blog>(entity =>
        {
            entity.HasKey(e => e.BlogId);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Url).HasMaxLength(500);
        });
        
        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.PostId);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(300);
            entity.Property(e => e.Content).HasColumnType("ntext");
            
            // Configure relationship
            entity.HasOne(p => p.Blog)
                  .WithMany(b => b.Posts)
                  .HasForeignKey(p => p.BlogId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

// Domain Models
public class Blog
{
    public int BlogId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; }
    
    [MaxLength(500)]
    public string Url { get; set; }
    
    public DateTime CreatedDate { get; set; }
    
    // Navigation property
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
}

public class Post
{
    public int PostId { get; set; }
    
    [Required]
    [MaxLength(300)]
    public string Title { get; set; }
    
    public string Content { get; set; }
    
    public DateTime PublishedDate { get; set; }
    
    // Foreign key
    public int BlogId { get; set; }
    
    // Navigation property
    public virtual Blog Blog { get; set; }
}

// Usage in Service
public class BlogService
{
    private readonly BlogContext _context;
    
    public BlogService(BlogContext context)
    {
        _context = context;
    }
    
    public async Task<Blog> CreateBlogAsync(string title, string url)
    {
        var blog = new Blog
        {
            Title = title,
            Url = url,
            CreatedDate = DateTime.UtcNow
        };
        
        _context.Blogs.Add(blog);
        await _context.SaveChangesAsync();
        
        return blog;
    }
    
    public async Task<List<Blog>> GetBlogsWithPostsAsync()
    {
        return await _context.Blogs
            .Include(b => b.Posts)
            .OrderBy(b => b.Title)
            .ToListAsync();
    }
    
    public async Task<Post> AddPostToBlogAsync(int blogId, string title, string content)
    {
        var post = new Post
        {
            BlogId = blogId,
            Title = title,
            Content = content,
            PublishedDate = DateTime.UtcNow
        };
        
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();
        
        return post;
    }
}

// 2. DATABASE FIRST - Generate classes from existing database
// Use Package Manager Console:
// Scaffold-DbContext "Server=.;Database=ExistingDB;Trusted_Connection=true;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models

// Generated DbContext
public partial class ExistingDbContext : DbContext
{
    public ExistingDbContext(DbContextOptions<ExistingDbContext> options) : base(options) { }
    
    public virtual DbSet<Customer> Customers { get; set; }
    public virtual DbSet<Order> Orders { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Auto-generated configurations based on database schema
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("Customers");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.CompanyName).HasMaxLength(40).IsRequired();
            entity.Property(e => e.ContactName).HasMaxLength(30);
        });
        
        OnModelCreatingPartial(modelBuilder);
    }
    
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

// 3. MODEL FIRST - Design in Visual Studio Designer (Legacy approach)
// Less commonly used in modern development
```

### **Q82: What is LINQ? What are the advantages and disadvantages of LINQ?**
**Answer:**
**LINQ (Language Integrated Query)** provides a consistent query experience across different data sources using C# syntax.

**Advantages:**
- **Type Safety** - Compile-time checking
- **IntelliSense Support** - Better IDE experience
- **Unified Syntax** - Same syntax for different data sources
- **Deferred Execution** - Queries executed when enumerated

**Disadvantages:**
- **Performance Overhead** - Can be slower than raw SQL
- **Complex Queries** - May generate inefficient SQL
- **Learning Curve** - Requires understanding of query concepts

```csharp
// LINQ Examples - Different Syntax Styles
public class LinqExamples
{
    private List<Employee> employees = new List<Employee>
    {
        new Employee { Id = 1, Name = "John", Department = "IT", Salary = 75000, Age = 30 },
        new Employee { Id = 2, Name = "Jane", Department = "HR", Salary = 65000, Age = 28 },
        new Employee { Id = 3, Name = "Bob", Department = "IT", Salary = 85000, Age = 35 },
        new Employee { Id = 4, Name = "Alice", Department = "Finance", Salary = 70000, Age = 32 }
    };
    
    // 1. Method Syntax (Lambda expressions)
    public void MethodSyntaxExamples()
    {
        // Filtering
        var itEmployees = employees
            .Where(e => e.Department == "IT")
            .ToList();
        
        // Projection
        var employeeNames = employees
            .Select(e => new { e.Name, e.Salary })
            .ToList();
        
        // Ordering
        var sortedEmployees = employees
            .OrderByDescending(e => e.Salary)
            .ThenBy(e => e.Name)
            .ToList();
        
        // Grouping
        var employeesByDepartment = employees
            .GroupBy(e => e.Department)
            .Select(g => new
            {
                Department = g.Key,
                Count = g.Count(),
                AverageSalary = g.Average(e => e.Salary),
                Employees = g.ToList()
            })
            .ToList();
        
        // Aggregation
        var totalSalary = employees.Sum(e => e.Salary);
        var averageAge = employees.Average(e => e.Age);
        var highestPaid = employees.Max(e => e.Salary);
        var oldestEmployee = employees.OrderByDescending(e => e.Age).First();
        
        // Complex filtering
        var seniorHighPaidEmployees = employees
            .Where(e => e.Age > 30 && e.Salary > 70000)
            .Select(e => new
            {
                e.Name,
                e.Department,
                SalaryCategory = e.Salary > 80000 ? "High" : "Medium"
            })
            .ToList();
    }
    
    // 2. Query Syntax (SQL-like)
    public void QuerySyntaxExamples()
    {
        // Basic query
        var itEmployees = from e in employees
                         where e.Department == "IT"
                         select e;
        
        // Complex query with grouping
        var departmentStats = from e in employees
                             group e by e.Department into g
                             select new
                             {
                                 Department = g.Key,
                                 Count = g.Count(),
                                 AverageSalary = g.Average(emp => emp.Salary),
                                 TopEarner = g.OrderByDescending(emp => emp.Salary).First()
                             };
        
        // Join example (if we had departments table)
        var departments = new List<Department>
        {
            new Department { Name = "IT", Budget = 500000 },
            new Department { Name = "HR", Budget = 200000 },
            new Department { Name = "Finance", Budget = 300000 }
        };
        
        var employeeWithBudget = from e in employees
                                join d in departments on e.Department equals d.Name
                                select new
                                {
                                    e.Name,
                                    e.Salary,
                                    Department = d.Name,
                                    DepartmentBudget = d.Budget
                                };
    }
    
    // 3. LINQ with Entity Framework
    public class EmployeeService
    {
        private readonly AppDbContext _context;
        
        public EmployeeService(AppDbContext context)
        {
            _context = context;
        }
        
        // Efficient database queries
        public async Task<List<Employee>> GetHighPaidEmployeesAsync(decimal minSalary)
        {
            return await _context.Employees
                .Where(e => e.Salary >= minSalary)
                .Include(e => e.Department) // Eager loading
                .OrderByDescending(e => e.Salary)
                .ToListAsync();
        }
        
        // Complex query with multiple conditions
        public async Task<object> GetDepartmentStatisticsAsync()
        {
            return await _context.Employees
                .GroupBy(e => e.Department.Name)
                .Select(g => new
                {
                    DepartmentName = g.Key,
                    EmployeeCount = g.Count(),
                    AverageSalary = g.Average(e => e.Salary),
                    TotalSalary = g.Sum(e => e.Salary),
                    HighestPaid = g.Max(e => e.Salary),
                    LowestPaid = g.Min(e => e.Salary)
                })
                .OrderByDescending(x => x.AverageSalary)
                .ToListAsync();
        }
        
        // Pagination with LINQ
        public async Task<PagedResult<Employee>> GetEmployeesPagedAsync(int page, int pageSize)
        {
            var totalCount = await _context.Employees.CountAsync();
            
            var employees = await _context.Employees
                .OrderBy(e => e.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            
            return new PagedResult<Employee>
            {
                Items = employees,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }
    }
    
    // 4. Advanced LINQ Operations
    public void AdvancedLinqExamples()
    {
        // Set operations
        var itEmployeeIds = employees.Where(e => e.Department == "IT").Select(e => e.Id);
        var highPaidEmployeeIds = employees.Where(e => e.Salary > 70000).Select(e => e.Id);
        
        var intersection = itEmployeeIds.Intersect(highPaidEmployeeIds); // IT employees with high salary
        var union = itEmployeeIds.Union(highPaidEmployeeIds); // All IT or high-paid employees
        var except = itEmployeeIds.Except(highPaidEmployeeIds); // IT employees with low salary
        
        // Quantifiers
        bool allHighPaid = employees.All(e => e.Salary > 60000);
        bool anyInIT = employees.Any(e => e.Department == "IT");
        bool hasEmployeeNamed = employees.Any(e => e.Name == "John");
        
        // Partitioning
        var top3Earners = employees.OrderByDescending(e => e.Salary).Take(3);
        var allExceptTop3 = employees.OrderByDescending(e => e.Salary).Skip(3);
        
        // Element operations
        var firstEmployee = employees.First();
        var firstITEmployee = employees.First(e => e.Department == "IT");
        var singleFinanceEmployee = employees.SingleOrDefault(e => e.Department == "Finance");
        
        // Custom comparisons
        var distinctDepartments = employees.Select(e => e.Department).Distinct();
        var employeesWithSameSalary = employees
            .GroupBy(e => e.Salary)
            .Where(g => g.Count() > 1)
            .SelectMany(g => g);
    }
    
    // 5. Performance Considerations
    public void PerformanceExamples()
    {
        // BAD: Multiple database hits
        var badExample = _context.Employees.ToList() // Loads all to memory
            .Where(e => e.Salary > 70000) // Filters in memory
            .Select(e => e.Name) // Projects in memory
            .ToList();
        
        // GOOD: Single optimized query
        var goodExample = _context.Employees
            .Where(e => e.Salary > 70000) // Filters in database
            .Select(e => e.Name) // Projects in database
            .ToListAsync(); // Single database call
        
        // Use AsNoTracking for read-only scenarios
        var readOnlyEmployees = _context.Employees
            .AsNoTracking()
            .Where(e => e.Department == "IT")
            .ToListAsync();
    }
}

// Supporting classes
public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Department { get; set; }
    public decimal Salary { get; set; }
    public int Age { get; set; }
}

public class Department
{
    public string Name { get; set; }
    public decimal Budget { get; set; }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
```

### **Q83: What is the difference between First() and FirstOrDefault() in LINQ?**
**Answer:**

| **First()** | **FirstOrDefault()** |
|-------------|---------------------|
| **Throws exception** if no element found | **Returns default value** if no element found |
| Use when you're **sure** element exists | Use when element **might not exist** |
| `InvalidOperationException` on empty sequence | Returns `null` for reference types, `0` for int, etc. |

```csharp
public class FirstVsFirstOrDefaultExamples
{
    private List<Employee> employees = new List<Employee>
    {
        new Employee { Id = 1, Name = "John", Department = "IT", Salary = 75000 },
        new Employee { Id = 2, Name = "Jane", Department = "HR", Salary = 65000 },
        new Employee { Id = 3, Name = "Bob", Department = "IT", Salary = 85000 }
    };
    
    public void DemonstrateFirstMethods()
    {
        // 1. First() - Throws exception if not found
        try
        {
            var firstEmployee = employees.First(); // ✅ Works - returns John
            var firstITEmployee = employees.First(e => e.Department == "IT"); // ✅ Works - returns John
            var firstFinanceEmployee = employees.First(e => e.Department == "Finance"); // ❌ Throws InvalidOperationException
        }
        catch (InvalidOperationException ex)
        {
            Console.WriteLine($"First() threw exception: {ex.Message}");
        }
        
        // 2. FirstOrDefault() - Returns default value if not found
        var firstEmployeeOr

