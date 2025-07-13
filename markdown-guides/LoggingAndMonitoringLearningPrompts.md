# Logging and Monitoring in .NET Core: Learning Prompts

## 📈 Implementing Logging and Application Monitoring (Beginner)

---

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

---

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

---

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

---

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