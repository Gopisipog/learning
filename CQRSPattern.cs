using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodingPatterns
{
    /// <summary>
    /// CQRS (Command Query Responsibility Segregation) Pattern Implementation
    /// Separates read and write operations into different models
    /// </summary>
    public class CQRSPatternDemo
    {
        public static void Main()
        {
            Console.WriteLine("=== CQRS Pattern Implementation Demo ===");
            Console.WriteLine("========================================");
            
            var demo = new CQRSPatternDemo();
            demo.RunCQRSDemo();
        }

        public void RunCQRSDemo()
        {
            // Initialize CQRS components
            var eventStore = new EventStore();
            var readDatabase = new ReadDatabase();
            var commandHandler = new ProductCommandHandler(eventStore);
            var queryHandler = new ProductQueryHandler(readDatabase);
            var eventHandler = new ProductEventHandler(readDatabase);

            // Subscribe to events for read model updates
            eventStore.EventPublished += eventHandler.Handle;

            Console.WriteLine("🏗️ CQRS Architecture Initialized");
            Console.WriteLine("📝 Command Side: Handles writes and business logic");
            Console.WriteLine("📖 Query Side: Handles reads and optimized views");
            Console.WriteLine();

            // Demonstrate CQRS operations
            DemonstrateCommands(commandHandler);
            Console.WriteLine();
            DemonstrateQueries(queryHandler);
            Console.WriteLine();
            DemonstrateEventSourcing(eventStore);
        }

        private void DemonstrateCommands(ProductCommandHandler commandHandler)
        {
            Console.WriteLine("=== COMMAND SIDE OPERATIONS ===");
            Console.WriteLine("Commands modify state and generate events");
            Console.WriteLine();

            // Create product command
            var createCommand = new CreateProductCommand
            {
                Id = Guid.NewGuid(),
                Name = "Gaming Laptop",
                Price = 1299.99m,
                Category = "Electronics"
            };

            Console.WriteLine($"📝 Executing CreateProductCommand:");
            Console.WriteLine($"   Product: {createCommand.Name}");
            Console.WriteLine($"   Price: ${createCommand.Price}");
            commandHandler.Handle(createCommand);

            // Update price command
            var updateCommand = new UpdateProductPriceCommand
            {
                Id = createCommand.Id,
                NewPrice = 1199.99m,
                Reason = "Holiday Sale"
            };

            Console.WriteLine($"\n📝 Executing UpdateProductPriceCommand:");
            Console.WriteLine($"   New Price: ${updateCommand.NewPrice}");
            Console.WriteLine($"   Reason: {updateCommand.Reason}");
            commandHandler.Handle(updateCommand);
        }

        private void DemonstrateQueries(ProductQueryHandler queryHandler)
        {
            Console.WriteLine("=== QUERY SIDE OPERATIONS ===");
            Console.WriteLine("Queries read optimized views without side effects");
            Console.WriteLine();

            // Get all products query
            var allProductsQuery = new GetAllProductsQuery();
            var allProducts = queryHandler.Handle(allProductsQuery);
            
            Console.WriteLine($"📖 Executing GetAllProductsQuery:");
            Console.WriteLine($"   Found {allProducts.Count()} products");
            foreach (var product in allProducts)
            {
                Console.WriteLine($"   - {product.Name}: ${product.Price} ({product.Category})");
            }

            // Get products by category query
            var categoryQuery = new GetProductsByCategoryQuery { Category = "Electronics" };
            var electronicsProducts = queryHandler.Handle(categoryQuery);
            
            Console.WriteLine($"\n📖 Executing GetProductsByCategoryQuery:");
            Console.WriteLine($"   Category: {categoryQuery.Category}");
            Console.WriteLine($"   Found {electronicsProducts.Count()} products");
        }

        private void DemonstrateEventSourcing(EventStore eventStore)
        {
            Console.WriteLine("=== EVENT SOURCING ===");
            Console.WriteLine("Events provide complete audit trail");
            Console.WriteLine();

            var events = eventStore.GetAllEvents();
            Console.WriteLine($"📚 Event Store contains {events.Count()} events:");
            
            foreach (var evt in events)
            {
                Console.WriteLine($"   🔸 {evt.EventType} at {evt.Timestamp:HH:mm:ss}");
                Console.WriteLine($"     Data: {evt.Data}");
            }
        }
    }

    // ============= COMMAND SIDE =============

    /// <summary>
    /// Base interface for all commands
    /// Commands represent intent to change state
    /// </summary>
    public interface ICommand
    {
        Guid Id { get; set; }
    }

    /// <summary>
    /// Command to create a new product
    /// </summary>
    public class CreateProductCommand : ICommand
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
    }

    /// <summary>
    /// Command to update product price
    /// </summary>
    public class UpdateProductPriceCommand : ICommand
    {
        public Guid Id { get; set; }
        public decimal NewPrice { get; set; }
        public string Reason { get; set; }
    }

    /// <summary>
    /// Handles product-related commands
    /// Validates business rules and generates events
    /// </summary>
    public class ProductCommandHandler
    {
        private readonly EventStore _eventStore;

        public ProductCommandHandler(EventStore eventStore)
        {
            _eventStore = eventStore;
        }

        public void Handle(CreateProductCommand command)
        {
            // Business logic validation
            if (string.IsNullOrEmpty(command.Name))
                throw new ArgumentException("Product name is required");
            
            if (command.Price <= 0)
                throw new ArgumentException("Product price must be positive");

            // Generate and store event
            var productCreatedEvent = new ProductCreatedEvent
            {
                Id = command.Id,
                Name = command.Name,
                Price = command.Price,
                Category = command.Category,
                CreatedAt = DateTime.UtcNow
            };

            _eventStore.SaveEvent(productCreatedEvent);
            Console.WriteLine($"   ✅ Product created successfully");
        }

        public void Handle(UpdateProductPriceCommand command)
        {
            // Business logic validation
            if (command.NewPrice <= 0)
                throw new ArgumentException("Price must be positive");

            // Generate and store event
            var priceUpdatedEvent = new ProductPriceUpdatedEvent
            {
                Id = command.Id,
                NewPrice = command.NewPrice,
                Reason = command.Reason,
                UpdatedAt = DateTime.UtcNow
            };

            _eventStore.SaveEvent(priceUpdatedEvent);
            Console.WriteLine($"   ✅ Product price updated successfully");
        }
    }

    // ============= QUERY SIDE =============

    /// <summary>
    /// Base interface for all queries
    /// Queries represent intent to read data
    /// </summary>
    public interface IQuery<TResult>
    {
    }

    /// <summary>
    /// Query to get all products
    /// </summary>
    public class GetAllProductsQuery : IQuery<IEnumerable<ProductReadModel>>
    {
    }

    /// <summary>
    /// Query to get products by category
    /// </summary>
    public class GetProductsByCategoryQuery : IQuery<IEnumerable<ProductReadModel>>
    {
        public string Category { get; set; }
    }

    /// <summary>
    /// Read model optimized for queries
    /// Contains denormalized data for fast reads
    /// </summary>
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

    /// <summary>
    /// Handles product-related queries
    /// Reads from optimized read models
    /// </summary>
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

        public IEnumerable<ProductReadModel> Handle(GetProductsByCategoryQuery query)
        {
            return _readDatabase.GetProductsByCategory(query.Category);
        }
    }

    // ============= EVENT SOURCING =============

    /// <summary>
    /// Base interface for all events
    /// Events represent things that have happened
    /// </summary>
    public interface IEvent
    {
        Guid Id { get; set; }
        DateTime Timestamp { get; set; }
        string EventType { get; }
        string Data { get; }
    }

    /// <summary>
    /// Event raised when a product is created
    /// </summary>
    public class ProductCreatedEvent : IEvent
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string EventType => "ProductCreated";
        public string Data => $"Name: {Name}, Price: ${Price}, Category: {Category}";
    }

    /// <summary>
    /// Event raised when product price is updated
    /// </summary>
    public class ProductPriceUpdatedEvent : IEvent
    {
        public Guid Id { get; set; }
        public decimal NewPrice { get; set; }
        public string Reason { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string EventType => "ProductPriceUpdated";
        public string Data => $"New Price: ${NewPrice}, Reason: {Reason}";
    }

    /// <summary>
    /// Event store for persisting and retrieving events
    /// Provides complete audit trail and event sourcing capabilities
    /// </summary>
    public class EventStore
    {
        private readonly List<IEvent> _events = new List<IEvent>();
        public event Action<IEvent> EventPublished;

        public void SaveEvent(IEvent eventToSave)
        {
            _events.Add(eventToSave);
            Console.WriteLine($"   📝 Event saved: {eventToSave.EventType}");

            // Publish event for read model updates
            EventPublished?.Invoke(eventToSave);
        }

        public IEnumerable<IEvent> GetAllEvents()
        {
            return _events.AsReadOnly();
        }

        public IEnumerable<IEvent> GetEventsForAggregate(Guid aggregateId)
        {
            return _events.Where(e => e.Id == aggregateId);
        }
    }

    /// <summary>
    /// Read database optimized for queries
    /// Contains denormalized views for fast reads
    /// </summary>
    public class ReadDatabase
    {
        private readonly List<ProductReadModel> _products = new List<ProductReadModel>();

        public void AddProduct(ProductReadModel product)
        {
            _products.Add(product);
            Console.WriteLine($"   📖 Read model updated: Product {product.Name} added");
        }

        public void UpdateProduct(Guid id, Action<ProductReadModel> updateAction)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product != null)
            {
                updateAction(product);
                Console.WriteLine($"   📖 Read model updated: Product {product.Name} modified");
            }
        }

        public IEnumerable<ProductReadModel> GetAllProducts()
        {
            return _products.AsReadOnly();
        }

        public IEnumerable<ProductReadModel> GetProductsByCategory(string category)
        {
            return _products.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
        }

        public ProductReadModel GetProductById(Guid id)
        {
            return _products.FirstOrDefault(p => p.Id == id);
        }
    }

    /// <summary>
    /// Event handler that updates read models based on events
    /// Maintains eventual consistency between command and query sides
    /// </summary>
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
                case ProductPriceUpdatedEvent priceUpdated:
                    HandleProductPriceUpdated(priceUpdated);
                    break;
                default:
                    Console.WriteLine($"   ⚠️ Unknown event type: {eventToHandle.EventType}");
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
                CreatedAt = eventData.CreatedAt,
                ViewCount = 0
            };

            _readDatabase.AddProduct(readModel);
        }

        private void HandleProductPriceUpdated(ProductPriceUpdatedEvent eventData)
        {
            _readDatabase.UpdateProduct(eventData.Id, product =>
            {
                product.Price = eventData.NewPrice;
                product.LastUpdated = eventData.UpdatedAt;
            });
        }
    }

    /// <summary>
    /// CQRS Benefits Demonstration
    /// Shows advantages of separating read and write concerns
    /// </summary>
    public static class CQRSBenefitsDemo
    {
        public static void DemonstrateBenefits()
        {
            Console.WriteLine("\n=== CQRS PATTERN BENEFITS ===");
            Console.WriteLine("==============================");

            Console.WriteLine("\n🎯 1. SEPARATION OF CONCERNS:");
            Console.WriteLine("   ✅ Commands handle business logic and validation");
            Console.WriteLine("   ✅ Queries handle data retrieval and presentation");
            Console.WriteLine("   ✅ Clear responsibility boundaries");

            Console.WriteLine("\n⚡ 2. PERFORMANCE OPTIMIZATION:");
            Console.WriteLine("   ✅ Read models optimized for specific queries");
            Console.WriteLine("   ✅ Denormalized data for faster reads");
            Console.WriteLine("   ✅ Independent scaling of read/write sides");

            Console.WriteLine("\n🔍 3. FLEXIBILITY:");
            Console.WriteLine("   ✅ Different data models for reads vs writes");
            Console.WriteLine("   ✅ Multiple read models for different use cases");
            Console.WriteLine("   ✅ Technology choices per side (SQL vs NoSQL)");

            Console.WriteLine("\n📚 4. AUDIT TRAIL:");
            Console.WriteLine("   ✅ Complete event history");
            Console.WriteLine("   ✅ Ability to replay events");
            Console.WriteLine("   ✅ Temporal queries (state at any point in time)");

            Console.WriteLine("\n🔄 5. EVENTUAL CONSISTENCY:");
            Console.WriteLine("   ✅ Acceptable for many business scenarios");
            Console.WriteLine("   ✅ Better availability and partition tolerance");
            Console.WriteLine("   ✅ Reduced coupling between components");
        }
    }
}
