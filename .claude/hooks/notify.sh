#!/usr/bin/env bash
TITLE="Claude Code ✅ 完了"
MSG="Session $CLAUDE_SESSION_ID がタスクを完了しました"

# macOS (osascript) ─────────────────────────
if command -v osascript >/dev/null 2>&1; then
  osascript -e "display notification \"$MSG\" with title \"$TITLE\" sound name \"Glass\""
  exit 0
fi

# Linux (notify-send) ───────────────────────
if command -v notify-send >/dev/null 2>&1; then
  notify-send "$TITLE" "$MSG"
  exit 0
fi

# Windows (powershell toast) ────────────────
powershell -NoProfile -Command \
  "[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime];"^
  "$tmpl = '<toast><visual><binding template=\"ToastGeneric\"><text>'+$env:TITLE+'</text><text>'+$env:MSG+'</text></binding></visual></toast>';"^
  "$xml = New-Object Windows.Data.Xml.Dom.XmlDocument;"^
  "$xml.LoadXml($tmpl);"^
  "[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('ClaudeCode').Show([Windows.UI.Notifications.ToastNotification]::new($xml))"