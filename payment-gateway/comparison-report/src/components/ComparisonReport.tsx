import { useState } from 'react';
import { getPaymentComparisonReport } from '../services/perplexityApi';
import type { ComparisonResult } from '../services/perplexityApi';
import './ComparisonReport.css';

export function ComparisonReport() {
  const [report, setReport] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPaymentComparisonReport();
      setReport(result);
    } catch (err) {
      setError('Failed to fetch comparison report. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) => {
    // Convert markdown-like formatting to HTML
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h3 key={index}>{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index}>{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={index}>{line.replace('# ', '')}</h1>;
        }
        // Bold text with **
        if (line.includes('**')) {
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={index}>
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </p>
          );
        }
        // List items
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return <li key={index}>{line.substring(2)}</li>;
        }
        // Numbered list
        if (/^\d+\.\s/.test(line)) {
          return <li key={index}>{line.replace(/^\d+\.\s/, '')}</li>;
        }
        // Regular paragraph
        if (line.trim()) {
          return <p key={index}>{line}</p>;
        }
        return null;
      });
  };

  return (
    <div className="comparison-report">
      <header className="report-header">
        <h1>🇮🇳 India Payment Technology Report</h1>
        <p className="subtitle">Payment Gateway Systems vs POS Devices - Indian Market</p>
      </header>

      <div className="action-section">
        <button 
          onClick={fetchReport} 
          disabled={loading}
          className="generate-btn"
        >
          {loading ? '⏳ Generating Report...' : '📊 Generate India Comparison Report'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Analyzing payment technologies using AI...</p>
        </div>
      )}

      {report && !loading && (
        <div className="report-content">
          <div className="report-body">
            {formatContent(report.content)}
          </div>

          {report.citations && report.citations.length > 0 && (
            <div className="citations-section">
              <h3>📚 Sources & Citations</h3>
              <ul>
                {report.citations.map((citation, index) => (
                  <li key={index}>
                    <a href={citation} target="_blank" rel="noopener noreferrer">
                      {citation}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

