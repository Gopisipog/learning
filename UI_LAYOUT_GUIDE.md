# React Interview Questions App - UI Layout Guide

## Desktop Layout (> 768px)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  React Interview Questions (31-40)                                 │
│  JSX & Advanced Concepts                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────────────────────────────┐
│                      │                                              │
│   SIDEBAR            │         MAIN CONTENT                         │
│   (300px)            │         (Flex: 1)                            │
│                      │                                              │
│  Questions           │  ┌────────────────────────────────────────┐ │
│  ─────────────────   │  │ Q31. What is Babel?          [Q31]    │ │
│  [Q31] Babel         │  │                                        │ │
│  [Q32] Fragment      │  │ Babel is a JavaScript transpiler...   │ │
│  [Q33] Spread Op.    │  │                                        │ │
│  [Q34] Conditional   │  │ ┌──────────────────────────────────┐ │ │
│                      │  │ │ ▶ Role in React                │ │ │
│  Search...           │  │ └──────────────────────────────────┘ │ │
│  ┌─────────────────┐ │  │ ┌──────────────────────────────────┐ │ │
│  │ Search...       │ │  │ │ ▶ Transpilation Process        │ │ │
│  └─────────────────┘ │  │ └──────────────────────────────────┘ │ │
│                      │  │ ┌──────────────────────────────────┐ │ │
│                      │  │ │ ▼ .babelrc Configuration       │ │ │
│                      │  │ │                                │ │ │
│                      │  │ │ {                              │ │ │
│                      │  │ │   "presets": [...]            │ │ │
│                      │  │ │ }                              │ │ │
│                      │  │ │                                │ │ │
│                      │  │ │ [📋 Copy]                      │ │ │
│                      │  │ └──────────────────────────────────┘ │ │
│                      │  │                                        │ │
│                      │  │ Question 1 of 4                        │ │
│                      │  └────────────────────────────────────────┘ │
│                      │                                              │
│                      │  [← Previous]  1 / 4  [Next →]              │
│                      │                                              │
└──────────────────────┴──────────────────────────────────────────────┘
```

## Mobile Layout (< 768px)

```
┌──────────────────────────────────────┐
│                                      │
│  React Interview Questions (31-40)   │
│  JSX & Advanced Concepts             │
│                                      │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  HORIZONTAL QUESTION LIST            │
│  [Q31] [Q32] [Q33] [Q34]             │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│                                      │
│  MAIN CONTENT                        │
│                                      │
│  Q31. What is Babel?      [Q31]      │
│                                      │
│  Babel is a JavaScript...            │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ▶ Role in React              │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ▶ Transpilation Process       │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ▼ .babelrc Configuration      │  │
│  │                                │  │
│  │ { "presets": [...] }           │  │
│  │                                │  │
│  │ [📋 Copy]                      │  │
│  └────────────────────────────────┘  │
│                                      │
│  Question 1 of 4                     │
│                                      │
│  [← Previous] 1/4 [Next →]           │
│                                      │
└──────────────────────────────────────┘
```

## Component Breakdown

### Header
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  React Interview Questions (31-40)                         │
│  JSX & Advanced Concepts                                   │
│                                                             │
│  (Gradient background: Blue to Dark Blue)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar (Desktop Only)
```
┌──────────────────────┐
│ Questions            │  ← Header
├──────────────────────┤
│ ┌──────────────────┐ │
│ │ Search...        │ │  ← Search Input
│ └──────────────────┘ │
├──────────────────────┤
│ [Q31] Babel          │  ← Question Item (Active)
│ [Q32] Fragment       │  ← Question Item
│ [Q33] Spread Op.     │  ← Question Item
│ [Q34] Conditional    │  ← Question Item
│                      │
│ (Scrollable)         │
└──────────────────────┘
```

### Question Card
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  Q31. What is Babel?                            [Q31]     │  ← Header
│  ────────────────────────────────────────────────────────  │
│                                                            │
│  Babel is a JavaScript transpiler that converts...        │  ← Intro
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ▶ Role in React                                    │ │  ← Section
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ▼ .babelrc Configuration                           │ │  ← Expanded
│  │                                                    │ │
│  │ Content here...                                    │ │
│  │                                                    │ │
│  │ ┌──────────────────────────────────────────────┐ │ │
│  │ │ json                    [📋 Copy]            │ │ │
│  │ │ {                                            │ │ │
│  │ │   "presets": [...]                           │ │ │
│  │ │ }                                            │ │ │
│  │ └──────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ▶ Key Babel Presets                                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ────────────────────────────────────────────────────────  │
│  Question 1 of 4                                          │  ← Footer
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Accordion Section (Collapsed)
```
┌──────────────────────────────────────────────────────────┐
│ ▶ Role in React                                          │
└──────────────────────────────────────────────────────────┘
```

### Accordion Section (Expanded)
```
┌──────────────────────────────────────────────────────────┐
│ ▼ Role in React                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Babel is essential for React development because...     │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ javascript                    [📋 Copy]            │  │
│ │ const element = (                                  │  │
│ │   <div className="container">                      │  │
│ │     <h1>Hello, {name}!</h1>                        │  │
│ │   </div>                                           │  │
│ │ );                                                 │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Code Block
```
┌────────────────────────────────────────────────────────┐
│ javascript                          [📋 Copy]           │  ← Header
├────────────────────────────────────────────────────────┤
│                                                        │
│ const element = (                                      │
│   <div className="container">                          │
│     <h1>Hello, {name}!</h1>                            │
│     <button onClick={handleClick}>                     │
│       Click me                                         │
│     </button>                                          │
│   </div>                                               │
│ );                                                     │
│                                                        │
│ (Dark background, light text)                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Navigation Buttons
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  [← Previous]        1 / 4        [Next →]             │
│                                                        │
│  (Previous disabled on first question)                 │
│  (Next disabled on last question)                      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Color Scheme

### Primary Colors
- **Primary Blue**: #3b82f6 (Buttons, Headers, Active states)
- **Dark Blue**: #1e40af (Hover states, Gradients)
- **Light Gray**: #f9fafb (Background)
- **White**: #ffffff (Cards, Content)

### Text Colors
- **Dark**: #1f2937 (Main text)
- **Gray**: #6b7280 (Secondary text)
- **Light Gray**: #e5e7eb (Borders)

### Code Block
- **Background**: #1f2937 (Dark gray)
- **Header**: #111827 (Darker gray)
- **Text**: #e5e7eb (Light gray)

## Typography

### Headings
- **H1** (Header): 2.5rem, Bold
- **H2** (Question Title): 1.75rem, Bold
- **H3** (Section Title): 1.1rem, Bold

### Body Text
- **Regular**: 1rem, Normal weight
- **Small**: 0.875rem, Normal weight
- **Code**: 0.875rem, Monospace

## Spacing

- **Extra Small**: 0.25rem
- **Small**: 0.5rem
- **Medium**: 1rem
- **Large**: 1.5rem
- **Extra Large**: 2rem

## Shadows

- **Small**: 0 1px 2px rgba(0,0,0,0.05)
- **Medium**: 0 4px 6px rgba(0,0,0,0.1)
- **Large**: 0 10px 15px rgba(0,0,0,0.1)

## Animations

- **Expand/Collapse**: 0.3s ease
- **Hover**: 0.3s ease
- **Button Click**: 0.2s ease

## Responsive Behavior

### Desktop (> 768px)
- Sidebar visible (300px width)
- Main content takes remaining space
- Full question text in sidebar
- Horizontal layout

### Mobile (< 768px)
- Sidebar becomes horizontal list
- Questions shown as badges
- Main content full width
- Stacked layout
- Question text hidden in sidebar

