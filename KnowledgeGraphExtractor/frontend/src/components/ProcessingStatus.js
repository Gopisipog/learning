import React, { useState, useEffect } from 'react';
import { FileText, Brain, Network, CheckCircle } from 'lucide-react';
import './ProcessingStatus.css';

const ProcessingStatus = ({ fileName, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: FileText,
      title: "Extracting Text",
      description: "Reading PDF content and extracting text from all pages"
    },
    {
      icon: Brain,
      title: "Detecting Chapters",
      description: "Analyzing document structure and identifying chapter boundaries"
    },
    {
      icon: Network,
      title: "Extracting Entities",
      description: "Identifying people, organizations, concepts, and relationships"
    },
    {
      icon: CheckCircle,
      title: "Building Knowledge Graphs",
      description: "Creating interactive visualizations for each chapter"
    }
  ];

  useEffect(() => {
    // Simulate processing steps
    const stepDuration = 2000; // 2 seconds per step
    const progressInterval = 50; // Update progress every 50ms

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (steps.length * stepDuration / progressInterval));
        
        // Update current step based on progress
        const stepProgress = Math.floor(newProgress / (100 / steps.length));
        setCurrentStep(Math.min(stepProgress, steps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(timer);
          // Simulate completion delay
          setTimeout(() => {
            // In a real app, this would be triggered by the actual API response
            // For now, we'll simulate a successful response
            const mockData = {
              success: true,
              filename: fileName,
              total_chapters: 3,
              chapters: [
                {
                  id: 1,
                  title: "Introduction",
                  content_preview: "This chapter introduces the main concepts...",
                  word_count: 1250,
                  knowledge_graph: {
                    nodes: [
                      { id: "concept1", label: "Main Concept", type: "CONCEPT", size: 20 },
                      { id: "author", label: "Author Name", type: "PERSON", size: 15 }
                    ],
                    edges: [
                      { source: "author", target: "concept1", relation: "introduces" }
                    ],
                    stats: { total_nodes: 2, total_edges: 1, density: 0.5 }
                  }
                },
                {
                  id: 2,
                  title: "Methodology",
                  content_preview: "This chapter describes the research methodology...",
                  word_count: 2100,
                  knowledge_graph: {
                    nodes: [
                      { id: "method1", label: "Research Method", type: "CONCEPT", size: 25 },
                      { id: "data", label: "Dataset", type: "PRODUCT", size: 18 }
                    ],
                    edges: [
                      { source: "method1", target: "data", relation: "analyzes" }
                    ],
                    stats: { total_nodes: 2, total_edges: 1, density: 0.5 }
                  }
                },
                {
                  id: 3,
                  title: "Results and Discussion",
                  content_preview: "This chapter presents the findings...",
                  word_count: 1800,
                  knowledge_graph: {
                    nodes: [
                      { id: "result1", label: "Key Finding", type: "CONCEPT", size: 22 },
                      { id: "implication", label: "Implication", type: "CONCEPT", size: 16 }
                    ],
                    edges: [
                      { source: "result1", target: "implication", relation: "suggests" }
                    ],
                    stats: { total_nodes: 2, total_edges: 1, density: 0.5 }
                  }
                }
              ]
            };
            onComplete(mockData);
          }, 1000);
          return 100;
        }
        
        return newProgress;
      });
    }, progressInterval);

    return () => clearInterval(timer);
  }, [fileName, onComplete, steps.length]);

  return (
    <div className="processing-status">
      <div className="processing-container">
        <div className="processing-header">
          <h2>Processing Your PDF</h2>
          <p className="file-name">{fileName}</p>
        </div>

        <div className="progress-section">
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>

          <div className="steps-container">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep || progress >= 100;
              
              return (
                <div 
                  key={index}
                  className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="step-icon">
                    <StepIcon size={24} />
                  </div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  {isActive && (
                    <div className="step-spinner">
                      <div className="spinner"></div>
                    </div>
                  )}
                  {isCompleted && !isActive && (
                    <div className="step-check">
                      <CheckCircle size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="processing-info">
          <div className="info-grid">
            <div className="info-item">
              <strong>Processing Time</strong>
              <span>~{Math.ceil((100 - progress) / 12.5)} seconds remaining</span>
            </div>
            <div className="info-item">
              <strong>Analysis Type</strong>
              <span>Chapter-by-chapter knowledge extraction</span>
            </div>
            <div className="info-item">
              <strong>Output Format</strong>
              <span>Interactive knowledge graphs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
