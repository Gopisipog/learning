import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RotateCcw, BookOpen, Upload } from 'lucide-react';

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
