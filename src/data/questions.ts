export const questions = [
  {
    id: 31,
    title: 'Q31. What is Babel?',
    content: 'Babel is a JavaScript transpiler that converts modern JavaScript (ES6+) and JSX syntax into backward-compatible JavaScript that can run in older browsers.',
    sections: [
      {
        heading: 'Role in React',
        content: 'Babel is essential for React development because browsers do not understand JSX natively. It transforms JSX into React.createElement() calls.',
        code: `// JSX Input (What you write)
const element = (
  <div className="container">
    <h1>Hello, {name}!</h1>
    <button onClick={handleClick}>
      Click me
    </button>
  </div>
);

// JavaScript Output (What Babel produces)
const element = React.createElement(
  'div',
  { className: 'container' },
  React.createElement('h1', null, 'Hello, ', name, '!'),
  React.createElement(
    'button',
    { onClick: handleClick },
    'Click me'
  )
);`,
        codeLanguage: 'javascript'
      },
      {
        heading: '.babelrc Configuration',
        content: 'Configure Babel with presets and plugins to handle JSX and modern JavaScript features.',
        code: `{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime"
  ]
}`,
        codeLanguage: 'json'
      },
      {
        heading: 'Key Babel Presets',
        content: '@babel/preset-react transforms JSX syntax. @babel/preset-env transforms modern JavaScript to ES5 compatible code.',
        code: `// @babel/preset-react
const Button = () => <button>Click me</button>;
// Transforms to:
const Button = () => React.createElement('button', null, 'Click me');

// @babel/preset-env
const users = data.map(user => ({ ...user, active: true }));
// Transforms to:
var users = data.map(function(user) {
  return Object.assign({}, user, { active: true });
});`,
        codeLanguage: 'javascript'
      }
    ]
  },
  {
    id: 32,
    title: 'Q32. What is the role of Fragment in JSX?',
    content: 'React Fragment allows you to group multiple children elements without adding an extra DOM node to the rendered output.',
    sections: [
      {
        heading: 'Problem Without Fragment',
        content: 'Without Fragment, you must wrap elements in a container div, which creates unnecessary DOM nodes and can break CSS layouts.',
        code: `// Problem: Must wrap in a container div
function UserInfo() {
  return (
    <div> {/* Extra wrapper div */}
      <h2>John Doe</h2>
      <p>Software Developer</p>
      <p>john@example.com</p>
    </div>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Solution with React.Fragment',
        content: 'Use React.Fragment to group elements without creating an extra DOM node.',
        code: `import React from 'react';

function UserInfo() {
  return (
    <React.Fragment>
      <h2>John Doe</h2>
      <p>Software Developer</p>
      <p>john@example.com</p>
    </React.Fragment>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Short Syntax (<>)',
        content: 'You can use the short syntax <> and </> instead of React.Fragment for cleaner code.',
        code: `function UserInfo() {
  return (
    <>
      <h2>John Doe</h2>
      <p>Software Developer</p>
      <p>john@example.com</p>
    </>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Fragment with Key',
        content: 'When rendering lists, use React.Fragment with key prop for proper reconciliation.',
        code: `function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <React.Fragment key={item.id}>
          <li>{item.name}</li>
          <li>{item.description}</li>
        </React.Fragment>
      ))}
    </ul>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Common Use Cases',
        content: 'Fragments are useful for table rows, conditional rendering, form fields, and list items.',
        code: `// Table Rows
function TableRow({ user }) {
  return (
    <>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
    </>
  );
}

// Conditional Rendering
function UserProfile({ user, showDetails }) {
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      {showDetails && (
        <>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </>
      )}
    </div>
  );
}`,
        codeLanguage: 'javascript'
      }
    ]
  },
  {
    id: 33,
    title: 'Q33. What is Spread Operator in JSX?',
    content: 'The Spread Operator (...) in JSX is used to expand or spread arrays, objects, and props, making code more concise and flexible.',
    sections: [
      {
        heading: 'Spreading Props',
        content: 'Pass all properties of an object as individual props to a component.',
        code: `function Button(props) {
  return <button {...props} />;
}

// Usage
const buttonProps = {
  className: 'btn btn-primary',
  onClick: handleClick,
  disabled: false,
  'data-testid': 'submit-button'
};

<Button {...buttonProps}>Submit</Button>`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Selective Props Spreading',
        content: 'Extract specific props and spread the rest to child elements.',
        code: `function CustomInput({ label, error, ...inputProps }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input 
        {...inputProps}
        className={\`input \${error ? 'error' : ''}\`}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Spreading Objects in State',
        content: 'Use spread operator to create new state objects without mutating the original.',
        code: `function UserProfile() {
  const [user, setUser] = useState({
    name: 'John',
    email: 'john@example.com',
    preferences: { theme: 'light' }
  });
  
  const updateUserName = (newName) => {
    setUser({
      ...user,
      name: newName
    });
  };
  
  const updatePreferences = (newPrefs) => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        ...newPrefs
      }
    });
  };
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Conditional Props Spreading',
        content: 'Conditionally spread props based on certain conditions.',
        code: `function Modal({ isOpen, showCloseButton, onClose, children, ...props }) {
  const modalProps = {
    ...props,
    className: \`modal \${isOpen ? 'open' : 'closed'}\`,
    ...(isOpen && { 'aria-hidden': 'false' }),
    ...(showCloseButton && { 'data-closable': 'true' })
  };
  
  return (
    <div {...modalProps}>
      {showCloseButton && (
        <button onClick={onClose} className="close-btn">×</button>
      )}
      {children}
    </div>
  );
}`,
        codeLanguage: 'javascript'
      }
    ]
  },
  {
    id: 34,
    title: 'Q34. What are the types of Conditional Rendering in JSX?',
    content: 'Conditional Rendering in React allows you to render different content based on certain conditions. There are several patterns to achieve this.',
    sections: [
      {
        heading: 'If/Else Statements',
        content: 'Use traditional if/else statements outside JSX for conditional logic.',
        code: `function UserGreeting({ user, isLoggedIn }) {
  if (isLoggedIn && user) {
    return (
      <div className="welcome">
        <h2>Welcome back, {user.name}!</h2>
        <p>You have {user.notifications} new notifications</p>
      </div>
    );
  } else {
    return (
      <div className="login-prompt">
        <h2>Please log in</h2>
        <button>Login</button>
      </div>
    );
  }
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Early Return Pattern',
        content: 'Return early for loading, error, or edge case states before rendering main content.',
        code: `function ProductCard({ product }) {
  if (!product) {
    return <div className="loading">Loading product...</div>;
  }

  if (product.error) {
    return <div className="error">Error loading product</div>;
  }

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>\${product.price}</p>
    </div>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Ternary Operator',
        content: 'Use ternary operator for simple conditional rendering inside JSX.',
        code: `function StatusBadge({ isActive }) {
  return (
    <span className={\`badge \${isActive ? 'active' : 'inactive'}\`}>
      {isActive ? 'Online' : 'Offline'}
    </span>
  );
}

// Nested Ternary (use sparingly)
function UserRole({ user }) {
  return (
    <div className="user-role">
      {user.isAdmin
        ? <span className="admin">Administrator</span>
        : user.isModerator
          ? <span className="moderator">Moderator</span>
          : <span className="user">User</span>
      }
    </div>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Logical AND (&&) Operator',
        content: 'Use && operator to render component only if condition is true.',
        code: `function Notification({ message, show }) {
  return (
    <div>
      {show && (
        <div className="notification">
          {message}
        </div>
      )}
    </div>
  );
}

// Multiple Conditions
function UserProfile({ user, isOwner, showPrivateInfo }) {
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      {isOwner && (
        <button className="edit-btn">Edit Profile</button>
      )}
      {isOwner && showPrivateInfo && (
        <div className="private-info">
          <p>Phone: {user.phone}</p>
        </div>
      )}
    </div>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Switch Statement',
        content: 'Use switch statement for multiple conditional branches.',
        code: `function StatusIcon({ status }) {
  const renderIcon = () => {
    switch (status) {
      case 'success':
        return <CheckIcon className="text-green" />;
      case 'error':
        return <ErrorIcon className="text-red" />;
      case 'warning':
        return <WarningIcon className="text-yellow" />;
      case 'loading':
        return <SpinnerIcon className="animate-spin" />;
      default:
        return <InfoIcon className="text-blue" />;
    }
  };

  return (
    <div className="status-icon">
      {renderIcon()}
    </div>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Best Practices',
        content: 'Keep conditions simple, use meaningful component names, and avoid deeply nested ternaries.',
        code: `// ✅ Good: Simple, readable condition
{user.isLoggedIn && <WelcomeMessage user={user} />}

// ❌ Avoid: Complex inline conditions
{user && user.profile && user.profile.settings && user.profile.settings.showWelcome && <WelcomeMessage />}

// ✅ Better: Extract to variable
const shouldShowWelcome = user?.profile?.settings?.showWelcome;
{shouldShowWelcome && <WelcomeMessage user={user} />}`,
        codeLanguage: 'javascript'
      }
    ]
  },
  {
    id: 35,
    title: 'Q35. What is React.memo and when to use it?',
    content: 'React.memo is a higher-order component that memoizes a component to prevent unnecessary re-renders when props haven\'t changed.',
    sections: [
      {
        heading: 'Basic Usage',
        content: 'Wrap a component with React.memo to skip re-rendering if props are the same.',
        code: `// Without React.memo - re-renders on every parent render
function UserCard({ user }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// With React.memo - only re-renders if props change
const MemoizedUserCard = React.memo(UserCard);`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Custom Comparison',
        content: 'Use custom comparison function for complex prop comparisons.',
        code: `const UserCard = React.memo(
  ({ user }) => (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  ),
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props are different (re-render)
    return prevProps.user.id === nextProps.user.id;
  }
);`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'When to Use',
        content: 'Use React.memo for expensive components that receive same props frequently.',
        code: `// ✅ Good: Expensive component with stable props
const ExpensiveChart = React.memo(({ data }) => {
  // Complex rendering logic
  return <div>{/* Chart rendering */}</div>;
});

// ❌ Avoid: Simple components or frequently changing props
const SimpleText = React.memo(({ text }) => <p>{text}</p>);`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Performance Considerations',
        content: 'React.memo adds comparison overhead. Use it only when re-renders are expensive.',
        code: `// ✅ Good: Memoize expensive list items
const ListItem = React.memo(({ item, onSelect }) => {
  return (
    <div onClick={() => onSelect(item.id)}>
      {item.name}
    </div>
  );
});

// ❌ Avoid: Memoizing simple components
const Badge = React.memo(({ label }) => <span>{label}</span>);`,
        codeLanguage: 'javascript'
      }
    ]
  },
  {
    id: 36,
    title: 'Q36. What is useCallback hook and why use it?',
    content: 'useCallback is a React hook that memoizes a function to maintain referential equality across renders.',
    sections: [
      {
        heading: 'Basic Usage',
        content: 'useCallback returns a memoized version of the callback function.',
        code: `function Parent() {
  const [count, setCount] = useState(0);

  // Without useCallback - new function on every render
  const handleClick = () => {
    console.log('Clicked');
  };

  // With useCallback - same function reference if deps don't change
  const memoizedClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return <Child onClick={memoizedClick} />;
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'With Dependencies',
        content: 'useCallback recreates function when dependencies change.',
        code: `function Parent({ userId }) {
  const [count, setCount] = useState(0);

  // Function recreates only when userId changes
  const fetchUser = useCallback(() => {
    fetch(\`/api/users/\${userId}\`);
  }, [userId]);

  return <Child onFetch={fetchUser} />;
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Preventing Unnecessary Re-renders',
        content: 'useCallback prevents child components from re-rendering due to function reference changes.',
        code: `const Child = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click me</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // Without useCallback - Child re-renders on every Parent render
  const handleClick = () => setCount(count + 1);

  // With useCallback - Child only re-renders if deps change
  const memoizedClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <Child onClick={memoizedClick} />
    </div>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Best Practices',
        content: 'Use useCallback for callbacks passed to memoized child components.',
        code: `// ✅ Good: Memoized callback for memoized child
const MemoChild = React.memo(({ onAction }) => (
  <button onClick={onAction}>Action</button>
));

function Parent() {
  const handleAction = useCallback(() => {
    // Action logic
  }, []);

  return <MemoChild onAction={handleAction} />;
}

// ❌ Avoid: useCallback for simple callbacks
const handleChange = useCallback((e) => {
  setName(e.target.value);
}, []);`,
        codeLanguage: 'javascript'
      }
    ]
  },
  {
    id: 37,
    title: 'Q37. What is useMemo hook and when to use it?',
    content: 'useMemo is a React hook that memoizes expensive computations to avoid recalculating on every render.',
    sections: [
      {
        heading: 'Basic Usage',
        content: 'useMemo returns a memoized value that only recalculates when dependencies change.',
        code: `function Component({ items }) {
  // Without useMemo - recalculates on every render
  const expensiveValue = items.reduce((sum, item) => sum + item.value, 0);

  // With useMemo - only recalculates when items change
  const memoizedValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);

  return <div>Total: {memoizedValue}</div>;
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Expensive Computations',
        content: 'Use useMemo for computationally expensive operations.',
        code: `function DataProcessor({ data }) {
  // Expensive computation
  const processedData = useMemo(() => {
    return data
      .filter(item => item.active)
      .map(item => ({
        ...item,
        computed: complexCalculation(item)
      }))
      .sort((a, b) => b.computed - a.computed);
  }, [data]);

  return <DataList items={processedData} />;
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Preventing Child Re-renders',
        content: 'useMemo can prevent unnecessary re-renders of memoized children.',
        code: `const MemoChild = React.memo(({ data }) => (
  <div>{data.map(item => <Item key={item.id} item={item} />)}</div>
));

function Parent({ items }) {
  // Without useMemo - new array on every render
  const filteredItems = items.filter(i => i.active);

  // With useMemo - same array reference if items don't change
  const memoizedItems = useMemo(() => {
    return items.filter(i => i.active);
  }, [items]);

  return <MemoChild data={memoizedItems} />;
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Best Practices',
        content: 'Use useMemo judiciously - measure performance before optimizing.',
        code: `// ✅ Good: Expensive computation
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// ❌ Avoid: Simple operations
const doubled = useMemo(() => count * 2, [count]);

// ❌ Avoid: Without dependencies
const value = useMemo(() => expensiveCalc(), []);`,
        codeLanguage: 'javascript'
      }
    ]
  },
  {
    id: 38,
    title: 'Q38. What is the difference between useEffect and useLayoutEffect?',
    content: 'useEffect runs after render, while useLayoutEffect runs synchronously after DOM mutations but before browser paint.',
    sections: [
      {
        heading: 'useEffect - Async',
        content: 'useEffect runs after the component renders and browser has painted.',
        code: `function Component() {
  useEffect(() => {
    // Runs AFTER render and paint
    console.log('useEffect - after paint');

    // Good for: API calls, subscriptions, analytics
    fetchData();

    return () => {
      // Cleanup
    };
  }, []);

  return <div>Content</div>;
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'useLayoutEffect - Sync',
        content: 'useLayoutEffect runs synchronously after DOM mutations but before paint.',
        code: `function Component() {
  useLayoutEffect(() => {
    // Runs AFTER DOM update but BEFORE paint
    console.log('useLayoutEffect - before paint');

    // Good for: DOM measurements, animations, style updates
    const element = document.getElementById('target');
    const height = element.offsetHeight;

    return () => {
      // Cleanup
    };
  }, []);

  return <div id="target">Content</div>;
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Timing Comparison',
        content: 'Understanding the execution order of effects.',
        code: `function Component() {
  console.log('1. Render');

  useLayoutEffect(() => {
    console.log('3. useLayoutEffect - before paint');
  }, []);

  useEffect(() => {
    console.log('4. useEffect - after paint');
  }, []);

  return <div>Content</div>;
}

// Output:
// 1. Render
// 2. Browser updates DOM
// 3. useLayoutEffect - before paint
// 4. Browser paints
// 5. useEffect - after paint`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'When to Use Each',
        content: 'Choose based on whether you need to measure or update DOM before paint.',
        code: `// ✅ useEffect: API calls, subscriptions
useEffect(() => {
  fetchUserData();
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);

// ✅ useLayoutEffect: DOM measurements, animations
useLayoutEffect(() => {
  const rect = element.getBoundingClientRect();
  setPosition(rect.top);
}, []);

// ⚠️ useLayoutEffect can cause performance issues
// Use only when necessary for visual correctness`,
        codeLanguage: 'javascript'
      }
    ]
  },
  {
    id: 39,
    title: 'Q39. What is Context API and when to use it?',
    content: 'Context API provides a way to pass data through component tree without prop drilling.',
    sections: [
      {
        heading: 'Creating Context',
        content: 'Create a context using React.createContext().',
        code: `import React, { createContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Create provider component
export function ThemeProvider({ children }) {
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

export default ThemeContext;`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Using Context',
        content: 'Consume context using useContext hook.',
        code: `import { useContext } from 'react';
import ThemeContext from './ThemeContext';

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header style={{
      background: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#000' : '#fff'
    }}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </header>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'App Setup',
        content: 'Wrap your app with the provider component.',
        code: `import { ThemeProvider } from './ThemeContext';
import Header from './Header';
import Content from './Content';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Header />
        <Content />
      </div>
    </ThemeProvider>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'When to Use',
        content: 'Use Context API for global state like theme, language, or user authentication.',
        code: `// ✅ Good: Global state
- Theme (light/dark)
- Language/Localization
- User authentication
- UI preferences

// ❌ Avoid: Frequently changing state
- Form inputs
- Real-time data
- Complex state logic

// For complex state, use Redux or Zustand`,
        codeLanguage: 'javascript'
      }
    ]
  },
  {
    id: 40,
    title: 'Q40. What is the difference between controlled and uncontrolled components?',
    content: 'Controlled components have their state managed by React, while uncontrolled components manage their own state.',
    sections: [
      {
        heading: 'Controlled Component',
        content: 'React state controls the component value.',
        code: `function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {value}</p>
    </div>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Uncontrolled Component',
        content: 'DOM manages the component value using refs.',
        code: `function UncontrolledInput() {
  const inputRef = useRef(null);

  const handleSubmit = () => {
    console.log('Input value:', inputRef.current.value);
  };

  return (
    <div>
      <input
        type="text"
        ref={inputRef}
        placeholder="Type something..."
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'Comparison',
        content: 'Key differences between controlled and uncontrolled components.',
        code: `// Controlled Component
- State in React
- onChange handler required
- Value always in sync with state
- Easier to validate
- More React-like

// Uncontrolled Component
- State in DOM
- Use refs to access value
- Value only read when needed
- Less code for simple cases
- Like traditional HTML forms`,
        codeLanguage: 'javascript'
      },
      {
        heading: 'When to Use Each',
        content: 'Choose based on your use case.',
        code: `// ✅ Use Controlled: Form validation, real-time updates
function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(validateEmail(e.target.value));
  };

  return (
    <input
      value={email}
      onChange={handleChange}
      className={error ? 'error' : ''}
    />
  );
}

// ✅ Use Uncontrolled: File inputs, simple forms
function FileUpload() {
  const fileRef = useRef(null);

  const handleUpload = () => {
    const file = fileRef.current.files[0];
    uploadFile(file);
  };

  return (
    <>
      <input type="file" ref={fileRef} />
      <button onClick={handleUpload}>Upload</button>
    </>
  );
}`,
        codeLanguage: 'javascript'
      }
    ]
  }
];

