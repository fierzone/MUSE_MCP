Write-Host "Running Chrome with Remote Debugging Port 9222..." -ForegroundColor Red
$profileDir = Join-Path $PSScriptRoot ".muse-profile"
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--remote-debugging-port=9222", "--user-data-dir=$profileDir", "https://muse.ai"
