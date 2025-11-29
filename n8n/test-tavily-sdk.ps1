# Test Tavily Research Script using @tavily/core SDK
# This script tests the standalone Node.js research script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tavily SDK Research Script Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

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
Write-Host "  Running Research Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: AI in Healthcare
Write-Host "Test 1: AI in Healthcare Research" -ForegroundColor Yellow
Write-Host "-----------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

$env:TAVILY_API_KEY = "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"

try {
    node tavily-research-script.js "Artificial Intelligence in Healthcare 2024" "advanced" "15"
    Write-Host ""
    Write-Host "✅ Test 1 Complete!" -ForegroundColor Green
} catch {
    Write-Host "❌ Test 1 Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Complete!" -ForegroundColor Cyan
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
Write-Host "  Usage Examples:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Basic usage:" -ForegroundColor Cyan
Write-Host '  node tavily-research-script.js "Your Topic"' -ForegroundColor White
Write-Host ""
Write-Host "With search depth:" -ForegroundColor Cyan
Write-Host '  node tavily-research-script.js "Your Topic" "advanced"' -ForegroundColor White
Write-Host ""
Write-Host "With max results:" -ForegroundColor Cyan
Write-Host '  node tavily-research-script.js "Your Topic" "advanced" "20"' -ForegroundColor White
Write-Host ""
Write-Host "Examples:" -ForegroundColor Cyan
Write-Host '  node tavily-research-script.js "Quantum Computing 2024"' -ForegroundColor White
Write-Host '  node tavily-research-script.js "Climate Change Solutions" "basic" "10"' -ForegroundColor White
Write-Host '  node tavily-research-script.js "Blockchain Technology" "advanced" "15"' -ForegroundColor White
Write-Host ""

