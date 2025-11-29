# Node.js / Express / REST Interview Questions 51–100 – Learning Guide

_Source: Top-200-Node-Interview-Questions-pdf.txt_

51. **What is routing in Express.js?** – Routing is the mechanism by which Express **maps incoming requests (HTTP method + URL)** to specific handler functions that generate responses.
   - *Interview takeaway:* Say "routing = mapping HTTP verb + path to handler functions".

52. **What is the difference between middleware and routing in Express?** – **Routing** decides *which handler* runs for a URL; **middleware** are functions in the **pipeline** that can run before/after routes to handle cross-cutting concerns like logging, auth, or parsing.
   - *Interview takeaway:* "Routes answer *where to go*; middleware controls *what happens along the way*."

53. **How do you implement routing? How do you define routes in Express.js?** – Create an Express app and define routes using methods like `app.get('/path', handler)` or `router.post('/users', handler)`, where each route handles a specific HTTP method and path.
   - *Interview takeaway:* Mention `app.METHOD(path, handler)` and/or `router.METHOD(path, handler)` as the core patterns.

54. **How do you handle routing in real Express.js applications?** – Organize routes into **separate router modules**, group related paths (e.g., `/users`, `/products`), use `express.Router()`, and mount them with `app.use('/api/users', userRouter)` for a clean structure.
   - *Interview takeaway:* Emphasize using **modular routers** and `app.use('/prefix', router)` in real apps.

55. **What are route handlers?** – Route handlers are the **functions** that are executed when a request matches a specific route; they receive `(req, res)` (and optionally `next`) and are responsible for sending the response.
   - *Interview takeaway:* Define route handlers as "the actual business logic functions attached to routes".

56. **What are route parameters in Express.js?** – Route parameters are **dynamic segments** in the URL defined with a colon, like `/users/:id`; their values are accessed via `req.params.id`.
   - *Interview takeaway:* Mention `/users/:id` and reading the value with `req.params.id`.

57. **What are the router object and router methods in Express.js, and how do you implement them?** – A router object from `express.Router()` lets you define grouped routes using methods like `router.get`, `router.post`, etc., then export the router and mount it with `app.use('/prefix', router)`.
   - *Interview takeaway:* Highlight `const router = express.Router()` and `module.exports = router` as the standard pattern.

58. **What are the types of router methods?** – Router methods correspond to HTTP verbs (`router.get`, `router.post`, `router.put`, `router.delete`, `router.patch`, etc.) plus utility methods like `router.use` for middleware and `router.route` for chaining.
   - *Interview takeaway:* List a few key ones: `router.get`, `router.post`, `router.put`, `router.delete`.

59. **What is the difference between `app.get()` and `router.get()`?** – `app.get()` defines a route directly on the **application** object; `router.get()` defines a route on a **router instance** that can be mounted under a path prefix via `app.use`.
   - *Interview takeaway:* Say "`app.get` is for the root app; `router.get` is for modular, mountable route groups".

60. **What is `express.Router()` in Express.js?** – `express.Router()` creates a **mini Express app** that you can use to define grouped routes and middleware, then plug into the main app with `app.use`.
   - *Interview takeaway:* Call it a "mini-app" for modular routing.

61. **Can you share a real application use of routing?** – For example, an e-commerce app might have `/products`, `/users`, `/orders` routers, each file exposing routes for list, details, create, update, and delete operations.
   - *Interview takeaway:* Give a concrete example like `/api/products` with `GET`, `POST`, `PUT`, `DELETE` routes.

62. **What is route chaining in Express.js?** – Route chaining uses `router.route('/path')` and then chains multiple methods like `.get`, `.post`, `.put` for the **same path** in a compact way.
   - *Interview takeaway:* Mention `router.route('/users').get(...).post(...)` as the typical chaining syntax.

63. **What is route nesting in Express.js?** – Route nesting means **mounting a router under another path** (e.g., `app.use('/api/users', userRouter)`), so all routes in `userRouter` are automatically prefixed with `/api/users`.
   - *Interview takeaway:* Explain that nesting helps build **hierarchical URLs** cleanly.

64. **How do you implement route nesting in Express.js?** – Create a router in a module, define child routes like `router.get('/', ...)`, export it, and mount it in the main app with `app.use('/api/users', userRouter)`.
   - *Interview takeaway:* Be ready to describe the 3 steps: create router → define routes → mount with `app.use('/prefix', router)`.

65. **What are template engines in Express.js?** – Template engines generate **dynamic HTML** on the server by combining templates with data (e.g., EJS, Pug). Express integrates them via `app.set('view engine', 'ejs')` and `res.render()`.
   - *Interview takeaway:* Say "template engines = server-side HTML generation using `res.render()`".

66. **Name some template engine libraries used with Express.** – Common ones include **EJS**, **Pug** (formerly Jade), **Handlebars**, **Mustache**, and **Nunjucks**.
   - *Interview takeaway:* Have 2–3 names ready: EJS, Pug, Handlebars.

67. **How do you implement the EJS templating engine in an Express.js application?** – Install EJS (`npm install ejs`), set `app.set('view engine', 'ejs')`, put `.ejs` files in the `views` folder, and use `res.render('viewName', data)` in route handlers.
   - *Interview takeaway:* Mention `app.set('view engine', 'ejs')` and `res.render()` together.

68. **What is REST and what is a RESTful API?** – REST (Representational State Transfer) is an **architectural style** with constraints like statelessness and uniform interface; a RESTful API is an HTTP API that follows these principles, using resources, URIs, and standard HTTP methods.
   - *Interview takeaway:* Say "REST = style, RESTful API = API that follows REST constraints".

69. **What are HTTP request and response structures in UI and REST APIs?** – A request includes **method, URL, headers, optional body**; the server returns a response with **status code, headers, and body** (often JSON). For REST, clients (UI, mobile, other services) exchange data over these standard HTTP structures.
   - *Interview takeaway:* Show you understand method + URL + headers + body on both request and response.

70. **What are the top 5 REST guidelines and the advantages of each?** – Examples: **client–server separation**, **statelessness**, **cacheable responses**, **uniform interface**, **layered system**. They improve **scalability, decoupling, performance, and evolvability**.
   - *Interview takeaway:* Be ready to name 3–4 constraints and one benefit for each.

71. **What is the difference between REST APIs and SOAP APIs?** – REST is an **architectural style** using HTTP and formats like JSON; SOAP is a **protocol** based on XML envelopes, strict contracts, and heavier tooling.
   - *Interview takeaway:* Contrast "REST = lightweight, JSON, flexible" vs "SOAP = XML, strict, enterprise-heavy".

72. **What are HTTP verbs and HTTP methods?** – They are the **same thing**: standard words like GET, POST, PUT, DELETE, PATCH that indicate the intended action on a resource.
   - *Interview takeaway:* Mention verbs/methods like GET (read), POST (create), PUT (update), DELETE (delete).

73. **What are GET, POST, PUT, and DELETE HTTP methods?** – **GET** retrieves data, **POST** creates new resources, **PUT** fully updates/replaces a resource, **DELETE** removes a resource on the server.
   - *Interview takeaway:* Map each verb clearly to CRUD: GET–Read, POST–Create, PUT–Update, DELETE–Delete.

74. **What is the difference between PUT and PATCH methods?** – **PUT** typically replaces the **entire resource** with the representation provided; **PATCH** applies **partial updates**, changing only specified fields.
   - *Interview takeaway:* Use the phrases "full replacement" (PUT) vs "partial update" (PATCH).

75. **How do you explain the concept of idempotence in RESTful APIs?** – An operation is idempotent if **calling it multiple times has the same effect as calling it once**; e.g., multiple identical GET or PUT requests should not change the result beyond the first call.
   - *Interview takeaway:* Give a concrete example: multiple DELETEs on the same resource.

76. **What is the role of status codes in RESTful APIs?** – Status codes summarize the **outcome of a request** (success, client error, server error) using ranges like **2xx, 4xx, 5xx**, helping clients handle responses appropriately.
   - *Interview takeaway:* Mention key codes: 200 OK, 201 Created, 400 Bad Request, 401, 404, 500.

77. **What is CORS in RESTful APIs?** – CORS (Cross-Origin Resource Sharing) is a **browser security feature** that restricts JS code on one origin from calling APIs on a different origin unless the server explicitly allows it.
   - *Interview takeaway:* Emphasize "browser security" and "cross-origin requests".

78. **How do you remove CORS restrictions in RESTful APIs?** – On the server, **enable CORS** using headers (like `Access-Control-Allow-Origin`) or middleware (e.g., the `cors` package in Express) to allow specific origins, methods, and headers.
   - *Interview takeaway:* Mention using CORS middleware on the **server side**, not hacking the browser.

79. **What are serialization and deserialization?** – **Serialization** converts an object to a format for storage or transmission (e.g., JSON); **deserialization** converts that serialized data back into an object.
   - *Interview takeaway:* Use "object ↔ JSON string" as the intuitive explanation.

80. **What are the types of serialization?** – Common types include **binary**, **XML**, and **JSON** serialization.
   - *Interview takeaway:* List "binary, XML, JSON" as the main options.

81. **How do you serialize and deserialize in Node.js?** – Use `JSON.stringify(obj)` to serialize a JS object into a JSON string, and `JSON.parse(jsonString)` to deserialize it back to a JS object.
   - *Interview takeaway:* Be ready to write `JSON.stringify` and `JSON.parse` from memory.

82. **How do you explain the concept of versioning in RESTful APIs?** – Versioning means **exposing multiple API versions** (e.g., `/v1`, `/v2`) so you can evolve the API without breaking existing clients.
   - *Interview takeaway:* Mention URL versioning like `/api/v1/resource` vs `/api/v2/resource`.

83. **What is an API document, and what are the popular documentation formats?** – API documentation describes endpoints, request/response shapes, and auth; popular formats include **OpenAPI/Swagger**, **RAML**, and **API Blueprint**.
   - *Interview takeaway:* Name OpenAPI/Swagger explicitly; it's the most common.

84. **What is the typical structure of a REST API project in Node?** – A common layout includes `node_modules`, `src` with `controllers`, `models`, `routes`, `utils`, an `app.js` entry file, plus `.gitignore` and `package.json`.
   - *Interview takeaway:* Be able to sketch a simple folder tree with controllers / models / routes.

85. **What are authentication and authorization?** – **Authentication** verifies *who you are* (identity); **authorization** decides *what you can do* (permissions) after you’re authenticated.
   - *Interview takeaway:* Use the classic line: "Authentication: who are you? Authorization: what are you allowed to do?"

86. **What are the types of authentication in Node.js?** – Common types: **Basic auth**, **API key auth**, **token-based/JWT auth**, **multi-factor auth (MFA)**, and **certificate-based auth**.
   - *Interview takeaway:* List at least "Basic, API key, JWT" clearly.

87. **What is Basic Authentication?** – Basic auth sends a username and password (often Base64-encoded) with the request; the server validates these credentials and returns a response.
   - *Interview takeaway:* Mention that Basic auth is **simple but insecure** without HTTPS.

88. **What are the security risks associated with storing passwords in plain text in Node.js?** – If attackers access the storage, they can read all passwords, reuse them on other services, and massively compromise user accounts.
   - *Interview takeaway:* Emphasize "never store plain-text passwords; always hash + salt".

89. **What is the role of hashing and salt in securing passwords?** – **Hashing** converts a password into a fixed-length value using a one-way function; **salt** adds a unique random value before hashing so identical passwords produce different hashes and resist rainbow-table attacks.
   - *Interview takeaway:* Say "hash + salt" together and mention resisting rainbow tables.

90. **How can we create hashed passwords in Node.js?** – Use libraries like **bcrypt** or crypto: generate a salt, combine it with the password, hash it (e.g., using bcrypt’s `hash`), and store the salt + hash (not the plain password).
   - *Interview takeaway:* Mention `bcrypt` by name as a standard solution.

91. **What is API key authentication?** – The API owner issues a **secret key** to clients, who send it with each request (header or query); the server validates the key to authenticate the caller.
   - *Interview takeaway:* Note that API keys identify **the calling application** but must be protected.

92. **What is token-based authentication and JWT authentication?** – Token-based auth issues a **token after successful login**, which the client sends on each request; **JWT** is a common token format (JSON Web Token) that encodes claims and is signed for integrity.
   - *Interview takeaway:* Explain "login → receive JWT → send JWT in headers for each request".

93. **What are the parts of a JWT token?** – A JWT has **three parts**: **header**, **payload** (claims), and **signature**, separated by dots.
   - *Interview takeaway:* Be able to say "header, payload, signature" instantly.

94. **Where does a JWT token reside in the request?** – Typically in the **Authorization header** as a Bearer token (`Authorization: Bearer <token>`); sometimes in cookies.
   - *Interview takeaway:* Emphasize the Authorization header with the "Bearer" scheme.

95. **What is error handling, and in how many ways can you do error handling in Node.js?** – Error handling is managing errors during execution; common techniques include **try–catch for sync code, error-first callbacks, Promises with `.catch`, and try–catch around async/await**.
   - *Interview takeaway:* List these 4 patterns clearly when asked about error handling.

96. **How do you handle errors in synchronous operations using try–catch–finally?** – Wrap the risky code in `try`, catch errors in `catch (err)`, and use `finally` for cleanup that should run regardless of success or failure.
   - *Interview takeaway:* Show a mental model: "try for code, catch for errors, finally for cleanup".

97. **What are error-first callbacks?** – An error-first callback has the signature `(err, result)` where `err` is `null` on success or an Error on failure; Node core APIs traditionally use this pattern.
   - *Interview takeaway:* Mention the `(err, data)` signature as the Node callback convention.

98. **How do you handle errors using Promises?** – Attach a `.catch(err => ...)` handler to Promises to catch rejections or errors thrown in `.then` chains.
   - *Interview takeaway:* Emphasize that `.catch` at the end centralizes async error handling.

99. **How do you handle errors while using async–await?** – Wrap `await` calls in `try { ... } catch (err) { ... }` blocks, or use centralized wrappers, to handle rejected Promises.
   - *Interview takeaway:* Be ready to write a small `try { await doSomething(); } catch (err) { ... }` example.

100. **How can you debug Node.js applications?** – Use tools like `console.log`, the `debugger` statement, the Node inspector, VS Code’s debugger integration, and Chrome DevTools to set breakpoints and inspect state.
   - *Interview takeaway:* Mention at least VS Code debugger and `debugger` keyword, not just `console.log`.

