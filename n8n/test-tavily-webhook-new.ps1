# Test Tavily Search Workflow via Webhook
$webhookUrl = "http://localhost:5678/webhook/tavily-search"

$body = @{
    query = "AI trends 2024"
    maxResults = 5
    searchDepth = "basic"
} | ConvertTo-Json

Write-Host "Sending search request to n8n workflow..." -ForegroundColor Cyan
Write-Host "Query: AI trends 2024"

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "Search completed!" -ForegroundColor Green
    Write-Host "Query: $($response.data.query)"
    Write-Host "Results Count: $($response.data.resultsCount)"
    Write-Host "File Name: $($response.data.fileName)"
    
    $fileName = $response.data.fileName
    if ($response.data.htmlContent) {
        $content = $response.data.htmlContent
        $fileType = "HTML"
    } else {
        $content = $response.data.textContent
        $fileType = "Text"
    }
    
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $saveDir = Join-Path $desktopPath "TavilySearches"
    if (-not (Test-Path $saveDir)) {
        New-Item -ItemType Directory -Path $saveDir -Force | Out-Null
        Write-Host "Created directory: $saveDir" -ForegroundColor Green
    }
    
    $filePath = Join-Path $saveDir $fileName
    $content | Out-File -FilePath $filePath -Encoding UTF8
    
    Write-Host "$fileType file saved: $filePath" -ForegroundColor Green
    
    if ($fileType -eq "HTML") {
        Write-Host "Opening file in browser..." -ForegroundColor Cyan
        Start-Process $filePath
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure n8n is running and the workflow is active" -ForegroundColor Yellow
}
