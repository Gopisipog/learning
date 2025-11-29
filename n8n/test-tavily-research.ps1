# Test Tavily Research Report Generator
# This script tests the comprehensive research workflow

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tavily Research Report Generator" -ForegroundColor Cyan
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
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Research Report Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: AI Research Report
Write-Host "Test 1: Comprehensive AI Research Report" -ForegroundColor Yellow
Write-Host "-----------------------------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "This will generate a detailed research report with:" -ForegroundColor White
Write-Host "  • 5 research sections" -ForegroundColor Gray
Write-Host "  • AI-generated summaries for each section" -ForegroundColor Gray
Write-Host "  • Multiple sources per section" -ForegroundColor Gray
Write-Host "  • Professional HTML formatting" -ForegroundColor Gray
Write-Host "  • Table of contents" -ForegroundColor Gray
Write-Host ""
Write-Host "Generating report... (this may take 30-60 seconds)" -ForegroundColor Cyan

$headers = @{
    "Content-Type" = "application/json"
}

$body1 = @{
    topic = "Artificial Intelligence in Healthcare 2024"
    searchDepth = "advanced"
    maxResults = 15
} | ConvertTo-Json

try {
    $startTime = Get-Date
    $result1 = Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/tavily-research" -Method Post -Headers $headers -Body $body1 -ErrorAction Stop
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    if ($result1.success) {
        Write-Host ""
        Write-Host "✅ Success!" -ForegroundColor Green
        Write-Host "   Topic: $($result1.topic)" -ForegroundColor White
        Write-Host "   Sections: $($result1.totalSections)" -ForegroundColor White
        Write-Host "   Total Sources: $($result1.totalResults)" -ForegroundColor White
        Write-Host "   File: $($result1.fileName)" -ForegroundColor White
        Write-Host "   Location: $($result1.filePath)" -ForegroundColor Cyan
        Write-Host "   Size: $([math]::Round($result1.fileSize / 1024, 2)) KB" -ForegroundColor White
        Write-Host "   Time: $([math]::Round($duration, 1)) seconds" -ForegroundColor White
    } else {
        Write-Host "❌ Failed: $($result1.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible causes:" -ForegroundColor Yellow
    Write-Host "  • Workflow not imported or activated" -ForegroundColor Gray
    Write-Host "  • Invalid Tavily API key" -ForegroundColor Gray
    Write-Host "  • Network connection issue" -ForegroundColor Gray
}

Write-Host ""
Start-Sleep -Seconds 2

# Test 2: Quick Research Report
Write-Host "Test 2: Quick Research - Climate Change" -ForegroundColor Yellow
Write-Host "-----------------------------------------------------------" -ForegroundColor Gray

$body2 = @{
    topic = "Climate Change Solutions"
    searchDepth = "basic"
    maxResults = 10
} | ConvertTo-Json

try {
    $startTime = Get-Date
    $result2 = Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/tavily-research" -Method Post -Headers $headers -Body $body2 -ErrorAction Stop
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    if ($result2.success) {
        Write-Host ""
        Write-Host "✅ Success!" -ForegroundColor Green
        Write-Host "   Topic: $($result2.topic)" -ForegroundColor White
        Write-Host "   Sections: $($result2.totalSections)" -ForegroundColor White
        Write-Host "   Total Sources: $($result2.totalResults)" -ForegroundColor White
        Write-Host "   File: $($result2.fileName)" -ForegroundColor White
        Write-Host "   Location: $($result2.filePath)" -ForegroundColor Cyan
        Write-Host "   Size: $([math]::Round($result2.fileSize / 1024, 2)) KB" -ForegroundColor White
        Write-Host "   Time: $([math]::Round($duration, 1)) seconds" -ForegroundColor White
    } else {
        Write-Host "❌ Failed: $($result2.error)" -ForegroundColor Red
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
Write-Host "  What You Get:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Comprehensive Research Report with:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ✅ Professional Design" -ForegroundColor White
Write-Host "     • Blue gradient header" -ForegroundColor Gray
Write-Host "     • Table of contents with links" -ForegroundColor Gray
Write-Host "     • Numbered sections" -ForegroundColor Gray
Write-Host ""
Write-Host "  ✅ 5 Research Sections" -ForegroundColor White
Write-Host "     • Overview and introduction" -ForegroundColor Gray
Write-Host "     • Latest developments" -ForegroundColor Gray
Write-Host "     • Benefits and advantages" -ForegroundColor Gray
Write-Host "     • Challenges and limitations" -ForegroundColor Gray
Write-Host "     • Future predictions" -ForegroundColor Gray
Write-Host ""
Write-Host "  ✅ AI-Generated Summaries" -ForegroundColor White
Write-Host "     • Key insights for each section" -ForegroundColor Gray
Write-Host "     • Highlighted in yellow boxes" -ForegroundColor Gray
Write-Host ""
Write-Host "  ✅ Multiple Sources" -ForegroundColor White
Write-Host "     • Clickable URLs" -ForegroundColor Gray
Write-Host "     • Relevance scores" -ForegroundColor Gray
Write-Host "     • Content previews" -ForegroundColor Gray
Write-Host ""
Write-Host "  ✅ Print-Ready" -ForegroundColor White
Write-Host "     • Optimized for PDF export" -ForegroundColor Gray
Write-Host "     • Professional formatting" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Next Steps:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Open the HTML report in your browser" -ForegroundColor Yellow
Write-Host "2. Review the comprehensive research" -ForegroundColor Yellow
Write-Host "3. Print to PDF for sharing" -ForegroundColor Yellow
Write-Host "4. Use for presentations or reports" -ForegroundColor Yellow
Write-Host ""
Write-Host "Folder location:" -ForegroundColor Cyan
Write-Host "  $saveFolder" -ForegroundColor White
Write-Host ""

