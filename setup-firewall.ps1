# ========================================
# Windows Firewall Configuration for Board Game
# ========================================
# This script automatically configures Windows Firewall
# to allow QR code scanning from mobile devices
# Run once as Administrator - then restart the dev server

# Requires Admin Privileges
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "❌ ERROR: This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n🔧 Setting up Windows Firewall for Board Game..." -ForegroundColor Green

# Rule Name Prefixes
$RulePrefix = "Board Game"

# Ports to allow
$PortsToAllow = @(
    @{
        Port = 5173
        Name = "$RulePrefix Frontend"
        Direction = "Inbound"
        Protocol = "TCP"
    },
    @{
        Port = 3001
        Name = "$RulePrefix Backend"
        Direction = "Inbound"
        Protocol = "TCP"
    }
)

# Check and remove existing rules (to avoid conflicts)
foreach ($rule in $PortsToAllow) {
    $exists = Get-NetFirewallRule -DisplayName $rule.Name -ErrorAction SilentlyContinue
    if ($exists) {
        Write-Host "  ↻ Removing old rule: $($rule.Name)" -ForegroundColor Yellow
        Remove-NetFirewallRule -DisplayName $rule.Name -ErrorAction SilentlyContinue
    }
}

# Add new firewall rules
foreach ($rule in $PortsToAllow) {
    try {
        New-NetFirewallRule `
            -DisplayName $rule.Name `
            -Direction $rule.Direction `
            -Action Allow `
            -Protocol $rule.Protocol `
            -LocalPort $rule.Port `
            -ErrorAction Stop | Out-Null
        
        Write-Host "  ✅ Allowed port $($rule.Port) - $($rule.Name)" -ForegroundColor Green
    }
    catch {
        Write-Host "  ⚠️  Failed to configure port $($rule.Port): $_" -ForegroundColor Yellow
    }
}

Write-Host "`n✨ Firewall configuration complete!" -ForegroundColor Green
Write-Host "`nYou can now:"
Write-Host "  1. Run: npm run dev" -ForegroundColor Cyan
Write-Host "  2. Open: http://localhost:5173/host" -ForegroundColor Cyan
Write-Host "  3. Scan QR code from phone on same WiFi" -ForegroundColor Cyan
Write-Host "`n✅ Mobile devices should now connect without firewall blocking!" -ForegroundColor Green
Write-Host ""
