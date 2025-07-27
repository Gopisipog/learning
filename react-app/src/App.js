import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MainPage from './MainPage';
import History from './History';
import CQRSPattern from './CQRSPattern';
import EducationalCoverage from './EducationalCoverage';
import TwoPointersPattern from './patterns/TwoPointersPattern';
import SlidingWindowPattern from './patterns/SlidingWindowPattern';
import BinarySearchPattern from './patterns/BinarySearchPattern';
import DotNetCoreHomePage from './DotNetCoreHomePage';
import DotNetCoreLearningGuide from './DotNetCoreLearningGuide';

// Microfrontend imports
import MicrofrontendRouter from './microfrontends/MicrofrontendRouter';
import MicrofrontendDashboard from './microfrontends/MicrofrontendDashboard';
import { registerMicrofrontends, getAvailableMicrofrontends } from './microfrontends/microfrontendConfig';
import './microfrontends/microfrontend.css';
import './App.css';

function App() {
  // Initialize microfrontends on app startup
  useEffect(() => {
    registerMicrofrontends();
    console.log('🚀 Microfrontend Architecture Initialized');
    console.log('📦 Available Microfrontends:', getAvailableMicrofrontends());
  }, []);

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
              <Link to="/microfrontends">🚀 Microfrontend Dashboard</Link>
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
              <Link to="/patterns">🎯 Coding Patterns (Microfrontend)</Link>
            </li>
            <li>
              <Link to="/educational-coverage">C# Learning Materials</Link>
            </li>
            <li>
              <Link to="/relationships">🔗 Relationships & Normalization (Microfrontend)</Link>
            </li>
            <li>
              <Link to="/dotnet-core-building-blocks">🧱 .NET Core Building Blocks (Microfrontend)</Link>
            </li>
            <li>
              <Link to="/dotnet-core-concepts">⚙️ .NET Core Concepts (Microfrontend)</Link>
            </li>
            <li>
              <Link to="/system-design">🏗️ System Design Concepts (Microfrontend)</Link>
            </li>
            <li>
              <Link to="/dotnet-interfaces">🔌 .NET Common Interfaces (Microfrontend)</Link>
            </li>
            <li>
              <Link to="/distributed-patterns">🏗️ Distributed Systems Patterns (Microfrontend)</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<DotNetCoreHomePage />} />
          <Route path="/guide" element={<DotNetCoreLearningGuide />} />
          <Route path="/microfrontends" element={<MicrofrontendDashboard />} />
          <Route path="/mcqs" element={<MainPage />} />
          <Route path="/history" element={<History />} />
          <Route path="/cqrs" element={<CQRSPattern />} />
          <Route path="/patterns" element={<MicrofrontendRouter route="/patterns" />} />
          <Route path="/educational-coverage" element={<EducationalCoverage />} />
          <Route path="/patterns/two-pointers" element={<TwoPointersPattern />} />
          <Route path="/patterns/sliding-window" element={<SlidingWindowPattern />} />
          <Route path="/patterns/binary-search" element={<BinarySearchPattern />} />
          <Route path="/relationships" element={<MicrofrontendRouter route="/relationships" />} />
          <Route path="/dotnet-core-building-blocks" element={<MicrofrontendRouter route="/dotnet-core-building-blocks" />} />
          <Route path="/dotnet-core-concepts" element={<MicrofrontendRouter route="/dotnet-core-concepts" />} />
          <Route path="/system-design" element={<MicrofrontendRouter route="/system-design" />} />
          <Route path="/dotnet-interfaces" element={<MicrofrontendRouter route="/dotnet-interfaces" />} />
          <Route path="/distributed-patterns" element={<MicrofrontendRouter route="/distributed-patterns" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
