# Middleware Pipeline in ASP.NET Core: Learning Prompts

## 🔗 Understanding the Request/Response Pipeline (Intermediate)

---

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

---

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

---

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

---

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