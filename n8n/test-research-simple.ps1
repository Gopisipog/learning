# Test Tavily Research Simple Workflow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tavily Research Test" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$webhookUrl = "http://localhost:5678/webhook-test/tavily-research"

$body = @{
    topic = "Quantum Computing 2024"
    searchDepth = "basic"
    maxResults = 5
} | ConvertTo-Json

Write-Host "Sending research request..." -ForegroundColor Yellow
Write-Host "Topic: Quantum Computing 2024" -ForegroundColor White
Write-Host "URL: $webhookUrl`n" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "✅ Research completed!" -ForegroundColor Green
    Write-Host "`nResults:" -ForegroundColor Cyan
    Write-Host "  Topic: $($response.topic)" -ForegroundColor White
    Write-Host "  Results: $($response.resultsCount)" -ForegroundColor White
    Write-Host "  File: $($response.fileName)" -ForegroundColor White
    
    # Save to Desktop
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $saveDir = Join-Path $desktopPath "TavilyResearch"
    
    if (-not (Test-Path $saveDir)) {
        New-Item -ItemType Directory -Path $saveDir -Force | Out-Null
        Write-Host "`n✅ Created: $saveDir" -ForegroundColor Green
    }
    
    $filePath = Join-Path $saveDir $response.fileName
    $response.htmlContent | Out-File -FilePath $filePath -Encoding UTF8
    
    Write-Host "`n✅ Saved: $filePath" -ForegroundColor Green
    Write-Host "   Size: $([Math]::Round((Get-Item $filePath).Length / 1KB, 2)) KB`n" -ForegroundColor Gray
    
    # Open in browser
    Write-Host "Opening in browser..." -ForegroundColor Cyan
    Start-Process $filePath
    
} catch {
    $errorMsg = $_.Exception.Message
    Write-Host "`n❌ Error: $errorMsg`n" -ForegroundColor Red
    
    if ($errorMsg -like "*404*" -or $errorMsg -like "*not registered*") {
        Write-Host "The webhook is not registered. Please:" -ForegroundColor Yellow
        Write-Host "1. Import workflows/tavily-research-simple.json into n8n" -ForegroundColor White
        Write-Host "2. Save the workflow" -ForegroundColor White
        Write-Host "3. Click the Webhook node to see the Test URL" -ForegroundColor White
        Write-Host "4. Run this script again`n" -ForegroundColor White
    } elseif ($errorMsg -like "*Unable to connect*") {
        Write-Host "n8n is not running. Please:" -ForegroundColor Yellow
        Write-Host "1. Start n8n: npm start" -ForegroundColor White
        Write-Host "2. Wait for it to start" -ForegroundColor White
        Write-Host "3. Run this script again`n" -ForegroundColor White
    }
}

Write-Host "========================================`n" -ForegroundColor Cyan
