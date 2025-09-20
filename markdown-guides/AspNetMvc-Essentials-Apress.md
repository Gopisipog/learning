# ASP.NET Core MVC Essentials (Overview, Controllers & Action Results, Filters)

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

## 3) Filters (Ch.19)

Purpose
- Encapsulate cross-cutting concerns around action execution and result processing (authz checks, logging, caching, exception handling, etc.).

Filter types in ASP.NET Core
- Authorization filters — run early to enforce authorization.
- Resource filters — wrap model binding; can short-circuit very early.
- Action filters — before/after action execution (OnActionExecuting/Executed or async equivalents).
- Result filters — before/after result execution (OnResultExecuting/Executed).
- Exception filters — handle exceptions and optionally replace the result.

Scopes & order
- Scopes: Global (MvcOptions.Filters), Controller, Action.
- Order: default stack is Global → Controller → Action; unwinds in reverse for “after” methods. Order attributes can fine-tune.

Short-circuiting
- Set context.Result (e.g., in resource/action/result filters) to stop the pipeline and immediately return a specific IActionResult.
- Exception filters can mark exceptions as handled and supply a replacement result.

Implementing filters
```csharp
public class LogActionAttribute : ActionFilterAttribute {
  public override void OnActionExecuting(ActionExecutingContext ctx) {
    var route = ctx.RouteData.Values; // controller/action
    // log here
  }
}

[LogAction]
public class OrdersController : Controller {
  public IActionResult Index() => View();
}
```

Async filters
- Prefer async interfaces (e.g., IAsyncActionFilter) for non-blocking work; call next() to continue the pipeline.

Registration patterns
- Attribute-based: decorate controllers/actions with filter attributes.
- Global: services.AddControllersWithViews(o => o.Filters.Add(new MyFilter()));
- DI-aware filters: register filter types in DI and use ServiceFilterAttribute or TypeFilterAttribute.

---

## Practical tips & pitfalls
- Keep controllers thin — push domain logic into services. Test controllers in isolation by mocking dependencies.
- Choose the most specific ActionResult possible (improves clarity and API correctness).
- Make routing explicit with attribute routing when endpoints proliferate.
- Validate inputs with data annotations and custom validators; guard with ModelState.
- Use filters/middleware for cross-cutting: logging, caching, auth, error handling.
- For APIs, prefer ActionResult<T> for clear contracts and HTTP semantics.

---

## Quick checklist
- [ ] Routes configured (attribute or conventional) and predictable
- [ ] Controllers small, single-responsibility
- [ ] Appropriate IActionResult/ActionResult<T> returned
- [ ] Model binding + validation with ModelState checks
- [ ] Filters used for cross-cutting concerns; order understood
- [ ] Unit tests for controllers and filters

