# Skill: Sentry Error Monitoring

## Trigger Words
"sentry", "error", "bug tracking", "monitoring", "crash"

## Config
```
ORG_TOKEN: See docs/credentials/API_KEYS.env → SENTRY_ORG_TOKEN
PERSONAL_TOKEN: See docs/credentials/API_KEYS.env → SENTRY_PERSONAL_TOKEN
ORG: clean-up-bros
```

## MCP Tools Available
Use `mcp__sentry__*` tools (via Task agent):
- `getIssues` - Fetch recent issues
- `seer` - Ask questions about Sentry data

## List Projects
```bash
curl "https://sentry.io/api/0/organizations/clean-up-bros/projects/" \
  -H "Authorization: Bearer ${SENTRY_PERSONAL_TOKEN}"
```

## List Issues
```bash
curl "https://sentry.io/api/0/organizations/clean-up-bros/issues/" \
  -H "Authorization: Bearer ${SENTRY_PERSONAL_TOKEN}"
```

## Get Issue Details
```bash
curl "https://sentry.io/api/0/issues/{ISSUE_ID}/" \
  -H "Authorization: Bearer ${SENTRY_PERSONAL_TOKEN}"
```

## Use Cases
- Production error tracking
- Performance monitoring
- Release health
- User feedback

## Status
Plugin Enabled | Org Token Active
