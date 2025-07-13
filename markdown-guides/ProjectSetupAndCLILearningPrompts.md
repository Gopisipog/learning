# Learning Prompts: Project Setup and CLI

This guide provides detailed learning prompts for setting up your .NET development environment and mastering the .NET CLI.

## 📚 Topic 1: Installing .NET Core 8.0 SDK

### Conceptual Prompts
- **Prompt:** What is the difference between the .NET SDK and the .NET Runtime? In which scenarios would you install only the runtime?
- **Prompt:** Describe the recommended steps for installing the .NET 8.0 SDK on Windows, macOS, and a popular Linux distribution (e.g., Ubuntu).
- **Prompt:** How can you manage multiple versions of the .NET SDK on a single development machine? What is a `global.json` file and how is it used?
- **Prompt:** Explain the purpose of environment variables like `DOTNET_ROOT` and how they affect the .NET CLI's behavior.

### Practical Exercises
- **Exercise:** Write a script (PowerShell or Bash) that checks if the .NET 8.0 SDK is installed and, if not, downloads and installs it.
- **Exercise:** Install two different versions of the .NET SDK (e.g., 7.0 and 8.0). Create a project that specifically targets the older version using a `global.json` file.

## 📚 Topic 2: Using dotnet CLI commands

### Conceptual Prompts
- **Prompt:** What are the most common `dotnet` CLI commands you would use in a typical development workflow? (e.g., `new`, `build`, `run`, `test`, `publish`).
- **Prompt:** Explain the purpose of the `dotnet restore` command. When is it executed automatically, and when would you need to run it manually?
- **Prompt:** What is the difference between `dotnet run` and executing the compiled application directly?
- **Prompt:** How do you pass command-line arguments to your application when using `dotnet run`?

### Practical Exercises
- **Exercise:** Create a new console application, build it in `Release` configuration, and run it from the command line.
- **Exercise:** Create a simple solution with a class library and a console application. Use only `dotnet` CLI commands to add a reference from the console app to the library, build the solution, and run the app.

## 📚 Topic 3: Creating different project types

### Conceptual Prompts
- **Prompt:** How do you list all available project templates using the `dotnet new` command? How can you search for a specific template?
- **Prompt:** What are the key differences between the following project templates: `console`, `classlib`, `webapi`, and `mvc`?
- **Prompt:** Explain how to create a new project in a specific directory and how to specify the target framework version during creation.
- **Prompt:** What are custom templates in .NET? How can they help in standardizing project creation within a team?

### Practical Exercises
- **Exercise:** Use the `dotnet new` command to create a new ASP.NET Core Web API project. Explore the generated file structure and identify the key components.
- **Exercise:** Find and install a third-party project template from NuGet.org (e.g., for a specific framework like Avalonia or a specific architecture like Clean Architecture) and create a new project from it.

## 📚 Topic 4: Managing NuGet packages

### Conceptual Prompts
- **Prompt:** Explain the process of adding, updating, and removing a NuGet package from a project using the `dotnet add package`, `dotnet remove package`, and related commands.
- **Prompt:** What is the difference between a package reference in a `.csproj` file and a transitive dependency? How can you view the full dependency graph for a project?
- **Prompt:** Describe how to manage package versions, including specifying exact versions, version ranges, and floating versions. What are the pros and cons of each approach?
- **Prompt:** What are local NuGet package sources, and how can you configure the .NET CLI to use a local folder as a package feed?

### Practical Exercises
- **Exercise:** Create a new console application and add the `Newtonsoft.Json` package. Write code to serialize and deserialize a simple object to demonstrate the package is working. Then, update the package to its latest version.
- **Exercise:** Create a class library project, pack it into a NuGet package using `dotnet pack`, and then consume that local package from a separate console application project.