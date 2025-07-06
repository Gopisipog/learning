import React from 'react';

function PatternsSummary() {
  const patterns = [
    {
      name: "CQRS Pattern",
      description: "Command Query Responsibility Segregation - Separates read and write operations for better performance and scalability",
      link: "/cqrs",
      status: "✅ Complete",
      features: [
        "Step-by-step implementation guide",
        "Interactive learning prompts",
        "Live demo with working code",
        "Event sourcing implementation",
        "Benefits and considerations"
      ],
      color: "#27ae60"
    },
    {
      name: "Two Pointers Pattern",
      description: "Efficient algorithm pattern for array and string problems using two pointers",
      link: "/history",
      status: "✅ Complete",
      features: [
        "Multiple algorithm implementations",
        "Performance comparisons",
        "Visual demonstrations",
        "MCQ learning sessions",
        "Real-world examples"
      ],
      color: "#3498db"
    },
    {
      name: "Island Pattern",
      description: "Graph traversal pattern for connected component problems",
      link: "/history",
      status: "✅ Complete", 
      features: [
        "DFS and BFS implementations",
        "Visual grid representations",
        "Multiple problem variations",
        "Interactive examples",
        "Complexity analysis"
      ],
      color: "#e74c3c"
    },
    {
      name: "Cycle Detection",
      description: "Algorithms for detecting cycles in linked lists and graphs",
      link: "/history",
      status: "✅ Complete",
      features: [
        "Floyd's Cycle Detection",
        "Visual cycle representation",
        "Multiple detection methods",
        "Performance analysis",
        "Educational prompts"
      ],
      color: "#9b59b6"
    }
  ];

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', fontSize: '2.2em', marginBottom: '10px' }}>
          🎯 Coding Patterns & Algorithms
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '1.1em', maxWidth: '600px', margin: '0 auto' }}>
          Comprehensive implementations with step-by-step learning guides, interactive demos, and educational prompts
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '25px',
        marginBottom: '30px'
      }}>
        {patterns.map((pattern, index) => (
          <div 
            key={index}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: `3px solid ${pattern.color}`,
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            onClick={() => window.location.href = pattern.link}
          >
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ 
                color: pattern.color, 
                margin: '0 0 8px 0', 
                fontSize: '1.4em',
                fontWeight: 'bold'
              }}>
                {pattern.name}
              </h3>
              <span style={{
                backgroundColor: pattern.color,
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {pattern.status}
              </span>
            </div>
            
            <p style={{ 
              color: '#555', 
              lineHeight: '1.5', 
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {pattern.description}
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ 
                color: '#2c3e50', 
                margin: '0 0 10px 0', 
                fontSize: '1em' 
              }}>
                Key Features:
              </h4>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '20px',
                fontSize: '13px',
                lineHeight: '1.4'
              }}>
                {pattern.features.map((feature, idx) => (
                  <li key={idx} style={{ marginBottom: '4px', color: '#666' }}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button style={{
                backgroundColor: pattern.color,
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}>
                Explore Pattern →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Statistics */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '25px',
        textAlign: 'center',
        border: '2px solid #ecf0f1'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          📊 Learning Progress
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2.5em', 
              fontWeight: 'bold', 
              color: '#27ae60',
              marginBottom: '5px'
            }}>
              4
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
              Patterns Implemented
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2.5em', 
              fontWeight: 'bold', 
              color: '#3498db',
              marginBottom: '5px'
            }}>
              15+
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
              Algorithm Variations
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2.5em', 
              fontWeight: 'bold', 
              color: '#e74c3c',
              marginBottom: '5px'
            }}>
              50+
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
              Learning Prompts
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2.5em', 
              fontWeight: 'bold', 
              color: '#9b59b6',
              marginBottom: '5px'
            }}>
              100%
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
              Interactive Demos
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div style={{
        backgroundColor: '#fff3cd',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '25px',
        border: '2px solid #ffeaa7'
      }}>
        <h3 style={{ color: '#856404', marginBottom: '15px', textAlign: 'center' }}>
          🚀 What's Next?
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '15px',
          fontSize: '14px'
        }}>
          <div>
            <strong style={{ color: '#856404' }}>More Patterns:</strong>
            <ul style={{ margin: '5px 0 0 20px', color: '#6c5ce7' }}>
              <li>Observer Pattern</li>
              <li>Strategy Pattern</li>
              <li>Factory Pattern</li>
            </ul>
          </div>
          <div>
            <strong style={{ color: '#856404' }}>Advanced Topics:</strong>
            <ul style={{ margin: '5px 0 0 20px', color: '#6c5ce7' }}>
              <li>Microservices Architecture</li>
              <li>Event-Driven Systems</li>
              <li>Performance Optimization</li>
            </ul>
          </div>
          <div>
            <strong style={{ color: '#856404' }}>Testing & Quality:</strong>
            <ul style={{ margin: '5px 0 0 20px', color: '#6c5ce7' }}>
              <li>Unit Testing Strategies</li>
              <li>Integration Testing</li>
              <li>Code Quality Metrics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatternsSummary;
