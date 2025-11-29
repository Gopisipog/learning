# Test Tavily Search to File Workflow
# PowerShell script to test the workflow

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tavily Search to File - Test Script  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$webhookUrl = "http://localhost:5678/webhook/tavily-search"

# Test 1: Simple search
Write-Host "Test 1: Simple Search" -ForegroundColor Yellow
Write-Host "Query: 'What is artificial intelligence?'" -ForegroundColor Gray
Write-Host ""

$body1 = @{
    query = "What is artificial intelligence?"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri $webhookUrl -Method Post -ContentType "application/json" -Body $body1
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "  File: $($response1.data.fileName)" -ForegroundColor Gray
    Write-Host "  Results: $($response1.data.resultsCount)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Start-Sleep -Seconds 2

# Test 2: Advanced search
Write-Host "Test 2: Advanced Search" -ForegroundColor Yellow
Write-Host "Query: 'Climate change solutions'" -ForegroundColor Gray
Write-Host "Max Results: 5" -ForegroundColor Gray
Write-Host "Search Depth: advanced" -ForegroundColor Gray
Write-Host ""

$body2 = @{
    query = "Climate change solutions"
    maxResults = 5
    searchDepth = "advanced"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri $webhookUrl -Method Post -ContentType "application/json" -Body $body2
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "  File: $($response2.data.fileName)" -ForegroundColor Gray
    Write-Host "  Results: $($response2.data.resultsCount)" -ForegroundColor Gray
    Write-Host "  Answer: $($response2.data.answer.Substring(0, [Math]::Min(100, $response2.data.answer.Length)))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Start-Sleep -Seconds 2

# Test 3: Quick search
Write-Host "Test 3: Quick Search" -ForegroundColor Yellow
Write-Host "Query: 'Python programming tips'" -ForegroundColor Gray
Write-Host "Max Results: 3" -ForegroundColor Gray
Write-Host ""

$body3 = @{
    query = "Python programming tips"
    maxResults = 3
    searchDepth = "basic"
} | ConvertTo-Json

try {
    $response3 = Invoke-RestMethod -Uri $webhookUrl -Method Post -ContentType "application/json" -Body $body3
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "  File: $($response3.data.fileName)" -ForegroundColor Gray
    Write-Host "  Results: $($response3.data.resultsCount)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Complete!                        " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files saved to: $env:USERPROFILE\.n8n\" -ForegroundColor Yellow
Write-Host ""
Write-Host "To view files:" -ForegroundColor Gray
Write-Host "  cd $env:USERPROFILE\.n8n" -ForegroundColor White
Write-Host "  dir tavily-search-*.txt" -ForegroundColor White
Write-Host ""

