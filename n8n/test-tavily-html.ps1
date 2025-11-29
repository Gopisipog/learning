# Test Tavily Search to HTML File Workflow
# This script tests the n8n workflow that saves Tavily search results as HTML

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tavily Search to HTML - Test Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if n8n is running
Write-Host "Checking if n8n is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5678" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ n8n is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: n8n is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start n8n first:" -ForegroundColor Yellow
    Write-Host "  npm start" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Running 3 test searches..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Simple search
Write-Host "Test 1: Simple Search - 'What is artificial intelligence?'" -ForegroundColor Yellow
Write-Host "-----------------------------------------------------------" -ForegroundColor Gray

$headers = @{
    "Content-Type" = "application/json"
}

$body1 = @{
    query = "What is artificial intelligence?"
    maxResults = 5
    searchDepth = "basic"
} | ConvertTo-Json

try {
    $result1 = Invoke-RestMethod -Uri "http://localhost:5678/webhook/tavily-search" -Method Post -Headers $headers -Body $body1 -ErrorAction Stop
    
    if ($result1.success) {
        Write-Host "✅ Success!" -ForegroundColor Green
        Write-Host "   Query: $($result1.data.query)" -ForegroundColor White
        Write-Host "   Results: $($result1.data.resultsCount)" -ForegroundColor White
        Write-Host "   File: $($result1.data.fileName)" -ForegroundColor White
        Write-Host "   Location: $($result1.data.filePath)" -ForegroundColor Cyan
        Write-Host "   Size: $([math]::Round($result1.data.fileSize / 1024, 2)) KB" -ForegroundColor White
    } else {
        Write-Host "❌ Failed: $($result1.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Start-Sleep -Seconds 2

# Test 2: Advanced search
Write-Host "Test 2: Advanced Search - 'Latest AI trends 2024'" -ForegroundColor Yellow
Write-Host "-----------------------------------------------------------" -ForegroundColor Gray

$body2 = @{
    query = "Latest AI trends 2024"
    maxResults = 10
    searchDepth = "advanced"
} | ConvertTo-Json

try {
    $result2 = Invoke-RestMethod -Uri "http://localhost:5678/webhook/tavily-search" -Method Post -Headers $headers -Body $body2 -ErrorAction Stop
    
    if ($result2.success) {
        Write-Host "✅ Success!" -ForegroundColor Green
        Write-Host "   Query: $($result2.data.query)" -ForegroundColor White
        Write-Host "   Results: $($result2.data.resultsCount)" -ForegroundColor White
        Write-Host "   File: $($result2.data.fileName)" -ForegroundColor White
        Write-Host "   Location: $($result2.data.filePath)" -ForegroundColor Cyan
        Write-Host "   Size: $([math]::Round($result2.data.fileSize / 1024, 2)) KB" -ForegroundColor White
    } else {
        Write-Host "❌ Failed: $($result2.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Start-Sleep -Seconds 2

# Test 3: Quick search
Write-Host "Test 3: Quick Search - 'Python programming tips'" -ForegroundColor Yellow
Write-Host "-----------------------------------------------------------" -ForegroundColor Gray

$body3 = @{
    query = "Python programming tips"
    maxResults = 3
    searchDepth = "basic"
} | ConvertTo-Json

try {
    $result3 = Invoke-RestMethod -Uri "http://localhost:5678/webhook/tavily-search" -Method Post -Headers $headers -Body $body3 -ErrorAction Stop
    
    if ($result3.success) {
        Write-Host "✅ Success!" -ForegroundColor Green
        Write-Host "   Query: $($result3.data.query)" -ForegroundColor White
        Write-Host "   Results: $($result3.data.resultsCount)" -ForegroundColor White
        Write-Host "   File: $($result3.data.fileName)" -ForegroundColor White
        Write-Host "   Location: $($result3.data.filePath)" -ForegroundColor Cyan
        Write-Host "   Size: $([math]::Round($result3.data.fileSize / 1024, 2)) KB" -ForegroundColor White
    } else {
        Write-Host "❌ Failed: $($result3.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get Desktop path
$desktopPath = [Environment]::GetFolderPath("Desktop")
$saveFolder = Join-Path $desktopPath "TavilySearches"

Write-Host "HTML files saved to:" -ForegroundColor Yellow
Write-Host "  $saveFolder" -ForegroundColor Cyan
Write-Host ""

# Check if folder exists and list files
if (Test-Path $saveFolder) {
    $files = Get-ChildItem -Path $saveFolder -Filter "*.html" | Sort-Object LastWriteTime -Descending | Select-Object -First 5
    
    if ($files.Count -gt 0) {
        Write-Host "Recent HTML files:" -ForegroundColor Yellow
        foreach ($file in $files) {
            Write-Host "  📄 $($file.Name)" -ForegroundColor White
            Write-Host "     Size: $([math]::Round($file.Length / 1024, 2)) KB" -ForegroundColor Gray
            Write-Host "     Modified: $($file.LastWriteTime)" -ForegroundColor Gray
        }
        Write-Host ""
        
        # Ask to open the latest file
        Write-Host "Would you like to open the latest HTML file in your browser? (Y/N)" -ForegroundColor Yellow
        $response = Read-Host
        
        if ($response -eq "Y" -or $response -eq "y") {
            $latestFile = $files[0].FullName
            Write-Host "Opening: $($files[0].Name)" -ForegroundColor Cyan
            Start-Process $latestFile
        }
    } else {
        Write-Host "No HTML files found in the folder." -ForegroundColor Gray
    }
} else {
    Write-Host "Folder not found. Files may not have been created." -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Next Steps:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Open the HTML files in your browser" -ForegroundColor Yellow
Write-Host "2. Check the beautiful formatted search results" -ForegroundColor Yellow
Write-Host "3. Share or save the HTML files" -ForegroundColor Yellow
Write-Host ""
Write-Host "Folder location:" -ForegroundColor Cyan
Write-Host "  $saveFolder" -ForegroundColor White
Write-Host ""

