# Find the Correct Webhook URL
# This script tests different webhook URL variations to find the correct one

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Webhook URL Finder" -ForegroundColor Cyan
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
Write-Host "Testing different webhook URL variations..." -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    topic = "Test Topic"
    searchDepth = "basic"
    maxResults = 5
} | ConvertTo-Json

# List of possible URLs to test
$urls = @(
    "http://localhost:5678/webhook-test/tavily-research-sdk",
    "http://localhost:5678/webhook/tavily-research-sdk",
    "http://localhost:5678/webhook-test/create-blog/tavily-research-sdk",
    "http://localhost:5678/webhook/create-blog/tavily-research-sdk",
    "http://localhost:5678/webhook-test/tavily-research",
    "http://localhost:5678/webhook/tavily-research"
)

$workingUrl = $null

foreach ($url in $urls) {
    Write-Host "Testing: $url" -ForegroundColor Yellow
    
    try {
        $result = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -TimeoutSec 10 -ErrorAction Stop
        Write-Host "  ✅ SUCCESS! This URL works!" -ForegroundColor Green
        $workingUrl = $url
        break
    } catch {
        $errorMsg = $_.Exception.Message
        if ($errorMsg -like "*404*" -or $errorMsg -like "*not registered*") {
            Write-Host "  ❌ Not found" -ForegroundColor Red
        } elseif ($errorMsg -like "*timeout*") {
            Write-Host "  ⏱️  Timeout (workflow might be running)" -ForegroundColor Yellow
        } else {
            Write-Host "  ⚠️  Error: $errorMsg" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Results" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($workingUrl) {
    Write-Host "✅ Found working webhook URL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Use this URL in your scripts:" -ForegroundColor Cyan
    Write-Host "  $workingUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "Update your test scripts with this URL!" -ForegroundColor Yellow
} else {
    Write-Host "❌ No working webhook URL found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. Is the workflow imported in n8n?" -ForegroundColor White
    Write-Host "  2. Is the workflow saved?" -ForegroundColor White
    Write-Host "  3. Open the workflow in n8n" -ForegroundColor White
    Write-Host "  4. Click the Webhook node" -ForegroundColor White
    Write-Host "  5. Copy the 'Test URL' shown" -ForegroundColor White
    Write-Host "  6. Use that exact URL" -ForegroundColor White
    Write-Host ""
    Write-Host "The Webhook node will show you the exact URL to use!" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Manual Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To find the exact webhook URL:" -ForegroundColor Yellow
Write-Host "  1. Open n8n: http://localhost:5678" -ForegroundColor White
Write-Host "  2. Open the 'Tavily Research (SDK)' workflow" -ForegroundColor White
Write-Host "  3. Click the 'Webhook' node (first node)" -ForegroundColor White
Write-Host "  4. Look for 'Test URL' in the node settings" -ForegroundColor White
Write-Host "  5. Copy that exact URL" -ForegroundColor White
Write-Host "  6. Use it in your test scripts" -ForegroundColor White
Write-Host ""

