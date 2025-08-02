import React from 'react';
import { BookOpen, Users, Network, FileText } from 'lucide-react';
import './ChapterViewer.css';

const ChapterViewer = ({ chapters, selectedChapter, onChapterSelect }) => {
  const getChapterIcon = (index) => {
    const icons = [BookOpen, FileText, Users, Network];
    return icons[index % icons.length];
  };

  const getChapterStats = (chapter) => {
    const kg = chapter.knowledge_graph;
    return {
      entities: kg.stats?.total_nodes || 0,
      relations: kg.stats?.total_edges || 0,
      words: chapter.word_count || 0
    };
  };

  return (
    <div className="chapter-viewer">
      <div className="chapter-header">
        <h3>📚 Chapters</h3>
        <span className="chapter-count">{chapters.length} detected</span>
      </div>

      <div className="chapters-list">
        {chapters.map((chapter, index) => {
          const IconComponent = getChapterIcon(index);
          const stats = getChapterStats(chapter);
          const isSelected = selectedChapter?.id === chapter.id;
          
          return (
            <div
              key={chapter.id}
              className={`chapter-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onChapterSelect(chapter)}
            >
              <div className="chapter-icon">
                <IconComponent size={20} />
              </div>
              
              <div className="chapter-content">
                <div className="chapter-title">
                  <h4>{chapter.title}</h4>
                  <span className="chapter-number">#{chapter.id}</span>
                </div>
                
                <div className="chapter-preview">
                  {chapter.content_preview}
                </div>
                
                <div className="chapter-stats">
                  <div className="stat-item">
                    <Users size={14} />
                    <span>{stats.entities} entities</span>
                  </div>
                  <div className="stat-item">
                    <Network size={14} />
                    <span>{stats.relations} relations</span>
                  </div>
                  <div className="stat-item">
                    <FileText size={14} />
                    <span>{stats.words} words</span>
                  </div>
                </div>

                {chapter.error && (
                  <div className="chapter-error">
                    ⚠️ {chapter.error}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chapter-summary">
        <h4>📊 Summary</h4>
        <div className="summary-stats">
          <div className="summary-item">
            <strong>{chapters.length}</strong>
            <span>Chapters</span>
          </div>
          <div className="summary-item">
            <strong>
              {chapters.reduce((sum, ch) => sum + (ch.knowledge_graph.stats?.total_nodes || 0), 0)}
            </strong>
            <span>Total Entities</span>
          </div>
          <div className="summary-item">
            <strong>
              {chapters.reduce((sum, ch) => sum + (ch.knowledge_graph.stats?.total_edges || 0), 0)}
            </strong>
            <span>Total Relations</span>
          </div>
          <div className="summary-item">
            <strong>
              {chapters.reduce((sum, ch) => sum + (ch.word_count || 0), 0).toLocaleString()}
            </strong>
            <span>Total Words</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterViewer;
