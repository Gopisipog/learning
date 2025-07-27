import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAvailableMicrofrontends, preloadMicrofrontends, microfrontendRoutes } from './microfrontendConfig';
import microfrontendRegistry from './MicrofrontendRegistry';

// Import metadata from each microfrontend
import { metadata as dotnetInterfacesMetadata } from './DotNetInterfacesMicrofrontend';
import { metadata as relationshipNormalizationMetadata } from './RelationshipNormalizationMicrofrontend';
import { metadata as dotnetConceptsMetadata } from './DotNetConceptsMicrofrontend';
import { metadata as systemDesignMetadata } from './SystemDesignMicrofrontend';
import { metadata as buildingBlocksMetadata } from './BuildingBlocksMicrofrontend';
import { metadata as codingPatternsMetadata } from './CodingPatternsMicrofrontend';
import { metadata as distributedSystemsPatternsMetadata } from './DistributedSystemsPatternsMicrofrontend';

const MicrofrontendDashboard = () => {
  const [microfrontends, setMicrofrontends] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [preloadingAll, setPreloadingAll] = useState(false);

  // Metadata mapping
  const metadataMap = {
    'dotnet-interfaces': dotnetInterfacesMetadata,
    'relationship-normalization': relationshipNormalizationMetadata,
    'dotnet-concepts': dotnetConceptsMetadata,
    'system-design': systemDesignMetadata,
    'building-blocks': buildingBlocksMetadata,
    'coding-patterns': codingPatternsMetadata,
    'distributed-systems-patterns': distributedSystemsPatternsMetadata
  };

  useEffect(() => {
    const availableMicrofrontends = getAvailableMicrofrontends();
    const microfrontendData = availableMicrofrontends.map(name => ({
      name,
      metadata: metadataMap[name] || { name, description: 'No metadata available' },
      route: Object.keys(microfrontendRoutes).find(route => microfrontendRoutes[route] === name),
      status: 'ready'
    }));
    
    setMicrofrontends(microfrontendData);
  }, []);

  const handlePreload = async (microfrontendName) => {
    setLoadingStates(prev => ({ ...prev, [microfrontendName]: true }));
    
    try {
      await microfrontendRegistry.preload(microfrontendName);
      console.log(`✅ Preloaded: ${microfrontendName}`);
    } catch (error) {
      console.error(`❌ Failed to preload: ${microfrontendName}`, error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [microfrontendName]: false }));
    }
  };

  const handlePreloadAll = async () => {
    setPreloadingAll(true);
    const microfrontendNames = microfrontends.map(mf => mf.name);
    
    try {
      await Promise.all(microfrontendNames.map(name => microfrontendRegistry.preload(name)));
      console.log('✅ All microfrontends preloaded');
    } catch (error) {
      console.error('❌ Failed to preload all microfrontends', error);
    } finally {
      setPreloadingAll(false);
    }
  };

  const getStatusIcon = (microfrontend) => {
    if (loadingStates[microfrontend.name]) return '⏳';
    return '✅';
  };

  const getCapabilityIcon = (capability) => {
    const iconMap = {
      'interface-learning': '🔌',
      'code-examples': '💻',
      'problem-solution-format': '❓',
      'interactive-exploration': '🔍',
      'relationship-patterns': '🔗',
      'normalization-techniques': '📊',
      'contextual-prompts': '💡',
      'educational-content': '📚',
      'core-concepts': '⚙️',
      'language-features': '🔧',
      'interactive-learning': '🎯',
      'system-architecture': '🏗️',
      'design-patterns': '🎨',
      'scalability-concepts': '📈',
      'best-practices': '⭐',
      'project-structure': '🧱',
      'building-blocks': '🔨',
      'modern-practices': '🚀',
      'development-workflow': '⚡',
      'algorithm-patterns': '🧮',
      'interview-preparation': '🎯',
      'interactive-demos': '🎮'
    };
    
    return iconMap[capability] || '🔹';
  };

  return (
    <div className="microfrontend-dashboard">
      <div className="dashboard-header">
        <h1>🚀 Microfrontend Architecture Dashboard</h1>
        <p className="dashboard-subtitle">
          Manage and monitor all microfrontends in the learning platform
        </p>
        
        <div className="dashboard-actions">
          <button 
            onClick={handlePreloadAll}
            disabled={preloadingAll}
            className="preload-all-btn"
          >
            {preloadingAll ? '⏳ Preloading All...' : '🚀 Preload All Microfrontends'}
          </button>
        </div>
      </div>

      <div className="microfrontend-grid">
        {microfrontends.map(microfrontend => (
          <div key={microfrontend.name} className="microfrontend-card">
            <div className="card-header">
              <div className="card-title">
                <span className="status-icon">{getStatusIcon(microfrontend)}</span>
                <h3>{microfrontend.metadata.name}</h3>
                <span className="version-badge">v{microfrontend.metadata.version}</span>
              </div>
              <div className="card-actions">
                <button 
                  onClick={() => handlePreload(microfrontend.name)}
                  disabled={loadingStates[microfrontend.name]}
                  className="preload-btn"
                >
                  {loadingStates[microfrontend.name] ? '⏳' : '🔄'}
                </button>
              </div>
            </div>

            <div className="card-content">
              <p className="description">{microfrontend.metadata.description}</p>
              
              <div className="metadata-section">
                <h4>📍 Route</h4>
                <Link to={microfrontend.route} className="route-link">
                  {microfrontend.route}
                </Link>
              </div>

              <div className="metadata-section">
                <h4>🎯 Capabilities</h4>
                <div className="capabilities-list">
                  {microfrontend.metadata.capabilities?.map(capability => (
                    <span key={capability} className="capability-tag">
                      {getCapabilityIcon(capability)} {capability}
                    </span>
                  ))}
                </div>
              </div>

              <div className="metadata-section">
                <h4>🏷️ Tags</h4>
                <div className="tags-list">
                  {microfrontend.metadata.tags?.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="metadata-section">
                <h4>📦 Dependencies</h4>
                <div className="dependencies-list">
                  {microfrontend.metadata.dependencies?.map(dep => (
                    <span key={dep} className="dependency">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="card-footer">
              <Link to={microfrontend.route} className="launch-btn">
                🚀 Launch Microfrontend
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>📊 Statistics</h3>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-value">{microfrontends.length}</span>
              <span className="stat-label">Total Microfrontends</span>
            </div>
            <div className="stat">
              <span className="stat-value">{Object.keys(microfrontendRoutes).length}</span>
              <span className="stat-label">Active Routes</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {microfrontends.reduce((acc, mf) => acc + (mf.metadata.capabilities?.length || 0), 0)}
              </span>
              <span className="stat-label">Total Capabilities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicrofrontendDashboard;
