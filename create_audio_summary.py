#!/usr/bin/env python3
"""
Convert ASP.NET MVC Essentials markdown summary to MP3 using text-to-speech
"""

import os
import sys

# Try to import pyttsx3 for offline TTS
try:
    import pyttsx3
    HAS_PYTTSX3 = True
except ImportError:
    HAS_PYTTSX3 = False
    print("⚠️  pyttsx3 not installed. Installing...")
    os.system(f"{sys.executable} -m pip install pyttsx3")
    import pyttsx3
    HAS_PYTTSX3 = True

def create_summary():
    """Create a comprehensive summary of ASP.NET MVC Essentials"""
    summary = """
    ASP.NET MVC Essentials - Audio Summary
    
    Welcome to this comprehensive audio guide on ASP.NET MVC Essentials. This summary covers three main topics: 
    ASP.NET MVC Overview, Controllers and Action Results, and Filters.
    
    SECTION 1: ASP.NET MVC OVERVIEW
    
    ASP.NET MVC follows the Model-View-Controller architectural pattern. The Model represents your application data 
    and business rules. The View handles the user interface and templating. The Controller manages request handling 
    and orchestration between the Model and View.
    
    This separation of concerns significantly improves testability and maintainability of your applications. 
    ASP.NET MVC follows the principle of convention over configuration, which means sensible defaults reduce the 
    amount of boilerplate code you need to write.
    
    URL Routing is a key feature that maps incoming URLs to controller actions without requiring physical .aspx pages. 
    The default routing pattern is controller slash action slash id, with sensible defaults like Home slash Index.
    
    Views in ASP.NET MVC are strongly-typed, allowing you to leverage model types and HTML helpers for better 
    type safety and intellisense support. Controllers are plain classes, making them unit test friendly and easy 
    to mock dependencies.
    
    A typical ASP.NET MVC project structure includes Controllers, Models as Plain Old CLR Objects or POCOs, 
    Views written in Razor syntax with a dot cshtml extension, Shared views and layouts, and Route configuration.
    
    SECTION 2: CONTROLLERS AND ACTION RESULTS
    
    Controllers are classes that derive from the System.Web.Mvc.Controller base class. Public methods on a controller 
    that can be invoked via routing are called action methods.
    
    Action selection depends on the method name, HTTP verb attributes like HttpGet or HttpPost, and optionally 
    attribute routing for more explicit control.
    
    MVC provides automatic model binding, which binds incoming request data from route values, query strings, and 
    form data to action parameters. Complex types are bound by matching property names, and validation uses data 
    annotations.
    
    Action results are the return values from action methods. Common action result types include:
    
    ViewResult - renders a Razor view
    RedirectResult and RedirectToRouteResult - redirect to a URL or route
    JsonResult - returns JSON data
    ContentResult - returns raw content
    FileResult and its subclasses - return files or streams
    HttpStatusCodeResult - returns specific HTTP status codes
    EmptyResult - returns no response body
    
    For example, a Details action might return a ViewResult with a product model, while a Save action might 
    validate the model and return a RedirectToAction result. A DownloadManual action might return a FileResult 
    with a PDF file.
    
    SECTION 3: FILTERS
    
    Filters inject cross-cutting behavior around action execution and result generation. Common uses include 
    authentication, caching, logging, and exception handling.
    
    There are four main filter types in classic ASP.NET MVC:
    
    Authorization filters run first to authorize requests.
    Action filters provide code before and after action method execution through OnActionExecuting and OnActionExecuted methods.
    Result filters provide code before and after result execution through OnResultExecuting and OnResultExecuted methods.
    Exception filters handle exceptions thrown during action or result execution.
    
    Filters have different scopes: Global filters apply to all actions, Controller filters apply to all actions in a controller, 
    and Action filters apply to specific actions. You can control execution order using the Order property on filter attributes.
    
    Global filters are registered in the GlobalFilters collection. Controller and action level filters are applied using 
    attributes like Authorize, OutputCache, or custom attributes.
    
    Common built-in filters include Authorize for enforcing authentication and roles, OutputCache for caching action results, 
    and HandleError for handling exceptions and showing error views.
    
    PRACTICAL TIPS AND BEST PRACTICES
    
    Keep your controllers thin. They should handle validation, orchestration, and selection of action results. 
    Push business logic into service classes.
    
    Prefer view models and DTOs over domain entities in your actions and views.
    
    Centralize cross-cutting concerns using filters or middleware in ASP.NET Core.
    
    Always validate model binding using data annotations and check ModelState.IsValid.
    
    Use attribute routing to make your endpoints explicit when it helps with clarity.
    
    Return appropriate action results like HttpNotFound, redirects, or files to clearly communicate outcomes to clients.
    
    QUICK CHECKLIST FOR ASP.NET MVC APPLICATIONS
    
    Ensure your routes are defined and predictable.
    Keep controller actions small and single-purpose.
    Return the correct ActionResult type from each action.
    Implement model validation and error handling.
    Use filters for cross-cutting behavior.
    Write unit tests for your controllers and filters.
    
    This concludes the ASP.NET MVC Essentials audio summary. Thank you for listening!
    """
    return summary.strip()

def text_to_speech(text, output_file):
    """Convert text to speech and save as MP3"""
    print(f"🎙️  Converting text to speech...")
    print(f"📝 Text length: {len(text)} characters")
    
    try:
        # Initialize the TTS engine
        engine = pyttsx3.init()
        
        # Set properties
        engine.setProperty('rate', 150)  # Speed of speech
        engine.setProperty('volume', 0.9)  # Volume (0.0 to 1.0)
        
        # Get available voices
        voices = engine.getProperty('voices')
        if voices:
            # Use the first available voice (usually default)
            engine.setProperty('voice', voices[0].id)
            print(f"🎤 Using voice: {voices[0].name}")
        
        # Save to file
        print(f"💾 Saving to: {output_file}")
        engine.save_to_file(text, output_file)
        engine.runAndWait()
        
        # Check if file was created
        if os.path.exists(output_file):
            file_size = os.path.getsize(output_file)
            print(f"✅ Success! MP3 file created: {output_file}")
            print(f"📊 File size: {file_size / (1024*1024):.2f} MB")
            return True
        else:
            print(f"❌ Error: File was not created")
            return False
            
    except Exception as e:
        print(f"❌ Error during text-to-speech conversion: {e}")
        return False

def main():
    """Main function"""
    print("=" * 70)
    print("🎓 ASP.NET MVC Essentials - Audio Summary Generator")
    print("=" * 70)
    print()
    
    # Create summary
    print("📖 Creating summary from ASP.NET MVC Essentials...")
    summary = create_summary()
    print(f"✅ Summary created ({len(summary)} characters)")
    print()
    
    # Define output file
    output_file = "AspNetMvc-Essentials-Summary.mp3"
    
    # Convert to speech
    print("🔄 Converting to speech...")
    success = text_to_speech(summary, output_file)
    
    if success:
        print()
        print("=" * 70)
        print("✨ COMPLETE!")
        print("=" * 70)
        print(f"📁 Output file: {output_file}")
        print(f"📍 Location: {os.path.abspath(output_file)}")
        print()
        print("You can now listen to the audio summary!")
    else:
        print()
        print("❌ Failed to create audio file")
        sys.exit(1)

if __name__ == "__main__":
    main()

