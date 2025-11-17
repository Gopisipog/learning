import React from 'react';
import CodeBlock from './CodeBlock';
import '../styles/SectionAccordion.css';

interface Section {
  heading: string;
  content: string;
  code?: string;
  codeLanguage?: string;
}

interface SectionAccordionProps {
  section: Section;
  sectionId: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const SectionAccordion: React.FC<SectionAccordionProps> = ({
  section,
  sectionId,
  isExpanded,
  onToggle,
}) => {
  return (
    <div className="accordion-item">
      <button
        className={`accordion-header ${isExpanded ? 'expanded' : ''}`}
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={sectionId}
      >
        <span className="accordion-title">{section.heading}</span>
        <span className="accordion-icon">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div className="accordion-content" id={sectionId}>
          <div className="content-text">
            {section.content.split('\n').map((paragraph, idx) => (
              paragraph.trim() && (
                <p key={idx}>{paragraph}</p>
              )
            ))}
          </div>

          {section.code && (
            <CodeBlock
              code={section.code}
              language={section.codeLanguage || 'javascript'}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SectionAccordion;

