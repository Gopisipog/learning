# React Interview Questions App - Quick Reference

## 🚀 Getting Started (30 seconds)

```bash
# 1. Install dependencies
npm install

# 2. Start the app
npm start

# 3. Open browser
# App opens at http://localhost:3000
```

## 📋 What's Included

| Question | Topic | Sections |
|----------|-------|----------|
| Q31 | Babel | Role, Transpilation, Config, Presets, Plugins, Build Tools |
| Q32 | Fragment | Problem, Solution, Syntax, Key, Use Cases, Benefits |
| Q33 | Spread Operator | Props, Arrays, Objects, Conditional, Destructuring, Patterns |
| Q34 | Conditional Rendering | If/Else, Ternary, &&, Switch, Advanced, Best Practices |

## 🎯 Key Features

- ✅ Interactive accordion sections
- ✅ Syntax-highlighted code blocks
- ✅ Copy-to-clipboard for code
- ✅ Search functionality
- ✅ Responsive design
- ✅ Beautiful UI with animations
- ✅ TypeScript type safety

## 📁 Important Files

```
src/
├── App.tsx              # Main component
├── components/
│   ├── QuestionCard.tsx
│   ├── SectionAccordion.tsx
│   ├── CodeBlock.tsx
│   └── Navigation.tsx
├── data/
│   └── questions.ts     # All questions data
└── styles/              # Component styles
```

## 🎨 Customization Quick Tips

### Change Primary Color
Edit `src/App.css`:
```css
:root {
  --primary-color: #3b82f6;  /* Change this */
}
```

### Add New Question
Edit `src/data/questions.ts`:
```typescript
{
  id: 35,
  title: 'Q35. Your Question',
  content: 'Introduction',
  sections: [
    {
      heading: 'Section Title',
      content: 'Content here',
      code: 'code example',
      codeLanguage: 'javascript'
    }
  ]
}
```

### Change Font
Edit `src/index.css`:
```css
body {
  font-family: 'Your Font', sans-serif;
}
```

## 🔧 Common Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `PORT=3001 npm start` |
| Dependencies error | `npm cache clean --force && npm install` |
| TypeScript errors | Check imports and type definitions |
| Styles not loading | Clear browser cache (Ctrl+Shift+Delete) |

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (Sidebar + Content)
- **Mobile**: < 768px (Stacked layout)

## 🎓 Question Structure

Each question has:
1. **Title** - Question number and topic
2. **Content** - Brief introduction
3. **Sections** - Expandable sections with:
   - Heading
   - Content text
   - Code examples (optional)
   - Language indicator

## 🔍 Search Tips

- Search by question number (e.g., "Q31")
- Search by topic (e.g., "Babel", "Fragment")
- Search by keywords (e.g., "JSX", "props")

## 💡 Usage Tips

1. **Expand All**: Click each section header to expand
2. **Copy Code**: Click "Copy" button on code blocks
3. **Navigate**: Use Previous/Next buttons or sidebar
4. **Search**: Use search box to filter questions
5. **Track Progress**: Check question counter

## 🎨 UI Components

### Buttons
- **Primary**: Blue background (Next, Copy)
- **Secondary**: White background (Previous)
- **Disabled**: 50% opacity

### Colors
- **Primary**: #3b82f6 (Blue)
- **Success**: #10b981 (Green)
- **Error**: #ef4444 (Red)
- **Warning**: #f59e0b (Orange)

### Spacing
- Small: 0.5rem
- Medium: 1rem
- Large: 1.5rem
- Extra Large: 2rem

## 📊 Performance

- Lazy rendering of sections
- Efficient state management
- CSS animations (not JS)
- Minimal re-renders
- Fast load time

## ♿ Accessibility

- Keyboard navigation
- ARIA labels
- High contrast
- Readable fonts
- Focus indicators

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📚 Documentation

- **README.md** - Full documentation
- **SETUP_GUIDE.md** - Installation guide
- **APP_ARCHITECTURE.md** - Component structure
- **PROJECT_SUMMARY.md** - Project overview
- **QUICK_REFERENCE.md** - This file

## 🚀 Production Build

```bash
npm run build
```

Creates optimized build in `build/` folder.

## 🔗 File Locations

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main component |
| `src/data/questions.ts` | Questions data |
| `src/components/` | React components |
| `src/styles/` | Component styles |
| `public/index.html` | HTML entry point |
| `package.json` | Dependencies |
| `tsconfig.json` | TypeScript config |

## 💻 Development Workflow

1. Edit files in `src/`
2. Changes auto-reload in browser
3. Check console for errors
4. Use React DevTools for debugging
5. Build when ready: `npm run build`

## 🎯 Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm start`
3. ✅ Explore the app
4. ✅ Read the questions
5. ✅ Customize as needed
6. ✅ Deploy when ready

## 📞 Support

- Check README.md for detailed info
- Review component code
- Check browser console for errors
- Verify all dependencies installed

## 🎉 You're All Set!

The app is ready to use. Start learning React interview questions now! 🚀

---

**Questions? Check the documentation files or review the component code.**

