import React from 'react';
import DotNetInterfaces from '../DotNetInterfaces';

// Microfrontend wrapper for DotNetInterfaces
const DotNetInterfacesMicrofrontend = (props) => {
  return (
    <div className="microfrontend-container" data-microfrontend="dotnet-interfaces">
      <div className="microfrontend-header">
        <span className="microfrontend-badge">🔌 Microfrontend</span>
        <h2>DotNet Interfaces Module</h2>
      </div>
      <DotNetInterfaces {...props} />
    </div>
  );
};

// Export metadata for the microfrontend
export const metadata = {
  name: 'dotnet-interfaces',
  version: '1.0.0',
  description: 'Comprehensive .NET interfaces learning module',
  author: 'Learning Platform',
  dependencies: ['react', 'react-dom'],
  routes: ['/dotnet-interfaces'],
  capabilities: [
    'interface-learning',
    'code-examples',
    'problem-solution-format',
    'interactive-exploration'
  ],
  tags: ['dotnet', 'interfaces', 'programming', 'education']
};

export default DotNetInterfacesMicrofrontend;
