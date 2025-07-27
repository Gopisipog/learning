import React from 'react';
import SystemDesignConcepts from '../SystemDesignConcepts';

// Microfrontend wrapper for SystemDesignConcepts
const SystemDesignMicrofrontend = (props) => {
  return (
    <div className="microfrontend-container" data-microfrontend="system-design">
      <div className="microfrontend-header">
        <span className="microfrontend-badge">🏗️ Microfrontend</span>
        <h2>System Design Module</h2>
      </div>
      <SystemDesignConcepts {...props} />
    </div>
  );
};

// Export metadata for the microfrontend
export const metadata = {
  name: 'system-design',
  version: '1.0.0',
  description: 'System design concepts and architectural patterns learning module',
  author: 'Learning Platform',
  dependencies: ['react', 'react-dom'],
  routes: ['/system-design'],
  capabilities: [
    'system-architecture',
    'design-patterns',
    'scalability-concepts',
    'best-practices'
  ],
  tags: ['system-design', 'architecture', 'scalability', 'patterns']
};

export default SystemDesignMicrofrontend;
