# React & TypeScript Comprehensive Guide

## 1. What is Rendering and Re-rendering in React?

**Rendering** is the process where React converts your JSX/components into actual DOM elements that appear on the screen.

**Re-rendering** occurs when React updates the DOM because state, props, or context has changed.

### Example: Rendering and Re-rendering

```typescript
import React, { useState } from 'react';

interface CounterProps {
  initialValue: number;
}

const Counter: React.FC<CounterProps> = ({ initialValue }) => {
  const [count, setCount] = useState<number>(initialValue);
  const [name, setName] = useState<string>('User');

  console.log('Component rendered/re-rendered'); // Logs every render

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setName('Developer')}>Change Name</button>
    </div>
  );
};

export default Counter;
```

**What happens:**
- **Initial Load**: Component renders once, console logs "Component rendered/re-rendered"
- **Click "Increment"**: State changes → React re-renders → console logs again
- **Click "Change Name"**: State changes → React re-renders → console logs again

---

## 2. What Happens During Initial Load and State Changes?

### Initial Load:
1. React creates a virtual representation of the component
2. Calls the component function
3. Generates JSX
4. Creates actual DOM nodes
5. Mounts them to the page
6. Runs useEffect hooks (if any)

### State Changes:
1. setState is called
2. React schedules a re-render
3. Component function is called again with new state
4. New JSX is generated
5. React compares old and new JSX (reconciliation)
6. Only changed DOM nodes are updated
7. useEffect cleanup runs (if dependencies changed)
8. New useEffect runs

---

## 3. What is the Virtual DOM?

The **Virtual DOM** is an in-memory representation of the real DOM. It's a lightweight JavaScript object that mirrors the structure of the actual DOM.

**Why it matters:**
- Faster than directly manipulating the real DOM
- React can batch updates
- Enables efficient diffing algorithm

**Example:**
```typescript
// Real DOM
<div id="app">
  <h1>Count: 5</h1>
</div>

// Virtual DOM (JavaScript object)
{
  type: 'div',
  props: { id: 'app' },
  children: [
    {
      type: 'h1',
      props: {},
      children: ['Count: 5']
    }
  ]
}
```

---

## 4. Difference Between State, Virtual DOM, and Reconciliation

| Concept | Definition | Purpose |
|---------|-----------|---------|
| **State** | Data that changes over time in a component | Triggers re-renders when updated |
| **Virtual DOM** | In-memory representation of the UI | Enables efficient updates |
| **Reconciliation** | Process of comparing old and new Virtual DOM | Determines which DOM nodes to update |

**Flow:**
```
State Changes → Virtual DOM Updated → Reconciliation (Diffing) → Real DOM Updated
```

---

## 5. Explain useEffect — Syntax and Use

**Syntax:**
```typescript
useEffect(() => {
  // Side effect code here
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]); // Dependency array (optional)
```

**Example:**
```typescript
import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
}

const UserProfile: React.FC<{ userId: number }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    
    // Fetch user data
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });

    // Cleanup function
    return () => {
      console.log('Cleanup: Component unmounting or userId changed');
    };
  }, [userId]); // Re-run when userId changes

  if (loading) return <p>Loading...</p>;
  return <div>{user?.name}</div>;
};
```

**Dependency Array Rules:**
- `[]` - Runs once on mount
- `[dep1, dep2]` - Runs when dependencies change
- No array - Runs after every render (avoid!)

---

## 6. Explain useLayoutEffect — Syntax and When to Use It

**Syntax:** Same as useEffect, but runs synchronously after DOM mutations.

```typescript
useLayoutEffect(() => {
  // Runs BEFORE browser paints
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

**Example:**
```typescript
import React, { useLayoutEffect, useRef, useState } from 'react';

const MeasureElement: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useLayoutEffect(() => {
    // Measure DOM before browser paints
    if (divRef.current) {
      setHeight(divRef.current.offsetHeight);
    }
  }, []);

  return (
    <div ref={divRef}>
      <p>Height: {height}px</p>
    </div>
  );
};
```

**When to use:**
- Measuring DOM elements (width, height, scroll position)
- Preventing visual flicker
- Synchronous DOM updates needed before paint

**useEffect vs useLayoutEffect:**
- `useEffect`: Runs AFTER paint (async) - use for data fetching
- `useLayoutEffect`: Runs BEFORE paint (sync) - use for DOM measurements

---

## 7. How Do You Manually Force a UI Update or Refresh Data in React?

**Method 1: Using useState**
```typescript
const [refresh, setRefresh] = useState<number>(0);

const forceUpdate = () => setRefresh(prev => prev + 1);

return <button onClick={forceUpdate}>Refresh</button>;
```

**Method 2: Using useReducer**
```typescript
const [, dispatch] = useReducer(x => x + 1, 0);

return <button onClick={() => dispatch()}>Refresh</button>;
```

**Method 3: Refetch data**
```typescript
const [data, setData] = useState(null);

const refreshData = async () => {
  const response = await fetch('/api/data');
  setData(await response.json());
};

return <button onClick={refreshData}>Refresh Data</button>;
```

---

## 8. Can We Use useLayoutEffect Instead of useEffect for Refreshing Data?

**No, you should NOT use useLayoutEffect for data fetching.**

**Why:**
- useLayoutEffect is synchronous and blocks rendering
- Data fetching is asynchronous
- useLayoutEffect is meant for DOM measurements, not async operations
- Performance will be worse

**Correct approach:**
```typescript
// ✅ Correct
useEffect(() => {
  fetchData();
}, []);

// ❌ Wrong
useLayoutEffect(() => {
  fetchData(); // Blocks rendering
}, []);
```

---

## 9. What is React Fiber?

**React Fiber** is the new reconciliation engine introduced in React 16. It's a complete rewrite of React's core algorithm.

**Key points:**
- Breaks rendering work into small units called "fibers"
- Can pause, abort, or reuse work
- Assigns priority to different types of work
- Enables better error handling

---

## 10. Why Was React Fiber Introduced?

**Problems with old reconciliation:**
- Couldn't pause rendering
- Couldn't prioritize work
- Long renders blocked the main thread
- Animations and user input felt janky

**Solutions Fiber provides:**
- Incremental rendering (spread work over multiple frames)
- Priority-based rendering (user input > animations > data fetching)
- Better error boundaries
- Improved performance

---

## 11. How Does React Fiber Improve Reconciliation and Rendering?

**Improvements:**
1. **Incremental Rendering**: Splits work into chunks, yields to browser
2. **Priority Levels**: 
   - Immediate (user input)
   - User-blocking (animations)
   - Normal (data fetching)
   - Low (background tasks)
3. **Pausable Work**: Can pause and resume rendering
4. **Error Boundaries**: Better error handling with error boundaries

**Example:**
```typescript
// Before Fiber: Long render blocks everything
// After Fiber: Render is split, browser can handle input

const HeavyComponent: React.FC = () => {
  const items = Array.from({ length: 10000 }, (_, i) => i);
  
  return (
    <ul>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};
```

---

## 12. Real-time Graph Optimization (Stock Data Every Nanosecond)

**Techniques:**
1. **Memoization**: Prevent unnecessary re-renders
2. **Virtual Scrolling**: Only render visible items
3. **Web Workers**: Offload calculations
4. **Canvas/SVG**: Use for high-frequency updates
5. **Debouncing/Throttling**: Limit update frequency

**Example:**
```typescript
import React, { useMemo, useCallback } from 'react';

interface StockDataPoint {
  timestamp: number;
  price: number;
}

interface StockGraphProps {
  data: StockDataPoint[];
}

const StockGraph: React.FC<StockGraphProps> = React.memo(({ data }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.slice(-100); // Only last 100 points
  }, [data]);

  const handleCanvasRender = useCallback(() => {
    // Use Canvas for high-frequency updates
    const canvas = document.getElementById('graph') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    // Draw graph
  }, [processedData]);

  return <canvas id="graph" onLoad={handleCanvasRender} />;
});

export default StockGraph;
```

---

## 13. Storing List Data on Browser Side

**Options:**
1. **React State**: For temporary data during session
2. **localStorage**: Persistent across sessions (5-10MB)
3. **sessionStorage**: Temporary, cleared on tab close
4. **IndexedDB**: Large amounts (GB+), structured data
5. **Context API**: Share across components

**Example:**
```typescript
const [items, setItems] = useState<string[]>([]);

// Save to localStorage
const saveItems = (newItems: string[]) => {
  setItems(newItems);
  localStorage.setItem('items', JSON.stringify(newItems));
};

// Load from localStorage
useEffect(() => {
  const saved = localStorage.getItem('items');
  if (saved) setItems(JSON.parse(saved));
}, []);
```

---

## 14. Persistent vs Temporary Data Storage

| Storage | Persistence | Size | Use Case |
|---------|-------------|------|----------|
| **localStorage** | Persistent (until cleared) | 5-10MB | User preferences, auth tokens |
| **sessionStorage** | Session only | 5-10MB | Temporary form data |
| **IndexedDB** | Persistent | GB+ | Large datasets, offline support |
| **Cookies** | Persistent (configurable) | 4KB | Auth, tracking |

**Example:**
```typescript
// localStorage - Persistent
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');

// sessionStorage - Temporary
sessionStorage.setItem('tempData', JSON.stringify(data));

// IndexedDB - Large data
const db = indexedDB.open('myDB');
```

---

## 15. E-commerce Discount Feature: Context API vs Redux

**Answer: Use Context API**

**Why:**
- Simple feature (2 discount levels)
- No complex state logic
- Fewer dependencies
- Easier to maintain

**Example:**
```typescript
interface DiscountContextType {
  userType: 'guest' | 'vip';
  discount: number;
}

const DiscountContext = React.createContext<DiscountContextType>({
  userType: 'guest',
  discount: 10
});

const DiscountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<'guest' | 'vip'>('guest');
  
  const discount = userType === 'vip' ? 15 : 10;

  return (
    <DiscountContext.Provider value={{ userType, discount }}>
      {children}
    </DiscountContext.Provider>
  );
};

// Usage
const useDiscount = () => useContext(DiscountContext);
```

**When to use Redux instead:**
- Complex state logic
- Multiple discount types
- Frequent state updates
- Need for time-travel debugging

---

## 16. How to Create a New React App from Command Line

**Using Create React App (CRA):**
```bash
npx create-react-app my-app
cd my-app
npm start
```

**Using Vite (faster):**
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

**Using TypeScript:**
```bash
npx create-react-app my-app --template typescript
# or
npm create vite@latest my-app -- --template react-ts
```

---

## 17. Can We Use npm Instead of npx?

**No, not directly.**

**Why:**
- `npm` installs packages globally or locally
- `npx` executes packages without installing
- `create-react-app` is meant to be run once, not installed

**What happens if you try:**
```bash
npm create-react-app my-app
# Error: create-react-app is not a valid npm command
```

**Correct:**
```bash
npx create-react-app my-app
# npx downloads and runs create-react-app temporarily
```

---

## 18. What Happens if We Type `npm create react app`?

**Result: Error**

```bash
npm create react app
# npm ERR! 404 Not Found - GET https://registry.npmjs.org/react
# npm ERR! 404 'react' is not in the npm registry
```

**Why:**
- `npm create` expects a package name
- `react app` is interpreted as two separate arguments
- Correct syntax: `npm create react-app@latest my-app`

**Correct alternatives:**
```bash
npx create-react-app my-app
npm create vite@latest my-app -- --template react
```

---

## 19. Can We Use `npx start` Instead of `npm start`?

**No, not directly.**

**Why:**
- `npm start` runs the script defined in `package.json`
- `npx` executes packages, not npm scripts

**What happens:**
```bash
npx start
# npx ERR! command not found: start
```

**Correct:**
```bash
npm start
# Runs the "start" script from package.json
```

**What `npm start` does:**
```json
{
  "scripts": {
    "start": "react-scripts start"
  }
}
```

---

## Summary Table

| Concept | Key Point |
|---------|-----------|
| **Rendering** | Converting JSX to DOM |
| **Re-rendering** | Updating DOM when state/props change |
| **Virtual DOM** | In-memory representation for efficient updates |
| **useEffect** | Run side effects after render |
| **useLayoutEffect** | Run before paint (DOM measurements) |
| **React Fiber** | New reconciliation engine with priorities |
| **Storage** | localStorage (persistent), sessionStorage (temp), IndexedDB (large) |
| **Context vs Redux** | Use Context for simple state, Redux for complex |
| **npx vs npm** | npx runs packages, npm runs scripts |


