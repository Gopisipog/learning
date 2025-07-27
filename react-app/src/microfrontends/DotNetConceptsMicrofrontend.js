import React from 'react';
import DotNetCoreConcepts from '../DotNetCoreConcepts';

// Microfrontend wrapper for DotNetCoreConcepts
const DotNetConceptsMicrofrontend = (props) => {
  return (
    <div className="microfrontend-container" data-microfrontend="dotnet-concepts">
      <div className="microfrontend-header">
        <span className="microfrontend-badge">⚙️ Microfrontend</span>
        <h2>DotNet Core Concepts Module</h2>
      </div>
      <DotNetCoreConcepts {...props} />
    </div>
  );
};

// Export metadata for the microfrontend
export const metadata = {
  name: 'dotnet-concepts',
  version: '1.0.0',
  description: 'Fundamental .NET Core concepts and language features learning module',
  author: 'Learning Platform',
  dependencies: ['react', 'react-dom'],
  routes: ['/dotnet-core-concepts'],
  capabilities: [
    'core-concepts',
    'language-features',
    'interactive-learning',
    'code-examples'
  ],
  tags: ['dotnet', 'core-concepts', 'programming', 'fundamentals']
};

export default DotNetConceptsMicrofrontend;
