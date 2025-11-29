# Test Tavily Research Workflow (SDK Version)
# This script tests the n8n workflow that calls the Tavily SDK script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tavily Research Workflow (SDK) Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if n8n is running
Write-Host "Checking if n8n is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5678" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ n8n is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ n8n is NOT running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start n8n first:" -ForegroundColor Yellow
    Write-Host "  npm start" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Check if @tavily/core is installed
Write-Host "Checking if @tavily/core is installed..." -ForegroundColor Yellow
if (Test-Path "node_modules/@tavily") {
    Write-Host "✅ @tavily/core is installed!" -ForegroundColor Green
} else {
    Write-Host "❌ @tavily/core is NOT installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installing @tavily/core..." -ForegroundColor Yellow
    npm install @tavily/core
    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Running Workflow Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test: AI in Healthcare Research
Write-Host "Test: AI in Healthcare Research (via n8n workflow)" -ForegroundColor Yellow
Write-Host "-----------------------------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "This will:" -ForegroundColor White
Write-Host "  1. Call n8n webhook" -ForegroundColor Gray
Write-Host "  2. n8n executes tavily-research-script.js" -ForegroundColor Gray
Write-Host "  3. Script uses @tavily/core SDK" -ForegroundColor Gray
Write-Host "  4. Generates 5-section research report" -ForegroundColor Gray
Write-Host "  5. Saves HTML to Desktop/TavilyResearch/" -ForegroundColor Gray
Write-Host "  6. Returns JSON result" -ForegroundColor Gray
Write-Host ""
Write-Host "Generating report... (this may take 30-60 seconds)" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    topic = "Artificial Intelligence in Healthcare 2024"
    searchDepth = "advanced"
    maxResults = 15
} | ConvertTo-Json

try {
    $startTime = Get-Date
    $result = Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/tavily-research-sdk" `
        -Method Post -Headers $headers -Body $body -TimeoutSec 120 -ErrorAction Stop
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host ""
    if ($result.success) {
        Write-Host "✅ Success!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Research Report Details:" -ForegroundColor Cyan
        Write-Host "  Topic: $($result.topic)" -ForegroundColor White
        Write-Host "  Sections: $($result.totalSections)" -ForegroundColor White
        Write-Host "  Sources: $($result.totalResults)" -ForegroundColor White
        Write-Host "  File: $($result.fileName)" -ForegroundColor White
        Write-Host "  Path: $($result.filePath)" -ForegroundColor White
        Write-Host "  Size: $([math]::Round($result.fileSize / 1024, 2)) KB" -ForegroundColor White
        Write-Host "  Duration: $([math]::Round($duration, 1)) seconds" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "❌ Failed!" -ForegroundColor Red
        Write-Host "  Error: $($result.error)" -ForegroundColor Red
        if ($result.stderr) {
            Write-Host "  Stderr: $($result.stderr)" -ForegroundColor Red
        }
        Write-Host ""
    }
} catch {
    Write-Host "❌ Test Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Checking Output Files" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get Desktop path
$desktopPath = [Environment]::GetFolderPath("Desktop")
$saveFolder = Join-Path $desktopPath "TavilyResearch"

Write-Host "Research reports saved to:" -ForegroundColor Yellow
Write-Host "  $saveFolder" -ForegroundColor Cyan
Write-Host ""

# Check if folder exists and list files
if (Test-Path $saveFolder) {
    $files = Get-ChildItem -Path $saveFolder -Filter "*.html" | Sort-Object LastWriteTime -Descending | Select-Object -First 5
    
    if ($files.Count -gt 0) {
        Write-Host "Recent research reports:" -ForegroundColor Yellow
        foreach ($file in $files) {
            Write-Host "  📊 $($file.Name)" -ForegroundColor White
            Write-Host "     Size: $([math]::Round($file.Length / 1024, 2)) KB" -ForegroundColor Gray
            Write-Host "     Modified: $($file.LastWriteTime)" -ForegroundColor Gray
        }
        Write-Host ""
        
        # Ask to open the latest file
        Write-Host "Would you like to open the latest research report in your browser? (Y/N)" -ForegroundColor Yellow
        $response = Read-Host
        
        if ($response -eq "Y" -or $response -eq "y") {
            $latestFile = $files[0].FullName
            Write-Host "Opening: $($files[0].Name)" -ForegroundColor Cyan
            Start-Process $latestFile
            Write-Host ""
            Write-Host "✅ Report opened in your default browser!" -ForegroundColor Green
        }
    } else {
        Write-Host "No research reports found in the folder." -ForegroundColor Gray
    }
} else {
    Write-Host "Folder not found. Reports may not have been created." -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Test Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

