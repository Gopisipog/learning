import React from 'react';
import '../styles/Navigation.css';

interface Question {
  id: number;
  title: string;
  content: string;
}

interface NavigationProps {
  questions: Question[];
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  questions,
  currentIndex,
  onSelectQuestion,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Questions</h3>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <nav className="questions-list">
        {questions.map((question, index) => (
          <button
            key={question.id}
            className={`question-item ${
              index === currentIndex ? 'active' : ''
            }`}
            onClick={() => onSelectQuestion(index)}
            title={question.title}
          >
            <span className="question-number">Q{question.id}</span>
            <span className="question-text">{question.title}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Navigation;

