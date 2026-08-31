$ErrorActionPreference = "Stop"

$fqbn = "arduino:avr:mega"
$sketchPath = Split-Path -Parent $PSCommandPath

# A Windows process launched from WSL can inherit the WSL session's older
# PATH, even when a newly opened interactive PowerShell sees the updated
# Windows PATH. Refresh both Windows PATH scopes before resolving the CLI.
$windowsPathEntries = @(
  [Environment]::GetEnvironmentVariable("Path", "Machine")
  [Environment]::GetEnvironmentVariable("Path", "User")
) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
if ($windowsPathEntries.Count -gt 0) {
  $env:Path = (($windowsPathEntries + $env:Path) -join ";")
}

$cliCommand = Get-Command arduino-cli -ErrorAction SilentlyContinue
if ($null -eq $cliCommand) {
  throw "arduino-cli was not found in the Windows PATH. Verify it with 'Get-Command arduino-cli' in PowerShell, then restart WSL if it was installed recently."
}
$cliPath = $cliCommand.Path
if ([string]::IsNullOrWhiteSpace($cliPath)) {
  $cliPath = $cliCommand.Source
}
if ([string]::IsNullOrWhiteSpace($cliPath)) {
  $cliPath = $cliCommand.Name
}

function Invoke-ArduinoCli {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  & $cliPath @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "arduino-cli failed with exit code $LASTEXITCODE."
  }
}

# Use JSON so this does not depend on column widths or localized text. Newer
# CLI releases call this option --json; older releases used --format json.
function Get-BoardJson {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  $json = & $cliPath @Arguments 2>$null | Out-String
  $exitCode = $LASTEXITCODE
  if ($exitCode -eq 0 -and -not [string]::IsNullOrWhiteSpace($json)) {
    return $json
  }

  return $null
}

$boardJson = Get-BoardJson @("board", "list", "--json", "--discovery-timeout", "10s")
if ([string]::IsNullOrWhiteSpace($boardJson)) {
  $boardJson = Get-BoardJson @("board", "list", "--format", "json", "--discovery-timeout", "10s")
}
if ([string]::IsNullOrWhiteSpace($boardJson)) {
  throw "arduino-cli could not enumerate serial ports. Make sure the board is detached from WSL and visible to Windows."
}

try {
  $boardPayload = $boardJson | ConvertFrom-Json
} catch {
  throw "arduino-cli returned invalid JSON while enumerating boards."
}

if ($null -ne $boardPayload.detected_ports) {
  $detectedPorts = @($boardPayload.detected_ports)
} else {
  $detectedPorts = @($boardPayload)
}

$serialPorts = @(
  foreach ($detectedPort in $detectedPorts) {
    $port = $detectedPort.port
    $address = if ($null -ne $port -and $null -ne $port.address) {
      [string]$port.address
    } elseif ($null -ne $detectedPort.address) {
      [string]$detectedPort.address
    } else {
      ""
    }

    $protocol = if ($null -ne $port -and $null -ne $port.protocol) {
      [string]$port.protocol
    } elseif ($null -ne $detectedPort.protocol) {
      [string]$detectedPort.protocol
    } else {
      ""
    }

    if ($address -and ($protocol -eq "serial" -or $address -match "^COM\d+$")) {
      [PSCustomObject]@{
        Address = $address
        Entry = $detectedPort
      }
    }
  }
)

if ($serialPorts.Count -ne 1) {
  if ($serialPorts.Count -eq 0) {
    throw "No Windows serial Arduino was found. Detach the board from WSL and check that Windows shows its COM port."
  }
  throw "Expected exactly one connected Arduino, but found $($serialPorts.Count) serial ports."
}

$serialPort = $serialPorts[0].Address
$matchingBoards = if ($null -eq $serialPorts[0].Entry.matching_boards) {
  @()
} else {
  @($serialPorts[0].Entry.matching_boards)
}
$boardName = if ($matchingBoards.Count -gt 0) {
  [string]$matchingBoards[0].name
} else {
  "Arduino Mega or Mega 2560"
}

Write-Host "Using $boardName on $serialPort."
Write-Host "Compiling $sketchPath ..."
Invoke-ArduinoCli @("compile", "--fqbn", $fqbn, $sketchPath)

Write-Host "Uploading to $serialPort ..."
Invoke-ArduinoCli @("upload", "--port", $serialPort, "--fqbn", $fqbn, "--verify", $sketchPath)

Write-Host "Buzzer firmware deployed successfully."
