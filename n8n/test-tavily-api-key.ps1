# Test Tavily API Key
# This script tests if your Tavily API key is valid

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tavily API Key Tester" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for API key
$apiKey = Read-Host "Enter your Tavily API key (starts with tvly-)"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "❌ Error: API key cannot be empty!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Get your API key from: https://tavily.com/" -ForegroundColor Yellow
    exit 1
}

if (-not $apiKey.StartsWith("tvly-")) {
    Write-Host "⚠️  Warning: API key should start with 'tvly-'" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Testing API key: $($apiKey.Substring(0, 10))..." -ForegroundColor Cyan
Write-Host ""

# Test API
try {
    $headers = @{
        "Content-Type" = "application/json"
    }

    $body = @{
        api_key = $apiKey
        query = "Hello World"
        max_results = 1
        include_answer = $true
    } | ConvertTo-Json

    Write-Host "Sending test request to Tavily API..." -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri "https://api.tavily.com/search" -Method Post -Headers $headers -Body $body -ErrorAction Stop

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ SUCCESS! API Key is Valid!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "API Response:" -ForegroundColor Cyan
    Write-Host "-------------" -ForegroundColor Cyan
    
    if ($response.answer) {
        Write-Host "AI Summary: $($response.answer.Substring(0, [Math]::Min(100, $response.answer.Length)))..." -ForegroundColor White
    }
    
    Write-Host "Results Found: $($response.results.Count)" -ForegroundColor White
    
    if ($response.results.Count -gt 0) {
        Write-Host ""
        Write-Host "First Result:" -ForegroundColor Cyan
        Write-Host "  Title: $($response.results[0].title)" -ForegroundColor White
        Write-Host "  URL: $($response.results[0].url)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Next Steps:" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "1. Update your .env file:" -ForegroundColor Yellow
    Write-Host "   TAVILY_API_KEY=$apiKey" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Update the n8n workflow:" -ForegroundColor Yellow
    Write-Host "   - Open: http://localhost:5678" -ForegroundColor White
    Write-Host "   - Click 'Tavily API Request' node" -ForegroundColor White
    Write-Host "   - Update JSON Body with your API key" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Test the workflow:" -ForegroundColor Yellow
    Write-Host "   .\test-tavily-to-file.ps1" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ❌ ERROR: API Key Test Failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    
    $errorMessage = $_.Exception.Message
    
    if ($errorMessage -match "401" -or $errorMessage -match "Unauthorized" -or $errorMessage -match "Authorization") {
        Write-Host "Error: Invalid API Key" -ForegroundColor Red
        Write-Host ""
        Write-Host "Your API key is not valid or has been revoked." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Solutions:" -ForegroundColor Cyan
        Write-Host "1. Get a new API key from: https://tavily.com/" -ForegroundColor White
        Write-Host "2. Make sure you copied the entire key" -ForegroundColor White
        Write-Host "3. Check if your key has expired" -ForegroundColor White
        
    } elseif ($errorMessage -match "429" -or $errorMessage -match "quota") {
        Write-Host "Error: Quota Exceeded" -ForegroundColor Red
        Write-Host ""
        Write-Host "You've used all your free searches (1,000/month)." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Solutions:" -ForegroundColor Cyan
        Write-Host "1. Wait until next month for quota reset" -ForegroundColor White
        Write-Host "2. Upgrade your plan at: https://tavily.com/pricing" -ForegroundColor White
        
    } else {
        Write-Host "Error Details:" -ForegroundColor Red
        Write-Host $errorMessage -ForegroundColor White
        Write-Host ""
        Write-Host "Possible causes:" -ForegroundColor Cyan
        Write-Host "1. Network connection issue" -ForegroundColor White
        Write-Host "2. Tavily API is down (check: https://status.tavily.com/)" -ForegroundColor White
        Write-Host "3. Invalid API key format" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "Need help? Visit: https://docs.tavily.com/" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

