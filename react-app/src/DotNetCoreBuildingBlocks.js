import React, { useState } from 'react';
import './DotNetCoreLearning.css';

const DotNetCoreBuildingBlocks = () => {
  const [selectedCategory, setSelectedCategory] = useState('overview');
  const [expandedBlocks, setExpandedBlocks] = useState({});

  const toggleBlock = (blockId) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };

  const buildingBlocks = {
    overview: {
      title: "🏗️ Modern .NET Core Architecture Overview",
      description: "Essential building blocks that form the foundation of modern .NET Core applications",
      blocks: [
        {
          id: 'runtime',
          icon: '⚡',
          title: '.NET Runtime & SDK',
          description: 'Core execution environment and development tools',
          details: [
            'Cross-platform runtime (Windows, Linux, macOS)',
            'Just-In-Time (JIT) compilation',
            'Garbage collection and memory management',
            'Base Class Library (BCL)',
            'CLI tools (dotnet command)'
          ],
          codeExample: `// Check .NET version
dotnet --version

// Create new project
dotnet new webapi -n MyApi

// Run application
dotnet run`
        },
        {
          id: 'hosting',
          icon: '🌐',
          title: 'Hosting & Web Server',
          description: 'Built-in web server and hosting infrastructure',
          details: [
            'Kestrel web server (cross-platform)',
            'IIS integration (Windows)',
            'Reverse proxy support (Nginx, Apache)',
            'HTTPS and SSL/TLS support',
            'Host lifecycle management'
          ],
          codeExample: `// Program.cs - Minimal hosting
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");
app.Run();`
        },
        {
          id: 'dependency-injection',
          icon: '🔗',
          title: 'Dependency Injection Container',
          description: 'Built-in IoC container for managing dependencies',
          details: [
            'Service registration (Singleton, Scoped, Transient)',
            'Constructor injection',
            'Interface-based programming',
            'Service lifetime management',
            'Third-party container integration'
          ],
          codeExample: `// Service registration
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<IConfiguration>();

// Constructor injection
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }
}`
        }
      ]
    },
    core: {
      title: "🔧 Core Framework Components",
      description: "Essential components that every .NET Core application relies on",
      blocks: [
        {
          id: 'configuration',
          icon: '⚙️',
          title: 'Configuration System',
          description: 'Flexible configuration management from multiple sources',
          details: [
            'appsettings.json files',
            'Environment variables',
            'Command line arguments',
            'Azure Key Vault integration',
            'Options pattern implementation'
          ],
          codeExample: `// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=MyApp;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}

// Options pattern
public class DatabaseOptions
{
    public string ConnectionString { get; set; }
}

// Registration
builder.Services.Configure<DatabaseOptions>(
    builder.Configuration.GetSection("ConnectionStrings"));`
        },
        {
          id: 'logging',
          icon: '📝',
          title: 'Logging Framework',
          description: 'Built-in logging with multiple providers and structured logging',
          details: [
            'Multiple log levels (Trace, Debug, Info, Warning, Error, Critical)',
            'Structured logging support',
            'Multiple providers (Console, File, EventLog)',
            'Third-party integration (Serilog, NLog)',
            'Log filtering and scopes'
          ],
          codeExample: `// Built-in logging
public class UserService
{
    private readonly ILogger<UserService> _logger;

    public UserService(ILogger<UserService> logger)
    {
        _logger = logger;
    }

    public async Task<User> GetUserAsync(int id)
    {
        _logger.LogInformation("Getting user {UserId}", id);

        try
        {
            var user = await _repository.GetAsync(id);
            _logger.LogInformation("User {UserId} found", id);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user {UserId}", id);
            throw;
        }
    }
}`
        },
        {
          id: 'middleware',
          icon: '🔄',
          title: 'Middleware Pipeline',
          description: 'Request/response processing pipeline with custom middleware support',
          details: [
            'Request pipeline processing',
            'Built-in middleware (Authentication, CORS, Static Files)',
            'Custom middleware creation',
            'Middleware ordering and execution',
            'Exception handling middleware'
          ],
          codeExample: `// Custom middleware
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next,
        ILogger<RequestLoggingMiddleware> logger)
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

// Registration
app.UseMiddleware<RequestLoggingMiddleware>();`
        }
      ]
    },
    data: {
      title: "💾 Data Access & Persistence",
      description: "Modern approaches to data access and persistence in .NET Core",
      blocks: [
        {
          id: 'entity-framework',
          icon: '🗄️',
          title: 'Entity Framework Core',
          description: 'Modern ORM for .NET with code-first and database-first approaches',
          details: [
            'Code-first migrations',
            'LINQ query support',
            'Multiple database providers',
            'Change tracking and lazy loading',
            'Performance optimization features'
          ],
          codeExample: `// DbContext
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired();
            entity.HasMany(e => e.Orders)
                  .WithOne(e => e.User)
                  .HasForeignKey(e => e.UserId);
        });
    }
}

// Usage
var users = await _context.Users
    .Include(u => u.Orders)
    .Where(u => u.IsActive)
    .ToListAsync();`
        },
        {
          id: 'repositories',
          icon: '📚',
          title: 'Repository Pattern',
          description: 'Abstraction layer for data access with testability and maintainability',
          details: [
            'Interface-based data access',
            'Unit of Work pattern',
            'Generic repository implementation',
            'Specification pattern integration',
            'Async/await support'
          ],
          codeExample: `// Repository interface
public interface IUserRepository
{
    Task<User> GetByIdAsync(int id);
    Task<IEnumerable<User>> GetAllAsync();
    Task<User> AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(int id);
}

// Implementation
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

    public async Task<User> AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }
}`
        }
      ]
    },
    api: {
      title: "🌐 API Development",
      description: "Building modern REST APIs and web services with .NET Core",
      blocks: [
        {
          id: 'controllers',
          icon: '🎮',
          title: 'Controllers & Actions',
          description: 'MVC controllers for handling HTTP requests and responses',
          details: [
            'Attribute routing',
            'Model binding and validation',
            'Action filters and middleware',
            'Content negotiation',
            'HTTP status code handling'
          ],
          codeExample: `[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        return user == null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userService.CreateUserAsync(dto);
        return CreatedAtAction(nameof(GetUser),
            new { id = user.Id }, user);
    }
}`
        },
        {
          id: 'minimal-apis',
          icon: '⚡',
          title: 'Minimal APIs',
          description: 'Lightweight API development with minimal ceremony',
          details: [
            'Functional endpoint definition',
            'Built-in model binding',
            'Automatic OpenAPI generation',
            'Dependency injection support',
            'Performance optimized'
          ],
          codeExample: `// Minimal API endpoints
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

app.MapGet("/api/users", async (IUserService userService) =>
{
    var users = await userService.GetAllUsersAsync();
    return Results.Ok(users);
});

app.MapGet("/api/users/{id}", async (int id, IUserService userService) =>
{
    var user = await userService.GetUserByIdAsync(id);
    return user is not null ? Results.Ok(user) : Results.NotFound();
});

app.MapPost("/api/users", async (CreateUserDto dto, IUserService userService) =>
{
    var user = await userService.CreateUserAsync(dto);
    return Results.Created($"/api/users/{user.Id}", user);
});

app.Run();`
        }
      ]
    }
  };

  const categories = Object.keys(buildingBlocks);

  return (
    <div className="dotnet-learning-container">
      <div className="header-section">
        <h1>🏗️ .NET Core Building Blocks</h1>
        <p>Essential components and patterns for modern .NET Core software development</p>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`tab-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {buildingBlocks[category].title}
          </button>
        ))}
      </div>

      <div className="category-content">
        <div className="category-header">
          <h2>{buildingBlocks[selectedCategory].title}</h2>
          <p>{buildingBlocks[selectedCategory].description}</p>
        </div>

        <div className="building-blocks-grid">
          {buildingBlocks[selectedCategory].blocks.map(block => (
            <div key={block.id} className="building-block-card">
              <div className="block-header" onClick={() => toggleBlock(block.id)}>
                <div className="block-title">
                  <span className="block-icon">{block.icon}</span>
                  <h3>{block.title}</h3>
                </div>
                <span className={`expand-icon ${expandedBlocks[block.id] ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>

              <p className="block-description">{block.description}</p>

              {expandedBlocks[block.id] && (
                <div className="block-details">
                  <div className="features-list">
                    <h4>🔑 Key Features:</h4>
                    <ul>
                      {block.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="code-example">
                    <h4>💻 Code Example:</h4>
                    <pre><code>{block.codeExample}</code></pre>
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

export default DotNetCoreBuildingBlocks;