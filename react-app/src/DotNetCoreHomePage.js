import React, { useState } from 'react';
import './DotNetCoreLearning.css';

const DotNetCoreHomePage = () => {
  const [selectedModules, setSelectedModules] = useState([]);
  const [promptsGenerated, setPromptsGenerated] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  const learningModules = [
    {
      id: 'fundamentals',
      title: '.NET Core 8.0 Fundamentals',
      level: 'beginner',
      icon: '🏗️',
      description: 'Core concepts and architecture of .NET Core 8.0',
      topics: [
        'Understanding .NET Core vs .NET Framework',
        'Cross-platform development capabilities',
        'Runtime and SDK installation',
        'Project structure and file organization'
      ]
    },
    {
      id: 'project-setup',
      title: 'Project Setup and CLI',
      level: 'beginner',
      icon: '⚙️',
      description: 'Setting up development environment and using .NET CLI.',
      topics: [
        'Installing .NET Core 8.0 SDK',
        'Using dotnet CLI commands',
        'Creating different project types',
        'Managing NuGet packages'
      ]
    },
    {
      id: 'csharp-basics',
      title: 'C# Language Fundamentals',
      level: 'beginner',
      icon: '📝',
      description: 'Essential C# programming concepts for .NET Core',
      topics: [
        'Variables, data types, and operators',
        'Control structures and loops',
        'Methods and parameter handling',
        'Object-oriented programming basics'
      ]
    },
    {
      id: 'dotnet-core-dev-guide',
      title: '.NET Core Development Guide',
      level: 'beginner',
      icon: '📖',
      description: 'A comprehensive guide to setting up your .NET development environment and using the .NET CLI.',
      topics: [
        'SDK Installation and Setup',
        'Basic .NET CLI Commands',
        'Project and Dependency Management',
        'Advanced .NET CLI Topics'
      ]
    },
    {
      id: 'web-api',
      title: 'Building Web APIs',
      level: 'intermediate',
      icon: '🌐',
      description: 'Creating RESTful APIs with ASP.NET Core',
      topics: [
        'Controller-based API development',
        'Routing and action methods',
        'Model binding and validation',
        'HTTP status codes and responses'
      ]
    },
    {
      id: 'dependency-injection',
      title: 'Dependency Injection',
      level: 'intermediate',
      icon: '🔗',
      description: 'Understanding and implementing DI in .NET Core',
      topics: [
        'Built-in DI container',
        'Service lifetimes (Singleton, Scoped, Transient)',
        'Interface-based programming',
        'Constructor and method injection'
      ]
    },
    {
      id: 'entity-framework',
      title: 'Entity Framework Core',
      level: 'intermediate',
      icon: '🗄️',
      description: 'Database operations with EF Core ORM',
      topics: [
        'Code-first approach and migrations',
        'DbContext and DbSet configuration',
        'LINQ queries and relationships',
        'Database seeding and configuration'
      ]
    },
    {
      id: 'middleware',
      title: 'Middleware Pipeline',
      level: 'intermediate',
      icon: '🔄',
      description: 'Understanding request/response pipeline',
      topics: [
        'Built-in middleware components',
        'Custom middleware creation',
        'Middleware ordering and execution',
        'Exception handling middleware'
      ]
    },
    {
      id: 'configuration',
      title: 'Configuration Management',
      level: 'beginner',
      icon: '⚙️',
      description: 'Managing application settings and configuration',
      topics: [
        'appsettings.json configuration',
        'Environment-specific settings',
        'Options pattern implementation',
        'Configuration providers and sources'
      ]
    },
    {
      id: 'logging',
      title: 'Logging and Monitoring',
      level: 'beginner',
      icon: '📊',
      description: 'Implementing logging and application monitoring',
      topics: [
        'Built-in logging framework',
        'Log levels and categories',
        'Structured logging with Serilog',
        'Application insights integration'
      ]
    },
    {
      id: 'testing',
      title: 'Unit Testing',
      level: 'intermediate',
      icon: '🧪',
      description: 'Writing and running unit tests',
      topics: [
        'xUnit testing framework',
        'Test project setup and organization',
        'Mocking with Moq framework',
        'Test-driven development practices'
      ]
    },
    {
      id: 'security',
      title: 'Security Fundamentals',
      level: 'advanced',
      icon: '🔒',
      description: 'Implementing security in .NET Core applications',
      topics: [
        'Authentication and authorization',
        'JWT token implementation',
        'HTTPS and SSL configuration',
        'Input validation and sanitization'
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment and Hosting',
      level: 'advanced',
      icon: '🚀',
      description: 'Deploying .NET Core applications',
      topics: [
        'Self-contained vs framework-dependent deployment',
        'Docker containerization',
        'Azure App Service deployment',
        'Performance optimization techniques'
      ]
    }
  ];

  const handleModuleSelection = (moduleId, topicIndex) => {
    const selectionKey = `${moduleId}-${topicIndex}`;
    setSelectedModules(prev => 
      prev.includes(selectionKey) 
        ? prev.filter(key => key !== selectionKey)
        : [...prev, selectionKey]
    );
  };

  const getCodeExample = (moduleId, topicIndex) => {
    const examples = {
      'fundamentals': [
        `// Variables and data types in C# 12
int age = 25;
string name = "John Doe";
bool isActive = true;
decimal price = 99.99m;
var autoType = "Automatically inferred";

// Nullable reference types (C# 8.0+)
string? nullableName = null;
int? nullableAge = null;

// Record types (C# 9.0+)
public record Person(string Name, int Age);`,
        `// Modern control structures with pattern matching
if (age >= 18)
{
    Console.WriteLine("Adult");
}

// Enhanced switch expressions (C# 8.0+)
string ageCategory = age switch
{
    < 13 => "Child",
    >= 13 and < 20 => "Teenager",
    >= 20 and < 65 => "Adult",
    >= 65 => "Senior",
    _ => "Unknown"
};

// Pattern matching with when clause
var result = obj switch
{
    string s when s.Length > 10 => "Long string",
    string s => "Short string",
    int i when i > 0 => "Positive number",
    _ => "Something else"
};`,
        `// Modern method features
public static int Add(int a, int b) => a + b;

// Local functions
public static void ProcessData()
{
    int LocalAdd(int x, int y) => x + y;
    var result = LocalAdd(5, 3);
}

// Async methods
public static async Task<string> GetDataAsync()
{
    await Task.Delay(1000);
    return "Data retrieved";
}

// Extension methods
public static class StringExtensions
{
    public static bool IsValidEmail(this string email)
    {
        return email.Contains("@") && email.Contains(".");
    }
}`,
        `// Modern class features with C# 12
public class Person
{
    // Primary constructor (C# 12)
    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }

    public string Name { get; init; } // Init-only properties
    public int Age { get; init; }

    // Expression-bodied members
    public string FullInfo => $"{Name} ({Age} years old)";

    // Nullable reference types
    public string? Email { get; set; }

    public void Introduce()
    {
        Console.WriteLine($"Hi, I'm {Name} and I'm {Age} years old.");
        if (Email is not null)
        {
            Console.WriteLine($"Email: {Email}");
        }
    }
}`,
      ],
      'web-api': [
        `// Minimal API (Program.cs) - .NET Core 8.0
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/api/users", () => new[] {
    new { Id = 1, Name = "John" },
    new { Id = 2, Name = "Jane" }
});

app.MapPost("/api/users", (User user) =>
{
    // Save user logic
    return Results.Created($"/api/users/{user.Id}", user);
});

app.Run();

public record User(int Id, string Name, string Email);`,
        `// Controller-based API
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<User>> GetUsers()
    {
        var users = new List<User>
        {
            new(1, "John Doe", "john@example.com"),
            new(2, "Jane Smith", "jane@example.com")
        };
        return Ok(users);
    }

    [HttpGet("{id}")]
    public ActionResult<User> GetUser(int id)
    {
        // Simulate user lookup
        if (id <= 0) return BadRequest("Invalid ID");

        var user = new User(id, "John Doe", "john@example.com");
        return Ok(user);
    }
}`,
        `// Model binding and validation
public class CreateUserRequest
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Range(18, 120)]
    public int Age { get; set; }
}

[HttpPost]
public async Task<ActionResult<User>> CreateUser(CreateUserRequest request)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    var user = new User(0, request.Name, request.Email);
    // Save to database

    return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
}`,
        `// HTTP status codes and responses
[HttpGet("{id}")]
public async Task<ActionResult<User>> GetUser(int id)
{
    try
    {
        var user = await _userService.GetByIdAsync(id);

        return user switch
        {
            null => NotFound($"User with ID {id} not found"),
            _ => Ok(user)
        };
    }
    catch (ArgumentException ex)
    {
        return BadRequest(ex.Message);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error retrieving user {UserId}", id);
        return StatusCode(500, "Internal server error");
    }
}`,
      ],
      'dependency-injection': [
        `// Program.cs - Registering services
var builder = WebApplication.CreateBuilder(args);

// Register services with different lifetimes
builder.Services.AddSingleton<ISingletonService, SingletonService>();
builder.Services.AddScoped<IScopedService, ScopedService>();
builder.Services.AddTransient<ITransientService, TransientService>();

// Register with factory
builder.Services.AddScoped<IEmailService>(provider =>
{
    var config = provider.GetRequiredService<IConfiguration>();
    var smtpServer = config["Email:SmtpServer"];
    return new EmailService(smtpServer);
});

var app = builder.Build();`,
        `// Service lifetimes demonstration
public interface ICounterService
{
    int GetNextValue();
}

public class CounterService : ICounterService
{
    private static int _counter = 0;

    public int GetNextValue()
    {
        return Interlocked.Increment(ref _counter);
    }
}

// Singleton: Same instance across the application
// Scoped: Same instance within a request
// Transient: New instance every time`,
        `// Interface-based programming
public interface IUserRepository
{
    Task<User> GetByIdAsync(int id);
    Task<User> CreateAsync(User user);
}

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }
}`,
        `// Constructor injection in controllers
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        IUserRepository userRepository,
        ILogger<UsersController> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        _logger.LogInformation("Getting user {UserId}", id);
        var user = await _userRepository.GetByIdAsync(id);
        return user == null ? NotFound() : Ok(user);
    }
}`
      ],
      'entity-framework': [
        `// DbContext configuration
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique();
        });
    }
}`,
        `// Code-first migrations
// Package Manager Console commands:
// Add-Migration InitialCreate
// Update-Database

// Or using CLI:
// dotnet ef migrations add InitialCreate
// dotnet ef database update

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<Order> Orders { get; set; } = new();
}`,
        `// LINQ queries and relationships
public class UserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<User>> GetActiveUsersWithOrdersAsync()
    {
        return await _context.Users
            .Include(u => u.Orders)
            .Where(u => u.Orders.Any(o => o.CreatedAt > DateTime.Now.AddDays(-30)))
            .OrderBy(u => u.Name)
            .ToListAsync();
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }
}`,
        `// Database seeding and configuration
public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (!context.Users.Any())
        {
            var users = new List<User>
            {
                new() { Name = "John Doe", Email = "john@example.com", CreatedAt = DateTime.Now },
                new() { Name = "Jane Smith", Email = "jane@example.com", CreatedAt = DateTime.Now }
            };

            context.Users.AddRange(users);
            await context.SaveChangesAsync();
        }
    }
}

// In Program.cs
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await DatabaseSeeder.SeedAsync(context);
}`
      ],
      'middleware': [
        `// Custom middleware creation
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
        _logger.LogInformation("Request: {Method} {Path}",
            context.Request.Method, context.Request.Path);

        await _next(context);

        _logger.LogInformation("Response: {StatusCode}",
            context.Response.StatusCode);
    }
}`,
        `// Built-in middleware pipeline in Program.cs
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// Custom middleware
app.UseMiddleware<RequestLoggingMiddleware>();

app.MapControllers();
app.Run();`,
        `// Middleware ordering and execution
public void Configure(IApplicationBuilder app)
{
    // Order matters! Each middleware calls the next one
    app.UseExceptionHandler("/Error");  // 1. Exception handling
    app.UseHttpsRedirection();          // 2. HTTPS redirection
    app.UseStaticFiles();               // 3. Static files
    app.UseRouting();                   // 4. Routing
    app.UseAuthentication();            // 5. Authentication
    app.UseAuthorization();             // 6. Authorization
    app.UseEndpoints(endpoints =>       // 7. Endpoints
    {
        endpoints.MapControllers();
    });
}`,
        `// Exception handling middleware
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
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var response = new { message = "An error occurred", details = exception.Message };
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}`
      ],
      'configuration': [
        `// appsettings.json structure
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MyApp;Trusted_Connection=true;"
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "Port": 587,
    "Username": "your-email@gmail.com"
  },
  "AllowedHosts": "*"
}`,
        `// Environment-specific configuration
// appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MyApp_Dev;Trusted_Connection=true;"
  }
}

// appsettings.Production.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=prod-server;Database=MyApp_Prod;User Id=sa;Password=***;"
  }
}`,
        `// Options pattern implementation
public class EmailSettings
{
    public const string SectionName = "EmailSettings";

    public string SmtpServer { get; set; } = string.Empty;
    public int Port { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

// In Program.cs
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection(EmailSettings.SectionName));

// In a service
public class EmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }
}`,
        `// Configuration providers and sources
var builder = WebApplication.CreateBuilder(args);

// Add configuration sources
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables()
    .AddCommandLine(args);

// Access configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var logLevel = builder.Configuration["Logging:LogLevel:Default"];

// Bind to strongly-typed objects
var emailSettings = new EmailSettings();
builder.Configuration.GetSection("EmailSettings").Bind(emailSettings);`
      ],
      'logging': [
        `// Built-in logging framework setup
var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddEventSourceLogger();

// Set minimum log level
builder.Logging.SetMinimumLevel(LogLevel.Information);

var app = builder.Build();

// Using logger in a controller
[ApiController]
public class HomeController : ControllerBase
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Get()
    {
        _logger.LogInformation("Home endpoint called at {Time}", DateTime.Now);
        return Ok("Hello World");
    }
}`,
        `// Log levels and categories
public class UserService
{
    private readonly ILogger<UserService> _logger;

    public UserService(ILogger<UserService> logger)
    {
        _logger = logger;
    }

    public async Task<User> CreateUserAsync(User user)
    {
        _logger.LogDebug("Creating user with email {Email}", user.Email);

        try
        {
            // Business logic
            _logger.LogInformation("User {UserId} created successfully", user.Id);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create user with email {Email}", user.Email);
            throw;
        }
    }
}

// Log Levels: Trace, Debug, Information, Warning, Error, Critical`,
        `// Structured logging with Serilog
// Install: Serilog.AspNetCore, Serilog.Sinks.Console, Serilog.Sinks.File

using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/app-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Usage with structured data
_logger.LogInformation("User {UserId} performed {Action} at {Timestamp}",
    userId, "Login", DateTime.UtcNow);`,
        `// Application Insights integration
// Install: Microsoft.ApplicationInsights.AspNetCore

var builder = WebApplication.CreateBuilder(args);

// Add Application Insights
builder.Services.AddApplicationInsightsTelemetry();

// Custom telemetry
public class OrderService
{
    private readonly TelemetryClient _telemetryClient;

    public OrderService(TelemetryClient telemetryClient)
    {
        _telemetryClient = telemetryClient;
    }

    public async Task ProcessOrderAsync(Order order)
    {
        using var activity = _telemetryClient.StartOperation<RequestTelemetry>("ProcessOrder");

        try
        {
            // Process order
            _telemetryClient.TrackEvent("OrderProcessed", new Dictionary<string, string>
            {
                ["OrderId"] = order.Id.ToString(),
                ["Amount"] = order.Total.ToString()
            });
        }
        catch (Exception ex)
        {
            _telemetryClient.TrackException(ex);
            throw;
        }
    }
}`
      ],
      'testing': [
        `// xUnit test project setup
// Install packages: Microsoft.NET.Test.Sdk, xunit, xunit.runner.visualstudio

public class CalculatorTests
{
    private readonly Calculator _calculator;

    public CalculatorTests()
    {
        _calculator = new Calculator();
    }

    [Fact]
    public void Add_TwoPositiveNumbers_ReturnsCorrectSum()
    {
        // Arrange
        var a = 5;
        var b = 3;

        // Act
        var result = _calculator.Add(a, b);

        // Assert
        Assert.Equal(8, result);
    }

    [Theory]
    [InlineData(1, 2, 3)]
    [InlineData(-1, 1, 0)]
    [InlineData(0, 0, 0)]
    public void Add_VariousInputs_ReturnsExpectedResults(int a, int b, int expected)
    {
        var result = _calculator.Add(a, b);
        Assert.Equal(expected, result);
    }
}`,
        `// Test project organization
// Tests/
//   Unit/
//     Services/
//       UserServiceTests.cs
//     Controllers/
//       UsersControllerTests.cs
//   Integration/
//     ApiTests.cs
//   TestHelpers/
//     TestDataBuilder.cs

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _mockRepository;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _mockRepository = new Mock<IUserRepository>();
        _userService = new UserService(_mockRepository.Object);
    }

    [Fact]
    public async Task GetUserAsync_ExistingUser_ReturnsUser()
    {
        // Arrange
        var userId = 1;
        var expectedUser = new User { Id = userId, Name = "John" };
        _mockRepository.Setup(r => r.GetByIdAsync(userId))
                      .ReturnsAsync(expectedUser);

        // Act
        var result = await _userService.GetUserAsync(userId);

        // Assert
        Assert.Equal(expectedUser, result);
    }
}`,
        `// Mocking with Moq framework
// Install: Moq

public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _mockOrderRepo;
    private readonly Mock<IEmailService> _mockEmailService;
    private readonly Mock<ILogger<OrderService>> _mockLogger;
    private readonly OrderService _orderService;

    public OrderServiceTests()
    {
        _mockOrderRepo = new Mock<IOrderRepository>();
        _mockEmailService = new Mock<IEmailService>();
        _mockLogger = new Mock<ILogger<OrderService>>();

        _orderService = new OrderService(
            _mockOrderRepo.Object,
            _mockEmailService.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task ProcessOrderAsync_ValidOrder_SendsConfirmationEmail()
    {
        // Arrange
        var order = new Order { Id = 1, CustomerEmail = "test@example.com" };

        // Act
        await _orderService.ProcessOrderAsync(order);

        // Assert
        _mockEmailService.Verify(
            e => e.SendAsync(order.CustomerEmail, It.IsAny<string>(), It.IsAny<string>()),
            Times.Once);
    }
}`,
        `// Test-driven development (TDD) example
// 1. Write failing test
[Fact]
public void ValidateEmail_InvalidEmail_ReturnsFalse()
{
    // Arrange
    var validator = new EmailValidator();
    var invalidEmail = "invalid-email";

    // Act
    var result = validator.IsValid(invalidEmail);

    // Assert
    Assert.False(result);
}

// 2. Write minimal code to pass
public class EmailValidator
{
    public bool IsValid(string email)
    {
        return email.Contains("@") && email.Contains(".");
    }
}

// 3. Refactor and improve
public bool IsValid(string email)
{
    if (string.IsNullOrWhiteSpace(email))
        return false;

    try
    {
        var addr = new MailAddress(email);
        return addr.Address == email;
    }
    catch
    {
        return false;
    }
}`
      ],
      'security': [
        `// Authentication and Authorization setup
var builder = WebApplication.CreateBuilder(args);

// Add authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Add authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("MinimumAge", policy =>
        policy.RequireClaim("age", "18", "19", "20")); // 18+
});`,
        `// JWT token implementation
public class TokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}`,
        `// HTTPS and SSL configuration
var builder = WebApplication.CreateBuilder(args);

// Configure HTTPS
builder.Services.AddHttpsRedirection(options =>
{
    options.RedirectStatusCode = StatusCodes.Status307TemporaryRedirect;
    options.HttpsPort = 5001;
});

// Configure HSTS (HTTP Strict Transport Security)
builder.Services.AddHsts(options =>
{
    options.Preload = true;
    options.IncludeSubDomains = true;
    options.MaxAge = TimeSpan.FromDays(365);
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();

// Certificate configuration in appsettings.json
{
  "Kestrel": {
    "Certificates": {
      "Default": {
        "Path": "certificate.pfx",
        "Password": "certificate_password"
      }
    }
  }
}`,
        `// Input validation and sanitization
public class CreateUserRequest
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
    [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Name can only contain letters and spaces")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]",
        ErrorMessage = "Password must contain uppercase, lowercase, number and special character")]
    public string Password { get; set; } = string.Empty;
}

// Custom validation attribute
public class NoScriptTagsAttribute : ValidationAttribute
{
    public override bool IsValid(object value)
    {
        if (value is string stringValue)
        {
            return !stringValue.Contains("<script", StringComparison.OrdinalIgnoreCase);
        }
        return true;
    }
}`
      ],
      'deployment': [
        `// Self-contained vs Framework-dependent deployment
// Framework-dependent (requires .NET runtime on target machine)
dotnet publish -c Release -o ./publish

// Self-contained (includes runtime, larger but standalone)
dotnet publish -c Release -r win-x64 --self-contained true -o ./publish-win
dotnet publish -c Release -r linux-x64 --self-contained true -o ./publish-linux

// Single file deployment
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true

// Project file configuration
<PropertyGroup>
  <TargetFramework>net8.0</TargetFramework>
  <RuntimeIdentifier>win-x64</RuntimeIdentifier>
  <SelfContained>true</SelfContained>
  <PublishSingleFile>true</PublishSingleFile>
  <PublishTrimmed>true</PublishTrimmed>
</PropertyGroup>`,
        `// Dockerfile for containerization
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MyApp.csproj", "."]
RUN dotnet restore "./MyApp.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "MyApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MyApp.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MyApp.dll"]

# Build and run commands
# docker build -t myapp .
# docker run -p 8080:80 myapp`,
        `// Azure App Service deployment
# Using Azure CLI
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myUniqueAppName --runtime "DOTNETCORE|8.0"

# Deploy using zip
az webapp deployment source config-zip --resource-group myResourceGroup --name myUniqueAppName --src myapp.zip

# GitHub Actions workflow (.github/workflows/deploy.yml)
name: Deploy to Azure App Service

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - name: Setup .NET
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: 8.0.x

    - name: Restore dependencies
      run: dotnet restore

    - name: Build
      run: dotnet build --no-restore

    - name: Publish
      run: dotnet publish -c Release -o ./publish

    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: myUniqueAppName
        publish-profile: \${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ./publish`,
        `// Performance optimization techniques
// Program.cs optimizations
var builder = WebApplication.CreateBuilder(args);

// Response compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});

// Response caching
builder.Services.AddResponseCaching();

// Memory cache
builder.Services.AddMemoryCache();

var app = builder.Build();

app.UseResponseCompression();
app.UseResponseCaching();

// Controller optimizations
[ApiController]
[ResponseCache(Duration = 300)] // Cache for 5 minutes
public class ProductsController : ControllerBase
{
    [HttpGet]
    [ResponseCache(Duration = 3600, VaryByQueryKeys = new[] { "category" })]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts(string category)
    {
        // Implementation
    }
}

// Database optimizations
public async Task<List<User>> GetUsersAsync()
{
    return await _context.Users
        .AsNoTracking() // Read-only queries
        .Select(u => new { u.Id, u.Name }) // Project only needed fields
        .ToListAsync();
}`
      ]
    };
    return examples[moduleId]?.[topicIndex] || '// Code example will be provided';
  };

  const getFollowUpPrompts = (moduleId, topicIndex) => {
    const prompts = {
      'fundamentals': [
        ['What are the key differences between .NET Core and .NET Framework in terms of deployment?', 'How does the unified .NET platform benefit enterprise applications?', 'What performance improvements does .NET Core 8.0 offer over previous versions?'],
        ['Which scenarios benefit most from cross-platform development?', 'How do you handle platform-specific code in cross-platform applications?', 'What are the considerations for choosing between native and cross-platform development?'],
        ['What is the difference between self-contained and framework-dependent deployments?', 'How do you manage multiple .NET versions on the same machine?', 'What are the best practices for production runtime configuration?'],
        ['How does the project file structure support modern development practices?', 'What are the benefits of the SDK-style project format?', 'How do you organize large solutions with multiple projects?']
      ],
      'project-setup': [
        ['How do you verify a successful .NET Core installation across different environments?', 'What are the system requirements for .NET Core 8.0 development?', 'How do you troubleshoot SDK installation issues?'],
        ['Which CLI commands are essential for daily development workflow?', 'How do you automate build processes using .NET CLI?', 'What are the advantages of CLI over IDE for certain tasks?'],
        ['When should you choose a console application over a web application?', 'How do you decide between MVC and Web API project templates?', 'What factors influence project type selection for enterprise applications?'],
        ['How do you handle package version conflicts in large projects?', 'What are the best practices for managing private NuGet feeds?', 'How do you ensure package security and vulnerability management?']
      ],
      'csharp-basics': [
        ['How do nullable reference types improve code safety in C# 8.0+?', 'What are the performance implications of boxing and unboxing?', 'When should you use var vs explicit type declarations?'],
        ['How do pattern matching and switch expressions improve code readability?', 'What are the best practices for exception handling in control structures?', 'How do you optimize loop performance in data-intensive applications?'],
        ['What are the differences between static and instance methods in terms of memory usage?', 'How do you implement method overloading effectively?', 'What are the guidelines for choosing between methods and properties?'],
        ['How do you implement proper encapsulation in modern C#?', 'What are the benefits of composition over inheritance?', 'How do you design classes for testability and maintainability?']
      ],
      'dotnet-core-dev-guide': [
          ['What are the differences between the .NET SDK and the .NET Runtime?', 'How do you manage multiple .NET SDK versions on one machine?', 'What are global tools in .NET Core?'],
          ['How can you create a new project from a custom template?', 'What is the purpose of the `dotnet sln` command?', 'How do you run tests for a specific project in a solution?'],
          ['How do you add a reference to a local project?', 'What is the difference between `dotnet add package` and `dotnet add reference`?', 'How do you manage transitive dependencies?'],
          ['What are some useful `dotnet publish` options?', 'How can you use the .NET CLI to manage user secrets?', 'How do you create a NuGet package from a project?']
      ]
    };
    return prompts[moduleId]?.[topicIndex] || ['What are the key concepts to remember?', 'How would you apply this in a real project?', 'What are the common pitfalls to avoid?'];
  };

  const getPracticeExercises = (moduleId, topicIndex) => {
    const exercises = {
      'fundamentals': [
        ['Create a simple console application that displays system information and runs on both Windows and Linux', 'Build a cross-platform file utility that works with different path separators', 'Implement a version checker that compares .NET Core versions across environments'],
        ['Develop a cross-platform configuration reader that adapts to different operating systems', 'Create a simple HTTP client that demonstrates cross-platform networking', 'Build a file system monitor that works across different platforms'],
        ['Set up a development environment with multiple .NET versions and demonstrate switching between them', 'Create deployment scripts for both self-contained and framework-dependent applications', 'Implement a runtime detection utility that reports current .NET version and configuration'],
        ['Design a multi-project solution with proper dependency management', 'Create a project template with custom MSBuild targets', 'Implement a solution structure that supports both development and production configurations']
      ],
      'project-setup': [
        ['Install .NET Core 8.0 on three different operating systems and document the process', 'Create a verification script that checks SDK installation and reports environment details', 'Set up a development environment with proper PATH configuration and IDE integration'],
        ['Create a build automation script using only .NET CLI commands', 'Develop a project scaffolding tool using CLI templates', 'Implement a deployment pipeline using CLI commands for different environments'],
        ['Build one application using three different project types and compare the outcomes', 'Create a solution that demonstrates when to use each project type', 'Develop a decision matrix for choosing appropriate project templates'],
        ['Set up a private NuGet feed and publish a custom package', 'Create a package management strategy for a multi-project solution', 'Implement automated package updates with version pinning for critical dependencies']
      ],
      'csharp-basics': [
        ['Create a type demonstration program showing value vs reference type behavior', 'Implement a nullable reference type example with proper null checking', 'Build a generic utility class that works with multiple data types'],
        ['Develop a menu-driven console application using various control structures', 'Create a data processing pipeline using modern C# pattern matching', 'Implement error handling with try-catch blocks and custom exceptions'],
        ['Build a calculator class with method overloading for different parameter types', 'Create a utility library with both static and instance methods', 'Implement a fluent API using method chaining'],
        ['Design a simple class hierarchy demonstrating inheritance and polymorphism', 'Create a data model with proper encapsulation and validation', 'Implement the repository pattern using interfaces and concrete classes']
      ],
      'dotnet-core-dev-guide': [
          ['Write a script to install the .NET SDK on a fresh Linux VM.', 'Verify the installation of the .NET SDK and run a simple "hello world" app.', 'Compare the contents of the SDK and Runtime folders.'],
          ['Create a solution with a console app and a class library, and reference the library from the app.', 'Use the CLI to add and remove a NuGet package.', 'Build and run the application using only CLI commands.'],
          ['Create two projects and add a project-to-project reference.', 'List all the packages in a project and their dependencies.', 'Create a solution file and add both projects to it.'],
          ['Install a global tool and use it.', 'Create a simple project template.', 'Publish a self-contained application for your OS.']
      ]
    };
    return exercises[moduleId]?.[topicIndex] || ['Practice implementing this concept in a small project', 'Create unit tests for this functionality', 'Research real-world applications of this concept'];
  };

  const generatePrompts = () => {
    const prompts = selectedModules.map(key => {
      const [moduleId, topicIndex] = key.split('-');
      const module = learningModules.find(m => m.id === moduleId);
      const topicIdx = parseInt(topicIndex);

      // Handle case where module is not found
      if (!module) {
        return {
          moduleTitle: 'Unknown Module',
          moduleLevel: 'Unknown',
          topic: 'Unknown Topic',
          prompts: ['Please verify the module configuration and try again.']
        };
      }

      // Handle case where topic index is out of bounds
      if (!module.topics || topicIdx >= module.topics.length || topicIdx < 0) {
        return {
          moduleTitle: module.title,
          moduleLevel: module.level,
          topic: 'Unknown Topic',
          prompts: ['Please check the topic selection and try again.']
        };
      }

      // Generate learning prompts for the selected topic
      const topicName = module.topics[topicIdx];
      const followUpPrompts = getFollowUpPrompts(moduleId, topicIdx);
      const practiceExercises = getPracticeExercises(moduleId, topicIdx);

      // Create comprehensive learning prompts
      const learningPrompts = [
        `Explain the key concepts of "${topicName}" in .NET Core 8.0`,
        `What are the best practices for implementing "${topicName}"?`,
        `How does "${topicName}" improve application performance and maintainability?`,
        `Provide a step-by-step implementation guide for "${topicName}"`,
        ...followUpPrompts.slice(0, 2), // Include first 2 follow-up prompts
        `Create a practical example demonstrating "${topicName}" in a real-world scenario`,
        `What are common pitfalls to avoid when working with "${topicName}"?`,
        `How does "${topicName}" integrate with other .NET Core 8.0 features?`
      ];

      return {
        moduleTitle: module.title,
        moduleLevel: module.level,
        topic: topicName,
        prompts: learningPrompts,
        practiceExercises: practiceExercises.slice(0, 3) // Include first 3 practice exercises
      };
    });

    setGeneratedPrompts(prompts);
    setPromptsGenerated(true);
  };



  return (
    <div className="dotnet-learning-container">
      <header className="header-section">
        <h1>.NET Core 8.0 Learning Modules</h1>
        <p>Your comprehensive guide to mastering .NET Core</p>
      </header>

      <div className="controls-section">
        <input
          type="text"
          placeholder="Search modules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button
          onClick={generatePrompts}
          className="generate-btn"
          disabled={selectedModules.length === 0}
        >
          Generate Prompts ({selectedModules.length})
        </button>
      </div>

      <main className="modules-grid">
        {learningModules
          .filter(module => {
            const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                module.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = filterLevel === 'all' || module.level === filterLevel;
            return matchesSearch && matchesLevel;
          })
          .map(module => (
            <section key={module.id} className={`module-card ${module.level}`}>
              <header className="module-header">
                <span className="module-icon">{module.icon}</span>
                <div className="module-info">
                  <h3>{module.title}</h3>
                  <span className={`level-badge ${module.level}`}>{module.level}</span>
                </div>
              </header>
              <p className="module-description">{module.description}</p>
              <div className="topics-list">
                <h4>Learning Topics:</h4>
                {module.topics.map((topic, index) => (
                  <label key={index} className="topic-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(`${module.id}-${index}`)}
                      onChange={() => handleModuleSelection(module.id, index)}
                    />
                    {topic}
                  </label>
                ))}
              </div>
            </section>
          ))}
      </main>

      {promptsGenerated && generatedPrompts.length > 0 && (
        <aside className="prompts-section">
          <header className="prompts-header">
            <h2>Generated Learning Prompts</h2>
          </header>
          <div className="prompts-content">
            {generatedPrompts.map((item, index) => (
              <article key={index} className="prompt-item">
                <header className="prompt-header">
                  <h3>{item.moduleTitle} - <span className={`level-indicator ${item.moduleLevel}`}>{item.moduleLevel}</span></h3>
                  <h4>{item.topic}</h4>
                </header>
                <div className="learning-prompts-section">
                  <h5>Learning Prompts</h5>
                  <ul>
                    {item.prompts.map((prompt, idx) => (
                      <li key={idx}>{prompt}</li>
                    ))}
                  </ul>
                </div>
                {item.practiceExercises && item.practiceExercises.length > 0 && (
                  <div className="practice-exercises-section">
                    <h5>Practice Exercises</h5>
                    <ul>
                      {item.practiceExercises.map((exercise, idx) => (
                        <li key={idx}>{exercise}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
};

export default DotNetCoreHomePage;