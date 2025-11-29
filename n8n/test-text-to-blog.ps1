# Test Text to Blog AI Publisher Workflow
# This script tests the blog generation workflow

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Text to Blog AI Publisher Test" -ForegroundColor Cyan
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

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Testing Blog Generation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This will:" -ForegroundColor White
Write-Host "  1. Send text to the workflow" -ForegroundColor Gray
Write-Host "  2. AI transforms it into a blog post" -ForegroundColor Gray
Write-Host "  3. Formats it with HTML" -ForegroundColor Gray
Write-Host "  4. Returns the blog content" -ForegroundColor Gray
Write-Host ""

$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    text = @"
Artificial intelligence is revolutionizing healthcare in unprecedented ways. Machine learning algorithms can now analyze medical images with accuracy rivaling human experts. AI-powered diagnostic tools help doctors detect diseases earlier, leading to better patient outcomes. Personalized treatment plans are being created using AI analysis of patient data. Virtual health assistants provide 24/7 support to patients. The integration of AI in healthcare is reducing costs while improving the quality of care.
"@
    title = "AI in Healthcare: A Revolution in Medical Care"
    author = "Dr. Tech Writer"
} | ConvertTo-Json

Write-Host "Generating blog post..." -ForegroundColor Cyan
Write-Host "Topic: AI in Healthcare" -ForegroundColor White
Write-Host ""

# Try Test URL first
$testUrl = "http://localhost:5678/webhook-test/create-blog"

try {
    Write-Host "Calling webhook: $testUrl" -ForegroundColor Yellow
    $startTime = Get-Date
    
    $result = Invoke-RestMethod -Uri $testUrl `
        -Method Post `
        -Headers $headers `
        -Body $body `
        -TimeoutSec 60 `
        -ErrorAction Stop
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host ""
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Blog Post Generated:" -ForegroundColor Cyan
    Write-Host "  Title: $($result.blogTitle)" -ForegroundColor White
    Write-Host "  Author: $($result.author)" -ForegroundColor White
    Write-Host "  Word Count: $($result.wordCount)" -ForegroundColor White
    Write-Host "  Duration: $([math]::Round($duration, 1)) seconds" -ForegroundColor White
    Write-Host ""
    
    if ($result.blogContent) {
        Write-Host "Blog Content Preview:" -ForegroundColor Cyan
        $preview = $result.blogContent.Substring(0, [Math]::Min(300, $result.blogContent.Length))
        Write-Host $preview -ForegroundColor Gray
        Write-Host "..." -ForegroundColor Gray
        Write-Host ""
        
        # Save to file
        $desktopPath = [Environment]::GetFolderPath("Desktop")
        $saveDir = Join-Path $desktopPath "BlogPosts"
        
        if (-not (Test-Path $saveDir)) {
            New-Item -ItemType Directory -Path $saveDir -Force | Out-Null
        }
        
        $fileName = "blog-post-$(Get-Date -Format 'yyyyMMdd-HHmmss').html"
        $filePath = Join-Path $saveDir $fileName
        
        # Create full HTML file
        $fullHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$($result.blogTitle)</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        .meta {
            color: #7f8c8d;
            font-style: italic;
            margin-bottom: 30px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
        }
        h3 {
            color: #555;
        }
        p {
            margin: 15px 0;
        }
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        strong {
            color: #2c3e50;
        }
    </style>
</head>
<body>
    <h1>$($result.blogTitle)</h1>
    <div class="meta">By $($result.author) | $(Get-Date -Format 'MMMM dd, yyyy')</div>
    $($result.blogContent)
</body>
</html>
"@
        
        $fullHtml | Out-File -FilePath $filePath -Encoding UTF8
        
        Write-Host "Blog post saved to:" -ForegroundColor Green
        Write-Host "  $filePath" -ForegroundColor Cyan
        Write-Host ""
        
        # Ask to open
        Write-Host "Would you like to open the blog post in your browser? (Y/N)" -ForegroundColor Yellow
        $response = Read-Host
        
        if ($response -eq "Y" -or $response -eq "y") {
            Start-Process $filePath
            Write-Host "✅ Blog post opened in browser!" -ForegroundColor Green
        }
    }
    
} catch {
    Write-Host "❌ Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. Is the 'Text to Blog AI Publisher' workflow imported?" -ForegroundColor White
    Write-Host "  2. Is the workflow ACTIVE (green toggle in top-right)?" -ForegroundColor White
    Write-Host "  3. Is the workflow saved?" -ForegroundColor White
    Write-Host "  4. Do you have OpenAI credentials configured?" -ForegroundColor White
    Write-Host ""
    Write-Host "To activate the workflow:" -ForegroundColor Cyan
    Write-Host "  1. Open n8n: http://localhost:5678" -ForegroundColor White
    Write-Host "  2. Click on 'Text to Blog AI Publisher' workflow" -ForegroundColor White
    Write-Host "  3. Click the toggle in top-right (make it GREEN)" -ForegroundColor White
    Write-Host "  4. Save the workflow (Ctrl+S)" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Test Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

