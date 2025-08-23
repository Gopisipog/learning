import microfrontendRegistry from './MicrofrontendRegistry';

// Microfrontend configurations
import CloudDevOpsEngineeringLearning from './CloudDevOpsEngineeringLearning';

const microfrontendConfigs = [
  {
    name: 'dotnet-interfaces',
    importFunction: () => import('./DotNetInterfacesMicrofrontend'),
    config: {
      preload: false,
      fallback: (
        <div className="loading-microfrontend">
          <div className="loading-spinner"></div>
          <p>Loading .NET Interfaces Module...</p>
        </div>
      ),
      errorBoundary: true
    }
  },
  {
    name: 'relationship-normalization',
    importFunction: () => import('./RelationshipNormalizationMicrofrontend'),
    config: {
      preload: false,
      fallback: (
        <div className="loading-microfrontend">
          <div className="loading-spinner"></div>
          <p>Loading Relationship & Normalization Module...</p>
        </div>
      ),
      errorBoundary: true
    }
  },
  {
    name: 'dotnet-concepts',
    importFunction: () => import('./DotNetConceptsMicrofrontend'),
    config: {
      preload: false,
      fallback: (
        <div className="loading-microfrontend">
          <div className="loading-spinner"></div>
          <p>Loading .NET Core Concepts Module...</p>
        </div>
      ),
      errorBoundary: true
    }
  },
  {
    name: 'system-design',
    importFunction: () => import('./SystemDesignMicrofrontend'),
    config: {
      preload: false,
      fallback: (
        <div className="loading-microfrontend">
          <div className="loading-spinner"></div>
          <p>Loading System Design Module...</p>
        </div>
      ),
      errorBoundary: true
    }
  },
  {
    name: 'building-blocks',
    importFunction: () => import('./BuildingBlocksMicrofrontend'),
    config: {
      preload: false,
      fallback: (
        <div className="loading-microfrontend">
          <div className="loading-spinner"></div>
          <p>Loading Building Blocks Module...</p>
        </div>
      ),
      errorBoundary: true
    }
  },
  {
    name: 'coding-patterns',
    importFunction: () => import('./CodingPatternsMicrofrontend'),
    config: {
      preload: false,
      fallback: (
        <div className="loading-microfrontend">
          <div className="loading-spinner"></div>
          <p>Loading Coding Patterns Module...</p>
        </div>
      ),
      errorBoundary: true
    }
  },
  {
    name: 'distributed-systems-patterns',
    importFunction: () => import('./DistributedSystemsPatternsMicrofrontend'),
    config: {
      preload: false,
      fallback: (
        <div className="loading-microfrontend">
          <div className="loading-spinner"></div>
          <p>Loading Distributed Systems Patterns Module...</p>
        </div>
      ),
      errorBoundary: true
    }
  },
  // Inline microfrontend (no code-splitting) for quick learning component
  {
    name: 'delegates-events-extensions',
    importFunction: () => import('./DelegatesEventsExtensionsMicrofrontend'),
    config: {
      preload: false,
      fallback: (
        <div className="loading-microfrontend">
          <div className="loading-spinner"></div>
          <p>Loading Delegates, Events & Extensions Module...</p>
        </div>
      ),
      errorBoundary: true
    }
  },
  {
    name: 'cloud-devops-engineering',
    importFunction: async () => ({ default: CloudDevOpsEngineeringLearning }),
    config: {
      preload: false,
      fallback: (
        <div className="loading-microfrontend">
          <div className="loading-spinner"></div>
          <p>Loading Cloud & DevOps Engineering Module...</p>
        </div>
      ),
      errorBoundary: true
    }
  }
];

// Register all microfrontends
export const registerMicrofrontends = () => {
  microfrontendConfigs.forEach(({ name, importFunction, config }) => {
    microfrontendRegistry.register(name, importFunction, config);
  });

  console.log('🚀 Microfrontends registered:', microfrontendRegistry.getAll());
};

// Get microfrontend component by name
export const getMicrofrontend = (name) => {
  return microfrontendRegistry.get(name);
};

// Preload specific microfrontends
export const preloadMicrofrontends = (names = []) => {
  names.forEach(name => {
    microfrontendRegistry.preload(name);
  });
};

// Get all available microfrontends
export const getAvailableMicrofrontends = () => {
  return microfrontendRegistry.getAll();
};

// Microfrontend route mapping
export const microfrontendRoutes = {
  '/dotnet-interfaces': 'dotnet-interfaces',
  '/relationships': 'relationship-normalization',
  '/dotnet-core-concepts': 'dotnet-concepts',
  '/system-design': 'system-design',
  '/dotnet-core-building-blocks': 'building-blocks',
  '/patterns': 'coding-patterns',
  '/distributed-patterns': 'distributed-systems-patterns',
  '/delegates-events-extensions': 'delegates-events-extensions',
  '/cloud-devops-engineering': 'cloud-devops-engineering'
};

// Get microfrontend name by route
export const getMicrofrontendByRoute = (route) => {
  return microfrontendRoutes[route];
};

export default microfrontendRegistry;
