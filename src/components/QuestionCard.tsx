import React from 'react';
import SectionAccordion from './SectionAccordion';
import '../styles/QuestionCard.css';

interface Section {
  heading: string;
  content: string;
  code?: string;
  codeLanguage?: string;
}

interface Question {
  id: number;
  title: string;
  content: string;
  sections: Section[];
}

interface QuestionCardProps {
  question: Question;
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  expandedSections,
  onToggleSection,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <div className="question-card">
      <div className="question-header">
        <h2 className="question-title">{question.title}</h2>
        <span className="question-badge">Q{questionNumber}</span>
      </div>

      <p className="question-intro">{question.content}</p>

      <div className="sections-container">
        {question.sections.map((section, index) => (
          <SectionAccordion
            key={`${question.id}-${index}`}
            section={section}
            sectionId={`${question.id}-${index}`}
            isExpanded={expandedSections.has(`${question.id}-${index}`)}
            onToggle={() => onToggleSection(`${question.id}-${index}`)}
          />
        ))}
      </div>

      <div className="question-footer">
        <p className="progress-text">
          Question {questionNumber} of {totalQuestions}
        </p>
      </div>
    </div>
  );
};

export default QuestionCard;

