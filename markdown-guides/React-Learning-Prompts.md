# React Learning & Development – Prompt Guide

Use these prompts with your AI assistant to learn React step by step and build real projects. Adjust details like "level", "topic", or "framework" as needed.

---

## 1. React Fundamentals & JSX

- "Act as a senior React mentor and teach me React from scratch. Start with what React is, when to use it, and build up to components, JSX, and props with simple examples. Include mini exercises after each concept."
- "Explain JSX to me as if I already know basic JavaScript but not React. Compare JSX to plain `React.createElement` calls, and show at least 3 small code examples."
- "Give me a 7-day learning plan for React fundamentals. Each day should have topics, small coding tasks, and a simple mini-project idea."
- "Show me the minimal React + TypeScript component setup using Vite or Create React App, and explain each file and line in the starter template."
- "Create a set of multiple-choice questions (with answers) to test my understanding of React components, props, and JSX syntax."

---

## 2. Components, Props & State

- "Show me how to create a reusable React component with props, including default values and prop types (TypeScript or PropTypes). Use a Button or Card component as the example."
- "Give me a step-by-step exercise where I build a small React app that lists products, passes props to child components, and uses state to filter the list. Include solution code at the end."
- "Explain the difference between controlled and uncontrolled components in React, with form input examples and when to use each."
- "Refactor a simple React component with too many responsibilities into smaller presentational and container components. Explain the reasoning."
- "Create practice tasks where I need to read and understand existing React components and then modify behavior based on new requirements."

---

## 3. Hooks & State Management

- "Teach me React hooks step by step: start with `useState`, then `useEffect`, then `useMemo`, `useCallback`, and `useRef`. For each hook, give me: when to use it, a simple example, and one common bug to avoid."
- "Give me 5 small coding challenges that specifically practice `useState` and `useEffect` (e.g., counters, timers, API calls, debounced search)."
- "Show me how to convert a class-based React component with lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) into a functional component with hooks."
- "Explain lifting state up between components using a concrete example (like a shared form filter or a selected item). Provide both the 'before' and 'after' versions."
- "Introduce me to global state options in React (Context, Redux, Zustand, etc.) and give me a decision guide for when to pick each approach."

---

## 4. Styling & UI Patterns

- "Compare different ways of styling React components: plain CSS, CSS Modules, styled-components, Tailwind CSS. Show pros/cons and a small example of each."
- "Help me build a small design system in React: Button, Input, Modal components. Show how to make them reusable, theme-friendly, and accessible."
- "Explain how to handle responsive design in React using CSS and layout components. Include an example layout for a dashboard page."
- "Create an exercise where I refactor a messy, inline-styled component into a clean component with a proper styling approach and better structure."

---

## 5. Data Fetching & APIs

- "Show me how to fetch data in React using `fetch` or `axios` inside `useEffect`. Include loading, error, and empty states."
- "Create a guided exercise where I build a small 'GitHub user search' app in React that calls a public API and displays results, with pagination or infinite scroll."
- "Explain the difference between client-side data fetching in React and server-side rendering / prefetching. Mention tools like Next.js or Remix."
- "Teach me how to handle caching and revalidation using libraries like React Query or SWR, with a simple example."

---

## 6. Testing React Apps

- "Introduce me to testing React components with Jest and React Testing Library. Show how to test rendering, user interactions, and API calls."
- "Give me 3 practice tasks where I have to write tests for an existing React component (form, list, and dialog). Provide the component code and then the expected tests."
- "Explain the difference between unit tests, integration tests, and end-to-end tests in the context of a React app. Suggest tools for each."

---

## 7. Architecture, Patterns & Real Projects

- "Explain common React architectural patterns: container/presenter components, custom hooks, render props (historical), and higher-order components. Give me examples and when to use each."
- "Help me design the front-end architecture for a medium-sized React app (e.g., e-commerce or admin dashboard). Suggest folder structure, state management strategy, and routing."
- "Walk me through building a small real-world React project step by step: requirements, component breakdown, state design, API integration, and testing."
- "Review a React component or small code sample I provide, and give me concrete refactoring suggestions focused on readability, performance, and best practices."

---

## 8. Performance, Optimization & Advanced Topics

- "Teach me how to measure and optimize React performance: explain reconciliation, key props, memoization, and avoiding unnecessary re-renders."
- "Show examples of when to use `React.memo`, `useMemo`, and `useCallback`, and when *not* to use them. Include before/after code."
- "Explain code-splitting in React with React.lazy and Suspense, and give an example of splitting routes or large components."
- "Give me a checklist for preparing a React app for production: performance, accessibility, error boundaries, logging, and basic security considerations."

---

## 9. Meta-Prompts for Continuous Learning

- "Act as my React coach. I will paste code, and you will: 1) explain what it does, 2) point out any bugs or smells, and 3) suggest an improved version with explanations."
- "Generate a weekly React learning plan for me based on my current level (I will describe it), focusing on building one small project per week."
- "Turn the React topic I specify (for example, hooks, forms, or routing) into a mini course with theory, examples, exercises, and a small final project."

