import React from 'react';
import RelationshipNormalization from '../RelationshipNormalization';

// Microfrontend wrapper for RelationshipNormalization
const RelationshipNormalizationMicrofrontend = (props) => {
  return (
    <div className="microfrontend-container" data-microfrontend="relationship-normalization">
      <div className="microfrontend-header">
        <span className="microfrontend-badge">🔗 Microfrontend</span>
        <h2>Relationship & Normalization Module</h2>
      </div>
      <RelationshipNormalization {...props} />
    </div>
  );
};

// Export metadata for the microfrontend
export const metadata = {
  name: 'relationship-normalization',
  version: '1.0.0',
  description: 'Software development relationships and database normalization learning module',
  author: 'Learning Platform',
  dependencies: ['react', 'react-dom'],
  routes: ['/relationships'],
  capabilities: [
    'relationship-patterns',
    'normalization-techniques',
    'contextual-prompts',
    'educational-content'
  ],
  tags: ['database', 'relationships', 'normalization', 'software-design']
};

export default RelationshipNormalizationMicrofrontend;
