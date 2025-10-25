# Advanced React Tutorial

## Table of Contents

1. [React Fundamentals](#react-fundamentals)
2. [Advanced Hooks](#advanced-hooks)
3. [Performance Optimization](#performance-optimization)
4. [State Management](#state-management)
5. [Redux Deep Dive](#redux-deep-dive)
6. [Advanced Patterns](#advanced-patterns)
7. [Code Splitting & Lazy Loading](#code-splitting--lazy-loading)
8. [Testing & Best Practices](#testing--best-practices)

---

## React Fundamentals

### What is React?

React is an **open-source JavaScript library** used for building user interfaces (UI). It simplifies the creation of Single Page Applications (SPA) by using reusable components.

### Key Features of React

1. **Virtual DOM**: React utilizes a virtual representation of the DOM, allowing efficient updates by minimizing direct manipulation of the actual DOM, resulting in improved performance.

2. **Component-Based Architecture**: React structures user interfaces as modular, reusable components, promoting a more maintainable and scalable approach to building applications.

3. **JSX (JavaScript XML)**: JSX is a syntax extension for JavaScript used in React, allowing developers to write HTML-like code within JavaScript, enhancing readability and maintainability.

4. **Declarative Syntax**: React uses a declarative programming style where developers focus on "what" the UI should look like and React handles the "how" behind the scenes.

5. **React Hooks**: Hooks are functions that enable functional components to manage state and lifecycle features, providing a more concise and expressive way to handle component logic.

### Virtual DOM vs Real DOM

| DOM | Virtual DOM |
|-----|-------------|
| Actual representation of the webpage | Lightweight copy of the DOM |
| Re-renders the entire page when updates occur | Re-renders only the changed parts efficiently |
| Can be slower, especially with frequent updates | Optimized for faster rendering |
| Suitable for static websites and simple applications | Ideal for dynamic and complex single-page applications |

---

## Advanced Hooks

### useState Hook

The `useState` hook enables functional components to manage state.

```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**Key Points:**
- `useState()` accepts the initial state value as parameter
- Returns an array with two elements: current state and state updater function
- Uses array destructuring to assign variables

### useEffect Hook

The `useEffect` hook is used to perform side effects in functional components.

```javascript
import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Side effect: API call
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []); // Empty dependency array - runs once
  
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```

**Dependency Array Patterns:**
- `[]` - Effect runs once (component mount)
- `[dependency]` - Effect runs when dependency changes
- No array - Effect runs on every render

### useContext Hook

The `useContext` hook provides a way to pass data from parent to child components without prop drilling.

```javascript
import React, { createContext, useContext, useState } from 'react';

// Create Context
const ThemeContext = createContext();

// Provider Component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer Component
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button 
      style={{ background: theme === 'dark' ? '#333' : '#fff' }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Toggle Theme
    </button>
  );
}
```

**When to use useContext:**
- Theme switching (Dark/Light mode)
- Localization (language selection)
- User authentication state
- Notification systems
- Configuration settings

### useReducer Hook

The `useReducer` hook is an alternative to `useState` when dealing with complex state logic.

```javascript
import React, { useReducer } from 'react';

// Reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

**useState vs useReducer:**

| useState | useReducer |
|---------|------------|
| Simple state values | Complex state logic |
| Single piece of state | Multiple pieces of state |
| Direct state updates | Action-based updates |
| Less boilerplate | More structured approach |

---

## Performance Optimization

### useCallback Hook

The `useCallback` hook memoizes functions to prevent unnecessary re-renders.

```javascript
import React, { useState, useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // Without useCallback - function recreated on every render
  const handleClick = () => {
    console.log('Button clicked');
  };
  
  // With useCallback - function memoized
  const memoizedHandleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // Dependencies array
  
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <ChildComponent onClick={memoizedHandleClick} />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
}
```

### useMemo Hook

The `useMemo` hook memoizes expensive calculations.

```javascript
import React, { useState, useMemo } from 'react';

function ExpensiveComponent({ items }) {
  const [filter, setFilter] = useState('');
  
  // Expensive calculation
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]); // Recalculate only when items or filter changes
  
  return (
    <div>
      <input 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items..."
      />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### React.memo

`React.memo` is a higher-order component that memoizes the result of a component.

```javascript
import React, { memo } from 'react';

const ExpensiveChild = memo(({ data, onUpdate }) => {
  console.log('ExpensiveChild rendered');
  
  return (
    <div>
      <h3>{data.title}</h3>
      <button onClick={onUpdate}>Update</button>
    </div>
  );
});

// Component will only re-render if props change
```

### Performance Optimization Strategies

1. **Memoization with useMemo and useCallback**: Use these hooks to memoize values and functions, reducing unnecessary recalculations.

2. **React.Fragment**: Use fragments to avoid unnecessary wrapper elements that could cause additional DOM nodes.

3. **Lazy Loading with React.lazy**: Load components lazily, reducing the initial bundle size.

4. **Code Splitting**: Divide your application into smaller chunks that are loaded on demand.

5. **Image Optimization**: Compress and optimize images, use responsive images, and leverage lazy loading.

---

## State Management

### Local Component State vs Global State

**When to use useState (Local State):**
- Simple component-level state
- Small applications (5-50 components)
- State specific to components
- Lightweight and built into React

**When to use Context API:**
- Prop drilling avoidance
- Sharing global data
- Medium-sized applications
- Theme, language, or user preferences

**When to use Redux:**
- Large-scale applications (>50 components)
- Complex global state management
- Predictable state updates
- Time-travel debugging needs

### Custom Hooks

Custom hooks are JavaScript functions that encapsulate reusable logic.

```javascript
// Custom hook for API data fetching
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

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useApi(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>Welcome, {user.name}!</div>;
}
```

---

## Redux Deep Dive

### Core Principles of Redux

1. **Single Source of Truth**: The entire application state is stored in one place (the store).

2. **State is Read-Only**: State cannot be directly modified. Changes are made by dispatching actions.

3. **Changes using Pure Functions**: Reducers are pure functions that take the previous state and an action, and return the new state.

### Redux Flow

```
Component → Action → Reducer → Store → Component
```

### Setting up Redux

```bash
npm install redux react-redux @reduxjs/toolkit
```

### Action Creators

```javascript
// actions.js
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const SET_COUNT = 'SET_COUNT';

// Action creators
export const increment = () => ({
  type: INCREMENT
});

export const decrement = () => ({
  type: DECREMENT
});

export const setCount = (count) => ({
  type: SET_COUNT,
  payload: count
});
```

### Reducers

```javascript
// reducer.js
import { INCREMENT, DECREMENT, SET_COUNT } from './actions';

const initialState = {
  count: 0
};

export default function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        count: state.count + 1
      };
    case DECREMENT:
      return {
        ...state,
        count: state.count - 1
      };
    case SET_COUNT:
      return {
        ...state,
        count: action.payload
      };
    default:
      return state;
  }
}
```

### Store Configuration

```javascript
// store.js
import { createStore } from 'redux';
import counterReducer from './reducer';

const store = createStore(counterReducer);

export default store;
```

### Connecting Components

```javascript
// Counter.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, setCount } from './actions';

function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(setCount(0))}>Reset</button>
    </div>
  );
}

export default Counter;
```

### Redux Toolkit (Modern Approach)

```javascript
// store.js using Redux Toolkit
import { configureStore, createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1; // Immer allows direct mutation
    },
    decrement: (state) => {
      state.count -= 1;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    }
  }
});

export const { increment, decrement, setCount } = counterSlice.actions;

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});
```

### Async Actions with Redux Thunk

```javascript
// Thunk action creator
export const fetchUserData = (userId) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_USER_START' });
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      dispatch({ type: 'FETCH_USER_SUCCESS', payload: userData });
    } catch (error) {
      dispatch({ type: 'FETCH_USER_ERROR', payload: error.message });
    }
  };
};
```

---

## Advanced Patterns

### Higher-Order Components (HOC)

A Higher-Order Component is a component that takes another component as an argument and adds extra features.

```javascript
// HOC for adding logging functionality
function withLogging(WrappedComponent) {
  return function LoggingComponent(props) {
    useEffect(() => {
      console.log(`${WrappedComponent.name} mounted`);
      return () => {
        console.log(`${WrappedComponent.name} unmounted`);
      };
    }, []);
    
    return <WrappedComponent {...props} />;
  };
}

// Usage
const LoggedButton = withLogging(Button);
```

### Render Props Pattern

```javascript
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
function App() {
  return (
    <DataProvider>
      {({ data, loading }) => (
        loading ? <div>Loading...</div> : <div>{data}</div>
      )}
    </DataProvider>
  );
}
```

### Compound Components Pattern

```javascript
function Tabs({ children, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <div className="tabs">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, { activeTab, setActiveTab, index })
      )}
    </div>
  );
}

function TabList({ children, activeTab, setActiveTab }) {
  return (
    <div className="tab-list">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, { 
          isActive: activeTab === index,
          onClick: () => setActiveTab(index)
        })
      )}
    </div>
  );
}

function Tab({ children, isActive, onClick }) {
  return (
    <button 
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function TabPanels({ children, activeTab }) {
  return (
    <div className="tab-panels">
      {React.Children.toArray(children)[activeTab]}
    </div>
  );
}

// Usage
function App() {
  return (
    <Tabs defaultTab={0}>
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
      </TabList>
      <TabPanels>
        <div>Panel 1 Content</div>
        <div>Panel 2 Content</div>
        <div>Panel 3 Content</div>
      </TabPanels>
    </Tabs>
  );
}
```

---

## Code Splitting & Lazy Loading

### React.lazy and Suspense

```javascript
import React, { Suspense, lazy } from 'react';

// Lazy load components
const LazyComponent = lazy(() => import('./LazyComponent'));
const AnotherLazyComponent = lazy(() => import('./AnotherLazyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
      
      <Suspense fallback={<div>Loading another component...</div>}>
        <AnotherLazyComponent />
      </Suspense>
    </div>
  );
}
```

### Route-based Code Splitting

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### Benefits of Code Splitting

1. **Faster Initial Load Time**: Only load necessary code for the current view
2. **Optimized Bandwidth Usage**: Reduce data transferred over the network
3. **Improved Caching**: Smaller, focused chunks are more likely to be cached
4. **Parallel Loading**: Multiple chunks can be loaded simultaneously

---

## Testing & Best Practices

### React Testing Library

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('increments counter when button is clicked', () => {
  render(<Counter />);
  
  const button = screen.getByText('Increment');
  const counter = screen.getByText('Count: 0');
  
  fireEvent.click(button);
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### Best Practices

1. **Component Structure**: Keep components small and focused on a single responsibility
2. **Props Validation**: Use PropTypes or TypeScript for type checking
3. **Error Boundaries**: Implement error boundaries to catch and handle errors gracefully
4. **Accessibility**: Use semantic HTML and ARIA attributes
5. **Performance**: Use React DevTools Profiler to identify performance bottlenecks

### Error Boundaries

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

---

## Conclusion

This advanced React tutorial covers the essential concepts and patterns needed to build scalable, performant React applications. Key takeaways:

- **Hooks** provide a powerful way to manage state and side effects in functional components
- **Performance optimization** through memoization and code splitting is crucial for large applications
- **State management** should be chosen based on application complexity and requirements
- **Redux** provides predictable state management for complex applications
- **Advanced patterns** like HOCs and render props enable code reuse and composition
- **Testing** and **best practices** ensure maintainable and reliable code

Continue practicing these concepts and exploring the React ecosystem to become proficient in modern React development.
