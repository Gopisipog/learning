import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MainPage from './MainPage';
import History from './History';
import CQRSPattern from './CQRSPattern';
import CodingPatternsGuide from './CodingPatternsGuide';
import EducationalCoverage from './EducationalCoverage';
import TwoPointersPattern from './patterns/TwoPointersPattern';
import SlidingWindowPattern from './patterns/SlidingWindowPattern';
import BinarySearchPattern from './patterns/BinarySearchPattern';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/history">Today's History</Link>
            </li>
            <li>
              <Link to="/cqrs">CQRS Pattern</Link>
            </li>
            <li>
              <Link to="/patterns">Coding Patterns</Link>
            </li>
            <li>
              <Link to="/educational-coverage">C# Learning Materials</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/history" element={<History />} />
          <Route path="/cqrs" element={<CQRSPattern />} />
          <Route path="/patterns" element={<CodingPatternsGuide />} />
          <Route path="/educational-coverage" element={<EducationalCoverage />} />
          <Route path="/patterns/two-pointers" element={<TwoPointersPattern />} />
          <Route path="/patterns/sliding-window" element={<SlidingWindowPattern />} />
          <Route path="/patterns/binary-search" element={<BinarySearchPattern />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
