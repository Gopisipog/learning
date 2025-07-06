import React, { useState } from 'react';

function CQRSPattern() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [demoOutput, setDemoOutput] = useState([]);

  const implementationSteps = [
    {
      title: "Phase 1: Foundation Setup (15 min)",
      description: "Define Core Interfaces",
      code: `// Command Interface - Represents intent to change state
public interface ICommand
{
    Guid Id { get; set; }
}

// Query Interface - Represents intent to read data  
public interface IQuery<TResult>
{
}

// Event Interface - Represents something that happened
public interface IEvent
{
    Guid Id { get; set; }
    DateTime Timestamp { get; set; }
    string EventType { get; }
    string Data { get; }
}`,
      prompt: "Why do we separate Commands and Queries into different interfaces?",
      answer: "Different responsibilities and optimization needs - Commands change state and focus on consistency, Queries read state and focus on performance."
    },
    {
      title: "Phase 2: Command Side (20 min)",
      description: "Implement Command Handlers with Business Logic",
      code: `public class CreateProductCommand : ICommand
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
}

public class ProductCommandHandler
{
    private readonly EventStore _eventStore;

    public void Handle(CreateProductCommand command)
    {
        // 1. Validate business rules
        if (string.IsNullOrEmpty(command.Name))
            throw new ArgumentException("Product name is required");
        
        // 2. Generate event
        var productCreatedEvent = new ProductCreatedEvent
        {
            Id = command.Id,
            Name = command.Name,
            Price = command.Price,
            Category = command.Category
        };

        // 3. Store event
        _eventStore.SaveEvent(productCreatedEvent);
    }
}`,
      prompt: "Where should business logic and validation live in CQRS?",
      answer: "In Command Handlers - they are the 'brain' of the write side, validate commands, enforce business rules, and generate events."
    },
    {
      title: "Phase 3: Event Sourcing (15 min)",
      description: "Create Event Store for Audit Trail",
      code: `public class ProductCreatedEvent : IEvent
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string EventType => "ProductCreated";
    public string Data => $"Name: {Name}, Price: {Price}";
}

public class EventStore
{
    private readonly List<IEvent> _events = new List<IEvent>();
    public event Action<IEvent> EventPublished;

    public void SaveEvent(IEvent eventToSave)
    {
        _events.Add(eventToSave);
        EventPublished?.Invoke(eventToSave);
    }
}`,
      prompt: "What role does Event Sourcing play in CQRS?",
      answer: "Provides complete audit trail, ability to replay events, temporal queries, and decouples command and query sides."
    },
    {
      title: "Phase 4: Query Side (20 min)",
      description: "Build Read Models Optimized for Queries",
      code: `public class ProductReadModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public DateTime CreatedAt { get; set; }
    public int ViewCount { get; set; } // Denormalized data
}

public class ProductQueryHandler
{
    private readonly ReadDatabase _readDatabase;

    public IEnumerable<ProductReadModel> Handle(GetAllProductsQuery query)
    {
        return _readDatabase.GetAllProducts();
    }
}`,
      prompt: "How are Read Models different from Write Models?",
      answer: "Read Models are optimized for specific queries, can be denormalized for performance, support multiple views, and contain no business logic."
    },
    {
      title: "Phase 5: Event Handling (15 min)",
      description: "Update Read Models via Event Handlers",
      code: `public class ProductEventHandler
{
    private readonly ReadDatabase _readDatabase;

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
}`,
      prompt: "How do Event Handlers maintain consistency?",
      answer: "They listen to events from command side, update read models accordingly, handle eventual consistency, and can implement retry mechanisms."
    },
    {
      title: "Phase 6: Integration (10 min)",
      description: "Wire Everything Together",
      code: `public void SetupCQRS()
{
    // Initialize components
    var eventStore = new EventStore();
    var readDatabase = new ReadDatabase();
    var commandHandler = new ProductCommandHandler(eventStore);
    var queryHandler = new ProductQueryHandler(readDatabase);
    var eventHandler = new ProductEventHandler(readDatabase);

    // Wire event handling
    eventStore.EventPublished += eventHandler.Handle;
}`,
      prompt: "What's the typical flow in a CQRS system?",
      answer: "Command Handler processes command → generates event → Event Handler updates read model → Query Handler reads optimized data."
    }
  ];

  const runDemo = () => {
    setShowDemo(true);
    const output = [
      "🏗️ CQRS Architecture Components:",
      "   📝 Command Handler: Processes business operations",
      "   📖 Query Handler: Retrieves optimized data views",
      "   📚 Event Store: Maintains complete audit trail",
      "   🔄 Event Handler: Updates read models",
      "",
      "🚀 Executing CQRS Operations:",
      "",
      "📝 Creating: Gaming Laptop ($1299.99)",
      "   📝 Event saved: ProductCreated",
      "   📖 Read model updated: Product Gaming Laptop added",
      "   ✅ Product created successfully",
      "",
      "📝 Creating: Wireless Mouse ($49.99)",
      "   📝 Event saved: ProductCreated", 
      "   📖 Read model updated: Product Wireless Mouse added",
      "   ✅ Product created successfully",
      "",
      "📝 Updating price: $1199.99 - Black Friday Sale",
      "   📝 Event saved: ProductPriceUpdated",
      "   📖 Read model updated: Product Gaming Laptop modified",
      "   ✅ Product price updated successfully",
      "",
      "📖 Querying all products:",
      "   • Gaming Laptop: $1199.99 (Electronics)",
      "   • Wireless Mouse: $49.99 (Electronics)",
      "",
      "📚 Event History:",
      "   🔸 ProductCreated at 17:24:11",
      "   🔸 ProductCreated at 17:24:11", 
      "   🔸 ProductPriceUpdated at 17:24:11"
    ];
    setDemoOutput(output);
  };

  return (
    <div className="page-content" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '2.5em', marginBottom: '10px' }}>
          🎯 CQRS Pattern Implementation
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.2em' }}>
          Command Query Responsibility Segregation - Step-by-Step Learning Guide
        </p>
      </div>

      {/* Implementation Steps */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>📋 Implementation Sequence</h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          {implementationSteps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: currentStep === index ? '#3498db' : '#ecf0f1',
                color: currentStep === index ? 'white' : '#2c3e50',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Phase {index + 1}
            </button>
          ))}
        </div>

        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ color: '#8e44ad', marginBottom: '15px' }}>
            {implementationSteps[currentStep].title}
          </h3>
          <p style={{ color: '#7f8c8d', marginBottom: '20px', fontSize: '16px' }}>
            {implementationSteps[currentStep].description}
          </p>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
            <pre style={{ margin: 0, fontSize: '14px', lineHeight: '1.4', overflow: 'auto' }}>
              <code>{implementationSteps[currentStep].code}</code>
            </pre>
          </div>

          <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '5px', border: '1px solid #27ae60' }}>
            <h4 style={{ color: '#27ae60', margin: '0 0 10px 0' }}>
              🎓 Learning Prompt:
            </h4>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#2c3e50' }}>
              {implementationSteps[currentStep].prompt}
            </p>
            <p style={{ margin: 0, color: '#27ae60', fontSize: '14px' }}>
              <strong>Answer:</strong> {implementationSteps[currentStep].answer}
            </p>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>🚀 Live Demo</h2>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={runDemo}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Run CQRS Demo
          </button>
        </div>

        {showDemo && (
          <div style={{ backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '20px', borderRadius: '8px', fontFamily: 'monospace' }}>
            {demoOutput.map((line, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>✅ CQRS Benefits</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ color: '#3498db', marginBottom: '15px' }}>🎯 Independent Scaling</h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <li>Read side scales independently of write side</li>
              <li>Use different databases for reads vs writes</li>
              <li>Optimize each side for specific needs</li>
            </ul>
          </div>
          
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ color: '#3498db', marginBottom: '15px' }}>⚡ Performance Optimization</h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <li>Read models optimized for specific queries</li>
              <li>Denormalized data for faster reads</li>
              <li>No complex joins needed</li>
            </ul>
          </div>
          
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ color: '#3498db', marginBottom: '15px' }}>📚 Complete Audit Trail</h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <li>Complete history of all changes</li>
              <li>Ability to replay events</li>
              <li>Temporal queries support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* When to Use */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#e74c3c', marginBottom: '15px' }}>🎯 When to Use CQRS</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ color: '#27ae60', marginBottom: '10px' }}>✅ Good Fit:</h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <li>Complex business domains</li>
              <li>High read-to-write ratios</li>
              <li>Need for multiple specialized views</li>
              <li>Audit trail requirements</li>
              <li>Different performance needs for reads vs writes</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>❌ Avoid When:</h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <li>Simple CRUD applications</li>
              <li>Small team/project size</li>
              <li>Low complexity domains</li>
              <li>Immediate consistency required</li>
              <li>Limited infrastructure resources</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ backgroundColor: '#ecf0f1', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>🚀 Next Steps for Production</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div>
            <h4 style={{ color: '#8e44ad', margin: '0 0 10px 0' }}>Infrastructure:</h4>
            <ul style={{ fontSize: '14px', margin: 0 }}>
              <li>Add Dependency Injection</li>
              <li>Implement Message Bus</li>
              <li>Add Persistence Layers</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#8e44ad', margin: '0 0 10px 0' }}>Quality:</h4>
            <ul style={{ fontSize: '14px', margin: 0 }}>
              <li>Error Handling & Retry Logic</li>
              <li>Monitoring & Logging</li>
              <li>Comprehensive Unit Tests</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#8e44ad', margin: '0 0 10px 0' }}>Frameworks:</h4>
            <ul style={{ fontSize: '14px', margin: 0 }}>
              <li>Consider MediatR for .NET</li>
              <li>Event Store databases</li>
              <li>Message queues (RabbitMQ, etc.)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CQRSPattern;
