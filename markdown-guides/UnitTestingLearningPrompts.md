# Unit Testing in .NET Core: Learning Prompts

## 🧪 Writing and Running Unit Tests (Intermediate)

---

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

---

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

---

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

---

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