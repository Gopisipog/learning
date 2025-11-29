# Top 50 Node.js / Express Interview Questions – Learning Guide

_Source: Top-200-Node-Interview-Questions-pdf.txt_

1. **What is Node.js?** – Node.js is **not** a language or framework; it is a **JavaScript runtime environment** that lets you execute JavaScript code on the **server side**.
   - *Interview takeaway:* Be clear that Node is a **runtime**, not a framework, and that it brings JavaScript to the **server side**.
2. **How is Node a runtime environment on the server side? What is V8?** – Like browsers run JS with a JS engine, Node runs JS on the server using the **V8 engine** from Chrome, embedding it in a server-side runtime.
   - *Interview takeaway:* Emphasize that Node embeds **Chrome's V8** to execute JS on the server.
3. **What is the difference between a runtime environment and a framework?** – A **runtime environment** (e.g., Node.js, JVM, CPython) provides infrastructure for executing code (memory, I/O, event loop). A **framework** (e.g., Express) provides structured tools, libraries, and patterns to build apps.
   - *Interview takeaway:* Distinguish **runtime (executes code)** vs **framework (organizes app structure)**.
4. **What is the difference between Node.js and Express.js?** – **Node.js** is the JS runtime environment. **Express.js** is a web framework built on top of Node to simplify building HTTP servers and APIs.
   - *Interview takeaway:* Say "Node is the engine; Express is a web framework running on it".
5. **What are the differences between client-side (browser) and server-side (Node.js)?** – Client-side runs in the **browser**, focuses on UI with HTML/CSS/JS and DOM objects. Server-side runs on the **server**, handles business logic, data access, authentication, using Node APIs (request/response, DB, filesystem) without DOM.
   - *Interview takeaway:* Contrast **browser + DOM** vs **server + business logic / data access**.
6. **What are the 7 main features of Node.js?** – Single-threaded, asynchronous, event-driven, based on the V8 engine, cross-platform, uses NPM (package manager), and supports real-time capabilities.
   - *Interview takeaway:* List 3–4 quickly: "single-threaded, async, event-driven, V8-based".
7. **What is single-threaded programming?** – There is only **one thread** executing all tasks sequentially in that process; Node uses a single main thread with an event loop.
   - *Interview takeaway:* Connect "single-threaded" with "Node's event loop on one main thread".
8. **What is synchronous programming?** – Tasks run **one after another**; each operation blocks until it finishes before the next one starts.
   - *Interview takeaway:* Use "blocking and sequential" as key phrases for synchronous.
9. **What is multi-threaded programming?** – Multiple **threads** run tasks **in parallel**; new threads can be created so different tasks can progress simultaneously.
   - *Interview takeaway:* Highlight "multiple threads in parallel" and mention scaling CPU-bound work.
10. **What is asynchronous programming?** – Tasks are **started** but not waited on; the thread continues, and **callbacks/events/promises** handle results later, enabled by Node's event-driven, non-blocking architecture.
   - *Interview takeaway:* Mention "non-blocking" and "callbacks/promises/events" for async.
11. **What is the difference between synchronous and asynchronous programming?** – Synchronous = blocking, sequential; Asynchronous = non-blocking, tasks can overlap in time and complete via callbacks/events.
   - *Interview takeaway:* Clearly contrast **blocking vs non-blocking** execution.
12. **What are events, EventEmitter, event queue, event loop, and event-driven?** – An **event** signals something happened; **EventEmitter** emits events; the **event queue** stores them; the **event loop** pulls events and runs handlers; **event-driven** means flow is driven by events rather than straight-line code.
   - *Interview takeaway:* Show you know the chain: **EventEmitter → event queue → event loop → handlers**.
13. **What are the main features and advantages of Node.js?** – Asynchronous and non-blocking, fast V8 execution, event-driven, cross-platform, uses JavaScript end-to-end, and scales well for many concurrent connections.
   - *Interview takeaway:* Focus on "non-blocking, fast V8, JS everywhere, good for many concurrent clients".
14. **What are the disadvantages of Node.js? When to use and when not to use it?** – Great for **real-time apps**, REST APIs, microservices, and I/O-heavy workloads; **not ideal** for CPU-intensive tasks like heavy image/video processing or crypto, where multi-threaded runtimes perform better.
   - *Interview takeaway:* Say "use Node for I/O-bound, avoid it for CPU-bound heavy computation".
15. **How do you set up a Node.js project?** – Install Node and VS Code, create a folder, open it in VS Code, run `npm init -y` to create `package.json`, add an `app.js` file, and run the app with `node app.js`.
   - *Interview takeaway:* Remember **`npm init -y` + `node app.js`** as the basic setup steps.
16. **What is NPM? What is the role of the `node_modules` folder?** – **NPM** (Node Package Manager) manages dependencies; `node_modules` stores all installed packages and their transitive dependencies for that project.
   - *Interview takeaway:* Say "npm is the package manager; `node_modules` holds the installed libraries".
17. **What is the role of the `package.json` file in Node?** – It holds **project metadata** (name, version, description, author, license) and defines **dependencies, scripts, and config** for the Node project.
   - *Interview takeaway:* Mention that `package.json` is the **manifest** for your Node project.
18. **What are modules in Node? What is the difference between a function and a module?** – A **module** is typically a JS file encapsulating related functionality; a **function** is a single reusable procedure *inside* a module. Modules can contain many functions/values and are the main unit of reuse.
   - *Interview takeaway:* Emphasize that **modules are files**, while functions are pieces of logic inside them.
19. **How many ways are there to export a module?** – Two primary ways: using **`module.exports`** and using the **`exports`** shortcut object.
   - *Interview takeaway:* Be able to write **both `module.exports = ...` and `exports.foo = ...`**.
20. **What will happen if you don’t export the module?** – Its functions and variables remain **private** to that file and **cannot be used** from other modules via `require`.
   - *Interview takeaway:* Note that export decides **what is visible outside the file**.
21. **How do you import single and multiple functions from a module?** – Use `require('./module')` to get the exported object; with CommonJS you can access properties (e.g., `mod.fn1`) or use destructuring: `const { fn1, fn2 } = require('./module');`.
   - *Interview takeaway:* Show both `const m = require()` and destructuring `const {fn}` patterns.
22. **What is the module wrapper function?** – Node wraps each module in a function like `(function (exports, require, module, __filename, __dirname) { ... })` so each file has its own scope and access to these variables.
   - *Interview takeaway:* Remember the signature and that it provides `require`, `module`, `__filename`, `__dirname` per file.
23. **What are the types of modules in Node?** – **Built-in (core)** modules like `fs`, `http`; **local** modules you create; and **third-party** modules installed via `npm install`.
   - *Interview takeaway:* List 3 types: **core, local, third-party**.
24. **What are the top 5 built-in modules commonly used in Node projects?** – `fs` (file system), `path`, `os`, `events`, and `http`.
   - *Interview takeaway:* Be ready to name these 5 core modules quickly.
25. **Explain the role of the `fs` module. Name some functions of it.** – `fs` lets you work with the **file system**: `readFile`, `writeFile`, `appendFile`, `unlink` (delete file), `readdir` (list directory), `mkdir` (create directory), `rmdir` (remove directory).
   - *Interview takeaway:* Memorize 3–4 `fs` functions and their purposes.
26. **Explain the role of the `path` module. Name some functions of it.** – `path` helps build and manipulate **file paths** in a cross-platform way, e.g., `path.join`, `path.resolve`, `path.parse`, `path.format`, `path.normalize`.
   - *Interview takeaway:* Focus on `path.join` and `path.resolve` for cross-platform paths.
27. **Explain the role of the `os` module. Name some functions of it.** – `os` exposes information about the **operating system** (platform, CPU, memory), useful for cross-platform apps and system tasks.
   - *Interview takeaway:* Mention `os.platform()`, `os.cpus()`, `os.totalmem()`.
28. **Explain the role of the `events` module. How do you handle events in Node?** – `events` provides the **EventEmitter** class; you create an emitter, register listeners with `.on('event', handler)`, and emit events with `.emit('event', args...)`.
   - *Interview takeaway:* Show you know how to use `EventEmitter` in code.
29. **What are event arguments?** – They are the **extra data** you pass along when emitting an event, received as parameters in the event handler.
   - *Interview takeaway:* Say "event arguments carry context to the listeners".
30. **What is the difference between a function and an event?** – A **function** is called directly by code; an **event** represents an occurrence that triggers registered handlers indirectly via the event system.
   - *Interview takeaway:* Contrast **direct calls** (functions) vs **indirect triggers** (events).
31. **What is the role of the `http` module in Node?** – It can create an **HTTP server** that listens on a port, processes incoming requests, and sends responses (core for building APIs and web servers).
   - *Interview takeaway:* Mention `http.createServer` and listening on a port for HTTP traffic.
32. **What is the role of the `createServer()` method of the `http` module?** – `http.createServer(handler)` constructs an HTTP server object and wires your request handler function to incoming requests.
   - *Interview takeaway:* Explain that `createServer` links requests to your handler function.
33. **What are the advantages of using Express.js with Node.js?** – It simplifies web development with **routing, middleware, template engine integration**, cleaner APIs, and a large ecosystem of plugins.
   - *Interview takeaway:* Stress "simpler routing and middleware" as the main Express value.
34. **How do you install Express.js in a Node.js project?** – Run `npm install express` in your project folder to add it as a dependency.
   - *Interview takeaway:* Simple command: **`npm install express`**.
35. **How do you create an HTTP server using Express.js?** – Require `express`, create an app (`const app = express();`), define routes (e.g., `app.get('/', ...)`), and start the server with `app.listen(port)`. Express internally uses Node's `http` module.
   - *Interview takeaway:* Remember the 3 steps: **create app → define route → listen**.
36. **How do you create and start an Express.js application?** – Call `express()` to get an app instance, configure middleware and routes, then call `app.listen(PORT, callback)` to start listening.
   - *Interview takeaway:* Emphasize configuring middleware **before** calling `app.listen`.
37. **What is middleware in Express.js and when should you use it?** – Middleware is a function `(req, res, next)` in the **request pipeline** that can read/modify request/response, perform logic (logging, auth, CORS), end the response, or call `next()`.
   - *Interview takeaway:* Define middleware as "functions in the pipeline handling cross-cutting concerns".
38. **How do you implement middleware in Express.js?** – Define a function `(req, res, next) => { ...; next(); }` and register it with `app.use()` for global use or on specific routes like `app.get('/path', myMiddleware, handler)`.
   - *Interview takeaway:* Know both **global** (`app.use`) and **route-level** middleware attachment.
39. **What is the purpose of the `app.use()` function in Express.js?** – It **mounts middleware** functions on the app, either globally or under a path prefix, so they run for matching incoming requests.
   - *Interview takeaway:* Think "`app.use` = register middleware in the pipeline".
40. **What is the purpose of the `next` parameter in Express.js?** – `next` is a callback you call to **pass control** to the next middleware or route handler in the stack; without calling it (or ending the response), the request will hang.
   - *Interview takeaway:* Remember that forgetting `next()` can **hang requests**.
41. **How do you use middleware globally for a specific route?** – Use `app.use('/routePrefix', myMiddleware)` so that `myMiddleware` runs for every request whose path starts with `/routePrefix`.
   - *Interview takeaway:* Associate `app.use('/prefix', middleware)` with scoped global middleware.
42. **What is the request pipeline in Express?** – It is the **sequence of middleware and route handlers** that an HTTP request flows through from arrival to final response.
   - *Interview takeaway:* Be able to describe a request moving through **a chain of middleware**.
43. **What are the types of middlewares in Express.js?** – Application-level, router-level, error-handling middleware, built-in middleware, and third-party middleware.
   - *Interview takeaway:* List at least **three**: application-level, router-level, error-handling.
44. **What is the difference between application-level and route-level middleware?** – Application-level middleware is attached to the **app** and applies to many/all routes; route-level middleware is attached to **specific routes** or routers only.
   - *Interview takeaway:* Explain scope: **whole app** vs **individual routes**.
45. **What is error-handling middleware and how do you implement it?** – It is a special middleware with **four parameters** `(err, req, res, next)` defined after other middleware, used to centralize error handling and send error responses.
   - *Interview takeaway:* Always mention the 4-argument signature for error middleware.
46. **If you have 5 middlewares, in which middleware will you do the error handling?** – In the **last** middleware, defined as the error-handling middleware, so Express will route errors there after skipping normal middleware.
   - *Interview takeaway:* Make it clear that error-handling middleware comes **last in the chain**.
47. **What is built-in middleware? How do you serve static files from Express.js?** – Built-in middleware comes with Express (e.g., `express.json`, `express.urlencoded`, `express.static`). Use `app.use(express.static('public'))` to serve static files from the `public` folder.
   - *Interview takeaway:* Mention `express.static` and a `public` folder as the common pattern.
48. **What are third-party middlewares? Give some examples.** – They are external middleware packages not in core Express, installed via NPM, such as **`morgan`** (logging), **`helmet`** (security headers), **`body-parser`** (parsing), **`compression`** (gzip).
   - *Interview takeaway:* Be ready with 2–3 names like `morgan`, `helmet`, `compression`.
49. **Can you summarize all the types of middlewares?** – Application-level (global logic), router-level (for grouped routes), built-in (provided by Express), error-handling (centralized error logic), and third-party (extra features from NPM).
   - *Interview takeaway:* Summarize by function: **global, per-route, error, core, external**.
50. **What are the advantages of using middleware in Express.js?** – Middleware improves **modularity, reusability, request handling, and flexibility**; lets you layer cross-cutting concerns (logging, auth, validation, error handling) cleanly across your app.
   - *Interview takeaway:* Connect middleware with **clean separation of cross-cutting concerns**.

