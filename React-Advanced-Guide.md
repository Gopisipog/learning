# React, TypeScript & Advanced Concepts Guide

## 1. Render and Re-render Concept Explained

**Rendering** is the process where React converts your component code into actual DOM elements displayed on the screen.

**Re-rendering** happens when React updates the DOM because state, props, or context has changed.

### Key Points:
- **Initial Render**: Component mounts and displays for the first time
- **Re-render**: Component updates due to state/props changes
- **Unnecessary Re-renders**: Happen when parent re-renders (can be optimized with React.memo)

---

## 2. Example with Code (React & TypeScript)

```typescript
import React, { useState } from 'react';

interface CounterProps {
  title: string;
}

const Counter: React.FC<CounterProps> = ({ title }) => {
  const [count, setCount] = useState<number>(0);
  const [name, setName] = useState<string>('User');

  console.log('Component rendered'); // Logs on every render/re-render

  return (
    <div>
      <h1>{title}</h1>
      <p>Hello, {name}!</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setName('Developer')}>Change Name</button>
    </div>
  );
};

export default Counter;
```

**What happens:**
- **Initial Load**: Renders once, console logs "Component rendered"
- **Click Increment**: State changes → Re-renders → Console logs again
- **Click Change Name**: State changes → Re-renders → Console logs again

---

## 3. Initial Load and State Changes

### Initial Load Flow:
1. React creates component instance
2. Calls component function
3. Generates JSX
4. Creates Virtual DOM
5. Converts to real DOM
6. Mounts to page
7. Runs useEffect hooks (if any)

### State Change Flow:
1. setState is called
2. React schedules re-render
3. Component function called with new state
4. New JSX generated
5. React compares old and new Virtual DOM (reconciliation)
6. Only changed DOM nodes updated
7. useEffect cleanup runs (if dependencies changed)
8. New useEffect runs

```typescript
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Cleanup before unmount');
}, []); // Runs once on mount
```

---

## 4. Virtual DOM

**Virtual DOM** is an in-memory JavaScript representation of the real DOM.

**Why it matters:**
- Faster than direct DOM manipulation
- Enables efficient diffing algorithm
- Allows batching of updates

**Example:**
```typescript
// Real DOM
<div id="app">
  <h1>Count: 5</h1>
  <button>Click me</button>
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
    },
    {
      type: 'button',
      props: {},
      children: ['Click me']
    }
  ]
}
```

---

## 5. Difference Between State, Virtual DOM, and Reconciliation

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

## 6. useEffect — Syntax

```typescript
useEffect(() => {
  // Side effect code here
  console.log('Effect ran');

  return () => {
    // Cleanup code (optional)
    console.log('Cleanup ran');
  };
}, [dependencies]); // Dependency array (optional)
```

### Dependency Array Rules:
- **No array**: Runs after every render (avoid!)
- **Empty array `[]`**: Runs once on mount
- **With dependencies `[dep1, dep2]`**: Runs when dependencies change

### Example:
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
    
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });

    return () => {
      console.log('Cleanup: userId changed');
    };
  }, [userId]); // Re-run when userId changes

  if (loading) return <p>Loading...</p>;
  return <div>{user?.name}</div>;
};

export default UserProfile;
```

---

## 7. useLayoutEffect — Syntax

```typescript
useLayoutEffect(() => {
  // Runs BEFORE browser paints
  console.log('Layout effect ran');

  return () => {
    // Cleanup
    console.log('Layout cleanup');
  };
}, [dependencies]);
```

### When to Use:
- Measuring DOM elements (width, height, scroll position)
- Preventing visual flicker
- Synchronous DOM updates needed before paint

### Example:
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

export default MeasureElement;
```

### useEffect vs useLayoutEffect:
| Feature | useEffect | useLayoutEffect |
|---------|-----------|-----------------|
| **Timing** | After paint (async) | Before paint (sync) |
| **Use Case** | Data fetching, subscriptions | DOM measurements |
| **Performance** | Better (non-blocking) | Can block rendering |

---

## 8. Memoization for Data Optimization

**Memoization** prevents unnecessary re-renders and expensive calculations.

### useMemo - Memoize Values:
```typescript
import React, { useMemo, useState } from 'react';

interface DataItem {
  id: number;
  value: string;
}

const DataProcessor: React.FC<{ items: DataItem[] }> = ({ items }) => {
  const [filter, setFilter] = useState<string>('');

  // Memoize expensive calculation
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item => 
      item.value.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]); // Only recalculate when items or filter change

  return (
    <div>
      <input 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        placeholder="Filter..."
      />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default DataProcessor;
```

### useCallback - Memoize Functions:
```typescript
import React, { useCallback, useState } from 'react';

interface ChildProps {
  onButtonClick: () => void;
}

const Child: React.FC<ChildProps> = React.memo(({ onButtonClick }) => {
  console.log('Child rendered');
  return <button onClick={onButtonClick}>Click me</button>;
});

const Parent: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  // Memoize function - only recreated when dependencies change
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // Empty dependency array = never recreated

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Child onButtonClick={handleClick} />
    </div>
  );
};

export default Parent;
```

### React.memo - Memoize Components:
```typescript
interface ItemProps {
  item: string;
}

const Item: React.FC<ItemProps> = React.memo(({ item }) => {
  console.log(`Item ${item} rendered`);
  return <div>{item}</div>;
});

export default Item;
```

---

## 9. Redux Technology

**Redux** is a state management library for managing complex application state.

### Core Concepts:
1. **Store**: Single source of truth for state
2. **Action**: Object describing what happened
3. **Reducer**: Pure function that updates state
4. **Dispatch**: Send action to reducer

### Example:
```typescript
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

// Define slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    }
  }
});

// Create store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});

// Component using Redux
const Counter: React.FC = () => {
  const dispatch = useDispatch();
  const count = useSelector((state: any) => state.counter.value);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(counterSlice.actions.increment())}>
        Increment
      </button>
      <button onClick={() => dispatch(counterSlice.actions.decrement())}>
        Decrement
      </button>
    </div>
  );
};

export default Counter;
```

---

## 10. JWT Token, One-Way SSL, Two-Way SSL

### JWT Token (JSON Web Token):
**Structure**: `header.payload.signature`

```typescript
// Example JWT
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Usage:**
```typescript
// Store JWT
localStorage.setItem('token', jwtToken);

// Send JWT in requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
};

fetch('/api/data', { headers });
```

### One-Way SSL (HTTPS):
- **Client** verifies **Server** certificate
- Server proves its identity
- Data encrypted in transit
- Common for web applications

### Two-Way SSL (Mutual TLS):
- **Client** verifies **Server** certificate
- **Server** verifies **Client** certificate
- Both parties authenticate each other
- Used for high-security APIs

**Comparison:**
| Feature | One-Way SSL | Two-Way SSL |
|---------|------------|------------|
| **Client Auth** | No | Yes |
| **Server Auth** | Yes | Yes |
| **Security** | Good | Excellent |
| **Complexity** | Low | High |
| **Use Case** | Public APIs | Banking, Healthcare |

---

## 11. Interface in TypeScript

**Interface** defines the structure of an object.

```typescript
// Basic Interface
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional property
}

// Using Interface
const user: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com'
};

// Interface with Methods
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

const calc: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// Extending Interface
interface Admin extends User {
  role: 'admin' | 'user';
  permissions: string[];
}

const admin: Admin = {
  id: 1,
  name: 'Admin',
  email: 'admin@example.com',
  role: 'admin',
  permissions: ['read', 'write', 'delete']
};

// Interface with Generics
interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

const response: ApiResponse<User> = {
  status: 200,
  data: user,
  message: 'Success'
};
```

---

## 12. Generic Function - Filter Array and Return Same Type

```typescript
// Generic function that filters array
function filterArray<T>(
  array: T[],
  predicate: (item: T) => boolean
): T[] {
  return array.filter(predicate);
}

// Usage with numbers
const numbers: number[] = [1, 2, 3, 4, 5];
const evenNumbers = filterArray(numbers, (n) => n % 2 === 0);
console.log(evenNumbers); // [2, 4]

// Usage with strings
const words: string[] = ['apple', 'banana', 'apricot'];
const aWords = filterArray(words, (w) => w.startsWith('a'));
console.log(aWords); // ['apple', 'apricot']

// Usage with objects
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 1000 },
  { id: 2, name: 'Mouse', price: 50 },
  { id: 3, name: 'Keyboard', price: 100 }
];

const expensiveProducts = filterArray(
  products,
  (p) => p.price > 100
);
console.log(expensiveProducts);
// [{ id: 1, name: 'Laptop', price: 1000 }]

// Advanced: Generic with constraints
function filterByProperty<T, K extends keyof T>(
  array: T[],
  property: K,
  value: T[K]
): T[] {
  return array.filter(item => item[property] === value);
}

// Usage
const laptops = filterByProperty(products, 'name', 'Laptop');
console.log(laptops); // [{ id: 1, name: 'Laptop', price: 1000 }]
```

---

## 13. Testing Related Questions & Unit Testing

### What is Unit Testing?
Unit testing tests individual functions/components in isolation.

### Testing Tools:
- **Jest**: Testing framework
- **React Testing Library**: React component testing
- **Vitest**: Fast unit test framework

### Example Unit Tests:

```typescript
// calculator.ts
export const add = (a: number, b: number): number => a + b;
export const subtract = (a: number, b: number): number => a - b;
export const multiply = (a: number, b: number): number => a * b;

// calculator.test.ts
import { add, subtract, multiply } from './calculator';

describe('Calculator Functions', () => {
  test('add should return sum of two numbers', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  test('subtract should return difference', () => {
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(0, 5)).toBe(-5);
  });

  test('multiply should return product', () => {
    expect(multiply(3, 4)).toBe(12);
    expect(multiply(0, 100)).toBe(0);
  });
});
```

### React Component Testing:

```typescript
// Counter.tsx
import React, { useState } from 'react';

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p data-testid="count-display">{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
};

// Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter Component', () => {
  test('renders counter with initial value 0', () => {
    render(<Counter />);
    expect(screen.getByTestId('count-display')).toHaveTextContent('0');
  });

  test('increments count when button clicked', () => {
    render(<Counter />);
    const incrementBtn = screen.getByText('Increment');
    fireEvent.click(incrementBtn);
    expect(screen.getByTestId('count-display')).toHaveTextContent('1');
  });

  test('decrements count when button clicked', () => {
    render(<Counter />);
    const decrementBtn = screen.getByText('Decrement');
    fireEvent.click(decrementBtn);
    expect(screen.getByTestId('count-display')).toHaveTextContent('-1');
  });
});
```

### Running Tests:
```bash
# Run all tests
npm test

# Run specific test file
npm test Counter.test.tsx

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## Summary

| Topic | Key Point |
|-------|-----------|
| **Render/Re-render** | Initial display + updates on state/props change |
| **Virtual DOM** | In-memory representation for efficient updates |
| **useEffect** | Run side effects after render |
| **useLayoutEffect** | Run before paint (DOM measurements) |
| **Memoization** | Optimize performance with useMemo, useCallback, React.memo |
| **Redux** | Centralized state management |
| **JWT** | Token-based authentication |
| **SSL** | One-way (HTTPS) vs Two-way (Mutual TLS) |
| **Interface** | Define object structure in TypeScript |
| **Generics** | Reusable functions with type safety |
| **Unit Testing** | Test individual functions/components |


