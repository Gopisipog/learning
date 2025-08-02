# 📊 PDF Knowledge Graph Extractor

A comprehensive web application that uploads PDF documents and automatically extracts knowledge graphs chapter by chapter using natural language processing and network analysis.

## 🌟 Featuresch

### 📖 **PDF Processing**
- **Automatic Text Extraction**: Extract text from PDF documents using PyPDF2
- **Chapter Detection**: Intelligent chapter boundary detection using pattern matching
- **Multi-page Support**: Handle large documents with multiple pages
- **Error Handling**: Robust error handling for corrupted or complex PDFs

### 🧠 **Knowledge Extraction**
- **Entity Recognition**: Extract people, organizations, locations, products, events using spaCy NLP
- **Relationship Mapping**: Identify relationships between entities using dependency parsing
- **Chapter-by-Chapter Analysis**: Process each chapter independently for focused insights
- **Context Preservation**: Maintain sentence context for extracted relationships

### 🕸️ **Interactive Visualization**
- **Force-Directed Graphs**: Interactive network visualizations using D3.js
- **Entity Categorization**: Color-coded nodes by entity type
- **Relationship Details**: Click on edges to see relationship context
- **Zoom and Pan**: Navigate large knowledge graphs easily
- **Multiple Views**: Graph, entity list, and statistics tabs

### 📊 **Analytics Dashboard**
- **Graph Statistics**: Node count, edge count, graph density metrics
- **Entity Distribution**: Breakdown by entity types with visual charts
- **Chapter Comparison**: Compare knowledge complexity across chapters
- **Export Capabilities**: Download graphs and data for further analysis

## 🏗️ **Architecture**

### **Backend (Python/Flask)**
- **Flask API**: RESTful endpoints for file upload and processing
- **spaCy NLP**: Advanced natural language processing for entity extraction
- **NetworkX**: Graph analysis and network metrics calculation
- **PyPDF2**: PDF text extraction and processing

### **Frontend (React)**
- **React 18**: Modern React with hooks and functional components
- **Force Graph 2D**: Interactive network visualization
- **React Dropzone**: Drag-and-drop file upload interface
- **React Tabs**: Organized multi-view interface
- **Responsive Design**: Mobile-friendly responsive layout

## 🚀 **Quick Start**

### **Prerequisites**
- Python 3.8+ with pip
- Node.js 16+ with npm
- 4GB+ RAM (for NLP processing)

### **Backend Setup**
```bash
cd KnowledgeGraphExtractor/backend

# Install dependencies and setup
python setup.py

# Start the Flask server
python app.py
```

### **Frontend Setup**
```bash
cd KnowledgeGraphExtractor/frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

### **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📋 **Usage Guide**

### **1. Upload PDF Document**
- Drag and drop a PDF file or click to select
- Maximum file size: 50MB
- Supported format: PDF only
- Processing starts automatically after upload

### **2. View Processing Status**
- Real-time progress tracking through 4 stages:
  - Text extraction from PDF pages
  - Chapter boundary detection
  - Entity and relationship extraction
  - Knowledge graph construction

### **3. Explore Knowledge Graphs**
- **Chapter Navigation**: Select chapters from the sidebar
- **Graph Interaction**: Click nodes and edges for details
- **View Options**: Switch between graph, entity list, and statistics
- **Zoom Controls**: Use zoom in/out and reset view buttons

### **4. Analyze Results**
- **Entity Details**: View entity types, descriptions, and connections
- **Relationship Context**: See the original sentences containing relationships
- **Statistics**: Analyze graph metrics and entity distributions
- **Chapter Comparison**: Compare knowledge complexity across chapters

## 🔧 **API Endpoints**

### **POST /api/upload**
Upload and process PDF file
```json
{
  "success": true,
  "file_id": "uuid",
  "filename": "document.pdf",
  "total_chapters": 3,
  "chapters": [...]
}
```

### **GET /api/files/{file_id}**
Retrieve processed file data
```json
{
  "file_id": "uuid",
  "filename": "document.pdf",
  "chapters": [...],
  "upload_time": "2024-01-01T00:00:00"
}
```

### **GET /api/health**
Health check endpoint
```json
{
  "status": "healthy",
  "spacy_available": true,
  "timestamp": "2024-01-01T00:00:00"
}
```

## 📊 **Data Structures**

### **Knowledge Graph Format**
```json
{
  "nodes": [
    {
      "id": "entity_id",
      "label": "Entity Name",
      "type": "PERSON|ORG|GPE|PRODUCT|EVENT",
      "description": "Entity description",
      "size": 15
    }
  ],
  "edges": [
    {
      "source": "entity1_id",
      "target": "entity2_id",
      "relation": "relationship_type",
      "sentence": "Original sentence context"
    }
  ],
  "stats": {
    "total_nodes": 10,
    "total_edges": 8,
    "density": 0.16
  }
}
```

### **Chapter Structure**
```json
{
  "id": 1,
  "title": "Chapter Title",
  "content_preview": "First 500 characters...",
  "word_count": 1250,
  "knowledge_graph": {...},
  "error": null
}
```

## 🎯 **Use Cases**

### **📚 Academic Research**
- Analyze research papers and extract key concepts
- Map relationships between authors, institutions, and findings
- Compare methodologies across different studies
- Track concept evolution through literature

### **📖 Document Analysis**
- Extract key information from legal documents
- Analyze business reports and strategic documents
- Process technical manuals and documentation
- Review policy documents and regulations

### **🔍 Content Discovery**
- Identify main themes and topics in large documents
- Find connections between different sections
- Discover hidden relationships in text
- Generate document summaries and insights

### **📊 Knowledge Management**
- Build organizational knowledge bases
- Map expertise and competencies
- Analyze training materials and documentation
- Create searchable knowledge repositories

## 🛠️ **Technical Details**

### **NLP Pipeline**
1. **Text Preprocessing**: Clean and normalize extracted text
2. **Sentence Segmentation**: Split text into sentences for analysis
3. **Named Entity Recognition**: Identify and classify entities
4. **Dependency Parsing**: Extract grammatical relationships
5. **Relation Extraction**: Map semantic relationships between entities

### **Graph Construction**
1. **Node Creation**: Convert entities to graph nodes with metadata
2. **Edge Creation**: Transform relationships into graph edges
3. **Graph Analysis**: Calculate network metrics and statistics
4. **Visualization Preparation**: Format data for frontend rendering

### **Performance Optimization**
- **Chunked Processing**: Handle large documents in manageable chunks
- **Caching**: Cache processed results for quick retrieval
- **Async Processing**: Non-blocking file processing
- **Memory Management**: Efficient memory usage for large documents

## 🔒 **Security Considerations**

- **File Validation**: Strict PDF file type validation
- **Size Limits**: 50MB maximum file size to prevent abuse
- **Temporary Storage**: Automatic cleanup of uploaded files
- **Input Sanitization**: Secure handling of user inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 🚀 **Deployment**

### **Production Setup**
```bash
# Backend (using Gunicorn)
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Frontend (build and serve)
cd frontend
npm run build
# Serve build folder with nginx or similar
```

### **Docker Deployment**
```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN python -m spacy download en_core_web_sm
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]

# Frontend Dockerfile
FROM node:16-alpine
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 **Acknowledgments**

- **spaCy**: Advanced NLP library for entity recognition
- **NetworkX**: Graph analysis and network science
- **React Force Graph**: Interactive graph visualization
- **Flask**: Lightweight web framework for Python
- **D3.js**: Data-driven document visualization

---

**Built with ❤️ for knowledge discovery and document analysis**
