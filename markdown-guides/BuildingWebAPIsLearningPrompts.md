# Building Web APIs with ASP.NET Core: Learning Prompts

## 🛠️ Creating RESTful APIs with ASP.NET Core (Intermediate)

---

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

---

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

---

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

---

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