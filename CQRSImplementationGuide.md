# CQRS Pattern Implementation Guide for .NET

## 📋 Step-by-Step Implementation Sequence

### **Phase 1: Foundation Setup (15 minutes)**

#### Step 1: Define Core Interfaces
```csharp
// 1.1 Command Interface
public interface ICommand
{
    Guid Id { get; set; }
}

// 1.2 Query Interface
public interface IQuery<TResult>
{
}

// 1.3 Event Interface
public interface IEvent
{
    Guid Id { get; set; }
    DateTime Timestamp { get; set; }
    string EventType { get; }
    string Data { get; }
}
```

#### Step 2: Create Domain Models
```csharp
// 2.1 Command Models
public class CreateProductCommand : ICommand
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
}

// 2.2 Query Models
public class GetAllProductsQuery : IQuery<IEnumerable<ProductReadModel>>
{
}

// 2.3 Event Models
public class ProductCreatedEvent : IEvent
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string EventType => "ProductCreated";
    public string Data => $"Name: {Name}, Price: ${Price}";
}
```

### **Phase 2: Command Side Implementation (20 minutes)**

#### Step 3: Implement Command Handlers
```csharp
public class ProductCommandHandler
{
    private readonly EventStore _eventStore;

    public ProductCommandHandler(EventStore eventStore)
    {
        _eventStore = eventStore;
    }

    public void Handle(CreateProductCommand command)
    {
        // 3.1 Validate business rules
        if (string.IsNullOrEmpty(command.Name))
            throw new ArgumentException("Product name is required");
        
        if (command.Price <= 0)
            throw new ArgumentException("Product price must be positive");

        // 3.2 Generate event
        var productCreatedEvent = new ProductCreatedEvent
        {
            Id = command.Id,
            Name = command.Name,
            Price = command.Price,
            Category = command.Category
        };

        // 3.3 Store event
        _eventStore.SaveEvent(productCreatedEvent);
    }
}
```

#### Step 4: Create Event Store
```csharp
public class EventStore
{
    private readonly List<IEvent> _events = new List<IEvent>();
    public event Action<IEvent> EventPublished;

    public void SaveEvent(IEvent eventToSave)
    {
        _events.Add(eventToSave);
        EventPublished?.Invoke(eventToSave);
    }

    public IEnumerable<IEvent> GetAllEvents()
    {
        return _events.AsReadOnly();
    }
}
```

### **Phase 3: Query Side Implementation (20 minutes)**

#### Step 5: Create Read Models
```csharp
public class ProductReadModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastUpdated { get; set; }
    public int ViewCount { get; set; } // Denormalized data
}
```

#### Step 6: Implement Query Handlers
```csharp
public class ProductQueryHandler
{
    private readonly ReadDatabase _readDatabase;

    public ProductQueryHandler(ReadDatabase readDatabase)
    {
        _readDatabase = readDatabase;
    }

    public IEnumerable<ProductReadModel> Handle(GetAllProductsQuery query)
    {
        return _readDatabase.GetAllProducts();
    }
}
```

#### Step 7: Create Read Database
```csharp
public class ReadDatabase
{
    private readonly List<ProductReadModel> _products = new List<ProductReadModel>();

    public void AddProduct(ProductReadModel product)
    {
        _products.Add(product);
    }

    public IEnumerable<ProductReadModel> GetAllProducts()
    {
        return _products.AsReadOnly();
    }
}
```

### **Phase 4: Event Handling (15 minutes)**

#### Step 8: Implement Event Handlers
```csharp
public class ProductEventHandler
{
    private readonly ReadDatabase _readDatabase;

    public ProductEventHandler(ReadDatabase readDatabase)
    {
        _readDatabase = readDatabase;
    }

    public void Handle(IEvent eventToHandle)
    {
        switch (eventToHandle)
        {
            case ProductCreatedEvent productCreated:
                HandleProductCreated(productCreated);
                break;
        }
    }

    private void HandleProductCreated(ProductCreatedEvent eventData)
    {
        var readModel = new ProductReadModel
        {
            Id = eventData.Id,
            Name = eventData.Name,
            Price = eventData.Price,
            Category = eventData.Category,
            CreatedAt = eventData.Timestamp,
            ViewCount = 0
        };

        _readDatabase.AddProduct(readModel);
    }
}
```

### **Phase 5: Wiring Everything Together (10 minutes)**

#### Step 9: Initialize CQRS Components
```csharp
public void SetupCQRS()
{
    // Initialize components
    var eventStore = new EventStore();
    var readDatabase = new ReadDatabase();
    var commandHandler = new ProductCommandHandler(eventStore);
    var queryHandler = new ProductQueryHandler(readDatabase);
    var eventHandler = new ProductEventHandler(readDatabase);

    // Wire event handling
    eventStore.EventPublished += eventHandler.Handle;
}
```

#### Step 10: Demonstrate Usage
```csharp
public void DemonstrateCQRS()
{
    // Execute command
    var createCommand = new CreateProductCommand
    {
        Id = Guid.NewGuid(),
        Name = "Gaming Laptop",
        Price = 1299.99m,
        Category = "Electronics"
    };
    commandHandler.Handle(createCommand);

    // Execute query
    var query = new GetAllProductsQuery();
    var products = queryHandler.Handle(query);
}
```

## 🎯 Learning Prompts for Each Phase

### **Phase 1 Prompts:**
1. **Why separate Commands and Queries?**
   - Commands change state, Queries read state
   - Different optimization needs
   - Clear responsibility boundaries

2. **What makes a good Command?**
   - Represents business intent
   - Contains all necessary data
   - Immutable once created

### **Phase 2 Prompts:**
3. **Where should business logic live?**
   - In Command Handlers
   - Validates before state changes
   - Enforces business rules

4. **Why generate Events instead of direct updates?**
   - Decouples command and query sides
   - Enables audit trail
   - Supports multiple read models

### **Phase 3 Prompts:**
5. **How should Read Models be designed?**
   - Optimized for specific queries
   - Can be denormalized
   - Multiple models for different views

6. **What's the role of Query Handlers?**
   - Pure data retrieval
   - No side effects
   - Fast and optimized

### **Phase 4 Prompts:**
7. **How do Event Handlers maintain consistency?**
   - Listen to events from command side
   - Update read models accordingly
   - Handle eventual consistency

8. **What if event handling fails?**
   - Implement retry mechanisms
   - Use dead letter queues
   - Monitor and alert

### **Phase 5 Prompts:**
9. **How to handle concurrent operations?**
   - Optimistic concurrency control
   - Event versioning
   - Conflict resolution strategies

10. **When is CQRS overkill?**
    - Simple CRUD applications
    - Low complexity domains
    - Small team/project size

## 🚀 Next Steps and Advanced Topics

1. **Add Dependency Injection**
2. **Implement Message Bus**
3. **Add Persistence (SQL/NoSQL)**
4. **Implement Saga Pattern**
5. **Add Monitoring and Logging**
6. **Performance Optimization**
7. **Error Handling Strategies**
8. **Testing Strategies**
