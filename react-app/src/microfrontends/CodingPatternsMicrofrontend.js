import React from 'react';
import CodingPatternsGuide from '../CodingPatternsGuide';

// Microfrontend wrapper for CodingPatternsGuide
const CodingPatternsMicrofrontend = (props) => {
  return (
    <div className="microfrontend-container" data-microfrontend="coding-patterns">
      <div className="microfrontend-header">
        <span className="microfrontend-badge">🎯 Microfrontend</span>
        <h2>Coding Patterns Module</h2>
      </div>
      <CodingPatternsGuide {...props} />
    </div>
  );
};

// Export metadata for the microfrontend
export const metadata = {
  name: 'coding-patterns',
  version: '1.0.0',
  description: 'Coding patterns and algorithms for technical interviews learning module',
  author: 'Learning Platform',
  dependencies: ['react', 'react-dom'],
  routes: ['/patterns'],
  capabilities: [
    'algorithm-patterns',
    'interview-preparation',
    'code-examples',
    'interactive-demos'
  ],
  tags: ['algorithms', 'patterns', 'interviews', 'coding']
};

export default CodingPatternsMicrofrontend;
