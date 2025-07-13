# Security Fundamentals in .NET Core: Learning Prompts

## 🛡️ Implementing Security in .NET Core Applications (Advanced)

---

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

---

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

---

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

---

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