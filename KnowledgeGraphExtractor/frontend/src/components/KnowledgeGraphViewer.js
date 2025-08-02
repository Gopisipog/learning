import React, { useState, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Network, List, BarChart3, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import 'react-tabs/style/react-tabs.css';
import './KnowledgeGraphViewer.css';

const KnowledgeGraphViewer = ({ chapter }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [zoomLevel, setZoomLevel] = useState(1);
  const graphRef = useRef();

  useEffect(() => {
    if (chapter?.knowledge_graph) {
      const kg = chapter.knowledge_graph;
      
      // Transform data for react-force-graph
      const transformedData = {
        nodes: kg.nodes.map(node => ({
          id: node.id,
          name: node.label,
          type: node.type,
          description: node.description,
          val: node.size || 10,
          color: getNodeColor(node.type)
        })),
        links: kg.edges.map(edge => ({
          source: edge.source,
          target: edge.target,
          relation: edge.relation,
          sentence: edge.sentence,
          color: 'rgba(255, 255, 255, 0.6)'
        }))
      };
      
      setGraphData(transformedData);
      setSelectedNode(null);
      setSelectedEdge(null);
    }
  }, [chapter]);

  const getNodeColor = (type) => {
    const colors = {
      'PERSON': '#ff6b6b',
      'ORG': '#4ecdc4',
      'GPE': '#45b7d1',
      'PRODUCT': '#96ceb4',
      'EVENT': '#ffeaa7',
      'WORK_OF_ART': '#dda0dd',
      'LAW': '#98d8c8',
      'LANGUAGE': '#f7dc6f',
      'CONCEPT': '#bb8fce',
      'UNKNOWN': '#95a5a6'
    };
    return colors[type] || colors['UNKNOWN'];
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  };

  const handleLinkClick = (link) => {
    setSelectedEdge(link);
    setSelectedNode(null);
  };

  const handleZoomIn = () => {
    if (graphRef.current) {
      const newZoom = Math.min(zoomLevel * 1.5, 10);
      graphRef.current.zoom(newZoom);
      setZoomLevel(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      const newZoom = Math.max(zoomLevel / 1.5, 0.1);
      graphRef.current.zoom(newZoom);
      setZoomLevel(newZoom);
    }
  };

  const handleReset = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
      setZoomLevel(1);
      setSelectedNode(null);
      setSelectedEdge(null);
    }
  };

  const renderNodeDetails = () => {
    if (!selectedNode) return null;

    const connectedLinks = graphData.links.filter(
      link => link.source.id === selectedNode.id || link.target.id === selectedNode.id
    );

    return (
      <div className="details-panel">
        <h4>🔍 Node Details</h4>
        <div className="detail-item">
          <strong>Name:</strong> {selectedNode.name}
        </div>
        <div className="detail-item">
          <strong>Type:</strong> 
          <span className="entity-type" style={{ backgroundColor: selectedNode.color }}>
            {selectedNode.type}
          </span>
        </div>
        {selectedNode.description && (
          <div className="detail-item">
            <strong>Description:</strong> {selectedNode.description}
          </div>
        )}
        <div className="detail-item">
          <strong>Connections:</strong> {connectedLinks.length}
        </div>
        
        {connectedLinks.length > 0 && (
          <div className="connections-list">
            <strong>Connected to:</strong>
            {connectedLinks.map((link, index) => {
              const otherNode = link.source.id === selectedNode.id ? link.target : link.source;
              return (
                <div key={index} className="connection-item">
                  <span className="connection-relation">{link.relation}</span>
                  <span className="connection-target">{otherNode.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderEdgeDetails = () => {
    if (!selectedEdge) return null;

    return (
      <div className="details-panel">
        <h4>🔗 Relationship Details</h4>
        <div className="detail-item">
          <strong>Source:</strong> {selectedEdge.source.name}
        </div>
        <div className="detail-item">
          <strong>Relation:</strong> 
          <span className="relation-type">{selectedEdge.relation}</span>
        </div>
        <div className="detail-item">
          <strong>Target:</strong> {selectedEdge.target.name}
        </div>
        {selectedEdge.sentence && (
          <div className="detail-item">
            <strong>Context:</strong>
            <div className="context-sentence">"{selectedEdge.sentence}"</div>
          </div>
        )}
      </div>
    );
  };

  const renderEntityList = () => {
    const entityTypes = {};
    graphData.nodes.forEach(node => {
      if (!entityTypes[node.type]) {
        entityTypes[node.type] = [];
      }
      entityTypes[node.type].push(node);
    });

    return (
      <div className="entity-list">
        {Object.entries(entityTypes).map(([type, entities]) => (
          <div key={type} className="entity-group">
            <h4 className="entity-type-header">
              <span 
                className="type-indicator" 
                style={{ backgroundColor: getNodeColor(type) }}
              ></span>
              {type} ({entities.length})
            </h4>
            <div className="entity-items">
              {entities.map(entity => (
                <div 
                  key={entity.id} 
                  className="entity-item"
                  onClick={() => handleNodeClick(entity)}
                >
                  <span className="entity-name">{entity.name}</span>
                  <span className="entity-connections">
                    {graphData.links.filter(
                      link => link.source.id === entity.id || link.target.id === entity.id
                    ).length} connections
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStatistics = () => {
    const stats = chapter?.knowledge_graph?.stats || {};
    const entityTypes = {};
    graphData.nodes.forEach(node => {
      entityTypes[node.type] = (entityTypes[node.type] || 0) + 1;
    });

    return (
      <div className="statistics-panel">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total_nodes || 0}</div>
            <div className="stat-label">Entities</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.total_edges || 0}</div>
            <div className="stat-label">Relationships</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Object.keys(entityTypes).length}</div>
            <div className="stat-label">Entity Types</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{(stats.density * 100).toFixed(1)}%</div>
            <div className="stat-label">Graph Density</div>
          </div>
        </div>

        <div className="entity-distribution">
          <h4>Entity Distribution</h4>
          {Object.entries(entityTypes).map(([type, count]) => (
            <div key={type} className="distribution-item">
              <div className="distribution-header">
                <span 
                  className="type-indicator" 
                  style={{ backgroundColor: getNodeColor(type) }}
                ></span>
                <span className="type-name">{type}</span>
                <span className="type-count">{count}</span>
              </div>
              <div className="distribution-bar">
                <div 
                  className="distribution-fill"
                  style={{ 
                    width: `${(count / Math.max(...Object.values(entityTypes))) * 100}%`,
                    backgroundColor: getNodeColor(type)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!chapter) {
    return (
      <div className="knowledge-graph-viewer">
        <div className="no-chapter">
          <Info size={48} />
          <h3>No Chapter Selected</h3>
          <p>Select a chapter from the sidebar to view its knowledge graph</p>
        </div>
      </div>
    );
  }

  return (
    <div className="knowledge-graph-viewer">
      <div className="viewer-header">
        <h3>🕸️ {chapter.title}</h3>
        <div className="graph-controls">
          <button onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <button onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <button onClick={handleReset} title="Reset View">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <Tabs className="graph-tabs">
        <TabList>
          <Tab><Network size={16} /> Graph</Tab>
          <Tab><List size={16} /> Entities</Tab>
          <Tab><BarChart3 size={16} /> Statistics</Tab>
        </TabList>

        <TabPanel>
          <div className="graph-container">
            <div className="graph-canvas">
              {graphData.nodes.length > 0 ? (
                <ForceGraph2D
                  ref={graphRef}
                  graphData={graphData}
                  nodeLabel="name"
                  nodeColor="color"
                  nodeVal="val"
                  linkColor="color"
                  linkDirectionalParticles={2}
                  linkDirectionalParticleSpeed={0.01}
                  onNodeClick={handleNodeClick}
                  onLinkClick={handleLinkClick}
                  backgroundColor="transparent"
                  width={600}
                  height={400}
                  cooldownTicks={100}
                  onEngineStop={() => graphRef.current?.zoomToFit(400)}
                />
              ) : (
                <div className="no-graph">
                  <Network size={48} />
                  <h4>No Knowledge Graph Available</h4>
                  <p>This chapter doesn't contain extractable entities or relationships</p>
                </div>
              )}
            </div>
            
            <div className="graph-sidebar">
              {selectedNode && renderNodeDetails()}
              {selectedEdge && renderEdgeDetails()}
              {!selectedNode && !selectedEdge && (
                <div className="help-panel">
                  <h4>💡 How to Use</h4>
                  <ul>
                    <li>Click on nodes to see entity details</li>
                    <li>Click on edges to see relationships</li>
                    <li>Use zoom controls to navigate</li>
                    <li>Drag nodes to rearrange the graph</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          {renderEntityList()}
        </TabPanel>

        <TabPanel>
          {renderStatistics()}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default KnowledgeGraphViewer;
