# Skill: N8N Workflow Automation

## Trigger Words
"n8n", "workflow", "webhook", "automation", "send to n8n"

## Config
```
BASE_URL: https://nioctibinu.online
API_KEY: See docs/credentials/API_KEYS.env → N8N_API_KEY
```

## MCP Tools Available
Use `mcp__n8n-mcp__*` tools directly:
- `n8n_health_check` - Test connection
- `n8n_list_workflows` - List all workflows
- `n8n_get_workflow` - Get workflow details
- `n8n_create_workflow` - Create new workflow
- `n8n_test_workflow` - Execute workflow

## Webhooks (Verified Working)
| Path | Purpose |
|------|---------|
| `/webhook/residential-quote` | Residential leads |
| `/webhook/commercial-quote` | Commercial leads |
| `/webhook/airbnb-quote` | Airbnb leads |
| `/webhook/contact-form` | Contact form |
| `/webhook/job-application` | Job applications |
| `/webhook/complaints` | Complaints |

## Quick Test
```bash
curl -X POST https://nioctibinu.online/webhook/contact-form \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'
```

## Status
✅ MCP Connected | ✅ Webhooks Working | v2.33.4
