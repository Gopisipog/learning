import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMicrofrontend, getMicrofrontendByRoute, preloadMicrofrontends } from './microfrontendConfig';
import './microfrontend.css';

// Microfrontend Router Component
const MicrofrontendRouter = ({ route, ...props }) => {
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState(route || location.pathname);
  const [microfrontendComponent, setMicrofrontendComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const routeToUse = route || location.pathname;
    setCurrentRoute(routeToUse);
    
    const microfrontendName = getMicrofrontendByRoute(routeToUse);
    
    if (microfrontendName) {
      try {
        setIsLoading(true);
        setError(null);
        
        const MicrofrontendComponent = getMicrofrontend(microfrontendName);
        
        if (MicrofrontendComponent) {
          setMicrofrontendComponent(() => MicrofrontendComponent);
        } else {
          setError(`Microfrontend '${microfrontendName}' not found for route '${routeToUse}'`);
        }
      } catch (err) {
        setError(`Failed to load microfrontend for route '${routeToUse}': ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError(`No microfrontend registered for route '${routeToUse}'`);
      setIsLoading(false);
    }
  }, [route, location.pathname]);

  // Preload next likely microfrontends based on current route
  useEffect(() => {
    const preloadCandidates = getPreloadCandidates(currentRoute);
    if (preloadCandidates.length > 0) {
      preloadMicrofrontends(preloadCandidates);
    }
  }, [currentRoute]);

  if (isLoading) {
    return (
      <div className="microfrontend-router-loading">
        <div className="loading-spinner"></div>
        <p>Loading microfrontend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="microfrontend-router-error">
        <h3>⚠️ Microfrontend Loading Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (!microfrontendComponent) {
    return (
      <div className="microfrontend-router-not-found">
        <h3>🔍 Microfrontend Not Found</h3>
        <p>No microfrontend available for route: <code>{currentRoute}</code></p>
      </div>
    );
  }

  const MicrofrontendComponent = microfrontendComponent;
  
  return (
    <div className="microfrontend-router">
      <MicrofrontendComponent {...props} />
    </div>
  );
};

// Helper function to determine which microfrontends to preload
const getPreloadCandidates = (currentRoute) => {
  const preloadMap = {
    '/dotnet-interfaces': ['dotnet-concepts', 'building-blocks'],
    '/dotnet-core-concepts': ['dotnet-interfaces', 'building-blocks'],
    '/dotnet-core-building-blocks': ['dotnet-concepts', 'dotnet-interfaces'],
    '/relationships': ['system-design'],
    '/system-design': ['relationships'],
    '/patterns': ['dotnet-concepts']
  };
  
  return preloadMap[currentRoute] || [];
};

// HOC for wrapping components with microfrontend routing
export const withMicrofrontendRouter = (WrappedComponent) => {
  return (props) => {
    return (
      <MicrofrontendRouter {...props}>
        <WrappedComponent {...props} />
      </MicrofrontendRouter>
    );
  };
};

// Hook for accessing microfrontend context
export const useMicrofrontend = () => {
  const location = useLocation();
  const currentMicrofrontend = getMicrofrontendByRoute(location.pathname);
  
  return {
    currentMicrofrontend,
    route: location.pathname,
    isInMicrofrontend: !!currentMicrofrontend
  };
};

export default MicrofrontendRouter;
