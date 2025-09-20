# ASP.NET Core MVC Essentials (Enhanced from Apress Pro ASP.NET Core MVC 6th Edition)

Source: Apress — Pro ASP.NET Core MVC (6th Edition). These notes condense the essentials from:
- Chapter 1: ASP.NET Core MVC in Context (MVC overview, routing, platform)
- Chapter 17: Controllers and Actions (controllers, parameters, results)
- Chapter 19: Filters (cross-cutting behaviors, order, short-circuiting)

Note: This cheatsheet focuses on ASP.NET Core MVC (not classic System.Web MVC). Terminology overlaps but differs in places (e.g., Resource filters in Core).

---

## 1) Overview: MVC in ASP.NET Core

Core concepts (Ch.1)
- MVC pattern separates concerns:
  - Model: app state/domain + business rules
  - View: UI/templating (Razor)
  - Controller: request handling and orchestration
- Routing maps incoming URLs to controllers/actions (middleware-based pipeline in Core).
- Controllers are plain .NET classes discovered via conventions; easy to unit test.
- Middleware pipeline processes HTTP requests before/after MVC (authn, static files, sessions, etc.).
- Attribute routing supported alongside convention-based routing.

Routing (Ch.15 intro referenced)
- Selects controller/action from URL (incoming) and can generate URLs (outgoing) via helpers/tag helpers.
- Attribute routing: decorate controllers/actions with [Route], [HttpGet("pattern")], etc.
- Convention-based routing: configured in Startup (MapControllerRoute, etc.).

Key advantages
- Testability: controllers are newed up per-request; dependencies provided via DI.
- Flexibility: pluggable filters, result types, model-binding & validation system, Tag Helpers.

---

## 2) Controllers, Actions, Parameters, Results (Ch.17)

Controllers
- Discovered classes (usually named *Controller) whose public methods are actions.
- Inherit from ControllerBase/Controller for helpers (ModelState, Url, View, TempData, etc.).
- Lifecycle: a new instance per request (no lock/synchronization required for instance members).

Action selection and parameters
- Actions selected by routing + HTTP method attributes ([HttpGet], [HttpPost], etc.).
- Model binding binds route/query/form/body data to parameters and complex types; validate via data annotations; check ModelState.IsValid.

Common return types
- IActionResult (or ActionResult<T>) — flexible, supports content negotiation for APIs.
- ViewResult — return a Razor view (HTML) with a model.
- RedirectResult/RedirectToActionResult/RedirectToRouteResult — client redirection.
- ContentResult — raw text; FileResult family — files/streams; PhysicalFile/VirualFile.
- StatusCodeResult/NotFoundResult/UnauthorizedResult/ForbidResult/NoContentResult, etc.
- ObjectResult/Ok/Created/Accepted — especially for APIs.

Examples
```csharp
public class ProductsController : Controller {
  public IActionResult Details(int id) {
    var model = _repo.Find(id);
    return model is null ? NotFound() : View(model);
  }

  [HttpPost]
  public IActionResult Save(ProductDto dto) {
    if (!ModelState.IsValid) return View(dto);
    _svc.Save(dto);
    return RedirectToAction(nameof(Details), new { id = dto.Id });
  }

  public IActionResult Download(int id) {
    var (bytes, name) = _svc.GetManual(id);
    return File(bytes, "application/pdf", name);
  }
}
```

API-style actions
- Return DTOs directly or use IActionResult helpers: return Ok(data), NotFound(), CreatedAtAction(...), etc.
- Content negotiation determines formatter (System.Text.Json by default). Attributes like [Produces] can constrain content types.

---

## 3) Filters (Ch.19) - Enhanced Details

Purpose
- Encapsulate cross-cutting concerns around action execution and result processing (authz checks, logging, caching, exception handling, etc.).
- Filters run in a specific sequence and can short-circuit the pipeline by setting context.Result.

Filter types and interfaces in ASP.NET Core
- **Authorization filters** — `IAuthorizationFilter` / `IAsyncAuthorizationFilter`
  - Run first, before other filters and action methods
  - Enforce security policy; set context.Result to deny access
- **Resource filters** — `IResourceFilter` / `IAsyncResourceFilter` 
  - Wrap model binding; can short-circuit very early in pipeline
- **Action filters** — `IActionFilter` / `IAsyncActionFilter`
  - `OnActionExecuting()` called before action method
  - `OnActionExecuted()` called after action method
  - Access to ActionExecutingContext/ActionExecutedContext
- **Result filters** — `IResultFilter` / `IAsyncResultFilter`
  - `OnResultExecuting()` called before result processing
  - `OnResultExecuted()` called after result processing
  - Can change/replace the IActionResult from action method
- **Exception filters** — `IExceptionFilter` / `IAsyncExceptionFilter`
  - Handle unhandled exceptions; set context.ExceptionHandled = true

Execution order and scopes
- **Execution sequence**: Authorization → Resource → Action → Result (Exception if thrown)
- **Scopes**: Global → Controller → Action (then unwinds in reverse for "after" methods)
- **Custom order**: Implement `IOrderedFilter` interface with Order property
- Global: `services.AddControllersWithViews(o => o.Filters.Add(...))`

Context objects and short-circuiting
- Each filter type receives specific context objects with request/response data
- **Short-circuit**: Set `context.Result` to skip remaining pipeline and return immediately
- **Exception handling**: Set `context.ExceptionHandled = true` and optionally `context.Result`

Implementing filters

**Action Filter Example:**
```csharp
public class ProfileAttribute : ActionFilterAttribute {
  private Stopwatch timer;
  
  public override void OnActionExecuting(ActionExecutingContext context) {
    timer = Stopwatch.StartNew();
  }
  
  public override void OnActionExecuted(ActionExecutedContext context) {
    timer.Stop();
    // Add timing info to response
    var result = $"<div>Elapsed: {timer.Elapsed.TotalMilliseconds} ms</div>";
    context.HttpContext.Response.WriteAsync(result);
  }
}

[Profile]
public class OrdersController : Controller {
  public IActionResult Index() => View();
}
```

**Result Filter Example:**
```csharp
public class ViewResultDetailsAttribute : ResultFilterAttribute {
  public override void OnResultExecuting(ResultExecutingContext context) {
    if (context.Result is ViewResult vr) {
      // Replace with diagnostic view
      context.Result = new ViewResult {
        ViewName = "Diagnostics",
        ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), 
          new ModelStateDictionary()) {
          Model = new { ViewName = vr.ViewName, ModelType = vr.Model?.GetType().Name }
        }
      };
    }
  }
}
```

**Exception Filter Example:**
```csharp
public class RangeExceptionAttribute : ExceptionFilterAttribute {
  public override void OnException(ExceptionContext context) {
    if (context.Exception is ArgumentOutOfRangeException) {
      context.Result = new ViewResult {
        ViewName = "RangeError",
        ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), 
          new ModelStateDictionary()) {
          Model = context.Exception.Message
        }
      };
      context.ExceptionHandled = true;
    }
  }
}
```

**Async Filter Example:**
```csharp
public class AsyncProfileAttribute : ActionFilterAttribute {
  public override async Task OnActionExecutionAsync(
    ActionExecutingContext context, ActionExecutionDelegate next) {
    
    var timer = Stopwatch.StartNew();
    await next(); // Continue pipeline
    timer.Stop();
    
    await context.HttpContext.Response.WriteAsync(
      $"<div>Async Elapsed: {timer.Elapsed.TotalMilliseconds} ms</div>");
  }
}
```

**Hybrid Action/Result Filter:**
```csharp
public class HybridProfileAttribute : ActionFilterAttribute {
  private Stopwatch timer;
  private double actionTime;
  
  public override async Task OnActionExecutionAsync(
    ActionExecutingContext context, ActionExecutionDelegate next) {
    timer = Stopwatch.StartNew();
    await next();
    timer.Stop();
    actionTime = timer.Elapsed.TotalMilliseconds;
  }
  
  public override void OnResultExecuted(ResultExecutedContext context) {
    var totalTime = timer.Elapsed.TotalMilliseconds;
    var resultTime = totalTime - actionTime;
    // Write timing breakdown
  }
}
```

Dependency injection for filters
- **Problem**: Attribute-based filters can't use constructor DI
- **Solution**: Use `ServiceFilter` or `TypeFilter` attributes
```csharp
// Register filter in DI
services.AddScoped<TimingFilter>();

// Apply with DI
[ServiceFilter(typeof(TimingFilter))]
public class ProductController : Controller { }

// Or use TypeFilter for non-registered types
[TypeFilter(typeof(TimingFilter))]
public IActionResult Details() => View();
```

**Filter with DI dependencies:**
```csharp
public class TimingFilter : IActionFilter {
  private readonly ILogger<TimingFilter> logger;
  
  public TimingFilter(ILogger<TimingFilter> logger) {
    this.logger = logger;
  }
  
  public void OnActionExecuting(ActionExecutingContext context) {
    logger.LogInformation("Action starting: {Action}", 
      context.ActionDescriptor.DisplayName);
  }
  
  public void OnActionExecuted(ActionExecutedContext context) {
    logger.LogInformation("Action completed: {Action}", 
      context.ActionDescriptor.DisplayName);
  }
}
```

Global filter registration
```csharp
// In Startup.ConfigureServices
services.AddControllersWithViews(options => {
  options.Filters.Add<GlobalTimingFilter>(); // Type-based
  options.Filters.Add(new RequireHttpsAttribute()); // Instance-based
  options.Filters.AddService<DiagnosticsFilter>(); // DI-based
});
```

---

## Practical tips & pitfalls
- Keep controllers thin — push domain logic into services. Test controllers in isolation by mocking dependencies.
- Choose the most specific ActionResult possible (improves clarity and API correctness).
- Make routing explicit with attribute routing when endpoints proliferate.
- Validate inputs with data annotations and custom validators; guard with ModelState.
- Use filters/middleware for cross-cutting: logging, caching, auth, error handling.
- For APIs, prefer ActionResult<T> for clear contracts and HTTP semantics.
- Controllers are also action filters (inherit from Controller base class).
- Filter order matters: use IOrderedFilter when default scope-based order isn't sufficient.

---

## Quick checklist
- [ ] Routes configured (attribute or conventional) and predictable
- [ ] Controllers small, single-responsibility
- [ ] Appropriate IActionResult/ActionResult<T> returned
- [ ] Model binding + validation with ModelState checks
- [ ] Filters used for cross-cutting concerns; order understood
- [ ] Unit tests for controllers and filters
- [ ] DI properly configured for filter dependencies
- [ ] Exception filters handle specific exception types appropriately
