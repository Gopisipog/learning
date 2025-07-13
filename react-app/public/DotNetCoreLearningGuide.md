# Comprehensive .NET Core Learning Guide

---

## 📝 C# Language Fundamentals: Essential Concepts for .NET Core

### 📚 Variables, Data Types, and Operators

1.  **Hello, World!**: Write a C# console application that prints "Hello, World!" to the console.
2.  **Variable Declaration**: Declare variables for your name, age, and favorite color. Print them out in a sentence.
3.  **Data Types**: Create variables of the following data types: `int`, `double`, `char`, `string`, and `bool`. Assign them values and print them.
4.  **Arithmetic Operators**: Write a program that takes two numbers as input and displays their sum, difference, product, and quotient.
5.  **User Input**: Create a program that asks the user for their name and age, then greets them by name and tells them their age next year.
6.  **Type Casting**: Declare a `double` and an `int`. Explicitly cast the `double` to an `int` and print the result. What happens to the decimal part?
7.  **String Concatenation vs. Interpolation**: Demonstrate the difference between string concatenation using the `+` operator and string interpolation.

### 📚 Control Structures and Loops

1.  **If-Else Statement**: Write a program that checks if a number is positive, negative, or zero.
2.  **Switch Statement**: Create a program that takes a number from 1 to 7 and prints the corresponding day of the week.
3.  **For Loop**: Write a `for` loop that prints the numbers from 1 to 10.
4.  **While Loop**: Write a `while` loop that prints the numbers from 10 down to 1.
5.  **Do-While Loop**: Create a simple number guessing game where the user has to guess a number between 1 and 100. Use a `do-while` loop to keep the game going until the user guesses correctly.
6.  **FizzBuzz**: Write a program that prints the numbers from 1 to 100. For multiples of three, print "Fizz" instead of the number. For multiples of five, print "Buzz". For numbers which are multiples of both three and five, print "FizzBuzz".
7.  **Nested Loops**: Use nested `for` loops to print a 5x5 multiplication table.

### 📚 Methods and Parameter Handling

1.  **Simple Method**: Write a method called `Greet` that takes a `string` parameter (a name) and prints a greeting to that person.
2.  **Return Values**: Create a method that takes two integers as parameters and returns their sum.
3.  **Method Overloading**: Create two methods with the same name, `Add`. One should take two `int` parameters, and the other should take two `double` parameters.
4.  **Optional Parameters**: Write a method that calculates the area of a rectangle. Make the height an optional parameter with a default value of 10.
5.  **Named Arguments**: Call the rectangle area method from the previous exercise using named arguments, passing the width first and then the height.
6.  **`ref` and `out` Parameters**:
    *   Write a method that uses a `ref` parameter to increment a number.
    *   Write a method that uses `out` parameters to return the area and perimeter of a circle.
7.  **Recursion**: Write a recursive method to calculate the factorial of a number.

### 📚 Object-Oriented Programming (OOP) Basics

1.  **Create a Class**: Create a `Person` class with properties for `FirstName`, `LastName`, and `Age`.
2.  **Instantiate an Object**: Create an instance of your `Person` class and set its properties.
3.  **Add a Method**: Add a method to the `Person` class called `GetFullName` that returns the person's full name.
4.  **Constructor**: Add a constructor to the `Person` class that takes the first name, last name, and age as parameters to initialize the properties.
5.  **Inheritance**: Create a `Student` class that inherits from the `Person` class. Add a `Major` property to the `Student` class.
6.  **Encapsulation**: Modify the `Person` class to use private fields and public properties for `Age`. Add validation in the property's setter to ensure the age is not negative.
7.  **Polymorphism**: Create a virtual method in the `Person` class called `Introduce`. Override this method in the `Student` class to include the student's major in the introduction. Create a list of `Person` objects, add both `Person` and `Student` objects to it, and loop through the list, calling the `Introduce` method on each object.

---

## 📖 .NET Core Development Guide: Setup and CLI

### 📚 SDK Installation and Setup

1.  **Verify .NET Installation**: Open your terminal or command prompt and run `dotnet --version`. What version of the .NET SDK is installed? If it's not installed, download and install it from the official .NET website.
2.  **Explore SDKs and Runtimes**: Run `dotnet --list-sdks` and `dotnet --list-runtimes`. What is the difference between an SDK and a runtime?
3.  **Hello, .NET!**: Create a new directory for a project. Navigate into it and run `dotnet new console`. What files were created?
4.  **Run Your First App**: Run the newly created console application using the .NET CLI.
5.  **IDE Setup**:
    *   **Visual Studio Code**: Install the C# extension from the Visual Studio Marketplace. Open your project folder and try running it from the integrated terminal.
    *   **Visual Studio**: If you have Visual Studio, open the `.csproj` file. Explore the Solution Explorer and try running the project.

### 📚 Basic .NET CLI Commands

1.  **`dotnet new`**:
    *   Use `dotnet new --list` to see all available project templates.
    *   Create a new class library project using `dotnet new classlib`.
    *   Create a new web API project using `dotnet new webapi`.
2.  **`dotnet run`**:
    *   In your console application, modify `Program.cs` to print a different message.
    *   Use `dotnet run` to compile and execute the application.
3.  **`dotnet build`**:
    *   Run `dotnet build` on your console application.
    *   Look inside the `bin/Debug` directory. What files were generated? What is the purpose of the `.dll` and `.exe` files?
4.  **`dotnet clean`**:
    *   Run `dotnet clean`. What happened to the files in the `bin` and `obj` directories?
5.  **`dotnet help`**:
    *   Get help for the `build` command by running `dotnet help build`.

### 📚 Project and Dependency Management

1.  **Creating a Solution**:
    *   Create a new solution file using `dotnet new sln`.
    *   Add your console application and class library projects to the solution using `dotnet sln add`.
2.  **Adding a Project Reference**:
    *   From the console application project, add a reference to the class library project using `dotnet add reference`.
    *   In your console app, call a method from the class library.
3.  **Adding a NuGet Package**:
    *   In your console application, add the `Newtonsoft.Json` package using `dotnet add package Newtonsoft.Json`.
    *   Verify that the package was added to your `.csproj` file.
4.  **Using a NuGet Package**:
    *   Use `Newtonsoft.Json` to serialize a simple C# object to a JSON string and print it to the console.
5.  **Listing and Removing Packages**:
    *   List the packages in your project with `dotnet list package`.
    *   Remove the `Newtonsoft.Json` package using `dotnet remove package Newtonsoft.Json`.
6.  **Restoring Dependencies**:
    *   Manually delete the `obj` folder.
    *   Run `dotnet restore` to restore the project's dependencies.

### 📚 Advanced .NET CLI Topics

1.  **Publishing an App**:
    *   Publish your console application for a specific runtime (e.g., Windows, Linux, or macOS) using the `dotnet publish` command with the `-r` flag (e.g., `dotnet publish -r win-x64`).
    *   Explore the `publish` directory. How is it different from the `build` directory?
2.  **Self-Contained vs. Framework-Dependent**:
    *   Publish your app as a self-contained deployment (`--self-contained true`).
    *   Publish it again as a framework-dependent deployment (`--self-contained false`).
    *   What are the differences in the output and file size? What are the pros and cons of each approach?
3.  **Global Tools**:
    *   Install a .NET global tool, for example, `dotnet-ef` for Entity Framework Core, by running `dotnet tool install --global dotnet-ef`.
    *   List the installed global tools using `dotnet tool list --global`.
    *   Uninstall the tool.
4.  **Project Templates**:
    *   Find a project template on NuGet.org (e.g., a template for a specific framework or project type).
    *   Install it using `dotnet new --install`.
    *   Use the newly installed template to create a project.
5.  **Watch Command**:
    *   Use `dotnet watch run` in your console application directory.
    *   Change the code in `Program.cs` and save the file. What happens in the terminal? How is this useful for development?

---

## 🛠️ Building Web APIs with ASP.NET Core

### 📚 Controller-based API Development

1.  **Create a Web API Project**: Use the .NET CLI to create a new ASP.NET Core Web API project. Examine the default `WeatherForecastController`. What is the purpose of the `[ApiController]` attribute?
2.  **Create Your First Controller**: Create a new controller called `ProductsController`. Make it inherit from `ControllerBase`.
3.  **In-Memory Data Store**: Inside your `ProductsController`, create a static list of `Product` objects to act as an in-memory database. A `Product` should have properties like `Id`, `Name`, and `Price`.
4.  **Implement a GET Endpoint**: Create an action method that returns the full list of products.
5.  **Dependency Injection**:
    *   Create a simple service `IProductService` with a method `GetAllProducts()`.
    *   Create a `ProductService` class that implements the interface and holds the in-memory data.
    *   Register the service in `Program.cs` (or `Startup.cs`).
    *   Inject `IProductService` into your `ProductsController` and use it to get the products.

### 📚 Routing and Action Methods

1.  **Attribute Routing**:
    *   Add a `[Route("api/[controller]")]` attribute to your `ProductsController`. What does `[controller]` do?
    *   Add an `[HttpGet]` attribute to your action method that gets all products.
2.  **Route Parameters**:
    *   Create a new action method to get a single product by its `Id`.
    *   Use the `[HttpGet("{id}")]` attribute to define the route. The method should take an `int id` as a parameter.
3.  **HTTP Verbs**:
    *   **POST**: Implement a `CreateProduct` action method that accepts a `Product` from the request body and adds it to your in-memory list. Use the `[HttpPost]` attribute.
    *   **PUT**: Implement an `UpdateProduct` action method that takes an `id` and a `Product` object. It should find the existing product by its ID and update its properties. Use the `[HttpPut("{id}")]` attribute.
    *   **DELETE**: Implement a `DeleteProduct` action method that takes an `id` and removes the corresponding product from the list. Use the `[HttpDelete("{id}")]` attribute.
4.  **Route Constraints**: Modify the route for getting a product by ID to only accept integer values for the `id`. (e.g., `[HttpGet("{id:int}")]`). Try to access the endpoint with a non-integer value.

### 📚 Model Binding and Validation

1.  **Data Transfer Objects (DTOs)**:
    *   Create a `CreateProductDto` class that contains only the properties needed to create a new product (e.g., `Name` and `Price`, but not `Id`).
    *   Modify your `CreateProduct` action method to accept a `CreateProductDto` instead of a full `Product` object.
2.  **Binding Sources**:
    *   Create an action method that allows searching for products. It should take a `searchQuery` string from the query string. Use the `[FromQuery]` attribute explicitly.
    *   Experiment with the different binding source attributes: `[FromBody]`, `[FromRoute]`, `[FromQuery]`, `[FromHeader]`.
3.  **Data Annotations for Validation**:
    *   In your `CreateProductDto`, add validation attributes. Make the `Name` required (`[Required]`) and give it a maximum length (`[StringLength(100)]`). Make the `Price` have a specific range (`[Range(0.01, 1000)]`).
4.  **Checking `ModelState`**:
    *   In your `CreateProduct` action method, check if `ModelState.IsValid`.
    *   If the model state is invalid, return a `BadRequest` with the validation errors.
    *   Use a tool like Postman or Swagger to send an invalid request and observe the response.

### 📚 HTTP Status Codes and Responses

1.  **ActionResult<T>**:
    *   Change the return type of your `Get` methods to be `ActionResult<IEnumerable<Product>>` and `ActionResult<Product>`. What are the benefits of using this return type?
2.  **Returning Status Codes**:
    *   **200 OK**: Your `GET` methods should implicitly return this.
    *   **404 Not Found**: In your method to get a product by ID, if no product with the given ID is found, return `NotFound()`.
    *   **400 Bad Request**: Your `CreateProduct` method should already be returning this for invalid models.
    *   **204 No Content**: Your `DELETE` and `PUT` methods should return `NoContent()` on success. Why is this often preferred over `Ok()` for these operations?
3.  **Returning 201 Created**:
    *   Modify your `POST` method to return a `201 Created` status code.
    *   Use the `CreatedAtAction` or `CreatedAtRoute` helper method. This response should include a `Location` header pointing to the newly created resource's URL.
4.  **Problem Details for Errors**:
    *   When returning a `BadRequest`, the `[ApiController]` attribute automatically wraps the response in a `ProblemDetails` format.
    *   Try creating a custom error response by returning `Problem("An error occurred.", statusCode: 500)`.

---

## 💉 Dependency Injection in .NET Core

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

---

## 🗄️ Entity Framework Core: Database Operations

### 📚 Code-First Approach and Migrations

1.  **Project Setup**:
    *   Create a new ASP.NET Core Web API project.
    *   Add the required EF Core NuGet packages: `Microsoft.EntityFrameworkCore.SqlServer` (or another provider like `Npgsql.EntityFrameworkCore.PostgreSQL` or `Microsoft.EntityFrameworkCore.Sqlite`) and `Microsoft.EntityFrameworkCore.Tools`.
2.  **Define Your Models**:
    *   Create two simple model classes: `Blog` and `Post`.
    *   A `Blog` should have a `BlogId` and a `Url`.
    *   A `Post` should have a `PostId`, `Title`, `Content`, and a foreign key `BlogId`.
3.  **Install EF Core Tools**: Install the `dotnet-ef` global or local tool by running `dotnet tool install --global dotnet-ef` or `dotnet tool install dotnet-ef`.
4.  **Create Your First Migration**:
    *   In your project directory, run `dotnet ef migrations add InitialCreate`.
    *   Examine the generated migration file in the `Migrations` folder. What does the `Up` method do? What about the `Down` method?
5.  **Apply the Migration**:
    *   Run `dotnet ef database update`. This will apply the migration to your database, creating the schema.
    *   Use a database inspection tool (like SQL Server Management Studio or DBeaver) to verify that the tables were created correctly.
6.  **Make a Model Change**:
    *   Add a `Rating` property (from 1 to 5) to the `Blog` class.
    *   Create a new migration: `dotnet ef migrations add AddBlogRating`.
    *   Apply the migration to the database.
7.  **Reverting a Migration**:
    *   Learn how to revert a migration by running `dotnet ef database update <PreviousMigrationName>`.
    *   After reverting, remove the last migration using `dotnet ef migrations remove`.

### 📚 DbContext and DbSet Configuration

1.  **Create a DbContext**:
    *   Create a class `BloggingContext` that inherits from `Microsoft.EntityFrameworkCore.DbContext`.
    *   Add `DbSet<Blog> Blogs { get; set; }` and `DbSet<Post> Posts { get; set; }` properties. What is the purpose of `DbSet<T>`?
2.  **Configure the DbContext**:
    *   In `Program.cs`, register your `BloggingContext` with the DI container.
    *   Use `builder.Services.AddDbContext<BloggingContext>(options => options.UseSqlServer(connectionString));`.
    *   Get the connection string from `appsettings.json`.
3.  **Data Annotations**:
    *   Use data annotation attributes in your model classes.
    *   Make the `Url` property of the `Blog` class required (`[Required]`).
    *   Set a maximum length for the `Title` of a `Post` (`[MaxLength(200)]`).
4.  **Fluent API**:
    *   Override the `OnModelCreating(ModelBuilder modelBuilder)` method in your `BloggingContext`.
    *   Use the Fluent API to configure the same constraints as in the previous step, plus one more: give the `Blogs` table a specific name, like `WebsiteBlogs`.
    *   Which configuration method takes precedence: Data Annotations or Fluent API?

### 📚 LINQ Queries and Relationships

1.  **Basic CRUD Operations**:
    *   Inject your `BloggingContext` into a controller.
    *   **Create**: Write an action method to create and save a new `Blog`.
    *   **Read**: Write an action method to retrieve all blogs and return them.
    *   **Update**: Write an action method to find a blog by its ID, change its `Url`, and save the changes.
    *   **Delete**: Write an action method to find a blog by its ID and remove it.
2.  **Filtering and Ordering**:
    *   Write a LINQ query to find all blogs with a `Rating` greater than 3.
    *   Write a query to find all posts containing the word "C#" in their `Title`, ordered by the title alphabetically.
3.  **Relationships**:
    *   In your `Blog` class, add a navigation property: `public List<Post> Posts { get; set; }`.
    *   In your `Post` class, add a navigation property: `public Blog Blog { get; set; }`.
4.  **Loading Related Data**:
    *   **Eager Loading**: Use the `Include()` method to retrieve all blogs and their associated posts in a single query.
    *   **Explicit Loading**: Retrieve a blog first, and then later, use `context.Entry(blog).Collection(b => b.Posts).Load()` to load its posts. When would this be useful?
    *   **Lazy Loading** (Optional): Research how to enable lazy loading. What are its potential benefits and pitfalls (e.g., the N+1 problem)?

### 📚 Database Seeding and Configuration

1.  **Simple Seeding**:
    *   In the `OnModelCreating` method of your `BloggingContext`, use `modelBuilder.Entity<Blog>().HasData()` to seed the database with a few initial blogs.
    *   Create a new migration. You'll see that the migration file now contains `InsertData` calls.
    *   Update the database to apply the seed data.
2.  **Separating Seed Logic**:
    *   For more complex seeding, create a separate static class (e.g., `SeedData`).
    *   Create a static method in this class that takes a `ModelBuilder` as an argument and performs the seeding logic.
    *   Call this static method from `OnModelCreating`.
3.  **Connection String Management**:
    *   Ensure your connection string is stored securely in `appsettings.Development.json` and managed with User Secrets for local development. Discuss why you should never commit connection strings with sensitive credentials to source control.
4.  **Changing Database Provider**:
    *   Configure the project to use `Microsoft.EntityFrameworkCore.Sqlite` instead of SQL Server.
    *   What needs to change in `Program.cs`?
    *   Delete your `Migrations` folder and database file, then create new migrations and update the database for SQLite. How does the migration code differ?

---

## 🔗 Middleware Pipeline in ASP.NET Core

### 📚 Built-in Middleware Components

1.  **Project Setup**: Create a new minimal ASP.NET Core Web API project. Open `Program.cs`. The code between `var app = builder.Build();` and `app.Run();` is where the middleware pipeline is configured.
2.  **Examine Default Middleware**:
    *   Identify the middleware components added by default (e.g., `UseSwagger`, `UseSwaggerUI`, `UseAuthorization`).
    *   Comment out `app.UseSwaggerUI()` and run the application. What happens when you navigate to `/swagger`? This demonstrates that a middleware component is responsible for handling that specific path.
3.  **Static Files Middleware**:
    *   Add the static files middleware by calling `app.UseStaticFiles();`.
    *   Create a `wwwroot` folder in your project's root.
    *   Inside `wwwroot`, create a simple `index.html` file.
    *   Run the application and navigate to the root URL (`/`). Your HTML file should be served. Why does this work?
4.  **Routing Middleware**:
    *   The pipeline is typically split into components that run before routing and components that run after. `app.UseRouting()` marks the point where the endpoint is selected.
    *   `app.UseEndpoints(...)` (in older templates) or the minimal API `app.MapGet(...)` calls are where the selected endpoint is executed.
    *   Add a simple logging message before and after `app.UseRouting()`. Observe when they are printed in the console.

### 📚 Custom Middleware Creation

1.  **Simple Inline Middleware with `app.Use`**:
    *   Before any other middleware, add the following code:
        ```csharp
        app.Use(async (context, next) =>
        {
            Console.WriteLine("Before Request");
            await next.Invoke(); // Call the next middleware in the pipeline
            Console.WriteLine("After Request");
        });
        ```
    *   Run the app and make a request. Observe the console output. This demonstrates the "nesting" or "Russian doll" model of the pipeline.
2.  **Short-Circuiting the Pipeline**:
    *   Modify the previous middleware. Add a condition (e.g., `if (context.Request.Query.ContainsKey("stop"))`) and inside it, write a response directly to `context.Response` without calling `await next.Invoke()`.
    *   Make a request with `?stop=true` in the URL. What happens? Why didn't the request reach your API endpoint?
3.  **Convention-based Middleware Class**:
    *   Create a new class, `MyCustomMiddleware`.
    *   It must have a constructor that accepts a `RequestDelegate` parameter.
    *   It must have a public `async Task InvokeAsync(HttpContext context)` method. This is where your middleware logic goes.
    *   Inside `InvokeAsync`, perform some logic and then call the next middleware.
4.  **Registering the Middleware Class**:
    *   Create an extension method to make registering your middleware cleaner:
        ```csharp
        public static class MyCustomMiddlewareExtensions
        {
            public static IApplicationBuilder UseMyCustomMiddleware(this IApplicationBuilder builder)
            {
                return builder.UseMiddleware<MyCustomMiddleware>();
            }
        }
        ```
    *   In `Program.cs`, register your middleware using `app.UseMyCustomMiddleware();`.

### 📚 Middleware Ordering and Execution

1.  **The Importance of Order**:
    *   In `Program.cs`, place `app.UseAuthentication()` *after* `app.UseAuthorization()`.
    *   Research why this is incorrect. What is the logical flow? (Authentication identifies who the user is; Authorization determines what they are allowed to do). Correct the order.
2.  **Visualizing the Pipeline**:
    *   Create two simple inline middleware components.
    *   Middleware 1: Logs "M1 In" before `await next()` and "M1 Out" after.
    *   Middleware 2: Logs "M2 In" before `await next()` and "M2 Out" after.
    *   Register them in the order M1, then M2.
    *   Predict the output in the console, then run the app and verify. The output should be: `M1 In`, `M2 In`, `(Request handled)`, `M2 Out`, `M1 Out`.
3.  **Conditional Middleware with `app.UseWhen`**:
    *   Use `app.UseWhen()` to create a branch in the pipeline.
    *   Configure a simple logging middleware to run *only* when the request path starts with `/api`.
    *   Test this by making requests to `/api/some-endpoint` and `/swagger`.
4.  **Terminal Middleware with `app.Run`**:
    *   `app.Run` registers a terminal middleware that doesn't call `next`. It short-circuits the pipeline.
    *   Add `app.Run(async context => { await context.Response.WriteAsync("Pipeline terminated!"); });` early in your pipeline.
    *   What happens to requests now? Why would you use `app.Run`?

### 📚 Exception Handling Middleware

1.  **Developer Exception Page**:
    *   The default template includes `app.UseDeveloperExceptionPage()` or `app.UseExceptionHandler("/Error")` based on the environment.
    *   In a controller action, deliberately throw an exception (e.g., `throw new InvalidOperationException("This is a test exception");`).
    *   Run the application in the `Development` environment. Observe the detailed error page.
2.  **Production Exception Handling**:
    *   Change the environment to `Production` (e.g., by modifying `launchSettings.json`).
    *   Run the app and trigger the exception again. What do you see now? It should be a generic, user-friendly error page.
3.  **Create a Custom Exception Handling Middleware**:
    *   Create a new middleware class, `ExceptionHandlingMiddleware`.
    *   Inside its `InvokeAsync` method, wrap the `await _next(context);` call in a `try...catch` block.
    *   In the `catch` block:
        *   Log the exception details.
        *   Set the response status code to 500 (Internal Server Error).
        *   Write a generic JSON error message to the response body.
4.  **Register the Custom Handler**:
    *   Register your `ExceptionHandlingMiddleware` at the very beginning of the pipeline in `Program.cs`. Why is it important for this middleware to be one of the first?
    *   Remove the built-in `UseExceptionHandler` and test your custom middleware by throwing an exception.

---

## ⚙️ Configuration Management in .NET Core

### 📚 `appsettings.json` Configuration

1.  **Project Setup**: Create a new ASP.NET Core Web API project. Locate the `appsettings.json` file.
2.  **Add a Simple Setting**: Add a new top-level key-value pair to `appsettings.json`, for example: `"AppName": "My Awesome App"`.
3.  **Read a Simple Setting**:
    *   The `IConfiguration` service is automatically registered in the DI container. Inject `IConfiguration` into your `WeatherForecastController`'s constructor.
    *   In an action method, read the value using `_configuration["AppName"]` and return it.
4.  **Add a Complex Object**:
    *   Add a nested JSON object to `appsettings.json` for more complex settings:
        ```json
        "AppSettings": {
          "Version": "1.0.0",
          "Author": "Your Name"
        }
        ```
5.  **Read a Nested Setting**:
    *   In your controller, read the `Version` by accessing the section and then the key: `_configuration["AppSettings:Version"]`. The colon `:` is used to navigate into sections.
    *   Alternatively, get the entire section using `_configuration.GetSection("AppSettings")` and then get values from it.

### 📚 Environment-Specific Settings

1.  **Development Settings**:
    *   Locate the `appsettings.Development.json` file. This file is used to override settings from `appsettings.json` when the application is running in the `Development` environment.
2.  **Override a Setting**:
    *   In `appsettings.Development.json`, add the same `AppSettings` section but change the `Author` to `"Your Name (Dev)"`.
        ```json
        "AppSettings": {
          "Author": "Your Name (Dev)"
        }
        ```
3.  **Verify the Override**:
    *   Run the application (it runs in `Development` mode by default, which you can see in `Properties/launchSettings.json`).
    *   Read the `AppSettings:Author` value. It should now be "Your Name (Dev)". The `Version` setting, which was not overridden, should still be "1.0.0".
4.  **The `ASPNETCORE_ENVIRONMENT` Variable**:
    *   Open `Properties/launchSettings.json`. Find the `ASPNETCORE_ENVIRONMENT` variable. This is what controls which `appsettings.{Environment}.json` file is loaded.
    *   Change the value to `Production` for one of the profiles. Run the app using that profile. What is the value of `AppSettings:Author` now?

### 📚 Options Pattern Implementation

1.  **Create a Settings Class**:
    *   Create a new Plain Old C# Object (POCO) class to represent your settings object.
        ```csharp
        public class AppSettings
        {
            public string Version { get; set; }
            public string Author { get; set; }
        }
        ```
2.  **Bind Configuration to the Class**:
    *   In `Program.cs`, bind the `AppSettings` section from your JSON file to your new `AppSettings` class.
        ```csharp
        builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));
        ```
3.  **Inject Strongly-Typed Options**:
    *   Create a new service, `MyService`.
    *   In the constructor of `MyService`, inject `IOptions<AppSettings>`.
    *   The configuration values are now available via the `.Value` property (e.g., `_appSettings.Value.Author`).
4.  **Use the Service**: Register and inject `MyService` into your controller and use it to retrieve a configuration value. This is the recommended way to access configuration in your application logic, as it follows the principles of Dependency Injection and strong typing.
5.  **`IOptionsSnapshot` and `IOptionsMonitor`**:
    *   Research the difference between `IOptions<T>`, `IOptionsSnapshot<T>`, and `IOptionsMonitor<T>`.
    *   Which one would you use if you needed to get up-to-date configuration values within a scoped service?
    *   Which one would you use if you needed to be notified when configuration changes?

### 📚 Configuration Providers and Sources

1.  **Default Providers**: By default, .NET loads configuration from several sources in a specific order. The typical order is:
    1.  `appsettings.json`
    2.  `appsettings.{Environment}.json`
    3.  User Secrets (in Development)
    4.  Environment Variables
    5.  Command-line Arguments
2.  **Override with Environment Variables**:
    *   Stop your application.
    *   Set an environment variable that matches a configuration key. The colon `:` is replaced with a double underscore `__`. For example, set `AppSettings__Author` to `"Author from Env Var"`.
    *   Run the application and check the value. It should now be overridden by the environment variable.
3.  **Override with Command-line Arguments**:
    *   Run your application from the command line and pass in a value: `dotnet run --AppSettings:Author="Author from CLI"`.
    *   Check the value again. It should now be overridden by the command-line argument, which has the highest precedence.
4.  **User Secrets**:
    *   In Visual Studio or using the .NET CLI, initialize user secrets for your project (`dotnet user-secrets init`).
    *   Set a secret: `dotnet user-secrets set "ConnectionStrings:DefaultConnection" "secret_connection_string"`.
    *   Read this value in your code. Why is this a good way to store sensitive data during local development?
5.  **Adding a New Provider**:
    *   Create a simple `config.xml` file with some settings.
    *   In `Program.cs`, add the XML file as a configuration source using `builder.Configuration.AddXmlFile("config.xml");`.
    *   Read a value from the XML file to confirm it was loaded.

---

## 📈 Logging and Monitoring in .NET Core

### 📚 Built-in Logging Framework

1.  **Project Setup**: Create a new ASP.NET Core Web API project.
2.  **Inject `ILogger`**: The `ILogger` interface is the primary way to log in .NET. It's already registered in the DI container.
    *   Inject `ILogger<WeatherForecastController>` into the constructor of the `WeatherForecastController`. The generic type parameter `WeatherForecastController` is used to set the log's *category*.
3.  **Log a Message**:
    *   In one of the controller's action methods, log an informational message:
        ```csharp
        _logger.LogInformation("Getting the weather forecast.");
        ```
    *   Run the application and make a request to that endpoint. Observe the log output in the console window.
4.  **Log an Exception**:
    *   Wrap some code in a `try...catch` block.
    *   In the `catch` block, log the exception using `_logger.LogError()`:
        ```csharp
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while processing the request.");
        }
        ```
    *   Trigger the exception and observe the detailed output, including the stack trace.

### 📚 Log Levels and Categories

1.  **Explore Log Levels**:
    *   In a controller action, log a message for each of the main log levels: `Trace`, `Debug`, `Information`, `Warning`, `Error`, and `Critical`.
        ```csharp
        _logger.LogTrace("This is a trace message.");
        _logger.LogDebug("This is a debug message.");
        // ...and so on
        ```
    *   Run the app. Which log levels do you see in the console output by default?
2.  **Configure Log Levels in `appsettings.json`**:
    *   Open `appsettings.Development.json`. You'll find a `Logging` section.
    *   The default configuration often sets the `Default` level to `Information`. This means `Trace` and `Debug` messages are ignored.
    *   Change the `Default` log level to `Trace`. Run the app again and trigger your logging method. Now you should see all the messages.
3.  **Configure Log Categories**:
    *   The category is typically the fully qualified name of the class where the log originates (e.g., `YourProject.Controllers.WeatherForecastController`).
    *   You can set log levels for specific categories. In `appsettings.Development.json`, set the log level for all Microsoft components to `Warning` to reduce noise, but keep your application's default at `Information`.
        ```json
        "Logging": {
          "LogLevel": {
            "Default": "Information",
            "Microsoft.AspNetCore": "Warning"
          }
        }
        ```
    *   Run the app and observe how the output from ASP.NET Core's internal logging is now less verbose.

### 📚 Structured Logging with Serilog

1.  **Why Structured Logging?**: Discuss the difference between plain text logging (`"User 123 logged in."`) and structured logging (`"User {UserId} logged in.", 123`). Why is the structured approach better for querying and analysis?
2.  **Add Serilog Packages**:
    *   Add the necessary Serilog NuGet packages to your project: `Serilog.AspNetCore`, `Serilog.Sinks.Console`, and `Serilog.Sinks.File`.
3.  **Configure Serilog**:
    *   In `Program.cs`, remove the default logging configuration and replace it with Serilog.
    *   Configure Serilog to read its configuration from `appsettings.json` and write to both the console and a file.
        ```csharp
        // In Program.cs, before builder.Build()
        builder.Host.UseSerilog((context, configuration) =>
            configuration.ReadFrom.Configuration(context.Configuration));
        ```
4.  **Configure Serilog in `appsettings.json`**:
    *   Add a `Serilog` section to your `appsettings.json`.
    *   Configure the `Console` sink and a rolling `File` sink.
        ```json
        "Serilog": {
          "MinimumLevel": "Information",
          "WriteTo": [
            { "Name": "Console" },
            {
              "Name": "File",
              "Args": {
                "path": "logs/log-.txt",
                "rollingInterval": "Day"
              }
            }
          ]
        }
        ```
5.  **Write a Structured Log**:
    *   In a controller, use the injected `ILogger` to write a log with parameters. Serilog automatically makes this a structured log.
        ```csharp
        var user = new { Name = "Alice", Id = 123 };
        _logger.LogInformation("User {User} checked out.", user);
        ```
    *   Check the console output and the log file. You should see the log message with the user object serialized as JSON.

### 📚 Application Insights Integration

1.  **What is Application Insights?**: Research what Application Insights is. What kind of telemetry does it collect automatically? (e.g., requests, dependencies, exceptions).
2.  **Setup in Azure**:
    *   (Requires an Azure account) Create an Application Insights resource in the Azure portal.
    *   Find and copy the `ConnectionString` for your new resource.
3.  **Add the NuGet Package**: Add the `Microsoft.ApplicationInsights.AspNetCore` package to your project.
4.  **Configure in Code**:
    *   In `Program.cs`, register the Application Insights telemetry service.
        ```csharp
        builder.Services.AddApplicationInsightsTelemetry(builder.Configuration);
        ```
5.  **Configure in `appsettings.json`**:
    *   Add the Application Insights connection string to your `appsettings.json` file.
        ```json
        "ApplicationInsights": {
          "ConnectionString": "YOUR_CONNECTION_STRING_HERE"
        }
        ```
    *   Use User Secrets to store the actual connection string for local development.
6.  **Run and Verify**:
    *   Run your application and make a few requests to your API endpoints.
    *   Go to the Application Insights resource in the Azure portal. After a few minutes, you should see data appearing in the "Live Metrics" and "Search" blades.
    *   Trigger an unhandled exception in your app. Find the exception details in Application Insights under the "Failures" blade.

---

## 🧪 Unit Testing in .NET Core

### 📚 xUnit Testing Framework

1.  **Your First Test**:
    *   Create a simple class library project with a `Calculator` class that has an `Add(int a, int b)` method.
    *   Create a corresponding xUnit test project.
    *   Write a test method using the `[Fact]` attribute to test the `Add` method with specific inputs (e.g., `2 + 2 = 4`).
2.  **Assertions**:
    *   Explore common xUnit assertions within your tests.
    *   `Assert.Equal()`: You've already used this.
    *   `Assert.Throws<T>()`: Test a method that should throw an exception (e.g., a `Divide` method with a zero divisor).
    *   `Assert.True()` / `Assert.False()`: Test a method that returns a boolean.
    *   `Assert.Null()` / `Assert.NotNull()`: Test for nulls.
3.  **Data-Driven Tests with `[Theory]`**:
    *   The `Add` method is a great candidate for a data-driven test.
    *   Convert your `[Fact]` into a `[Theory]`.
    *   Use the `[InlineData]` attribute to provide several sets of inputs and expected outputs for your `Add` method.
        ```csharp
        [Theory]
        [InlineData(1, 2, 3)]
        [InlineData(-1, 1, 0)]
        [InlineData(0, 0, 0)]
        public void Add_ShouldReturnCorrectSum(int a, int b, int expected)
        {
            // ... test logic
        }
        ```
4.  **Setup and Teardown**:
    *   xUnit uses the constructor for test setup and `IDisposable` for teardown.
    *   Create a test class that implements `IDisposable`.
    *   In the constructor, log "Setting up...". In the `Dispose` method, log "Tearing down...".
    *   Write a couple of `[Fact]`s in the class and run them. Observe the output to see when the constructor and `Dispose` are called for each test.

### 📚 Test Project Setup and Organization

1.  **Create a Test Project**:
    *   Use the .NET CLI (`dotnet new xunit`) to create a new test project.
    *   Add a project reference from your test project to your main class library or API project (`dotnet add reference`).
2.  **The Arrange-Act-Assert (AAA) Pattern**:
    *   This is a fundamental pattern for organizing your test code to be readable and clear.
    *   Rewrite one of your existing tests to explicitly use comments to separate the three sections:
        ```csharp
        // Arrange
        var calculator = new Calculator();
        
        // Act
        var result = calculator.Add(2, 3);
        
        // Assert
        Assert.Equal(5, result);
        ```
3.  **Test Naming Conventions**:
    *   Good test names are descriptive. A common convention is `MethodName_Scenario_ExpectedBehavior`.
    *   Rename your tests to follow this convention. For example: `Add_SimpleValues_ReturnsSum`, `Divide_ByZero_ThrowsDivideByZeroException`.
4.  **Running Tests**:
    *   Run your tests from the command line using `dotnet test`.
    *   Explore the Test Explorer in Visual Studio or the Testing sidebar in VS Code. Learn how to run all tests, run a single test, and debug a test.

### 📚 Mocking with Moq Framework

1.  **Why Mocking?**: You want to test a class in *isolation*. If your class `A` depends on an interface `B`, you don't want to use a real implementation of `B` in your test for `A`. Instead, you create a "mock" `B`.
2.  **Setup and Installation**:
    *   Add the `Moq` NuGet package to your test project.
    *   Create an `IProductRepository` interface with a method `Product GetById(int id)`.
    *   Create a `ProductService` class that takes `IProductRepository` in its constructor.
3.  **Creating a Mock**:
    *   In your test class for `ProductService`, create a mock of the repository:
        ```csharp
        var mockRepo = new Mock<IProductRepository>();
        ```
4.  **Setting Up Behavior**:
    *   Use the `Setup` method to tell the mock how to behave when its methods are called.
    *   Set up the `GetById` method to return a specific `Product` when called with a specific ID.
        ```csharp
        // Arrange
        var mockRepo = new Mock<IProductRepository>();
        mockRepo.Setup(repo => repo.GetById(1))
                .Returns(new Product { Id = 1, Name = "Test Product" });
        
        var service = new ProductService(mockRepo.Object); // Pass the mocked object
        ```
5.  **Verifying Calls**:
    *   After you "Act", you can verify that methods on your mock were called as expected.
    *   Write a test for a `DeleteProduct` method. After calling it, verify that the repository's `Delete` method was called exactly once with the correct ID.
        ```csharp
        // Assert
        mockRepo.Verify(repo => repo.Delete(1), Times.Once);
        ```

### 📚 Test-Driven Development (TDD) Practices

1.  **The TDD Cycle (Red-Green-Refactor)**:
    *   **Red**: Write a failing test for a feature that doesn't exist yet. The test won't even compile at first.
    *   **Green**: Write the simplest possible production code to make the test pass. No more, no less.
    *   **Refactor**: Clean up the production code and the test code without changing the functionality.
2.  **TDD in Action - A Simple Validator**:
    *   You need to build a `PasswordValidator` class with a method `bool IsValid(string password)`.
    *   **RED**: Write a test `IsValid_WhenPasswordIsShorterThan8_ReturnsFalse`. It will fail because `PasswordValidator` doesn't exist.
    *   **GREEN**: Create the class and method. Make it return `true` just to see the test fail correctly. Then, add the logic `if (password.Length < 8) return false;` to make it pass.
    *   **RED**: Write a new test `IsValid_WhenPasswordHasNoUppercase_ReturnsFalse`. It will fail.
    *   **GREEN**: Add the simplest code to check for an uppercase letter to make the new test pass (while ensuring the old one still passes).
    *   **REFACTOR**: Look at your `IsValid` method. Is there any duplication? Can it be made cleaner or more efficient? Refactor the code. All tests should still pass.
    *   Continue this cycle for other rules (e.g., must contain a number).

---

## 🛡️ Security Fundamentals in .NET Core

### 📚 Authentication and Authorization

1.  **The Core Concepts**: In your own words, explain the difference between **Authentication** ("Who are you?") and **Authorization** ("What are you allowed to do?").
2.  **Middleware Order**: In `Program.cs`, you typically see `app.UseAuthentication()` followed by `app.UseAuthorization()`. Why is this order critical? What would happen if they were reversed?
3.  **Protecting an Endpoint**:
    *   Start with a new or existing Web API project.
    *   Add the `[Authorize]` attribute to a controller or a specific action method.
    *   Attempt to access this endpoint without being authenticated (e.g., using a browser or Postman). What HTTP status code do you receive?
4.  **Role-Based Authorization**:
    *   Create a simple in-memory user store or service for demonstration purposes. Create two users, one with an "Admin" role and one with a "User" role.
    *   When generating the user's identity (`ClaimsPrincipal`), add a `Claim` for their role (e.g., `new Claim(ClaimTypes.Role, "Admin")`).
    *   Protect an endpoint using `[Authorize(Roles = "Admin")]`.
    *   Protect another endpoint using `[Authorize(Roles = "Admin,User")]`.
    *   Test that only users with the correct roles can access these endpoints.
5.  **Policy-Based Authorization**:
    *   Policies offer more flexible and reusable authorization logic than roles.
    *   In `Program.cs`, define a policy that requires a user to have a specific claim, for example, a "DateOfBirth" claim, and be over 21.
        ```csharp
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("AtLeast21", policy =>
                policy.Requirements.Add(new MinimumAgeRequirement(21)));
        });
        // You would need to implement the MinimumAgeRequirement and its handler.
        ```
    *   Apply this policy to an endpoint using `[Authorize(Policy = "AtLeast21")]`.

### 📚 JWT Token Implementation

1.  **Setup JWT Authentication**:
    *   Add the `Microsoft.AspNetCore.Authentication.JwtBearer` NuGet package to your project.
    *   In `Program.cs`, configure the JWT Bearer authentication scheme. You'll need to set up `TokenValidationParameters`, including the `ValidIssuer`, `ValidAudience`, and the `IssuerSigningKey`.
    *   Store your JWT Key, Issuer, and Audience in `appsettings.json` and use User Secrets for the key itself.
2.  **Token Generation Endpoint**:
    *   Create a new controller, e.g., `AuthController`, with a `Login` endpoint.
    *   This endpoint should accept a username and password.
    *   After validating the credentials (against a dummy user store for now), generate a JWT. This involves:
        *   Creating a list of claims for the user (e.g., `NameIdentifier`, `Email`, `Role`).
        *   Creating a `SymmetricSecurityKey` using your secret key.
        *   Creating the `JwtSecurityToken` with the issuer, audience, claims, expiration date, and signing credentials.
        *   Using `JwtSecurityTokenHandler` to write the token to a string.
    *   Return the token string to the client.
3.  **Using the Token**:
    *   Use a tool like Postman or Insomnia.
    *   First, call your `Login` endpoint to get a token.
    *   Then, call an endpoint protected with `[Authorize]`. In the request, add an `Authorization` header with the value `Bearer <your_token_here>`.
    *   Verify that you can now access the protected resource.
4.  **Anatomy of a JWT**:
    *   Take one of your generated tokens and paste it into a tool like [jwt.io](https://jwt.io/).
    *   Identify the three parts: Header, Payload, and Signature.
    *   What information is in the payload? Can you see the claims you added?
    *   Explain why the information in the payload is considered "signed" but not "encrypted".

### 📚 HTTPS and SSL Configuration

1.  **HTTPS by Default**:
    *   Examine the `Properties/launchSettings.json` file in your project. Note how the `applicationUrl` property specifies both `http` and `https://` addresses.
    *   The default project template also includes `app.UseHttpsRedirection();`. What does this middleware do?
2.  **HSTS (HTTP Strict Transport Security)**:
    *   In `Program.cs`, the template adds `app.UseHsts();` inside the `if (!app.Environment.IsDevelopment())` block.
    *   What is HSTS? How does it protect against man-in-the-middle attacks like SSL stripping? Why is it typically enabled only in production?
3.  **Development Certificates**:
    *   .NET uses a self-signed development certificate to enable HTTPS on your local machine.
    *   Run the command `dotnet dev-certs https --check`.
    *   If the certificate is not trusted, run `dotnet dev-certs https --trust`. What does this command do?
4.  **Configuring Kestrel for HTTPS**:
    *   While `launchSettings.json` is used by Visual Studio and `dotnet run`, you can also configure HTTPS directly in `appsettings.json` or code for production environments.
    *   Research how to configure Kestrel endpoints and certificates in `appsettings.json`. This is how you would configure a real SSL certificate in a production deployment.

### 📚 Input Validation and Sanitization

1.  **Preventing Bad Data with Model Validation**:
    *   This is your first line of defense. On your DTOs (Data Transfer Objects), use data annotation attributes to enforce rules.
    *   Create a `RegisterUserDto` with `Email` and `Password` fields.
    *   Add attributes like `[Required]`, `[EmailAddress]`, and `[StringLength(100, MinimumLength = 8)]`.
    *   The `[ApiController]` attribute automatically triggers model validation and returns a 400 Bad Request response if the rules are violated. Test this.
2.  **SQL Injection and EF Core**:
    *   Explain what a SQL injection attack is. Provide a classic example like `' OR 1=1 --`.
    *   How does Entity Framework Core's use of parameterized queries (e.g., `context.Users.Where(u => u.Name == userName)`) prevent this type of attack by default?
3.  **Cross-Site Scripting (XSS)**:
    *   Explain the difference between Reflected XSS and Stored XSS.
    *   Create an API endpoint that accepts a `comment` string and stores it in an in-memory list. Create another endpoint that retrieves all comments.
    *   Use Postman to submit a comment containing a script tag: `<script>alert('XSS');</script>`.
    *   If a simple frontend were to render this comment as raw HTML, the script would execute.
4.  **Sanitization**:
    *   To prevent Stored XSS, you must sanitize user input that contains HTML.
    *   Add the `HtmlSanitizer` NuGet package to your project.
    *   Before saving the user's comment, use the sanitizer to strip out any dangerous tags and attributes.
        ```csharp
        var sanitizer = new HtmlSanitizer();
        var sanitizedComment = sanitizer.Sanitize(userInput.Comment);
        // Store the sanitizedComment
        ```
    *   Submit the malicious script again. After sanitization, what does the stored string look like?

---

## 🚀 Deployment and Hosting for .NET Core

### 📚 Self-Contained vs. Framework-Dependent Deployment

1.  **Framework-Dependent Deployment (FDD)**:
    *   Take an existing Web API project.
    *   Publish it as a framework-dependent application by running `dotnet publish -c Release`.
    *   Examine the contents of the `publish` directory. Note the small size. What is the main DLL file?
    *   What are the prerequisites for running this application on a target machine? What are the pros and cons of this approach?
2.  **Self-Contained Deployment (SCD)**:
    *   Now, publish the same application as a self-contained deployment for a specific platform (e.g., Linux).
    *   Run `dotnet publish -c Release --runtime linux-x64 --self-contained true`.
    *   Examine the `publish` directory again. Compare its size to the FDD output. What new files and folders do you see?
    *   What are the pros and cons of SCD? When would you choose it over FDD?
3.  **Trimming Assemblies**:
    *   For self-contained deployments, you can reduce the size by trimming unused assemblies.
    *   Publish the self-contained app again, but this time add the `/p:PublishTrimmed=true` flag.
    *   Compare the output size. What are the potential risks of trimming?
4.  **ReadyToRun (R2R) Compilation**:
    *   Ahead-of-Time (AOT) compilation can improve startup performance.
    *   Publish the application with the ReadyToRun option: `dotnet publish -c Release -r linux-x64 --self-contained true /p:PublishReadyToRun=true`.
    *   Discuss the trade-offs of using R2R (larger file size vs. faster startup).

### 📚 Docker Containerization

1.  **Add Docker Support**:
    *   (Requires Docker Desktop) In Visual Studio, you can right-click the project and "Add > Docker Support". Alternatively, add a `Dockerfile` to your project manually.
2.  **Analyze the Multi-Stage `Dockerfile`**:
    *   Examine the generated `Dockerfile`. It uses a multi-stage build.
    *   **`base` stage**: What is the purpose of this initial stage?
    *   **`build` stage**: This stage uses an SDK image. Why? What commands are run here (`dotnet restore`, `dotnet build`)?
    *   **`publish` stage**: This stage also uses the SDK image to publish the application.
    *   **`final` stage**: This stage uses the lean `aspnet` runtime image, not the SDK image. Why is this important for security and image size? It copies the published output from the `publish` stage.
3.  **Build and Run the Container**:
    *   From your terminal in the project's root directory, build the Docker image: `docker build -t my-awesome-api .`.
    *   Run the container, mapping a local port to the container's port 80: `docker run -p 8080:80 my-awesome-api`.
    *   Access your API at `http://localhost:8080`.
4.  **`.dockerignore` File**:
    *   Examine the `.dockerignore` file. Why is it important to exclude folders like `bin` and `obj` from the Docker build context? How does this improve build times?
5.  **Docker Compose for Multi-Container Apps**:
    *   Imagine your application also needs a database (e.g., PostgreSQL).
    *   Create a `docker-compose.yml` file that defines two services: your Web API and a `postgres` database image.
    *   Configure the API service to use an environment variable for the connection string, which points to the database service.
    *   Run `docker-compose up` to start both containers.

### 📚 Azure App Service Deployment

1.  **Create an App Service**:
    *   (Requires an Azure account) In the Azure portal, create a new "Web App".
    *   Choose a runtime stack (e.g., .NET 7 on Linux).
    *   Choose a pricing plan (the Free tier is sufficient for this).
2.  **Deployment Method 1: Visual Studio Publish**:
    *   Right-click your project in Visual Studio and select "Publish".
    *   Choose "Azure" as the target and sign in.
    *   Select your newly created App Service and publish the application.
    *   This is a quick way to deploy, but less repeatable than other methods.
3.  **Deployment Method 2: Azure CLI**:
    *   Zip the contents of your `publish` directory.
    *   Use the Azure CLI to deploy the zipped file: `az webapp deploy --resource-group <YourRG> --name <YourAppName> --src-path <path-to-zip>`.
4.  **Deployment Method 3: CI/CD with GitHub Actions**:
    *   Push your project code to a GitHub repository.
    *   In the Azure portal, go to your App Service's "Deployment Center".
    *   Connect it to your GitHub repository. It will automatically generate a GitHub Actions workflow file and commit it to your repo.
    *   Examine the generated `.yml` file. Understand the steps: build, publish, and deploy.
    *   Make a change to your code and push it to the main branch. Watch the action run automatically and deploy the new version.
5.  **Configuration in Azure**:
    *   Go to the "Configuration" blade in your App Service.
    *   Add an "Application setting" that overrides a value from your `appsettings.json` (e.g., `AppSettings:Author`).
    *   These settings are exposed as environment variables to your application. Verify that the new value is being used. This is the correct way to handle secrets and environment-specific settings in Azure.

### 📚 Performance Optimization Techniques

1.  **Response Caching**:
    *   Implement response caching for an endpoint that returns data that doesn't change often.
    *   Add the response caching middleware in `Program.cs`: `app.UseResponseCaching();`.
    *   Add the `[ResponseCache(Duration = 60)]` attribute to a controller action.
    *   Use your browser's developer tools or Postman to inspect the response headers (`Age`, `Cache-Control`). Make a second request within 60 seconds and verify that the response is served from the cache.
2.  **Response Compression**:
    *   Add the response compression middleware: `app.UseResponseCompression();`.
    *   Configure it in `Program.cs`: `builder.Services.AddResponseCompression(...)`.
    *   Make a request with an `Accept-Encoding: gzip` header. Check the response headers to confirm the content is compressed (`Content-Encoding: gzip`) and that the content length is smaller.
3.  **Asynchronous Operations**:
    *   Review your application for any long-running, I/O-bound operations (database calls, HTTP requests) that are not using `async` and `await`.
    *   Explain how blocking I/O operations can hurt application scalability by holding onto threads. How does `async/await` solve this?
4.  **Profiling**:
    *   Use a profiling tool to identify performance bottlenecks.
    *   **Visual Studio**: Use the built-in Performance Profiler (Debug > Performance Profiler).
    *   **.NET CLI Tools**: Use `dotnet-trace` to collect a trace of your running application. Use `dotnet-counters` to monitor real-time performance counters (like request rate, heap size, etc.).