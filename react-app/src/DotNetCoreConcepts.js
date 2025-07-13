import React, { useState } from 'react';
import './DotNetCoreLearning.css';

const DotNetCoreConcepts = () => {
  const [selectedCategory, setSelectedCategory] = useState('fundamentals');
  const [expandedConcepts, setExpandedConcepts] = useState({});

  const toggleConcept = (conceptId) => {
    setExpandedConcepts(prev => ({
      ...prev,
      [conceptId]: !prev[conceptId]
    }));
  };

  const concepts = {
    fundamentals: {
      title: "🔧 Core Language Fundamentals",
      description: "Essential C# language concepts that form the foundation of .NET Core applications",
      concepts: [
        {
          id: 'delegates',
          icon: '🎯',
          title: 'Delegates & Events',
          description: 'Type-safe function pointers enabling callback mechanisms and event handling',
          details: [
            'Multicast delegates for multiple method invocation',
            'Anonymous methods and lambda expressions',
            'Event-driven programming patterns',
            'Publisher-subscriber pattern implementation',
            'Func<T> and Action<T> built-in delegates'
          ],
          codeExample: `// Delegate declaration
public delegate void NotificationHandler(string message);

// Event declaration
public class Publisher
{
    public event NotificationHandler OnNotification;
    
    public void SendNotification(string message)
    {
        OnNotification?.Invoke(message);
    }
}

// Usage with lambda expressions
var publisher = new Publisher();
publisher.OnNotification += msg => Console.WriteLine($"Received: {msg}");
publisher.OnNotification += msg => LogToFile(msg);

// Func and Action delegates
Func<int, int, int> add = (x, y) => x + y;
Action<string> log = message => Console.WriteLine(message);

// Multicast delegate
Action multiAction = () => Console.WriteLine("First");
multiAction += () => Console.WriteLine("Second");
multiAction(); // Executes both methods`
        },
        {
          id: 'ienumerable',
          icon: '📋',
          title: 'IEnumerable<T> & Collections',
          description: 'Foundation for iteration and LINQ operations across all collection types',
          details: [
            'Lazy evaluation and deferred execution',
            'LINQ query expressions and method syntax',
            'Custom iterator implementation with yield',
            'Generic collections (List<T>, Dictionary<TKey,TValue>)',
            'Immutable collections for thread safety'
          ],
          codeExample: `// IEnumerable basics
IEnumerable<int> numbers = new List<int> { 1, 2, 3, 4, 5 };

// LINQ operations (deferred execution)
var evenNumbers = numbers
    .Where(n => n % 2 == 0)
    .Select(n => n * 2);

// Custom iterator with yield
public static IEnumerable<int> GetFibonacci(int count)
{
    int a = 0, b = 1;
    for (int i = 0; i < count; i++)
    {
        yield return a;
        (a, b) = (b, a + b);
    }
}

// Usage
foreach (var fib in GetFibonacci(10))
{
    Console.WriteLine(fib);
}

// LINQ query syntax
var result = from num in numbers
             where num > 2
             select num * num;`
        },
        {
          id: 'generics',
          icon: '🔄',
          title: 'Generics & Type Safety',
          description: 'Type-safe programming with compile-time type checking and performance benefits',
          details: [
            'Generic classes, interfaces, and methods',
            'Type constraints (where T : class, struct, new())',
            'Covariance and contravariance',
            'Generic collections and performance benefits',
            'Avoiding boxing/unboxing overhead'
          ],
          codeExample: `// Generic class with constraints
public class Repository<T> where T : class, IEntity, new()
{
    private readonly List<T> _items = new();
    
    public void Add(T item) => _items.Add(item);
    
    public T GetById(int id) => _items.FirstOrDefault(x => x.Id == id);
    
    public IEnumerable<TResult> Select<TResult>(Func<T, TResult> selector)
    {
        return _items.Select(selector);
    }
}

// Generic method
public static T Max<T>(T first, T second) where T : IComparable<T>
{
    return first.CompareTo(second) >= 0 ? first : second;
}

// Covariance example
IEnumerable<object> objects = new List<string> { "Hello", "World" };

// Usage
var userRepo = new Repository<User>();
userRepo.Add(new User { Id = 1, Name = "John" });
var user = userRepo.GetById(1);`
        }
      ]
    },
    async: {
      title: "⚡ Asynchronous Programming",
      description: "Modern async/await patterns for scalable and responsive applications",
      concepts: [
        {
          id: 'async-await',
          icon: '🔄',
          title: 'Async/Await Pattern',
          description: 'Non-blocking asynchronous programming model for I/O operations',
          details: [
            'Task<T> and Task return types',
            'ConfigureAwait(false) for library code',
            'Async all the way principle',
            'Exception handling in async methods',
            'Cancellation tokens for cooperative cancellation'
          ],
          codeExample: `// Async method returning Task<T>
public async Task<User> GetUserAsync(int id, CancellationToken cancellationToken = default)
{
    try
    {
        using var httpClient = new HttpClient();
        var response = await httpClient.GetAsync($"/api/users/{id}", cancellationToken);
        response.EnsureSuccessStatusCode();
        
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<User>(json);
    }
    catch (HttpRequestException ex)
    {
        throw new UserNotFoundException($"User {id} not found", ex);
    }
}

// Parallel async operations
public async Task<(User user, Order[] orders)> GetUserWithOrdersAsync(int userId)
{
    var userTask = GetUserAsync(userId);
    var ordersTask = GetUserOrdersAsync(userId);
    
    await Task.WhenAll(userTask, ordersTask);
    
    return (await userTask, await ordersTask);
}

// Async enumerable (C# 8.0+)
public async IAsyncEnumerable<string> ReadLinesAsync(string filePath)
{
    using var reader = new StreamReader(filePath);
    string line;
    while ((line = await reader.ReadLineAsync()) != null)
    {
        yield return line;
    }
}`
        },
        {
          id: 'task-parallel',
          icon: '🚀',
          title: 'Task Parallel Library (TPL)',
          description: 'High-level abstractions for parallel and concurrent programming',
          details: [
            'Task.Run for CPU-bound operations',
            'Parallel.ForEach for data parallelism',
            'TaskScheduler and synchronization context',
            'Concurrent collections for thread safety',
            'Producer-consumer patterns with channels'
          ],
          codeExample: `// CPU-bound work with Task.Run
public async Task<int> CalculateAsync(int[] numbers)
{
    return await Task.Run(() => 
    {
        return numbers.AsParallel()
                     .Where(n => IsPrime(n))
                     .Sum();
    });
}

// Parallel processing
public void ProcessItemsInParallel(IEnumerable<string> items)
{
    Parallel.ForEach(items, new ParallelOptions 
    { 
        MaxDegreeOfParallelism = Environment.ProcessorCount 
    }, 
    item =>
    {
        ProcessItem(item);
    });
}

// Producer-Consumer with Channel
public async Task ProducerConsumerExample()
{
    var channel = Channel.CreateUnbounded<string>();
    var writer = channel.Writer;
    var reader = channel.Reader;
    
    // Producer
    _ = Task.Run(async () =>
    {
        for (int i = 0; i < 100; i++)
        {
            await writer.WriteAsync($"Item {i}");
            await Task.Delay(100);
        }
        writer.Complete();
    });
    
    // Consumer
    await foreach (var item in reader.ReadAllAsync())
    {
        Console.WriteLine($"Processing: {item}");
    }
}`
        }
      ]
    },
    memory: {
      title: "🧠 Memory Management & Performance",
      description: "Understanding memory allocation, garbage collection, and performance optimization",
      concepts: [
        {
          id: 'value-reference',
          icon: '📦',
          title: 'Value Types vs Reference Types',
          description: 'Understanding stack vs heap allocation and memory behavior',
          details: [
            'Stack allocation for value types (int, struct, enum)',
            'Heap allocation for reference types (class, string, array)',
            'Boxing and unboxing performance implications',
            'Struct vs class design decisions',
            'Memory layout and cache locality'
          ],
          codeExample: `// Value type (stack allocated)
public struct Point
{
    public int X { get; set; }
    public int Y { get; set; }

    public Point(int x, int y)
    {
        X = x;
        Y = y;
    }
}

// Reference type (heap allocated)
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

// Boxing/Unboxing example
int value = 42;           // Value type
object boxed = value;     // Boxing - heap allocation
int unboxed = (int)boxed; // Unboxing

// Avoiding boxing with generics
List<int> numbers = new(); // No boxing
numbers.Add(42);          // Direct storage

// Span<T> for stack-based operations
Span<int> stackArray = stackalloc int[100];
stackArray[0] = 42;       // No heap allocation`
        },
        {
          id: 'garbage-collection',
          icon: '🗑️',
          title: 'Garbage Collection & IDisposable',
          description: 'Automatic memory management and resource cleanup patterns',
          details: [
            'Generational garbage collection (Gen 0, 1, 2)',
            'IDisposable pattern for unmanaged resources',
            'Using statements for automatic disposal',
            'Finalizers and weak references',
            'Memory pressure and GC tuning'
          ],
          codeExample: `// IDisposable implementation
public class DatabaseConnection : IDisposable
{
    private SqlConnection _connection;
    private bool _disposed = false;

    public DatabaseConnection(string connectionString)
    {
        _connection = new SqlConnection(connectionString);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _connection?.Dispose();
            }
            _disposed = true;
        }
    }
}

// Using statement for automatic disposal
using var connection = new DatabaseConnection(connectionString);
// Connection automatically disposed at end of scope

// Async disposal (C# 8.0+)
public class AsyncResource : IAsyncDisposable
{
    public async ValueTask DisposeAsync()
    {
        await CleanupAsync();
        GC.SuppressFinalize(this);
    }
}

await using var resource = new AsyncResource();`
        }
      ]
    },
    patterns: {
      title: "🎨 Design Patterns & SOLID Principles",
      description: "Essential design patterns and principles for maintainable code",
      concepts: [
        {
          id: 'solid-principles',
          icon: '🏗️',
          title: 'SOLID Principles',
          description: 'Five fundamental principles for object-oriented design and architecture',
          details: [
            'Single Responsibility Principle (SRP)',
            'Open/Closed Principle (OCP)',
            'Liskov Substitution Principle (LSP)',
            'Interface Segregation Principle (ISP)',
            'Dependency Inversion Principle (DIP)'
          ],
          codeExample: `// Single Responsibility Principle
public class UserService
{
    private readonly IUserRepository _repository;

    public UserService(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<User> GetUserAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }
}

// Open/Closed Principle - Open for extension, closed for modification
public abstract class Shape
{
    public abstract double CalculateArea();
}

public class Circle : Shape
{
    public double Radius { get; set; }

    public override double CalculateArea()
    {
        return Math.PI * Radius * Radius;
    }
}

// Dependency Inversion Principle
public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
}

public class NotificationService
{
    private readonly IEmailService _emailService; // Depend on abstraction

    public NotificationService(IEmailService emailService)
    {
        _emailService = emailService;
    }
}`
        },
        {
          id: 'dependency-injection',
          icon: '🔌',
          title: 'Dependency Injection Pattern',
          description: 'Inversion of Control container for loose coupling and testability',
          details: [
            'Constructor injection (preferred)',
            'Service lifetimes (Singleton, Scoped, Transient)',
            'Interface-based programming',
            'Factory patterns and service locator',
            'Testing with mock dependencies'
          ],
          codeExample: `// Service registration in Program.cs
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddSingleton<IConfiguration>();
builder.Services.AddTransient<IEmailService, EmailService>();

// Constructor injection
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UserController> _logger;

    public UserController(
        IUserService userService,
        ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        _logger.LogInformation("Getting user {UserId}", id);
        var user = await _userService.GetUserAsync(id);
        return user == null ? NotFound() : Ok(user);
    }
}

// Factory pattern for complex object creation
public interface IUserFactory
{
    User CreateUser(string name, string email);
}

public class UserFactory : IUserFactory
{
    public User CreateUser(string name, string email)
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Name = name,
            Email = email,
            CreatedAt = DateTime.UtcNow
        };
    }
}`
        }
      ]
    },
    linq: {
      title: "🔍 LINQ & Functional Programming",
      description: "Language Integrated Query and functional programming concepts",
      concepts: [
        {
          id: 'linq-operators',
          icon: '🔗',
          title: 'LINQ Operators & Query Syntax',
          description: 'Powerful querying capabilities over any IEnumerable data source',
          details: [
            'Filtering (Where), Projection (Select), Ordering (OrderBy)',
            'Aggregation (Sum, Count, Average, Max, Min)',
            'Grouping (GroupBy) and Joining operations',
            'Quantifiers (Any, All, Contains)',
            'Deferred execution and query composition'
          ],
          codeExample: `// Method syntax
var result = users
    .Where(u => u.IsActive)
    .Select(u => new UserDto
    {
        Id = u.Id,
        Name = u.Name,
        Email = u.Email
    })
    .OrderBy(u => u.Name)
    .ToList();

// Query syntax
var queryResult = from user in users
                  where user.Age > 18
                  orderby user.Name
                  select new { user.Name, user.Email };

// Complex grouping
var usersByDepartment = employees
    .GroupBy(e => e.Department)
    .Select(g => new
    {
        Department = g.Key,
        Count = g.Count(),
        AverageSalary = g.Average(e => e.Salary),
        Employees = g.ToList()
    });

// Joining data
var userOrders = from user in users
                 join order in orders on user.Id equals order.UserId
                 select new { user.Name, order.Total, order.Date };

// Aggregations
var statistics = new
{
    TotalUsers = users.Count(),
    ActiveUsers = users.Count(u => u.IsActive),
    AverageAge = users.Average(u => u.Age),
    HasAdminUsers = users.Any(u => u.Role == "Admin")
};`
        },
        {
          id: 'functional-concepts',
          icon: '🎭',
          title: 'Functional Programming Concepts',
          description: 'Immutability, pure functions, and functional composition patterns',
          details: [
            'Immutable data structures and records',
            'Pure functions without side effects',
            'Higher-order functions and function composition',
            'Pattern matching and expression-based programming',
            'Monadic patterns (Option, Result types)'
          ],
          codeExample: `// Immutable record types (C# 9.0+)
public record User(int Id, string Name, string Email)
{
    public User WithEmail(string newEmail) => this with { Email = newEmail };
}

// Pure functions
public static decimal CalculateTax(decimal amount, decimal rate)
{
    return amount * rate; // No side effects
}

// Higher-order functions
public static IEnumerable<TResult> Map<T, TResult>(
    this IEnumerable<T> source,
    Func<T, TResult> selector)
{
    return source.Select(selector);
}

// Function composition
Func<string, string> trim = s => s.Trim();
Func<string, string> upper = s => s.ToUpper();
Func<string, string> process = s => upper(trim(s));

// Or using composition
var processComposed = trim.Compose(upper);

// Pattern matching (C# 8.0+)
public static string GetUserStatus(User user) => user switch
{
    { IsActive: true, LastLogin: var login } when login > DateTime.Now.AddDays(-30)
        => "Active",
    { IsActive: true } => "Inactive",
    { IsActive: false } => "Disabled",
    _ => "Unknown"
};

// Option pattern for null safety
public class Option<T>
{
    public bool HasValue { get; }
    public T Value { get; }

    public TResult Match<TResult>(Func<T, TResult> some, Func<TResult> none)
    {
        return HasValue ? some(Value) : none();
    }
}`
        }
      ]
    },
    oop: {
      title: "🏛️ Object-Oriented Programming",
      description: "Core OOP concepts including inheritance, polymorphism, and abstraction",
      concepts: [
        {
          id: 'abstract-classes',
          icon: '🎭',
          title: 'Abstract Classes & Virtual Methods',
          description: 'Base classes that cannot be instantiated, providing common functionality and contracts',
          details: [
            'Abstract methods that must be implemented by derived classes',
            'Virtual methods that can be overridden',
            'Protected members accessible to derived classes',
            'Template method pattern implementation',
            'Partial implementation with enforced contracts'
          ],
          codeExample: `// Abstract base class
public abstract class Animal
{
    public string Name { get; protected set; }

    protected Animal(string name)
    {
        Name = name;
    }

    // Abstract method - must be implemented
    public abstract void MakeSound();

    // Virtual method - can be overridden
    public virtual void Sleep()
    {
        Console.WriteLine($"{Name} is sleeping");
    }

    // Concrete method - shared implementation
    public void Eat(string food)
    {
        Console.WriteLine($"{Name} is eating {food}");
    }
}

// Derived class implementation
public class Dog : Animal
{
    public Dog(string name) : base(name) { }

    public override void MakeSound()
    {
        Console.WriteLine($"{Name} says Woof!");
    }

    public override void Sleep()
    {
        Console.WriteLine($"{Name} is sleeping in a dog bed");
    }
}

// Usage
// Animal animal = new Animal(); // Compilation error!
Animal dog = new Dog("Buddy");
dog.MakeSound(); // Buddy says Woof!
dog.Sleep();     // Buddy is sleeping in a dog bed`
        },
        {
          id: 'interfaces',
          icon: '🔌',
          title: 'Interfaces & Multiple Inheritance',
          description: 'Contracts defining what a class can do, enabling multiple inheritance of behavior',
          details: [
            'Interface contracts with no implementation (pre C# 8.0)',
            'Default interface methods (C# 8.0+)',
            'Multiple interface implementation',
            'Interface segregation and composition',
            'Explicit interface implementation'
          ],
          codeExample: `// Interface definitions
public interface IFlyable
{
    void Fly();
    int MaxAltitude { get; }
}

public interface ISwimmable
{
    void Swim();
    int MaxDepth { get; }
}

// Default interface methods (C# 8.0+)
public interface IVehicle
{
    string Brand { get; }
    void Start();

    // Default implementation
    void Stop()
    {
        Console.WriteLine("Vehicle stopped");
    }
}

// Multiple interface implementation
public class Duck : Animal, IFlyable, ISwimmable
{
    public Duck(string name) : base(name) { }

    public override void MakeSound()
    {
        Console.WriteLine($"{Name} says Quack!");
    }

    public void Fly()
    {
        Console.WriteLine($"{Name} is flying");
    }

    public int MaxAltitude => 1000;

    public void Swim()
    {
        Console.WriteLine($"{Name} is swimming");
    }

    public int MaxDepth => 10;
}

// Explicit interface implementation
public class Robot : IVehicle
{
    string IVehicle.Brand => "RoboCorp"; // Explicit implementation

    public void Start()
    {
        Console.WriteLine("Robot activated");
    }

    // Uses default implementation from interface
}

// Usage
var duck = new Duck("Donald");
duck.Fly();    // Donald is flying
duck.Swim();   // Donald is swimming

IFlyable flyer = duck;
flyer.Fly();   // Polymorphic behavior`
        },
        {
          id: 'polymorphism',
          icon: '🎪',
          title: 'Polymorphism & Method Overriding',
          description: 'One interface, multiple implementations - the foundation of flexible design',
          details: [
            'Runtime polymorphism through virtual methods',
            'Method overriding with override keyword',
            'Method hiding with new keyword',
            'Interface polymorphism',
            'Abstract method implementation'
          ],
          codeExample: `// Base class with virtual methods
public class Shape
{
    public virtual double CalculateArea()
    {
        return 0;
    }

    public virtual void Draw()
    {
        Console.WriteLine("Drawing a generic shape");
    }
}

// Method overriding
public class Circle : Shape
{
    public double Radius { get; set; }

    public override double CalculateArea()
    {
        return Math.PI * Radius * Radius;
    }

    public override void Draw()
    {
        Console.WriteLine($"Drawing a circle with radius {Radius}");
    }
}

public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }

    public override double CalculateArea()
    {
        return Width * Height;
    }

    public override void Draw()
    {
        Console.WriteLine($"Drawing a rectangle {Width}x{Height}");
    }
}

// Polymorphic usage
public void ProcessShapes(Shape[] shapes)
{
    foreach (Shape shape in shapes)
    {
        shape.Draw();                    // Calls overridden method
        Console.WriteLine($"Area: {shape.CalculateArea()}");
    }
}

// Usage
Shape[] shapes = {
    new Circle { Radius = 5 },
    new Rectangle { Width = 4, Height = 6 }
};

ProcessShapes(shapes);
// Output:
// Drawing a circle with radius 5
// Area: 78.54
// Drawing a rectangle 4x6
// Area: 24`
        }
      ]
    },
    data: {
      title: "📊 Data Access & Querying",
      description: "Advanced data querying concepts and Entity Framework patterns",
      concepts: [
        {
          id: 'iqueryable',
          icon: '🔍',
          title: 'IQueryable<T> vs IEnumerable<T>',
          description: 'Expression trees and database query translation for efficient data access',
          details: [
            'Expression trees for query translation',
            'Deferred execution with database optimization',
            'LINQ to SQL/EF query translation',
            'IQueryable vs IEnumerable performance',
            'Query composition and provider patterns'
          ],
          codeExample: `// IQueryable - Expression trees for database queries
public class UserRepository
{
    private readonly DbContext _context;

    public UserRepository(DbContext context)
    {
        _context = context;
    }

    // Returns IQueryable - query not executed yet
    public IQueryable<User> GetActiveUsers()
    {
        return _context.Users.Where(u => u.IsActive);
    }

    // Query composition with IQueryable
    public async Task<List<User>> GetUsersByDepartment(string department)
    {
        return await _context.Users
            .Where(u => u.IsActive)                    // Translated to SQL WHERE
            .Where(u => u.Department == department)    // Combined in SQL
            .OrderBy(u => u.Name)                      // SQL ORDER BY
            .Select(u => new User                      // SQL SELECT specific columns
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email
            })
            .ToListAsync();                            // Execute query here
    }
}

// IEnumerable vs IQueryable comparison
public void CompareQueryTypes()
{
    // IQueryable - Executed in database
    IQueryable<User> queryableUsers = _context.Users
        .Where(u => u.Age > 18)        // SQL: WHERE Age > 18
        .Take(10);                     // SQL: TOP 10

    // IEnumerable - Executed in memory
    IEnumerable<User> enumerableUsers = _context.Users
        .AsEnumerable()                // Loads ALL users to memory first
        .Where(u => u.Age > 18)        // Filters in memory
        .Take(10);                     // Takes first 10 in memory
}

// Expression tree example
public static IQueryable<T> WhereIf<T>(
    this IQueryable<T> query,
    bool condition,
    Expression<Func<T, bool>> predicate)
{
    return condition ? query.Where(predicate) : query;
}

// Usage
var users = _context.Users
    .WhereIf(!string.IsNullOrEmpty(searchTerm),
             u => u.Name.Contains(searchTerm))
    .WhereIf(minAge.HasValue,
             u => u.Age >= minAge.Value);`
        },
        {
          id: 'entity-framework',
          icon: '🗄️',
          title: 'Entity Framework Core Patterns',
          description: 'Modern ORM patterns for data access and relationship management',
          details: [
            'DbContext and DbSet configuration',
            'Entity relationships and navigation properties',
            'Fluent API vs Data Annotations',
            'Change tracking and lazy loading',
            'Migrations and database-first vs code-first'
          ],
          codeExample: `// Entity configuration with relationships
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }

    // Navigation properties
    public List<Order> Orders { get; set; } = new();
    public UserProfile Profile { get; set; }
}

public class Order
{
    public int Id { get; set; }
    public decimal Total { get; set; }
    public DateTime OrderDate { get; set; }

    // Foreign key
    public int UserId { get; set; }
    public User User { get; set; }
}

// DbContext configuration
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Fluent API configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();

            // One-to-many relationship
            entity.HasMany(e => e.Orders)
                  .WithOne(e => e.User)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

// Repository pattern with EF Core
public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User> GetUserWithOrdersAsync(int id)
    {
        return await _context.Users
            .Include(u => u.Orders)        // Eager loading
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<PagedResult<User>> GetUsersPagedAsync(
        int page, int pageSize, string searchTerm = null)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(u => u.Name.Contains(searchTerm) ||
                                   u.Email.Contains(searchTerm));
        }

        var totalCount = await query.CountAsync();
        var users = await query
            .OrderBy(u => u.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<User>
        {
            Items = users,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }
}`
        }
      ]
    },
    attributes: {
      title: "🏷️ Attributes & Metadata",
      description: "Declarative programming with attributes and reflection for metadata-driven applications",
      concepts: [
        {
          id: 'attributes-annotations',
          icon: '📝',
          title: 'Attributes & Annotations',
          description: 'Declarative metadata that provides information about program elements',
          details: [
            'Built-in attributes (Obsolete, Serializable, etc.)',
            'Custom attribute creation and usage',
            'Attribute targets and inheritance',
            'Reflection-based attribute reading',
            'Validation attributes and data annotations'
          ],
          codeExample: `// Built-in attributes
[Obsolete("Use NewMethod instead", false)]
public void OldMethod()
{
    // Legacy implementation
}

[Serializable]
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

// Data annotations for validation
public class User
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; }

    [EmailAddress]
    [Required]
    public string Email { get; set; }

    [Range(18, 120, ErrorMessage = "Age must be between 18 and 120")]
    public int Age { get; set; }

    [Phone]
    public string PhoneNumber { get; set; }

    [Url]
    public string Website { get; set; }
}

// Custom attribute
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
public class DisplayNameAttribute : Attribute
{
    public string Name { get; }
    public string Description { get; set; }

    public DisplayNameAttribute(string name)
    {
        Name = name;
    }
}

// Using custom attribute
public class Product
{
    [DisplayName("Product Name", Description = "The name of the product")]
    public string Name { get; set; }

    [DisplayName("Unit Price", Description = "Price per unit in USD")]
    public decimal Price { get; set; }
}

// Reading attributes with reflection
public static void PrintPropertyInfo<T>()
{
    var type = typeof(T);
    var properties = type.GetProperties();

    foreach (var prop in properties)
    {
        var displayAttr = prop.GetCustomAttribute<DisplayNameAttribute>();
        if (displayAttr != null)
        {
            Console.WriteLine($"Property: {prop.Name}");
            Console.WriteLine($"Display Name: {displayAttr.Name}");
            Console.WriteLine($"Description: {displayAttr.Description}");
        }
    }
}`
        },
        {
          id: 'reflection',
          icon: '🪞',
          title: 'Reflection & Dynamic Programming',
          description: 'Runtime type inspection and dynamic object manipulation',
          details: [
            'Type inspection and metadata retrieval',
            'Dynamic method invocation',
            'Property and field access',
            'Assembly loading and type discovery',
            'Performance considerations and caching'
          ],
          codeExample: `// Type inspection
public static void InspectType<T>()
{
    Type type = typeof(T);

    Console.WriteLine($"Type: {type.Name}");
    Console.WriteLine($"Namespace: {type.Namespace}");
    Console.WriteLine($"Assembly: {type.Assembly.GetName().Name}");
    Console.WriteLine($"Is Class: {type.IsClass}");
    Console.WriteLine($"Is Interface: {type.IsInterface}");

    // Get properties
    var properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
    Console.WriteLine("Properties:");
    foreach (var prop in properties)
    {
        Console.WriteLine($"  {prop.PropertyType.Name} {prop.Name}");
    }

    // Get methods
    var methods = type.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);
    Console.WriteLine("Methods:");
    foreach (var method in methods)
    {
        Console.WriteLine($"  {method.ReturnType.Name} {method.Name}()");
    }
}

// Dynamic object creation and manipulation
public static T CreateInstance<T>() where T : new()
{
    return (T)Activator.CreateInstance(typeof(T));
}

public static object CreateInstance(Type type)
{
    return Activator.CreateInstance(type);
}

// Dynamic property access
public static void SetPropertyValue(object obj, string propertyName, object value)
{
    var type = obj.GetType();
    var property = type.GetProperty(propertyName);

    if (property != null && property.CanWrite)
    {
        property.SetValue(obj, value);
    }
}

public static T GetPropertyValue<T>(object obj, string propertyName)
{
    var type = obj.GetType();
    var property = type.GetProperty(propertyName);

    if (property != null && property.CanRead)
    {
        return (T)property.GetValue(obj);
    }

    return default(T);
}

// Dynamic method invocation
public static object InvokeMethod(object obj, string methodName, params object[] parameters)
{
    var type = obj.GetType();
    var method = type.GetMethod(methodName);

    if (method != null)
    {
        return method.Invoke(obj, parameters);
    }

    return null;
}

// Generic factory pattern using reflection
public class Factory
{
    private static readonly Dictionary<string, Type> _typeCache = new();

    public static T Create<T>(string typeName) where T : class
    {
        if (!_typeCache.TryGetValue(typeName, out var type))
        {
            type = Type.GetType(typeName);
            if (type != null)
            {
                _typeCache[typeName] = type;
            }
        }

        return type != null ? (T)Activator.CreateInstance(type) : null;
    }
}`
        }
      ]
    },
    advanced: {
      title: "🚀 Advanced Language Features",
      description: "Modern C# features and advanced programming concepts",
      concepts: [
        {
          id: 'nullable-types',
          icon: '❓',
          title: 'Nullable Types & Null Safety',
          description: 'Handling null values safely with nullable reference types and value types',
          details: [
            'Nullable value types (int?, DateTime?)',
            'Nullable reference types (C# 8.0+)',
            'Null-conditional operators (?. and ?[])',
            'Null-coalescing operators (?? and ??=)',
            'Null-forgiving operator (!) and nullable annotations'
          ],
          codeExample: `// Nullable value types
int? nullableInt = null;
DateTime? nullableDate = DateTime.Now;

if (nullableInt.HasValue)
{
    Console.WriteLine($"Value: {nullableInt.Value}");
}

// Nullable reference types (C# 8.0+)
#nullable enable

public class User
{
    public string Name { get; set; } = string.Empty;  // Non-nullable
    public string? Email { get; set; }                // Nullable
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLogin { get; set; }          // Nullable value type
}

// Null-conditional operators
public void ProcessUser(User? user)
{
    // Safe navigation
    var nameLength = user?.Name?.Length;
    var emailDomain = user?.Email?.Split('@')?[1];

    // Null-conditional with method calls
    user?.UpdateLastLogin();

    // Null-conditional with indexers
    var firstChar = user?.Name?[0];
}

// Null-coalescing operators
public string GetDisplayName(User? user)
{
    // Traditional null check
    return user?.Name ?? "Anonymous";

    // Null-coalescing assignment (C# 8.0+)
    user ??= new User();
    user.Email ??= "no-email@example.com";

    return user.Name;
}

// Pattern matching with null checks
public string GetUserStatus(User? user) => user switch
{
    null => "No user",
    { LastLogin: null } => "Never logged in",
    { LastLogin: var login } when login > DateTime.Now.AddDays(-7) => "Active",
    _ => "Inactive"
};

// Null-forgiving operator (use with caution)
public void ProcessNonNullUser(User? user)
{
    // We know user is not null here
    var name = user!.Name;  // Suppresses nullable warning
}`
        },
        {
          id: 'pattern-matching',
          icon: '🎯',
          title: 'Pattern Matching & Switch Expressions',
          description: 'Advanced pattern matching for concise and expressive code',
          details: [
            'Switch expressions (C# 8.0+)',
            'Property patterns and tuple patterns',
            'Positional patterns with deconstruction',
            'Relational patterns (C# 9.0+)',
            'Logical patterns (and, or, not)'
          ],
          codeExample: `// Switch expressions
public static string GetDayType(DayOfWeek day) => day switch
{
    DayOfWeek.Saturday or DayOfWeek.Sunday => "Weekend",
    DayOfWeek.Monday => "Start of work week",
    DayOfWeek.Friday => "TGIF!",
    _ => "Weekday"
};

// Property patterns
public static string GetDiscountLevel(Customer customer) => customer switch
{
    { IsVip: true, YearsActive: > 5 } => "Premium",
    { IsVip: true } => "VIP",
    { YearsActive: > 10 } => "Loyal",
    { YearsActive: > 2 } => "Regular",
    _ => "New"
};

// Tuple patterns
public static string GetQuadrant(int x, int y) => (x, y) switch
{
    (> 0, > 0) => "First quadrant",
    (< 0, > 0) => "Second quadrant",
    (< 0, < 0) => "Third quadrant",
    (> 0, < 0) => "Fourth quadrant",
    (0, 0) => "Origin",
    (0, _) => "On X-axis",
    (_, 0) => "On Y-axis"
};

// Positional patterns with records
public record Point(int X, int Y);

public static string AnalyzePoint(Point point) => point switch
{
    (0, 0) => "Origin",
    (var x, 0) => $"On X-axis at {x}",
    (0, var y) => $"On Y-axis at {y}",
    (var x, var y) when x == y => $"On diagonal at ({x}, {y})",
    (var x, var y) => $"Point at ({x}, {y})"
};

// Complex pattern matching with nested objects
public record Order(int Id, Customer Customer, OrderItem[] Items);
public record Customer(string Name, bool IsVip);
public record OrderItem(string Product, decimal Price, int Quantity);

public static string ProcessOrder(Order order) => order switch
{
    { Customer: { IsVip: true }, Items: { Length: > 10 } }
        => "VIP bulk order - priority processing",

    { Items: [var singleItem] }
        => $"Single item order: {singleItem.Product}",

    { Items: [var first, var second] }
        => $"Two item order: {first.Product} and {second.Product}",

    { Items: var items } when items.Sum(i => i.Price * i.Quantity) > 1000
        => "High value order",

    _ => "Standard order"
};

// Type patterns
public static string ProcessValue(object value) => value switch
{
    string s when s.Length > 10 => "Long string",
    string s => $"String: {s}",
    int i when i > 100 => "Large number",
    int i => $"Number: {i}",
    DateTime dt => $"Date: {dt:yyyy-MM-dd}",
    null => "Null value",
    _ => "Unknown type"
};`
        }
      ]
    },
    exceptions: {
      title: "⚠️ Exception Handling & Error Management",
      description: "Robust error handling patterns and exception management strategies",
      concepts: [
        {
          id: 'exception-handling',
          icon: '🛡️',
          title: 'Exception Handling Patterns',
          description: 'Try-catch-finally blocks, custom exceptions, and error handling best practices',
          details: [
            'Try-catch-finally blocks and exception flow',
            'Custom exception classes and inheritance',
            'Exception filtering and when clauses',
            'Exception handling best practices',
            'Logging and error reporting strategies'
          ],
          codeExample: `// Basic exception handling
public async Task<User> GetUserAsync(int id)
{
    try
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            throw new UserNotFoundException($"User with ID {id} not found");
        }
        return user;
    }
    catch (SqlException ex) when (ex.Number == 2) // Timeout
    {
        _logger.LogWarning("Database timeout while fetching user {UserId}", id);
        throw new ServiceUnavailableException("Database is currently unavailable", ex);
    }
    catch (SqlException ex)
    {
        _logger.LogError(ex, "Database error while fetching user {UserId}", id);
        throw new DataAccessException("Error accessing user data", ex);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Unexpected error while fetching user {UserId}", id);
        throw;
    }
}

// Custom exception hierarchy
public abstract class BusinessException : Exception
{
    public string ErrorCode { get; }

    protected BusinessException(string errorCode, string message) : base(message)
    {
        ErrorCode = errorCode;
    }

    protected BusinessException(string errorCode, string message, Exception innerException)
        : base(message, innerException)
    {
        ErrorCode = errorCode;
    }
}

public class UserNotFoundException : BusinessException
{
    public UserNotFoundException(string message)
        : base("USER_NOT_FOUND", message) { }
}

public class ValidationException : BusinessException
{
    public Dictionary<string, string[]> Errors { get; }

    public ValidationException(Dictionary<string, string[]> errors)
        : base("VALIDATION_ERROR", "One or more validation errors occurred")
    {
        Errors = errors;
    }
}

// Exception filtering with when clauses
public void ProcessFile(string filePath)
{
    try
    {
        var content = File.ReadAllText(filePath);
        // Process content
    }
    catch (FileNotFoundException ex) when (ex.FileName.EndsWith(".config"))
    {
        // Handle missing config files differently
        CreateDefaultConfig(ex.FileName);
    }
    catch (FileNotFoundException ex)
    {
        // Handle other missing files
        _logger.LogError("Required file not found: {FileName}", ex.FileName);
        throw;
    }
    catch (UnauthorizedAccessException ex) when (IsRetryable(ex))
    {
        // Retry logic for temporary access issues
        Thread.Sleep(1000);
        ProcessFile(filePath); // Retry once
    }
    finally
    {
        // Cleanup code that always runs
        CleanupTempFiles();
    }
}

// Result pattern for error handling without exceptions
public class Result<T>
{
    public bool IsSuccess { get; }
    public T Value { get; }
    public string Error { get; }

    private Result(T value)
    {
        IsSuccess = true;
        Value = value;
        Error = null;
    }

    private Result(string error)
    {
        IsSuccess = false;
        Value = default(T);
        Error = error;
    }

    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(string error) => new(error);
}

// Using Result pattern
public async Task<Result<User>> TryGetUserAsync(int id)
{
    try
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user != null
            ? Result<User>.Success(user)
            : Result<User>.Failure($"User with ID {id} not found");
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error fetching user {UserId}", id);
        return Result<User>.Failure("An error occurred while fetching the user");
    }
}`
        },
        {
          id: 'logging',
          icon: '📋',
          title: 'Logging & Diagnostics',
          description: 'Structured logging, performance monitoring, and application diagnostics',
          details: [
            'ILogger interface and dependency injection',
            'Structured logging with message templates',
            'Log levels and filtering',
            'Performance counters and metrics',
            'Distributed tracing and correlation IDs'
          ],
          codeExample: `// Structured logging with ILogger
public class UserService
{
    private readonly ILogger<UserService> _logger;
    private readonly IUserRepository _repository;

    public UserService(ILogger<UserService> logger, IUserRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }

    public async Task<User> CreateUserAsync(CreateUserRequest request)
    {
        using var scope = _logger.BeginScope("Creating user {Email}", request.Email);

        _logger.LogInformation("Starting user creation process");

        try
        {
            // Validate request
            if (string.IsNullOrEmpty(request.Email))
            {
                _logger.LogWarning("User creation failed: Email is required");
                throw new ValidationException("Email is required");
            }

            // Check if user exists
            var existingUser = await _repository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                _logger.LogWarning("User creation failed: Email {Email} already exists", request.Email);
                throw new BusinessException("User with this email already exists");
            }

            // Create user
            var user = new User
            {
                Email = request.Email,
                Name = request.Name,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(user);

            _logger.LogInformation("User created successfully with ID {UserId}", user.Id);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create user with email {Email}", request.Email);
            throw;
        }
    }
}

// Performance monitoring with Activity and metrics
public class OrderService
{
    private static readonly ActivitySource ActivitySource = new("OrderService");
    private static readonly Counter<int> OrdersProcessed =
        Meter.CreateCounter<int>("orders_processed_total");
    private static readonly Histogram<double> OrderProcessingTime =
        Meter.CreateHistogram<double>("order_processing_duration_ms");

    public async Task<Order> ProcessOrderAsync(CreateOrderRequest request)
    {
        using var activity = ActivitySource.StartActivity("ProcessOrder");
        activity?.SetTag("order.customer_id", request.CustomerId);

        var stopwatch = Stopwatch.StartNew();

        try
        {
            var order = await CreateOrderAsync(request);

            activity?.SetTag("order.id", order.Id);
            activity?.SetTag("order.total", order.Total);

            OrdersProcessed.Add(1, new KeyValuePair<string, object>("status", "success"));

            return order;
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            OrdersProcessed.Add(1, new KeyValuePair<string, object>("status", "error"));
            throw;
        }
        finally
        {
            stopwatch.Stop();
            OrderProcessingTime.Record(stopwatch.ElapsedMilliseconds);
        }
    }
}

// Custom logging extensions
public static class LoggerExtensions
{
    private static readonly Action<ILogger, string, int, Exception> _userCreated =
        LoggerMessage.Define<string, int>(
            LogLevel.Information,
            new EventId(1001, "UserCreated"),
            "User {Email} created with ID {UserId}");

    private static readonly Action<ILogger, string, Exception> _userCreationFailed =
        LoggerMessage.Define<string>(
            LogLevel.Error,
            new EventId(1002, "UserCreationFailed"),
            "Failed to create user {Email}");

    public static void UserCreated(this ILogger logger, string email, int userId)
    {
        _userCreated(logger, email, userId, null);
    }

    public static void UserCreationFailed(this ILogger logger, string email, Exception exception)
    {
        _userCreationFailed(logger, email, exception);
    }
}`
        }
      ]
    },
    collections: {
      title: "📚 Collections & Data Structures",
      description: "Built-in collections, custom data structures, and performance considerations",
      concepts: [
        {
          id: 'collections-overview',
          icon: '📦',
          title: 'Collection Types & Performance',
          description: 'Understanding different collection types and their performance characteristics',
          details: [
            'List<T>, Dictionary<TKey, TValue>, HashSet<T>',
            'Queue<T>, Stack<T>, LinkedList<T>',
            'Concurrent collections for thread safety',
            'Performance characteristics (O(1), O(n), O(log n))',
            'Memory usage and allocation patterns'
          ],
          codeExample: `// List<T> - Dynamic array
var numbers = new List<int> { 1, 2, 3, 4, 5 };
numbers.Add(6);                    // O(1) amortized
numbers.Insert(0, 0);              // O(n) - shifts elements
var item = numbers[3];             // O(1) - direct access
numbers.Remove(3);                 // O(n) - finds and removes

// Dictionary<TKey, TValue> - Hash table
var userLookup = new Dictionary<string, User>();
userLookup["john@email.com"] = new User("John");  // O(1) average
var user = userLookup["john@email.com"];          // O(1) average
bool exists = userLookup.ContainsKey("jane@email.com"); // O(1) average

// HashSet<T> - Unique elements
var uniqueIds = new HashSet<int> { 1, 2, 3, 2, 1 }; // {1, 2, 3}
uniqueIds.Add(4);                  // O(1) average
bool contains = uniqueIds.Contains(3);  // O(1) average
uniqueIds.UnionWith(new[] { 5, 6, 7 }); // Set operations

// Queue<T> - FIFO (First In, First Out)
var taskQueue = new Queue<string>();
taskQueue.Enqueue("Task 1");      // O(1)
taskQueue.Enqueue("Task 2");      // O(1)
var nextTask = taskQueue.Dequeue(); // O(1) - returns "Task 1"

// Stack<T> - LIFO (Last In, First Out)
var callStack = new Stack<string>();
callStack.Push("Method A");        // O(1)
callStack.Push("Method B");        // O(1)
var current = callStack.Pop();     // O(1) - returns "Method B"

// Concurrent collections for thread safety
var concurrentDict = new ConcurrentDictionary<string, int>();
concurrentDict.TryAdd("key1", 1);
concurrentDict.AddOrUpdate("key1", 1, (key, oldValue) => oldValue + 1);

var concurrentQueue = new ConcurrentQueue<string>();
concurrentQueue.Enqueue("item");
concurrentQueue.TryDequeue(out string result);

// Performance comparison example
public void PerformanceComparison()
{
    const int itemCount = 1_000_000;

    // List vs LinkedList for insertions
    var list = new List<int>(itemCount);
    var linkedList = new LinkedList<int>();

    // List: Fast append, slow insert at beginning
    for (int i = 0; i < itemCount; i++)
    {
        list.Add(i);           // O(1) amortized
        // list.Insert(0, i);  // O(n) - would be very slow
    }

    // LinkedList: Fast insert anywhere, no random access
    for (int i = 0; i < itemCount; i++)
    {
        linkedList.AddLast(i);  // O(1)
        // linkedList.AddFirst(i); // Also O(1)
    }

    // Dictionary vs SortedDictionary
    var dict = new Dictionary<string, int>();
    var sortedDict = new SortedDictionary<string, int>();

    // Dictionary: O(1) average operations
    dict["key"] = 1;           // O(1) average
    var value = dict["key"];   // O(1) average

    // SortedDictionary: O(log n) operations, but maintains order
    sortedDict["key"] = 1;     // O(log n)
    var sortedValue = sortedDict["key"]; // O(log n)
}`
        },
        {
          id: 'custom-collections',
          icon: '🔧',
          title: 'Custom Collections & Iterators',
          description: 'Creating custom collection types and implementing IEnumerable<T>',
          details: [
            'Implementing IEnumerable<T> and IEnumerator<T>',
            'Yield return for lazy evaluation',
            'Custom indexers and collection interfaces',
            'Thread-safe collection implementations',
            'Memory-efficient streaming collections'
          ],
          codeExample: `// Custom collection implementing IEnumerable<T>
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

    // Indexer for array-like access
    public T this[int index]
    {
        get
        {
            if (index < 0 || index >= _count)
                throw new ArgumentOutOfRangeException(nameof(index));

            return _buffer[(_head + index) % Capacity];
        }
        set
        {
            if (index < 0 || index >= _count)
                throw new ArgumentOutOfRangeException(nameof(index));

            _buffer[(_head + index) % Capacity] = value;
        }
    }

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

    public T RemoveFirst()
    {
        if (IsEmpty)
            throw new InvalidOperationException("Buffer is empty");

        var item = _buffer[_head];
        _buffer[_head] = default(T); // Clear reference
        _head = (_head + 1) % Capacity;
        _count--;

        return item;
    }

    // IEnumerable<T> implementation
    public IEnumerator<T> GetEnumerator()
    {
        for (int i = 0; i < _count; i++)
        {
            yield return this[i];
        }
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

// Lazy evaluation with yield return
public static class NumberSequences
{
    // Infinite sequence - only computed as needed
    public static IEnumerable<int> Fibonacci()
    {
        int a = 0, b = 1;

        while (true)
        {
            yield return a;
            (a, b) = (b, a + b);
        }
    }

    // Filtered sequence with deferred execution
    public static IEnumerable<int> PrimeNumbers(int max)
    {
        for (int candidate = 2; candidate <= max; candidate++)
        {
            if (IsPrime(candidate))
            {
                yield return candidate;
            }
        }
    }

    private static bool IsPrime(int number)
    {
        if (number < 2) return false;
        for (int i = 2; i <= Math.Sqrt(number); i++)
        {
            if (number % i == 0) return false;
        }
        return true;
    }

    // Streaming file processing
    public static IEnumerable<string> ReadLinesLazily(string filePath)
    {
        using var reader = new StreamReader(filePath);
        string line;

        while ((line = reader.ReadLine()) != null)
        {
            yield return line;
        }
    }
}

// Usage examples
public void UseCustomCollections()
{
    // Circular buffer usage
    var buffer = new CircularBuffer<string>(3);
    buffer.Add("A");
    buffer.Add("B");
    buffer.Add("C");
    buffer.Add("D"); // Overwrites "A"

    foreach (var item in buffer) // Iterates: B, C, D
    {
        Console.WriteLine(item);
    }

    // Lazy sequences
    var first10Fibonacci = NumberSequences.Fibonacci().Take(10);
    var primesUnder100 = NumberSequences.PrimeNumbers(100);

    // Only computed when enumerated
    foreach (var prime in primesUnder100.Where(p => p > 50))
    {
        Console.WriteLine(prime);
    }
}`
        }
      ]
    }
  };

  const categories = Object.keys(concepts);

  return (
    <div className="dotnet-learning-container">
      <div className="header-section">
        <h1>🧠 .NET Core Fundamental Concepts</h1>
        <p>Core programming concepts that modern .NET Core applications are built upon</p>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`tab-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {concepts[category].title}
          </button>
        ))}
      </div>

      <div className="category-content">
        <div className="category-header">
          <h2>{concepts[selectedCategory].title}</h2>
          <p>{concepts[selectedCategory].description}</p>
        </div>

        <div className="building-blocks-grid">
          {concepts[selectedCategory].concepts.map(concept => (
            <div key={concept.id} className="building-block-card">
              <div className="block-header" onClick={() => toggleConcept(concept.id)}>
                <div className="block-title">
                  <span className="block-icon">{concept.icon}</span>
                  <h3>{concept.title}</h3>
                </div>
                <span className={`expand-icon ${expandedConcepts[concept.id] ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              
              <p className="block-description">{concept.description}</p>
              
              {expandedConcepts[concept.id] && (
                <div className="block-details">
                  <div className="features-list">
                    <h4>🔑 Key Features:</h4>
                    <ul>
                      {concept.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="code-example">
                    <h4>💻 Code Example:</h4>
                    <pre><code>{concept.codeExample}</code></pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DotNetCoreConcepts;
