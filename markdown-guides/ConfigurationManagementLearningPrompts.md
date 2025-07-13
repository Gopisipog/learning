# Configuration Management in .NET Core: Learning Prompts

## ⚙️ Managing Application Settings and Configuration (Beginner)

---

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

---

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

---

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

---

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