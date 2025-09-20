# Chapter 3: Writing Loosely Coupled Code
**Source:** Dependency Injection Principles, Practices, and Patterns

---

## Overview

Chapter 3 demonstrates how to rebuild the tightly coupled e-commerce application from Chapter 2 using Dependency Injection (DI) principles. This chapter provides a practical, hands-on approach to implementing loose coupling through an outside-in development technique.

## Key Concepts

### 1. **Outside-In Development Approach**
- Start with the UI layer (most visible to stakeholders)
- Work inward to domain layer, then data access layer
- Provides quicker feedback compared to inside-out approach
- Follows YAGNI principle ("You Aren't Gonna Need It")

### 2. **Dependency Inversion Principle**
- Higher-level modules shouldn't depend on lower-level modules
- Both should depend on abstractions
- Abstractions should be owned by the consuming module
- Allows replacement of implementations without affecting consumers

### 3. **Constructor Injection Pattern**
- Statically define required dependencies as constructor parameters
- Forces explicit declaration of dependencies
- Enables compile-time verification of dependency requirements
- Pushes composition responsibility to the Composition Root

## Architecture Transformation

### Before (Tightly Coupled)
```
UI Layer → Domain Layer → Data Access Layer
```

### After (Loosely Coupled)
```
UI Layer → IProductService (Domain) ← ProductService (Domain)
                                    ↓
Domain Layer → IProductRepository ← SqlProductRepository (Data Access)
             → IUserContext ← AspNetUserContextAdapter (UI)
```

## Implementation Details

### 1. **Building a Maintainable UI**

**View Models (POCOs)**
```csharp
public class FeaturedProductsViewModel
{
    public FeaturedProductsViewModel(IEnumerable<ProductViewModel> products)
    {
        this.Products = products;
    }
    public IEnumerable<ProductViewModel> Products { get; }
}

public class ProductViewModel
{
    private static CultureInfo PriceCulture = new CultureInfo("en-US");
    
    public ProductViewModel(string name, decimal unitPrice)
    {
        this.SummaryText = string.Format(PriceCulture, 
            "{0} ({1:C})", name, unitPrice);
    }
    public string SummaryText { get; }
}
```

**Controller with Constructor Injection**
```csharp
public class HomeController : Controller
{
    private readonly IProductService productService;
    
    public HomeController(IProductService productService)
    {
        if (productService == null)
            throw new ArgumentNullException("productService");
        this.productService = productService;
    }
    
    public ViewResult Index()
    {
        IEnumerable<DiscountedProduct> products = 
            this.productService.GetFeaturedProducts();
        var vm = new FeaturedProductsViewModel(
            from product in products
            select new ProductViewModel(product));
        return this.View(vm);
    }
}
```

### 2. **Independent Domain Model**

**Domain Service Interface**
```csharp
public interface IProductService
{
    IEnumerable<DiscountedProduct> GetFeaturedProducts();
}
```

**Domain Service Implementation**
```csharp
public class ProductService : IProductService
{
    private readonly IProductRepository repository;
    private readonly IUserContext userContext;
    
    public ProductService(IProductRepository repository, IUserContext userContext)
    {
        if (repository == null) throw new ArgumentNullException("repository");
        if (userContext == null) throw new ArgumentNullException("userContext");
        this.repository = repository;
        this.userContext = userContext;
    }
    
    public IEnumerable<DiscountedProduct> GetFeaturedProducts()
    {
        return from product in this.repository.GetFeaturedProducts()
               select product.ApplyDiscountFor(this.userContext);
    }
}
```

**Repository Abstraction**
```csharp
public interface IProductRepository
{
    IEnumerable<Product> GetFeaturedProducts();
}
```

**User Context Abstraction**
```csharp
public interface IUserContext
{
    bool IsInRole(Role role);
}

public enum Role { PreferredCustomer }
```

**Domain Entity with Method Injection**
```csharp
public class Product
{
    public string Name { get; set; }
    public decimal UnitPrice { get; set; }
    public bool IsFeatured { get; set; }
    
    public DiscountedProduct ApplyDiscountFor(IUserContext user)
    {
        bool preferred = user.IsInRole(Role.PreferredCustomer);
        decimal discount = preferred ? .95m : 1.00m;
        return new DiscountedProduct(
            name: this.Name,
            unitPrice: this.UnitPrice * discount);
    }
}
```

### 3. **Data Access Layer**

**Repository Implementation**
```csharp
public class SqlProductRepository : IProductRepository
{
    private readonly CommerceContext context;
    
    public SqlProductRepository(CommerceContext context)
    {
        if (context == null) throw new ArgumentNullException("context");
        this.context = context;
    }
    
    public IEnumerable<Product> GetFeaturedProducts()
    {
        return from product in this.context.Products
               where product.IsFeatured
               select product;
    }
}
```

**Improved DbContext**
```csharp
public class CommerceContext : DbContext
{
    private readonly string connectionString;
    
    public CommerceContext(string connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new ArgumentException("connectionString should not be empty.", 
                "connectionString");
        this.connectionString = connectionString;
    }
    
    public DbSet<Product> Products { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder builder)
    {
        builder.UseSqlServer(this.connectionString);
    }
}
```

### 4. **Framework-Specific Adapter**

**ASP.NET Core User Context Adapter**
```csharp
public class AspNetUserContextAdapter : IUserContext
{
    private static HttpContextAccessor Accessor = new HttpContextAccessor();
    
    public bool IsInRole(Role role)
    {
        return Accessor.HttpContext.User.IsInRole(role.ToString());
    }
}
```

### 5. **Composition Root**

**Object Graph Construction**
```csharp
new HomeController(
    new ProductService(
        new SqlProductRepository(
            new CommerceContext(connectionString)),
        new AspNetUserContextAdapter()));
```

## Key Patterns Applied

### 1. **Constructor Injection**
- Primary DI pattern for statically defining dependencies
- Ensures dependencies are available at object creation time
- Enables compile-time verification

### 2. **Method Injection**
- Used for passing dependencies to short-lived objects (Entities)
- Example: `Product.ApplyDiscountFor(IUserContext user)`
- Useful when Constructor Injection isn't practical

### 3. **Adapter Pattern**
- `AspNetUserContextAdapter` adapts framework-specific APIs
- Isolates domain from framework dependencies
- Enables framework replacement without domain changes

### 4. **Repository Pattern**
- `IProductRepository` abstracts data access
- Enables data source replacement
- Separates domain logic from persistence concerns

## Benefits Achieved

### 1. **Testability**
- All dependencies are abstractions that can be mocked
- Domain logic isolated from external concerns
- Each layer can be tested independently

### 2. **Flexibility**
- UI can be replaced (Web → WPF → Console)
- Data access can be replaced (SQL → NoSQL → Cloud)
- Framework dependencies isolated to specific adapters

### 3. **Maintainability**
- Clear separation of concerns
- Dependencies explicitly declared
- Single Responsibility Principle enforced

### 4. **Composability**
- Object graphs constructed in single location (Composition Root)
- Dependencies injected rather than created
- Loose coupling enables modular architecture

## Dependency Graph Analysis

### Original (Tightly Coupled)
- Domain layer depends on data access layer
- Difficult to replace implementations
- Testing requires real database

### Refactored (Loosely Coupled)
- Domain layer has no dependencies
- Data access layer depends on domain abstractions
- UI layer provides framework-specific implementations
- Easy to replace any layer independently

## Important Notes

### **POCOs and DTOs**
- Don't need interfaces (no behavior to mock/replace)
- Safe to create directly in code
- Contain runtime data, not behavior

### **Interfaces vs Abstract Classes**
- For DI, choice doesn't matter
- Interfaces preferred for applications (composition over inheritance)
- Abstract classes better for reusable libraries (backward compatibility)

### **Pure DI vs DI Containers**
- This example uses Pure DI (manual object composition)
- DI Containers are optional tools for automation
- Understanding Pure DI is fundamental before using containers

## Summary

Chapter 3 demonstrates the practical transformation from tightly coupled to loosely coupled code using DI principles. The key insight is that loose coupling is achieved through:

1. **Dependency Inversion** - Depending on abstractions, not concretions
2. **Constructor Injection** - Explicit dependency declaration
3. **Composition Root** - Centralized object graph construction
4. **Separation of Concerns** - Each layer has distinct responsibilities

The result is a flexible, testable, and maintainable architecture where any layer can be replaced without affecting others, enabling true modularity and composability.
