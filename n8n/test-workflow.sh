#!/bin/bash

# Test script for the Text to Blog AI Publisher workflow
# Make sure n8n is running before executing this script

WEBHOOK_URL="http://localhost:5678/webhook/create-blog"

echo "Testing Text to Blog AI Publisher Workflow"
echo "==========================================="
echo ""
echo "Sending request to: $WEBHOOK_URL"
echo ""

curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d @example-request.json \
  | jq '.'

echo ""
echo "Test completed!"

