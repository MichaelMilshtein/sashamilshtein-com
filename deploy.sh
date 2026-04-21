#!/usr/bin/env bash
set -e

DIST="artifacts/resume/dist/public"
SERVER=$(echo "$FTP_SERVER" | sed 's|ftp://||')

echo "=== Building resume ==="
pnpm --filter @workspace/resume run build:production

echo ""
echo "=== Deploying to sashamilshtein.com ==="
{
  echo "set ftp:ssl-allow no"
  echo "set ftp:passive-mode on"
  echo "set net:timeout 60"
  echo "set net:max-retries 3"
  echo "open -u $FTP_USERNAME,$FTP_PASSWORD ftp://$SERVER"
  echo "cd .."
  echo "cd domains/sashamilshtein.com/public_html"
  echo "mkdir -p assets"
  find "$DIST" -type f | sort | while read filepath; do
    remote="${filepath#$DIST/}"
    echo "put \"$filepath\" -o \"$remote\""
  done
  # Deploy static pages (visa, greece2026, etc.)
  # Already in public_html — just cd into each subfolder directly
  for page_dir in static-pages/*/; do
    page=$(basename "$page_dir")
    [ -d "$page_dir" ] && [ -n "$(ls -A "$page_dir")" ] || continue
    echo "mkdir -p $page"
    echo "cd $page"
    find "$page_dir" -type f | sort | while read filepath; do
      remote="${filepath#$page_dir}"
      dir=$(dirname "$remote")
      [ "$dir" != "." ] && echo "mkdir -p $dir"
      echo "put \"$filepath\" -o \"$remote\""
    done
    echo "cd .."
  done
  echo "bye"
} | lftp

echo ""
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://sashamilshtein.com)
if [ "$STATUS" = "200" ]; then
  echo "✓ Live at https://sashamilshtein.com (HTTP $STATUS)"
else
  echo "✗ Unexpected response: HTTP $STATUS"
  exit 1
fi
