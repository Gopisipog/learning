# Dependency Injection in .NET Core: Learning Prompts

## 💉 Understanding and Implementing DI in .NET Core (Intermediate)

---

### 📚 Built-in DI Container

1.  **Project Setup**: Create a new ASP.NET Core Web API project. Open `Program.cs` (or `Startup.cs`). Locate the `builder.Services` (`services` in `Startup.cs`). This is the `IServiceCollection`, which is used to configure the built-in DI container.
2.  **Register a Simple Service**:
    *   Create a simple service, `public class MyService`, with a method that returns a string.
    *   Register this service in `Program.cs` using `builder.Services.AddTransient<MyService>();`.
3.  **Consume the Service**:
    *   Inject `MyService` into the constructor of the `WeatherForecastController`.
    *   Call your service's method from one of the controller's action methods and return the result.
4.  **Manual Service Resolution**:
    *   In `Program.cs`, after `var app = builder.Build();`, get an instance of your service directly from the container using `app.Services.GetService<MyService>()`.
    *   Why is this generally discouraged in application code (like controllers)? When might it be useful?

---

### 📚 Service Lifetimes (Singleton, Scoped, Transient)

1.  **Create a Lifetime Demo Service**:
    *   Create an interface `IOperation` with a property `string OperationId { get; }`.
    *   Create a class `Operation : IOperation` that generates a unique ID (e.g., `Guid.NewGuid().ToString()`) in its constructor and assigns it to the `OperationId` property.
2.  **Register Multiple Services**:
    *   Create three more services: `IOperationTransient`, `IOperationScoped`, and `IOperationSingleton`.
    *   Register `Operation` for each of these interfaces with the corresponding lifetime in `Program.cs`:
        ```csharp
        builder.Services.AddTransient<IOperationTransient, Operation>();
        builder.Services.AddScoped<IOperationScoped, Operation>();
        builder.Services.AddSingleton<IOperationSingleton, Operation>();
        ```
3.  **Create a Consumer**:
    *   Create a `LogService` that takes all three `IOperation` services in its constructor.
    *   Create a method in `LogService` that logs the `OperationId` from each of the three services.
4.  **Inject and Observe**:
    *   Inject `LogService` and all three `IOperation` services directly into a controller's constructor.
    *   In an action method, call the `LogService`'s logging method. Then, log the `OperationId`s from the services injected directly into the controller.
    *   Make two separate requests to this endpoint.
    *   **Analyze the output**:
        *   Which IDs are the same within a single request?
        *   Which IDs change between the two requests?
        *   Explain the behavior you observe for `Transient`, `Scoped`, and `Singleton`.

---

### 📚 Interface-based Programming

1.  **The "D" in SOLID**: Dependency Inversion Principle. Explain in your own words how Dependency Injection helps you adhere to this principle.
2.  **Create an Interface**:
    *   Define an `IMessageSender` interface with a method `void SendMessage(string message)`.
3.  **Multiple Implementations**:
    *   Create two classes that implement `IMessageSender`: `EmailSender` and `SmsSender`. Each class's `SendMessage` method should just write to the console (e.g., "Sending email: {message}").
4.  **Conditional Registration**:
    *   In `Program.cs`, use a configuration value (from `appsettings.json`) to decide whether to register `EmailSender` or `SmsSender` for the `IMessageSender` interface.
5.  **Consume the Abstraction**:
    *   Create a `NotificationService` that depends on `IMessageSender` (not the concrete classes).
    *   Inject `NotificationService` into a controller and use it to send a message.
    *   Change the configuration value and restart the application. Observe how the behavior changes without modifying the `NotificationService` or the controller.

---

### 📚 Constructor and Method Injection

1.  **Constructor Injection (Primary Method)**: You have been using this in the previous exercises. Explain why constructor injection is the most common and preferred method for DI. What does it make clear about a class's dependencies?
2.  **Action Method Injection**:
    *   Create a new action method in a controller.
    *   Instead of injecting a service into the constructor, inject it directly into the action method's parameters using the `[FromServices]` attribute.
        ```csharp
        public IActionResult Get([FromServices] IMessageSender sender)
        {
            sender.SendMessage("Hello from an action method!");
            return Ok();
        }
        ```
    *   When might this be useful? (Hint: think about services that are only needed for a single action).
3.  **Property Injection (The Service Locator Anti-Pattern)**:
    *   .NET's built-in container does not support property injection out of the box because it can hide a class's dependencies.
    *   Discuss the downsides of property injection. Why is it often considered an anti-pattern?
4.  **`IServiceProvider` Injection**:
    *   Inject `IServiceProvider` into a service's constructor.
    *   Use `serviceProvider.GetRequiredService<T>()` to manually resolve another service inside a method.
    *   This is the **Service Locator Pattern**. Discuss its pros and cons compared to standard constructor injection. Why should it be used sparingly?