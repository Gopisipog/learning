# 💡 Learning Prompts Hints & Solutions Guide

## 🎯 Comprehensive Hints for All .NET Core Learning Workbooks

---

## 📚 **Dependency Injection Learning Prompts - Hints**

### 💉 Built-in DI Container

**Hint 1.1 - Project Setup**: 
- Use `dotnet new webapi -n DIDemo`
- Look for `var builder = WebApplication.CreateBuilder(args);` in Program.cs
- `builder.Services` is your IServiceCollection

**Hint 1.2 - Register Simple Service**:
```csharp
public class MyService 
{
    public string GetMessage() => "Hello from MyService!";
}
// In Program.cs: builder.Services.AddTransient<MyService>();
```

**Hint 1.3 - Consume Service**:
```csharp
[ApiController]
public class WeatherForecastController : ControllerBase
{
    private readonly MyService _myService;
    public WeatherForecastController(MyService myService) => _myService = myService;
}
```

**Hint 1.4 - Manual Resolution**:
- Use `app.Services.GetService<MyService>()`
- Discouraged because: Creates tight coupling, harder to test, violates DI principles
- Useful for: Application startup, middleware configuration

### 🔄 Service Lifetimes

**Hint 2.1 - Lifetime Demo Service**:
```csharp
public interface IOperation { string OperationId { get; } }
public class Operation : IOperation 
{
    public string OperationId { get; } = Guid.NewGuid().ToString();
}
```

**Hint 2.2 - Multiple Interfaces**:
```csharp
public interface IOperationTransient : IOperation { }
public interface IOperationScoped : IOperation { }
public interface IOperationSingleton : IOperation { }
```

**Hint 2.5 - Expected Behavior**:
- **Transient**: New instance every time (different IDs everywhere)
- **Scoped**: Same instance within request (same ID within request, different between requests)
- **Singleton**: Same instance always (same ID everywhere)

### 🔌 Interface-based Programming

**Hint 3.1 - Dependency Inversion**:
- High-level modules shouldn't depend on low-level modules
- Both should depend on abstractions
- DI helps by injecting interfaces instead of concrete classes

**Hint 3.4 - Conditional Registration**:
```csharp
// In appsettings.json: "MessageType": "Email"
var messageType = builder.Configuration["MessageType"];
if (messageType == "Email")
    builder.Services.AddScoped<IMessageSender, EmailSender>();
else
    builder.Services.AddScoped<IMessageSender, SmsSender>();
```

### 🏗️ Constructor and Method Injection

**Hint 4.1 - Constructor Injection Benefits**:
- Makes dependencies explicit and required
- Enables immutable dependencies
- Fails fast if dependencies missing
- Easier to unit test

**Hint 4.2 - Action Method Injection Use Cases**:
- Services only needed for specific actions
- Optional services that might not always be available
- Reducing constructor parameter count

**Hint 4.3 - Property Injection Downsides**:
- Hidden dependencies (not obvious what class needs)
- Can lead to runtime errors if not set
- Makes testing harder
- Violates explicit dependency principle

---

## 🌐 **Building Web APIs Learning Prompts - Hints**

### 🎮 Controller-based API Development

**Hint 1.1 - ApiController Attribute Purpose**:
- Enables automatic model validation
- Infers binding sources for parameters
- Returns 400 for invalid models automatically
- Enables API-specific behaviors

**Hint 1.3 - In-Memory Data Store**:
```csharp
public class Product 
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}

private static List<Product> _products = new()
{
    new() { Id = 1, Name = "Laptop", Price = 999.99m },
    new() { Id = 2, Name = "Mouse", Price = 29.99m }
};
```

### 🛣️ Routing and Action Methods

**Hint 2.1 - [controller] Token**:
- Automatically replaces with controller name minus "Controller"
- ProductsController becomes "Products" in route

**Hint 2.2 - Route Parameters**:
```csharp
[HttpGet("{id:int}")]
public ActionResult<Product> GetProduct(int id)
{
    var product = _products.FirstOrDefault(p => p.Id == id);
    return product == null ? NotFound() : Ok(product);
}
```

**Hint 2.3 - HTTP Verbs Implementation**:
```csharp
[HttpPost]
public ActionResult<Product> CreateProduct(Product product)
{
    product.Id = _products.Max(p => p.Id) + 1;
    _products.Add(product);
    return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
}
```

### 📝 Model Binding and Validation

**Hint 3.1 - DTO Pattern**:
```csharp
public class CreateProductDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    
    [Range(0.01, 1000)]
    public decimal Price { get; set; }
}
```

**Hint 3.4 - ModelState Validation**:
```csharp
[HttpPost]
public ActionResult<Product> CreateProduct(CreateProductDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);
    
    // Create product logic...
}
```

---

## 💻 **C# Language Fundamentals Learning Prompts - Hints**

### 📊 Variables, Data Types, and Operators

**Hint 1.1 - Hello World**:
```csharp
using System;
class Program 
{
    static void Main() => Console.WriteLine("Hello, World!");
}
```

**Hint 1.4 - Arithmetic Calculator**:
```csharp
Console.Write("Enter first number: ");
double num1 = Convert.ToDouble(Console.ReadLine());
Console.Write("Enter second number: ");
double num2 = Convert.ToDouble(Console.ReadLine());

Console.WriteLine($"Sum: {num1 + num2}");
Console.WriteLine($"Difference: {num1 - num2}");
Console.WriteLine($"Product: {num1 * num2}");
Console.WriteLine($"Quotient: {num1 / num2}");
```

**Hint 1.6 - Type Casting**:
```csharp
double myDouble = 9.78;
int myInt = (int)myDouble; // Result: 9 (decimal part truncated)
```

### 🔄 Control Structures and Loops

**Hint 2.6 - FizzBuzz Solution**:
```csharp
for (int i = 1; i <= 100; i++)
{
    if (i % 15 == 0) Console.WriteLine("FizzBuzz");
    else if (i % 3 == 0) Console.WriteLine("Fizz");
    else if (i % 5 == 0) Console.WriteLine("Buzz");
    else Console.WriteLine(i);
}
```

**Hint 2.5 - Number Guessing Game**:
```csharp
Random random = new();
int targetNumber = random.Next(1, 101);
int guess;

do
{
    Console.Write("Guess a number (1-100): ");
    guess = int.Parse(Console.ReadLine());
    
    if (guess < targetNumber) Console.WriteLine("Too low!");
    else if (guess > targetNumber) Console.WriteLine("Too high!");
    else Console.WriteLine("Correct!");
} while (guess != targetNumber);
```

### 🔧 Methods and Parameter Handling

**Hint 3.4 - Optional Parameters**:
```csharp
public static double CalculateRectangleArea(double width, double height = 10)
{
    return width * height;
}

// Usage: CalculateRectangleArea(5); // Uses default height of 10
```

**Hint 3.6 - ref and out Parameters**:
```csharp
// ref parameter
public static void Increment(ref int number)
{
    number++;
}

// out parameters
public static void CalculateCircle(double radius, out double area, out double perimeter)
{
    area = Math.PI * radius * radius;
    perimeter = 2 * Math.PI * radius;
}
```

---

## 🔧 **Quick Reference Tips**

### 🎯 Common Patterns
- **Service Registration**: Always register interfaces, not concrete classes
- **Validation**: Use Data Annotations for simple validation
- **Error Handling**: Return appropriate HTTP status codes
- **Naming**: Use PascalCase for public members, camelCase for parameters

### 🚨 Common Pitfalls
- **Circular Dependencies**: A depends on B, B depends on A
- **Captive Dependencies**: Singleton depending on Scoped/Transient
- **Missing Registrations**: Forgetting to register services in DI container
- **Wrong Lifetimes**: Using wrong service lifetime for your use case

### 💡 Best Practices
- **Constructor Injection**: Preferred over other injection types
- **Interface Segregation**: Keep interfaces small and focused
- **Explicit Dependencies**: Make all dependencies obvious
- **Fail Fast**: Validate early and return meaningful errors

---

## ⚙️ **Configuration Management Learning Prompts - Hints**

### 📄 appsettings.json Configuration

**Hint 1.2 - Simple Setting**:
```json
{
  "AppName": "My Awesome App",
  "Logging": { ... }
}
```

**Hint 1.3 - Reading Simple Setting**:
```csharp
[ApiController]
public class WeatherForecastController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public WeatherForecastController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("appname")]
    public string GetAppName() => _configuration["AppName"];
}
```

**Hint 1.5 - Reading Nested Settings**:
```csharp
// Method 1: Direct path
string version = _configuration["AppSettings:Version"];

// Method 2: Get section first
var appSettings = _configuration.GetSection("AppSettings");
string author = appSettings["Author"];
```

### 🌍 Environment-Specific Settings

**Hint 2.2 - Override Pattern**:
- `appsettings.json` = Base settings
- `appsettings.Development.json` = Development overrides
- `appsettings.Production.json` = Production overrides
- Later files override earlier ones

**Hint 2.3 - Environment Detection**:
```csharp
// Inject IWebHostEnvironment to check current environment
public WeatherForecastController(IWebHostEnvironment env)
{
    if (env.IsDevelopment()) { /* Dev logic */ }
    if (env.IsProduction()) { /* Prod logic */ }
}
```

### 🔧 Strongly-Typed Configuration

**Hint 3.1 - Options Pattern**:
```csharp
// 1. Create a class
public class AppSettings
{
    public string Version { get; set; }
    public string Author { get; set; }
}

// 2. Register in Program.cs
builder.Services.Configure<AppSettings>(
    builder.Configuration.GetSection("AppSettings"));

// 3. Inject IOptions<T>
public WeatherForecastController(IOptions<AppSettings> options)
{
    var settings = options.Value;
}
```

**Hint 3.2 - IOptionsSnapshot vs IOptions**:
- **IOptions**: Singleton, doesn't reload
- **IOptionsSnapshot**: Scoped, reloads per request
- **IOptionsMonitor**: Singleton, reloads when config changes

### 🔐 User Secrets and Environment Variables

**Hint 4.1 - User Secrets Setup**:
```bash
# Initialize user secrets
dotnet user-secrets init

# Add a secret
dotnet user-secrets set "ApiKeys:OpenAI" "your-secret-key"
```

**Hint 4.2 - Environment Variables**:
```csharp
// Reading environment variables
string connectionString = _configuration["ConnectionStrings:DefaultConnection"];

// Can be set via:
// - Environment variable: ConnectionStrings__DefaultConnection
// - appsettings.json: "ConnectionStrings": { "DefaultConnection": "..." }
```

---

## 🧪 **Unit Testing Learning Prompts - Hints**

### 🏗️ Test Project Setup

**Hint 1.1 - Create Test Project**:
```bash
# Create test project
dotnet new xunit -n MyApp.Tests

# Add reference to main project
dotnet add MyApp.Tests reference MyApp

# Add testing packages
dotnet add package Microsoft.AspNetCore.Mvc.Testing
dotnet add package Moq
```

**Hint 1.2 - Basic Test Structure**:
```csharp
public class CalculatorTests
{
    [Fact]
    public void Add_TwoNumbers_ReturnsSum()
    {
        // Arrange
        var calculator = new Calculator();

        // Act
        var result = calculator.Add(2, 3);

        // Assert
        Assert.Equal(5, result);
    }
}
```

### 🎭 Mocking Dependencies

**Hint 2.1 - Moq Setup**:
```csharp
[Fact]
public void GetProduct_ExistingId_ReturnsProduct()
{
    // Arrange
    var mockRepository = new Mock<IProductRepository>();
    var expectedProduct = new Product { Id = 1, Name = "Test" };
    mockRepository.Setup(r => r.GetById(1)).Returns(expectedProduct);

    var service = new ProductService(mockRepository.Object);

    // Act
    var result = service.GetProduct(1);

    // Assert
    Assert.Equal(expectedProduct, result);
    mockRepository.Verify(r => r.GetById(1), Times.Once);
}
```

### 🌐 Integration Testing

**Hint 3.1 - WebApplicationFactory**:
```csharp
public class ProductsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ProductsControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetProducts_ReturnsSuccessStatusCode()
    {
        // Act
        var response = await _client.GetAsync("/api/products");

        // Assert
        response.EnsureSuccessStatusCode();
    }
}
```

---

## 🔒 **Security Fundamentals Learning Prompts - Hints**

### 🔐 Authentication Basics

**Hint 1.1 - JWT Authentication Setup**:
```csharp
// In Program.cs
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

// Enable authentication middleware
app.UseAuthentication();
app.UseAuthorization();
```

**Hint 1.2 - Protecting Endpoints**:
```csharp
[Authorize] // Requires authentication
[HttpGet]
public IActionResult GetSecureData()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    return Ok($"Hello, user {userId}!");
}

[Authorize(Roles = "Admin")] // Requires specific role
[HttpDelete("{id}")]
public IActionResult DeleteProduct(int id) { ... }
```

### 🛡️ Authorization Patterns

**Hint 2.1 - Policy-Based Authorization**:
```csharp
// In Program.cs
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("MinimumAge", policy =>
        policy.Requirements.Add(new MinimumAgeRequirement(18)));
});

// Custom requirement
public class MinimumAgeRequirement : IAuthorizationRequirement
{
    public int MinimumAge { get; }
    public MinimumAgeRequirement(int minimumAge) => MinimumAge = minimumAge;
}
```

---

## 📊 **Entity Framework Core Learning Prompts - Hints**

### 🗄️ Database Setup

**Hint 1.1 - DbContext Setup**:
```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
        });
    }
}
```

**Hint 1.2 - Connection String Registration**:
```csharp
// In Program.cs
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### 🔄 CRUD Operations

**Hint 2.1 - Repository Pattern**:
```csharp
public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context) => _context = context;

    public async Task<Product> GetByIdAsync(int id) =>
        await _context.Products.FindAsync(id);

    public async Task<IEnumerable<Product>> GetAllAsync() =>
        await _context.Products.ToListAsync();

    public async Task AddAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
    }
}

---

## 🚀 **Deployment and Hosting Learning Prompts - Hints**

### 🐳 Docker Containerization

**Hint 1.1 - Dockerfile Creation**:
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

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
```

**Hint 1.2 - Docker Commands**:
```bash
# Build image
docker build -t myapp .

# Run container
docker run -p 8080:80 myapp

# Run with environment variables
docker run -p 8080:80 -e ASPNETCORE_ENVIRONMENT=Production myapp
```

### ☁️ Cloud Deployment

**Hint 2.1 - Azure App Service**:
```bash
# Install Azure CLI
az login

# Create resource group
az group create --name myapp-rg --location eastus

# Create app service plan
az appservice plan create --name myapp-plan --resource-group myapp-rg --sku B1

# Create web app
az webapp create --name myapp --resource-group myapp-rg --plan myapp-plan --runtime "DOTNET|8.0"

# Deploy from local Git
az webapp deployment source config-local-git --name myapp --resource-group myapp-rg
```

### 🔧 Configuration for Production

**Hint 3.1 - Production Settings**:
```json
// appsettings.Production.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=prod-server;Database=MyApp;..."
  }
}
```

---

## 📝 **Logging and Monitoring Learning Prompts - Hints**

### 📊 Built-in Logging

**Hint 1.1 - ILogger Injection**:
```csharp
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(ILogger<ProductsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetProducts()
    {
        _logger.LogInformation("Getting all products");

        try
        {
            // Business logic
            _logger.LogDebug("Retrieved {Count} products", products.Count);
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products");
            return StatusCode(500, "Internal server error");
        }
    }
}
```

**Hint 1.2 - Log Levels**:
- **Trace**: Very detailed, typically only in development
- **Debug**: Detailed information for debugging
- **Information**: General information about application flow
- **Warning**: Something unexpected but not an error
- **Error**: Error occurred but application continues
- **Critical**: Critical error, application may terminate

### 📈 Structured Logging

**Hint 2.1 - Serilog Setup**:
```csharp
// Install: Serilog.AspNetCore, Serilog.Sinks.File
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// In appsettings.json
{
  "Serilog": {
    "MinimumLevel": "Information",
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "File",
        "Args": { "path": "logs/app-.txt", "rollingInterval": "Day" }
      }
    ]
  }
}
```

---

## 🔄 **Middleware Pipeline Learning Prompts - Hints**

### 🔗 Custom Middleware

**Hint 1.1 - Middleware Class**:
```csharp
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
}

// Extension method
public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RequestLoggingMiddleware>();
    }
}
```

**Hint 1.2 - Middleware Registration**:
```csharp
// In Program.cs - ORDER MATTERS!
app.UseHttpsRedirection();
app.UseRequestLogging(); // Custom middleware
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

### ⚡ Pipeline Order

**Hint 2.1 - Typical Pipeline Order**:
1. Exception handling
2. HTTPS redirection
3. Static files
4. Routing
5. Authentication
6. Authorization
7. Custom middleware
8. Endpoints

---

## 🛠️ **Project Setup and CLI Learning Prompts - Hints**

### 📦 Project Templates

**Hint 1.1 - Common Templates**:
```bash
# Web API
dotnet new webapi -n MyApi

# MVC Web App
dotnet new mvc -n MyWebApp

# Console App
dotnet new console -n MyConsole

# Class Library
dotnet new classlib -n MyLibrary

# Solution
dotnet new sln -n MySolution

# Add projects to solution
dotnet sln add MyApi MyWebApp
```

**Hint 1.2 - Project References**:
```bash
# Add project reference
dotnet add MyApi reference MyLibrary

# Add NuGet package
dotnet add package Microsoft.EntityFrameworkCore

# Remove package
dotnet remove package OldPackage
```

### 🔧 Build and Run

**Hint 2.1 - Build Commands**:
```bash
# Restore packages
dotnet restore

# Build project
dotnet build

# Build for release
dotnet build -c Release

# Run project
dotnet run

# Run with specific environment
dotnet run --environment Production

# Watch for changes (hot reload)
dotnet watch run
```

---

## 🎯 **Advanced Tips and Troubleshooting**

### 🔍 Debugging Techniques

**Common Issues and Solutions**:

1. **DI Registration Missing**:
   ```
   Error: Unable to resolve service for type 'IMyService'
   Solution: Add builder.Services.AddScoped<IMyService, MyService>();
   ```

2. **Circular Dependencies**:
   ```
   Error: A circular dependency was detected
   Solution: Refactor to remove circular references or use factory pattern
   ```

3. **Wrong Service Lifetime**:
   ```
   Issue: Singleton service depending on Scoped service
   Solution: Change singleton to scoped or refactor dependencies
   ```

### 🚀 Performance Tips

**Optimization Strategies**:
- Use `async/await` for I/O operations
- Implement proper caching strategies
- Use `IMemoryCache` for frequently accessed data
- Optimize database queries with proper indexing
- Use `IAsyncEnumerable` for streaming large datasets

### 📚 Learning Resources

**Next Steps**:
- Practice with real-world projects
- Explore advanced patterns (CQRS, Event Sourcing)
- Learn about microservices architecture
- Study cloud-native development patterns
- Contribute to open-source projects
```
