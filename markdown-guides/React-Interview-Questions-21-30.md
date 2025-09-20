# React Interview Questions (21-30): Components & Props

## Q21. How React provides Reusability and Composition?

### **Answer:**
React provides reusability and composition through its **component-based architecture**, enabling developers to build complex UIs from simple, reusable building blocks.

### **Reusability:**

### **1. Component Reusability**
```javascript
// Create once, use everywhere
function Button({ variant = 'primary', size = 'medium', onClick, children }) {
  const className = `btn btn-${variant} btn-${size}`;
  
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

// Reuse across application
function LoginForm() {
  return (
    <form>
      <Button variant="primary" onClick={handleLogin}>
        Login
      </Button>
      <Button variant="secondary" onClick={handleCancel}>
        Cancel
      </Button>
    </form>
  );
}

function ProductCard() {
  return (
    <div>
      <Button variant="success" size="small" onClick={handleAddToCart}>
        Add to Cart
      </Button>
      <Button variant="outline" size="small" onClick={handleWishlist}>
        Wishlist
      </Button>
    </div>
  );
}
```

### **2. Custom Hooks Reusability**
```javascript
// Reusable logic
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// Reuse in multiple components
function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');
  
  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}

function ShoppingCart() {
  const [cartItems, setCartItems] = useLocalStorage('cart', []);
  // Same hook, different purpose
}
```

### **Composition:**

### **1. Component Composition**
```javascript
// Small, focused components
function Avatar({ src, alt, size = 'medium' }) {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`avatar avatar-${size}`}
    />
  );
}

function UserName({ name, role }) {
  return (
    <div className="user-name">
      <h3>{name}</h3>
      <span className="role">{role}</span>
    </div>
  );
}

function OnlineStatus({ isOnline }) {
  return (
    <span className={`status ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? '🟢' : '🔴'}
    </span>
  );
}

// Compose into larger component
function UserCard({ user }) {
  return (
    <div className="user-card">
      <Avatar 
        src={user.avatar} 
        alt={user.name} 
        size="large" 
      />
      <UserName 
        name={user.name} 
        role={user.role} 
      />
      <OnlineStatus 
        isOnline={user.isOnline} 
      />
    </div>
  );
}
```

### **2. Children Composition**
```javascript
// Container component
function Card({ title, children, footer }) {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

// Flexible composition
function ProductDetails({ product }) {
  return (
    <Card 
      title={product.name}
      footer={
        <Button onClick={() => addToCart(product.id)}>
          Add to Cart
        </Button>
      }
    >
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <span className="price">${product.price}</span>
    </Card>
  );
}

function UserProfile({ user }) {
  return (
    <Card title="User Profile">
      <Avatar src={user.avatar} alt={user.name} />
      <UserName name={user.name} role={user.role} />
      <p>{user.bio}</p>
    </Card>
  );
}
```

### **3. Higher-Order Components (HOCs)**
```javascript
// Reusable behavior
function withLoading(WrappedComponent) {
  return function WithLoadingComponent(props) {
    if (props.isLoading) {
      return <div className="loading">Loading...</div>;
    }
    
    return <WrappedComponent {...props} />;
  };
}

// Apply to any component
const UserListWithLoading = withLoading(UserList);
const ProductListWithLoading = withLoading(ProductList);

// Usage
function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <UserListWithLoading 
      users={users} 
      isLoading={isLoading} 
    />
  );
}
```

### **4. Render Props Pattern**
```javascript
// Reusable data fetching logic
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [url]);
  
  return render({ data, loading, error });
}

// Flexible rendering
function UserProfile({ userId }) {
  return (
    <DataFetcher 
      url={`/api/users/${userId}`}
      render={({ data: user, loading, error }) => {
        if (loading) return <div>Loading user...</div>;
        if (error) return <div>Error: {error.message}</div>;
        
        return (
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        );
      }}
    />
  );
}
```

### **Benefits of Reusability & Composition:**

### **1. DRY Principle (Don't Repeat Yourself)**
```javascript
// Instead of repeating code
function LoginButton() {
  return (
    <button 
      className="btn btn-primary btn-large"
      onClick={handleLogin}
    >
      Login
    </button>
  );
}

function SignupButton() {
  return (
    <button 
      className="btn btn-secondary btn-large"
      onClick={handleSignup}
    >
      Sign Up
    </button>
  );
}

// Create reusable component
function ActionButton({ variant, size, onClick, children }) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### **2. Maintainability**
```javascript
// Change in one place affects all usages
function Button({ variant, onClick, children, disabled = false }) {
  // Add new feature: disabled state
  return (
    <button 
      className={`btn btn-${variant} ${disabled ? 'btn-disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// All Button usages automatically get disabled functionality
<Button variant="primary" disabled={isSubmitting}>
  Submit
</Button>
```

### **3. Testing Benefits**
```javascript
// Test components in isolation
import { render, fireEvent, screen } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick}>
        Click me
      </Button>
    );
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('applies correct variant class', () => {
    render(<Button variant="secondary">Test</Button>);
    expect(screen.getByText('Test')).toHaveClass('btn-secondary');
  });
});
```

---

## Q22. What are State, Stateless, Stateful and State Management terms?

### **Answer:**
Understanding state-related terminology is fundamental to React development and component architecture.

### **State:**

### **Definition:**
**State** refers to the current data or information that a component holds and can change over time.

```javascript
function Counter() {
  // State: current count value
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### **Characteristics of State:**
- **Mutable**: Can be changed during component lifecycle
- **Private**: Belongs to the component that declares it
- **Triggers Re-render**: State changes cause component updates
- **Asynchronous**: State updates may be batched

### **Stateless Components:**

### **Definition:**
**Stateless components** don't manage their own state. They receive data through props and render UI based on that data.

```javascript
// Stateless functional component
function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// Stateless component with computed values
function ProductPrice({ price, discount = 0 }) {
  const finalPrice = price - (price * discount / 100);
  
  return (
    <div className="price">
      {discount > 0 && (
        <span className="original-price">${price}</span>
      )}
      <span className="final-price">${finalPrice.toFixed(2)}</span>
    </div>
  );
}

// Usage
function ProductList({ products }) {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <ProductPrice 
            price={product.price} 
            discount={product.discount} 
          />
        </div>
      ))}
    </div>
  );
}
```

### **Benefits of Stateless Components:**
- **Predictable**: Same props always produce same output
- **Testable**: Easy to test with different prop combinations
- **Reusable**: Can be used in different contexts
- **Performance**: React can optimize pure components

### **Stateful Components:**

### **Definition:**
**Stateful components** manage their own internal state and can update it over time.

```javascript
// Stateful functional component with hooks
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  
  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false
        }
      ]);
      setInputValue('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });
  
  return (
    <div className="todo-app">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={addTodo}>Add</button>
      
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.completed ? 'completed' : ''}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### **Class Component State (Legacy):**
```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  
  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }
  
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>
          Increment
        </button>
      </div>
    );
  }
}
```

### **State Management:**

### **Definition:**
**State Management** refers to the process of managing and updating application state, especially when state needs to be shared across multiple components.

### **1. Local State Management (useState)**
```javascript
function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  
  const addItem = (product) => {
    const newItems = [...items, product];
    setItems(newItems);
    setTotal(newItems.reduce((sum, item) => sum + item.price, 0));
  };
  
  return (
    <div>
      <h2>Cart Total: ${total}</h2>
      {items.map(item => (
        <div key={item.id}>{item.name} - ${item.price}</div>
      ))}
    </div>
  );
}
```

### **2. Context API (Global State)**
```javascript
// Create context
const AppContext = createContext();

// Provider component
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  
  const value = {
    user,
    setUser,
    theme,
    setTheme,
    notifications,
    setNotifications
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Consumer hook
function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

// Usage in components
function Header() {
  const { user, theme, setTheme } = useAppContext();
  
  return (
    <header className={`header ${theme}`}>
      <h1>My App</h1>
      {user && <span>Welcome, {user.name}</span>}
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </header>
  );
}
```

### **3. External State Management (Redux)**
```javascript
// Redux store
const initialState = {
  user: null,
  products: [],
  cart: []
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_TO_CART':
      return { 
        ...state, 
        cart: [...state.cart, action.payload] 
      };
    default:
      return state;
  }
}

// Component using Redux
import { useSelector, useDispatch } from 'react-redux';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  
  const addToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}
```

### **State Management Patterns:**

### **1. Lifting State Up**
```javascript
// Child components need shared state
function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <fieldset>
      <legend>Enter temperature in {scale}:</legend>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </fieldset>
  );
}

// Parent manages shared state
function Calculator() {
  const [scale, setScale] = useState('c');
  const [temperature, setTemperature] = useState('');
  
  const handleCelsiusChange = (temperature) => {
    setScale('c');
    setTemperature(temperature);
  };
  
  const handleFahrenheitChange = (temperature) => {
    setScale('f');
    setTemperature(temperature);
  };
  
  const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
  const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;
  
  return (
    <div>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
    </div>
  );
}
```

### **2. State Normalization**
```javascript
// Normalized state structure
const initialState = {
  users: {
    byId: {
      1: { id: 1, name: 'John', email: 'john@example.com' },
      2: { id: 2, name: 'Jane', email: 'jane@example.com' }
    },
    allIds: [1, 2]
  },
  posts: {
    byId: {
      101: { id: 101, title: 'Post 1', authorId: 1 },
      102: { id: 102, title: 'Post 2', authorId: 2 }
    },
    allIds: [101, 102]
  }
};

// Selector functions
const getUser = (state, userId) => state.users.byId[userId];
const getAllUsers = (state) => 
  state.users.allIds.map(id => state.users.byId[id]);
const getPostWithAuthor = (state, postId) => {
  const post = state.posts.byId[postId];
  const author = state.users.byId[post.authorId];
  return { ...post, author };
};
```

### **When to Use Each Approach:**

| **Approach** | **Use Case** | **Complexity** |
|--------------|--------------|----------------|
| **Local State** | Component-specific data | Low |
| **Lifting State Up** | Shared between siblings | Medium |
| **Context API** | Global app state | Medium |
| **Redux/Zustand** | Complex state logic | High |

---

## Q23. What are Props in JSX?

### **Answer:**
**Props (Properties)** are a way to pass data from a parent component to a child component in React. They are the primary mechanism for component communication and data flow.

### **Basic Props Usage:**

```javascript
// Parent component passing props
function App() {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  };
  
  return (
    <div>
      <UserProfile 
        name={user.name}
        email={user.email}
        age={user.age}
        isActive={true}
      />
    </div>
  );
}

// Child component receiving props
function UserProfile(props) {
  return (
    <div className="user-profile">
      <h2>{props.name}</h2>
      <p>Email: {props.email}</p>
      <p>Age: {props.age}</p>
      <p>Status: {props.isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}
```

### **Props Destructuring:**

```javascript
// Destructuring in function parameters
function UserProfile({ name, email, age, isActive }) {
  return (
    <div className="user-profile">
      <h2>{name}</h2>
      <p>Email: {email}</p>
      <p>Age: {age}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}

// Destructuring with default values
function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  onClick 
}) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### **Types of Props:**

### **1. String Props**
```javascript
function Greeting({ message, className }) {
  return <h1 className={className}>{message}</h1>;
}

// Usage
<Greeting message="Hello World" className="title" />
```

### **2. Number Props**
```javascript
function ProgressBar({ progress, max = 100 }) {
  const percentage = (progress / max) * 100;
  
  return (
    <div className="progress-bar">
      <div 
        className="progress-fill"
        style={{ width: `${percentage}%` }}
      />
      <span>{progress}/{max}</span>
    </div>
  );
}

// Usage
<ProgressBar progress={75} max={100} />
```

### **3. Boolean Props**
```javascript
function Modal({ isOpen, showCloseButton = true, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        {showCloseButton && (
          <button className="close-btn">×</button>
        )}
        {children}
      </div>
    </div>
  );
}

// Usage
<Modal isOpen={true} showCloseButton={false}>
  <p>Modal content</p>
</Modal>
```

### **4. Object Props**
```javascript
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span className="price">${product.price}</span>
      <div className="rating">
        {'★'.repeat(product.rating)}
      </div>
    </div>
  );
}

// Usage
const product = {
  id: 1,
  name: 'Laptop',
  description: 'High-performance laptop',
  price: 999,
  rating: 4,
  image: '/laptop.jpg'
};

<ProductCard product={product} />
```

### **5. Array Props**
```javascript
function TagList({ tags, onTagClick }) {
  return (
    <div className="tag-list">
      {tags.map(tag => (
        <button
          key={tag}
          className="tag"
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

// Usage
const tags = ['React', 'JavaScript', 'Frontend'];
<TagList 
  tags={tags} 
  onTagClick={(tag) => console.log(`Clicked: ${tag}`)} 
/>
```

### **6. Function Props (Event Handlers)**
```javascript
function SearchBox({ onSearch, placeholder = 'Search...' }) {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
      />
      <button type="submit">Search</button>
    </form>
  );
}

// Usage
function App() {
  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Perform search logic
  };
  
  return (
    <SearchBox 
      onSearch={handleSearch}
      placeholder="Search products..."
    />
  );
}
```

### **Children Prop:**

```javascript
// Children as content
function Card({ title, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

// Usage with JSX children
<Card title="User Information">
  <p>Name: John Doe</p>
  <p>Email: john@example.com</p>
  <button>Edit Profile</button>
</Card>

// Children as function (render props)
function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);
  
  return children({ data, loading });
}

// Usage
<DataProvider>
  {({ data, loading }) => (
    loading ? <div>Loading...</div> : <div>{data.title}</div>
  )}
</DataProvider>
```

### **Props Validation (PropTypes):**

```javascript
import PropTypes from 'prop-types';

function UserProfile({ name, age, email, isActive, hobbies }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
      <ul>
        {hobbies.map(hobby => (
          <li key={hobby}>{hobby}</li>
        ))}
      </ul>
    </div>
  );
}

UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  hobbies: PropTypes.arrayOf(PropTypes.string)
};

UserProfile.defaultProps = {
  isActive: false,
  hobbies: []
};
```

### **Advanced Props Patterns:**

### **1. Spread Props**
```javascript
function Button(props) {
  const { variant, size, children, ...restProps } = props;
  
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      {...restProps}  // Spreads remaining props
    >
      {children}
    </button>
  );
}

// Usage - onClick, disabled, etc. are passed through
<Button 
  variant="primary" 
  size="large"
  onClick={handleClick}
  disabled={isLoading}
  data-testid="submit-button"
>
  Submit
</Button>
```

### **2. Conditional Props**
```javascript
function Image({ src, alt, lazy = false, ...props }) {
  const imageProps = {
    src,
    alt,
    ...props
  };
  
  // Add loading="lazy" only if lazy is true
  if (lazy) {
    imageProps.loading = 'lazy';
  }
  
  return <img {...imageProps} />;
}

// Usage
<Image 
  src="/image.jpg" 
  alt="Description" 
  lazy={true}
  className="responsive-image"
/>
```

### **3. Props Transformation**
```javascript
function PriceDisplay({ amount, currency = 'USD', showCents = true }) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0
  });
  
  return (
    <span className="price">
      {formatter.format(amount)}
    </span>
  );
}

// Usage
<PriceDisplay amount={29.99} currency="USD" showCents={true} />
<PriceDisplay amount={30} currency="EUR" showCents={false} />
```

### **Props Best Practices:**

### **1. Keep Props Simple**
```javascript
// Good: Simple, focused props
function UserCard({ name, email, avatar }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}

// Avoid: Complex object with many properties
function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.profile.avatar.url} alt={user.personalInfo.fullName} />
      <h3>{user.personalInfo.fullName}</h3>
      <p>{user.contactInfo.primaryEmail}</p>
    </div>
  );
}
```

### **2. Use Descriptive Names**
```javascript
// Good: Clear, descriptive prop names
<Button 
  variant="primary"
  size="large"
  isLoading={submitting}
  onClick={handleSubmit}
>
  Submit Form
</Button>

// Avoid: Unclear prop names
<Button 
  type="1"
  big={true}
  busy={submitting}
  action={handleSubmit}
>
  Submit Form
</Button>
```

### **3. Provide Default Values**
```javascript
function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange = () => {},
  showFirstLast = true 
}) {
  return (
    <div className="pagination">
      {showFirstLast && currentPage > 1 && (
        <button onClick={() => onPageChange(1)}>
          First
        </button>
      )}
      {/* Pagination logic */}
    </div>
  );
}
```

Props are immutable from the child component's perspective and provide a unidirectional data flow from parent to child, making React applications predictable and easier to debug.
