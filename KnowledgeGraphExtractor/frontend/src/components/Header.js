import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RotateCcw, BookOpen, Upload, Puzzle, Hash, Network } from 'lucide-react';

const Header = ({ onReset }) => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-left">
        <h1>📊 Knowledge Graph Extractor</h1>
        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Upload size={16} />
            PDF Extractor
          </Link>
          <Link
            to="/data-intensive-apps"
            className={`nav-link ${location.pathname === '/data-intensive-apps' ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            Chapter 1: Reliability, Scalability, Maintainability
          </Link>
          <Link
            to="/data-models"
            className={`nav-link ${location.pathname === '/data-models' ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            Chapter 2: Data Models & Query Languages
          </Link>
          <Link
            to="/holub-patterns"
            className={`nav-link ${location.pathname === '/holub-patterns' ? 'active' : ''}`}
          >
            <Puzzle size={16} />
            Holub Design Patterns
          </Link>
          <Link
            to="/csharp-learning"
            className={`nav-link ${location.pathname === '/csharp-learning' ? 'active' : ''}`}
          >
            <Hash size={16} />
            C# Learning Environment
          </Link>
          <Link
            to="/software-architecture"
            className={`nav-link ${location.pathname === '/software-architecture' ? 'active' : ''}`}
          >
            <Network size={16} />
            Software Architecture
          </Link>
        </nav>
      </div>

      {location.pathname === '/' && (
        <button className="reset-btn" onClick={onReset}>
          <RotateCcw size={16} style={{ marginRight: '0.5rem' }} />
          New Analysis
        </button>
      )}
    </header>
  );
};

export default Header;
