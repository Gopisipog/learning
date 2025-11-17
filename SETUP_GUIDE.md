# React Interview Questions App - Setup Guide

## Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm start
```

The app will open automatically at `http://localhost:3000`

---

## Project Overview

This is a **React + TypeScript** application that presents React interview questions in an interactive format.

### Key Features:
- ✅ 4 comprehensive interview questions (Q31-Q34)
- ✅ Accordion-based expandable sections
- ✅ Syntax-highlighted code blocks with copy functionality
- ✅ Search functionality to filter questions
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Beautiful UI with smooth animations
- ✅ TypeScript for type safety

---

## File Structure

```
project-root/
├── public/
│   └── index.html                 # HTML entry point
├── src/
│   ├── components/
│   │   ├── QuestionCard.tsx       # Main question display
│   │   ├── SectionAccordion.tsx   # Expandable sections
│   │   ├── CodeBlock.tsx          # Code display with copy
│   │   └── Navigation.tsx         # Sidebar navigation
│   ├── data/
│   │   └── questions.ts           # All questions data
│   ├── styles/
│   │   ├── QuestionCard.css
│   │   ├── SectionAccordion.css
│   │   ├── CodeBlock.css
│   │   └── Navigation.css
│   ├── App.tsx                    # Main app component
│   ├── App.css                    # App styles
│   ├── index.tsx                  # React entry point
│   └── index.css                  # Global styles
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── README.md                      # Project documentation
└── SETUP_GUIDE.md                # This file
```

---

## Component Architecture

### App.tsx (Main Component)
- Manages overall state
- Handles question navigation
- Manages expanded sections
- Implements search functionality

### QuestionCard.tsx
- Displays current question
- Shows question title and badge
- Renders all sections
- Shows progress indicator

### SectionAccordion.tsx
- Expandable/collapsible sections
- Displays section content
- Renders code blocks
- Smooth animations

### CodeBlock.tsx
- Displays code with syntax highlighting
- Copy-to-clipboard button
- Language indicator
- Dark theme styling

### Navigation.tsx
- Sidebar with all questions
- Search input
- Question list
- Active question highlighting

---

## How to Use the App

### 1. Browse Questions
- Use the sidebar to see all questions
- Click any question to jump to it
- Use Previous/Next buttons to navigate

### 2. Search Questions
- Type in the search box to filter questions
- Search works on question titles and content

### 3. Expand Sections
- Click on any section header to expand/collapse
- Multiple sections can be expanded at once
- Smooth animations on expand/collapse

### 4. Copy Code
- Click the "Copy" button on any code block
- Code is copied to clipboard
- Button shows "Copied!" confirmation

### 5. Track Progress
- Question counter shows current position
- Progress indicator at bottom of card

---

## Adding New Questions

To add more questions, edit `src/data/questions.ts`:

```typescript
{
  id: 35,
  title: 'Q35. Your Question Title',
  content: 'Brief introduction to the question',
  sections: [
    {
      heading: 'Section 1 Title',
      content: 'Section content here. Can be multiple paragraphs.',
      code: `// Your code example here
const example = () => {
  return <div>Hello</div>;
};`,
      codeLanguage: 'javascript'
    },
    {
      heading: 'Section 2 Title',
      content: 'More content...',
      code: `// Another code example`,
      codeLanguage: 'typescript'
    }
  ]
}
```

---

## Customizing Styles

### Change Primary Color
Edit `src/App.css`:
```css
:root {
  --primary-color: #3b82f6;      /* Change this */
  --primary-dark: #1e40af;       /* And this */
}
```

### Change Font
Edit `src/index.css`:
```css
body {
  font-family: 'Your Font Name', sans-serif;
}
```

### Adjust Spacing
Edit individual component CSS files to adjust padding/margins.

---

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Use a different port
PORT=3001 npm start
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### TypeScript Errors
- Make sure all imports are correct
- Check that all types are properly defined
- Run `npm run build` to see all errors

---

## Performance Tips

1. **Code Splitting**: Sections are lazy-loaded
2. **Memoization**: Components use React.memo where appropriate
3. **CSS Animations**: Used instead of JavaScript for better performance
4. **Efficient State**: Only necessary state is managed

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Development Tips

### Hot Reload
Changes to files automatically reload the app in development mode.

### React DevTools
Install React DevTools browser extension for debugging.

### TypeScript Checking
TypeScript errors appear in the console and terminal.

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start dev server: `npm start`
3. ✅ Explore the app
4. ✅ Add more questions as needed
5. ✅ Customize colors and styles
6. ✅ Build for production: `npm run build`

---

## Support

For issues or questions:
1. Check the README.md
2. Review the component code
3. Check browser console for errors
4. Verify all dependencies are installed

---

**Happy Learning! 🚀**

