# React Interview Questions (41-50): Lists, Hooks & State Management

## Q41. How do you iterate over a list in JSX? What is map() method?

### **Answer:**
In React, you iterate over lists using JavaScript's **map() method** to transform array elements into JSX elements.

### **Basic List Rendering:**

```javascript
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Usage
const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Bob Johnson' }
];

<UserList users={users} />
```

### **What is map() method?**

The **map() method** creates a new array by calling a provided function on every element in the original array.

```javascript
// Basic map() syntax
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Map with index
const items = ['apple', 'banana', 'orange'];
const indexed = items.map((item, index) => `${index}: ${item}`);
console.log(indexed); // ['0: apple', '1: banana', '2: orange']
```

### **Complex List Rendering:**

### **1. Product Cards**
```javascript
function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>
          <button onClick={() => addToCart(product.id)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
```

### **2. Nested Lists**
```javascript
function CategoryList({ categories }) {
  return (
    <div className="category-list">
      {categories.map(category => (
        <div key={category.id} className="category">
          <h2>{category.name}</h2>
          <ul>
            {category.items.map(item => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span className="price">${item.price}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### **3. Conditional List Items**
```javascript
function TodoList({ todos, filter }) {
  return (
    <ul className="todo-list">
      {todos
        .filter(todo => {
          if (filter === 'completed') return todo.completed;
          if (filter === 'active') return !todo.completed;
          return true; // 'all'
        })
        .map(todo => (
          <li 
            key={todo.id} 
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
    </ul>
  );
}
```

### **Key Prop Importance:**

### **Why Keys are Required:**
```javascript
// ❌ Bad: No keys (React warning)
function BadList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li>{item.name}</li> // Missing key prop
      ))}
    </ul>
  );
}

// ✅ Good: Proper keys
function GoodList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### **Key Selection Best Practices:**
```javascript
// ✅ Best: Stable, unique ID
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// ⚠️ Acceptable: Unique string property
{users.map(user => (
  <UserCard key={user.email} user={user} />
))}

// ❌ Avoid: Array index (can cause issues)
{users.map((user, index) => (
  <UserCard key={index} user={user} />
))}

// ❌ Never: Random values
{users.map(user => (
  <UserCard key={Math.random()} user={user} />
))}
```

### **Advanced List Patterns:**

### **1. List with Loading States**
```javascript
function UserList({ users, loading, error }) {
  if (loading) {
    return (
      <div className="loading">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="skeleton-item" />
        ))}
      </div>
    );
  }
  
  if (error) {
    return <div className="error">Error loading users: {error.message}</div>;
  }
  
  if (users.length === 0) {
    return <div className="empty">No users found</div>;
  }
  
  return (
    <ul className="user-list">
      {users.map(user => (
        <li key={user.id} className="user-item">
          <img src={user.avatar} alt={user.name} />
          <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
```

### **2. Virtualized Lists (Performance)**
```javascript
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="list-item">
      <span>{items[index].name}</span>
      <span>{items[index].email}</span>
    </div>
  );
  
  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </List>
  );
}
```

### **3. Grouped Lists**
```javascript
function GroupedList({ items, groupBy }) {
  const groupedItems = items.reduce((groups, item) => {
    const group = item[groupBy];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
  
  return (
    <div className="grouped-list">
      {Object.entries(groupedItems).map(([group, groupItems]) => (
        <div key={group} className="group">
          <h3 className="group-header">{group}</h3>
          <ul>
            {groupItems.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Usage
const employees = [
  { id: 1, name: 'John', department: 'Engineering' },
  { id: 2, name: 'Jane', department: 'Marketing' },
  { id: 3, name: 'Bob', department: 'Engineering' }
];

<GroupedList items={employees} groupBy="department" />
```

### **Performance Considerations:**

### **1. Memoization for Expensive Renders**
```javascript
const ExpensiveListItem = React.memo(({ item, onUpdate }) => {
  // Expensive computation
  const processedData = useMemo(() => {
    return expensiveProcessing(item.data);
  }, [item.data]);
  
  return (
    <div className="expensive-item">
      <h3>{item.name}</h3>
      <div>{processedData}</div>
      <button onClick={() => onUpdate(item.id)}>
        Update
      </button>
    </div>
  );
});

function ExpensiveList({ items, onUpdate }) {
  return (
    <div>
      {items.map(item => (
        <ExpensiveListItem
          key={item.id}
          item={item}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
```

### **2. Callback Optimization**
```javascript
function OptimizedList({ items }) {
  // Memoize callbacks to prevent unnecessary re-renders
  const handleDelete = useCallback((id) => {
    setItems(items => items.filter(item => item.id !== id));
  }, []);
  
  const handleUpdate = useCallback((id, updates) => {
    setItems(items => 
      items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);
  
  return (
    <ul>
      {items.map(item => (
        <ListItem
          key={item.id}
          item={item}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </ul>
  );
}
```

---

## Q42. What are React Hooks? What are the Top React Hooks?

### **Answer:**
**React Hooks** are functions that allow functional components to use state and lifecycle features that were previously only available in class components.

### **What are React Hooks?**

### **Definition:**
Hooks are special functions that:
1. **Start with "use"** (naming convention)
2. **Enable state and lifecycle** in functional components
3. **Allow logic reuse** between components
4. **Follow specific rules** (Rules of Hooks)

### **Before Hooks (Class Components):**
```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  componentDidMount() {
    document.title = `Count: ${this.state.count}`;
  }
  
  componentDidUpdate() {
    document.title = `Count: ${this.state.count}`;
  }
  
  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }
  
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

### **After Hooks (Functional Components):**
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  const increment = () => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### **Top React Hooks:**

### **1. useState - State Management**
```javascript
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };
  
  return (
    <form>
      <input
        value={user.name}
        onChange={(e) => updateUser('name', e.target.value)}
        placeholder="Name"
      />
      <input
        value={user.email}
        onChange={(e) => updateUser('email', e.target.value)}
        placeholder="Email"
      />
      <button disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

### **2. useEffect - Side Effects**
```javascript
function UserData({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Effect with dependency
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]); // Re-run when userId changes
  
  // Cleanup effect
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);
    
    return () => {
      clearInterval(timer); // Cleanup
    };
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  );
}
```

### **3. useContext - Context Consumption**
```javascript
// Create context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer component
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button 
      className={`btn btn-${theme}`}
      onClick={toggleTheme}
    >
      Current theme: {theme}
    </button>
  );
}
```

### **4. useReducer - Complex State Logic**
```javascript
const initialState = {
  items: [],
  loading: false,
  error: null
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_ITEM':
      return { 
        ...state, 
        items: [...state.items, action.payload] 
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  const addTodo = (text) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { id: Date.now(), text, completed: false }
    });
  };
  
  const removeTodo = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };
  
  return (
    <div>
      {state.loading && <div>Loading...</div>}
      {state.error && <div>Error: {state.error}</div>}
      <ul>
        {state.items.map(item => (
          <li key={item.id}>
            {item.text}
            <button onClick={() => removeTodo(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### **5. useCallback - Function Memoization**
```javascript
function ParentComponent({ items }) {
  const [filter, setFilter] = useState('');
  
  // Memoize callback to prevent child re-renders
  const handleItemClick = useCallback((itemId) => {
    console.log('Item clicked:', itemId);
    // Handle item click logic
  }, []); // No dependencies, function never changes
  
  const handleItemUpdate = useCallback((itemId, updates) => {
    // Update item logic
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  }, []); // Dependencies would go here if needed
  
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items..."
      />
      <ItemList
        items={filteredItems}
        onItemClick={handleItemClick}
        onItemUpdate={handleItemUpdate}
      />
    </div>
  );
}
```

### **6. useMemo - Value Memoization**
```javascript
function ExpensiveComponent({ data, multiplier }) {
  // Expensive calculation only runs when dependencies change
  const expensiveValue = useMemo(() => {
    console.log('Calculating expensive value...');
    return data.reduce((sum, item) => {
      return sum + (item.value * multiplier);
    }, 0);
  }, [data, multiplier]);
  
  // Memoize filtered data
  const filteredData = useMemo(() => {
    return data.filter(item => item.active);
  }, [data]);
  
  return (
    <div>
      <h2>Total: {expensiveValue}</h2>
      <ul>
        {filteredData.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### **7. useRef - DOM References**
```javascript
function FocusInput() {
  const inputRef = useRef(null);
  const countRef = useRef(0);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  const incrementCount = () => {
    countRef.current += 1;
    console.log('Count:', countRef.current);
    // Note: Changing ref doesn't trigger re-render
  };
  
  return (
    <div>
      <input ref={inputRef} placeholder="Click button to focus" />
      <button onClick={focusInput}>Focus Input</button>
      <button onClick={incrementCount}>Increment Count</button>
    </div>
  );
}
```

### **8. useLayoutEffect - Synchronous Side Effects**
```javascript
function MeasureComponent() {
  const [height, setHeight] = useState(0);
  const divRef = useRef(null);
  
  // Runs synchronously after DOM mutations
  useLayoutEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }); // No dependency array = runs after every render
  
  return (
    <div>
      <div ref={divRef} style={{ padding: '20px' }}>
        This div's height is: {height}px
      </div>
    </div>
  );
}
```

### **Custom Hooks:**

```javascript
// Custom hook for API calls
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}

// Custom hook for local storage
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

// Usage of custom hooks
function UserProfile() {
  const { data: user, loading, error } = useApi('/api/user');
  const [preferences, setPreferences] = useLocalStorage('userPrefs', {});
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Theme: {preferences.theme || 'default'}</p>
    </div>
  );
}
```

### **Rules of Hooks:**

1. **Only call Hooks at the top level** - Don't call inside loops, conditions, or nested functions
2. **Only call Hooks from React functions** - React components or custom Hooks
3. **Use the same order** - Hooks must be called in the same order every time

```javascript
// ❌ Bad: Conditional hook
function BadComponent({ condition }) {
  if (condition) {
    const [state, setState] = useState(0); // Don't do this!
  }
  return <div>Bad component</div>;
}

// ✅ Good: Hook at top level
function GoodComponent({ condition }) {
  const [state, setState] = useState(0);
  
  if (condition) {
    // Use state here
  }
  
  return <div>Good component</div>;
}
```

React Hooks revolutionized React development by making functional components as powerful as class components while enabling better code reuse and composition.

---

## Q43. What is the role of useState() hook and how it works?

### **Answer:**
**useState** is the most fundamental React Hook that enables functional components to manage local state.

### **Basic Syntax:**
```javascript
const [state, setState] = useState(initialValue);
```

### **How useState Works:**

### **1. Array Destructuring:**
```javascript
function Counter() {
  // useState returns an array with two elements
  const stateArray = useState(0);
  const count = stateArray[0];        // Current state value
  const setCount = stateArray[1];     // Function to update state

  // More commonly written with array destructuring:
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### **2. State Updates:**
```javascript
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  // Direct value update
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Functional update (when new state depends on previous)
  const incrementAge = () => {
    setAge(prevAge => prevAge + 1);
  };

  return (
    <form>
      <input
        value={name}
        onChange={handleNameChange}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <div>
        <span>Age: {age}</span>
        <button type="button" onClick={incrementAge}>
          +1 Year
        </button>
      </div>
    </form>
  );
}
```

### **3. Object State:**
```javascript
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    preferences: {
      theme: 'light',
      notifications: true
    }
  });

  // Update single property (merge with existing state)
  const updateName = (newName) => {
    setUser(prevUser => ({
      ...prevUser,
      name: newName
    }));
  };

  // Update nested property
  const updateTheme = (newTheme) => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        theme: newTheme
      }
    }));
  };

  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => updateName(e.target.value)}
        placeholder="Name"
      />
      <select
        value={user.preferences.theme}
        onChange={(e) => updateTheme(e.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

### **4. Array State:**
```javascript
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Add item to array
  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos(prevTodos => [
        ...prevTodos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false
        }
      ]);
      setInputValue('');
    }
  };

  // Remove item from array
  const removeTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.filter(todo => todo.id !== id)
    );
  };

  // Update item in array
  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add todo..."
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
            <button onClick={() => removeTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### **5. Lazy Initial State:**
```javascript
function ExpensiveComponent() {
  // Expensive computation only runs once
  const [data, setData] = useState(() => {
    console.log('Computing initial state...');
    return expensiveComputation();
  });

  // Alternative: without lazy initialization (runs on every render)
  // const [data, setData] = useState(expensiveComputation()); // ❌ Bad

  return <div>{data}</div>;
}

function expensiveComputation() {
  // Simulate expensive operation
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += i;
  }
  return result;
}
```

### **Key Concepts:**

### **1. State is Asynchronous:**
```javascript
function AsyncExample() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    console.log(count); // Still shows old value!

    // To use updated value, use functional update
    setCount(prevCount => {
      console.log('Previous:', prevCount);
      console.log('New:', prevCount + 1);
      return prevCount + 1;
    });
  };

  return (
    <button onClick={handleClick}>
      Count: {count}
    </button>
  );
}
```

### **2. State Batching:**
```javascript
function BatchingExample() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  const handleClick = () => {
    // These updates are batched together
    setCount(count + 1);
    setName('Updated');
    // Component only re-renders once
  };

  return (
    <div>
      <p>Count: {count}</p>
      <p>Name: {name}</p>
      <button onClick={handleClick}>Update Both</button>
    </div>
  );
}
```

### **3. State Comparison:**
```javascript
function StateComparison() {
  const [user, setUser] = useState({ name: 'John', age: 30 });

  const updateAge = () => {
    // ❌ This won't trigger re-render (same object reference)
    user.age = 31;
    setUser(user);

    // ✅ This will trigger re-render (new object)
    setUser({ ...user, age: 31 });

    // ✅ Or using functional update
    setUser(prevUser => ({ ...prevUser, age: 31 }));
  };

  return (
    <div>
      <p>{user.name} is {user.age} years old</p>
      <button onClick={updateAge}>Update Age</button>
    </div>
  );
}
```

---

## Q44. What is the role of useEffect()? How it works and what is its use?

### **Answer:**
**useEffect** is a React Hook that lets you perform side effects in functional components. It serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined in class components.

### **Basic Syntax:**
```javascript
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]); // Dependency array (optional)
```

### **How useEffect Works:**

### **1. Effect without Dependencies (Runs on Every Render):**
```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);

  // Runs after every render
  useEffect(() => {
    console.log('Component rendered, seconds:', seconds);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  });

  return <div>Seconds: {seconds}</div>;
}
```

### **2. Effect with Empty Dependencies (Runs Once):**
```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Runs only once after initial render (like componentDidMount)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Empty dependency array

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  );
}
```

### **3. Effect with Dependencies (Runs When Dependencies Change):**
```javascript
function SearchResults({ query, filters }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Runs when query or filters change
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${query}&filters=${JSON.stringify(filters)}`);
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query, filters]); // Re-run when query or filters change

  return (
    <div>
      {loading && <div>Searching...</div>}
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### **Common Use Cases:**

### **1. Data Fetching:**
```javascript
function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPosts();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### **2. Subscriptions and Event Listeners:**
```javascript
function WindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup: remove event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array

  return (
    <div>
      Window size: {windowSize.width} x {windowSize.height}
    </div>
  );
}
```

### **3. Document Title Updates:**
```javascript
function DocumentTitle({ title, count }) {
  useEffect(() => {
    document.title = count > 0 ? `(${count}) ${title}` : title;

    // Cleanup: reset title when component unmounts
    return () => {
      document.title = 'My App';
    };
  }, [title, count]);

  return <div>Check the browser tab title!</div>;
}
```

### **4. Timers and Intervals:**
```javascript
function Countdown({ initialTime }) {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    // Cleanup interval
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, time]);

  return (
    <div>
      <div>Time: {time}</div>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => setTime(initialTime)}>
        Reset
      </button>
    </div>
  );
}
```

### **5. Local Storage Synchronization:**
```javascript
function Settings() {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language');

    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  );
}
```

### **Advanced Patterns:**

### **1. Conditional Effects:**
```javascript
function ConditionalEffect({ shouldFetch, userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!shouldFetch || !userId) {
      return; // Exit early if conditions not met
    }

    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
    };

    fetchUser();
  }, [shouldFetch, userId]);

  return user ? <div>{user.name}</div> : null;
}
```

### **2. Debounced Effects:**
```javascript
function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    // Debounce search
    const timeoutId = setTimeout(async () => {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      setResults(data.results);
    }, 500); // Wait 500ms after user stops typing

    // Cleanup: cancel previous timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### **Effect Execution Order:**
1. **Component renders**
2. **DOM is updated**
3. **useEffect runs** (after render)
4. **Cleanup function runs** (before next effect or unmount)

### **Best Practices:**
- Always include dependencies in the dependency array
- Use multiple useEffect hooks for different concerns
- Clean up subscriptions and timers
- Use functional updates when state depends on previous state
- Consider using useCallback for effect dependencies that are functions

---

## Q45. What is the difference between Functional and Class Components?

### **Answer:**
React components can be written as **functional components** or **class components**. With the introduction of Hooks, functional components have become the preferred approach.

### **Functional Components:**

### **Basic Syntax:**
```javascript
// Simple functional component
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Arrow function syntax
const Welcome = (props) => {
  return <h1>Hello, {props.name}!</h1>;
};

// Implicit return for simple components
const Welcome = ({ name }) => <h1>Hello, {name}!</h1>;
```

### **With Hooks (Modern Approach):**
```javascript
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  );
}
```

### **Class Components:**

### **Basic Syntax:**
```javascript
import React, { Component } from 'react';

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

### **With State and Lifecycle:**
```javascript
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/users/${this.props.userId}`);
      const userData = await response.json();
      this.setState({ user: userData, loading: false });
    } catch (error) {
      console.error('Error:', error);
      this.setState({ loading: false });
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.setState({ loading: true });
      try {
        const response = await fetch(`/api/users/${this.props.userId}`);
        const userData = await response.json();
        this.setState({ user: userData, loading: false });
      } catch (error) {
        console.error('Error:', error);
        this.setState({ loading: false });
      }
    }
  }

  render() {
    const { user, loading } = this.state;

    if (loading) return <div>Loading...</div>;

    return (
      <div>
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
      </div>
    );
  }
}
```

### **Key Differences:**

| **Aspect** | **Functional Components** | **Class Components** |
|------------|---------------------------|----------------------|
| **Syntax** | Function declaration | Class extending Component |
| **State** | useState Hook | this.state object |
| **Lifecycle** | useEffect Hook | Lifecycle methods |
| **Props** | Function parameters | this.props |
| **Performance** | Generally faster | Slightly more overhead |
| **Code Length** | More concise | More verbose |
| **Learning Curve** | Easier for beginners | Requires OOP knowledge |

### **State Management Comparison:**

### **Functional Component State:**
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### **Class Component State:**
```javascript
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      name: ''
    };
  }

  increment = () => {
    this.setState(prevState => ({
      count: prevState.count + 1
    }));
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
          placeholder="Name"
        />
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

### **Lifecycle Methods vs useEffect:**

### **Class Component Lifecycle:**
```javascript
class DataComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  // Mounting
  componentDidMount() {
    this.fetchData();
  }

  // Updating
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
  }

  // Unmounting
  componentWillUnmount() {
    // Cleanup
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  fetchData = async () => {
    const response = await fetch(`/api/data/${this.props.id}`);
    const data = await response.json();
    this.setState({ data });
  }

  render() {
    return <div>{this.state.data?.title}</div>;
  }
}
```

### **Functional Component with useEffect:**
```javascript
function DataComponent({ id }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/data/${id}`);
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, [id]); // Re-run when id changes

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <div>{data?.title}</div>;
}
```

### **Event Handling:**

### **Functional Components:**
```javascript
function Button() {
  const handleClick = (e) => {
    console.log('Button clicked', e);
  };

  // Or inline
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <button onClick={(e) => console.log('Inline click', e)}>
        Inline Handler
      </button>
    </div>
  );
}
```

### **Class Components:**
```javascript
class Button extends Component {
  // Method binding required
  handleClick = (e) => {
    console.log('Button clicked', e);
  }

  // Alternative binding in constructor
  constructor(props) {
    super(props);
    this.handleClickAlternative = this.handleClickAlternative.bind(this);
  }

  handleClickAlternative(e) {
    console.log('Alternative click', e);
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Click me</button>
        <button onClick={this.handleClickAlternative}>
          Alternative
        </button>
      </div>
    );
  }
}
```

---

## Q46. What is the difference between Props and State?

### **Answer:**
**Props** and **State** are both used to manage data in React components, but they serve different purposes and have different characteristics.

### **Props (Properties):**

### **Definition:**
Props are **read-only** data passed from a parent component to a child component.

```javascript
// Parent component passing props
function App() {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    isActive: true
  };

  return (
    <div>
      <UserCard
        name={user.name}
        email={user.email}
        isActive={user.isActive}
        onEdit={() => console.log('Edit user')}
      />
    </div>
  );
}

// Child component receiving props
function UserCard({ name, email, isActive, onEdit }) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      <span className={`status ${isActive ? 'active' : 'inactive'}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}
```

### **State:**

### **Definition:**
State is **mutable** data that belongs to a component and can change over time.

```javascript
function UserProfile() {
  // State belongs to this component
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    isEditing: false
  });

  const [loading, setLoading] = useState(false);

  const toggleEdit = () => {
    setUser(prevUser => ({
      ...prevUser,
      isEditing: !prevUser.isEditing
    }));
  };

  const saveUser = async () => {
    setLoading(true);
    // Save user logic
    setLoading(false);
    setUser(prevUser => ({ ...prevUser, isEditing: false }));
  };

  return (
    <div>
      {user.isEditing ? (
        <EditForm user={user} onSave={saveUser} />
      ) : (
        <DisplayUser user={user} onEdit={toggleEdit} />
      )}
      {loading && <div>Saving...</div>}
    </div>
  );
}
```

### **Key Differences:**

| **Aspect** | **Props** | **State** |
|------------|-----------|-----------|
| **Mutability** | Immutable (read-only) | Mutable (can be changed) |
| **Ownership** | Passed from parent | Owned by component |
| **Purpose** | Data flow between components | Component's internal data |
| **Updates** | Updated by parent | Updated by component itself |
| **Scope** | External data | Internal data |
| **Triggers Re-render** | When parent re-renders | When state changes |

### **Detailed Comparison:**

### **1. Data Flow:**

### **Props - Unidirectional Data Flow:**
```javascript
// Grandparent
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <Layout theme={theme} onThemeChange={setTheme}>
      <Dashboard theme={theme} />
    </Layout>
  );
}

// Parent
function Layout({ theme, onThemeChange, children }) {
  return (
    <div className={`layout ${theme}`}>
      <Header theme={theme} onThemeChange={onThemeChange} />
      <main>{children}</main>
    </div>
  );
}

// Child
function Header({ theme, onThemeChange }) {
  return (
    <header>
      <h1>My App</h1>
      <button onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
    </header>
  );
}
```

### **State - Component Internal Management:**
```javascript
function ShoppingCart() {
  // Internal state - not passed from parent
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product) => {
    setItems(prevItems => [...prevItems, product]);
    setTotal(prevTotal => prevTotal + product.price);
  };

  const removeItem = (productId) => {
    const item = items.find(item => item.id === productId);
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
    setTotal(prevTotal => prevTotal - item.price);
  };

  return (
    <div className="shopping-cart">
      <button onClick={() => setIsOpen(!isOpen)}>
        Cart ({items.length}) - ${total}
      </button>
      {isOpen && (
        <div className="cart-items">
          {items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={removeItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### **2. Immutability:**

### **Props are Immutable:**
```javascript
function ProductCard({ product, onAddToCart }) {
  // ❌ Cannot modify props
  // product.price = 99.99; // This would be an error

  // ✅ Can use props to derive values
  const discountedPrice = product.price * 0.9;

  return (
    <div>
      <h3>{product.name}</h3>
      <p>Original: ${product.price}</p>
      <p>Sale: ${discountedPrice}</p>
      <button onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}
```

### **State is Mutable (through setState):**
```javascript
function ProductForm() {
  const [product, setProduct] = useState({
    name: '',
    price: 0,
    category: ''
  });

  // ✅ Can update state
  const updateProduct = (field, value) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      [field]: value
    }));
  };

  return (
    <form>
      <input
        value={product.name}
        onChange={(e) => updateProduct('name', e.target.value)}
        placeholder="Product name"
      />
      <input
        type="number"
        value={product.price}
        onChange={(e) => updateProduct('price', parseFloat(e.target.value))}
        placeholder="Price"
      />
    </form>
  );
}
```

### **3. When to Use Props vs State:**

### **Use Props When:**
- Data comes from parent component
- Data doesn't change within the component
- Component needs to communicate with parent
- Sharing data between sibling components

```javascript
// Props example: Configuration and callbacks
function Modal({ isOpen, title, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### **Use State When:**
- Data changes over time
- Data is specific to the component
- User interactions modify the data
- Component needs to track its own status

```javascript
// State example: Form data and UI state
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitForm(formData);
      setIsSubmitted(true);
    } catch (error) {
      setErrors({ submit: 'Failed to submit form' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <div>Thank you for your message!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### **4. Props and State Together:**

```javascript
function UserList({ users, onUserSelect }) { // Props
  const [searchTerm, setSearchTerm] = useState(''); // State
  const [sortBy, setSortBy] = useState('name'); // State
  const [selectedUser, setSelectedUser] = useState(null); // State

  // Derived data from props and state
  const filteredUsers = users
    .filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

  const handleUserClick = (user) => {
    setSelectedUser(user); // Update internal state
    onUserSelect(user); // Notify parent via props
  };

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="email">Email</option>
      </select>

      <ul>
        {filteredUsers.map(user => (
          <li
            key={user.id}
            onClick={() => handleUserClick(user)}
            className={selectedUser?.id === user.id ? 'selected' : ''}
          >
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### **Best Practices:**

1. **Keep state minimal** - Only store what changes
2. **Lift state up** - Move state to common parent when needed by multiple children
3. **Use props for configuration** - Pass settings and callbacks as props
4. **Avoid prop drilling** - Use Context API for deeply nested props
5. **Derive data** - Calculate values from props/state rather than storing them

---

## Q47. What is the difference between Controlled and Uncontrolled Components?

### **Answer:**
**Controlled** and **Uncontrolled** components refer to how form inputs manage their state in React.

### **Controlled Components:**

### **Definition:**
In controlled components, React controls the form input's value through state. The input value is always driven by React state.

```javascript
function ControlledForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name} // Controlled by React state
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={formData.email} // Controlled by React state
        onChange={handleChange}
        placeholder="Email"
      />
      <textarea
        name="message"
        value={formData.message} // Controlled by React state
        onChange={handleChange}
        placeholder="Message"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### **Uncontrolled Components:**

### **Definition:**
In uncontrolled components, the DOM itself maintains the form input's state. React uses refs to access the current values.

```javascript
import { useRef } from 'react';

function UncontrolledForm() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      message: messageRef.current.value
    };

    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        ref={nameRef}
        defaultValue="" // Use defaultValue, not value
        placeholder="Name"
      />
      <input
        type="email"
        ref={emailRef}
        defaultValue=""
        placeholder="Email"
      />
      <textarea
        ref={messageRef}
        defaultValue=""
        placeholder="Message"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### **Key Differences:**

| **Aspect** | **Controlled** | **Uncontrolled** |
|------------|----------------|-------------------|
| **State Management** | React state | DOM state |
| **Value Access** | Through state | Through refs |
| **Initial Value** | `value` prop | `defaultValue` prop |
| **Updates** | `onChange` handler | Direct DOM manipulation |
| **Validation** | Real-time | On submit/blur |
| **Performance** | Re-renders on change | No re-renders |

### **Advanced Examples:**

### **1. Controlled Component with Validation:**
```javascript
function ControlledFormWithValidation() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        return value.length < 3 ? 'Username must be at least 3 characters' : '';
      case 'password':
        return value.length < 6 ? 'Password must be at least 6 characters' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate field
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
    } else {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {}));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Username"
          className={errors.username ? 'error' : ''}
        />
        {errors.username && <span className="error-text">{errors.username}</span>}
      </div>

      <div className="form-field">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      <div className="form-field">
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirm Password"
          className={errors.confirmPassword ? 'error' : ''}
        />
        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
      </div>

      <button type="submit">Register</button>
    </form>
  );
}
```

### **2. Uncontrolled Component with File Upload:**
```javascript
function UncontrolledFileUpload() {
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const file = fileInputRef.current.files[0];

    if (file) {
      console.log('File selected:', file.name);
      console.log('File size:', file.size);
      console.log('File type:', file.type);

      // Process file upload
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('File uploaded successfully');
        // Reset form
        formRef.current.reset();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input
        type="file"
        ref={fileInputRef}
        accept=".jpg,.jpeg,.png,.pdf"
        required
      />
      <input
        type="text"
        name="description"
        placeholder="File description"
        defaultValue=""
      />
      <button type="submit">Upload File</button>
    </form>
  );
}
```

### **3. Mixed Approach (Hybrid):**
```javascript
function HybridForm() {
  // Controlled for fields that need validation/formatting
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Uncontrolled for simple fields
  const nameRef = useRef(null);
  const phoneRef = useRef(null);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : 'Invalid email format';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name: nameRef.current.value,
      email: email,
      phone: phoneRef.current.value
    };

    if (!emailError && email) {
      console.log('Form submitted:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        ref={nameRef}
        placeholder="Name"
        defaultValue=""
      />

      <div className="form-field">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          className={emailError ? 'error' : ''}
        />
        {emailError && <span className="error-text">{emailError}</span>}
      </div>

      <input
        type="tel"
        ref={phoneRef}
        placeholder="Phone"
        defaultValue=""
      />

      <button type="submit" disabled={!!emailError}>
        Submit
      </button>
    </form>
  );
}
```

### **When to Use Each:**

### **Use Controlled Components When:**
- Real-time validation is needed
- Input formatting is required
- Conditional rendering based on input values
- Multiple components need to share form state
- Complex form logic is involved

```javascript
// Example: Real-time search with formatting
function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setQuery(value);
    onSearch(value); // Real-time search
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search..."
    />
  );
}
```

### **Use Uncontrolled Components When:**
- Simple forms with minimal logic
- Performance is critical (no re-renders)
- Integrating with non-React libraries
- File uploads
- One-time data collection

```javascript
// Example: Simple contact form
function SimpleContactForm() {
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    // Submit data
    submitContactForm(Object.fromEntries(formData));

    // Reset form
    formRef.current.reset();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />
      <button type="submit">Send Message</button>
    </form>
  );
}
```

### **Performance Considerations:**

### **Controlled Components:**
- Re-render on every keystroke
- Better for complex interactions
- More memory usage for state

### **Uncontrolled Components:**
- No re-renders during typing
- Better for simple forms
- Less memory usage
- Harder to test and debug

---

## Q48. What is React Router and how does it work?

### **Answer:**
**React Router** is a declarative routing library for React applications that enables navigation between different components/pages without full page refreshes, creating Single Page Applications (SPAs).

### **Installation:**
```bash
npm install react-router-dom
```

### **Basic Setup:**

### **1. App.js - Router Configuration:**
```javascript
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';

// Components
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation */}
        <nav className="navbar">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* Route Definitions */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/old-home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
```

### **2. Component Examples:**

### **Home Component:**
```javascript
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Our Store</h1>
      <p>Discover amazing products at great prices!</p>
      <Link to="/products" className="cta-button">
        Shop Now
      </Link>
    </div>
  );
}

export default Home;
```

### **Products Component with Navigation:**
```javascript
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Get query parameters
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category') || 'all';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?category=${category}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleCategoryChange = (newCategory) => {
    navigate(`/products?category=${newCategory}`);
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="products">
      <h1>Our Products</h1>

      {/* Category Filter */}
      <div className="category-filter">
        <button
          onClick={() => handleCategoryChange('all')}
          className={category === 'all' ? 'active' : ''}
        >
          All
        </button>
        <button
          onClick={() => handleCategoryChange('electronics')}
          className={category === 'electronics' ? 'active' : ''}
        >
          Electronics
        </button>
        <button
          onClick={() => handleCategoryChange('clothing')}
          className={category === 'clothing' ? 'active' : ''}
        >
          Clothing
        </button>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <Link
              to={`/products/${product.id}`}
              className="view-details-btn"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
```

### **Product Detail with URL Parameters:**
```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams(); // Get URL parameter
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Add to cart logic
    console.log(`Added product ${id} to cart`);

    // Navigate to cart
    navigate('/cart');
  };

  const goBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-detail">
      <button onClick={goBack} className="back-button">
        ← Back
      </button>

      <div className="product-info">
        <img src={product.image} alt={product.name} />
        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>

          <div className="product-actions">
            <button onClick={handleAddToCart} className="add-to-cart-btn">
              Add to Cart
            </button>
            <button onClick={() => navigate('/products')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
```

### **Advanced Routing Patterns:**

### **1. Nested Routes:**
```javascript
import { Outlet } from 'react-router-dom';

// Parent component with nested routes
function Dashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Link to="/dashboard/overview">Overview</Link>
        <Link to="/dashboard/analytics">Analytics</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </aside>

      <main className="dashboard-content">
        <Outlet /> {/* Renders child routes */}
      </main>
    </div>
  );
}

// App.js route configuration
<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<DashboardOverview />} />
    <Route path="overview" element={<DashboardOverview />} />
    <Route path="analytics" element={<DashboardAnalytics />} />
    <Route path="settings" element={<DashboardSettings />} />
  </Route>
</Routes>
```

### **2. Protected Routes:**
```javascript
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth(); // Custom hook
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage in App.js
<Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin/*"
    element={
      <ProtectedRoute>
        <AdminRoutes />
      </ProtectedRoute>
    }
  />
</Routes>
```

### **3. Custom Hooks for Routing:**
```javascript
// Custom hook for navigation with confirmation
function useNavigateWithConfirmation() {
  const navigate = useNavigate();

  const navigateWithConfirmation = (to, message = 'Are you sure you want to leave?') => {
    if (window.confirm(message)) {
      navigate(to);
    }
  };

  return navigateWithConfirmation;
}

// Custom hook for query parameters
function useQueryParams() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const setQueryParam = (key, value) => {
    queryParams.set(key, value);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  const getQueryParam = (key) => {
    return queryParams.get(key);
  };

  const removeQueryParam = (key) => {
    queryParams.delete(key);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  return { getQueryParam, setQueryParam, removeQueryParam };
}

// Usage
function SearchPage() {
  const { getQueryParam, setQueryParam } = useQueryParams();
  const [searchTerm, setSearchTerm] = useState(getQueryParam('q') || '');

  const handleSearch = (term) => {
    setSearchTerm(term);
    setQueryParam('q', term);
  };

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
}
```

### **Key React Router Concepts:**

### **1. Router Types:**
- **BrowserRouter**: Uses HTML5 history API (recommended for web apps)
- **HashRouter**: Uses URL hash (for static file servers)
- **MemoryRouter**: Keeps history in memory (for testing)

### **2. Navigation Components:**
- **Link**: Declarative navigation
- **NavLink**: Link with active state styling
- **Navigate**: Programmatic navigation component

### **3. Hooks:**
- **useNavigate**: Programmatic navigation
- **useLocation**: Current location object
- **useParams**: URL parameters
- **useSearchParams**: Query string parameters

### **4. Route Matching:**
- **Exact matching**: Routes match exactly
- **Dynamic segments**: `:id` for parameters
- **Wildcard**: `*` for catch-all routes
- **Optional segments**: `path?` for optional parts

React Router enables building complex, navigable React applications with clean URLs and proper browser history management.

---

## Q49. What is Context API in React and how does it work?

### **Answer:**
**Context API** is a React feature that allows you to share data across the component tree without passing props down manually at every level, solving the "prop drilling" problem.

### **Problem: Prop Drilling**
```javascript
// Without Context - Prop drilling example
function App() {
  const [user, setUser] = useState({ name: 'John', theme: 'dark' });

  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  return (
    <div>
      <Header user={user} setUser={setUser} />
      <Main user={user} />
    </div>
  );
}

function Header({ user, setUser }) {
  return (
    <header>
      <Navigation user={user} />
      <UserMenu user={user} setUser={setUser} />
    </header>
  );
}

function UserMenu({ user, setUser }) {
  return (
    <div>
      <span>Welcome, {user.name}</span>
      <button onClick={() => setUser({...user, theme: user.theme === 'dark' ? 'light' : 'dark'})}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### **Solution: Context API**

### **1. Creating Context:**
```javascript
import React, { createContext, useContext, useState } from 'react';

// Create Context
const UserContext = createContext();

// Create a custom hook for easier usage
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider Component
export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    theme: 'light',
    preferences: {
      notifications: true,
      language: 'en'
    }
  });

  const updateUser = (updates) => {
    setUser(prevUser => ({ ...prevUser, ...updates }));
  };

  const updatePreferences = (newPreferences) => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: { ...prevUser.preferences, ...newPreferences }
    }));
  };

  const toggleTheme = () => {
    setUser(prevUser => ({
      ...prevUser,
      theme: prevUser.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const value = {
    user,
    updateUser,
    updatePreferences,
    toggleTheme
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
```

### **2. Using Context in Components:**
```javascript
// App.js - Wrap with Provider
function App() {
  return (
    <UserProvider>
      <div className="app">
        <Layout />
      </div>
    </UserProvider>
  );
}

// Layout.js - No need to pass props
function Layout() {
  const { user } = useUser();

  return (
    <div className={`layout theme-${user.theme}`}>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

// Header.js - Direct access to context
function Header() {
  const { user, toggleTheme } = useUser();

  return (
    <header className="header">
      <h1>My App</h1>
      <div className="user-controls">
        <span>Welcome, {user.name}</span>
        <button onClick={toggleTheme}>
          Switch to {user.theme === 'light' ? 'dark' : 'light'} theme
        </button>
      </div>
    </header>
  );
}

// UserProfile.js - Access and update user data
function UserProfile() {
  const { user, updateUser, updatePreferences } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    updateUser({
      name: formData.name,
      email: formData.email
    });
    updatePreferences(formData.preferences);
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      {isEditing ? (
        <div className="edit-form">
          <input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Name"
          />
          <input
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Email"
          />
          <label>
            <input
              type="checkbox"
              checked={formData.preferences.notifications}
              onChange={(e) => setFormData({
                ...formData,
                preferences: {
                  ...formData.preferences,
                  notifications: e.target.checked
                }
              })}
            />
            Enable Notifications
          </label>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="profile-display">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>Theme: {user.theme}</p>
          <p>Notifications: {user.preferences.notifications ? 'On' : 'Off'}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}
```

### **3. Multiple Contexts:**
```javascript
// Theme Context
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [colors, setColors] = useState({
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff'
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setColors(newTheme === 'dark' ? darkColors : lightColors);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Shopping Cart Context
const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const addItem = (product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Calculate total whenever items change
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      total,
      addItem,
      removeItem,
      updateQuantity,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
}

// App with multiple providers
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <CartProvider>
          <Router>
            <div className="app">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
```

### **4. Advanced Context Patterns:**

### **Context with Reducer:**
```javascript
import { useReducer, createContext, useContext } from 'react';

// Actions
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_DATA: 'SET_DATA',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  DELETE_ITEM: 'DELETE_ITEM'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_DATA:
      return { ...state, data: action.payload, loading: false, error: null };
    case ACTIONS.ADD_ITEM:
      return {
        ...state,
        data: [...state.data, action.payload]
      };
    case ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        data: state.data.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case ACTIONS.DELETE_ITEM:
      return {
        ...state,
        data: state.data.filter(item => item.id !== action.payload)
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    data: [],
    loading: false,
    error: null
  });

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    setData: (data) => dispatch({ type: ACTIONS.SET_DATA, payload: data }),
    addItem: (item) => dispatch({ type: ACTIONS.ADD_ITEM, payload: item }),
    updateItem: (item) => dispatch({ type: ACTIONS.UPDATE_ITEM, payload: item }),
    deleteItem: (id) => dispatch({ type: ACTIONS.DELETE_ITEM, payload: id })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

### **5. Performance Optimization:**
```javascript
// Split contexts to prevent unnecessary re-renders
const UserDataContext = createContext();
const UserActionsContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(initialUser);

  // Memoize actions to prevent re-creation
  const actions = useMemo(() => ({
    updateUser: (updates) => setUser(prev => ({ ...prev, ...updates })),
    resetUser: () => setUser(initialUser),
    toggleTheme: () => setUser(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }))
  }), []);

  return (
    <UserDataContext.Provider value={user}>
      <UserActionsContext.Provider value={actions}>
        {children}
      </UserActionsContext.Provider>
    </UserDataContext.Provider>
  );
}

// Separate hooks for data and actions
export const useUserData = () => useContext(UserDataContext);
export const useUserActions = () => useContext(UserActionsContext);

// Component that only needs actions won't re-render when user data changes
function ThemeToggle() {
  const { toggleTheme } = useUserActions(); // No re-render on user data change

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

### **Best Practices:**

1. **Don't overuse Context** - Use for truly global state
2. **Split contexts** - Separate data and actions for performance
3. **Provide default values** - Always provide meaningful defaults
4. **Use custom hooks** - Encapsulate context logic
5. **Error boundaries** - Handle context errors gracefully
6. **Memoize values** - Prevent unnecessary re-renders

### **When to Use Context API:**
- **Global app state** (user authentication, theme, language)
- **Avoiding prop drilling** (deeply nested components)
- **Shared state** between distant components
- **Configuration data** that many components need

### **When NOT to Use Context:**
- **Frequently changing data** (use state management libraries)
- **Performance-critical applications** (Context causes re-renders)
- **Simple prop passing** (1-2 levels deep)
- **Local component state** (use useState instead)

---

## Q50. What are the best practices for React development?

### **Answer:**
React best practices help create maintainable, performant, and scalable applications. Here are the essential guidelines:

### **1. Component Design Principles:**

### **Single Responsibility Principle:**
```javascript
// ❌ Bad: Component doing too many things
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState('light');

  // Lots of logic for different concerns...

  return (
    <div>
      {/* Complex JSX mixing different concerns */}
    </div>
  );
}

// ✅ Good: Split into focused components
function UserDashboard({ userId }) {
  return (
    <div className="dashboard">
      <UserProfile userId={userId} />
      <UserPosts userId={userId} />
      <NotificationPanel userId={userId} />
    </div>
  );
}

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  // Focus only on user profile logic
  return <div className="user-profile">{/* User profile JSX */}</div>;
}
```

### **Keep Components Small and Focused:**
```javascript
// ✅ Good: Small, focused components
function Button({ variant = 'primary', size = 'medium', children, ...props }) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <ModalHeader title={title} onClose={onClose} />
        <ModalBody>{children}</ModalBody>
      </div>
    </div>
  );
}
```

### **2. State Management Best Practices:**

### **Keep State Minimal:**
```javascript
// ❌ Bad: Storing derived data in state
function UserList({ users }) {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setUserCount(filtered.length);
  }, [users, searchTerm]);

  // ...
}

// ✅ Good: Derive data, don't store it
function UserList({ users }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() =>
    users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [users, searchTerm]
  );

  return (
    <div>
      <p>Found {filteredUsers.length} users</p>
      {/* Render filtered users */}
    </div>
  );
}
```

### **Lift State Up When Needed:**
```javascript
// ✅ Good: Shared state in common parent
function ShoppingApp() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <div>
      <ProductList onAddToCart={addToCart} />
      <Cart items={cartItems} onRemoveFromCart={removeFromCart} />
    </div>
  );
}
```

### **3. Performance Optimization:**

### **Use React.memo for Pure Components:**
```javascript
// ✅ Good: Memoize expensive components
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveCalculation(item));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.result}</div>
      ))}
    </div>
  );
});

// Only re-render if props actually change
const UserCard = React.memo(({ user, onEdit }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
});
```

### **Optimize Callbacks with useCallback:**
```javascript
function TodoApp() {
  const [todos, setTodos] = useState([]);

  // ✅ Good: Memoize callbacks
  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }]);
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todos={todos}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
      />
    </div>
  );
}
```

### **4. Code Organization:**

### **Consistent File Structure:**
```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.test.js
│   │   │   ├── Button.module.css
│   │   │   └── index.js
│   │   └── Modal/
│   └── features/
│       ├── auth/
│       │   ├── LoginForm.jsx
│       │   └── SignupForm.jsx
│       └── products/
├── hooks/
│   ├── useApi.js
│   ├── useLocalStorage.js
│   └── useAuth.js
├── services/
│   ├── api.js
│   └── auth.js
├── utils/
│   ├── helpers.js
│   └── constants.js
└── contexts/
    ├── AuthContext.js
    └── ThemeContext.js
```

### **Custom Hooks for Reusable Logic:**
```javascript
// ✅ Good: Extract reusable logic into custom hooks
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

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
```

### **5. Error Handling:**

### **Error Boundaries:**
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
```

### **6. Testing Best Practices:**

### **Write Testable Components:**
```javascript
// ✅ Good: Testable component
function UserProfile({ user, onEdit, onDelete }) {
  return (
    <div data-testid="user-profile">
      <h2 data-testid="user-name">{user.name}</h2>
      <p data-testid="user-email">{user.email}</p>
      <button
        data-testid="edit-button"
        onClick={() => onEdit(user.id)}
      >
        Edit
      </button>
      <button
        data-testid="delete-button"
        onClick={() => onDelete(user.id)}
      >
        Delete
      </button>
    </div>
  );
}

// Test
import { render, screen, fireEvent } from '@testing-library/react';

test('calls onEdit when edit button is clicked', () => {
  const mockOnEdit = jest.fn();
  const user = { id: 1, name: 'John', email: 'john@example.com' };

  render(<UserProfile user={user} onEdit={mockOnEdit} onDelete={jest.fn()} />);

  fireEvent.click(screen.getByTestId('edit-button'));
  expect(mockOnEdit).toHaveBeenCalledWith(1);
});
```

### **7. Accessibility (a11y):**

```javascript
// ✅ Good: Accessible components
function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={modalRef}
        className="modal"
        tabIndex={-1}
      >
        <h2 id="modal-title">{title}</h2>
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="close-button"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
```

### **8. Security Best Practices:**

```javascript
// ✅ Good: Sanitize user input
import DOMPurify from 'dompurify';

function UserComment({ comment }) {
  const sanitizedHTML = DOMPurify.sanitize(comment.html);

  return (
    <div
      className="comment"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}

// ✅ Good: Validate props
import PropTypes from 'prop-types';

UserProfile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
```

### **Summary of Key Best Practices:**

1. **Component Design**: Keep components small, focused, and reusable
2. **State Management**: Minimize state, lift when needed, use proper tools
3. **Performance**: Memoize expensive operations, optimize re-renders
4. **Code Organization**: Consistent structure, custom hooks, separation of concerns
5. **Error Handling**: Use error boundaries, handle async errors gracefully
6. **Testing**: Write testable code, use proper testing utilities
7. **Accessibility**: Follow a11y guidelines, use semantic HTML
8. **Security**: Sanitize inputs, validate props, avoid XSS vulnerabilities
9. **Documentation**: Comment complex logic, use TypeScript for better DX
10. **Tooling**: Use ESLint, Prettier, and proper development tools

Following these practices leads to more maintainable, performant, and reliable React applications.
