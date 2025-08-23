# Object-Oriented Analysis and Design (OOAD) - Deep Dive

> **Audience**: Software architects, senior developers, and system designers
> **Prerequisites**: Programming fundamentals, basic understanding of software engineering principles
> **Objectives**: Master OOAD principles, design patterns, and architectural decision-making for scalable systems

---

## Table of Contents

1. [Foundations of Object-Oriented Thinking](#foundations)
2. [Object-Oriented Analysis (OOA)](#analysis)
3. [Object-Oriented Design (OOD)](#design)
4. [SOLID Principles Deep Dive](#solid)
5. [Design Patterns Catalog](#patterns)
6. [Architectural Patterns](#architecture)
7. [Domain-Driven Design Integration](#ddd)
8. [Modern OOAD with Microservices](#microservices)
9. [Anti-Patterns and Code Smells](#antipatterns)
10. [Practical Implementation Strategies](#implementation)

---

## 1. Foundations of Object-Oriented Thinking {#foundations}

### Core Concepts

#### **Abstraction**
```csharp
// Poor abstraction - exposes implementation details
public class BankAccount
{
    public decimal[] transactions;
    public int transactionCount;
    
    public void AddMoney(decimal amount)
    {
        transactions[transactionCount] = amount;
        transactionCount++;
    }
}

// Good abstraction - hides implementation, focuses on behavior
public class BankAccount
{
    private readonly List<Transaction> _transactions;
    
    public decimal Balance => _transactions.Sum(t => t.Amount);
    
    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be positive");
        _transactions.Add(new Transaction(amount, TransactionType.Deposit));
    }
    
    public void Withdraw(decimal amount)
    {
        if (amount > Balance) throw new InsufficientFundsException();
        _transactions.Add(new Transaction(-amount, TransactionType.Withdrawal));
    }
}
```

#### **Encapsulation**
```csharp
public class Employee
{
    private decimal _salary;
    private readonly List<string> _permissions;
    
    // Controlled access to sensitive data
    public decimal Salary 
    { 
        get => _salary;
        private set => _salary = value > 0 ? value : throw new ArgumentException();
    }
    
    // Behavior-driven interface
    public bool CanAccess(string resource)
    {
        return _permissions.Contains(resource) || HasAdminRights();
    }
    
    private bool HasAdminRights() => _permissions.Contains("ADMIN");
}
```

#### **Inheritance vs Composition**
```csharp
// Inheritance - "IS-A" relationship
public abstract class Vehicle
{
    public abstract void Start();
    public virtual void Stop() { /* default implementation */ }
}

public class Car : Vehicle
{
    public override void Start() => StartEngine();
    private void StartEngine() { /* car-specific logic */ }
}

// Composition - "HAS-A" relationship (preferred)
public class Car
{
    private readonly Engine _engine;
    private readonly Transmission _transmission;
    
    public Car(Engine engine, Transmission transmission)
    {
        _engine = engine;
        _transmission = transmission;
    }
    
    public void Start() => _engine.Start();
    public void ShiftGear(int gear) => _transmission.ShiftTo(gear);
}
```

#### **Polymorphism**
```csharp
// Interface-based polymorphism
public interface IPaymentProcessor
{
    PaymentResult Process(PaymentRequest request);
}

public class CreditCardProcessor : IPaymentProcessor
{
    public PaymentResult Process(PaymentRequest request)
    {
        // Credit card specific logic
        return new PaymentResult { Success = true };
    }
}

public class PayPalProcessor : IPaymentProcessor
{
    public PaymentResult Process(PaymentRequest request)
    {
        // PayPal specific logic
        return new PaymentResult { Success = true };
    }
}

// Client code - polymorphic behavior
public class PaymentService
{
    public void ProcessPayment(PaymentRequest request, IPaymentProcessor processor)
    {
        var result = processor.Process(request); // Polymorphic call
        // Handle result...
    }
}
```

---

## 2. Object-Oriented Analysis (OOA) {#analysis}

### Requirements Analysis Framework

#### **Use Case Modeling**
```
Use Case: Process Customer Order

Primary Actor: Customer
Preconditions: Customer is authenticated
Main Success Scenario:
1. Customer selects products
2. System calculates total price
3. Customer provides payment information
4. System validates payment
5. System creates order
6. System sends confirmation

Extensions:
4a. Payment validation fails
    4a1. System displays error message
    4a2. Return to step 3

Alternative Flows:
2a. Discount code applied
    2a1. System validates discount code
    2a2. System recalculates price
```

#### **Domain Model Identification**
```csharp
// Identified from use case analysis
public class Customer
{
    public CustomerId Id { get; }
    public string Name { get; }
    public Email Email { get; }
    public Address ShippingAddress { get; }
    
    public Order PlaceOrder(IEnumerable<OrderItem> items, PaymentMethod payment)
    {
        // Domain logic here
    }
}

public class Order
{
    public OrderId Id { get; }
    public CustomerId CustomerId { get; }
    public DateTime OrderDate { get; }
    public OrderStatus Status { get; private set; }
    public IReadOnlyList<OrderItem> Items { get; }
    
    public void ConfirmPayment() => Status = OrderStatus.Confirmed;
    public void Ship() => Status = OrderStatus.Shipped;
}

public class Product
{
    public ProductId Id { get; }
    public string Name { get; }
    public Money Price { get; }
    public int StockQuantity { get; private set; }
    
    public void ReserveStock(int quantity)
    {
        if (quantity > StockQuantity)
            throw new InsufficientStockException();
        StockQuantity -= quantity;
    }
}
```

### **CRC Cards (Class-Responsibility-Collaborator)**
```
Class: Order
Responsibilities:
- Track order items
- Calculate total price
- Manage order status
- Validate order constraints

Collaborators:
- Customer (who placed the order)
- OrderItem (what was ordered)
- PaymentService (for payment processing)
- InventoryService (for stock validation)
```

### **Conceptual Class Diagrams**
```mermaid
classDiagram
    class Customer {
        +CustomerId id
        +String name
        +Email email
        +placeOrder(items, payment) Order
    }
    
    class Order {
        +OrderId id
        +DateTime orderDate
        +OrderStatus status
        +calculateTotal() Money
        +confirmPayment()
    }
    
    class OrderItem {
        +ProductId productId
        +int quantity
        +Money unitPrice
    }
    
    class Product {
        +ProductId id
        +String name
        +Money price
        +int stockQuantity
    }
    
    Customer ||--o{ Order : places
    Order ||--o{ OrderItem : contains
    OrderItem }o--|| Product : references
```

---

## 3. Object-Oriented Design (OOD) {#design}

### Design Principles

#### **High Cohesion, Low Coupling**
```csharp
// Low cohesion - class does too many unrelated things
public class OrderManager
{
    public void CreateOrder(OrderRequest request) { }
    public void SendEmail(string email, string message) { }
    public void LogActivity(string activity) { }
    public void ValidatePayment(PaymentInfo payment) { }
    public void UpdateInventory(ProductId id, int quantity) { }
}

// High cohesion - focused responsibility
public class OrderService
{
    private readonly IPaymentValidator _paymentValidator;
    private readonly IInventoryService _inventoryService;
    private readonly INotificationService _notificationService;
    
    public Order CreateOrder(OrderRequest request)
    {
        // Orchestrates order creation using collaborators
        _paymentValidator.Validate(request.Payment);
        _inventoryService.ReserveItems(request.Items);
        
        var order = new Order(request);
        _notificationService.SendOrderConfirmation(order);
        
        return order;
    }
}
```

#### **Dependency Inversion**
```csharp
// Violates DIP - depends on concrete implementation
public class OrderService
{
    private readonly SqlOrderRepository _repository;
    private readonly SmtpEmailService _emailService;
    
    public OrderService()
    {
        _repository = new SqlOrderRepository();
        _emailService = new SmtpEmailService();
    }
}

// Follows DIP - depends on abstractions
public class OrderService
{
    private readonly IOrderRepository _repository;
    private readonly IEmailService _emailService;
    
    public OrderService(IOrderRepository repository, IEmailService emailService)
    {
        _repository = repository;
        _emailService = emailService;
    }
}
```

### **Design by Contract**
```csharp
public class BankAccount
{
    private decimal _balance;
    
    public void Withdraw(decimal amount)
    {
        // Preconditions
        if (amount <= 0)
            throw new ArgumentException("Amount must be positive");
        if (amount > _balance)
            throw new InsufficientFundsException("Insufficient balance");
        
        var oldBalance = _balance;
        _balance -= amount;
        
        // Postconditions
        Debug.Assert(_balance == oldBalance - amount);
        Debug.Assert(_balance >= 0);
    }
    
    // Class invariant: balance should never be negative
    private void CheckInvariant()
    {
        Debug.Assert(_balance >= 0, "Balance cannot be negative");
    }
}
```

---

## 4. SOLID Principles Deep Dive {#solid}

### **Single Responsibility Principle (SRP)**
```csharp
// Violates SRP - multiple reasons to change
public class Employee
{
    public string Name { get; set; }
    public decimal Salary { get; set; }
    
    public void Save() { /* database logic */ }
    public void SendEmail() { /* email logic */ }
    public decimal CalculateTax() { /* tax logic */ }
    public string GenerateReport() { /* reporting logic */ }
}

// Follows SRP - single responsibility per class
public class Employee
{
    public string Name { get; }
    public decimal Salary { get; }
    
    public decimal CalculateGrossPay(PayPeriod period)
    {
        // Only employee-specific business logic
        return Salary * period.Months;
    }
}

public class EmployeeRepository
{
    public void Save(Employee employee) { /* persistence logic */ }
    public Employee GetById(int id) { /* retrieval logic */ }
}

public class EmployeeNotificationService
{
    public void SendWelcomeEmail(Employee employee) { /* email logic */ }
}

public class TaxCalculator
{
    public decimal CalculateTax(Employee employee) { /* tax logic */ }
}
```

### **Open/Closed Principle (OCP)**
```csharp
// Violates OCP - modification required for new shapes
public class AreaCalculator
{
    public double CalculateArea(object shape)
    {
        if (shape is Rectangle rect)
            return rect.Width * rect.Height;
        else if (shape is Circle circle)
            return Math.PI * circle.Radius * circle.Radius;
        // Need to modify this method for new shapes
        else
            throw new ArgumentException("Unknown shape");
    }
}

// Follows OCP - extensible without modification
public abstract class Shape
{
    public abstract double CalculateArea();
}

public class Rectangle : Shape
{
    public double Width { get; }
    public double Height { get; }
    
    public override double CalculateArea() => Width * Height;
}

public class Circle : Shape
{
    public double Radius { get; }
    
    public override double CalculateArea() => Math.PI * Radius * Radius;
}

public class Triangle : Shape // New shape - no modification needed
{
    public double Base { get; }
    public double Height { get; }
    
    public override double CalculateArea() => 0.5 * Base * Height;
}

public class AreaCalculator
{
    public double CalculateArea(Shape shape) => shape.CalculateArea();
}
```

### **Liskov Substitution Principle (LSP)**
```csharp
// Violates LSP - derived class changes expected behavior
public class Bird
{
    public virtual void Fly() { /* flying logic */ }
}

public class Penguin : Bird
{
    public override void Fly()
    {
        throw new NotSupportedException("Penguins cannot fly");
    }
}

// Follows LSP - proper abstraction
public abstract class Bird
{
    public abstract void Move();
}

public class FlyingBird : Bird
{
    public override void Move() => Fly();
    protected virtual void Fly() { /* flying logic */ }
}

public class FlightlessBird : Bird
{
    public override void Move() => Walk();
    protected virtual void Walk() { /* walking logic */ }
}

public class Eagle : FlyingBird
{
    protected override void Fly() { /* eagle-specific flying */ }
}

public class Penguin : FlightlessBird
{
    protected override void Walk() { /* penguin-specific walking */ }
}
```

### **Interface Segregation Principle (ISP)**
```csharp
// Violates ISP - fat interface
public interface IWorker
{
    void Work();
    void Eat();
    void Sleep();
}

public class Robot : IWorker
{
    public void Work() { /* robot work */ }
    public void Eat() { throw new NotImplementedException(); } // Forced to implement
    public void Sleep() { throw new NotImplementedException(); } // Forced to implement
}

// Follows ISP - segregated interfaces
public interface IWorkable
{
    void Work();
}

public interface IFeedable
{
    void Eat();
}

public interface IRestable
{
    void Sleep();
}

public class Human : IWorkable, IFeedable, IRestable
{
    public void Work() { /* human work */ }
    public void Eat() { /* human eating */ }
    public void Sleep() { /* human sleeping */ }
}

public class Robot : IWorkable
{
    public void Work() { /* robot work */ }
    // Only implements what makes sense
}
```

### **Dependency Inversion Principle (DIP)**
```csharp
// Violates DIP - high-level depends on low-level
public class OrderService
{
    private readonly SqlDatabase _database;
    private readonly EmailSender _emailSender;
    
    public OrderService()
    {
        _database = new SqlDatabase();
        _emailSender = new EmailSender();
    }
}

// Follows DIP - depend on abstractions
public interface IOrderRepository
{
    void Save(Order order);
    Order GetById(OrderId id);
}

public interface INotificationService
{
    void SendOrderConfirmation(Order order);
}

public class OrderService
{
    private readonly IOrderRepository _repository;
    private readonly INotificationService _notificationService;
    
    public OrderService(IOrderRepository repository, INotificationService notificationService)
    {
        _repository = repository;
        _notificationService = notificationService;
    }
    
    public void ProcessOrder(Order order)
    {
        _repository.Save(order);
        _notificationService.SendOrderConfirmation(order);
    }
}
```

---

## 5. Design Patterns Catalog {#patterns}

### **Creational Patterns**

#### **Factory Method**
```csharp
public abstract class PaymentProcessorFactory
{
    public abstract IPaymentProcessor CreateProcessor();
    
    public PaymentResult ProcessPayment(PaymentRequest request)
    {
        var processor = CreateProcessor();
        return processor.Process(request);
    }
}

public class CreditCardProcessorFactory : PaymentProcessorFactory
{
    public override IPaymentProcessor CreateProcessor()
    {
        return new CreditCardProcessor();
    }
}

public class PayPalProcessorFactory : PaymentProcessorFactory
{
    public override IPaymentProcessor CreateProcessor()
    {
        return new PayPalProcessor();
    }
}
```

#### **Builder Pattern**
```csharp
public class OrderBuilder
{
    private readonly List<OrderItem> _items = new();
    private Customer _customer;
    private Address _shippingAddress;
    private PaymentMethod _paymentMethod;
    
    public OrderBuilder ForCustomer(Customer customer)
    {
        _customer = customer;
        return this;
    }
    
    public OrderBuilder AddItem(Product product, int quantity)
    {
        _items.Add(new OrderItem(product.Id, quantity, product.Price));
        return this;
    }
    
    public OrderBuilder ShipTo(Address address)
    {
        _shippingAddress = address;
        return this;
    }
    
    public OrderBuilder PayWith(PaymentMethod method)
    {
        _paymentMethod = method;
        return this;
    }
    
    public Order Build()
    {
        if (_customer == null) throw new InvalidOperationException("Customer required");
        if (!_items.Any()) throw new InvalidOperationException("At least one item required");
        
        return new Order(_customer.Id, _items, _shippingAddress, _paymentMethod);
    }
}

// Usage
var order = new OrderBuilder()
    .ForCustomer(customer)
    .AddItem(product1, 2)
    .AddItem(product2, 1)
    .ShipTo(shippingAddress)
    .PayWith(creditCard)
    .Build();
```

#### **Singleton Pattern (Thread-Safe)**
```csharp
public sealed class ConfigurationManager
{
    private static readonly Lazy<ConfigurationManager> _instance = 
        new(() => new ConfigurationManager());
    
    private readonly Dictionary<string, string> _settings;
    
    private ConfigurationManager()
    {
        _settings = LoadConfiguration();
    }
    
    public static ConfigurationManager Instance => _instance.Value;
    
    public string GetSetting(string key)
    {
        return _settings.TryGetValue(key, out var value) ? value : null;
    }
    
    private Dictionary<string, string> LoadConfiguration()
    {
        // Load from file, database, etc.
        return new Dictionary<string, string>();
    }
}
```

### **Structural Patterns**

#### **Adapter Pattern**
```csharp
// Third-party library with incompatible interface
public class LegacyPaymentGateway
{
    public bool ProcessTransaction(string cardNumber, decimal amount, string currency)
    {
        // Legacy implementation
        return true;
    }
}

// Our standard interface
public interface IPaymentProcessor
{
    PaymentResult Process(PaymentRequest request);
}

// Adapter to make legacy gateway compatible
public class LegacyPaymentAdapter : IPaymentProcessor
{
    private readonly LegacyPaymentGateway _legacyGateway;
    
    public LegacyPaymentAdapter(LegacyPaymentGateway legacyGateway)
    {
        _legacyGateway = legacyGateway;
    }
    
    public PaymentResult Process(PaymentRequest request)
    {
        var success = _legacyGateway.ProcessTransaction(
            request.CardNumber, 
            request.Amount, 
            request.Currency);
            
        return new PaymentResult { Success = success };
    }
}
```

#### **Decorator Pattern**
```csharp
public interface INotificationService
{
    void Send(string message, string recipient);
}

public class EmailNotificationService : INotificationService
{
    public void Send(string message, string recipient)
    {
        // Send email
        Console.WriteLine($"Email sent to {recipient}: {message}");
    }
}

// Decorators
public class EncryptedNotificationDecorator : INotificationService
{
    private readonly INotificationService _inner;
    
    public EncryptedNotificationDecorator(INotificationService inner)
    {
        _inner = inner;
    }
    
    public void Send(string message, string recipient)
    {
        var encryptedMessage = Encrypt(message);
        _inner.Send(encryptedMessage, recipient);
    }
    
    private string Encrypt(string message) => $"[ENCRYPTED]{message}[/ENCRYPTED]";
}

public class LoggingNotificationDecorator : INotificationService
{
    private readonly INotificationService _inner;
    private readonly ILogger _logger;
    
    public LoggingNotificationDecorator(INotificationService inner, ILogger logger)
    {
        _inner = inner;
        _logger = logger;
    }
    
    public void Send(string message, string recipient)
    {
        _logger.LogInformation($"Sending notification to {recipient}");
        _inner.Send(message, recipient);
        _logger.LogInformation("Notification sent successfully");
    }
}

// Usage - chain decorators
var notificationService = new LoggingNotificationDecorator(
    new EncryptedNotificationDecorator(
        new EmailNotificationService()),
    logger);
```

### **Behavioral Patterns**

#### **Strategy Pattern**
```csharp
public interface IPricingStrategy
{
    decimal CalculatePrice(Order order);
}

public class RegularPricingStrategy : IPricingStrategy
{
    public decimal CalculatePrice(Order order)
    {
        return order.Items.Sum(item => item.Quantity * item.UnitPrice);
    }
}

public class VipPricingStrategy : IPricingStrategy
{
    public decimal CalculatePrice(Order order)
    {
        var total = order.Items.Sum(item => item.Quantity * item.UnitPrice);
        return total * 0.9m; // 10% discount
    }
}

public class BulkPricingStrategy : IPricingStrategy
{
    public decimal CalculatePrice(Order order)
    {
        var total = order.Items.Sum(item => item.Quantity * item.UnitPrice);
        return total > 1000 ? total * 0.85m : total; // 15% discount for bulk orders
    }
}

public class PricingContext
{
    private IPricingStrategy _strategy;
    
    public void SetStrategy(IPricingStrategy strategy)
    {
        _strategy = strategy;
    }
    
    public decimal CalculatePrice(Order order)
    {
        return _strategy.CalculatePrice(order);
    }
}
```

#### **Observer Pattern**
```csharp
public interface IOrderObserver
{
    void OnOrderCreated(Order order);
    void OnOrderShipped(Order order);
    void OnOrderCancelled(Order order);
}

public class Order
{
    private readonly List<IOrderObserver> _observers = new();
    
    public OrderId Id { get; }
    public OrderStatus Status { get; private set; }
    
    public void AddObserver(IOrderObserver observer)
    {
        _observers.Add(observer);
    }
    
    public void RemoveObserver(IOrderObserver observer)
    {
        _observers.Remove(observer);
    }
    
    public void Ship()
    {
        Status = OrderStatus.Shipped;
        NotifyObservers(o => o.OnOrderShipped(this));
    }
    
    public void Cancel()
    {
        Status = OrderStatus.Cancelled;
        NotifyObservers(o => o.OnOrderCancelled(this));
    }
    
    private void NotifyObservers(Action<IOrderObserver> action)
    {
        foreach (var observer in _observers)
        {
            action(observer);
        }
    }
}

public class EmailNotificationObserver : IOrderObserver
{
    public void OnOrderCreated(Order order)
    {
        // Send order confirmation email
    }
    
    public void OnOrderShipped(Order order)
    {
        // Send shipping notification email
    }
    
    public void OnOrderCancelled(Order order)
    {
        // Send cancellation email
    }
}

public class InventoryObserver : IOrderObserver
{
    public void OnOrderCreated(Order order)
    {
        // Reserve inventory
    }
    
    public void OnOrderShipped(Order order)
    {
        // Update inventory levels
    }
    
    public void OnOrderCancelled(Order order)
    {
        // Release reserved inventory
    }
}
```

#### **Command Pattern**
```csharp
public interface ICommand
{
    void Execute();
    void Undo();
}

public class CreateOrderCommand : ICommand
{
    private readonly IOrderRepository _repository;
    private readonly Order _order;
    private bool _executed;
    
    public CreateOrderCommand(IOrderRepository repository, Order order)
    {
        _repository = repository;
        _order = order;
    }
    
    public void Execute()
    {
        if (!_executed)
        {
            _repository.Save(_order);
            _executed = true;
        }
    }
    
    public void Undo()
    {
        if (_executed)
        {
            _repository.Delete(_order.Id);
            _executed = false;
        }
    }
}

public class CommandInvoker
{
    private readonly Stack<ICommand> _commandHistory = new();
    
    public void ExecuteCommand(ICommand command)
    {
        command.Execute();
        _commandHistory.Push(command);
    }
    
    public void UndoLastCommand()
    {
        if (_commandHistory.Count > 0)
        {
            var command = _commandHistory.Pop();
            command.Undo();
        }
    }
}
```

---

## 6. Architectural Patterns {#architecture}

### **Layered Architecture**
```csharp
// Presentation Layer
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var command = new CreateOrderCommand(request.CustomerId, request.Items);
        var result = await _orderService.CreateOrderAsync(command);
        return Ok(result);
    }
}

// Application Layer
public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;
    private readonly IDomainEventDispatcher _eventDispatcher;
    
    public async Task<OrderResult> CreateOrderAsync(CreateOrderCommand command)
    {
        var order = Order.Create(command.CustomerId, command.Items);
        await _repository.SaveAsync(order);
        
        await _eventDispatcher.DispatchAsync(new OrderCreatedEvent(order.Id));
        
        return new OrderResult { OrderId = order.Id };
    }
}

// Domain Layer
public class Order : AggregateRoot
{
    public OrderId Id { get; private set; }
    public CustomerId CustomerId { get; private set; }
    public OrderStatus Status { get; private set; }
    private readonly List<OrderItem> _items = new();
    
    public static Order Create(CustomerId customerId, IEnumerable<OrderItemData> items)
    {
        var order = new Order
        {
            Id = OrderId.NewId(),
            CustomerId = customerId,
            Status = OrderStatus.Pending
        };
        
        foreach (var item in items)
        {
            order.AddItem(item.ProductId, item.Quantity, item.UnitPrice);
        }
        
        order.AddDomainEvent(new OrderCreatedEvent(order.Id));
        return order;
    }
    
    private void AddItem(ProductId productId, int quantity, decimal unitPrice)
    {
        if (quantity <= 0) throw new ArgumentException("Quantity must be positive");
        _items.Add(new OrderItem(productId, quantity, unitPrice));
    }
}

// Infrastructure Layer
public class SqlOrderRepository : IOrderRepository
{
    private readonly DbContext _context;
    
    public async Task SaveAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
    }
}
```

### **Hexagonal Architecture (Ports and Adapters)**
```csharp
// Domain (Core)
public interface IOrderRepository // Port
{
    Task<Order> GetByIdAsync(OrderId id);
    Task SaveAsync(Order order);
}

public interface IPaymentGateway // Port
{
    Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request);
}

public class OrderService // Core business logic
{
    private readonly IOrderRepository _orderRepository;
    private readonly IPaymentGateway _paymentGateway;
    
    public async Task<Order> ProcessOrderAsync(CreateOrderRequest request)
    {
        var order = Order.Create(request);
        
        var paymentResult = await _paymentGateway.ProcessPaymentAsync(
            new PaymentRequest(order.Total, request.PaymentMethod));
            
        if (paymentResult.IsSuccessful)
        {
            order.ConfirmPayment();
            await _orderRepository.SaveAsync(order);
        }
        
        return order;
    }
}

// Infrastructure (Adapters)
public class SqlOrderRepository : IOrderRepository // Adapter
{
    // Implementation details
}

public class StripePaymentGateway : IPaymentGateway // Adapter
{
    // Stripe-specific implementation
}

public class PayPalPaymentGateway : IPaymentGateway // Adapter
{
    // PayPal-specific implementation
}

// Application (Driving Adapters)
public class OrderController // Driving adapter
{
    private readonly OrderService _orderService;
    
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var order = await _orderService.ProcessOrderAsync(request);
        return Ok(order);
    }
}
```

### **CQRS (Command Query Responsibility Segregation)**
```csharp
// Commands (Write Side)
public class CreateOrderCommand
{
    public CustomerId CustomerId { get; }
    public IEnumerable<OrderItemData> Items { get; }
    public PaymentMethod PaymentMethod { get; }
}

public class CreateOrderCommandHandler
{
    private readonly IOrderRepository _repository;
    private readonly IEventBus _eventBus;
    
    public async Task<OrderId> HandleAsync(CreateOrderCommand command)
    {
        var order = Order.Create(command.CustomerId, command.Items);
        await _repository.SaveAsync(order);
        
        await _eventBus.PublishAsync(new OrderCreatedEvent(order.Id, order.CustomerId));
        
        return order.Id;
    }
}

// Queries (Read Side)
public class OrderSummaryQuery
{
    public CustomerId CustomerId { get; }
    public DateTime? FromDate { get; }
    public DateTime? ToDate { get; }
}

public class OrderSummaryQueryHandler
{
    private readonly IOrderReadRepository _readRepository;
    
    public async Task<IEnumerable<OrderSummary>> HandleAsync(OrderSummaryQuery query)
    {
        return await _readRepository.GetOrderSummariesAsync(
            query.CustomerId, 
            query.FromDate, 
            query.ToDate);
    }
}

// Read Model (Optimized for queries)
public class OrderSummary
{
    public OrderId OrderId { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; }
    public int ItemCount { get; set; }
}

// Event Handler (Updates read model)
public class OrderCreatedEventHandler
{
    private readonly IOrderSummaryRepository _summaryRepository;
    
    public async Task HandleAsync(OrderCreatedEvent @event)
    {
        var summary = new OrderSummary
        {
            OrderId = @event.OrderId,
            OrderDate = @event.OrderDate,
            TotalAmount = @event.TotalAmount,
            Status = "Pending",
            ItemCount = @event.ItemCount
        };
        
        await _summaryRepository.SaveAsync(summary);
    }
}
```

---

## 7. Domain-Driven Design Integration {#ddd}

### **Bounded Contexts**
```csharp
// Order Management Context
namespace OrderManagement
{
    public class Customer
    {
        public CustomerId Id { get; }
        public string Name { get; }
        public CreditLimit CreditLimit { get; }
        
        public bool CanPlaceOrder(decimal orderAmount)
        {
            return CreditLimit.CanAccommodate(orderAmount);
        }
    }
    
    public class Order
    {
        public OrderId Id { get; }
        public CustomerId CustomerId { get; }
        public OrderStatus Status { get; }
        // Order-specific behavior
    }
}

// Customer Relationship Context
namespace CustomerRelationship
{
    public class Customer
    {
        public CustomerId Id { get; }
        public ContactInformation ContactInfo { get; }
        public CustomerSegment Segment { get; }
        public List<Interaction> InteractionHistory { get; }
        
        public void RecordInteraction(InteractionType type, string notes)
        {
            InteractionHistory.Add(new Interaction(type, notes, DateTime.UtcNow));
        }
    }
}

// Inventory Context
namespace Inventory
{
    public class Product
    {
        public ProductId Id { get; }
        public string SKU { get; }
        public int QuantityOnHand { get; private set; }
        public int ReorderLevel { get; }
        
        public void ReserveStock(int quantity)
        {
            if (quantity > QuantityOnHand)
                throw new InsufficientStockException();
            QuantityOnHand -= quantity;
        }
    }
}
```

### **Aggregates and Aggregate Roots**
```csharp
public abstract class AggregateRoot
{
    private readonly List<IDomainEvent> _domainEvents = new();
    
    public IReadOnlyList<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();
    
    protected void AddDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }
    
    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}

public class Order : AggregateRoot
{
    public OrderId Id { get; private set; }
    public CustomerId CustomerId { get; private set; }
    public OrderStatus Status { get; private set; }
    private readonly List<OrderItem> _items = new();
    
    // Aggregate boundary - only Order can modify OrderItems
    public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();
    
    public static Order Create(CustomerId customerId, IEnumerable<CreateOrderItemRequest> itemRequests)
    {
        var order = new Order
        {
            Id = OrderId.NewId(),
            CustomerId = customerId,
            Status = OrderStatus.Pending
        };
        
        foreach (var request in itemRequests)
        {
            order.AddItem(request.ProductId, request.Quantity, request.UnitPrice);
        }
        
        order.AddDomainEvent(new OrderCreatedEvent(order.Id, customerId));
        return order;
    }
    
    public void AddItem(ProductId productId, int quantity, decimal unitPrice)
    {
        // Business rules enforced at aggregate level
        if (Status != OrderStatus.Pending)
            throw new InvalidOperationException("Cannot modify confirmed order");
            
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive");
            
        var existingItem = _items.FirstOrDefault(i => i.ProductId == productId);
        if (existingItem != null)
        {
            existingItem.UpdateQuantity(existingItem.Quantity + quantity);
        }
        else
        {
            _items.Add(new OrderItem(productId, quantity, unitPrice));
        }
        
        AddDomainEvent(new OrderItemAddedEvent(Id, productId, quantity));
    }
    
    public void Confirm()
    {
        if (Status != OrderStatus.Pending)
            throw new InvalidOperationException("Order is not in pending status");
            
        if (!_items.Any())
            throw new InvalidOperationException("Cannot confirm order without items");
            
        Status = OrderStatus.Confirmed;
        AddDomainEvent(new OrderConfirmedEvent(Id));
    }
}

// Value Object
public class OrderItem
{
    public ProductId ProductId { get; }
    public int Quantity { get; private set; }
    public decimal UnitPrice { get; }
    public decimal TotalPrice => Quantity * UnitPrice;
    
    internal OrderItem(ProductId productId, int quantity, decimal unitPrice)
    {
        ProductId = productId;
        Quantity = quantity;
        UnitPrice = unitPrice;
    }
    
    internal void UpdateQuantity(int newQuantity)
    {
        if (newQuantity <= 0)
            throw new ArgumentException("Quantity must be positive");
        Quantity = newQuantity;
    }
}
```

### **Domain Services**
```csharp
public interface IOrderPricingService
{
    decimal CalculateOrderTotal(Order order, Customer customer);
}

public class OrderPricingService : IOrderPricingService
{
    private readonly IPricingRuleRepository _pricingRuleRepository;
    
    public decimal CalculateOrderTotal(Order order, Customer customer)
    {
        var baseTotal = order.Items.Sum(item => item.TotalPrice);
        var applicableRules = _pricingRuleRepository.GetApplicableRules(customer, order);
        
        foreach (var rule in applicableRules)
        {
            baseTotal = rule.Apply(baseTotal);
        }
        
        return baseTotal;
    }
}

// Usage in aggregate
public class Order : AggregateRoot
{
    public decimal CalculateTotal(Customer customer, IOrderPricingService pricingService)
    {
        return pricingService.CalculateOrderTotal(this, customer);
    }
}
```

### **Domain Events**
```csharp
public interface IDomainEvent
{
    DateTime OccurredOn { get; }
}

public class OrderCreatedEvent : IDomainEvent
{
    public OrderId OrderId { get; }
    public CustomerId CustomerId { get; }
    public DateTime OccurredOn { get; }
    
    public OrderCreatedEvent(OrderId orderId, CustomerId customerId)
    {
        OrderId = orderId;
        CustomerId = customerId;
        OccurredOn = DateTime.UtcNow;
    }
}

public class OrderConfirmedEvent : IDomainEvent
{
    public OrderId OrderId { get; }
    public DateTime OccurredOn { get; }
    
    public OrderConfirmedEvent(OrderId orderId)
    {
        OrderId = orderId;
        OccurredOn = DateTime.UtcNow;
    }
}

// Domain Event Handler
public class OrderConfirmedEventHandler
{
    private readonly IInventoryService _inventoryService;
    private readonly IEmailService _emailService;
    
    public async Task HandleAsync(OrderConfirmedEvent domainEvent)
    {
        // Reserve inventory
        await _inventoryService.ReserveInventoryForOrderAsync(domainEvent.OrderId);
        
        // Send confirmation email
        await _emailService.SendOrderConfirmationAsync(domainEvent.OrderId);
    }
}
```

---

## 8. Modern OOAD with Microservices {#microservices}

### **Service Decomposition Strategies**
```csharp
// Decomposition by Business Capability
namespace OrderService
{
    public class OrderController
    {
        [HttpPost("orders")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            // Order management logic
        }
        
        [HttpGet("orders/{id}")]
        public async Task<IActionResult> GetOrder(Guid id)
        {
            // Order retrieval logic
        }
    }
}

namespace PaymentService
{
    public class PaymentController
    {
        [HttpPost("payments")]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequest request)
        {
            // Payment processing logic
        }
    }
}

namespace InventoryService
{
    public class InventoryController
    {
        [HttpPost("inventory/reserve")]
        public async Task<IActionResult> ReserveInventory([FromBody] ReserveInventoryRequest request)
        {
            // Inventory reservation logic
        }
    }
}
```

### **Inter-Service Communication Patterns**
```csharp
// Synchronous Communication
public class OrderService
{
    private readonly HttpClient _paymentServiceClient;
    private readonly HttpClient _inventoryServiceClient;
    
    public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        // 1. Validate inventory
        var inventoryResponse = await _inventoryServiceClient.PostAsync(
            "/inventory/validate", 
            JsonContent.Create(request.Items));
            
        if (!inventoryResponse.IsSuccessStatusCode)
            throw new InsufficientInventoryException();
        
        // 2. Process payment
        var paymentResponse = await _paymentServiceClient.PostAsync(
            "/payments", 
            JsonContent.Create(request.Payment));
            
        if (!paymentResponse.IsSuccessStatusCode)
            throw new PaymentFailedException();
        
        // 3. Create order
        var order = Order.Create(request);
        await _orderRepository.SaveAsync(order);
        
        return order;
    }
}

// Asynchronous Communication with Events
public class OrderService
{
    private readonly IEventBus _eventBus;
    
    public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        var order = Order.Create(request);
        await _orderRepository.SaveAsync(order);
        
        // Publish event for other services to react
        await _eventBus.PublishAsync(new OrderCreatedEvent
        {
            OrderId = order.Id,
            CustomerId = order.CustomerId,
            Items = order.Items.Select(i => new OrderItemEvent
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity
            }).ToList()
        });
        
        return order;
    }
}

// Event Handlers in other services
public class InventoryEventHandler
{
    public async Task HandleAsync(OrderCreatedEvent @event)
    {
        foreach (var item in @event.Items)
        {
            await _inventoryService.ReserveStockAsync(item.ProductId, item.Quantity);
        }
    }
}

public class PaymentEventHandler
{
    public async Task HandleAsync(OrderCreatedEvent @event)
    {
        await _paymentService.CreatePaymentRequestAsync(@event.OrderId);
    }
}
```

### **Saga Pattern for Distributed Transactions**
```csharp
public class OrderSaga
{
    private readonly IOrderService _orderService;
    private readonly IPaymentService _paymentService;
    private readonly IInventoryService _inventoryService;
    private readonly IEventBus _eventBus;
    
    public async Task HandleAsync(CreateOrderCommand command)
    {
        var sagaId = Guid.NewGuid();
        
        try
        {
            // Step 1: Reserve inventory
            await _inventoryService.ReserveInventoryAsync(new ReserveInventoryCommand
            {
                SagaId = sagaId,
                Items = command.Items
            });
            
            // Step 2: Process payment
            await _paymentService.ProcessPaymentAsync(new ProcessPaymentCommand
            {
                SagaId = sagaId,
                Amount = command.TotalAmount,
                PaymentMethod = command.PaymentMethod
            });
            
            // Step 3: Create order
            await _orderService.CreateOrderAsync(new CreateOrderCommand
            {
                SagaId = sagaId,
                CustomerId = command.CustomerId,
                Items = command.Items
            });
            
            // Success - publish completion event
            await _eventBus.PublishAsync(new OrderSagaCompletedEvent(sagaId));
        }
        catch (Exception ex)
        {
            // Failure - start compensation
            await _eventBus.PublishAsync(new OrderSagaFailedEvent(sagaId, ex.Message));
        }
    }
    
    public async Task HandleAsync(OrderSagaFailedEvent @event)
    {
        // Compensating actions
        await _inventoryService.ReleaseReservationAsync(@event.SagaId);
        await _paymentService.RefundPaymentAsync(@event.SagaId);
        await _orderService.CancelOrderAsync(@event.SagaId);
    }
}
```

---

## 9. Anti-Patterns and Code Smells {#antipatterns}

### **God Object Anti-Pattern**
```csharp
// Anti-pattern: God Object
public class OrderManager
{
    // Too many responsibilities
    public void CreateOrder(OrderRequest request) { }
    public void ProcessPayment(PaymentInfo payment) { }
    public void UpdateInventory(ProductId id, int quantity) { }
    public void SendEmail(string email, string message) { }
    public void GenerateInvoice(OrderId orderId) { }
    public void CalculateTax(decimal amount) { }
    public void ValidateCustomer(CustomerId id) { }
    public void LogActivity(string activity) { }
    public void BackupData() { }
    public void GenerateReports() { }
}

// Solution: Decompose into focused classes
public class OrderService
{
    private readonly IPaymentService _paymentService;
    private readonly IInventoryService _inventoryService;
    private readonly INotificationService _notificationService;
    
    public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        // Orchestrate order creation using specialized services
        var order = Order.Create(request);
        
        await _paymentService.ProcessPaymentAsync(request.Payment);
        await _inventoryService.ReserveItemsAsync(request.Items);
        await _notificationService.SendOrderConfirmationAsync(order);
        
        return order;
    }
}
```

### **Anemic Domain Model**
```csharp
// Anti-pattern: Anemic Domain Model
public class Order
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; }
    public List<OrderItem> Items { get; set; }
}

public class OrderService
{
    public void ProcessOrder(Order order)
    {
        // All business logic in service layer
        if (order.Items == null || !order.Items.Any())
            throw new InvalidOperationException("Order must have items");
            
        order.TotalAmount = order.Items.Sum(i => i.Quantity * i.UnitPrice);
        order.Status = "Confirmed";
        order.OrderDate = DateTime.UtcNow;
    }
}

// Solution: Rich Domain Model
public class Order
{
    public OrderId Id { get; private set; }
    public CustomerId CustomerId { get; private set; }
    public DateTime OrderDate { get; private set; }
    public OrderStatus Status { get; private set; }
    private readonly List<OrderItem> _items = new();
    
    public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();
    public decimal TotalAmount => _items.Sum(i => i.TotalPrice);
    
    public static Order Create(CustomerId customerId, IEnumerable<OrderItemRequest> itemRequests)
    {
        var order = new Order
        {
            Id = OrderId.NewId(),
            CustomerId = customerId,
            OrderDate = DateTime.UtcNow,
            Status = OrderStatus.Pending
        };
        
        foreach (var request in itemRequests)
        {
            order.AddItem(request.ProductId, request.Quantity, request.UnitPrice);
        }
        
        return order;
    }
    
    public void AddItem(ProductId productId, int quantity, decimal unitPrice)
    {
        if (Status != OrderStatus.Pending)
            throw new InvalidOperationException("Cannot modify confirmed order");
            
        _items.Add(new OrderItem(productId, quantity, unitPrice));
    }
    
    public void Confirm()
    {
        if (!_items.Any())
            throw new InvalidOperationException("Cannot confirm order without items");
            
        Status = OrderStatus.Confirmed;
    }
}
```

### **Feature Envy**
```csharp
// Anti-pattern: Feature Envy
public class OrderCalculator
{
    public decimal CalculateTotal(Order order)
    {
        decimal total = 0;
        foreach (var item in order.Items)
        {
            // Accessing too much data from another object
            total += item.Quantity * item.UnitPrice;
            
            if (item.Product.Category == "Electronics")
                total += item.Quantity * item.UnitPrice * 0.1m; // Tax
                
            if (item.Product.Weight > 10)
                total += 5; // Shipping fee
        }
        return total;
    }
}

// Solution: Move behavior to appropriate class
public class OrderItem
{
    public ProductId ProductId { get; }
    public int Quantity { get; }
    public decimal UnitPrice { get; }
    public Product Product { get; }
    
    public decimal CalculateSubtotal()
    {
        return Quantity * UnitPrice;
    }
    
    public decimal CalculateTax()
    {
        return Product.Category == "Electronics" ? CalculateSubtotal() * 0.1m : 0;
    }
    
    public decimal CalculateShipping()
    {
        return Product.Weight > 10 ? 5 : 0;
    }
    
    public decimal CalculateTotal()
    {
        return CalculateSubtotal() + CalculateTax() + CalculateShipping();
    }
}

public class Order
{
    public decimal CalculateTotal()
    {
        return Items.Sum(item => item.CalculateTotal());
    }
}
```

### **Primitive Obsession**
```csharp
// Anti-pattern: Primitive Obsession
public class Customer
{
    public string Email { get; set; } // Should be Email value object
    public string PhoneNumber { get; set; } // Should be PhoneNumber value object
    public decimal CreditLimit { get; set; } // Should be Money value object
}

public class OrderService
{
    public void CreateOrder(string customerId, string customerEmail, decimal amount)
    {
        // Validation scattered throughout codebase
        if (string.IsNullOrEmpty(customerEmail) || !customerEmail.Contains("@"))
            throw new ArgumentException("Invalid email");
            
        if (amount <= 0)
            throw new ArgumentException("Amount must be positive");
    }
}

// Solution: Value Objects
public class Email
{
    public string Value { get; }
    
    public Email(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Email cannot be empty");
            
        if (!IsValidEmail(value))
            throw new ArgumentException("Invalid email format");
            
        Value = value;
    }
    
    private static bool IsValidEmail(string email)
    {
        return email.Contains("@") && email.Contains(".");
    }
    
    public override string ToString() => Value;
}

public class Money
{
    public decimal Amount { get; }
    public string Currency { get; }
    
    public Money(decimal amount, string currency = "USD")
    {
        if (amount < 0)
            throw new ArgumentException("Amount cannot be negative");
            
        Amount = amount;
        Currency = currency;
    }
    
    public Money Add(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException("Cannot add different currencies");
            
        return new Money(Amount + other.Amount, Currency);
    }
}

public class Customer
{
    public CustomerId Id { get; }
    public Email Email { get; }
    public PhoneNumber PhoneNumber { get; }
    public Money CreditLimit { get; }
}
```

---

## 10. Practical Implementation Strategies {#implementation}

### **Refactoring Legacy Code to OOAD**
```csharp
// Legacy procedural code
public class LegacyOrderProcessor
{
    public void ProcessOrder(DataRow orderData, DataTable itemsData)
    {
        // Procedural approach with data structures
        var customerId = (int)orderData["CustomerId"];
        var orderDate = (DateTime)orderData["OrderDate"];
        
        decimal total = 0;
        foreach (DataRow item in itemsData.Rows)
        {
            var quantity = (int)item["Quantity"];
            var price = (decimal)item["Price"];
            total += quantity * price;
        }
        
        // Direct database access
        using var connection = new SqlConnection(connectionString);
        var command = new SqlCommand(
            "INSERT INTO Orders (CustomerId, OrderDate, Total) VALUES (@customerId, @orderDate, @total)",
            connection);
        // ... parameter setup and execution
    }
}

// Step 1: Extract domain objects
public class Order
{
    public int CustomerId { get; set; }
    public DateTime OrderDate { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    
    public decimal CalculateTotal()
    {
        return Items.Sum(item => item.Quantity * item.Price);
    }
}

public class OrderItem
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}

// Step 2: Extract repository
public interface IOrderRepository
{
    Task SaveAsync(Order order);
}

public class SqlOrderRepository : IOrderRepository
{
    private readonly string _connectionString;
    
    public async Task SaveAsync(Order order)
    {
        // Database logic isolated
    }
}

// Step 3: Create service layer
public class OrderService
{
    private readonly IOrderRepository _repository;
    
    public async Task ProcessOrderAsync(Order order)
    {
        // Business logic
        order.OrderDate = DateTime.UtcNow;
        var total = order.CalculateTotal();
        
        await _repository.SaveAsync(order);
    }
}

// Step 4: Refine domain model
public class Order
{
    public OrderId Id { get; private set; }
    public CustomerId CustomerId { get; private set; }
    public DateTime OrderDate { get; private set; }
    private readonly List<OrderItem> _items = new();
    
    public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();
    public Money Total => new Money(_items.Sum(item => item.CalculateTotal()));
    
    public static Order Create(CustomerId customerId, IEnumerable<OrderItemData> items)
    {
        var order = new Order
        {
            Id = OrderId.NewId(),
            CustomerId = customerId,
            OrderDate = DateTime.UtcNow
        };
        
        foreach (var item in items)
        {
            order.AddItem(item.ProductId, item.Quantity, item.UnitPrice);
        }
        
        return order;
    }
    
    private void AddItem(ProductId productId, int quantity, Money unitPrice)
    {
        _items.Add(new OrderItem(productId, quantity, unitPrice));
    }
}
```

### **Testing Strategies for OOAD**
```csharp
// Unit Testing Domain Objects
[Test]
public void Order_Create_ShouldCalculateCorrectTotal()
{
    // Arrange
    var customerId = new CustomerId(Guid.NewGuid());
    var items = new[]
    {
        new OrderItemData(new ProductId(1), 2, new Money(10.00m)),
        new OrderItemData(new ProductId(2), 1, new Money(15.00m))
    };
    
    // Act
    var order = Order.Create(customerId, items);
    
    // Assert
    Assert.That(order.Total.Amount, Is.EqualTo(35.00m));
    Assert.That(order.Items.Count, Is.EqualTo(2));
}

[Test]
public void Order_AddItem_WhenOrderConfirmed_ShouldThrowException()
{
    // Arrange
    var order = Order.Create(new CustomerId(Guid.NewGuid()), new OrderItemData[0]);
    order.Confirm();
    
    // Act & Assert
    Assert.Throws<InvalidOperationException>(() => 
        order.AddItem(new ProductId(1), 1, new Money(10.00m)));
}

// Integration Testing with Test Doubles
[Test]
public async Task OrderService_CreateOrder_ShouldSaveOrderAndPublishEvent()
{
    // Arrange
    var mockRepository = new Mock<IOrderRepository>();
    var mockEventBus = new Mock<IEventBus>();
    var service = new OrderService(mockRepository.Object, mockEventBus.Object);
    
    var request = new CreateOrderRequest
    {
        CustomerId = new CustomerId(Guid.NewGuid()),
        Items = new[] { new OrderItemData(new ProductId(1), 2, new Money(10.00m)) }
    };
    
    // Act
    var order = await service.CreateOrderAsync(request);
    
    // Assert
    mockRepository.Verify(r => r.SaveAsync(It.IsAny<Order>()), Times.Once);
    mockEventBus.Verify(e => e.PublishAsync(It.IsAny<OrderCreatedEvent>()), Times.Once);
    Assert.That(order.Total.Amount, Is.EqualTo(20.00m));
}

// Behavior-Driven Testing
[Test]
public void Given_CustomerWithInsufficientCredit_When_PlacingLargeOrder_Then_ShouldRejectOrder()
{
    // Given
    var customer = new Customer(
        new CustomerId(Guid.NewGuid()),
        "John Doe",
        new Money(100.00m)); // Credit limit
    
    var orderItems = new[]
    {
        new OrderItemData(new ProductId(1), 10, new Money(15.00m)) // Total: $150
    };
    
    // When & Then
    Assert.Throws<InsufficientCreditException>(() => 
        customer.PlaceOrder(orderItems));
}
```

### **Performance Considerations**
```csharp
// Lazy Loading for Large Object Graphs
public class Order
{
    private List<OrderItem> _items;
    private readonly Lazy<IEnumerable<OrderItem>> _lazyItems;
    
    public Order()
    {
        _lazyItems = new Lazy<IEnumerable<OrderItem>>(() => LoadItems());
    }
    
    public IEnumerable<OrderItem> Items => _lazyItems.Value;
    
    private IEnumerable<OrderItem> LoadItems()
    {
        // Load items from repository only when needed
        return _itemRepository.GetByOrderId(Id);
    }
}

// Caching Expensive Operations
public class PricingService
{
    private readonly IMemoryCache _cache;
    private readonly IPricingRuleRepository _repository;
    
    public async Task<decimal> CalculatePriceAsync(ProductId productId, CustomerId customerId)
    {
        var cacheKey = $"price_{productId}_{customerId}";
        
        if (_cache.TryGetValue(cacheKey, out decimal cachedPrice))
        {
            return cachedPrice;
        }
        
        var price = await CalculatePriceInternal(productId, customerId);
        
        _cache.Set(cacheKey, price, TimeSpan.FromMinutes(15));
        
        return price;
    }
}

// Bulk Operations for Performance
public class OrderRepository
{
    public async Task SaveOrdersAsync(IEnumerable<Order> orders)
    {
        // Bulk insert instead of individual saves
        using var transaction = await _context.Database.BeginTransactionAsync();
        
        try
        {
            _context.Orders.AddRange(orders);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
```

---

## Conclusion

Object-Oriented Analysis and Design provides a systematic approach to building maintainable, scalable software systems. The key principles include:

### **Core Takeaways**

1. **Abstraction and Encapsulation**: Hide complexity and expose only necessary interfaces
2. **SOLID Principles**: Guide design decisions for maintainable code
3. **Design Patterns**: Proven solutions to common design problems
4. **Domain-Driven Design**: Align software structure with business domain
5. **Evolutionary Architecture**: Design for change and continuous improvement

### **Modern Considerations**

- **Microservices**: Apply OOAD principles at service boundaries
- **Event-Driven Architecture**: Use domain events for loose coupling
- **CQRS**: Separate read and write models for complex domains
- **Testing**: Design for testability from the beginning

### **Best Practices**

- Start with the domain model and business rules
- Favor composition over inheritance
- Design for interfaces, not implementations
- Keep objects focused and cohesive
- Embrace immutability where possible
- Use value objects for domain concepts
- Apply patterns judiciously, not dogmatically

The journey from procedural to object-oriented thinking requires practice and continuous refinement. Focus on understanding the problem domain first, then apply OOAD principles to create elegant, maintainable solutions.

---

## Further Reading

- **Books**: "Domain-Driven Design" by Eric Evans, "Clean Architecture" by Robert Martin
- **Patterns**: "Design Patterns" by Gang of Four, "Patterns of Enterprise Application Architecture" by Martin Fowler
- **Modern Practices**: "Building Microservices" by Sam Newman, "Implementing Domain-Driven Design" by Vaughn Vernon