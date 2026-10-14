# PowerShell script to create Desktop shortcut for IdentityLens
$WScriptShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$ShortcutPath = Join-Path -Path $DesktopPath -ChildPath "IdentityLens.lnk"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TargetBat = Join-Path -Path $ScriptDir -ChildPath "launch-identitylens.bat"

$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetBat
$Shortcut.WorkingDirectory = $ScriptDir
$Shortcut.Description = "Launch IdentityLens Digital Identity Intelligence Platform"
$Shortcut.Save()

Write-Host "Created Desktop Shortcut: $ShortcutPath" -ForegroundColor Green
