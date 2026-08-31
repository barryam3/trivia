#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"

if ! command -v wslpath >/dev/null 2>&1; then
  printf 'wslpath is required to convert the sketch path for PowerShell.\n' >&2
  exit 1
fi

powershell_command="powershell.exe"
if ! command -v "$powershell_command" >/dev/null 2>&1; then
  powershell_command="pwsh.exe"
fi
if ! command -v "$powershell_command" >/dev/null 2>&1; then
  printf 'PowerShell is required (powershell.exe or pwsh.exe).\n' >&2
  exit 1
fi

windows_script_path="$(wslpath -w "$script_dir/deploy.ps1")"
exec "$powershell_command" \
  -ExecutionPolicy Bypass \
  -File "$windows_script_path"
