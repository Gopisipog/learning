 import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import Header from './components/Header';
import DataIntensiveAppsNotes from './components/DataIntensiveAppsNotes';
import DataModelsNotes from './components/DataModelsNotes';
import HolubDesignPatterns from './components/HolubDesignPatterns';
import CSharpLearningEnvironment from './components/CSharpLearningEnvironment';
import SoftwareArchitectureHardParts from './components/SoftwareArchitectureHardParts';
import ChapterViewer from './components/ChapterViewer';
import KnowledgeGraphViewer from './components/KnowledgeGraphViewer';
import jsonData from './data.json';

function App() {
  const [processedData, setProcessedData] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    setProcessedData(jsonData);
    if (jsonData.chapters && jsonData.chapters.length > 0) {
      setSelectedChapter(jsonData.chapters[0]);
    }
  }, []);

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/data-intensive-apps" element={<DataIntensiveAppsNotes />} />
            <Route path="/data-models" element={<DataModelsNotes />} />
            <Route path="/holub-patterns" element={<HolubDesignPatterns />} />
            <Route path="/csharp-learning" element={<CSharpLearningEnvironment />} />
            <Route path="/software-architecture" element={<SoftwareArchitectureHardParts />} />
            <Route path="/" element={
              <div className="app-container">
                {processedData && (
                  <div className="results-section">
                    <div className="results-header">
                      <h2>Analysis Results</h2>
                      <div className="file-info">
                        <span className="file-name">{processedData.filename}</span>
                        <span className="chapter-count">{processedData.total_chapters} chapters detected</span>
                      </div>
                    </div>

                    <div className="results-content">
                      <div className="sidebar">
                        <ChapterViewer
                          chapters={processedData.chapters}
                          selectedChapter={selectedChapter}
                          onChapterSelect={handleChapterSelect}
                        />
                      </div>

                      <div className="main-viewer">
                        {selectedChapter && (
                          <KnowledgeGraphViewer
                            chapter={selectedChapter}
                            key={selectedChapter.id}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            } />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
