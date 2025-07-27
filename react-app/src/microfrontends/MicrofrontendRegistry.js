import React, { Suspense, lazy } from 'react';

// Microfrontend Registry - Central registry for all microfrontends
class MicrofrontendRegistry {
  constructor() {
    this.microfrontends = new Map();
    this.loadingStates = new Map();
    this.errorStates = new Map();
  }

  // Register a microfrontend with lazy loading
  register(name, importFunction, config = {}) {
    const LazyComponent = lazy(importFunction);
    
    this.microfrontends.set(name, {
      component: LazyComponent,
      config: {
        fallback: config.fallback || <div>Loading {name}...</div>,
        errorBoundary: config.errorBoundary || true,
        preload: config.preload || false,
        ...config
      }
    });

    // Preload if specified
    if (config.preload) {
      this.preload(name);
    }
  }

  // Get a microfrontend component
  get(name) {
    const microfrontend = this.microfrontends.get(name);
    if (!microfrontend) {
      console.warn(`Microfrontend '${name}' not found`);
      return null;
    }

    const { component: Component, config } = microfrontend;

    // Wrap with Suspense and Error Boundary
    return (props) => (
      <MicrofrontendWrapper
        name={name}
        fallback={config.fallback}
        errorBoundary={config.errorBoundary}
      >
        <Component {...props} />
      </MicrofrontendWrapper>
    );
  }

  // Preload a microfrontend
  async preload(name) {
    if (this.loadingStates.get(name)) {
      return; // Already loading
    }

    const microfrontend = this.microfrontends.get(name);
    if (!microfrontend) {
      console.warn(`Cannot preload microfrontend '${name}' - not registered`);
      return;
    }

    try {
      this.loadingStates.set(name, true);
      // Trigger the lazy import
      await microfrontend.component._payload._result;
      console.log(`Microfrontend '${name}' preloaded successfully`);
    } catch (error) {
      console.error(`Failed to preload microfrontend '${name}':`, error);
      this.errorStates.set(name, error);
    } finally {
      this.loadingStates.set(name, false);
    }
  }

  // Get all registered microfrontends
  getAll() {
    return Array.from(this.microfrontends.keys());
  }

  // Check if a microfrontend is registered
  has(name) {
    return this.microfrontends.has(name);
  }

  // Unregister a microfrontend
  unregister(name) {
    this.microfrontends.delete(name);
    this.loadingStates.delete(name);
    this.errorStates.delete(name);
  }
}

// Error Boundary for microfrontends
class MicrofrontendErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Microfrontend '${this.props.name}' error:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="microfrontend-error">
          <h3>⚠️ Microfrontend Error</h3>
          <p>Failed to load <strong>{this.props.name}</strong></p>
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component for microfrontends
const MicrofrontendWrapper = ({ name, fallback, errorBoundary, children }) => {
  const content = (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );

  if (errorBoundary) {
    return (
      <MicrofrontendErrorBoundary name={name}>
        {content}
      </MicrofrontendErrorBoundary>
    );
  }

  return content;
};

// Create singleton instance
const microfrontendRegistry = new MicrofrontendRegistry();

export default microfrontendRegistry;
