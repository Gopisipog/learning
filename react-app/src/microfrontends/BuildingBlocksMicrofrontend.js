import React from 'react';
import DotNetCoreBuildingBlocks from '../DotNetCoreBuildingBlocks';

// Microfrontend wrapper for DotNetCoreBuildingBlocks
const BuildingBlocksMicrofrontend = (props) => {
  return (
    <div className="microfrontend-container" data-microfrontend="building-blocks">
      <div className="microfrontend-header">
        <span className="microfrontend-badge">🧱 Microfrontend</span>
        <h2>DotNet Building Blocks Module</h2>
      </div>
      <DotNetCoreBuildingBlocks {...props} />
    </div>
  );
};

// Export metadata for the microfrontend
export const metadata = {
  name: 'building-blocks',
  version: '1.0.0',
  description: 'Modern .NET Core building blocks and project structure learning module',
  author: 'Learning Platform',
  dependencies: ['react', 'react-dom'],
  routes: ['/dotnet-core-building-blocks'],
  capabilities: [
    'project-structure',
    'building-blocks',
    'modern-practices',
    'development-workflow'
  ],
  tags: ['dotnet', 'building-blocks', 'project-structure', 'development']
};

export default BuildingBlocksMicrofrontend;
