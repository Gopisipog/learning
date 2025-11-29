# Test Tavily Search Workflow via Webhook
# This sends a request to the n8n workflow and saves the response to a file

$webhookUrl = "http://localhost:5678/webhook/tavily-search"

# Search parameters
$body = @{
    query = "AI trends 2024"
    maxResults = 5
    searchDepth = "basic"
} | ConvertTo-Json

Write-Host "Sending search request to n8n workflow..." -ForegroundColor Cyan
Write-Host "Query: AI trends 2024`n"

try {
    # Send request to n8n webhook
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "✓ Search completed!" -ForegroundColor Green
    Write-Host "`nResults:" -ForegroundColor Yellow
    Write-Host "  Query: $($response.data.query)"
    Write-Host "  Results Count: $($response.data.resultsCount)"
    Write-Host "  File Name: $($response.data.fileName)"
    Write-Host "  Answer: $($response.data.answer.Substring(0, [Math]::Min(100, $response.data.answer.Length)))..."
    
    # Determine file type and content
    $fileName = $response.data.fileName
    if ($response.data.htmlContent) {
        $content = $response.data.htmlContent
        $fileType = "HTML"
    } else {
        $content = $response.data.textContent
        $fileType = "Text"
    }
    
    # Create Desktop/TavilySearches directory if it doesn't exist
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $saveDir = Join-Path $desktopPath "TavilySearches"
    if (-not (Test-Path $saveDir)) {
        New-Item -ItemType Directory -Path $saveDir -Force | Out-Null
        Write-Host "`n✓ Created directory: $saveDir" -ForegroundColor Green
    }
    
    # Save to Desktop/TavilySearches folder
    $filePath = Join-Path $saveDir $fileName
    $content | Out-File -FilePath $filePath -Encoding UTF8
    
    Write-Host "`n✓ $fileType file saved: $filePath" -ForegroundColor Green
    Write-Host "`nFile size: $([Math]::Round((Get-Item $filePath).Length / 1KB, 2)) KB" -ForegroundColor Cyan
    
    # Open the file in default browser if HTML
    if ($fileType -eq "HTML") {
        Write-Host "`nOpening file in browser..." -ForegroundColor Cyan
        Start-Process $filePath
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nMake sure:" -ForegroundColor Yellow
    Write-Host "  1. n8n is running (npm start)"
    Write-Host "  2. Workflow is active in n8n"
    Write-Host "  3. Webhook URL is correct: $webhookUrl"
}
