# .NET Core Development Guide: Learning Prompts

## 📖 A comprehensive guide to setting up your .NET development environment and using the .NET CLI.

---

### 📚 SDK Installation and Setup

1.  **Verify .NET Installation**: Open your terminal or command prompt and run `dotnet --version`. What version of the .NET SDK is installed? If it's not installed, download and install it from the official .NET website.
2.  **Explore SDKs and Runtimes**: Run `dotnet --list-sdks` and `dotnet --list-runtimes`. What is the difference between an SDK and a runtime?
3.  **Hello, .NET!**: Create a new directory for a project. Navigate into it and run `dotnet new console`. What files were created?
4.  **Run Your First App**: Run the newly created console application using the .NET CLI.
5.  **IDE Setup**:
    *   **Visual Studio Code**: Install the C# extension from the Visual Studio Marketplace. Open your project folder and try running it from the integrated terminal.
    *   **Visual Studio**: If you have Visual Studio, open the `.csproj` file. Explore the Solution Explorer and try running the project.

---

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

---

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

---

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