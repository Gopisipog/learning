from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import uuid
from werkzeug.utils import secure_filename
import PyPDF2
import networkx as nx
from collections import defaultdict, Counter
import json
import re
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Simple NLP without spaCy for demo purposes
nlp = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class PDFProcessor:
    def __init__(self):
        self.nlp = nlp
        
    def extract_text_from_pdf(self, pdf_path):
        """Extract text from PDF file"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page_num, page in enumerate(pdf_reader.pages):
                    try:
                        page_text = page.extract_text()
                        text += f"\n--- Page {page_num + 1} ---\n{page_text}"
                    except Exception as e:
                        logger.warning(f"Error extracting text from page {page_num + 1}: {e}")
                        continue
                return text
        except Exception as e:
            logger.error(f"Error reading PDF: {e}")
            return None
    
    def detect_chapters(self, text):
        """Detect chapter boundaries in the text"""
        # Common chapter patterns
        chapter_patterns = [
            r'(?i)^chapter\s+\d+',
            r'(?i)^chapter\s+[ivxlcdm]+',  # Roman numerals
            r'(?i)^\d+\.\s+[A-Z]',
            r'(?i)^[A-Z][A-Z\s]{10,}$',  # All caps titles
            r'(?i)^part\s+\d+',
            r'(?i)^section\s+\d+'
        ]
        
        lines = text.split('\n')
        chapters = []
        current_chapter = {"title": "Introduction", "content": "", "start_line": 0}
        
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
                
            # Check if line matches chapter pattern
            is_chapter = False
            for pattern in chapter_patterns:
                if re.match(pattern, line):
                    is_chapter = True
                    break
            
            if is_chapter and len(current_chapter["content"]) > 100:  # Minimum content length
                chapters.append(current_chapter)
                current_chapter = {
                    "title": line[:100],  # Limit title length
                    "content": "",
                    "start_line": i
                }
            else:
                current_chapter["content"] += line + "\n"
        
        # Add the last chapter
        if current_chapter["content"]:
            chapters.append(current_chapter)
        
        # If no chapters detected, treat entire text as one chapter
        if len(chapters) <= 1:
            chapters = [{
                "title": "Complete Document",
                "content": text,
                "start_line": 0
            }]
        
        return chapters
    
    def extract_entities_and_relations(self, text):
        """Extract entities and relationships from text using simple pattern matching"""
        # Simple entity extraction using basic patterns
        entities = []
        relations = []

        # Simple patterns for common entities
        import re

        # Extract capitalized words as potential entities
        words = text.split()
        capitalized_words = []

        for i, word in enumerate(words):
            # Clean word of punctuation
            clean_word = re.sub(r'[^\w\s]', '', word)
            if clean_word and clean_word[0].isupper() and len(clean_word) > 2:
                # Skip common words
                if clean_word.lower() not in ['the', 'and', 'but', 'for', 'are', 'this', 'that', 'with', 'have', 'will', 'you', 'they', 'been', 'their', 'said', 'each', 'which', 'she', 'how', 'its', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'may', 'put', 'say', 'she', 'too', 'use']:
                    capitalized_words.append(clean_word)

        # Create entities from unique capitalized words
        unique_words = list(set(capitalized_words))
        for i, word in enumerate(unique_words[:20]):  # Limit to 20 entities
            entity_type = self._guess_entity_type(word)
            entities.append({
                "text": word,
                "label": entity_type,
                "start": 0,
                "end": len(word),
                "description": f"Detected {entity_type.lower()}"
            })

        # Create simple relationships between entities
        for i in range(min(len(entities), 10)):
            for j in range(i + 1, min(len(entities), 10)):
                if i != j:
                    relations.append({
                        "source": entities[i]["text"],
                        "target": entities[j]["text"],
                        "relation": "related_to",
                        "sentence": f"{entities[i]['text']} is related to {entities[j]['text']}"
                    })

        return {"entities": entities, "relations": relations}

    def _guess_entity_type(self, word):
        """Simple heuristic to guess entity type"""
        # Common patterns for different entity types
        if any(suffix in word.lower() for suffix in ['corp', 'inc', 'ltd', 'llc', 'company', 'group']):
            return 'ORG'
        elif any(title in word.lower() for title in ['dr', 'prof', 'mr', 'ms', 'mrs']):
            return 'PERSON'
        elif word.lower() in ['usa', 'america', 'china', 'japan', 'germany', 'france', 'uk', 'canada']:
            return 'GPE'
        elif len(word) > 8:  # Longer words might be concepts
            return 'CONCEPT'
        else:
            return 'PERSON'  # Default to person
    
    def create_knowledge_graph(self, entities, relations):
        """Create a knowledge graph structure"""
        # Create NetworkX graph
        G = nx.Graph()
        
        # Add nodes (entities)
        for entity in entities:
            G.add_node(entity["text"], 
                      label=entity["label"], 
                      description=entity["description"])
        
        # Add edges (relations)
        for relation in relations:
            if G.has_node(relation["source"]) and G.has_node(relation["target"]):
                G.add_edge(relation["source"], relation["target"], 
                          relation=relation["relation"],
                          sentence=relation["sentence"])
        
        # Convert to JSON format for frontend
        nodes = []
        for node in G.nodes(data=True):
            nodes.append({
                "id": node[0],
                "label": node[0],
                "type": node[1].get("label", "UNKNOWN"),
                "description": node[1].get("description", ""),
                "size": G.degree(node[0]) * 5 + 10  # Size based on connections
            })
        
        edges = []
        for edge in G.edges(data=True):
            edges.append({
                "source": edge[0],
                "target": edge[1],
                "relation": edge[2].get("relation", "related"),
                "sentence": edge[2].get("sentence", "")
            })
        
        return {
            "nodes": nodes,
            "edges": edges,
            "stats": {
                "total_nodes": len(nodes),
                "total_edges": len(edges),
                "density": nx.density(G) if len(nodes) > 1 else 0
            }
        }

processor = PDFProcessor()

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload and process PDF file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PDF files are allowed.'}), 400
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{file_id}_{filename}")
        
        # Save file
        file.save(file_path)
        
        # Extract text from PDF
        logger.info(f"Processing PDF: {filename}")
        text = processor.extract_text_from_pdf(file_path)
        
        if not text:
            return jsonify({'error': 'Failed to extract text from PDF'}), 500
        
        # Detect chapters
        chapters = processor.detect_chapters(text)
        logger.info(f"Detected {len(chapters)} chapters")
        
        # Process each chapter
        processed_chapters = []
        for i, chapter in enumerate(chapters):
            logger.info(f"Processing chapter {i+1}: {chapter['title'][:50]}...")
            
            # Extract entities and relations
            extraction_result = processor.extract_entities_and_relations(chapter['content'])
            
            if 'error' in extraction_result:
                knowledge_graph = {"nodes": [], "edges": [], "stats": {"total_nodes": 0, "total_edges": 0, "density": 0}}
                error_msg = extraction_result['error']
            else:
                # Create knowledge graph
                knowledge_graph = processor.create_knowledge_graph(
                    extraction_result['entities'], 
                    extraction_result['relations']
                )
                error_msg = None
            
            processed_chapter = {
                "id": i + 1,
                "title": chapter['title'],
                "content_preview": chapter['content'][:500] + "..." if len(chapter['content']) > 500 else chapter['content'],
                "word_count": len(chapter['content'].split()),
                "knowledge_graph": knowledge_graph,
                "error": error_msg
            }
            processed_chapters.append(processed_chapter)
        
        # Save processed data
        result_data = {
            "file_id": file_id,
            "filename": filename,
            "upload_time": datetime.now().isoformat(),
            "total_chapters": len(processed_chapters),
            "chapters": processed_chapters
        }
        
        result_path = os.path.join(app.config['PROCESSED_FOLDER'], f"{file_id}_result.json")
        with open(result_path, 'w', encoding='utf-8') as f:
            json.dump(result_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Processing completed for {filename}")
        
        return jsonify({
            "success": True,
            "file_id": file_id,
            "filename": filename,
            "total_chapters": len(processed_chapters),
            "chapters": processed_chapters
        })
        
    except Exception as e:
        logger.error(f"Error processing file: {e}")
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500

@app.route('/api/files/<file_id>', methods=['GET'])
def get_processed_file(file_id):
    """Retrieve processed file data"""
    try:
        result_path = os.path.join(app.config['PROCESSED_FOLDER'], f"{file_id}_result.json")
        
        if not os.path.exists(result_path):
            return jsonify({'error': 'File not found'}), 404
        
        with open(result_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return jsonify(data)
        
    except Exception as e:
        logger.error(f"Error retrieving file {file_id}: {e}")
        return jsonify({'error': 'Failed to retrieve file'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "spacy_available": nlp is not None,
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
