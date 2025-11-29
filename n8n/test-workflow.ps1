# PowerShell test script for the Text to Blog AI Publisher workflow
# Make sure n8n is running before executing this script

$WebhookUrl = "http://localhost:5678/webhook/create-blog"

Write-Host "Testing Text to Blog AI Publisher Workflow" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Sending request to: $WebhookUrl"
Write-Host ""

$Body = Get-Content -Path "example-request.json" -Raw

try {
    $Response = Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $Body -ContentType "application/json"
    
    Write-Host "Response:" -ForegroundColor Cyan
    $Response | ConvertTo-Json -Depth 10
    
    Write-Host ""
    Write-Host "Test completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

