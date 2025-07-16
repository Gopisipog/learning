import React, { useState } from 'react';
import './DotNetCoreLearning.css';

const DotNetInterfaces = () => {
  const [selectedCategory, setSelectedCategory] = useState('collections');
  const [expandedInterfaces, setExpandedInterfaces] = useState({});

  const toggleInterface = (interfaceId) => {
    setExpandedInterfaces(prev => ({
      ...prev,
      [interfaceId]: !prev[interfaceId]
    }));
  };

  const interfaces = {
    collections: {
      title: "📚 Collection Interfaces",
      description: "Interfaces for working with collections and data structures",
      interfaces: [
        {
          id: 'ienumerable',
          icon: '🔄',
          name: 'IEnumerable<T>',
          problem: 'How do I iterate over a collection of items without knowing the underlying data structure?',
          solution: 'Provides a standard way to iterate through any collection using foreach loops and LINQ operations.',
          details: [
            'Enables foreach iteration over any collection',
            'Foundation for LINQ operations and query expressions',
            'Supports deferred execution and lazy evaluation',
            'Works with arrays, lists, sets, and custom collections',
            'Provides GetEnumerator() method for iteration'
          ],
          codeExample: `// Problem: Need to iterate over different collection types
List<string> names = new List<string> { "Alice", "Bob", "Charlie" };
string[] cities = { "New York", "London", "Tokyo" };

// Solution: IEnumerable<T> provides unified iteration
public void ProcessItems<T>(IEnumerable<T> items)
{
    foreach (var item in items)
    {
        Console.WriteLine(item);
    }
}

// Usage with different collection types
ProcessItems(names);  // Works with List<T>
ProcessItems(cities); // Works with arrays

// LINQ operations work on any IEnumerable<T>
var longNames = names.Where(n => n.Length > 4);
var sortedCities = cities.OrderBy(c => c);

// Custom implementation
public class NumberSequence : IEnumerable<int>
{
    private int[] numbers = { 1, 2, 3, 4, 5 };
    
    public IEnumerator<int> GetEnumerator()
    {
        foreach (int number in numbers)
        {
            yield return number;
        }
    }
    
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}`
        },
        {
          id: 'icollection',
          icon: '📦',
          name: 'ICollection<T>',
          problem: 'How do I add, remove, and check the size of a collection without knowing its specific type?',
          solution: 'Extends IEnumerable<T> with methods for modifying collections and checking their properties.',
          details: [
            'Provides Add(), Remove(), Clear() methods for modification',
            'Includes Count property for size information',
            'Contains() method for membership testing',
            'IsReadOnly property to check mutability',
            'CopyTo() method for copying to arrays'
          ],
          codeExample: `// Problem: Need to modify collections generically
public void ManageCollection<T>(ICollection<T> collection, T item)
{
    // Check if collection can be modified
    if (!collection.IsReadOnly)
    {
        // Add item if not already present
        if (!collection.Contains(item))
        {
            collection.Add(item);
            Console.WriteLine($"Added item. Count: {collection.Count}");
        }
        
        // Remove item if present
        if (collection.Remove(item))
        {
            Console.WriteLine($"Removed item. Count: {collection.Count}");
        }
    }
}

// Usage with different collection types
var list = new List<string> { "apple", "banana" };
var hashSet = new HashSet<string> { "red", "green" };

ManageCollection(list, "orange");    // Works with List<T>
ManageCollection(hashSet, "blue");   // Works with HashSet<T>

// Copy to array
string[] array = new string[list.Count];
list.CopyTo(array, 0);

// Clear all items
list.Clear();
Console.WriteLine($"List count after clear: {list.Count}");`
        },
        {
          id: 'ilist',
          icon: '📋',
          name: 'IList<T>',
          problem: 'How do I access collection items by index and insert items at specific positions?',
          solution: 'Extends ICollection<T> with indexed access and positional insertion/removal capabilities.',
          details: [
            'Provides indexer for direct access by position',
            'Insert() and RemoveAt() methods for positional operations',
            'IndexOf() method to find item positions',
            'Maintains order of elements',
            'Supports both read and write operations by index'
          ],
          codeExample: `// Problem: Need indexed access and positional operations
public void ManageIndexedCollection<T>(IList<T> list, T item)
{
    // Access by index
    if (list.Count > 0)
    {
        T firstItem = list[0];
        Console.WriteLine($"First item: {firstItem}");
    }
    
    // Insert at specific position
    list.Insert(0, item);
    Console.WriteLine($"Inserted at position 0");
    
    // Find position of item
    int index = list.IndexOf(item);
    Console.WriteLine($"Item found at index: {index}");
    
    // Remove by index
    if (list.Count > 1)
    {
        list.RemoveAt(1);
        Console.WriteLine("Removed item at index 1");
    }
    
    // Modify by index
    if (list.Count > 0)
    {
        list[0] = item; // Replace first item
    }
}

// Usage
var numbers = new List<int> { 10, 20, 30 };
ManageIndexedCollection(numbers, 5);

// Works with arrays too (but limited modification)
int[] array = { 1, 2, 3 };
// array implements IList<int> but Insert/RemoveAt throw exceptions

// Custom indexed collection
public class IndexedCollection<T> : IList<T>
{
    private List<T> items = new List<T>();
    
    public T this[int index] 
    { 
        get => items[index]; 
        set => items[index] = value; 
    }
    
    public void Insert(int index, T item) => items.Insert(index, item);
    public void RemoveAt(int index) => items.RemoveAt(index);
    public int IndexOf(T item) => items.IndexOf(item);
    
    // ... other IList<T> and ICollection<T> members
}`
        }
      ]
    },
    async: {
      title: "⚡ Asynchronous Interfaces",
      description: "Interfaces for asynchronous programming and async operations",
      interfaces: [
        {
          id: 'itask',
          icon: '🔄',
          name: 'IAsyncEnumerable<T>',
          problem: 'How do I iterate over data that arrives asynchronously, like streaming data or database results?',
          solution: 'Provides asynchronous iteration capabilities for data that becomes available over time.',
          details: [
            'Enables await foreach for asynchronous iteration',
            'Perfect for streaming data, database cursors, API pagination',
            'Supports cancellation tokens for cooperative cancellation',
            'Provides backpressure handling for slow consumers',
            'Integrates with async/await patterns'
          ],
          codeExample: `// Problem: Need to process data that arrives asynchronously
public async IAsyncEnumerable<string> ReadLinesAsync(string filePath)
{
    using var reader = new StreamReader(filePath);
    string line;

    while ((line = await reader.ReadLineAsync()) != null)
    {
        yield return line;
    }
}

// Problem: Database results that should be streamed
public async IAsyncEnumerable<User> GetUsersAsync(
    [EnumeratorCancellation] CancellationToken cancellationToken = default)
{
    using var connection = new SqlConnection(connectionString);
    await connection.OpenAsync(cancellationToken);

    using var command = new SqlCommand("SELECT * FROM Users", connection);
    using var reader = await command.ExecuteReaderAsync(cancellationToken);

    while (await reader.ReadAsync(cancellationToken))
    {
        yield return new User
        {
            Id = reader.GetInt32("Id"),
            Name = reader.GetString("Name"),
            Email = reader.GetString("Email")
        };
    }
}

// Usage: Asynchronous iteration
await foreach (var line in ReadLinesAsync("large-file.txt"))
{
    Console.WriteLine(line);
    // Process each line as it's read, without loading entire file
}

await foreach (var user in GetUsersAsync())
{
    Console.WriteLine($"Processing user: {user.Name}");
    // Process users one by one without loading all into memory
}

// With cancellation
using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(5));
await foreach (var user in GetUsersAsync(cts.Token))
{
    // Will stop after 5 minutes
    await ProcessUserAsync(user);
}`
        },
        {
          id: 'iqueryable',
          icon: '🔍',
          name: 'IQueryable<T>',
          problem: 'How do I build database queries that are translated to SQL instead of loading all data into memory first?',
          solution: 'Provides expression tree-based querying that enables LINQ queries to be translated to database-specific SQL.',
          details: [
            'Expression trees enable query translation to SQL',
            'Deferred execution - queries run when enumerated',
            'Composable queries that build complex SQL',
            'Provider pattern supports different databases',
            'Significant performance benefits over IEnumerable for large datasets'
          ],
          codeExample: `// Problem: Need efficient database querying without loading all data
public class UserRepository
{
    private readonly DbContext _context;

    public UserRepository(DbContext context)
    {
        _context = context;
    }

    // Returns IQueryable - no database hit yet
    public IQueryable<User> GetActiveUsers()
    {
        return _context.Users.Where(u => u.IsActive);
    }

    // Composable queries
    public async Task<List<User>> GetUsersByDepartmentAsync(string department, int minAge)
    {
        return await _context.Users
            .Where(u => u.IsActive)                    // SQL: WHERE IsActive = 1
            .Where(u => u.Department == department)    // SQL: AND Department = @department
            .Where(u => u.Age >= minAge)               // SQL: AND Age >= @minAge
            .OrderBy(u => u.Name)                      // SQL: ORDER BY Name
            .Select(u => new User                      // SQL: SELECT specific columns
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Department = u.Department
            })
            .ToListAsync();                            // Execute query here
    }

    // Complex query with joins
    public IQueryable<UserWithOrdersDto> GetUsersWithRecentOrders()
    {
        return from user in _context.Users
               join order in _context.Orders on user.Id equals order.UserId
               where order.OrderDate > DateTime.Now.AddDays(-30)
               group order by new { user.Id, user.Name, user.Email } into g
               select new UserWithOrdersDto
               {
                   UserId = g.Key.Id,
                   UserName = g.Key.Name,
                   Email = g.Key.Email,
                   RecentOrderCount = g.Count(),
                   TotalAmount = g.Sum(o => o.Total)
               };
    }
}

// IQueryable vs IEnumerable comparison
public void CompareQueryTypes()
{
    // IQueryable - Executed in database (EFFICIENT)
    IQueryable<User> queryableUsers = _context.Users
        .Where(u => u.Age > 18)        // SQL: WHERE Age > 18
        .Take(10);                     // SQL: TOP 10

    // IEnumerable - Executed in memory (INEFFICIENT for large datasets)
    IEnumerable<User> enumerableUsers = _context.Users
        .AsEnumerable()                // Loads ALL users to memory first!
        .Where(u => u.Age > 18)        // Filters in memory
        .Take(10);                     // Takes first 10 in memory
}

// Dynamic query building
public IQueryable<User> BuildDynamicQuery(UserSearchCriteria criteria)
{
    var query = _context.Users.AsQueryable();

    if (!string.IsNullOrEmpty(criteria.Name))
    {
        query = query.Where(u => u.Name.Contains(criteria.Name));
    }

    if (criteria.MinAge.HasValue)
    {
        query = query.Where(u => u.Age >= criteria.MinAge.Value);
    }

    if (!string.IsNullOrEmpty(criteria.Department))
    {
        query = query.Where(u => u.Department == criteria.Department);
    }

    return query.OrderBy(u => u.Name);
}

// Extension methods for IQueryable
public static class QueryableExtensions
{
    public static IQueryable<T> WhereIf<T>(
        this IQueryable<T> query,
        bool condition,
        Expression<Func<T, bool>> predicate)
    {
        return condition ? query.Where(predicate) : query;
    }

    public static IQueryable<T> Paginate<T>(
        this IQueryable<T> query,
        int page,
        int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }
}

// Usage with extensions
var users = _context.Users
    .WhereIf(!string.IsNullOrEmpty(searchTerm), u => u.Name.Contains(searchTerm))
    .WhereIf(minAge.HasValue, u => u.Age >= minAge.Value)
    .Paginate(page, pageSize)
    .ToListAsync();`
        }
      ]
    },
    disposal: {
      title: "🗑️ Resource Management Interfaces",
      description: "Interfaces for proper resource cleanup and memory management",
      interfaces: [
        {
          id: 'idisposable',
          icon: '🧹',
          name: 'IDisposable',
          problem: 'How do I ensure that unmanaged resources (files, database connections, network streams) are properly cleaned up?',
          solution: 'Provides a standard pattern for releasing unmanaged resources deterministically.',
          details: [
            'Ensures proper cleanup of unmanaged resources',
            'Works with using statements for automatic disposal',
            'Prevents resource leaks and memory issues',
            'Integrates with garbage collection',
            'Supports both managed and unmanaged resource cleanup'
          ],
          codeExample: `// Problem: Need to ensure database connections are closed
public class DatabaseManager : IDisposable
{
    private SqlConnection _connection;
    private bool _disposed = false;

    public DatabaseManager(string connectionString)
    {
        _connection = new SqlConnection(connectionString);
        _connection.Open();
    }

    public void ExecuteQuery(string sql)
    {
        if (_disposed)
            throw new ObjectDisposedException(nameof(DatabaseManager));

        using var command = new SqlCommand(sql, _connection);
        command.ExecuteNonQuery();
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
                // Dispose managed resources
                _connection?.Dispose();
            }

            // Clean up unmanaged resources here if any
            _disposed = true;
        }
    }

    ~DatabaseManager()
    {
        Dispose(false);
    }
}

// Usage with using statement (automatic disposal)
using (var dbManager = new DatabaseManager(connectionString))
{
    dbManager.ExecuteQuery("SELECT * FROM Users");
} // Dispose() called automatically here

// C# 8.0+ using declaration
using var dbManager2 = new DatabaseManager(connectionString);
dbManager2.ExecuteQuery("SELECT * FROM Products");
// Dispose() called at end of scope`
        },
        {
          id: 'iasyncdisposable',
          icon: '🔄🗑️',
          name: 'IAsyncDisposable',
          problem: 'How do I properly clean up resources that require asynchronous operations during disposal?',
          solution: 'Provides asynchronous disposal for resources that need async cleanup operations.',
          details: [
            'Enables asynchronous resource cleanup',
            'Perfect for network connections, async file operations',
            'Works with await using statements',
            'Prevents blocking during disposal',
            'Integrates with async/await patterns'
          ],
          codeExample: `// Problem: Network connections need async cleanup
public class AsyncHttpClient : IAsyncDisposable
{
    private readonly HttpClient _httpClient;
    private readonly SemaphoreSlim _semaphore;
    private bool _disposed = false;

    public AsyncHttpClient()
    {
        _httpClient = new HttpClient();
        _semaphore = new SemaphoreSlim(1, 1);
    }

    public async Task<string> GetDataAsync(string url)
    {
        if (_disposed)
            throw new ObjectDisposedException(nameof(AsyncHttpClient));

        await _semaphore.WaitAsync();
        try
        {
            var response = await _httpClient.GetAsync(url);
            return await response.Content.ReadAsStringAsync();
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (!_disposed)
        {
            // Wait for any pending operations
            await _semaphore.WaitAsync();
            try
            {
                // Dispose managed resources
                _httpClient?.Dispose();
                _semaphore?.Dispose();

                _disposed = true;
            }
            finally
            {
                _semaphore?.Release();
            }
        }

        GC.SuppressFinalize(this);
    }
}

// Usage with await using
await using var client = new AsyncHttpClient();
var data = await client.GetDataAsync("https://api.example.com/data");
// DisposeAsync() called automatically here

// Manual async disposal
var client2 = new AsyncHttpClient();
try
{
    var data2 = await client2.GetDataAsync("https://api.example.com/data");
}
finally
{
    await client2.DisposeAsync();
}`
        }
      ]
    },
    comparison: {
      title: "⚖️ Comparison Interfaces",
      description: "Interfaces for comparing and sorting objects",
      interfaces: [
        {
          id: 'icomparable',
          icon: '📊',
          name: 'IComparable<T>',
          problem: 'How do I define a natural ordering for my custom objects so they can be sorted?',
          solution: 'Provides a standard way to compare objects for sorting and ordering operations.',
          details: [
            'Defines natural ordering for custom types',
            'Enables Array.Sort(), List.Sort(), and LINQ OrderBy()',
            'Returns -1, 0, or 1 for less than, equal, or greater than',
            'Should be consistent with Equals() method',
            'Allows objects to be used as keys in sorted collections'
          ],
          codeExample: `// Problem: Need to sort custom Person objects by age
public class Person : IComparable<Person>
{
    public string Name { get; set; }
    public int Age { get; set; }
    public DateTime BirthDate { get; set; }

    // Define natural ordering (by age in this case)
    public int CompareTo(Person other)
    {
        if (other == null) return 1;

        // Compare by age (natural ordering)
        return Age.CompareTo(other.Age);
    }

    public override string ToString()
    {
        return $"{Name} (Age: {Age})";
    }
}

// Usage: Sorting becomes automatic
var people = new List<Person>
{
    new Person { Name = "Alice", Age = 30 },
    new Person { Name = "Bob", Age = 25 },
    new Person { Name = "Charlie", Age = 35 }
};

// Sort using natural ordering (by age)
people.Sort();
foreach (var person in people)
{
    Console.WriteLine(person); // Bob (25), Alice (30), Charlie (35)
}

// Works with LINQ OrderBy
var sortedPeople = people.OrderBy(p => p).ToList();

// Works with arrays
Person[] peopleArray = people.ToArray();
Array.Sort(peopleArray);

// Can be used in sorted collections
var sortedSet = new SortedSet<Person>(people);
// Automatically maintains sorted order by age`
        },
        {
          id: 'icomparer',
          icon: '🔀',
          name: 'IComparer<T>',
          problem: 'How do I define custom sorting logic that differs from the natural ordering of objects?',
          solution: 'Provides a way to define custom comparison logic separate from the object itself.',
          details: [
            'Defines custom sorting strategies',
            'Allows multiple different sorting approaches',
            'Can be used with Sort() methods and sorted collections',
            'Separates comparison logic from the object',
            'Enables sorting by different criteria'
          ],
          codeExample: `// Problem: Want to sort Person objects by different criteria
public class PersonNameComparer : IComparer<Person>
{
    public int Compare(Person x, Person y)
    {
        if (x == null && y == null) return 0;
        if (x == null) return -1;
        if (y == null) return 1;

        return string.Compare(x.Name, y.Name, StringComparison.OrdinalIgnoreCase);
    }
}

public class PersonBirthDateComparer : IComparer<Person>
{
    public int Compare(Person x, Person y)
    {
        if (x == null && y == null) return 0;
        if (x == null) return -1;
        if (y == null) return 1;

        return x.BirthDate.CompareTo(y.BirthDate);
    }
}

// Usage: Different sorting strategies
var people = new List<Person>
{
    new Person { Name = "Charlie", Age = 35, BirthDate = new DateTime(1988, 5, 15) },
    new Person { Name = "Alice", Age = 30, BirthDate = new DateTime(1993, 2, 10) },
    new Person { Name = "Bob", Age = 25, BirthDate = new DateTime(1998, 8, 22) }
};

// Sort by name
people.Sort(new PersonNameComparer());
Console.WriteLine("Sorted by name:");
people.ForEach(Console.WriteLine);

// Sort by birth date
people.Sort(new PersonBirthDateComparer());
Console.WriteLine("Sorted by birth date:");
people.ForEach(Console.WriteLine);

// Use with LINQ
var sortedByName = people.OrderBy(p => p, new PersonNameComparer());

// Use with sorted collections
var nameOrderedSet = new SortedSet<Person>(new PersonNameComparer());
nameOrderedSet.UnionWith(people);

// Anonymous comparer using Comparer<T>.Create
var ageDescendingComparer = Comparer<Person>.Create((x, y) => y.Age.CompareTo(x.Age));
people.Sort(ageDescendingComparer);`
        }
      ]
    },
    ui: {
      title: "🖥️ UI & Data Binding Interfaces",
      description: "Interfaces for user interface development and data binding",
      interfaces: [
        {
          id: 'inotifypropertychanged',
          icon: '🔔',
          name: 'INotifyPropertyChanged',
          problem: 'How do I automatically update the UI when my object properties change without manually refreshing?',
          solution: 'Provides a standard way to notify the UI when property values change, enabling automatic data binding updates.',
          details: [
            'Enables automatic UI updates when properties change',
            'Essential for MVVM pattern in WPF, WinUI, Xamarin',
            'Reduces boilerplate code for property change notifications',
            'Supports two-way data binding scenarios',
            'Integrates with ObservableCollection for collection changes'
          ],
          codeExample: `// Problem: UI doesn't update when object properties change
public class User : INotifyPropertyChanged
{
    private string _name;
    private string _email;
    private bool _isActive;

    public string Name
    {
        get => _name;
        set
        {
            if (_name != value)
            {
                _name = value;
                OnPropertyChanged();
                // UI automatically updates when Name changes
            }
        }
    }

    public string Email
    {
        get => _email;
        set
        {
            if (_email != value)
            {
                _email = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(DisplayText)); // Notify dependent properties
            }
        }
    }

    public bool IsActive
    {
        get => _isActive;
        set
        {
            if (_isActive != value)
            {
                _isActive = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(StatusText));
            }
        }
    }

    // Computed properties that depend on other properties
    public string DisplayText => $"{Name} ({Email})";
    public string StatusText => IsActive ? "Active" : "Inactive";

    public event PropertyChangedEventHandler PropertyChanged;

    protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}

// Base class to reduce boilerplate
public abstract class NotifyPropertyChangedBase : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler PropertyChanged;

    protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    protected bool SetProperty<T>(ref T field, T value, [CallerMemberName] string propertyName = null)
    {
        if (EqualityComparer<T>.Default.Equals(field, value))
            return false;

        field = value;
        OnPropertyChanged(propertyName);
        return true;
    }
}

// Simplified usage with base class
public class Product : NotifyPropertyChangedBase
{
    private string _name;
    private decimal _price;
    private int _quantity;

    public string Name
    {
        get => _name;
        set => SetProperty(ref _name, value);
    }

    public decimal Price
    {
        get => _price;
        set
        {
            if (SetProperty(ref _price, value))
            {
                OnPropertyChanged(nameof(Total)); // Notify dependent property
            }
        }
    }

    public int Quantity
    {
        get => _quantity;
        set
        {
            if (SetProperty(ref _quantity, value))
            {
                OnPropertyChanged(nameof(Total));
            }
        }
    }

    public decimal Total => Price * Quantity;
}

// ViewModel for MVVM pattern
public class UserListViewModel : NotifyPropertyChangedBase
{
    private ObservableCollection<User> _users;
    private User _selectedUser;
    private string _searchText;

    public ObservableCollection<User> Users
    {
        get => _users;
        set => SetProperty(ref _users, value);
    }

    public User SelectedUser
    {
        get => _selectedUser;
        set => SetProperty(ref _selectedUser, value);
    }

    public string SearchText
    {
        get => _searchText;
        set
        {
            if (SetProperty(ref _searchText, value))
            {
                FilterUsers(); // Automatically filter when search text changes
            }
        }
    }

    private void FilterUsers()
    {
        // Filter logic here - UI will automatically update
        var filtered = string.IsNullOrEmpty(SearchText)
            ? _allUsers
            : _allUsers.Where(u => u.Name.Contains(SearchText, StringComparison.OrdinalIgnoreCase));

        Users = new ObservableCollection<User>(filtered);
    }
}

// XAML binding (automatically updates when properties change)
/*
<TextBox Text="{Binding SearchText, Mode=TwoWay}" />
<ListBox ItemsSource="{Binding Users}" SelectedItem="{Binding SelectedUser}" />
<TextBlock Text="{Binding SelectedUser.DisplayText}" />
<TextBlock Text="{Binding SelectedUser.StatusText}" />
*/`
        }
      ]
    },
    services: {
      title: "🔧 Service & Configuration Interfaces",
      description: "Interfaces for dependency injection, configuration, and service management",
      interfaces: [
        {
          id: 'ilogger',
          icon: '📝',
          name: 'ILogger<T>',
          problem: 'How do I add logging to my application without tightly coupling to a specific logging framework?',
          solution: 'Provides a standard logging interface that works with any logging provider (Console, File, Database, etc.).',
          details: [
            'Framework-agnostic logging interface',
            'Supports different log levels (Debug, Info, Warning, Error)',
            'Structured logging with message templates',
            'Integrates with dependency injection',
            'Supports scopes and correlation IDs'
          ],
          codeExample: `// Problem: Need logging without coupling to specific framework
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
        _logger.LogInformation("Creating user with email {Email}", request.Email);

        try
        {
            // Validate request
            if (string.IsNullOrEmpty(request.Email))
            {
                _logger.LogWarning("User creation failed: Email is required");
                throw new ArgumentException("Email is required");
            }

            // Check if user exists
            var existingUser = await _repository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                _logger.LogWarning("User creation failed: Email {Email} already exists", request.Email);
                throw new InvalidOperationException("User already exists");
            }

            // Create user
            var user = new User
            {
                Email = request.Email,
                Name = request.Name,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(user);

            _logger.LogInformation("User {UserId} created successfully", user.Id);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create user with email {Email}", request.Email);
            throw;
        }
    }

    public async Task DeleteUserAsync(int userId)
    {
        using var scope = _logger.BeginScope("Deleting user {UserId}", userId);

        _logger.LogInformation("Starting user deletion");

        var user = await _repository.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User not found for deletion");
            return;
        }

        await _repository.DeleteAsync(userId);
        _logger.LogInformation("User deleted successfully");
    }
}

// Registration in Program.cs
builder.Services.AddLogging(builder =>
{
    builder.AddConsole();
    builder.AddFile("logs/app.log");
    builder.AddApplicationInsights();
});`
        },
        {
          id: 'iconfiguration',
          icon: '⚙️',
          name: 'IConfiguration',
          problem: 'How do I access application settings from different sources (appsettings.json, environment variables, command line) in a unified way?',
          solution: 'Provides a unified interface to access configuration from multiple sources with hierarchical structure.',
          details: [
            'Unified access to configuration from multiple sources',
            'Hierarchical configuration with sections',
            'Strong-typed configuration binding',
            'Environment-specific overrides',
            'Real-time configuration reloading'
          ],
          codeExample: `// Problem: Need to access configuration from multiple sources
public class EmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        // Access configuration values
        var smtpServer = _configuration["Email:SmtpServer"];
        var smtpPort = _configuration.GetValue<int>("Email:SmtpPort");
        var username = _configuration["Email:Username"];
        var password = _configuration["Email:Password"];

        // Access with default values
        var timeout = _configuration.GetValue<int>("Email:Timeout", 30000);
        var enableSsl = _configuration.GetValue<bool>("Email:EnableSsl", true);

        _logger.LogInformation("Sending email to {To} via {SmtpServer}:{SmtpPort}",
            to, smtpServer, smtpPort);

        // Email sending logic here...
    }
}

// Strong-typed configuration
public class EmailSettings
{
    public string SmtpServer { get; set; }
    public int SmtpPort { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public int Timeout { get; set; } = 30000;
    public bool EnableSsl { get; set; } = true;
}

public class EmailServiceWithOptions
{
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<EmailServiceWithOptions> _logger;

    public EmailServiceWithOptions(IOptions<EmailSettings> emailOptions, ILogger<EmailServiceWithOptions> logger)
    {
        _emailSettings = emailOptions.Value;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        _logger.LogInformation("Sending email to {To} via {SmtpServer}:{SmtpPort}",
            to, _emailSettings.SmtpServer, _emailSettings.SmtpPort);

        // Use strongly-typed settings
        // Email sending logic here...
    }
}

// Registration in Program.cs
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("Email"));

// appsettings.json
{
  "Email": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "Username": "your-email@gmail.com",
    "Password": "your-password",
    "EnableSsl": true
  }
}

// Environment variables override (Email__SmtpServer=smtp.outlook.com)
// Command line override (--Email:SmtpServer=smtp.outlook.com)`
        }
      ]
    },
    serialization: {
      title: "📄 Serialization Interfaces",
      description: "Interfaces for converting objects to and from different formats",
      interfaces: [
        {
          id: 'iserializable',
          icon: '💾',
          name: 'ISerializable',
          problem: 'How do I control exactly how my objects are serialized and deserialized, especially for complex scenarios?',
          solution: 'Provides complete control over the serialization process for custom serialization logic.',
          details: [
            'Complete control over serialization process',
            'Custom serialization logic for complex objects',
            'Handles versioning and backward compatibility',
            'Works with binary and XML serialization',
            'Supports security and validation during deserialization'
          ],
          codeExample: `// Problem: Need custom serialization for complex object
[Serializable]
public class BankAccount : ISerializable
{
    public string AccountNumber { get; private set; }
    public decimal Balance { get; private set; }
    public DateTime LastTransaction { get; private set; }

    // Sensitive data that shouldn't be serialized directly
    private string _encryptedPin;

    public BankAccount(string accountNumber, decimal balance)
    {
        AccountNumber = accountNumber;
        Balance = balance;
        LastTransaction = DateTime.UtcNow;
    }

    // Deserialization constructor
    protected BankAccount(SerializationInfo info, StreamingContext context)
    {
        AccountNumber = info.GetString("AccountNumber");
        Balance = info.GetDecimal("Balance");
        LastTransaction = info.GetDateTime("LastTransaction");

        // Custom deserialization logic
        var encryptedData = info.GetString("EncryptedData");
        _encryptedPin = DecryptPin(encryptedData);

        // Version handling
        var version = info.GetInt32("Version");
        if (version < 2)
        {
            // Handle old version compatibility
            MigrateFromVersion1();
        }
    }

    // Custom serialization logic
    public void GetObjectData(SerializationInfo info, StreamingContext context)
    {
        info.AddValue("AccountNumber", AccountNumber);
        info.AddValue("Balance", Balance);
        info.AddValue("LastTransaction", LastTransaction);
        info.AddValue("Version", 2);

        // Custom serialization - encrypt sensitive data
        var encryptedData = EncryptPin(_encryptedPin);
        info.AddValue("EncryptedData", encryptedData);

        // Add security check
        if (context.Context is not SecurityContext securityContext ||
            !securityContext.HasPermission("SerializeBankAccount"))
        {
            throw new SecurityException("Insufficient permissions to serialize bank account");
        }
    }

    private string EncryptPin(string pin) => /* encryption logic */ pin;
    private string DecryptPin(string encrypted) => /* decryption logic */ encrypted;
    private void MigrateFromVersion1() => /* migration logic */ { }
}

// Usage
var account = new BankAccount("12345", 1000.50m);

// Serialize
var formatter = new BinaryFormatter();
using var stream = new MemoryStream();
formatter.Serialize(stream, account);

// Deserialize
stream.Position = 0;
var deserializedAccount = (BankAccount)formatter.Deserialize(stream);`
        }
      ]
    }
  };

  const categories = Object.keys(interfaces);

  return (
    <div className="dotnet-learning-container">
      <div className="header-section">
        <h1>🔌 .NET Core Common Interfaces</h1>
        <p className="subtitle">
          Essential interfaces that solve common programming problems in .NET applications
        </p>
        <div className="learning-objectives">
          <h3>🎯 What You'll Learn:</h3>
          <ul>
            <li>Common .NET interfaces and the problems they solve</li>
            <li>When and how to use each interface effectively</li>
            <li>Real-world implementation examples and best practices</li>
            <li>How interfaces enable polymorphism and flexible design</li>
          </ul>
        </div>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`tab-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {interfaces[category].title}
          </button>
        ))}
      </div>

      <div className="category-content">
        <div className="category-header">
          <h2>{interfaces[selectedCategory].title}</h2>
          <p className="category-description">{interfaces[selectedCategory].description}</p>
        </div>

        <div className="interfaces-grid">
          {interfaces[selectedCategory].interfaces.map(interfaceItem => (
            <div key={interfaceItem.id} className="interface-card">
              <div className="interface-header" onClick={() => toggleInterface(interfaceItem.id)}>
                <div className="interface-title">
                  <span className="interface-icon">{interfaceItem.icon}</span>
                  <h3>{interfaceItem.name}</h3>
                </div>
                <span className={`expand-icon ${expandedInterfaces[interfaceItem.id] ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              
              <div className="problem-solution">
                <div className="problem-section">
                  <h4>❓ Problem It Solves:</h4>
                  <p className="problem-text">{interfaceItem.problem}</p>
                </div>
                
                <div className="solution-section">
                  <h4>✅ Solution:</h4>
                  <p className="solution-text">{interfaceItem.solution}</p>
                </div>
              </div>
              
              {expandedInterfaces[interfaceItem.id] && (
                <div className="interface-details">
                  <div className="features-section">
                    <h4>🔑 Key Features:</h4>
                    <ul className="features-list">
                      {interfaceItem.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="code-section">
                    <h4>💻 Implementation Example:</h4>
                    <pre className="code-block">
                      <code>{interfaceItem.codeExample}</code>
                    </pre>
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

export default DotNetInterfaces;
