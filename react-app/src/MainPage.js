import React, { useState, useEffect } from 'react';
import './App.css';
import questionsData from './mcqs.json';
import PatternsSummary from './PatternsSummary';

function MainPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCorrectAnswer, setSelectedCorrectAnswer] = useState(null);
  const [promptInputAnswers, setPromptInputAnswers] = useState({});
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [report, setReport] = useState('');
  const [selectedPatterns, setSelectedPatterns] = useState(new Set());
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [showPatternSelector, setShowPatternSelector] = useState(false);

  // Available patterns for selection
  const availablePatterns = [
    "1. Two Pointers",
    "2. Merge Intervals",
    "3. Sliding Window",
    "4. Binary Search",
    "5. Tree Traversal",
    "6. Dynamic Programming (1D)",
    "7. Fast & Slow Pointers",
    "8. Graph Algorithms",
    "Island Pattern",
    "Tree BFS",
    "Tree DFS",
    "Heap",
    "Modified Binary Search",
    "Subsets",
    "Greedy Algorithm",
    "0/1 Knapsack"
  ];

  useEffect(() => {
    const allQuestions = Object.values(questionsData).flat();
    setQuestions(allQuestions);
    setFilteredQuestions(allQuestions);

    const savedIndex = localStorage.getItem('currentQuestionIndex');
    if (savedIndex !== null) {
      setCurrentQuestionIndex(parseInt(savedIndex, 10));
    }
  }, []);

  // Filter questions based on selected patterns
  useEffect(() => {
    if (selectedPatterns.size === 0) {
      const allQuestions = Object.values(questionsData).flat();
      setFilteredQuestions(allQuestions);
    } else {
      const filtered = [];
      selectedPatterns.forEach(pattern => {
        if (questionsData[pattern]) {
          filtered.push(...questionsData[pattern]);
        }
      });
      setFilteredQuestions(filtered);
      setCurrentQuestionIndex(0); // Reset to first question when filtering
    }
  }, [selectedPatterns]);

  useEffect(() => {
    if (filteredQuestions.length > 0) {
      localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
    }
  }, [currentQuestionIndex, filteredQuestions.length]);

  // Pattern selection handlers
  const handlePatternToggle = (pattern) => {
    const newSelected = new Set(selectedPatterns);
    if (newSelected.has(pattern)) {
      newSelected.delete(pattern);
    } else {
      newSelected.add(pattern);
    }
    setSelectedPatterns(newSelected);
  };

  const selectAllPatterns = () => {
    setSelectedPatterns(new Set(availablePatterns));
  };

  const clearAllPatterns = () => {
    setSelectedPatterns(new Set());
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedCorrectAnswer(null);
      setPromptInputAnswers({});
      setSelectedPrompts([]);
      setReport('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedCorrectAnswer(null);
      setPromptInputAnswers({});
      setSelectedPrompts([]);
      setReport('');
    }
  };

  const handleCorrectAnswerChange = (option) => {
    setSelectedCorrectAnswer(option);
  };

  const handlePromptInputChange = (option) => {
    setPromptInputAnswers({
      ...promptInputAnswers,
      [option]: !promptInputAnswers[option],
    });
  };

  const handlePromptChange = (prompt, isChecked) => {
    if (isChecked) {
      setSelectedPrompts(prev => [...prev, prompt]);
    } else {
      setSelectedPrompts(prev => prev.filter(p => p !== prompt));
    }
  };

  const handleGenerateReport = () => {
    const selectedPatternsArray = Array.from(selectedPatterns);
    const totalQuestions = filteredQuestions.length;
    const currentProgress = currentQuestionIndex + 1;

    const reportContent = `
## Coding Patterns Learning Report

**Study Session:** ${new Date().toLocaleString()}

### Pattern Selection
**Selected Patterns:** ${selectedPatternsArray.length > 0 ? selectedPatternsArray.join(', ') : 'All Patterns'}
**Total Questions:** ${totalQuestions}
**Current Progress:** ${currentProgress}/${totalQuestions} (${Math.round((currentProgress/totalQuestions) * 100)}%)

### Learning Prompts Completed
**Selected Learning Prompts:** ${selectedPrompts.join(', ') || 'None selected yet'}

### Detailed Responses
${Object.entries(promptInputAnswers).map(([prompt, answer]) => `
**Prompt:** ${prompt}
**Your Response:** ${answer}
`).join('\n')}

### Current Question Analysis
${filteredQuestions.length > 0 ? `
**Current Question:** ${filteredQuestions[currentQuestionIndex]?.question || 'N/A'}
**Your Selected Answer:** ${selectedCorrectAnswer || 'Not answered yet'}
**Correct Answer:** ${filteredQuestions[currentQuestionIndex]?.answer || 'N/A'}
**Status:** ${selectedCorrectAnswer === filteredQuestions[currentQuestionIndex]?.answer ? '✅ Correct' : '❌ Incorrect or Not Answered'}
` : 'No questions available for selected patterns'}

### Study Recommendations
${selectedPatternsArray.length === 0 ?
  '- Select specific patterns to focus your study session\n- Use the pattern checkboxes above to filter questions' :
  `- Continue practicing ${selectedPatternsArray.join(', ')} patterns\n- Review incorrect answers and understand the concepts\n- Try implementing the patterns in code`
}

### Next Steps
- Complete remaining questions in selected patterns
- Review learning prompts and provide detailed responses
- Practice implementing these patterns in your preferred programming language
- Visit the Coding Patterns Guide for interactive implementations

---
*Generated by Coding Patterns Learning System*
    `.trim();

    setReport(reportContent);
  };

  if (filteredQuestions.length === 0 && selectedPatterns.size > 0) {
    return (
      <div className="page-content">
        <h2>No questions found for selected patterns</h2>
        <p>Please select different patterns or clear the selection to see all questions.</p>
        <button onClick={clearAllPatterns}>Show All Questions</button>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const prompts = [
    'can you design a solution in c# that will provide an output for the selected answer',
    'write a program thats based on the choice',
    'what is the gap between selected items',
    'what is the consequence if I\'m correct for the given choice based on the question',
    'rephrase the question based on my choice',
    'what is wrong with this implementation',
    'what if my syntasx is correct',
  ];

  return (
    <div className="page-content">
      {/* New Features Highlight */}
      <div style={{
        backgroundColor: '#e8f5e8',
        padding: '20px',
        margin: '20px 0',
        borderRadius: '8px',
        border: '2px solid #27ae60',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#27ae60', margin: '0 0 10px 0' }}>
          🎯 NEW: Complete Coding Patterns Guide Available!
        </h2>
        <p style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
          Master all 16 essential coding patterns for technical interviews with step-by-step implementations and interactive demos
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/patterns"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#27ae60',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            🎯 Coding Patterns Guide →
          </a>
          <a
            href="/cqrs"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            🏗️ CQRS Pattern →
          </a>
        </div>
      </div>

      {/* Patterns Summary Section */}
      <PatternsSummary />

      {/* Pattern Selection Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        margin: '20px 0',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#495057' }}>🎯 Select Coding Patterns to Study</h3>
          <button
            onClick={() => setShowPatternSelector(!showPatternSelector)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showPatternSelector ? 'Hide Patterns' : 'Show Patterns'}
          </button>
        </div>

        {showPatternSelector && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <button
                onClick={selectAllPatterns}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                Select All
              </button>
              <button
                onClick={clearAllPatterns}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '10px',
              marginBottom: '15px'
            }}>
              {availablePatterns.map(pattern => (
                <label key={pattern} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  backgroundColor: selectedPatterns.has(pattern) ? '#e7f3ff' : 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedPatterns.has(pattern)}
                    onChange={() => handlePatternToggle(pattern)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '14px' }}>{pattern}</span>
                </label>
              ))}
            </div>

            <div style={{
              padding: '10px',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              <strong>Selected:</strong> {selectedPatterns.size} patterns |
              <strong> Questions:</strong> {filteredQuestions.length} |
              <strong> Progress:</strong> {currentQuestionIndex + 1}/{filteredQuestions.length}
            </div>
          </div>
        )}
      </div>

      <div className="question-container">
        <h2>{currentQuestion.question}</h2>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="option">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                checked={selectedCorrectAnswer === option}
                onChange={() => handleCorrectAnswerChange(option)}
              />
              <label>{option}</label>
              <input
                type="checkbox"
                checked={!!promptInputAnswers[option]}
                onChange={() => handlePromptInputChange(option)}
              />
            </div>
          ))}
        </div>
        <div className="prompts-container">
          <h3>Follow-up Prompts:</h3>
          {prompts.map((prompt, index) => (
            <div key={index} className="prompt">
              <label>{prompt}</label>
              <input
                type="checkbox"
                checked={selectedPrompts.includes(prompt)}
                onChange={(e) => handlePromptChange(prompt, e.target.checked)}
              />
            </div>
          ))}
        </div>
        <button onClick={handleGenerateReport}>Generate Report</button>
        {report && (
          <div className="report-container">
            <h3>Consolidated Report:</h3>
            <pre>{report}</pre>
          </div>
        )}
        <div className="navigation-buttons">
          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === filteredQuestions.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;