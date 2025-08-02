#!/usr/bin/env python3
"""
Simple Knowledge Graph Extractor Backend
Works without external dependencies using only Python standard library
"""

import json
import os
import uuid
import re
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import cgi
import tempfile

class SimpleKnowledgeGraphExtractor:
    def __init__(self):
        self.upload_folder = "uploads"
        self.processed_folder = "processed"
        os.makedirs(self.upload_folder, exist_ok=True)
        os.makedirs(self.processed_folder, exist_ok=True)
    
    def extract_text_from_pdf_simple(self, pdf_path):
        """Simple PDF text extraction - returns mock data for demo"""
        # For demo purposes, return sample text
        return """
        Chapter 1: Introduction
        This document introduces the concept of artificial intelligence and machine learning.
        John Smith, a researcher at MIT, has been working on neural networks.
        The company Google has developed TensorFlow for deep learning applications.
        
        Chapter 2: Methodology
        The research methodology involves data collection and analysis.
        Python programming language is used for implementation.
        The dataset contains information about various algorithms.
        
        Chapter 3: Results
        The results show significant improvements in accuracy.
        The model achieved 95% accuracy on the test dataset.
        Future work will focus on optimization and deployment.
        """
    
    def detect_chapters(self, text):
        """Detect chapter boundaries"""
        lines = text.split('\n')
        chapters = []
        current_chapter = {"title": "Introduction", "content": "", "start_line": 0}
        
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
            
            # Simple chapter detection
            if line.lower().startswith('chapter'):
                if current_chapter["content"]:
                    chapters.append(current_chapter)
                current_chapter = {
                    "title": line,
                    "content": "",
                    "start_line": i
                }
            else:
                current_chapter["content"] += line + "\n"
        
        if current_chapter["content"]:
            chapters.append(current_chapter)
        
        return chapters if chapters else [{"title": "Complete Document", "content": text, "start_line": 0}]
    
    def extract_entities_simple(self, text):
        """Simple entity extraction using patterns"""
        entities = []
        relations = []
        
        # Extract capitalized words as entities
        words = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)
        
        # Filter common words and create entities
        common_words = {'The', 'This', 'That', 'Chapter', 'Introduction', 'Methodology', 'Results'}
        unique_entities = list(set([w for w in words if w not in common_words and len(w) > 2]))
        
        for i, entity in enumerate(unique_entities[:15]):  # Limit to 15 entities
            entity_type = self.guess_entity_type(entity)
            entities.append({
                "text": entity,
                "label": entity_type,
                "description": f"Detected {entity_type.lower()}",
                "size": 15 + (i % 10)
            })
        
        # Create simple relationships
        for i in range(min(len(entities), 8)):
            for j in range(i + 1, min(len(entities), 8)):
                relations.append({
                    "source": entities[i]["text"],
                    "target": entities[j]["text"],
                    "relation": "related_to",
                    "sentence": f"Found relationship between {entities[i]['text']} and {entities[j]['text']}"
                })
        
        return entities, relations
    
    def guess_entity_type(self, word):
        """Guess entity type based on simple heuristics"""
        word_lower = word.lower()
        
        # Organizations
        if any(suffix in word_lower for suffix in ['corp', 'inc', 'ltd', 'company', 'group']) or word in ['Google', 'MIT', 'Microsoft', 'Apple']:
            return 'ORG'
        
        # People (common names)
        if word in ['John', 'Smith', 'Alice', 'Bob', 'Mary', 'David', 'Sarah'] or 'John Smith' in word:
            return 'PERSON'
        
        # Places
        if word in ['USA', 'America', 'China', 'Japan', 'Germany', 'France', 'UK', 'Canada', 'MIT']:
            return 'GPE'
        
        # Technology/Products
        if word in ['Python', 'TensorFlow', 'JavaScript', 'React', 'AI', 'ML']:
            return 'PRODUCT'
        
        # Default to concept
        return 'CONCEPT'
    
    def create_knowledge_graph(self, entities, relations):
        """Create knowledge graph structure"""
        nodes = []
        for entity in entities:
            nodes.append({
                "id": entity["text"],
                "label": entity["text"],
                "type": entity["label"],
                "description": entity["description"],
                "size": entity["size"]
            })
        
        edges = []
        for relation in relations:
            edges.append({
                "source": relation["source"],
                "target": relation["target"],
                "relation": relation["relation"],
                "sentence": relation["sentence"]
            })
        
        return {
            "nodes": nodes,
            "edges": edges,
            "stats": {
                "total_nodes": len(nodes),
                "total_edges": len(edges),
                "density": len(edges) / max(len(nodes) * (len(nodes) - 1) / 2, 1) if len(nodes) > 1 else 0
            }
        }
    
    def process_file(self, file_path, filename):
        """Process uploaded file"""
        # Extract text
        text = self.extract_text_from_pdf_simple(file_path)
        
        # Detect chapters
        chapters = self.detect_chapters(text)
        
        # Process each chapter
        processed_chapters = []
        for i, chapter in enumerate(chapters):
            entities, relations = self.extract_entities_simple(chapter['content'])
            knowledge_graph = self.create_knowledge_graph(entities, relations)
            
            processed_chapter = {
                "id": i + 1,
                "title": chapter['title'],
                "content_preview": chapter['content'][:500] + "..." if len(chapter['content']) > 500 else chapter['content'],
                "word_count": len(chapter['content'].split()),
                "knowledge_graph": knowledge_graph
            }
            processed_chapters.append(processed_chapter)
        
        return {
            "success": True,
            "filename": filename,
            "total_chapters": len(processed_chapters),
            "chapters": processed_chapters
        }

class RequestHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.extractor = SimpleKnowledgeGraphExtractor()
        super().__init__(*args, **kwargs)
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/health':
            self.send_json_response({
                "status": "healthy",
                "spacy_available": False,
                "timestamp": datetime.now().isoformat()
            })
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/upload':
            self.handle_file_upload()
        else:
            self.send_response(404)
            self.end_headers()
    
    def handle_file_upload(self):
        """Handle file upload and processing"""
        try:
            # Parse multipart form data
            content_type = self.headers['content-type']
            if not content_type.startswith('multipart/form-data'):
                self.send_json_response({"error": "Invalid content type"}, 400)
                return
            
            # Create temporary file for upload
            file_id = str(uuid.uuid4())
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            
            # Read the uploaded data
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # For demo purposes, we'll simulate processing
            # In a real implementation, you'd parse the multipart data properly
            temp_file.write(post_data)
            temp_file.close()
            
            # Process the file
            result = self.extractor.process_file(temp_file.name, "demo_document.pdf")
            result["file_id"] = file_id
            
            # Clean up
            os.unlink(temp_file.name)
            
            self.send_json_response(result)
            
        except Exception as e:
            self.send_json_response({"error": f"Processing failed: {str(e)}"}, 500)
    
    def send_json_response(self, data, status_code=200):
        """Send JSON response with CORS headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        response = json.dumps(data, indent=2)
        self.wfile.write(response.encode('utf-8'))
    
    def log_message(self, format, *args):
        """Custom log message"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def main():
    """Start the simple server"""
    server_address = ('localhost', 5000)
    httpd = HTTPServer(server_address, RequestHandler)
    
    print("🚀 Simple Knowledge Graph Extractor Backend")
    print("=" * 50)
    print(f"📍 Server running at: http://localhost:5000")
    print(f"📍 Health check: http://localhost:5000/api/health")
    print("⚠️  Press Ctrl+C to stop the server")
    print()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()

if __name__ == "__main__":
    main()
