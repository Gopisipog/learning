# Test Tavily Research Report Workflow
$webhookUrl = "http://localhost:5678/webhook-test/tavily-research"

$body = @{
    topic = "Quantum Computing Applications 2024"
    searchDepth = "advanced"
    maxResults = 15
} | ConvertTo-Json

Write-Host "Generating research report..." -ForegroundColor Cyan
Write-Host "Topic: Quantum Computing Applications 2024"
Write-Host "This may take 30-60 seconds...`n"

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "Research completed!" -ForegroundColor Green
        Write-Host "Topic: $($response.topic)"
        Write-Host "Total Sections: $($response.totalSections)"
        Write-Host "Total Sources: $($response.totalResults)"
        Write-Host "File Name: $($response.fileName)"
        
        $desktopPath = [Environment]::GetFolderPath("Desktop")
        $saveDir = Join-Path $desktopPath "TavilyResearch"
        if (-not (Test-Path $saveDir)) {
            New-Item -ItemType Directory -Path $saveDir -Force | Out-Null
            Write-Host "`nCreated directory: $saveDir" -ForegroundColor Green
        }
        
        $filePath = Join-Path $saveDir $response.fileName
        $response.htmlContent | Out-File -FilePath $filePath -Encoding UTF8
        
        Write-Host "`nHTML report saved: $filePath" -ForegroundColor Green
        Write-Host "File size: $([Math]::Round((Get-Item $filePath).Length / 1KB, 2)) KB" -ForegroundColor Cyan
        
        Write-Host "`nOpening report in browser..." -ForegroundColor Cyan
        Start-Process $filePath
    } else {
        Write-Host "Error: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nMake sure:" -ForegroundColor Yellow
    Write-Host "  1. n8n is running"
    Write-Host "  2. The 'Tavily Research Report Generator' workflow is active"
    Write-Host "  3. Webhook URL is correct: $webhookUrl"
}
