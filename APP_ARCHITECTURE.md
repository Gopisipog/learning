# React Interview Questions App - Architecture

## Component Hierarchy

```
App (Main Component)
├── Header
│   ├── Title: "React Interview Questions (31-40)"
│   └── Subtitle: "JSX & Advanced Concepts"
│
├── Container
│   ├── Navigation (Sidebar)
│   │   ├── Sidebar Header
│   │   ├── Search Input
│   │   └── Questions List
│   │       ├── Question Item 1 (Q31)
│   │       ├── Question Item 2 (Q32)
│   │       ├── Question Item 3 (Q33)
│   │       └── Question Item 4 (Q34)
│   │
│   └── Main Content
│       ├── QuestionCard
│       │   ├── Question Header
│       │   │   ├── Title
│       │   │   └── Badge (Q31, Q32, etc.)
│       │   │
│       │   ├── Question Intro
│       │   │
│       │   ├── Sections Container
│       │   │   ├── SectionAccordion 1
│       │   │   │   ├── Accordion Header (Clickable)
│       │   │   │   └── Accordion Content (Expandable)
│       │   │   │       ├── Content Text
│       │   │   │       └── CodeBlock (if code exists)
│       │   │   │           ├── Code Header
│       │   │   │           │   ├── Language Label
│       │   │   │           │   └── Copy Button
│       │   │   │           └── Code Content
│       │   │   │
│       │   │   ├── SectionAccordion 2
│       │   │   ├── SectionAccordion 3
│       │   │   └── SectionAccordion N
│       │   │
│       │   └── Question Footer
│       │       └── Progress Text
│       │
│       └── Navigation Buttons
│           ├── Previous Button
│           ├── Question Counter
│           └── Next Button
```

## Data Flow

```
User Interaction
    ↓
App State Updates
    ├── currentQuestionIndex
    ├── expandedSections
    └── searchTerm
    ↓
Components Re-render
    ├── Navigation (filtered questions)
    ├── QuestionCard (current question)
    └── SectionAccordion (expanded state)
    ↓
UI Updates
```

## State Management

### App.tsx State
```typescript
const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
const [searchTerm, setSearchTerm] = useState<string>('');
```

### Props Flow
```
App
├── Navigation
│   ├── questions (filtered)
│   ├── currentIndex
│   ├── onSelectQuestion
│   ├── searchTerm
│   └── onSearchChange
│
└── QuestionCard
    ├── question (current)
    ├── expandedSections
    ├── onToggleSection
    ├── questionNumber
    └── totalQuestions
        └── SectionAccordion (multiple)
            ├── section
            ├── sectionId
            ├── isExpanded
            └── onToggle
                └── CodeBlock (if code exists)
                    ├── code
                    └── language
```

## User Interactions

### 1. Navigation
```
User clicks question in sidebar
    ↓
onSelectQuestion(index) called
    ↓
setCurrentQuestionIndex(index)
    ↓
App re-renders with new question
```

### 2. Search
```
User types in search box
    ↓
onSearchChange(term) called
    ↓
setSearchTerm(term)
    ↓
Navigation filters questions
    ↓
Navigation re-renders with filtered list
```

### 3. Expand Section
```
User clicks section header
    ↓
onToggleSection(sectionId) called
    ↓
setExpandedSections (add/remove sectionId)
    ↓
SectionAccordion re-renders
    ↓
Content expands/collapses with animation
```

### 4. Copy Code
```
User clicks copy button
    ↓
handleCopy() called
    ↓
navigator.clipboard.writeText(code)
    ↓
Button shows "Copied!" for 2 seconds
    ↓
Button reverts to "Copy"
```

### 5. Navigate Questions
```
User clicks Previous/Next button
    ↓
handlePreviousQuestion() or handleNextQuestion()
    ↓
setCurrentQuestionIndex(newIndex)
    ↓
setExpandedSections(new Set()) // Reset expanded sections
    ↓
App re-renders with new question
```

## Styling Architecture

### CSS Variables (App.css)
```css
:root {
  --primary-color: #3b82f6;
  --primary-dark: #1e40af;
  --secondary-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --bg-light: #f9fafb;
  --bg-white: #ffffff;
  --text-dark: #1f2937;
  --text-gray: #6b7280;
  --border-color: #e5e7eb;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Component Styles
```
App.css
├── Global styles
├── Header styles
├── Container layout
└── Button styles

Navigation.css
├── Sidebar layout
├── Search input
├── Question list
└── Question items

QuestionCard.css
├── Card container
├── Header styles
├── Badge styles
├── Intro styles
└── Footer styles

SectionAccordion.css
├── Accordion item
├── Header (clickable)
├── Content (expandable)
└── Animations

CodeBlock.css
├── Code container
├── Header with language
├── Copy button
├── Code content
└── Scrollbar styling
```

## Responsive Design

### Desktop (> 768px)
```
┌─────────────────────────────────────┐
│          Header                     │
├──────────────┬──────────────────────┤
│              │                      │
│  Sidebar     │   Main Content       │
│  (300px)     │   (Flex: 1)          │
│              │                      │
│              │   - Question Card    │
│              │   - Navigation Btns  │
│              │                      │
└──────────────┴──────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────────────┐
│      Header              │
├──────────────────────────┤
│  Sidebar (Horizontal)    │
│  [Q31] [Q32] [Q33] [Q34] │
├──────────────────────────┤
│                          │
│   Main Content           │
│   - Question Card        │
│   - Navigation Btns      │
│                          │
└──────────────────────────┘
```

## Performance Optimizations

1. **Lazy Rendering**: Sections only render when expanded
2. **Memoization**: Components use React.memo where appropriate
3. **CSS Animations**: Used instead of JavaScript
4. **Efficient State**: Only necessary state is managed
5. **Event Delegation**: Minimal event listeners

## Accessibility Features

1. **Semantic HTML**: Proper heading hierarchy
2. **ARIA Labels**: aria-expanded, aria-controls, aria-hidden
3. **Keyboard Navigation**: Tab through elements
4. **Color Contrast**: WCAG AA compliant
5. **Focus States**: Visible focus indicators
6. **Screen Reader Support**: Proper labels and descriptions

## Type Safety

### TypeScript Interfaces
```typescript
interface Question {
  id: number;
  title: string;
  content: string;
  sections: Section[];
}

interface Section {
  heading: string;
  content: string;
  code?: string;
  codeLanguage?: string;
}

interface QuestionCardProps {
  question: Question;
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
  questionNumber: number;
  totalQuestions: number;
}
```

## Future Enhancements

1. **Bookmarking**: Save favorite questions
2. **Notes**: Add personal notes to questions
3. **Quiz Mode**: Test knowledge with MCQs
4. **Dark Mode**: Toggle dark/light theme
5. **Export**: Download questions as PDF
6. **Sharing**: Share specific questions
7. **Analytics**: Track learning progress
8. **Offline Support**: PWA capabilities

