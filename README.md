# React Interview Questions (31-40) - Interactive Learning App

A beautifully designed React application that presents React interview questions (31-40) on JSX and Advanced Concepts in an interactive, easy-to-navigate format.

## Features

✨ **Interactive Learning**
- Accordion-based sections for each question
- Expandable/collapsible content
- Syntax-highlighted code blocks
- Copy-to-clipboard functionality for code snippets

🎨 **Modern UI Design**
- Responsive design (desktop, tablet, mobile)
- Beautiful gradient headers
- Smooth animations and transitions
- Dark-themed code blocks
- Professional color scheme

🔍 **Navigation & Search**
- Sidebar navigation with all questions
- Search functionality to filter questions
- Previous/Next buttons for easy navigation
- Question counter
- Active question highlighting

📱 **Responsive Layout**
- Desktop: Sidebar + Main content
- Mobile: Stacked layout with horizontal question list
- Optimized for all screen sizes

## Questions Covered

- **Q31**: What is Babel?
- **Q32**: What is the role of Fragment in JSX?
- **Q33**: What is Spread Operator in JSX?
- **Q34**: What are the types of Conditional Rendering in JSX?

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm start
```

3. **Open in browser:**
The app will automatically open at `http://localhost:3000`

## Project Structure

```
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── QuestionCard.tsx
│   │   ├── SectionAccordion.tsx
│   │   ├── CodeBlock.tsx
│   │   └── Navigation.tsx
│   ├── data/
│   │   └── questions.ts
│   ├── styles/
│   │   ├── QuestionCard.css
│   │   ├── SectionAccordion.css
│   │   ├── CodeBlock.css
│   │   └── Navigation.css
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── README.md
```

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## Technologies Used

- **React 18.2.0** - UI library
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Styling with CSS variables and flexbox
- **React Scripts** - Build tooling

## Features Breakdown

### 1. Question Card Component
- Displays question title with badge
- Shows question introduction
- Contains expandable sections
- Progress indicator

### 2. Section Accordion
- Expandable/collapsible sections
- Smooth animations
- Syntax-highlighted code blocks
- Formatted text content

### 3. Code Block
- Syntax highlighting
- Copy-to-clipboard button
- Language indicator
- Scrollable for long code
- Dark theme for better readability

### 4. Navigation Sidebar
- List of all questions
- Search functionality
- Active question highlighting
- Responsive design

## Customization

### Adding New Questions

Edit `src/data/questions.ts`:

```typescript
{
  id: 35,
  title: 'Q35. Your Question Here',
  content: 'Brief introduction to the question',
  sections: [
    {
      heading: 'Section Title',
      content: 'Section content here',
      code: 'code snippet',
      codeLanguage: 'javascript'
    }
  ]
}
```

### Changing Colors

Edit CSS variables in `src/App.css`:

```css
:root {
  --primary-color: #3b82f6;
  --primary-dark: #1e40af;
  /* ... other colors ... */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Lazy rendering of sections
- Memoized components
- Efficient state management
- CSS animations instead of JavaScript

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation support
- High contrast colors
- Readable font sizes

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

## Support

For questions or issues, please open an issue on the repository.

---

**Happy Learning! 🚀**

