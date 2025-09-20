# Pro ASP.NET Core MVC (6th Edition) - Table of Contents

**Source:** Apress Pro ASP.NET Core MVC 6th Edition by Adam Freeman

---

## Contents at a Glance

### Part I: Introducing ASP.NET Core MVC

**Chapter 1: ASP.NET Core MVC in Context** .................................................... 3
- Understanding the History of ASP.NET Core MVC
- ASP.NET Web Forms
- The Original MVC Framework
- Key Benefits of ASP.NET Core MVC
- MVC Architecture
- Extensibility
- Tight Control over HTML and HTTP
- Testability
- Powerful Routing System
- Built on the Best Parts of the ASP.NET Platform
- Modern API
- Cross-Platform

**Chapter 2: Your First MVC Application** ........................................................ 11
- Installing Visual Studio
- Creating a New ASP.NET Core MVC Project
- Adding the Controller
- Rendering Web Pages
- Creating and Rendering a View
- Adding Dynamic Output
- Creating a Simple Data-Entry Application
- Setting the Scene
- Designing a Data Model
- Linking Action Methods
- Building the Form
- Handling Forms
- Adding Validation
- Styling the Content

**Chapter 3: The MVC Pattern, Projects, and Conventions** ............................ 53
- The History of MVC
- Understanding the MVC Pattern
- Understanding Models
- Understanding Controllers
- Understanding Views
- Understanding the ASP.NET Core MVC Project Structure
- Working with Visual Studio MVC Projects

**Chapter 4: Essential C# Features** ................................................................ 65
- Preparing the Example Project
- Using Automatically Implemented Properties
- Using Object and Collection Initializers
- Using Extension Methods
- Using Lambda Expressions
- Using Automatic Type Inference
- Using Anonymous Types
- Performing Language Integrated Queries
- Using Async Methods

**Chapter 5: Working with Razor** .................................................................. 101
- Preparing the Example Project
- Defining the Model
- Creating the Controller
- Creating the View
- Working with the Model Object
- Working with Layouts
- Using Razor Expressions
- Setting the Layout
- Using Layout Sections
- Using Partial Views
- Using Strongly Typed Partial Views
- Enumerating Arrays and Collections

**Chapter 6: Working with Visual Studio** ...................................................... 123
- Preparing the Example Project
- Creating the Model
- Creating the Controller and View
- Using the Visual Studio Debugger
- Preparing the Example Application
- Launching the Visual Studio Debugger
- Using Browser Link
- Preparing JavaScript and CSS for Deployment
- Enabling Static Content Delivery
- Adding Static Content to the Project
- Using Gulp to Prepare Static Content
- Bundling and Minifying in MVC Applications

**Chapter 7: Unit Testing MVC Applications** ................................................. 159
- Preparing the Example Project
- Enabling the Built-in Tag Helpers
- Adding Actions to the Controller
- Unit Testing MVC Applications
- Understanding Integration and Unit Tests
- Creating the Unit Test Project
- Writing and Running Unit Tests
- Isolating Components for Unit Testing
- Improving Fake Implementations

**Chapter 8: SportsStore: A Real Application** ............................................... 191
- Getting Started
- Creating the MVC Project
- Creating the Unit Test Project
- Checking and Installing the NuGet Packages
- Creating the Entity Framework Context
- Creating the Repository
- Adding the Initial Migration
- Creating Seed Data
- Configuring the Application
- Displaying a List of Products
- Adding a Controller
- Adding and Configuring the View
- Setting the Default Route
- Running the Application
- Preparing a Database Migration
- Adding Pagination
- Displaying Page Links
- Improving the URLs
- Styling the Content
- Installing the Bootstrap Package
- Applying Bootstrap Styles to the Layout
- Creating a Partial View

**Chapter 9: SportsStore: Navigation** ........................................................... 235
- Adding Navigation Controls
- Filtering the Product List
- Refining the URL Scheme
- Building a Category Navigation Menu
- Correcting the Page Count
- Building the Shopping Cart
- Defining the Cart Model
- Adding the Add to Cart Buttons
- Implementing the Cart Controller
- Displaying the Contents of the Cart

**Chapter 10: SportsStore: Completing the Cart** .......................................... 269
- Refining the Cart Model with a Service
- Creating a Storage-Aware Cart Class
- Registering the Service
- Simplifying the Cart Controller
- Completing the Cart Functionality
- Removing Items from the Cart
- Adding the Cart Summary Widget
- Submitting Orders
- Extending the Model
- Adding the Checkout Process
- Implementing the Order Processor
- Registering the Implementation
- Completing the Cart Controller
- Displaying a Summary Page

**Chapter 11: SportsStore: Administration** .................................................. 291
- Managing Orders
- Enhancing the Model
- Adding the Actions and View
- Adding Catalog Management
- Creating a CRUD Controller
- Implementing the List View
- Editing Products
- Creating New Products
- Deleting Products
- Adding Catalog Management Navigation

**Chapter 12: SportsStore: Security and Deployment** .................................. 319
- Securing the Administration Features
- Adding the Identity Package to the Project
- Creating the Identity Database
- Defining the Seed Data
- Creating the Account Controller and Views
- Testing the Security Policy
- Deploying the Application
- Creating the Databases
- Deploying the Application

**Chapter 13: Working with Visual Studio Code** ........................................... 343
- Setting Up the Development Environment
- Installing Node.js
- Checking the Node Installation
- Installing the .NET Core SDK
- Installing Visual Studio Code
- Installing the C# Extension
- Preparing the Folder
- Re-creating the PartyInvites Application
- Creating the Model and Repository
- Creating the Database
- Creating the Controllers
- Creating the Views
- Configuring the Application
- Running the Application

---

### Part II: ASP.NET Core MVC in Detail

**Chapter 14: Configuring Applications** ........................................................ 373
- Preparing the Example Project
- Understanding the JSON Configuration Files
- Configuring the Solution
- Understanding the Program Class
- Understanding the Startup Class
- Configuring Services
- Configuring the Request Pipeline
- Understanding ASP.NET Core Services
- Creating Custom Services
- Using Service Life Cycles
- Using Factory Functions and Types
- Creating Service Scope
- Using Configuration Data
- Using the Options Pattern

**Chapter 15: URL Routing** ............................................................................ 425
- Preparing the Example Project
- Creating the Model Class
- Creating the Example Controllers
- Creating the Example Views
- Understanding URL Routing
- Creating and Registering a Simple Route
- Defining Default Values
- Defining Static URL Segments
- Defining Custom Segment Variables
- Using Constraints
- Using Optional URL Segments
- Defining Variable-Length Routes
- Prioritizing Routes
- Applying Route Constraints

**Chapter 16: Advanced Routing Features** .................................................... 465
- Preparing the Example Project
- Generating Outgoing URLs in Views
- Generating Outgoing Links
- Generating URLs (and Not Links)
- Customizing the Routing System
- Changing the Routing System Configuration
- Creating a Custom Route Class
- Working with Areas
- Creating an Area
- Populating Areas
- Generating Links to Actions in Areas

**Chapter 17: Controllers and Actions** .......................................................... 503
- Preparing the Example Project
- Preparing the Views
- Understanding Controllers
- Creating POCO Controllers
- Using the MVC Controller API
- Using the Controller Base Class
- Receiving Context Data
- Using Action Method Parameters
- Producing a Response
- Producing a Response Using the Context Object
- Understanding Action Results
- Producing an HTML Response
- Performing Redirections
- Returning Different Types of Content
- Responding with the Contents of Files
- Returning Errors and HTTP Codes
- Understanding the Other Action Result Classes

**Chapter 18: Dependency Injection** ............................................................. 547
- Preparing the Example Project
- Creating the Model and Repository
- Creating the Controller and View
- Understanding Dependency Injection
- Understanding the Problem That Dependency Injection Solves
- Understanding How Dependency Injection Works
- Using Dependency Injection
- Declaring Dependencies in Controllers
- Declaring Dependencies in Actions
- Using Dependency Injection for Views
- Using Dependency Injection Life Cycles
- Using the Singleton Life Cycle
- Using the Transient Life Cycle
- Using the Scoped Life Cycle
- Using Dependency Injection with Action Filters

**Chapter 19: Filters** ..................................................................................... 581
- Preparing the Example Project
- Enabling SSL
- Creating the Controller and View
- Using Filters
- Understanding Filters
- Getting Context Data
- Using Authorization Filters
- Creating an Authorization Filter
- Using Action Filters
- Creating an Action Filter
- Creating an Asynchronous Action Filter
- Using Result Filters
- Creating a Result Filter
- Creating an Asynchronous Result Filter
- Creating a Hybrid Action/Result Filter
- Using Exception Filters
- Creating an Exception Filter
- Using Dependency Injection for Filters
- Resolving Filter Dependencies
- Managing Filter Life Cycles
- Creating Global Filters
- Understanding and Changing Filter Order
- Changing Filter Order

**Chapter 20: API Controllers** ...................................................................... 621
- Preparing the Example Project
- Creating the Model and Repository
- Creating the Controller and Views
- Understanding the Role of RESTful Controllers
- Understanding the Speed Problem
- Understanding the Efficiency Problem
- Creating an API Controller
- Creating a Web Service
- Testing a Web Service
- Defining the Action Results
- Applying the ApiController Attribute
- Using Model Binding in API Controllers
- Understanding Content Formatting
- Understanding Content Negotiation
- Enabling XML Formatting
- Restricting the Formats Received by an Action
- Receiving Different Data Formats

**Chapter 21: Views** ...................................................................................... 653
- Preparing the Example Project
- Creating a Custom View Engine
- Creating a Custom IView
- Creating a Custom IViewEngine
- Registering a Custom View Engine
- Working with Razor
- Understanding Razor View Rendering
- Configuring Razor
- Understanding View Location Expanders

**Chapter 22: View Components** ................................................................... 687
- Preparing the Example Project
- Creating the Models and Repositories
- Creating the Controller and Views
- Understanding View Components
- Creating View Components
- Understanding View Component Results
- Creating Asynchronous View Components
- Getting Context Data in a View Component
- Creating Hybrid Controller/View Component Classes

**Chapter 23: Understanding Tag Helpers** .................................................... 719
- Preparing the Example Project
- Creating the Model and Repository
- Creating the Controller, Layout, and Views
- Creating Tag Helpers
- Creating a Basic Tag Helper
- Registering Tag Helpers
- Managing the Scope of a Tag Helper
- Narrowing the Scope of a Tag Helper
- Widening the Scope of a Tag Helper
- Advanced Tag Helper Features
- Creating Shorthand Elements
- Prepending and Appending Content and Elements
- Getting View Context Data and Dependency Injection
- Working with Model Expressions
- Coordinating Between Tag Helpers
- Suppressing the Output Element

**Chapter 24: Using the Form Tag Helpers** ................................................... 753
- Preparing the Example Project
- Changing the Tag Helper Registration
- Resetting the Views and Layout
- Using the Form Tag Helper
- Using the Input Tag Helper
- Using the Label Tag Helper
- Using the Textarea Tag Helper
- Using the Select Tag Helper
- Using the Validation Tag Helpers

**Chapter 25: Using the Other Built-in Tag Helpers** ..................................... 779
- Preparing the Example Project
- Using the Hosting Environment Tag Helper
- Using the JavaScript and CSS Tag Helpers
- Managing JavaScript File Versions
- Working with Content Delivery Networks
- Using the Image Tag Helper
- Using the Anchor Tag Helper
- Using Application-Relative URLs

**Chapter 26: Model Binding** ........................................................................ 805
- Preparing the Example Project
- Creating the Model and Repository
- Creating the Controller and View
- Understanding Model Binding
- Understanding Default Model Binding
- Model Binding to Simple Types
- Model Binding to Complex Types
- Specifying Model Binding Sources
- Using Model Binding to Arrays and Collections
- Binding to Arrays
- Binding to Collections
- Binding to Dictionaries
- Customizing the Model Binding System
- Creating a Simple Model Binder
- Creating a Model Binder Provider

**Chapter 27: Model Validation** .................................................................... 843
- Preparing the Example Project
- Creating the Model
- Creating the Controller
- Understanding Model Validation
- Explicitly Validating a Model
- Displaying Validation Errors
- Displaying Property-Level Validation Messages
- Displaying Model-Level Messages
- Using Alternative Validation Techniques
- Performing Validation in the Model Binder
- Specifying Validation Rules Using Metadata
- Creating a Custom Property Validation Attribute
- Creating a Model Validation Attribute
- Defining Self-Validating Models
- Performing Client-Side Validation
- Enabling Client-Side Validation
- Understanding How Client-Side Validation Works
- Performing Remote Validation

**Chapter 28: Getting Started with Identity** ................................................. 877
- Preparing the Example Project
- Creating the Controller and View
- Setting Up ASP.NET Core Identity
- Creating the Databases
- Configuring the Application
- Using ASP.NET Core Identity
- Enumerating User Accounts
- Creating Users
- Implementing a User Details Display
- Editing Users
- Deleting Users
- Implementing the Edit Feature

**Chapter 29: Applying ASP.NET Core Identity** ............................................. 919
- Preparing the Example Project
- Authenticating Users
- Preparing to Implement Authentication
- Implementing User Authentication
- Testing Authentication
- Authorizing Users
- Applying Authorization with Filters
- Using Roles for Authorization
- Creating and Deleting Roles
- Managing Role Memberships
- Using Claims for Authorization
- Seeding the Database

**Chapter 30: Advanced ASP.NET Core Identity** ............................................ 949
- Preparing the Example Project
- Adding Custom User Properties
- Preparing for Database Migration
- Updating the Razor Views
- Demonstrating Custom User Properties
- Adding Claims to User Accounts
- Using Policies
- Creating Custom Policy Requirements
- Using Policies to Authorize Access to Resources
- Using Third-Party Authentication
- Enabling Google Authentication

**Chapter 31: Model Conventions and Action Constraints** ............................ 983
- Preparing the Example Project
- Creating the View Model, Controller, and View
- Using the Application Model and Model Conventions
- Understanding the Application Model
- Understanding the Role of Model Conventions
- Creating Model Conventions
- Creating Action Model Conventions
- Creating Controller Model Conventions
- Understanding Model Convention Execution Order
- Creating Global Model Conventions
- Using Action Constraints
- Creating an Action Constraint
- Resolving Dependencies in Action Constraints

**Index** ......................................................................................................... 1013

---

## Summary

This comprehensive table of contents covers:

- **Part I (Chapters 1-13)**: Introduction to ASP.NET Core MVC, basic concepts, and a complete SportsStore application walkthrough
- **Part II (Chapters 14-31)**: Deep dive into advanced features including routing, controllers, dependency injection, filters, views, model binding, validation, Identity, and customization

The book provides both practical examples and theoretical understanding of ASP.NET Core MVC development patterns and best practices.
