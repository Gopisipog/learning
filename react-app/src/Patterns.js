import React, { useState, useEffect } from 'react';
import patternsData from './patterns.json';
import mcqsData from './mcqs.json';
import Chat from './Chat';

function Patterns() {
  const [patterns, setPatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatterns = () => {
      try {
        setPatterns(patternsData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatterns();
  }, []);

  const handleSelectPattern = (pattern) => {
    setSelectedPattern(pattern);
    setMcqs(mcqsData[pattern.title] || []);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
        <h2>Coding Patterns</h2>
        {loading && <p>Loading patterns...</p>}
        {error && <p>Error fetching patterns: {error}</p>}
        {!loading && !error && (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {patterns.map((pattern, index) => (
              <li 
                key={index} 
                onClick={() => handleSelectPattern(pattern)} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '10px', 
                  borderBottom: '1px solid #eee',
                  backgroundColor: selectedPattern && selectedPattern.title === pattern.title ? '#f0f0f0' : 'transparent'
                }}
              >
                {pattern.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ width: '40%', padding: '20px', overflowY: 'auto' }}>
        {selectedPattern ? (
          <div>
            <h3>{selectedPattern.title}</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.6' }}>
              {selectedPattern.description}
            </pre>
            <hr />
            <h4>MCQs</h4>
            {mcqs.map((mcq, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <p><strong>{mcq.question}</strong></p>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {mcq.options.map((option, i) => (
                    <li key={i} style={{ marginBottom: '5px' }}>
                      <label>
                        <input type="radio" name={`mcq-${index}`} value={option} />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>Select a pattern from the list to view its details.</p>
        )}
      </div>
      <div style={{ width: '30%', padding: '10px', borderLeft: '1px solid #ccc' }}>
        <Chat />
      </div>
    </div>
  );
}

export default Patterns;