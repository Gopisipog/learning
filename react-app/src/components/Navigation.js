import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const navigationItems = [
    {
      id: 'home',
      title: '🏠 Home',
      path: '/',
      type: 'link'
    },
    {
      id: 'learning',
      title: '📚 Learning Hub',
      type: 'dropdown',
      items: [
        { path: '/guide', title: '📖 Learning Guide', description: 'Comprehensive learning roadmap' },
        { path: '/microfrontends', title: '🚀 Microfrontend Dashboard', description: 'Manage all learning modules' },
        { path: '/mcqs', title: '❓ MCQs', description: 'Multiple choice questions' },
        { path: '/history', title: '📅 Today\'s History', description: 'Daily learning history' }
      ]
    },
    {
      id: 'dotnet',
      title: '⚙️ .NET Core',
      type: 'dropdown',
      items: [
        { path: '/dotnet-core-concepts', title: '⚙️ Core Concepts', description: 'Fundamental .NET concepts', badge: 'Microfrontend' },
        { path: '/dotnet-core-building-blocks', title: '🧱 Building Blocks', description: 'Modern .NET architecture', badge: 'Microfrontend' },
        { path: '/dotnet-interfaces', title: '🔌 Common Interfaces', description: 'Essential .NET interfaces', badge: 'Microfrontend' }
      ]
    },
    {
      id: 'patterns',
      title: '🎯 Patterns & Design',
      type: 'dropdown',
      items: [
        { path: '/patterns', title: '🎯 Coding Patterns', description: 'Algorithm patterns for interviews', badge: 'Microfrontend' },
        { path: '/distributed-patterns', title: '🏗️ Distributed Systems', description: 'Distributed architecture patterns', badge: 'Microfrontend' },
        { path: '/relationships', title: '🔗 DB Relationships', description: 'Database design patterns', badge: 'Microfrontend' },
        { path: '/cqrs', title: '📋 CQRS Pattern', description: 'Command Query Responsibility Segregation' }
      ]
    },
    {
      id: 'architecture',
      title: '🏗️ Architecture',
      type: 'dropdown',
      items: [
        { path: '/system-design', title: '🏗️ System Design', description: 'Scalable system architecture', badge: 'Microfrontend' },
        { path: '/educational-coverage', title: '📚 C# Materials', description: 'Comprehensive C# resources' }
      ]
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const hasActiveChild = (items) => {
    return items.some(item => isActiveRoute(item.path));
  };

  return (
    <nav className="modern-navigation">
      <div className="nav-container">
        {/* Logo/Brand */}
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <div className="brand-icon">🎓</div>
            <div className="brand-text">
              <span className="brand-title">Learning Platform</span>
              <span className="brand-subtitle">Microfrontend Architecture</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-menu desktop-menu">
          {navigationItems.map(item => (
            <div key={item.id} className="nav-item">
              {item.type === 'link' ? (
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                >
                  {item.title}
                </Link>
              ) : (
                <div className="nav-dropdown">
                  <button 
                    className={`nav-dropdown-toggle ${hasActiveChild(item.items) ? 'active' : ''}`}
                    onClick={() => toggleDropdown(item.id)}
                  >
                    {item.title}
                    <span className={`dropdown-arrow ${activeDropdown === item.id ? 'open' : ''}`}>
                      ▼
                    </span>
                  </button>
                  
                  <div className={`nav-dropdown-menu ${activeDropdown === item.id ? 'open' : ''}`}>
                    <div className="dropdown-header">
                      <h3>{item.title}</h3>
                    </div>
                    <div className="dropdown-items">
                      {item.items.map(subItem => (
                        <Link 
                          key={subItem.path}
                          to={subItem.path} 
                          className={`dropdown-item ${isActiveRoute(subItem.path) ? 'active' : ''}`}
                        >
                          <div className="dropdown-item-content">
                            <div className="dropdown-item-header">
                              <span className="dropdown-item-title">{subItem.title}</span>
                              {subItem.badge && (
                                <span className="dropdown-item-badge">{subItem.badge}</span>
                              )}
                            </div>
                            <span className="dropdown-item-description">{subItem.description}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {navigationItems.map(item => (
            <div key={item.id} className="mobile-nav-item">
              {item.type === 'link' ? (
                <Link 
                  to={item.path} 
                  className={`mobile-nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ) : (
                <div className="mobile-nav-dropdown">
                  <button 
                    className={`mobile-dropdown-toggle ${hasActiveChild(item.items) ? 'active' : ''}`}
                    onClick={() => toggleDropdown(item.id)}
                  >
                    {item.title}
                    <span className={`dropdown-arrow ${activeDropdown === item.id ? 'open' : ''}`}>
                      ▼
                    </span>
                  </button>
                  
                  <div className={`mobile-dropdown-menu ${activeDropdown === item.id ? 'open' : ''}`}>
                    {item.items.map(subItem => (
                      <Link 
                        key={subItem.path}
                        to={subItem.path} 
                        className={`mobile-dropdown-item ${isActiveRoute(subItem.path) ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="mobile-dropdown-content">
                          <div className="mobile-dropdown-header">
                            <span className="mobile-dropdown-title">{subItem.title}</span>
                            {subItem.badge && (
                              <span className="mobile-dropdown-badge">{subItem.badge}</span>
                            )}
                          </div>
                          <span className="mobile-dropdown-description">{subItem.description}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navigation;
