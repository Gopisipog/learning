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
import RelationshipNormalization from './RelationshipNormalization';
import DotNetCoreHomePage from './DotNetCoreHomePage';
import DotNetCoreLearningGuide from './DotNetCoreLearningGuide';
import DotNetCoreBuildingBlocks from './DotNetCoreBuildingBlocks';
import DotNetCoreConcepts from './DotNetCoreConcepts';
import SystemDesignConcepts from './SystemDesignConcepts';
import DotNetInterfaces from './DotNetInterfaces';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">.NET Core 8.0 Learning</Link>
            </li>
            <li>
              <Link to="/guide">Learning Guide</Link>
            </li>
            <li>
              <Link to="/mcqs">MCQs</Link>
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
            <li>
              <Link to="/relationships">Relationships & Normalization</Link>
            </li>
            <li>
              <Link to="/dotnet-core-building-blocks">.NET Core Building Blocks</Link>
            </li>
            <li>
              <Link to="/dotnet-core-concepts">.NET Core Concepts</Link>
            </li>
            <li>
              <Link to="/system-design">System Design Concepts</Link>
            </li>
            <li>
              <Link to="/dotnet-interfaces">.NET Common Interfaces</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<DotNetCoreHomePage />} />
          <Route path="/guide" element={<DotNetCoreLearningGuide />} />
          <Route path="/mcqs" element={<MainPage />} />
          <Route path="/history" element={<History />} />
          <Route path="/cqrs" element={<CQRSPattern />} />
          <Route path="/patterns" element={<CodingPatternsGuide />} />
          <Route path="/educational-coverage" element={<EducationalCoverage />} />
          <Route path="/patterns/two-pointers" element={<TwoPointersPattern />} />
          <Route path="/patterns/sliding-window" element={<SlidingWindowPattern />} />
          <Route path="/patterns/binary-search" element={<BinarySearchPattern />} />
          <Route path="/relationships" element={<RelationshipNormalization />} />
          <Route path="/dotnet-core-building-blocks" element={<DotNetCoreBuildingBlocks />} />
          <Route path="/dotnet-core-concepts" element={<DotNetCoreConcepts />} />
          <Route path="/system-design" element={<SystemDesignConcepts />} />
          <Route path="/dotnet-interfaces" element={<DotNetInterfaces />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
