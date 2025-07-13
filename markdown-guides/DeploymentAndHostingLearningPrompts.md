# Deployment and Hosting for .NET Core: Learning Prompts

## 🚀 Deploying .NET Core Applications (Advanced)

---

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

---

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

---

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

---

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