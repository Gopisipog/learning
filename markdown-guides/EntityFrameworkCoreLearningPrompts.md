# Entity Framework Core: Learning Prompts

## 🗄️ Database Operations with EF Core ORM (Intermediate)

---

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

---

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

---

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

---

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