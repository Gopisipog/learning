# Document Summary with Vector Database - Complete Guide

A powerful n8n workflow that processes documents, generates AI summaries, and stores embeddings in a vector database for semantic search and retrieval.

## 🎯 What This Workflow Does

```
1. Receive document via webhook (text or URL)
   ↓
2. Generate AI-powered summary using OpenAI
   ↓
3. Split document into chunks
   ↓
4. Create embeddings with OpenAI
   ↓
5. Store in Qdrant Vector Database
   ↓
6. Return summary + storage confirmation
```

**Result**: Document is summarized AND stored in vector database for future semantic search!

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Prerequisites

You need:
- ✅ n8n installed and running (`npm start`)
- ✅ OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- ✅ Qdrant instance (local or cloud)

### Step 2: Import Workflow

1. Open n8n: `http://localhost:5678`
2. Click **Workflows** → **Import from File**
3. Select: `workflows/document-summary-vector-db.json`
4. Click **Import**

### Step 3: Configure Credentials

#### OpenAI API Key

1. Click on **"OpenAI Chat Model"** node
2. Click **"Create New Credential"**
3. Enter your OpenAI API key
4. Click **"Save"**
5. Repeat for **"OpenAI Embeddings"** node (or select existing credential)

#### Qdrant Vector Database

1. Click on **"Qdrant Vector Store"** node
2. Click **"Create New Credential"**
3. Enter:
   - **URL**: Your Qdrant instance URL (e.g., `http://localhost:6333` or cloud URL)
   - **API Key**: Your Qdrant API key (if using cloud)
4. Click **"Save"**

### Step 4: Create Qdrant Collection

Before using the workflow, create a collection in Qdrant:

**Option A: Using Qdrant UI**
1. Open Qdrant dashboard
2. Create collection named `documents`
3. Set vector size: `1536` (for OpenAI text-embedding-3-small)
4. Set distance metric: `Cosine`

**Option B: Using API**
```bash
curl -X PUT 'http://localhost:6333/collections/documents' \
  -H 'Content-Type: application/json' \
  -d '{
    "vectors": {
      "size": 1536,
      "distance": "Cosine"
    }
  }'
```

### Step 5: Activate Workflow

1. Click the **"Inactive"** toggle (top right)
2. It should change to **"Active"**
3. Your webhook is now live!

---

## 📬 How to Use

### Test with PowerShell

```powershell
$body = @{
    documentText = "Artificial Intelligence is transforming industries worldwide. Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions. Deep learning, a subset of machine learning, uses neural networks to solve complex problems."
    collectionName = "documents"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook/document-summary" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Test with cURL

```bash
curl -X POST http://localhost:5678/webhook/document-summary \
  -H "Content-Type: application/json" \
  -d '{
    "documentText": "Your document text here...",
    "collectionName": "documents"
  }'
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documentText` | string | Yes | The document text to process |
| `collectionName` | string | No | Qdrant collection name (default: "documents") |

### Response Format

```json
{
  "success": true,
  "summary": "AI-generated summary of your document...",
  "vectorStoreStatus": "stored",
  "chunksStored": 3,
  "timestamp": "2025-11-27T10:30:00.000Z",
  "message": "Document processed and stored in vector database"
}
```

---

## 🏗️ Workflow Architecture

### Node Breakdown

| Node | Type | Purpose |
|------|------|---------|
| **Webhook Trigger** | Trigger | Receives POST requests with document data |
| **Extract Parameters** | Code | Parses request body and extracts parameters |
| **Prepare Document** | Set | Formats document data for processing |
| **Summarization Chain** | LangChain | Generates AI summary using OpenAI |
| **OpenAI Chat Model** | LangChain | Powers the summarization |
| **Document Loader** | LangChain | Loads document for vector storage |
| **Text Splitter** | LangChain | Splits text into 2000-char chunks |
| **OpenAI Embeddings** | LangChain | Creates vector embeddings |
| **Qdrant Vector Store** | LangChain | Stores embeddings in Qdrant |
| **Merge Results** | Merge | Combines summary + storage results |
| **Format Response** | Set | Formats final response |
| **Respond to Webhook** | Response | Returns JSON response |

### Data Flow

```
Webhook → Extract → Prepare
                      ↓
            ┌─────────┴─────────┐
            ↓                   ↓
    Summarization          Vector Store
    (OpenAI GPT)          (Embeddings)
            ↓                   ↓
            └─────────┬─────────┘
                      ↓
                    Merge
                      ↓
                   Format
                      ↓
                   Response
```

---

## 🎨 Customization Options

### Change Chunk Size

Edit the **"Text Splitter"** node:
```json
{
  "chunkSize": 2000  // Change to 1000, 3000, etc.
}
```

### Change Summary Length

Edit the **"Summarization Chain"** node:
```json
{
  "chunkSize": 4000  // Larger = more detailed summary
}
```

### Use Different OpenAI Model

Edit the **"OpenAI Chat Model"** node:
```json
{
  "model": "gpt-4"  // Options: gpt-4, gpt-4-turbo, gpt-3.5-turbo
}
```

### Change Embedding Model

Edit the **"OpenAI Embeddings"** node:
```json
{
  "model": "text-embedding-3-large"  // For higher quality (3072 dimensions)
}
```

**Note**: If you change embedding model, update Qdrant collection vector size!

---

## 🔍 Advanced Use Cases

