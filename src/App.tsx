import React, { useState } from 'react';
import './App.css';
import QuestionCard from './components/QuestionCard';
import Navigation from './components/Navigation';
import { questions } from './data/questions';

const App: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentQuestion = questions[currentQuestionIndex];

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setExpandedSections(new Set());
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setExpandedSections(new Set());
    }
  };

  const handleSelectQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setExpandedSections(new Set());
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>React Interview Questions (31-40)</h1>
        <p>JSX, Advanced Concepts, Hooks & Performance Optimization</p>
      </header>

      <div className="app-container">
        <Navigation
          questions={filteredQuestions}
          currentIndex={currentQuestionIndex}
          onSelectQuestion={handleSelectQuestion}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <main className="main-content">
          <QuestionCard
            question={currentQuestion}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />

          <div className="navigation-buttons">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="btn btn-secondary"
            >
              ← Previous
            </button>

            <div className="question-counter">
              {currentQuestionIndex + 1} / {questions.length}
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="btn btn-primary"
            >
              Next →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

