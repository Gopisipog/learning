import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {
  BookOpen,
  CheckCircle,
  Circle,
  Star,
  Lightbulb,
  Target,
  Code,
  Layers,
  Zap,
  Search,
  Filter,
  Eye,
  Brain,
  Puzzle,
  Award,
  TrendingUp,
  Users,
  Settings,
  Play,
  Pause,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import './HolubDesignPatterns.css';

const HolubDesignPatterns = () => {
  const [completedPatterns, setCompletedPatterns] = useState(new Set());
  const [bookmarks, setBookmarks] = useState(new Set());
  const [notes, setNotes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTheme, setCurrentTheme] = useState('holub');
  const [studyMode, setStudyMode] = useState(false);
  const [currentPattern, setCurrentPattern] = useState(null);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('holub_patterns_progress');
    const savedBookmarks = localStorage.getItem('holub_patterns_bookmarks');
    const savedNotes = localStorage.getItem('holub_patterns_notes');
    const savedTheme = localStorage.getItem('holub_patterns_theme');
    
    if (savedProgress) setCompletedPatterns(new Set(JSON.parse(savedProgress)));
    if (savedBookmarks) setBookmarks(new Set(JSON.parse(savedBookmarks)));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedTheme) setCurrentTheme(savedTheme);
  }, []);

  // Save progress to localStorage
  const saveProgress = () => {
    localStorage.setItem('holub_patterns_progress', JSON.stringify([...completedPatterns]));
    localStorage.setItem('holub_patterns_bookmarks', JSON.stringify([...bookmarks]));
    localStorage.setItem('holub_patterns_notes', JSON.stringify(notes));
    localStorage.setItem('holub_patterns_theme', currentTheme);
  };

  const togglePattern = (patternId) => {
    const newCompleted = new Set(completedPatterns);
    if (newCompleted.has(patternId)) {
      newCompleted.delete(patternId);
    } else {
      newCompleted.add(patternId);
    }
    setCompletedPatterns(newCompleted);
    setTimeout(saveProgress, 100);
  };

  const toggleBookmark = (patternId) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(patternId)) {
      newBookmarks.delete(patternId);
    } else {
      newBookmarks.add(patternId);
    }
    setBookmarks(newBookmarks);
    setTimeout(saveProgress, 100);
  };

  const updateNote = (patternId, note) => {
    setNotes(prev => ({ ...prev, [patternId]: note }));
    setTimeout(saveProgress, 500);
  };

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    setTimeout(saveProgress, 100);
  };

  const themes = {
    holub: {
      name: '📚 Holub Classic',
      gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      primary: '#2c3e50',
      secondary: '#3498db'
    },
    patterns: {
      name: '🎨 Pattern Master',
      gradient: 'linear-gradient(135deg, #8e44ad 0%, #e74c3c 100%)',
      primary: '#8e44ad',
      secondary: '#e74c3c'
    },
    code: {
      name: '💻 Code Focus',
      gradient: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
      primary: '#27ae60',
      secondary: '#2ecc71'
    },
    architect: {
      name: '🏗️ Architect',
      gradient: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
      primary: '#f39c12',
      secondary: '#e67e22'
    }
  };

  const designPatterns = {
    creational: [
      {
        id: 'abstract-factory',
        name: 'Abstract Factory',
        description: 'Create objects knowing only the interfaces they implement (without knowing the actual class). Typically, create one of a "family" of objects.',
        difficulty: 'Intermediate',
        useCase: 'Creating families of related objects like GUI widgets, database drivers, or platform-specific components',
        pros: [
          'Promotes reuse and consistency across product families',
          'Easy to add new products without changing existing code',
          'Isolates concrete classes from clients',
          'Enforces constraints among related products',
          'Supports platform independence'
        ],
        cons: [
          'Difficult to extend abstract factory interface',
          'Complex implementation with many classes',
          'May lead to unnecessary abstraction',
          'Hard to support new kinds of products'
        ],
        realWorldExample: 'Java AWT/Swing creating platform-specific widgets, JDBC drivers for different databases',
        codeExample: `// Abstract Factory Pattern
interface Collection {
  Iterator iterator();
}

interface Iterator {
  boolean hasNext();
  Object next();
  void remove();
}

class Tree implements Collection {
  public Iterator iterator() {
    return new TreeIterator(); // Anonymous inner class
  }
}

class LinkedList implements Collection {
  public Iterator iterator() {
    return new LinkedListIterator();
  }
}

// Usage - Client doesn't know concrete types
public void processCollection(Collection c) {
  Iterator i = c.iterator(); // Factory method
  while (i.hasNext()) {
    doSomething(i.next());
  }
}`,
        keyPoints: [
          'Interface to actual factory that creates product families',
          'Creates families of related objects without specifying concrete classes',
          'Client uses objects only through their interfaces',
          'Often combined with Singleton pattern for factory instances',
          'Promotes consistency among products of the same family'
        ],
        theoreticalFoundation: {
          intent: 'Provide an interface for creating families of related or dependent objects without specifying their concrete classes.',
          motivation: 'A system should be independent of how its products are created, composed, and represented. A system should be configured with one of multiple families of products.',
          applicability: [
            'System should be independent of how its products are created',
            'System should be configured with one of multiple families of products',
            'Family of related product objects is designed to be used together',
            'You want to provide a class library of products and reveal just their interfaces'
          ],
          structure: 'AbstractFactory declares interface for operations that create abstract products. ConcreteFactory implements operations to create concrete products.',
          participants: [
            'AbstractFactory: declares interface for creating abstract products',
            'ConcreteFactory: implements operations to create concrete products',
            'AbstractProduct: declares interface for a type of product object',
            'ConcreteProduct: defines product object to be created by corresponding concrete factory',
            'Client: uses only interfaces declared by AbstractFactory and AbstractProduct'
          ]
        }
      },
      {
        id: 'builder',
        name: 'Builder',
        description: 'Separate the construction of a complex object from its representation so that the same construction process can create different representations.',
        difficulty: 'Intermediate',
        useCase: 'Building complex objects step by step, especially when the construction process must allow different representations',
        pros: [
          'Isolates code for construction and representation',
          'Gives finer control over construction process',
          'Allows you to vary product internal representation',
          'Encapsulates code for construction and representation'
        ],
        cons: [
          'Requires creating separate ConcreteBuilder for each type of product',
          'Builder classes must be mutable',
          'May hamper/complicate object creation'
        ],
        realWorldExample: 'Building different UI representations (HTML, Swing) from same data, SQL query builders, document builders',
        codeExample: `// Builder Pattern
public interface Exporter {
  void addName(String text);
  void addAddress(String addr);
  Object getProduct();
}

public class HTMLExporter implements Exporter {
  private StringBuilder html = new StringBuilder();

  public void addName(String text) {
    html.append("<h1>").append(text).append("</h1>");
  }

  public void addAddress(String addr) {
    html.append("<p>").append(addr).append("</p>");
  }

  public Object getProduct() {
    return html.toString();
  }
}

public class Customer {
  private String name;
  private Address address;

  public void exportUI(Exporter builder) {
    builder.addName(name);
    builder.addAddress(address.toString());
  }
}

// Usage
Customer customer = new Customer();
Exporter htmlBuilder = new HTMLExporter();
customer.exportUI(htmlBuilder);
String htmlOutput = (String) htmlBuilder.getProduct();`,
        keyPoints: [
          'Director builds object without knowing what it\'s building',
          'Builder interface used by Director for construction',
          'Concrete Builder actually builds the product',
          'Product is the object built by Builder under Director\'s direction',
          'Separates business logic from UI/representation logic'
        ],
        theoreticalFoundation: {
          intent: 'Separate the construction of a complex object from its representation so that the same construction process can create different representations.',
          motivation: 'A reader for RTF document exchange format should be able to convert RTF to many text formats. The problem is that the number of possible conversions is open-ended.',
          applicability: [
            'Algorithm for creating complex object should be independent of parts and how they\'re assembled',
            'Construction process must allow different representations for object being constructed'
          ],
          structure: 'Builder specifies abstract interface for creating parts of Product object. ConcreteBuilder constructs and assembles parts.',
          participants: [
            'Builder: specifies abstract interface for creating parts of Product',
            'ConcreteBuilder: constructs and assembles parts by implementing Builder interface',
            'Director: constructs object using Builder interface',
            'Product: represents complex object under construction'
          ]
        }
      },
      {
        id: 'factory-method',
        name: 'Factory Method',
        description: 'Let subclasses decide which objects to instantiate. Define an interface for creating an object, but let subclasses decide which class to instantiate.',
        difficulty: 'Beginner',
        useCase: 'When a class can\'t anticipate the class of objects it must create, or when you want to localize knowledge of which class gets created',
        pros: [
          'Easy to implement when full-blown Abstract Factory is overkill',
          'Eliminates need to bind application-specific classes into code',
          'Provides hooks for subclasses',
          'Connects parallel class hierarchies'
        ],
        cons: [
          'Forces you to use implementation inheritance',
          'Inheritance-based framework architectures not best for reuse',
          'Can create unnecessary subclassing',
          'May require modifying superclass when adding subclasses'
        ],
        realWorldExample: 'Document editors creating different document types, Swing\'s JEditorPane creating different view factories',
        codeExample: `// Factory Method Pattern
public abstract class BusinessObject {
  public void doSomething() {
    Element e = createDefaultElement(); // Factory Method
    // Use element...
  }

  protected abstract Element createDefaultElement();
}

public class SpecializedBusinessObject extends BusinessObject {
  protected Element createDefaultElement() {
    return new SpecializedElement();
  }

  private class SpecializedElement extends Element {
    public void f() { /* specialized behavior */ }
  }
}

// Framework usage example
public class MarkupPanel extends JEditorPane {
  public MarkupPanel() {
    setEditorKit(new HTMLEditorKit() {
      public ViewFactory getViewFactory() {
        return new CustomViewFactory();
      }
    });
  }

  private class CustomViewFactory extends HTMLEditorKit.HTMLFactory {
    public View create(Element e) {
      return new View() {
        protected Component createComponent() {
          // Custom component creation
        }
      };
    }
  }
}`,
        keyPoints: [
          'Defers object creation to subclasses through inheritance',
          'Uses abstract method call for object creation',
          'Template method pattern for object creation',
          'Common in framework design where framework defines structure',
          'Virtual constructor in C++ terminology'
        ],
        theoreticalFoundation: {
          intent: 'Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.',
          motivation: 'Frameworks use abstract classes to define and maintain relationships between objects. Framework also responsible for creating these objects.',
          applicability: [
            'Class can\'t anticipate class of objects it must create',
            'Class wants its subclasses to specify objects it creates',
            'Classes delegate responsibility to one of several helper subclasses'
          ],
          structure: 'Product defines interface of objects factory method creates. Creator declares factory method.',
          participants: [
            'Product: defines interface of objects factory method creates',
            'ConcreteProduct: implements Product interface',
            'Creator: declares factory method returning Product object',
            'ConcreteCreator: overrides factory method to return ConcreteProduct instance'
          ]
        }
      },
      {
        id: 'prototype',
        name: 'Prototype',
        description: 'Create objects by making copies of (cloning) a prototypical object. The prototype is usually provided by an external entity or Factory.',
        difficulty: 'Intermediate',
        useCase: 'When creating objects is expensive, when you need objects in non-default state, or when classes are specified at runtime',
        pros: [
          'Can install new concrete product into Factory at runtime',
          'Can reduce object-creation time significantly',
          'Avoids subclassing when Abstract Factory forces it',
          'Can specify new objects by varying values',
          'Can specify new objects by varying structure'
        ],
        cons: [
          'Must explicitly implement clone() which can be difficult',
          'Deep vs shallow copy issues must be considered',
          'Clone method may need to act like constructor',
          'Circular references can complicate cloning'
        ],
        realWorldExample: 'JavaBeans customization and palette usage, creating configured objects from templates',
        codeExample: `// Prototype Pattern
interface Handler extends Cloneable {
  void sendData(byte[] data, URL host);
  Object clone();
}

class HTTPHandler implements Handler {
  private String configuration;

  public void sendData(byte[] data, URL host) {
    // Send data using HTTP protocol
  }

  public Object clone() {
    try {
      return super.clone(); // Shallow copy
    } catch (CloneNotSupportedException e) {
      throw new RuntimeException(e);
    }
  }
}

class AsynchronousStorage {
  private Handler protocol;

  public AsynchronousStorage(Handler protocol) {
    this.protocol = protocol;
  }

  public void store(Collection data, URL host) {
    // Clone protocol for each async operation
    Handler protocolCopy = (Handler) protocol.clone();
    protocolCopy.sendData(data.toByteArray(), host);
  }
}

// Usage
Handler httpPrototype = new HTTPHandler();
AsynchronousStorage storage = new AsynchronousStorage(httpPrototype);
storage.store(myData, new URL("http://example.com"));`,
        keyPoints: [
          'Creates objects by cloning prototypical instance',
          'Prototype interface must define cloning mechanism',
          'Client creates new object by asking prototype for clone',
          'Useful when object creation is expensive',
          'Avoids subclassing when behavior varies by state'
        ],
        theoreticalFoundation: {
          intent: 'Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.',
          motivation: 'Building an editor for music scores. The palette contains instances of musical objects. You can add these to score by dragging.',
          applicability: [
            'When classes to instantiate are specified at runtime',
            'To avoid building class hierarchy of factories parallel to product hierarchy',
            'When instances of class can have one of only few different combinations of state'
          ],
          structure: 'Prototype declares interface for cloning itself. ConcretePrototype implements operation for cloning itself.',
          participants: [
            'Prototype: declares interface for cloning itself',
            'ConcretePrototype: implements operation for cloning itself',
            'Client: creates new object by asking prototype to clone itself'
          ]
        }
      },
      {
        id: 'singleton',
        name: 'Singleton',
        description: 'A class with a constrained number of instances (typically one). The instance is globally accessible.',
        difficulty: 'Beginner',
        useCase: 'Managing shared resources like database connections, logging, caching, thread pools, or configuration settings',
        pros: [
          'Controlled access to sole instance',
          'Reduced namespace pollution',
          'Permits refinement of operations and representation',
          'Permits variable number of instances',
          'More flexible than class operations'
        ],
        cons: [
          'Easy to abuse as global variables',
          'Difficult to test due to global state',
          'Hidden dependencies in code',
          'Can become god class if not careful',
          'Violates Single Responsibility Principle if overused'
        ],
        realWorldExample: 'Java Toolkit.getDefaultToolkit(), BorderFactory, Logger instances, Database connection pools',
        codeExample: `// Singleton Pattern - Multiple implementations

// 1. Lazy initialization with synchronization
public class Singleton1 {
  private static Singleton1 instance;

  private Singleton1() {
    // Prevent external instantiation
    Runtime.getRuntime().addShutdownHook(new Thread() {
      public void run() { cleanup(); }
    });
  }

  public static synchronized Singleton1 getInstance() {
    if (instance == null) {
      instance = new Singleton1();
    }
    return instance;
  }

  private void cleanup() { /* cleanup resources */ }
}

// 2. Eager initialization (thread-safe)
public class Singleton2 {
  private static final Singleton2 instance = new Singleton2();

  private Singleton2() {}

  public static Singleton2 getInstance() {
    return instance;
  }
}

// 3. Enum singleton (best practice)
public enum Singleton3 {
  INSTANCE;

  public void doSomething() {
    // Business logic here
  }
}

// Usage examples
Image picture = Toolkit.getDefaultToolkit().getImage(url);
Border border = BorderFactory.createBevelBorder(3);`,
        keyPoints: [
          'Ensures class has only one instance',
          'Provides global point of access to instance',
          'Instance created when first requested (lazy) or at class load (eager)',
          'Must handle thread safety in multi-threaded environments',
          'Private constructor prevents external instantiation'
        ],
        theoreticalFoundation: {
          intent: 'Ensure a class only has one instance, and provide a global point of access to it.',
          motivation: 'It\'s important for some classes to have exactly one instance. How do we ensure that a class has only one instance and that instance is easily accessible?',
          applicability: [
            'There must be exactly one instance of class, accessible to clients from well-known access point',
            'When sole instance should be extensible by subclassing'
          ],
          structure: 'Singleton defines Instance operation that lets clients access its unique instance.',
          participants: [
            'Singleton: defines Instance operation for accessing unique instance, responsible for creating and maintaining its own unique instance'
          ]
        }
      }
    ],
    structural: [
      {
        id: 'adapter',
        name: 'Adapter',
        description: 'Make a class appear to support a familiar interface that it doesn\'t actually support. Convert the interface of a class into another interface clients expect.',
        difficulty: 'Beginner',
        useCase: 'Integrating third-party libraries, legacy code integration, making incompatible interfaces work together',
        pros: [
          'Allows reuse of existing functionality',
          'Separates interface conversion from business logic',
          'Can work with both object and class adapters',
          'Transparent to clients'
        ],
        cons: [
          'Increases overall complexity of code',
          'May impact performance due to indirection',
          'Difficult when adaptee interface is very different',
          'Class adapters require multiple inheritance'
        ],
        realWorldExample: 'Java StringInputStream adapting String to InputStream, Collections adapters, JDBC drivers',
        codeExample: `// Adapter Pattern - Object Adapter
class ObjectIterator extends ObjectInputStream implements Iterator {
  private boolean atEndOfFile = false;

  public ObjectIterator(InputStream in) throws IOException {
    super(in);
  }

  public boolean hasNext() {
    return !atEndOfFile;
  }

  public Object next() {
    try {
      return super.readObject();
    } catch (EOFException e) {
      atEndOfFile = true;
      return null;
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public void remove() {
    throw new UnsupportedOperationException();
  }
}

// Wrapper version using composition
class WrappedObjectIterator implements Iterator {
  private ObjectInputStream wrapped;
  private boolean atEndOfFile = false;

  public WrappedObjectIterator(ObjectInputStream wrapped) {
    this.wrapped = wrapped;
  }

  public boolean hasNext() { return !atEndOfFile; }

  public Object next() {
    try {
      return wrapped.readObject();
    } catch (EOFException e) {
      atEndOfFile = true;
      return null;
    }
  }
}

// Usage
InputStream in = new StringInputStream("hello");
Iterator iter = new ObjectIterator(in);`,
        keyPoints: [
          'Converts interface of class into another interface clients expect',
          'Allows classes with incompatible interfaces to work together',
          'Object adapters use composition, class adapters use inheritance',
          'Target defines domain-specific interface that client uses',
          'Adaptee defines existing interface that needs adapting'
        ],
        theoreticalFoundation: {
          intent: 'Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn\'t otherwise because of incompatible interfaces.',
          motivation: 'Sometimes a toolkit class that\'s designed for reuse isn\'t reusable only because its interface doesn\'t match the domain-specific interface an application requires.',
          applicability: [
            'You want to use existing class with incompatible interface',
            'You want to create reusable class that cooperates with unrelated classes',
            'You need to use several existing subclasses but impractical to adapt their interface by subclassing'
          ],
          structure: 'Class adapter uses multiple inheritance to adapt one interface to another. Object adapter relies on object composition.',
          participants: [
            'Target: defines domain-specific interface that Client uses',
            'Client: collaborates with objects conforming to Target interface',
            'Adaptee: defines existing interface that needs adapting',
            'Adapter: adapts interface of Adaptee to Target interface'
          ]
        }
      },
      {
        id: 'bridge',
        name: 'Bridge',
        description: 'Decouple an abstraction from its implementation so that the two can vary independently. Separate subsystems with interfaces.',
        difficulty: 'Advanced',
        useCase: 'Platform independence, separating interface from implementation, avoiding permanent binding between abstraction and implementation',
        pros: [
          'Decouples interface and implementation',
          'Improved extensibility',
          'Hiding implementation details from clients',
          'Platform independence'
        ],
        cons: [
          'Increases complexity',
          'May impact performance',
          'Difficult to understand initially'
        ],
        realWorldExample: 'Java AWT (platform-independent windowing), JDBC (database independence), device drivers',
        codeExample: `// Bridge Pattern
interface Connection {
  void connect(String url);
  Statement prepareStatement(String sql);
  void close();
}

class SmartConnection {
  private Connection connection; // Bridge to implementation
  private String username, password;

  public SmartConnection(Connection connection) {
    this.connection = connection;
  }

  public void connect(String databaseURL) throws Exception {
    // Enhanced connection logic
    Class.forName(databaseURL).newInstance();
    connection.connect(databaseURL);
    // Additional smart features like connection pooling
  }

  public Statement prepareStatement(String sql) {
    return connection.prepareStatement(sql);
  }
}

// Platform-specific implementations
class PersistentConnection implements Connection {
  private long maxLifetime;

  public void setLifetime(long maxLifetime) {
    this.maxLifetime = maxLifetime;
  }

  public void connect(String url) {
    // Persistent connection implementation
  }
}

class DropableConnection implements Connection {
  private DropListener listener;

  public void notifyOnDrop(DropListener listener) {
    this.listener = listener;
  }

  public void connect(String url) {
    // Dropable connection implementation
  }
}`,
        keyPoints: [
          'Separates abstraction from implementation',
          'Both abstraction and implementation can vary independently',
          'Uses composition instead of inheritance',
          'Bridge is more of an architecture than a design pattern',
          'Often combined with Abstract Factory'
        ],
        theoreticalFoundation: {
          intent: 'Decouple an abstraction from its implementation so that the two can vary independently.',
          motivation: 'When an abstraction can have one of several possible implementations, the usual way to accommodate them is to use inheritance.',
          applicability: [
            'You want to avoid permanent binding between abstraction and implementation',
            'Both abstractions and implementations should be extensible by subclassing',
            'Changes in implementation should have no impact on clients'
          ],
          structure: 'Abstraction defines abstraction\'s interface and maintains reference to Implementor object.',
          participants: [
            'Abstraction: defines abstraction\'s interface, maintains reference to Implementor',
            'RefinedAbstraction: extends interface defined by Abstraction',
            'Implementor: defines interface for implementation classes',
            'ConcreteImplementor: implements Implementor interface'
          ]
        }
      },
      {
        id: 'composite',
        name: 'Composite',
        description: 'Compose objects into tree structures to represent part-whole hierarchies. Lets clients treat individual objects and compositions uniformly.',
        difficulty: 'Intermediate',
        useCase: 'Tree structures, hierarchical data, when you want clients to ignore difference between compositions and individual objects',
        pros: [
          'Defines class hierarchies of primitive and composite objects',
          'Makes client simple - can treat composites and primitives uniformly',
          'Makes it easier to add new kinds of components',
          'Provides flexibility of structure and manageable interface'
        ],
        cons: [
          'Can make design overly general',
          'Hard to restrict components of composite',
          'May violate type safety in some languages'
        ],
        realWorldExample: 'GUI containers and components, file system directories and files, organization hierarchies',
        codeExample: `// Composite Pattern
interface Component {
  void operation();
  void add(Component c);
  void remove(Component c);
  Component getChild(int i);
}

class Leaf implements Component {
  public void operation() {
    // Do something
  }

  public void add(Component c) {
    throw new UnsupportedOperationException();
  }

  public void remove(Component c) {
    throw new UnsupportedOperationException();
  }

  public Component getChild(int i) {
    throw new UnsupportedOperationException();
  }
}

class Composite implements Component {
  private List<Component> children = new ArrayList<>();

  public void operation() {
    for (Component child : children) {
      child.operation();
    }
  }

  public void add(Component c) {
    children.add(c);
  }

  public void remove(Component c) {
    children.remove(c);
  }

  public Component getChild(int i) {
    return children.get(i);
  }
}

// Usage
Component root = new Composite();
root.add(new Leaf());
root.add(new Leaf());

Component branch = new Composite();
branch.add(new Leaf());
root.add(branch);

root.operation(); // Operates on entire tree`,
        keyPoints: [
          'Composes objects into tree structures',
          'Clients treat individual objects and compositions uniformly',
          'Component defines interface for objects in composition',
          'Leaf represents leaf objects with no children',
          'Composite stores child components and implements child-related operations'
        ],
        theoreticalFoundation: {
          intent: 'Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.',
          motivation: 'Graphics applications like drawing editors let users build complex diagrams out of simple components.',
          applicability: [
            'You want to represent part-whole hierarchies of objects',
            'You want clients to ignore difference between compositions and individual objects'
          ],
          structure: 'Component declares interface for objects in composition and implements default behavior.',
          participants: [
            'Component: declares interface for objects in composition',
            'Leaf: represents leaf objects in composition, defines behavior for primitive objects',
            'Composite: defines behavior for components having children, stores child components',
            'Client: manipulates objects in composition through Component interface'
          ]
        }
      },
      {
        id: 'decorator',
        name: 'Decorator',
        description: 'Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.',
        difficulty: 'Intermediate',
        useCase: 'Adding features to objects without altering structure, when extension by subclassing is impractical',
        pros: [
          'More flexible than static inheritance',
          'Avoids feature-laden classes high up in hierarchy',
          'Can add/remove responsibilities at runtime',
          'Can combine several decorators for multiple behaviors'
        ],
        cons: [
          'Can result in many small objects',
          'Complex debugging due to object wrapping',
          'Decorator and component aren\'t identical',
          'Can complicate object identity'
        ],
        realWorldExample: 'Java I/O streams (BufferedInputStream, DataInputStream), Swing borders, text formatting',
        codeExample: `// Decorator Pattern
interface InputStream {
  int read() throws IOException;
  void close() throws IOException;
}

class FileInputStream implements InputStream {
  private File file;

  public FileInputStream(File file) {
    this.file = file;
  }

  public int read() throws IOException {
    // Read from file
    return 0;
  }

  public void close() throws IOException {
    // Close file
  }
}

abstract class FilterInputStream implements InputStream {
  protected InputStream in;

  protected FilterInputStream(InputStream in) {
    this.in = in;
  }

  public int read() throws IOException {
    return in.read();
  }

  public void close() throws IOException {
    in.close();
  }
}

class BufferedInputStream extends FilterInputStream {
  private byte[] buffer = new byte[8192];
  private int pos = 0;
  private int count = 0;

  public BufferedInputStream(InputStream in) {
    super(in);
  }

  public int read() throws IOException {
    if (pos >= count) {
      fill();
      if (pos >= count) return -1;
    }
    return buffer[pos++] & 0xff;
  }

  private void fill() throws IOException {
    count = in.read(buffer, 0, buffer.length);
    pos = 0;
  }
}

// Usage - Stacking decorators
InputStream stream = new BufferedInputStream(
  new DataInputStream(
    new FileInputStream(new File("data.txt"))
  )
);`,
        keyPoints: [
          'Wraps objects to add behavior dynamically',
          'Maintains same interface as wrapped object',
          'Can stack multiple decorators for combined behavior',
          'Component defines interface for objects that can have responsibilities added',
          'ConcreteDecorator adds responsibilities to component'
        ],
        theoreticalFoundation: {
          intent: 'Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.',
          motivation: 'Sometimes we want to add responsibilities to individual objects, not to entire class.',
          applicability: [
            'To add responsibilities to individual objects dynamically and transparently',
            'For responsibilities that can be withdrawn',
            'When extension by subclassing is impractical'
          ],
          structure: 'Component defines interface for objects that can have responsibilities added to them dynamically.',
          participants: [
            'Component: defines interface for objects that can have responsibilities added dynamically',
            'ConcreteComponent: defines object to which additional responsibilities can be attached',
            'Decorator: maintains reference to Component object and defines interface conforming to Component',
            'ConcreteDecorator: adds responsibilities to component'
          ]
        }
      },
      {
        id: 'facade',
        name: 'Facade',
        description: 'Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.',
        difficulty: 'Beginner',
        useCase: 'Simplifying complex subsystems, providing simple interface to complex functionality, layered architecture',
        pros: [
          'Shields clients from subsystem components',
          'Promotes weak coupling between subsystem and clients',
          'Reduces compilation dependencies',
          'Simplifies complex interfaces'
        ],
        cons: [
          'May become god object if not careful',
          'Can hide too much functionality',
          'May not eliminate need to access subsystem directly'
        ],
        realWorldExample: 'Java Collections.sort(), Compiler facade hiding lexer/parser/optimizer, Database connection facades',
        codeExample: `// Facade Pattern
class DatabaseFacade {
  private Connection connection;
  private PreparedStatement statement;
  private ResultSet resultSet;

  public DatabaseFacade(String url) throws SQLException {
    connection = DriverManager.getConnection(url);
  }

  public List<Customer> getCustomers() throws SQLException {
    statement = connection.prepareStatement("SELECT * FROM customers");
    resultSet = statement.executeQuery();

    List<Customer> customers = new ArrayList<>();
    while (resultSet.next()) {
      Customer customer = new Customer();
      customer.setId(resultSet.getInt("id"));
      customer.setName(resultSet.getString("name"));
      customers.add(customer);
    }
    return customers;
  }

  public void close() throws SQLException {
    if (resultSet != null) resultSet.close();
    if (statement != null) statement.close();
    if (connection != null) connection.close();
  }
}

// Usage - Simple interface to complex subsystem
DatabaseFacade db = new DatabaseFacade("jdbc:mysql://localhost/mydb");
List<Customer> customers = db.getCustomers();
db.close();`,
        keyPoints: [
          'Provides unified interface to set of interfaces in subsystem',
          'Defines higher-level interface that makes subsystem easier to use',
          'Facade knows which subsystem classes are responsible for request',
          'Delegates client requests to appropriate subsystem objects',
          'Clients communicate with subsystem by sending requests to Facade'
        ],
        theoreticalFoundation: {
          intent: 'Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.',
          motivation: 'Structuring a system into subsystems helps reduce complexity. A common design goal is to minimize communication and dependencies between subsystems.',
          applicability: [
            'You want to provide simple interface to complex subsystem',
            'There are many dependencies between clients and implementation classes',
            'You want to layer your subsystems'
          ],
          structure: 'Facade knows which subsystem classes are responsible for a request and delegates client requests to appropriate subsystem objects.',
          participants: [
            'Facade: knows which subsystem classes are responsible for request, delegates client requests to appropriate subsystem objects',
            'Subsystem classes: implement subsystem functionality, handle work assigned by Facade object'
          ]
        }
      },
      {
        id: 'flyweight',
        name: 'Flyweight',
        description: 'Use sharing to support large numbers of fine-grained objects efficiently. Minimize memory usage by sharing efficiently all data that is common to several objects.',
        difficulty: 'Advanced',
        useCase: 'When application uses large number of objects, storage costs are high due to sheer quantity, or when object state can be made extrinsic',
        pros: [
          'Reduces number of objects to create',
          'Reduces memory footprint',
          'Centralizes state for many virtual objects',
          'Can improve performance in some cases'
        ],
        cons: [
          'May introduce run-time costs associated with transferring/computing extrinsic state',
          'Complex to implement correctly',
          'May actually increase memory usage if flyweights are not shared'
        ],
        realWorldExample: 'Text editors (character objects), game engines (particle systems), GUI toolkits (widget sharing)',
        codeExample: `// Flyweight Pattern
interface Flyweight {
  void operation(ExtrinsicState state);
}

class ConcreteFlyweight implements Flyweight {
  private String intrinsicState;

  public ConcreteFlyweight(String intrinsicState) {
    this.intrinsicState = intrinsicState;
  }

  public void operation(ExtrinsicState state) {
    // Use both intrinsic and extrinsic state
    System.out.println("Intrinsic: " + intrinsicState +
                      ", Extrinsic: " + state.getValue());
  }
}

class FlyweightFactory {
  private Map<String, Flyweight> flyweights = new HashMap<>();

  public Flyweight getFlyweight(String key) {
    Flyweight flyweight = flyweights.get(key);
    if (flyweight == null) {
      flyweight = new ConcreteFlyweight(key);
      flyweights.put(key, flyweight);
    }
    return flyweight;
  }
}

// Usage
FlyweightFactory factory = new FlyweightFactory();
Flyweight fw1 = factory.getFlyweight("Type A");
Flyweight fw2 = factory.getFlyweight("Type A"); // Same instance`,
        keyPoints: [
          'Uses sharing to support large numbers of objects efficiently',
          'Intrinsic state is stored in flyweight and shared',
          'Extrinsic state is passed to flyweight methods',
          'Factory ensures flyweights are shared appropriately',
          'Client maintains references to flyweights and computes extrinsic state'
        ],
        theoreticalFoundation: {
          intent: 'Use sharing to support large numbers of fine-grained objects efficiently.',
          motivation: 'Some applications could benefit from using objects throughout their design, but naive implementation would be prohibitively expensive.',
          applicability: [
            'Application uses large number of objects',
            'Storage costs are high because of sheer quantity of objects',
            'Most object state can be made extrinsic'
          ],
          structure: 'Flyweight declares interface through which flyweights can receive and act on extrinsic state.',
          participants: [
            'Flyweight: declares interface through which flyweights can receive and act on extrinsic state',
            'ConcreteFlyweight: implements Flyweight interface and adds storage for intrinsic state',
            'FlyweightFactory: creates and manages flyweight objects'
          ]
        }
      },
      {
        id: 'proxy',
        name: 'Proxy',
        description: 'Provide a surrogate or placeholder for another object to control access to it. Acts as intermediary between client and target object.',
        difficulty: 'Intermediate',
        useCase: 'Lazy loading, access control, caching, logging, remote object access, smart references',
        pros: [
          'Controls access to original object',
          'Can perform lazy initialization',
          'Can cache results',
          'Can log access or perform security checks',
          'Transparent to client'
        ],
        cons: [
          'May introduce latency',
          'Increases complexity',
          'May duplicate some functionality',
          'Can make debugging more difficult'
        ],
        realWorldExample: 'Java RMI stubs, Hibernate lazy loading, Spring AOP proxies, virtual memory systems',
        codeExample: `// Proxy Pattern
interface Image {
  void display();
}

class RealImage implements Image {
  private String filename;

  public RealImage(String filename) {
    this.filename = filename;
    loadFromDisk();
  }

  private void loadFromDisk() {
    System.out.println("Loading " + filename + " from disk...");
  }

  public void display() {
    System.out.println("Displaying " + filename);
  }
}

class ProxyImage implements Image {
  private String filename;
  private RealImage realImage;

  public ProxyImage(String filename) {
    this.filename = filename;
  }

  public void display() {
    if (realImage == null) {
      realImage = new RealImage(filename); // Lazy loading
    }
    realImage.display();
  }
}

// Usage - Lazy loading proxy
Image image = new ProxyImage("photo.jpg");
image.display(); // Now photo.jpg is loaded`,
        keyPoints: [
          'Provides surrogate or placeholder for another object',
          'Controls access to original object',
          'Proxy and subject implement same interface',
          'Proxy forwards requests to subject when appropriate',
          'Can add additional behavior (caching, logging, access control)'
        ],
        theoreticalFoundation: {
          intent: 'Provide a surrogate or placeholder for another object to control access to it.',
          motivation: 'Sometimes we need more sophisticated reference to object than simple pointer or reference can provide.',
          applicability: [
            'Remote proxy provides local representative for object in different address space',
            'Virtual proxy creates expensive objects on demand',
            'Protection proxy controls access to original object'
          ],
          structure: 'Proxy maintains reference that lets proxy access real subject and provides interface identical to Subject.',
          participants: [
            'Subject: defines common interface for RealSubject and Proxy',
            'RealSubject: defines real object that proxy represents',
            'Proxy: maintains reference to RealSubject, controls access to RealSubject'
          ]
        }
      }
    ],
    behavioral: [
      {
        id: 'chain-of-responsibility',
        name: 'Chain of Responsibility',
        description: 'Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain receiving objects and pass request along until an object handles it.',
        difficulty: 'Intermediate',
        useCase: 'Event handling, request processing pipelines, validation chains, middleware systems',
        pros: [
          'Reduces coupling between sender and receiver',
          'Adds flexibility in assigning responsibilities',
          'Allows you to add or remove responsibilities dynamically',
          'Simplifies your object because it doesn\'t have to know chain structure'
        ],
        cons: [
          'Receipt isn\'t guaranteed',
          'Can be hard to observe runtime characteristics and debug',
          'May impact performance due to chain traversal'
        ],
        realWorldExample: 'Servlet filters, exception handling, GUI event propagation, approval workflows',
        codeExample: `// Chain of Responsibility Pattern
abstract class Handler {
  protected Handler successor;

  public void setSuccessor(Handler successor) {
    this.successor = successor;
  }

  public abstract void handleRequest(Request request);
}

class ConcreteHandlerA extends Handler {
  public void handleRequest(Request request) {
    if (canHandle(request)) {
      // Handle the request
      System.out.println("HandlerA handled request");
    } else if (successor != null) {
      successor.handleRequest(request);
    }
  }

  private boolean canHandle(Request request) {
    return request.getType().equals("TypeA");
  }
}

class ConcreteHandlerB extends Handler {
  public void handleRequest(Request request) {
    if (canHandle(request)) {
      System.out.println("HandlerB handled request");
    } else if (successor != null) {
      successor.handleRequest(request);
    }
  }

  private boolean canHandle(Request request) {
    return request.getType().equals("TypeB");
  }
}

// Usage
Handler handlerA = new ConcreteHandlerA();
Handler handlerB = new ConcreteHandlerB();
handlerA.setSuccessor(handlerB);

Request request = new Request("TypeB");
handlerA.handleRequest(request); // Will be handled by HandlerB`,
        keyPoints: [
          'Decouples sender from receiver of request',
          'More than one object may handle request',
          'Handler either handles request or forwards to successor',
          'Chain is configured at runtime',
          'Request travels along chain until handled'
        ],
        theoreticalFoundation: {
          intent: 'Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it.',
          motivation: 'The idea is to decouple senders and receivers by giving multiple objects a chance to handle a request.',
          applicability: [
            'More than one object may handle request, handler not known a priori',
            'You want to issue request to one of several objects without specifying receiver explicitly',
            'Set of objects that can handle request should be specified dynamically'
          ],
          structure: 'Handler defines interface for handling requests and implements successor link.',
          participants: [
            'Handler: defines interface for handling requests, implements successor link',
            'ConcreteHandler: handles requests it\'s responsible for, can access successor',
            'Client: initiates request to ConcreteHandler object on chain'
          ]
        }
      },
      {
        id: 'command',
        name: 'Command',
        description: 'Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.',
        difficulty: 'Intermediate',
        useCase: 'Undo operations, queuing requests, logging, macro recording, GUI actions, remote procedure calls',
        pros: [
          'Decouples object that invokes operation from object that performs it',
          'Commands are first-class objects that can be manipulated and extended',
          'You can assemble commands into composite commands',
          'Easy to add new Commands because you don\'t have to change existing classes'
        ],
        cons: [
          'Can result in lots of little classes',
          'May be overkill for simple operations',
          'Can complicate design if overused'
        ],
        realWorldExample: 'Text editor undo/redo, GUI buttons, macro recording, job queues, database transactions',
        codeExample: `// Command Pattern
interface Command {
  void execute();
  void undo();
}

class Light {
  private boolean isOn = false;

  public void turnOn() {
    isOn = true;
    System.out.println("Light is ON");
  }

  public void turnOff() {
    isOn = false;
    System.out.println("Light is OFF");
  }
}

class LightOnCommand implements Command {
  private Light light;

  public LightOnCommand(Light light) {
    this.light = light;
  }

  public void execute() {
    light.turnOn();
  }

  public void undo() {
    light.turnOff();
  }
}

class RemoteControl {
  private Command[] onCommands;
  private Command[] offCommands;
  private Command lastCommand;

  public RemoteControl() {
    onCommands = new Command[7];
    offCommands = new Command[7];

    Command noCommand = new NoCommand();
    for (int i = 0; i < 7; i++) {
      onCommands[i] = noCommand;
      offCommands[i] = noCommand;
    }
    lastCommand = noCommand;
  }

  public void setCommand(int slot, Command onCommand, Command offCommand) {
    onCommands[slot] = onCommand;
    offCommands[slot] = offCommand;
  }

  public void onButtonPressed(int slot) {
    onCommands[slot].execute();
    lastCommand = onCommands[slot];
  }

  public void undoButtonPressed() {
    lastCommand.undo();
  }
}

// Usage
Light light = new Light();
Command lightOn = new LightOnCommand(light);
Command lightOff = new LightOffCommand(light);

RemoteControl remote = new RemoteControl();
remote.setCommand(0, lightOn, lightOff);
remote.onButtonPressed(0); // Light turns on
remote.undoButtonPressed(); // Light turns off`,
        keyPoints: [
          'Encapsulates request as object',
          'Parameterizes objects with different requests',
          'Allows requests to be queued, logged, and undone',
          'Command interface declares method for executing operation',
          'ConcreteCommand defines binding between Receiver and action'
        ],
        theoreticalFoundation: {
          intent: 'Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.',
          motivation: 'Sometimes it\'s necessary to issue requests to objects without knowing anything about the operation being requested or the receiver.',
          applicability: [
            'Parameterize objects by an action to perform',
            'Specify, queue, and execute requests at different times',
            'Support undo',
            'Support logging changes so they can be reapplied in case of system crash'
          ],
          structure: 'Command declares interface for executing an operation. ConcreteCommand defines binding between Receiver object and action.',
          participants: [
            'Command: declares interface for executing operation',
            'ConcreteCommand: defines binding between Receiver object and action',
            'Client: creates ConcreteCommand object and sets its receiver',
            'Invoker: asks command to carry out request',
            'Receiver: knows how to perform operations associated with carrying out request'
          ]
        }
      },
      {
        id: 'observer',
        name: 'Observer',
        description: 'Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.',
        difficulty: 'Intermediate',
        useCase: 'Event handling systems, MVC architectures, model-view synchronization, publish-subscribe systems',
        pros: [
          'Abstract coupling between Subject and Observer',
          'Support for broadcast communication',
          'Dynamic relationships - observers can be added/removed at runtime',
          'Promotes loose coupling between objects'
        ],
        cons: [
          'Unexpected updates - observers don\'t know about each other',
          'Memory leaks if observers aren\'t properly removed',
          'Can cause update cascades that are hard to track',
          'Simple update protocol provides no details on what changed'
        ],
        realWorldExample: 'Java Swing event handling, MVC pattern, JavaBeans PropertyChangeListener, reactive programming',
        codeExample: `// Observer Pattern
interface Observer {
  void update(Observable o, Object arg);
}

class Observable {
  private boolean changed = false;
  private Vector<Observer> observers = new Vector<>();

  public synchronized void addObserver(Observer o) {
    if (o == null) throw new NullPointerException();
    if (!observers.contains(o)) {
      observers.addElement(o);
    }
  }

  public synchronized void deleteObserver(Observer o) {
    observers.removeElement(o);
  }

  public void notifyObservers() {
    notifyObservers(null);
  }

  public void notifyObservers(Object arg) {
    Object[] arrLocal;

    synchronized (this) {
      if (!changed) return;
      arrLocal = observers.toArray();
      clearChanged();
    }

    for (int i = arrLocal.length - 1; i >= 0; i--) {
      ((Observer) arrLocal[i]).update(this, arg);
    }
  }

  protected synchronized void setChanged() {
    changed = true;
  }

  protected synchronized void clearChanged() {
    changed = false;
  }
}

class WeatherData extends Observable {
  private float temperature;
  private float humidity;
  private float pressure;

  public void measurementsChanged() {
    setChanged();
    notifyObservers();
  }

  public void setMeasurements(float temperature, float humidity, float pressure) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    measurementsChanged();
  }

  // Getters...
  public float getTemperature() { return temperature; }
  public float getHumidity() { return humidity; }
  public float getPressure() { return pressure; }
}

class CurrentConditionsDisplay implements Observer {
  private float temperature;
  private float humidity;

  public void update(Observable obs, Object arg) {
    if (obs instanceof WeatherData) {
      WeatherData weatherData = (WeatherData) obs;
      this.temperature = weatherData.getTemperature();
      this.humidity = weatherData.getHumidity();
      display();
    }
  }

  public void display() {
    System.out.println("Current conditions: " + temperature + "F degrees and " + humidity + "% humidity");
  }
}

// Usage
WeatherData weatherData = new WeatherData();
CurrentConditionsDisplay currentDisplay = new CurrentConditionsDisplay();

weatherData.addObserver(currentDisplay);
weatherData.setMeasurements(80, 65, 30.4f);`,
        keyPoints: [
          'Defines one-to-many dependency between objects',
          'When subject changes state, all observers are notified automatically',
          'Subject maintains list of observers and notifies them of changes',
          'Observer interface allows different types of observers',
          'Promotes loose coupling between subject and observers'
        ],
        theoreticalFoundation: {
          intent: 'Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.',
          motivation: 'A common side-effect of partitioning a system into a collection of cooperating classes is the need to maintain consistency between related objects.',
          applicability: [
            'When abstraction has two aspects, one dependent on other',
            'When change to one object requires changing others, and you don\'t know how many',
            'When object should be able to notify other objects without making assumptions about who these objects are'
          ],
          structure: 'Subject knows its observers and provides interface for attaching and detaching Observer objects.',
          participants: [
            'Subject: knows its observers, provides interface for attaching/detaching observers',
            'Observer: defines updating interface for objects that should be notified of changes',
            'ConcreteSubject: stores state of interest to ConcreteObserver objects',
            'ConcreteObserver: maintains reference to ConcreteSubject object, implements Observer updating interface'
          ]
        }
      },
      {
        id: 'interpreter',
        name: 'Interpreter',
        description: 'Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language.',
        difficulty: 'Advanced',
        useCase: 'Domain-specific languages, configuration files, scripting engines, mathematical expressions, SQL parsing',
        pros: [
          'Easy to change and extend grammar',
          'Implementing grammar is straightforward',
          'Adding new ways to interpret expressions is easy',
          'Complex grammars are maintainable'
        ],
        cons: [
          'Complex grammars are hard to maintain',
          'Performance can be poor for complex grammars',
          'Not suitable for complex language parsing',
          'Can lead to large number of classes'
        ],
        realWorldExample: 'Regular expressions, SQL interpreters, configuration parsers, mathematical expression evaluators',
        codeExample: `// Interpreter Pattern
interface Expression {
  boolean interpret(Context context);
}

class TerminalExpression implements Expression {
  private String data;

  public TerminalExpression(String data) {
    this.data = data;
  }

  public boolean interpret(Context context) {
    return context.contains(data);
  }
}

class OrExpression implements Expression {
  private Expression expr1;
  private Expression expr2;

  public OrExpression(Expression expr1, Expression expr2) {
    this.expr1 = expr1;
    this.expr2 = expr2;
  }

  public boolean interpret(Context context) {
    return expr1.interpret(context) || expr2.interpret(context);
  }
}

class AndExpression implements Expression {
  private Expression expr1;
  private Expression expr2;

  public AndExpression(Expression expr1, Expression expr2) {
    this.expr1 = expr1;
    this.expr2 = expr2;
  }

  public boolean interpret(Context context) {
    return expr1.interpret(context) && expr2.interpret(context);
  }
}

class Context {
  private String input;

  public Context(String input) {
    this.input = input;
  }

  public boolean contains(String data) {
    return input.contains(data);
  }
}

// Usage - Rule: "Robert and John are male"
Expression robert = new TerminalExpression("Robert");
Expression john = new TerminalExpression("John");
Expression isMale = new OrExpression(robert, john);

Context context = new Context("Robert");
System.out.println("Robert is male? " + isMale.interpret(context));`,
        keyPoints: [
          'Defines representation for grammar of language',
          'Uses Composite pattern to represent grammar rules',
          'Each grammar rule is represented by a class',
          'Terminal expressions implement base cases',
          'Non-terminal expressions implement recursive cases'
        ],
        theoreticalFoundation: {
          intent: 'Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language.',
          motivation: 'If a particular kind of problem occurs often enough, it might be worthwhile to express instances of the problem as sentences in a simple language.',
          applicability: [
            'Grammar is simple and efficiency is not critical concern',
            'You can represent each grammar rule in language as class'
          ],
          structure: 'AbstractExpression declares abstract Interpret operation common to all nodes in abstract syntax tree.',
          participants: [
            'AbstractExpression: declares abstract Interpret operation',
            'TerminalExpression: implements Interpret operation for terminal symbols',
            'NonterminalExpression: implements Interpret operation for nonterminal symbols',
            'Context: contains information global to interpreter'
          ]
        }
      },
      {
        id: 'iterator',
        name: 'Iterator',
        description: 'Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.',
        difficulty: 'Beginner',
        useCase: 'Traversing collections, accessing elements without exposing internal structure, supporting multiple traversals',
        pros: [
          'Supports variations in traversal of aggregate',
          'Iterators simplify aggregate interface',
          'More than one traversal can be pending on aggregate',
          'Provides uniform interface for traversing different structures'
        ],
        cons: [
          'May be overkill for simple aggregates',
          'Can be less efficient than direct access',
          'Iterator may become invalid if aggregate is modified',
          'Memory leaks possible if iterators aren\'t properly managed'
        ],
        realWorldExample: 'Java Collections Iterator, database cursors, file system traversal, tree/graph traversal',
        codeExample: `// Iterator Pattern
interface Iterator<T> {
  boolean hasNext();
  T next();
  void remove();
}

interface Aggregate<T> {
  Iterator<T> createIterator();
}

class ConcreteAggregate<T> implements Aggregate<T> {
  private List<T> items = new ArrayList<>();

  public void addItem(T item) {
    items.add(item);
  }

  public Iterator<T> createIterator() {
    return new ConcreteIterator();
  }

  private class ConcreteIterator implements Iterator<T> {
    private int position = 0;

    public boolean hasNext() {
      return position < items.size();
    }

    public T next() {
      if (!hasNext()) {
        throw new NoSuchElementException();
      }
      return items.get(position++);
    }

    public void remove() {
      if (position <= 0) {
        throw new IllegalStateException();
      }
      items.remove(--position);
    }
  }
}

// Tree Iterator example
class Tree<T> {
  private Node<T> root;

  public Iterator<T> iterator() {
    return new TreeIterator();
  }

  private class TreeIterator implements Iterator<T> {
    private Stack<Node<T>> stack = new Stack<>();

    public TreeIterator() {
      if (root != null) {
        stack.push(root);
      }
    }

    public boolean hasNext() {
      return !stack.isEmpty();
    }

    public T next() {
      if (!hasNext()) {
        throw new NoSuchElementException();
      }

      Node<T> current = stack.pop();

      // Add children to stack (right first for left-to-right traversal)
      if (current.right != null) stack.push(current.right);
      if (current.left != null) stack.push(current.left);

      return current.data;
    }
  }
}

// Usage
ConcreteAggregate<String> aggregate = new ConcreteAggregate<>();
aggregate.addItem("Item 1");
aggregate.addItem("Item 2");
aggregate.addItem("Item 3");

Iterator<String> iterator = aggregate.createIterator();
while (iterator.hasNext()) {
  System.out.println(iterator.next());
}`,
        keyPoints: [
          'Provides way to access elements sequentially',
          'Doesn\'t expose underlying representation of aggregate',
          'Iterator interface defines traversal protocol',
          'Concrete iterators implement specific traversal algorithms',
          'Aggregate creates appropriate iterator for its structure'
        ],
        theoreticalFoundation: {
          intent: 'Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.',
          motivation: 'An aggregate object such as list should give you way to access its elements without exposing its internal structure.',
          applicability: [
            'To access aggregate object\'s contents without exposing internal representation',
            'To support multiple traversals of aggregate objects',
            'To provide uniform interface for traversing different aggregate structures'
          ],
          structure: 'Iterator defines interface for accessing and traversing elements.',
          participants: [
            'Iterator: defines interface for accessing and traversing elements',
            'ConcreteIterator: implements Iterator interface, keeps track of current position',
            'Aggregate: defines interface for creating Iterator object',
            'ConcreteAggregate: implements Iterator creation interface to return instance of proper ConcreteIterator'
          ]
        }
      },
      {
        id: 'strategy',
        name: 'Strategy',
        description: 'Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.',
        difficulty: 'Beginner',
        useCase: 'Multiple ways to perform task, runtime algorithm selection, eliminating conditional statements, payment processing',
        pros: [
          'Families of related algorithms can be reused',
          'Alternative to subclassing',
          'Eliminates conditional statements',
          'Choice of implementations at runtime',
          'Clients can choose from range of behaviors'
        ],
        cons: [
          'Clients must be aware of different strategies',
          'Communication overhead between Strategy and Context',
          'Increased number of objects',
          'All strategies must use same interface'
        ],
        realWorldExample: 'Java Collections.sort() with Comparator, layout managers in GUI, compression algorithms, payment processing',
        codeExample: `// Strategy Pattern
interface SortStrategy {
  void sort(int[] array);
}

class BubbleSort implements SortStrategy {
  public void sort(int[] array) {
    System.out.println("Sorting using Bubble Sort");
    // Bubble sort implementation
    for (int i = 0; i < array.length - 1; i++) {
      for (int j = 0; j < array.length - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          int temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
  }
}

class QuickSort implements SortStrategy {
  public void sort(int[] array) {
    System.out.println("Sorting using Quick Sort");
    quickSort(array, 0, array.length - 1);
  }

  private void quickSort(int[] array, int low, int high) {
    if (low < high) {
      int pi = partition(array, low, high);
      quickSort(array, low, pi - 1);
      quickSort(array, pi + 1, high);
    }
  }

  private int partition(int[] array, int low, int high) {
    // Partitioning logic
    return high; // Simplified
  }
}

class SortContext {
  private SortStrategy strategy;

  public SortContext(SortStrategy strategy) {
    this.strategy = strategy;
  }

  public void setStrategy(SortStrategy strategy) {
    this.strategy = strategy;
  }

  public void executeSort(int[] array) {
    strategy.sort(array);
  }
}

// Usage
int[] data = {64, 34, 25, 12, 22, 11, 90};

SortContext context = new SortContext(new BubbleSort());
context.executeSort(data.clone());

context.setStrategy(new QuickSort());
context.executeSort(data.clone());

// Java Collections example
List<String> list = Arrays.asList("banana", "apple", "cherry");
Collections.sort(list, new Comparator<String>() {
  public int compare(String a, String b) {
    return a.length() - b.length(); // Sort by length
  }
});`,
        keyPoints: [
          'Defines family of algorithms and makes them interchangeable',
          'Encapsulates algorithms in separate strategy classes',
          'Context uses strategy interface to call algorithm',
          'Strategies can be switched at runtime',
          'Eliminates conditional statements for algorithm selection'
        ],
        theoreticalFoundation: {
          intent: 'Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.',
          motivation: 'Many algorithms exist for breaking stream of text into lines. Hard-wiring all such algorithms into classes that require them isn\'t desirable.',
          applicability: [
            'Many related classes differ only in their behavior',
            'You need different variants of algorithm',
            'Algorithm uses data that clients shouldn\'t know about',
            'Class defines many behaviors that appear as multiple conditional statements'
          ],
          structure: 'Strategy declares interface common to all concrete strategies.',
          participants: [
            'Strategy: declares interface common to all concrete strategies',
            'ConcreteStrategy: implements algorithm using Strategy interface',
            'Context: configured with ConcreteStrategy object, maintains reference to Strategy object'
          ]
        }
      },
      {
        id: 'mediator',
        name: 'Mediator',
        description: 'Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly.',
        difficulty: 'Intermediate',
        useCase: 'Complex object interactions, GUI dialogs, workflow systems, chat rooms, air traffic control',
        pros: [
          'Decouples colleagues',
          'Centralizes complex communications and control logic',
          'Individual components become simpler and more reusable',
          'Makes object protocols more understandable'
        ],
        cons: [
          'Mediator can become complex and hard to maintain',
          'Can become god object if not designed carefully',
          'May impact performance due to indirection'
        ],
        realWorldExample: 'GUI dialog boxes, chat room servers, air traffic control systems, workflow engines',
        codeExample: `// Mediator Pattern
interface Mediator {
  void notify(Component sender, String event);
}

abstract class Component {
  protected Mediator mediator;

  public Component(Mediator mediator) {
    this.mediator = mediator;
  }
}

class Button extends Component {
  public Button(Mediator mediator) {
    super(mediator);
  }

  public void click() {
    mediator.notify(this, "click");
  }
}

class TextBox extends Component {
  private String text = "";

  public TextBox(Mediator mediator) {
    super(mediator);
  }

  public void setText(String text) {
    this.text = text;
    mediator.notify(this, "textChanged");
  }

  public String getText() { return text; }
}

class CheckBox extends Component {
  private boolean checked = false;

  public CheckBox(Mediator mediator) {
    super(mediator);
  }

  public void setChecked(boolean checked) {
    this.checked = checked;
    mediator.notify(this, "checkChanged");
  }

  public boolean isChecked() { return checked; }
}

class DialogMediator implements Mediator {
  private Button submitButton;
  private TextBox nameField;
  private CheckBox agreeCheckBox;

  public DialogMediator() {
    submitButton = new Button(this);
    nameField = new TextBox(this);
    agreeCheckBox = new CheckBox(this);
  }

  public void notify(Component sender, String event) {
    if (sender == agreeCheckBox && event.equals("checkChanged")) {
      if (agreeCheckBox.isChecked()) {
        submitButton.setEnabled(true);
      } else {
        submitButton.setEnabled(false);
      }
    }

    if (sender == nameField && event.equals("textChanged")) {
      if (nameField.getText().isEmpty()) {
        submitButton.setEnabled(false);
      }
    }
  }
}

// Usage
DialogMediator dialog = new DialogMediator();
// Components interact through mediator`,
        keyPoints: [
          'Encapsulates how set of objects interact',
          'Promotes loose coupling between colleagues',
          'Centralizes complex communications and control logic',
          'Colleagues communicate only with mediator',
          'Makes interaction protocols more understandable'
        ],
        theoreticalFoundation: {
          intent: 'Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly, and it lets you vary their interaction independently.',
          motivation: 'Object-oriented design encourages distribution of behavior among objects. Such distribution can result in object structure with many connections between objects.',
          applicability: [
            'Set of objects communicate in well-defined but complex ways',
            'Reusing object is difficult because it refers to and communicates with many other objects',
            'Behavior distributed between several classes should be customizable without lots of subclassing'
          ],
          structure: 'Mediator defines interface for communication between Colleague components.',
          participants: [
            'Mediator: defines interface for communication between Colleague components',
            'ConcreteMediator: implements cooperative behavior by coordinating Colleague objects',
            'Colleague classes: each Colleague class knows its Mediator object'
          ]
        }
      },
      {
        id: 'memento',
        name: 'Memento',
        description: 'Without violating encapsulation, capture and externalize an object\'s internal state so that the object can be restored to this state later.',
        difficulty: 'Intermediate',
        useCase: 'Undo mechanisms, checkpoints, snapshots, transaction rollback, game save states',
        pros: [
          'Preserves encapsulation boundaries',
          'Simplifies Originator by delegating state storage',
          'Provides easy undo/redo functionality',
          'Can be used for checkpointing'
        ],
        cons: [
          'Might be expensive if Originator must copy large amounts of information',
          'Caretakers don\'t know how much state is stored',
          'Hidden costs in caring for mementos',
          'Versioning can be difficult'
        ],
        realWorldExample: 'Text editor undo, database transactions, game save states, version control systems',
        codeExample: `// Memento Pattern
class Memento {
  private String state;
  private Date timestamp;

  public Memento(String state) {
    this.state = state;
    this.timestamp = new Date();
  }

  public String getState() { return state; }
  public Date getTimestamp() { return timestamp; }
}

class Originator {
  private String state;

  public void setState(String state) {
    System.out.println("Setting state to: " + state);
    this.state = state;
  }

  public String getState() {
    return state;
  }

  public Memento createMemento() {
    return new Memento(state);
  }

  public void restoreFromMemento(Memento memento) {
    state = memento.getState();
    System.out.println("Restored state to: " + state);
  }
}

class Caretaker {
  private List<Memento> mementos = new ArrayList<>();
  private Originator originator;

  public Caretaker(Originator originator) {
    this.originator = originator;
  }

  public void saveState() {
    mementos.add(originator.createMemento());
  }

  public void undo() {
    if (!mementos.isEmpty()) {
      Memento memento = mementos.remove(mementos.size() - 1);
      originator.restoreFromMemento(memento);
    }
  }

  public void showHistory() {
    for (int i = 0; i < mementos.size(); i++) {
      Memento m = mementos.get(i);
      System.out.println(i + ": " + m.getState() + " at " + m.getTimestamp());
    }
  }
}

// Usage
Originator originator = new Originator();
Caretaker caretaker = new Caretaker(originator);

originator.setState("State 1");
caretaker.saveState();

originator.setState("State 2");
caretaker.saveState();

originator.setState("State 3");
caretaker.undo(); // Back to State 2
caretaker.undo(); // Back to State 1`,
        keyPoints: [
          'Captures object\'s internal state without violating encapsulation',
          'Allows object to be restored to previous state',
          'Originator creates and uses mementos',
          'Caretaker stores mementos but never operates on them',
          'Memento provides narrow interface to caretaker, wide interface to originator'
        ],
        theoreticalFoundation: {
          intent: 'Without violating encapsulation, capture and externalize an object\'s internal state so that the object can be restored to this state later.',
          motivation: 'Sometimes it\'s necessary to record internal state of object. This is required when implementing checkpoints and undo mechanisms.',
          applicability: [
            'Snapshot of object\'s state must be saved so it can be restored later',
            'Direct interface to obtaining state would expose implementation details and break encapsulation'
          ],
          structure: 'Memento stores snapshot of Originator\'s internal state.',
          participants: [
            'Memento: stores internal state of Originator object',
            'Originator: creates memento containing snapshot of its current internal state',
            'Caretaker: responsible for memento\'s safekeeping, never operates on or examines contents'
          ]
        }
      },
      {
        id: 'state',
        name: 'State',
        description: 'Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.',
        difficulty: 'Intermediate',
        useCase: 'State machines, game character behavior, UI component states, protocol implementations',
        pros: [
          'Localizes state-specific behavior and partitions behavior for different states',
          'Makes state transitions explicit',
          'State objects can be shared if they don\'t have instance variables',
          'Eliminates large conditional statements'
        ],
        cons: [
          'Increases number of classes',
          'May be overkill if state machine is simple',
          'Can make code harder to understand if overused'
        ],
        realWorldExample: 'TCP connection states, game character states, UI component states, vending machines',
        codeExample: `// State Pattern
interface State {
  void handle(Context context);
}

class Context {
  private State state;

  public Context(State initialState) {
    this.state = initialState;
  }

  public void setState(State state) {
    this.state = state;
  }

  public void request() {
    state.handle(this);
  }
}

class ConcreteStateA implements State {
  public void handle(Context context) {
    System.out.println("Handling request in State A");
    // Transition to State B
    context.setState(new ConcreteStateB());
  }
}

class ConcreteStateB implements State {
  public void handle(Context context) {
    System.out.println("Handling request in State B");
    // Transition to State A
    context.setState(new ConcreteStateA());
  }
}

// Real-world example: TCP Connection
interface TCPState {
  void open(TCPConnection connection);
  void close(TCPConnection connection);
  void acknowledge(TCPConnection connection);
}

class TCPConnection {
  private TCPState state;

  public TCPConnection() {
    state = new TCPClosed();
  }

  public void setState(TCPState state) {
    this.state = state;
  }

  public void open() { state.open(this); }
  public void close() { state.close(this); }
  public void acknowledge() { state.acknowledge(this); }
}

class TCPClosed implements TCPState {
  public void open(TCPConnection connection) {
    System.out.println("Opening connection");
    connection.setState(new TCPEstablished());
  }

  public void close(TCPConnection connection) {
    System.out.println("Connection already closed");
  }

  public void acknowledge(TCPConnection connection) {
    System.out.println("Cannot acknowledge - connection closed");
  }
}

class TCPEstablished implements TCPState {
  public void open(TCPConnection connection) {
    System.out.println("Connection already open");
  }

  public void close(TCPConnection connection) {
    System.out.println("Closing connection");
    connection.setState(new TCPClosed());
  }

  public void acknowledge(TCPConnection connection) {
    System.out.println("Acknowledging data");
  }
}

// Usage
TCPConnection connection = new TCPConnection();
connection.open();        // Opens connection
connection.acknowledge(); // Acknowledges data
connection.close();       // Closes connection`,
        keyPoints: [
          'Allows object to alter behavior when internal state changes',
          'Encapsulates state-specific behavior in separate state classes',
          'Context delegates state-specific requests to current state object',
          'State transitions are explicit and controlled by state objects',
          'Eliminates large conditional statements based on state'
        ],
        theoreticalFoundation: {
          intent: 'Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.',
          motivation: 'Consider a class TCPConnection that represents a network connection. A TCPConnection object can be in one of several different states.',
          applicability: [
            'Object\'s behavior depends on its state, and it must change behavior at runtime',
            'Operations have large, multipart conditional statements that depend on object\'s state'
          ],
          structure: 'Context maintains instance of ConcreteState subclass that defines current state.',
          participants: [
            'Context: defines interface of interest to clients, maintains instance of ConcreteState',
            'State: defines interface for encapsulating behavior associated with particular state',
            'ConcreteState: each subclass implements behavior associated with state of Context'
          ]
        }
      },
      {
        id: 'template-method',
        name: 'Template Method',
        description: 'Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps without changing algorithm structure.',
        difficulty: 'Beginner',
        useCase: 'Framework design, code reuse, algorithm customization, common workflow with variations',
        pros: [
          'Code reuse - common parts of algorithm are in superclass',
          'Control over which parts of algorithm can be overridden',
          'Inverts control - framework calls application code',
          'Promotes code reuse and reduces duplication'
        ],
        cons: [
          'Can be restrictive - clients must follow algorithm structure',
          'Debugging can be difficult due to flow of control',
          'Maintenance can be difficult if template gets complex'
        ],
        realWorldExample: 'Java servlet lifecycle, Spring framework templates, data processing pipelines, sorting algorithms',
        codeExample: `// Template Method Pattern
abstract class DataProcessor {
  // Template method
  public final void process() {
    readData();
    processData();
    writeData();
  }

  protected abstract void readData();
  protected abstract void processData();
  protected abstract void writeData();

  // Hook method - can be overridden but has default implementation
  protected void validate() {
    System.out.println("Default validation");
  }
}

class CSVDataProcessor extends DataProcessor {
  protected void readData() {
    System.out.println("Reading data from CSV file");
  }

  protected void processData() {
    System.out.println("Processing CSV data");
  }

  protected void writeData() {
    System.out.println("Writing processed data to database");
  }
}

class XMLDataProcessor extends DataProcessor {
  protected void readData() {
    System.out.println("Reading data from XML file");
  }

  protected void processData() {
    System.out.println("Processing XML data");
  }

  protected void writeData() {
    System.out.println("Writing processed data to file");
  }

  @Override
  protected void validate() {
    System.out.println("XML-specific validation");
  }
}

// Real-world example: Sorting algorithm
abstract class SortAlgorithm {
  public final void sort(int[] array) {
    if (array.length <= 1) return;

    preSort(array);
    doSort(array);
    postSort(array);
  }

  protected void preSort(int[] array) {
    System.out.println("Pre-sort preparation");
  }

  protected abstract void doSort(int[] array);

  protected void postSort(int[] array) {
    System.out.println("Post-sort cleanup");
  }
}

class QuickSort extends SortAlgorithm {
  protected void doSort(int[] array) {
    System.out.println("Performing QuickSort");
    quickSort(array, 0, array.length - 1);
  }

  private void quickSort(int[] array, int low, int high) {
    // QuickSort implementation
  }
}

// Usage
DataProcessor csvProcessor = new CSVDataProcessor();
csvProcessor.process();

DataProcessor xmlProcessor = new XMLDataProcessor();
xmlProcessor.process();`,
        keyPoints: [
          'Defines skeleton of algorithm in base class',
          'Subclasses override specific steps without changing overall structure',
          'Uses inheritance to vary parts of algorithm',
          'Template method calls primitive operations that subclasses implement',
          'Promotes code reuse through common algorithm structure'
        ],
        theoreticalFoundation: {
          intent: 'Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm\'s structure.',
          motivation: 'Consider an application framework that provides Application and Document classes. Both are abstract and clients define application-specific subclasses.',
          applicability: [
            'To implement invariant parts of algorithm once and leave varying parts to subclasses',
            'When common behavior among subclasses should be factored and localized',
            'To control subclass extensions'
          ],
          structure: 'AbstractClass defines abstract primitive operations that concrete subclasses define to implement steps of algorithm.',
          participants: [
            'AbstractClass: defines abstract primitive operations that concrete subclasses implement',
            'ConcreteClass: implements primitive operations to carry out subclass-specific steps'
          ]
        }
      },
      {
        id: 'visitor',
        name: 'Visitor',
        description: 'Represent an operation to be performed on the elements of an object structure. Visitor lets you define a new operation without changing the classes of elements on which it operates.',
        difficulty: 'Advanced',
        useCase: 'Operations on complex object structures, compilers, document processing, tree traversal with different operations',
        pros: [
          'Makes adding new operations easy',
          'Gathers related operations and separates unrelated ones',
          'Can accumulate state as it visits each element',
          'Can visit elements across class hierarchies'
        ],
        cons: [
          'Adding new ConcreteElement classes is hard',
          'May break encapsulation of element classes',
          'Can be complex to understand and maintain',
          'Circular dependencies between Visitor and Element hierarchies'
        ],
        realWorldExample: 'Compiler AST operations, document processing, file system operations, XML processing',
        codeExample: `// Visitor Pattern
interface Visitor {
  void visit(ConcreteElementA element);
  void visit(ConcreteElementB element);
}

interface Element {
  void accept(Visitor visitor);
}

class ConcreteElementA implements Element {
  public void accept(Visitor visitor) {
    visitor.visit(this);
  }

  public String operationA() {
    return "ConcreteElementA operation";
  }
}

class ConcreteElementB implements Element {
  public void accept(Visitor visitor) {
    visitor.visit(this);
  }

  public String operationB() {
    return "ConcreteElementB operation";
  }
}

class ConcreteVisitor1 implements Visitor {
  public void visit(ConcreteElementA element) {
    System.out.println("Visitor1: " + element.operationA());
  }

  public void visit(ConcreteElementB element) {
    System.out.println("Visitor1: " + element.operationB());
  }
}

class ConcreteVisitor2 implements Visitor {
  public void visit(ConcreteElementA element) {
    System.out.println("Visitor2 processing: " + element.operationA());
  }

  public void visit(ConcreteElementB element) {
    System.out.println("Visitor2 processing: " + element.operationB());
  }
}

class ObjectStructure {
  private List<Element> elements = new ArrayList<>();

  public void addElement(Element element) {
    elements.add(element);
  }

  public void accept(Visitor visitor) {
    for (Element element : elements) {
      element.accept(visitor);
    }
  }
}

// Real-world example: File system
interface FileSystemVisitor {
  void visitFile(File file);
  void visitDirectory(Directory directory);
}

class SizeCalculatorVisitor implements FileSystemVisitor {
  private long totalSize = 0;

  public void visitFile(File file) {
    totalSize += file.getSize();
  }

  public void visitDirectory(Directory directory) {
    // Directory size calculation logic
  }

  public long getTotalSize() { return totalSize; }
}

// Usage
ObjectStructure structure = new ObjectStructure();
structure.addElement(new ConcreteElementA());
structure.addElement(new ConcreteElementB());

Visitor visitor1 = new ConcreteVisitor1();
Visitor visitor2 = new ConcreteVisitor2();

structure.accept(visitor1);
structure.accept(visitor2);`,
        keyPoints: [
          'Represents operation to be performed on elements of object structure',
          'Lets you define new operation without changing element classes',
          'Uses double dispatch to route requests to appropriate method',
          'Visitor interface declares visit method for each ConcreteElement',
          'Elements accept visitors and call appropriate visit method'
        ],
        theoreticalFoundation: {
          intent: 'Represent an operation to be performed on the elements of an object structure. Visitor lets you define a new operation without changing the classes of the elements on which it operates.',
          motivation: 'Consider a compiler that represents programs as abstract syntax trees. It will need to perform operations on these trees for type-checking, code optimization, flow analysis, etc.',
          applicability: [
            'Object structure contains many classes with differing interfaces',
            'Many distinct and unrelated operations need to be performed on objects',
            'Classes defining object structure rarely change, but you often want to define new operations'
          ],
          structure: 'Visitor declares Visit operation for each class of ConcreteElement in object structure.',
          participants: [
            'Visitor: declares Visit operation for each class of ConcreteElement',
            'ConcreteVisitor: implements each operation declared by Visitor',
            'Element: defines Accept operation that takes visitor as argument',
            'ConcreteElement: implements Accept operation',
            'ObjectStructure: can enumerate its elements, may provide high-level interface'
          ]
        }
      }
    ]
  };

  const allPatterns = [
    ...designPatterns.creational,
    ...designPatterns.structural,
    ...designPatterns.behavioral
  ];

  const filteredPatterns = allPatterns.filter(pattern => {
    const matchesSearch = pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pattern.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'creational' && designPatterns.creational.includes(pattern)) ||
                           (selectedCategory === 'structural' && designPatterns.structural.includes(pattern)) ||
                           (selectedCategory === 'behavioral' && designPatterns.behavioral.includes(pattern));
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="holub-patterns" 
      style={{ 
        background: themes[currentTheme].gradient,
        '--theme-primary': themes[currentTheme].primary,
        '--theme-secondary': themes[currentTheme].secondary
      }}
    >
      <div className="patterns-header">
        <div className="book-info">
          <BookOpen size={32} />
          <div>
            <h1>Holub on Patterns</h1>
            <p className="book-subtitle">Learning Design Patterns by Looking at Code</p>
            <p className="book-author">by Allen Holub</p>
          </div>
        </div>
        
        <div className="header-controls">
          <div className="progress-stats">
            <div className="stat-item">
              <CheckCircle size={16} />
              <span>{completedPatterns.size}/{allPatterns.length} Mastered</span>
            </div>
            <div className="stat-item">
              <Star size={16} />
              <span>{bookmarks.size} Bookmarked</span>
            </div>
          </div>
          
          <div className="control-group">
            <div className="theme-selector">
              <Settings size={16} />
              <select 
                value={currentTheme} 
                onChange={(e) => changeTheme(e.target.value)}
                className="theme-select"
              >
                {Object.entries(themes).map(([key, theme]) => (
                  <option key={key} value={key}>{theme.name}</option>
                ))}
              </select>
            </div>
            
            <button 
              className={`study-mode-btn ${studyMode ? 'active' : ''}`}
              onClick={() => setStudyMode(!studyMode)}
            >
              {studyMode ? <Pause size={16} /> : <Play size={16} />}
              Study Mode
            </button>
          </div>
        </div>
      </div>

      <Tabs className="patterns-tabs">
        <TabList>
          <Tab><Puzzle size={16} /> Pattern Explorer</Tab>
          <Tab><Brain size={16} /> Study Guide</Tab>
          <Tab><Code size={16} /> Code Examples</Tab>
          <Tab><Award size={16} /> Mastery Quiz</Tab>
          <Tab><TrendingUp size={16} /> Progress</Tab>
        </TabList>

        <TabPanel>
          <PatternExplorer 
            patterns={filteredPatterns}
            completedPatterns={completedPatterns}
            bookmarks={bookmarks}
            notes={notes}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            setSearchTerm={setSearchTerm}
            setSelectedCategory={setSelectedCategory}
            togglePattern={togglePattern}
            toggleBookmark={toggleBookmark}
            updateNote={updateNote}
            setCurrentPattern={setCurrentPattern}
          />
        </TabPanel>

        <TabPanel>
          <StudyGuide 
            patterns={allPatterns}
            completedPatterns={completedPatterns}
            currentPattern={currentPattern}
            setCurrentPattern={setCurrentPattern}
          />
        </TabPanel>

        <TabPanel>
          <CodeExamples 
            patterns={allPatterns}
            currentPattern={currentPattern}
          />
        </TabPanel>

        <TabPanel>
          <MasteryQuiz 
            patterns={allPatterns}
            completedPatterns={completedPatterns}
            togglePattern={togglePattern}
          />
        </TabPanel>

        <TabPanel>
          <ProgressTracker 
            patterns={allPatterns}
            completedPatterns={completedPatterns}
            bookmarks={bookmarks}
            designPatterns={designPatterns}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

// Pattern Explorer Component
const PatternExplorer = ({
  patterns,
  completedPatterns,
  bookmarks,
  notes,
  searchTerm,
  selectedCategory,
  setSearchTerm,
  setSelectedCategory,
  togglePattern,
  toggleBookmark,
  updateNote,
  setCurrentPattern
}) => {
  return (
    <div className="pattern-explorer">
      <div className="explorer-controls">
        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search patterns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filter">
            <Filter size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="creational">🏗️ Creational</option>
              <option value="structural">🔗 Structural</option>
              <option value="behavioral">⚡ Behavioral</option>
            </select>
          </div>
        </div>
      </div>

      <div className="patterns-grid">
        {patterns.map((pattern) => (
          <div key={pattern.id} className="pattern-card">
            <div className="pattern-header">
              <div className="pattern-title">
                <h3>{pattern.name}</h3>
                <span className={`difficulty ${pattern.difficulty.toLowerCase()}`}>
                  {pattern.difficulty}
                </span>
              </div>

              <div className="pattern-actions">
                <button
                  onClick={() => toggleBookmark(pattern.id)}
                  className={`action-btn ${bookmarks.has(pattern.id) ? 'bookmarked' : ''}`}
                >
                  <Star size={16} />
                </button>
                <button
                  onClick={() => togglePattern(pattern.id)}
                  className={`action-btn ${completedPatterns.has(pattern.id) ? 'completed' : ''}`}
                >
                  {completedPatterns.has(pattern.id) ? <CheckCircle size={16} /> : <Circle size={16} />}
                </button>
              </div>
            </div>

            <p className="pattern-description">{pattern.description}</p>

            <div className="pattern-details">
              <div className="use-case">
                <strong>Use Case:</strong> {pattern.useCase}
              </div>

              <div className="example">
                <strong>Example:</strong> {pattern.realWorldExample}
              </div>
            </div>

            <div className="pattern-footer">
              <button
                className="study-btn"
                onClick={() => setCurrentPattern(pattern)}
              >
                <Eye size={16} />
                Study Pattern
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Study Guide Component
const StudyGuide = ({ patterns, completedPatterns, currentPattern, setCurrentPattern }) => {
  const [activeSection, setActiveSection] = useState('overview');

  // Group patterns by category
  const groupedPatterns = {
    creational: patterns.filter(p => ['abstract-factory', 'builder', 'factory-method', 'prototype', 'singleton'].includes(p.id)),
    structural: patterns.filter(p => ['adapter', 'bridge', 'composite', 'decorator', 'facade', 'flyweight', 'proxy'].includes(p.id)),
    behavioral: patterns.filter(p => ['chain-of-responsibility', 'command', 'interpreter', 'iterator', 'mediator', 'memento', 'observer', 'state', 'strategy', 'template-method', 'visitor'].includes(p.id))
  };

  if (!currentPattern) {
    return (
      <div className="study-guide-overview">
        <div className="study-guide-header">
          <Brain size={48} />
          <div>
            <h2>Design Patterns Study Guide</h2>
            <p>Comprehensive study sessions for all 23 Gang of Four design patterns</p>
          </div>
        </div>

        <div className="study-categories">
          {Object.entries(groupedPatterns).map(([category, categoryPatterns]) => (
            <div key={category} className="study-category">
              <div className="category-header">
                <h3>{category.charAt(0).toUpperCase() + category.slice(1)} Patterns</h3>
                <span className="pattern-count">{categoryPatterns.length} patterns</span>
              </div>

              <div className="study-pattern-grid">
                {categoryPatterns.map(pattern => (
                  <div
                    key={pattern.id}
                    className={`study-pattern-card ${completedPatterns.has(pattern.id) ? 'completed' : ''}`}
                    onClick={() => setCurrentPattern(pattern)}
                  >
                    <div className="pattern-card-header">
                      <h4>{pattern.name}</h4>
                      <div className="pattern-badges">
                        <span className={`difficulty ${pattern.difficulty.toLowerCase()}`}>
                          {pattern.difficulty}
                        </span>
                        {completedPatterns.has(pattern.id) && (
                          <span className="completed-badge">
                            <CheckCircle size={16} /> Completed
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="pattern-description">{pattern.description}</p>

                    <div className="pattern-meta">
                      <div className="use-case">
                        <strong>Use Case:</strong> {pattern.useCase}
                      </div>
                      <div className="real-world">
                        <strong>Examples:</strong> {pattern.realWorldExample}
                      </div>
                    </div>

                    <div className="study-actions">
                      <button className="study-btn primary">
                        <BookOpen size={16} /> Start Study Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="study-stats">
          <div className="stat">
            <span className="stat-number">{patterns.length}</span>
            <span className="stat-label">Total Patterns</span>
          </div>
          <div className="stat">
            <span className="stat-number">{completedPatterns.size}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat">
            <span className="stat-number">{Math.round((completedPatterns.size / patterns.length) * 100)}%</span>
            <span className="stat-label">Progress</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="study-guide">
      <div className="study-header">
        <div className="pattern-info">
          <button
            className="back-to-overview-btn"
            onClick={() => setCurrentPattern(null)}
          >
            <ArrowLeft size={16} /> Back to All Patterns
          </button>
          <h2>{currentPattern.name}</h2>
          <span className={`difficulty ${currentPattern.difficulty.toLowerCase()}`}>
            {currentPattern.difficulty}
          </span>
        </div>

        <div className="study-nav">
          <button
            onClick={() => setActiveSection('overview')}
            className={`nav-btn ${activeSection === 'overview' ? 'active' : ''}`}
          >
            📋 Overview
          </button>
          <button
            onClick={() => setActiveSection('implementation')}
            className={`nav-btn ${activeSection === 'implementation' ? 'active' : ''}`}
          >
            💻 Implementation
          </button>
          <button
            onClick={() => setActiveSection('analysis')}
            className={`nav-btn ${activeSection === 'analysis' ? 'active' : ''}`}
          >
            🔍 Analysis
          </button>
        </div>
      </div>

      <div className="study-content">
        {activeSection === 'overview' && (
          <div className="overview-section">
            <div className="description-card">
              <h3>Pattern Description</h3>
              <p>{currentPattern.description}</p>
            </div>

            <div className="key-points-card">
              <h3>Key Points</h3>
              <ul>
                {currentPattern.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="pros-cons-grid">
              <div className="pros-card">
                <h3>✅ Advantages</h3>
                <ul>
                  {currentPattern.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>

              <div className="cons-card">
                <h3>❌ Disadvantages</h3>
                <ul>
                  {currentPattern.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'implementation' && (
          <div className="implementation-section">
            <div className="code-example-card">
              <h3>Code Example</h3>
              <pre className="code-block">
                <code>{currentPattern.codeExample}</code>
              </pre>
            </div>

            <div className="real-world-card">
              <h3>Real-World Example</h3>
              <p>{currentPattern.realWorldExample}</p>
            </div>
          </div>
        )}

        {activeSection === 'analysis' && (
          <div className="analysis-section">
            <div className="use-case-card">
              <h3>When to Use</h3>
              <p>{currentPattern.useCase}</p>
            </div>

            <div className="related-patterns-card">
              <h3>Related Patterns</h3>
              <p>Explore patterns that work well with {currentPattern.name} or solve similar problems.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Code Examples Component
const CodeExamples = ({ patterns, currentPattern }) => {
  const [selectedPattern, setSelectedPattern] = useState(currentPattern || patterns[0]);

  return (
    <div className="code-examples">
      <div className="code-sidebar">
        <h3>Select Pattern</h3>
        <div className="pattern-list">
          {patterns.map(pattern => (
            <button
              key={pattern.id}
              onClick={() => setSelectedPattern(pattern)}
              className={`pattern-item ${selectedPattern?.id === pattern.id ? 'active' : ''}`}
            >
              <Code size={16} />
              {pattern.name}
            </button>
          ))}
        </div>
      </div>

      <div className="code-content">
        {selectedPattern && (
          <>
            <div className="code-header">
              <h2>{selectedPattern.name} Implementation</h2>
              <span className="difficulty">{selectedPattern.difficulty}</span>
            </div>

            <div className="code-example-full">
              <h3>Complete Example</h3>
              <pre className="code-block">
                <code>{selectedPattern.codeExample}</code>
              </pre>
            </div>

            <div className="implementation-notes">
              <h3>Implementation Notes</h3>
              <ul>
                {selectedPattern.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="usage-example">
              <h3>Real-World Usage</h3>
              <p>{selectedPattern.realWorldExample}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Mastery Quiz Component
const MasteryQuiz = ({ patterns, completedPatterns, togglePattern }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const quizQuestions = [
    {
      question: "Which pattern ensures a class has only one instance?",
      options: ["Factory Method", "Singleton", "Observer", "Strategy"],
      correct: 1,
      explanation: "Singleton pattern ensures a class has only one instance and provides global access to it."
    },
    {
      question: "What is the main purpose of the Observer pattern?",
      options: [
        "Create objects without specifying exact classes",
        "Add behavior to objects dynamically",
        "Define one-to-many dependency between objects",
        "Encapsulate algorithms in separate classes"
      ],
      correct: 2,
      explanation: "Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all dependents are notified."
    },
    {
      question: "Which pattern is best for adding functionality to objects at runtime?",
      options: ["Adapter", "Decorator", "Facade", "Proxy"],
      correct: 1,
      explanation: "Decorator pattern allows behavior to be added to objects dynamically without altering their structure."
    }
  ];

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === quizQuestions[currentQuestionIndex].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      setQuizStarted(false);
    }
  };

  if (!quizStarted) {
    return (
      <div className="quiz-start">
        <div className="quiz-intro">
          <Award size={64} />
          <h2>Design Patterns Mastery Quiz</h2>
          <p>Test your knowledge of design patterns with this interactive quiz.</p>

          <div className="quiz-stats">
            <div className="stat">
              <strong>{quizQuestions.length}</strong>
              <span>Questions</span>
            </div>
            <div className="stat">
              <strong>{completedPatterns.size}</strong>
              <span>Patterns Mastered</span>
            </div>
          </div>

          <button className="start-quiz-btn" onClick={startQuiz}>
            <Play size={20} />
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="mastery-quiz">
      <div className="quiz-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
        <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
      </div>

      <div className="question-card">
        <h3>{currentQuestion.question}</h3>

        <div className="answer-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`option-btn ${
                showResult
                  ? index === currentQuestion.correct
                    ? 'correct'
                    : index === selectedAnswer
                      ? 'incorrect'
                      : ''
                  : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="result-explanation">
            <div className={`result ${selectedAnswer === currentQuestion.correct ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === currentQuestion.correct ? '✅ Correct!' : '❌ Incorrect'}
            </div>
            <p>{currentQuestion.explanation}</p>

            <button className="next-btn" onClick={nextQuestion}>
              {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Progress Tracker Component
const ProgressTracker = ({ patterns, completedPatterns, bookmarks, designPatterns }) => {
  const totalPatterns = patterns.length;
  const completedCount = completedPatterns.size;
  const progressPercentage = (completedCount / totalPatterns) * 100;

  const categoryProgress = {
    creational: {
      total: designPatterns.creational.length,
      completed: designPatterns.creational.filter(p => completedPatterns.has(p.id)).length
    },
    structural: {
      total: designPatterns.structural.length,
      completed: designPatterns.structural.filter(p => completedPatterns.has(p.id)).length
    },
    behavioral: {
      total: designPatterns.behavioral.length,
      completed: designPatterns.behavioral.filter(p => completedPatterns.has(p.id)).length
    }
  };

  return (
    <div className="progress-tracker">
      <div className="overall-progress">
        <h2>Your Learning Progress</h2>
        <div className="progress-circle">
          <div className="circle-progress" style={{ '--progress': progressPercentage }}>
            <span className="progress-text">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
        <p>{completedCount} of {totalPatterns} patterns mastered</p>
      </div>

      <div className="category-breakdown">
        <h3>Progress by Category</h3>

        {Object.entries(categoryProgress).map(([category, progress]) => (
          <div key={category} className="category-progress">
            <div className="category-header">
              <span className="category-name">
                {category === 'creational' ? '🏗️ Creational' :
                 category === 'structural' ? '🔗 Structural' : '⚡ Behavioral'}
              </span>
              <span className="category-stats">
                {progress.completed}/{progress.total}
              </span>
            </div>
            <div className="category-bar">
              <div
                className="category-fill"
                style={{ width: `${(progress.completed / progress.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="achievements">
        <h3>Achievements</h3>
        <div className="achievement-grid">
          <div className={`achievement ${completedCount >= 1 ? 'unlocked' : ''}`}>
            <Star size={24} />
            <span>First Pattern</span>
          </div>
          <div className={`achievement ${completedCount >= 5 ? 'unlocked' : ''}`}>
            <Award size={24} />
            <span>Pattern Explorer</span>
          </div>
          <div className={`achievement ${bookmarks.size >= 3 ? 'unlocked' : ''}`}>
            <Lightbulb size={24} />
            <span>Knowledge Seeker</span>
          </div>
          <div className={`achievement ${completedCount === totalPatterns ? 'unlocked' : ''}`}>
            <TrendingUp size={24} />
            <span>Pattern Master</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolubDesignPatterns;
