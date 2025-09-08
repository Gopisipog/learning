# ASP.NET MVC Essentials (Overview, Controllers & Action Results, Filters)

This guide distills the essentials from Microsoft Docs for classic ASP.NET MVC (MVC 5 era) with brief nods to ASP.NET Core where terminology differs. Use it as a quick-reference when building or reviewing MVC applications.

References (Microsoft Learn):
- Overview (classic): https://learn.microsoft.com/aspnet/mvc/overview/older-versions-1/overview/asp-net-mvc-overview
- Controllers & Actions (classic): https://learn.microsoft.com/aspnet/mvc/overview/older-versions-1/controllers-and-routing/aspnet-mvc-controllers-overview-cs
- Filters (classic): https://learn.microsoft.com/previous-versions/aspnet/gg416513(v=vs.98)
- Action Filters tutorial: https://learn.microsoft.com/aspnet/mvc/overview/older-versions-1/controllers-and-routing/understanding-action-filters-cs
- ASP.NET Core equivalents (for comparison):
  - Core MVC Overview: https://learn.microsoft.com/aspnet/core/mvc/overview
  - Core Controllers/Actions: https://learn.microsoft.com/aspnet/core/mvc/controllers/actions
  - Core Filters: https://learn.microsoft.com/aspnet/core/mvc/controllers/filters

---

## 1) ASP.NET MVC Overview (classic)

Key ideas
- Model–View–Controller (MVC) pattern:
  - Model: app data and business rules
  - View: UI/templating
  - Controller: request handling, orchestration
- Separation of concerns improves testability and maintainability.
- Convention over configuration: sensible defaults reduce boilerplate.
- URL Routing: Maps incoming URLs to controller actions (no .aspx pages). Default pattern: `{controller}/{action}/{id}` with defaults like `Home/Index/{id?}`.
- Strongly-typed views: leverage model types and HTML helpers.
- Unit test friendly: controllers are plain classes; dependencies can be mocked.

Typical project structure
- Controllers (e.g., `HomeController`)
- Models (POCOs)
- Views (Razor `.cshtml` in `Views/{Controller}/{Action}.cshtml`)
- Shared views/layouts (`Views/Shared/_Layout.cshtml`)
- Route registration (in classic, `RouteConfig`); in Core, routing middleware.

---

## 2) Controllers and Action Results

Controllers
- Class that derives from `System.Web.Mvc.Controller` (classic) or `Controller` base type.
- Public methods on a controller that can be invoked via routing are called action methods.
- Action selection depends on method name, HTTP verb attributes (e.g., `[HttpGet]`, `[HttpPost]`), and optionally attribute routing.

Parameters & model binding
- MVC binds incoming request data (route values, query string, form data) to action parameters.
- Complex types are bound by matching property names; validation uses data annotations.

Action results (classic)
- All actions typically return `ActionResult` or a derived type:
  - `ViewResult`: render a view (Razor)
  - `RedirectResult` / `RedirectToRouteResult`: redirect to URL or route
  - `JsonResult`: return JSON
  - `ContentResult`: return raw content
  - `FileResult` (and subclasses): return files/streams
  - `HttpStatusCodeResult`: return specific HTTP status codes
  - `EmptyResult`: no response body

Examples (classic MVC)
```csharp
public class ProductsController : Controller
{
    // GET: /Products/Details/5
    public ActionResult Details(int id)
    {
        var model = _repo.GetProduct(id);
        if (model == null) return HttpNotFound();
        return View(model); // ViewResult
    }

    [HttpPost]
    public ActionResult Save(ProductDto input)
    {
        if (!ModelState.IsValid) return View(input);
        _service.Save(input);
        return RedirectToAction("Details", new { id = input.Id });
    }

    public ActionResult DownloadManual(int id)
    {
        var bytes = _repo.GetManual(id);
        return File(bytes, "application/pdf", fileDownloadName: $"manual-{id}.pdf");
    }
}
```

ASP.NET Core notes
- Controllers inherit from `ControllerBase`/`Controller` in the `Microsoft.AspNetCore.Mvc` namespace.
- Richer return type support, including `IActionResult`, `ActionResult<T>`, and automatic negotiation for APIs.

---

## 3) Filters

Purpose
- Inject cross-cutting behavior around action execution and result generation (e.g., auth, caching, logging, exception handling).

Filter types (classic MVC)
- Authorization filters (`IAuthorizationFilter`): run first to authorize requests.
- Action filters (`IActionFilter`): code before/after action method (`OnActionExecuting/Executed`).
- Result filters (`IResultFilter`): code before/after result execution (`OnResultExecuting/Executed`).
- Exception filters (`IExceptionFilter`): handle exceptions thrown during action or result execution.

Scopes and order
- Scopes: Global, Controller, Action (action-level filters run last by default).
- Order: Use the `Order` property on filter attributes to control execution order.

Registration
- Global: in classic, via `GlobalFilters.Filters.Add(new HandleErrorAttribute());`
- Controller/action: decorate with attributes, e.g. `[Authorize]`, `[OutputCache]`, custom attributes.

Custom filter example (classic)
```csharp
public class LogActionAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        var route = filterContext.RouteData;
        // log route.Values["controller"], route.Values["action"]
        base.OnActionExecuting(filterContext);
    }
}

[LogAction]
public class OrdersController : Controller
{
    public ActionResult Index() => View();
}
```

Common built-in filters (classic)
- `[Authorize]`: enforce authentication/roles
- `[OutputCache]`: cache action results (classic only; in Core use Response Caching/Middleware)
- `[HandleError]`: handle exceptions and show error views (Core uses exception handling middleware / filters)

ASP.NET Core filter equivalents
- Types: Authorization, Resource, Action, Exception, and Result filters (resource wraps model binding too).
- Registration: attributes, `MvcOptions.Filters`, DI-enabled filters.
- Short-circuit by setting `context.Result` (in Core) to skip pipeline continuation.

---

## Practical tips
- Keep controllers thin: validation, orchestration, selection of action results. Push business logic into services.
- Prefer view models/DTOs over domain entities in actions/views.
- Centralize cross-cutting concerns with filters or middleware (Core).
- Validate model binding with data annotations and `ModelState.IsValid`.
- Use attribute routing to make endpoints explicit when helpful.
- Return appropriate results (e.g., `HttpNotFound`, redirects, files) to clearly communicate outcomes.

---

## Quick checklist
- [ ] Routes defined and predictable
- [ ] Controller actions small and single-purpose
- [ ] Correct ActionResult type returned
- [ ] Model validation and error handling in place
- [ ] Filters used for cross-cutting behavior
- [ ] Unit tests for controllers and filters

