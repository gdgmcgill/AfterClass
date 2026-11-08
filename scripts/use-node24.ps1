$nodeVersion = (& node --version 2>$null)
if ($nodeVersion -match '^v24\.') {
    return
}
$installRoot = Join-Path $env:LOCALAPPDATA 'Programs\AfterClass'
$node24 = Get-ChildItem -LiteralPath $installRoot -Directory -Filter 'node-v24.*-win-x64' -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
if (-not $node24) {
    throw 'Node.js 24 was not found. Install it before continuing.'
}
$env:Path = "$($node24.FullName);$env:Path"
if ((& node --version) -notmatch '^v24\.') {
    throw 'Could not activate Node.js 24.'
}
