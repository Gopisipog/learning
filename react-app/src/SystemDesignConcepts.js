import React, { useState } from 'react';
import './DotNetCoreLearning.css';

const SystemDesignConcepts = () => {
  const [activeCategory, setActiveCategory] = useState('scalability');
  const [expandedConcepts, setExpandedConcepts] = useState({});

  const toggleConcept = (conceptId) => {
    setExpandedConcepts(prev => ({
      ...prev,
      [conceptId]: !prev[conceptId]
    }));
  };

  const concepts = {
    scalability: {
      title: "📈 Scalability & Performance",
      description: "Fundamental concepts for building systems that can handle growth",
      videoReference: "https://www.youtube.com/watch?v=s9Qh9fWeOAk",
      concepts: [
        {
          id: 'horizontal-vertical-scaling',
          icon: '🔄',
          title: 'Horizontal vs Vertical Scaling',
          description: 'Understanding different approaches to scaling systems under load',
          details: [
            'Vertical Scaling (Scale Up): Adding more power to existing machines',
            'Horizontal Scaling (Scale Out): Adding more machines to the pool',
            'Trade-offs: Cost, complexity, and failure resilience',
            'When to choose each approach based on system requirements',
            'Auto-scaling strategies and implementation patterns'
          ],
          codeExample: `// Horizontal Scaling Example - Load Balancer Configuration
public class LoadBalancerConfig
{
    public List<ServerInstance> Servers { get; set; } = new();
    public LoadBalancingStrategy Strategy { get; set; }
    
    public ServerInstance GetNextServer()
    {
        return Strategy switch
        {
            LoadBalancingStrategy.RoundRobin => GetRoundRobinServer(),
            LoadBalancingStrategy.LeastConnections => GetLeastConnectionsServer(),
            LoadBalancingStrategy.WeightedRoundRobin => GetWeightedServer(),
            _ => throw new NotSupportedException()
        };
    }
}

// Auto-scaling based on metrics
public class AutoScaler
{
    public async Task<bool> ShouldScaleOut(SystemMetrics metrics)
    {
        return metrics.CpuUtilization > 80 || 
               metrics.MemoryUtilization > 85 ||
               metrics.RequestsPerSecond > 1000;
    }
    
    public async Task ScaleOut()
    {
        // Add new server instances
        await _cloudProvider.LaunchNewInstance();
        await _loadBalancer.RegisterNewInstance();
    }
}`
        },
        {
          id: 'load-balancing',
          icon: '⚖️',
          title: 'Load Balancing Strategies',
          description: 'Distributing incoming requests across multiple servers efficiently',
          details: [
            'Round Robin: Simple rotation through available servers',
            'Least Connections: Route to server with fewest active connections',
            'Weighted Round Robin: Assign different weights to servers',
            'IP Hash: Route based on client IP for session affinity',
            'Health checks and failover mechanisms'
          ],
          codeExample: `// Load Balancing Algorithms Implementation
public enum LoadBalancingStrategy
{
    RoundRobin,
    LeastConnections,
    WeightedRoundRobin,
    IpHash,
    HealthBased
}

public class LoadBalancer
{
    private readonly List<ServerInstance> _servers;
    private int _currentIndex = 0;
    
    // Round Robin Implementation
    public ServerInstance GetRoundRobinServer()
    {
        var healthyServers = _servers.Where(s => s.IsHealthy).ToList();
        if (!healthyServers.Any()) throw new NoHealthyServersException();
        
        var server = healthyServers[_currentIndex % healthyServers.Count];
        _currentIndex = (_currentIndex + 1) % healthyServers.Count;
        return server;
    }
    
    // Least Connections Implementation
    public ServerInstance GetLeastConnectionsServer()
    {
        return _servers
            .Where(s => s.IsHealthy)
            .OrderBy(s => s.ActiveConnections)
            .FirstOrDefault() ?? throw new NoHealthyServersException();
    }
    
    // Health Check Implementation
    public async Task PerformHealthChecks()
    {
        var healthCheckTasks = _servers.Select(async server =>
        {
            try
            {
                var response = await _httpClient.GetAsync($"{server.Url}/health");
                server.IsHealthy = response.IsSuccessStatusCode;
                server.LastHealthCheck = DateTime.UtcNow;
            }
            catch
            {
                server.IsHealthy = false;
            }
        });
        
        await Task.WhenAll(healthCheckTasks);
    }
}`
        }
      ]
    },
    databases: {
      title: "🗄️ Database Design & Management",
      description: "Database scaling, consistency, and design patterns",
      concepts: [
        {
          id: 'database-scaling',
          icon: '📊',
          title: 'Database Scaling Patterns',
          description: 'Strategies for scaling databases to handle increased load and data volume',
          details: [
            'Read Replicas: Distribute read operations across multiple database copies',
            'Database Sharding: Horizontal partitioning of data across multiple databases',
            'Vertical Partitioning: Splitting tables by columns into separate databases',
            'Federation: Split databases by function or feature',
            'Denormalization: Trade storage for query performance'
          ],
          codeExample: `// Database Sharding Implementation
public class ShardedDatabase
{
    private readonly Dictionary<int, IDbConnection> _shards;
    private readonly IShardingStrategy _shardingStrategy;
    
    public ShardedDatabase(IShardingStrategy strategy)
    {
        _shardingStrategy = strategy;
        _shards = new Dictionary<int, IDbConnection>();
    }
    
    public async Task<User> GetUserAsync(int userId)
    {
        var shardId = _shardingStrategy.GetShardId(userId);
        var connection = _shards[shardId];
        
        return await connection.QueryFirstOrDefaultAsync<User>(
            "SELECT * FROM Users WHERE Id = @UserId", 
            new { UserId = userId });
    }
    
    public async Task SaveUserAsync(User user)
    {
        var shardId = _shardingStrategy.GetShardId(user.Id);
        var connection = _shards[shardId];
        
        await connection.ExecuteAsync(
            "INSERT INTO Users (Id, Name, Email) VALUES (@Id, @Name, @Email)",
            user);
    }
}

// Sharding Strategies
public interface IShardingStrategy
{
    int GetShardId(int key);
}

public class HashBasedSharding : IShardingStrategy
{
    private readonly int _shardCount;
    
    public HashBasedSharding(int shardCount)
    {
        _shardCount = shardCount;
    }
    
    public int GetShardId(int key)
    {
        return Math.Abs(key.GetHashCode()) % _shardCount;
    }
}

// Read Replica Pattern
public class ReadWriteDatabase
{
    private readonly IDbConnection _writeConnection;
    private readonly List<IDbConnection> _readConnections;
    private int _readIndex = 0;
    
    public async Task<T> QueryAsync<T>(string sql, object parameters = null)
    {
        var readConnection = GetNextReadConnection();
        return await readConnection.QueryFirstOrDefaultAsync<T>(sql, parameters);
    }
    
    public async Task<int> ExecuteAsync(string sql, object parameters = null)
    {
        return await _writeConnection.ExecuteAsync(sql, parameters);
    }
    
    private IDbConnection GetNextReadConnection()
    {
        var connection = _readConnections[_readIndex % _readConnections.Count];
        _readIndex = (_readIndex + 1) % _readConnections.Count;
        return connection;
    }
}`
        }
      ]
    },
    caching: {
      title: "🚀 Caching Strategies",
      description: "Caching patterns and strategies for improved performance",
      concepts: [
        {
          id: 'caching-patterns',
          icon: '💾',
          title: 'Caching Patterns & Strategies',
          description: 'Different caching approaches and when to use each pattern',
          details: [
            'Cache-Aside (Lazy Loading): Application manages cache explicitly',
            'Write-Through: Write to cache and database simultaneously',
            'Write-Behind (Write-Back): Write to cache first, database later',
            'Refresh-Ahead: Proactively refresh cache before expiration',
            'Cache levels: Browser, CDN, Application, Database'
          ],
          codeExample: `// Cache-Aside Pattern Implementation
public class UserService
{
    private readonly IUserRepository _repository;
    private readonly IMemoryCache _cache;
    private readonly TimeSpan _cacheExpiry = TimeSpan.FromMinutes(30);

    public async Task<User> GetUserAsync(int userId)
    {
        var cacheKey = $"user:{userId}";

        // Try to get from cache first
        if (_cache.TryGetValue(cacheKey, out User cachedUser))
        {
            return cachedUser;
        }

        // Cache miss - get from database
        var user = await _repository.GetByIdAsync(userId);
        if (user != null)
        {
            // Store in cache for future requests
            _cache.Set(cacheKey, user, _cacheExpiry);
        }

        return user;
    }

    public async Task UpdateUserAsync(User user)
    {
        // Update database
        await _repository.UpdateAsync(user);

        // Invalidate cache to ensure consistency
        var cacheKey = $"user:{user.Id}";
        _cache.Remove(cacheKey);
    }
}

// Write-Through Cache Pattern
public class WriteThoughCache<T>
{
    private readonly IRepository<T> _repository;
    private readonly IDistributedCache _cache;

    public async Task<T> GetAsync(string key)
    {
        var cachedValue = await _cache.GetStringAsync(key);
        if (cachedValue != null)
        {
            return JsonSerializer.Deserialize<T>(cachedValue);
        }

        var value = await _repository.GetAsync(key);
        if (value != null)
        {
            await _cache.SetStringAsync(key, JsonSerializer.Serialize(value));
        }

        return value;
    }

    public async Task SetAsync(string key, T value)
    {
        // Write to both cache and database
        await Task.WhenAll(
            _repository.SetAsync(key, value),
            _cache.SetStringAsync(key, JsonSerializer.Serialize(value))
        );
    }
}`
        },
        {
          id: 'distributed-caching',
          icon: '🌐',
          title: 'Distributed Caching',
          description: 'Caching across multiple servers and handling cache consistency',
          details: [
            'Redis: In-memory data structure store for distributed caching',
            'Memcached: High-performance distributed memory caching system',
            'Cache invalidation strategies and consistency models',
            'Cache partitioning and replication',
            'Handling cache failures and fallback strategies'
          ],
          codeExample: `// Redis Distributed Cache Implementation
public class RedisDistributedCache
{
    private readonly IDatabase _database;
    private readonly ILogger<RedisDistributedCache> _logger;

    public RedisDistributedCache(IConnectionMultiplexer redis, ILogger<RedisDistributedCache> logger)
    {
        _database = redis.GetDatabase();
        _logger = logger;
    }

    public async Task<T> GetAsync<T>(string key) where T : class
    {
        try
        {
            var value = await _database.StringGetAsync(key);
            return value.HasValue ? JsonSerializer.Deserialize<T>(value) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting value from Redis for key: {Key}", key);
            return null; // Graceful degradation
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
    {
        try
        {
            var serializedValue = JsonSerializer.Serialize(value);
            await _database.StringSetAsync(key, serializedValue, expiry);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting value in Redis for key: {Key}", key);
            // Don't throw - cache failures shouldn't break the application
        }
    }

    public async Task InvalidatePatternAsync(string pattern)
    {
        try
        {
            var server = _database.Multiplexer.GetServer(_database.Multiplexer.GetEndPoints().First());
            var keys = server.Keys(pattern: pattern);

            var tasks = keys.Select(key => _database.KeyDeleteAsync(key));
            await Task.WhenAll(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating cache pattern: {Pattern}", pattern);
        }
    }
}

// Cache-aside with fallback strategy
public class ResilientCacheService
{
    private readonly RedisDistributedCache _primaryCache;
    private readonly IMemoryCache _fallbackCache;
    private readonly IUserRepository _repository;

    public async Task<User> GetUserAsync(int userId)
    {
        var cacheKey = $"user:{userId}";

        // Try primary cache (Redis)
        var user = await _primaryCache.GetAsync<User>(cacheKey);
        if (user != null) return user;

        // Try fallback cache (in-memory)
        if (_fallbackCache.TryGetValue(cacheKey, out User fallbackUser))
        {
            return fallbackUser;
        }

        // Cache miss - get from database
        user = await _repository.GetByIdAsync(userId);
        if (user != null)
        {
            // Store in both caches
            await _primaryCache.SetAsync(cacheKey, user, TimeSpan.FromMinutes(30));
            _fallbackCache.Set(cacheKey, user, TimeSpan.FromMinutes(5));
        }

        return user;
    }
}`
        }
      ]
    },
    messaging: {
      title: "📨 Messaging & Communication",
      description: "Asynchronous communication patterns and message queuing",
      concepts: [
        {
          id: 'message-queues',
          icon: '📬',
          title: 'Message Queues & Event-Driven Architecture',
          description: 'Asynchronous communication between services using message queues',
          details: [
            'Message Queues: FIFO processing with guaranteed delivery',
            'Publish-Subscribe: One-to-many message distribution',
            'Event Sourcing: Store events as the source of truth',
            'CQRS: Separate read and write models',
            'Message brokers: RabbitMQ, Apache Kafka, Azure Service Bus'
          ],
          codeExample: `// Message Queue Implementation with RabbitMQ
public class MessageQueueService
{
    private readonly IConnection _connection;
    private readonly IModel _channel;

    public MessageQueueService(IConnectionFactory connectionFactory)
    {
        _connection = connectionFactory.CreateConnection();
        _channel = _connection.CreateModel();
    }

    public async Task PublishAsync<T>(string queueName, T message)
    {
        _channel.QueueDeclare(
            queue: queueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null);

        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

        var properties = _channel.CreateBasicProperties();
        properties.Persistent = true; // Make message persistent

        _channel.BasicPublish(
            exchange: "",
            routingKey: queueName,
            basicProperties: properties,
            body: body);
    }

    public void Subscribe<T>(string queueName, Func<T, Task> handler)
    {
        _channel.QueueDeclare(
            queue: queueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null);

        _channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var messageJson = Encoding.UTF8.GetString(body);
            var message = JsonSerializer.Deserialize<T>(messageJson);

            try
            {
                await handler(message);
                _channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            }
            catch (Exception ex)
            {
                // Handle error - could implement retry logic or dead letter queue
                _channel.BasicNack(deliveryTag: ea.DeliveryTag, multiple: false, requeue: false);
            }
        };

        _channel.BasicConsume(queue: queueName, autoAck: false, consumer: consumer);
    }
}

// Event-Driven Architecture Example
public class OrderService
{
    private readonly MessageQueueService _messageQueue;

    public async Task ProcessOrderAsync(Order order)
    {
        // Process the order
        await SaveOrderAsync(order);

        // Publish events for other services
        await _messageQueue.PublishAsync("order.created", new OrderCreatedEvent
        {
            OrderId = order.Id,
            CustomerId = order.CustomerId,
            Total = order.Total,
            CreatedAt = DateTime.UtcNow
        });

        await _messageQueue.PublishAsync("inventory.reserve", new ReserveInventoryEvent
        {
            OrderId = order.Id,
            Items = order.Items.Select(i => new { i.ProductId, i.Quantity }).ToList()
        });

        await _messageQueue.PublishAsync("payment.process", new ProcessPaymentEvent
        {
            OrderId = order.Id,
            Amount = order.Total,
            PaymentMethod = order.PaymentMethod
        });
    }
}

// Event Handlers
public class InventoryService
{
    public async Task HandleReserveInventory(ReserveInventoryEvent @event)
    {
        foreach (var item in @event.Items)
        {
            await ReserveInventoryAsync(item.ProductId, item.Quantity);
        }

        // Publish confirmation event
        await _messageQueue.PublishAsync("inventory.reserved", new InventoryReservedEvent
        {
            OrderId = @event.OrderId,
            Success = true
        });
    }
}`
        }
      ]
    },
    microservices: {
      title: "🔧 Microservices Architecture",
      description: "Designing and implementing microservices-based systems",
      concepts: [
        {
          id: 'service-decomposition',
          icon: '🧩',
          title: 'Service Decomposition & Boundaries',
          description: 'Breaking down monoliths into microservices with proper boundaries',
          details: [
            'Domain-Driven Design: Identify bounded contexts and aggregates',
            'Single Responsibility: Each service should have one reason to change',
            'Data ownership: Each service owns its data and database',
            'API contracts: Well-defined interfaces between services',
            'Service size: Small enough to be maintained by a small team'
          ],
          codeExample: `// Microservice with Clean Architecture
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponse>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        try
        {
            var order = await _orderService.CreateOrderAsync(request);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponse>> GetOrder(int id)
    {
        var order = await _orderService.GetOrderAsync(id);
        return order != null ? Ok(order) : NotFound();
    }
}

// Service Implementation with Domain Logic
public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;
    private readonly IInventoryServiceClient _inventoryClient;
    private readonly IPaymentServiceClient _paymentClient;
    private readonly IMessagePublisher _messagePublisher;

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        // Validate inventory availability
        var inventoryCheck = await _inventoryClient.CheckAvailabilityAsync(request.Items);
        if (!inventoryCheck.IsAvailable)
        {
            throw new InvalidOperationException("Insufficient inventory");
        }

        // Create order domain object
        var order = new Order
        {
            CustomerId = request.CustomerId,
            Items = request.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                Price = i.Price
            }).ToList(),
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        // Calculate total
        order.Total = order.Items.Sum(i => i.Quantity * i.Price);

        // Save order
        await _repository.SaveAsync(order);

        // Publish domain event
        await _messagePublisher.PublishAsync(new OrderCreatedEvent
        {
            OrderId = order.Id,
            CustomerId = order.CustomerId,
            Total = order.Total
        });

        return order;
    }
}

// Service-to-Service Communication
public class InventoryServiceClient : IInventoryServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<InventoryServiceClient> _logger;

    public async Task<InventoryCheckResponse> CheckAvailabilityAsync(List<OrderItem> items)
    {
        try
        {
            var request = new InventoryCheckRequest { Items = items };
            var response = await _httpClient.PostAsJsonAsync("/api/inventory/check", request);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<InventoryCheckResponse>();
            }

            _logger.LogWarning("Inventory service returned {StatusCode}", response.StatusCode);
            return new InventoryCheckResponse { IsAvailable = false };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling inventory service");
            // Implement circuit breaker pattern here
            throw new ServiceUnavailableException("Inventory service unavailable");
        }
    }
}`
        },
        {
          id: 'api-gateway',
          icon: '🚪',
          title: 'API Gateway Pattern',
          description: 'Centralized entry point for microservices with cross-cutting concerns',
          details: [
            'Single entry point: Unified interface for client applications',
            'Request routing: Route requests to appropriate microservices',
            'Authentication & Authorization: Centralized security',
            'Rate limiting: Protect services from overload',
            'Request/Response transformation: Adapt between client and service formats'
          ],
          codeExample: `// API Gateway Implementation with YARP (Yet Another Reverse Proxy)
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddReverseProxy()
            .LoadFromConfig(Configuration.GetSection("ReverseProxy"));

        services.AddAuthentication("Bearer")
            .AddJwtBearer("Bearer", options =>
            {
                options.Authority = "https://your-identity-server";
                options.RequireHttpsMetadata = false;
                options.Audience = "api";
            });

        services.AddAuthorization();
        services.AddRateLimiter(options =>
        {
            options.AddFixedWindowLimiter("api", limiterOptions =>
            {
                limiterOptions.PermitLimit = 100;
                limiterOptions.Window = TimeSpan.FromMinutes(1);
            });
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseRateLimiter();

        // Custom middleware for request transformation
        app.UseMiddleware<RequestTransformationMiddleware>();

        app.UseRouting();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapReverseProxy();
        });
    }
}

// Custom middleware for cross-cutting concerns
public class RequestTransformationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestTransformationMiddleware> _logger;

    public async Task InvokeAsync(HttpContext context)
    {
        // Add correlation ID for distributed tracing
        if (!context.Request.Headers.ContainsKey("X-Correlation-ID"))
        {
            context.Request.Headers.Add("X-Correlation-ID", Guid.NewGuid().ToString());
        }

        // Log request
        _logger.LogInformation("Processing request {Method} {Path} with correlation ID {CorrelationId}",
            context.Request.Method,
            context.Request.Path,
            context.Request.Headers["X-Correlation-ID"]);

        // Add user context
        if (context.User.Identity.IsAuthenticated)
        {
            context.Request.Headers.Add("X-User-ID", context.User.FindFirst("sub")?.Value);
        }

        await _next(context);
    }
}

// Configuration for service routing
{
  "ReverseProxy": {
    "Routes": {
      "orders-route": {
        "ClusterId": "orders-cluster",
        "Match": {
          "Path": "/api/orders/{**catch-all}"
        },
        "Transforms": [
          { "PathPattern": "/api/orders/{**catch-all}" },
          { "RequestHeader": "X-Gateway-Source", "Set": "API-Gateway" }
        ]
      },
      "inventory-route": {
        "ClusterId": "inventory-cluster",
        "Match": {
          "Path": "/api/inventory/{**catch-all}"
        }
      }
    },
    "Clusters": {
      "orders-cluster": {
        "Destinations": {
          "orders-service": {
            "Address": "https://orders-service:443/"
          }
        }
      },
      "inventory-cluster": {
        "Destinations": {
          "inventory-service": {
            "Address": "https://inventory-service:443/"
          }
        }
      }
    }
  }
}`
        }
      ]
    },
    monitoring: {
      title: "📊 Monitoring & Observability",
      description: "Monitoring, logging, and observability in distributed systems",
      concepts: [
        {
          id: 'distributed-tracing',
          icon: '🔍',
          title: 'Distributed Tracing & Logging',
          description: 'Tracking requests across multiple services and systems',
          details: [
            'Correlation IDs: Track requests across service boundaries',
            'Distributed tracing: OpenTelemetry, Jaeger, Zipkin',
            'Structured logging: JSON logs with consistent format',
            'Log aggregation: ELK stack, Splunk, Azure Monitor',
            'Metrics collection: Prometheus, Grafana, Application Insights'
          ],
          codeExample: `// Distributed Tracing with OpenTelemetry
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddOpenTelemetry()
            .WithTracing(builder =>
            {
                builder
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddSqlClientInstrumentation()
                    .AddJaegerExporter();
            })
            .WithMetrics(builder =>
            {
                builder
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddPrometheusExporter();
            });

        services.AddSingleton<ILogger>(provider =>
            new LoggerConfiguration()
                .WriteTo.Console(new JsonFormatter())
                .WriteTo.ApplicationInsights(provider.GetService<TelemetryConfiguration>())
                .CreateLogger());
    }
}

// Custom activity source for business operations
public class OrderService
{
    private static readonly ActivitySource ActivitySource = new("OrderService");
    private readonly ILogger<OrderService> _logger;

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        using var activity = ActivitySource.StartActivity("CreateOrder");
        activity?.SetTag("order.customer_id", request.CustomerId.ToString());
        activity?.SetTag("order.item_count", request.Items.Count.ToString());

        var correlationId = Activity.Current?.Id ?? Guid.NewGuid().ToString();

        _logger.LogInformation("Creating order for customer {CustomerId} with correlation {CorrelationId}",
            request.CustomerId, correlationId);

        try
        {
            // Business logic here
            var order = await ProcessOrderAsync(request);

            activity?.SetTag("order.id", order.Id.ToString());
            activity?.SetTag("order.total", order.Total.ToString());
            activity?.SetStatus(ActivityStatusCode.Ok);

            _logger.LogInformation("Order {OrderId} created successfully for customer {CustomerId}",
                order.Id, request.CustomerId);

            return order;
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            _logger.LogError(ex, "Failed to create order for customer {CustomerId}", request.CustomerId);
            throw;
        }
    }
}

// Health checks for monitoring
public class DatabaseHealthCheck : IHealthCheck
{
    private readonly IDbConnection _connection;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await _connection.ExecuteScalarAsync("SELECT 1");
            return HealthCheckResult.Healthy("Database is responsive");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Database is not responsive", ex);
        }
    }
}

// Custom metrics
public class OrderMetrics
{
    private readonly Counter<int> _ordersCreated;
    private readonly Histogram<double> _orderProcessingTime;
    private readonly Gauge<int> _activeOrders;

    public OrderMetrics(IMeterFactory meterFactory)
    {
        var meter = meterFactory.Create("OrderService");
        _ordersCreated = meter.CreateCounter<int>("orders_created_total");
        _orderProcessingTime = meter.CreateHistogram<double>("order_processing_duration_seconds");
        _activeOrders = meter.CreateGauge<int>("active_orders_count");
    }

    public void RecordOrderCreated(string customerType)
    {
        _ordersCreated.Add(1, new KeyValuePair<string, object>("customer_type", customerType));
    }

    public void RecordProcessingTime(double seconds)
    {
        _orderProcessingTime.Record(seconds);
    }

    public void UpdateActiveOrdersCount(int count)
    {
        _activeOrders.Record(count);
    }
}`
        }
      ]
    },
    security: {
      title: "🔒 Security & Authentication",
      description: "Security patterns and authentication strategies for distributed systems",
      concepts: [
        {
          id: 'authentication-authorization',
          icon: '🛡️',
          title: 'Authentication & Authorization Patterns',
          description: 'Securing APIs and implementing proper access control',
          details: [
            'JWT Tokens: Stateless authentication with JSON Web Tokens',
            'OAuth 2.0 / OpenID Connect: Industry standard for authorization',
            'API Keys: Simple authentication for service-to-service calls',
            'Role-Based Access Control (RBAC): Permission management',
            'Rate limiting and DDoS protection'
          ],
          codeExample: `// JWT Authentication Implementation
public class JwtAuthenticationService
{
    private readonly IConfiguration _configuration;
    private readonly IUserService _userService;

    public async Task<AuthenticationResult> AuthenticateAsync(LoginRequest request)
    {
        var user = await _userService.ValidateCredentialsAsync(request.Username, request.Password);
        if (user == null)
        {
            return new AuthenticationResult { Success = false, Message = "Invalid credentials" };
        }

        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        // Store refresh token
        await _userService.SaveRefreshTokenAsync(user.Id, refreshToken);

        return new AuthenticationResult
        {
            Success = true,
            AccessToken = token,
            RefreshToken = refreshToken,
            ExpiresIn = 3600 // 1 hour
        };
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("role", user.Role),
            new Claim("permissions", string.Join(",", user.Permissions))
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// Authorization Policy Implementation
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    ValidAudience = Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
                };
            });

        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy =>
                policy.RequireClaim("role", "Admin"));

            options.AddPolicy("CanManageOrders", policy =>
                policy.RequireAssertion(context =>
                    context.User.HasClaim("permissions", "orders.manage") ||
                    context.User.HasClaim("role", "Admin")));
        });
    }
}

// Rate Limiting Implementation
public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMemoryCache _cache;
    private readonly RateLimitOptions _options;

    public async Task InvokeAsync(HttpContext context)
    {
        var clientId = GetClientIdentifier(context);
        var key = $"rate_limit:{clientId}";

        var requestCount = _cache.Get<int>(key);

        if (requestCount >= _options.MaxRequests)
        {
            context.Response.StatusCode = 429; // Too Many Requests
            await context.Response.WriteAsync("Rate limit exceeded");
            return;
        }

        _cache.Set(key, requestCount + 1, TimeSpan.FromMinutes(_options.WindowMinutes));

        await _next(context);
    }

    private string GetClientIdentifier(HttpContext context)
    {
        // Use API key, user ID, or IP address
        return context.Request.Headers["X-API-Key"].FirstOrDefault() ??
               context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
               context.Connection.RemoteIpAddress?.ToString() ??
               "anonymous";
    }
}`
        },
        {
          id: 'data-security',
          icon: '🔐',
          title: 'Data Security & Encryption',
          description: 'Protecting sensitive data at rest and in transit',
          details: [
            'Encryption at rest: Database encryption, file system encryption',
            'Encryption in transit: HTTPS/TLS, certificate management',
            'Data masking: Hide sensitive data in logs and responses',
            'Secrets management: Azure Key Vault, HashiCorp Vault',
            'GDPR compliance: Data privacy and right to be forgotten'
          ],
          codeExample: `// Data Encryption Service
public class DataEncryptionService
{
    private readonly IConfiguration _configuration;
    private readonly byte[] _key;

    public DataEncryptionService(IConfiguration configuration)
    {
        _configuration = configuration;
        _key = Convert.FromBase64String(configuration["Encryption:Key"]);
    }

    public string EncryptString(string plainText)
    {
        if (string.IsNullOrEmpty(plainText)) return plainText;

        using var aes = Aes.Create();
        aes.Key = _key;
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor();
        using var msEncrypt = new MemoryStream();
        using var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write);
        using var swEncrypt = new StreamWriter(csEncrypt);

        swEncrypt.Write(plainText);

        var iv = aes.IV;
        var encrypted = msEncrypt.ToArray();
        var result = new byte[iv.Length + encrypted.Length];

        Buffer.BlockCopy(iv, 0, result, 0, iv.Length);
        Buffer.BlockCopy(encrypted, 0, result, iv.Length, encrypted.Length);

        return Convert.ToBase64String(result);
    }

    public string DecryptString(string cipherText)
    {
        if (string.IsNullOrEmpty(cipherText)) return cipherText;

        var fullCipher = Convert.FromBase64String(cipherText);
        var iv = new byte[16];
        var cipher = new byte[fullCipher.Length - 16];

        Buffer.BlockCopy(fullCipher, 0, iv, 0, iv.Length);
        Buffer.BlockCopy(fullCipher, iv.Length, cipher, 0, cipher.Length);

        using var aes = Aes.Create();
        aes.Key = _key;
        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor();
        using var msDecrypt = new MemoryStream(cipher);
        using var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);
        using var srDecrypt = new StreamReader(csDecrypt);

        return srDecrypt.ReadToEnd();
    }
}

// Sensitive Data Masking
public class DataMaskingService
{
    public string MaskEmail(string email)
    {
        if (string.IsNullOrEmpty(email) || !email.Contains("@"))
            return email;

        var parts = email.Split('@');
        var username = parts[0];
        var domain = parts[1];

        if (username.Length <= 2)
            return $"**@{domain}";

        return $"{username[0]}***{username[^1]}@{domain}";
    }

    public string MaskCreditCard(string cardNumber)
    {
        if (string.IsNullOrEmpty(cardNumber) || cardNumber.Length < 4)
            return "****";

        return $"****-****-****-{cardNumber[^4..]}";
    }

    public string MaskPhoneNumber(string phoneNumber)
    {
        if (string.IsNullOrEmpty(phoneNumber) || phoneNumber.Length < 4)
            return "***-***-****";

        return $"***-***-{phoneNumber[^4..]}";
    }
}

// Secrets Management with Azure Key Vault
public class SecretsService
{
    private readonly SecretClient _secretClient;
    private readonly IMemoryCache _cache;

    public SecretsService(SecretClient secretClient, IMemoryCache cache)
    {
        _secretClient = secretClient;
        _cache = cache;
    }

    public async Task<string> GetSecretAsync(string secretName)
    {
        var cacheKey = $"secret:{secretName}";

        if (_cache.TryGetValue(cacheKey, out string cachedSecret))
        {
            return cachedSecret;
        }

        try
        {
            var secret = await _secretClient.GetSecretAsync(secretName);

            // Cache for 5 minutes
            _cache.Set(cacheKey, secret.Value.Value, TimeSpan.FromMinutes(5));

            return secret.Value.Value;
        }
        catch (Exception ex)
        {
            throw new SecretRetrievalException($"Failed to retrieve secret '{secretName}'", ex);
        }
    }

    public async Task SetSecretAsync(string secretName, string secretValue)
    {
        await _secretClient.SetSecretAsync(secretName, secretValue);

        // Invalidate cache
        _cache.Remove($"secret:{secretName}");
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
        <h1>🏗️ System Design Concepts</h1>
        <p className="subtitle">
          Essential system design patterns and concepts for building scalable, distributed systems
        </p>
        <div className="video-reference">
          <p>📺 <strong>Reference Video:</strong> 
            <a href="https://www.youtube.com/watch?v=s9Qh9fWeOAk" target="_blank" rel="noopener noreferrer">
              System Design Interview Concepts
            </a>
          </p>
        </div>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {concepts[category].title}
          </button>
        ))}
      </div>

      <div className="category-content">
        <div className="category-header">
          <h2>{concepts[activeCategory].title}</h2>
          <p className="category-description">{concepts[activeCategory].description}</p>
        </div>

        <div className="concepts-grid">
          {concepts[activeCategory].concepts.map(concept => (
            <div key={concept.id} className="concept-card">
              <div 
                className="concept-header"
                onClick={() => toggleConcept(concept.id)}
              >
                <div className="concept-title">
                  <span className="concept-icon">{concept.icon}</span>
                  <h3>{concept.title}</h3>
                </div>
                <span className={`expand-icon ${expandedConcepts[concept.id] ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              
              <p className="concept-description">{concept.description}</p>
              
              {expandedConcepts[concept.id] && (
                <div className="concept-details">
                  <div className="details-section">
                    <h4>🎯 Key Concepts:</h4>
                    <ul>
                      {concept.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {concept.codeExample && (
                    <div className="code-section">
                      <h4>💻 Implementation Example:</h4>
                      <pre className="code-block">
                        <code>{concept.codeExample}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemDesignConcepts;
