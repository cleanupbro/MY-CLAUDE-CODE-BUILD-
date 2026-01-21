# N8N Manager Skill

*Created: January 22, 2026*

## Triggers
- "n8n", "workflow", "list workflows", "run workflow", "create workflow", "automation"

## Configuration
- **N8N URL**: https://nioctibinu.online
- **API Key Header**: `X-N8N-API-KEY`
- **Authentication**: JWT Token (stored in .env.local)

---

## Quick Commands

### List All Workflows
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "https://nioctibinu.online/api/v1/workflows" | jq '.data[] | {id, name, active}'
```

### Get Specific Workflow
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "https://nioctibinu.online/api/v1/workflows/{WORKFLOW_ID}"
```

### Activate Workflow
```bash
curl -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "https://nioctibinu.online/api/v1/workflows/{WORKFLOW_ID}/activate"
```

### Deactivate Workflow
```bash
curl -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "https://nioctibinu.online/api/v1/workflows/{WORKFLOW_ID}/deactivate"
```

### Execute Workflow via Webhook
```bash
curl -X POST "https://nioctibinu.online/webhook/{WEBHOOK_PATH}" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

---

## Clean Up Bros Workflows (14)

| ID | Name | Status | Webhook |
|----|------|--------|---------|
| `49xi6gSdDwMlcHmj` | ROI Calculator (OPTIMIZED) | Active | `/clean-up-bros-roi` |
| `BhC9oeocD3MLWDRK` | AI Chat Widget (Gemini) | Active | - |
| `FO3EBleUNJlLkscB` | Outbound Sales Caller | Active | - |
| `Qw5wXjnkwktS7C9e` | Booking Confirmation | Active | - |
| `TWo7Fvva39DKed5t` | Accounting Logger | Active | - |
| `UkiGz64ysmifd3q9` | Review Request | Active | - |
| `WMPRz55gvZx9ePOb` | SMS Follow-up (Twilio) | Active | - |
| `aK91nwonDiEdNLxQ` | Inbound Call Agent | Active | - |
| `b3OulillXkWze5nK` | Payment Notifications | Active | - |
| `j4xK5E8kdx8OC1Is` | Gift Card System | Active | - |
| `nHp2wFED5I6iW8fT` | Telegram Assistant | Active | - |
| `pw5VQWwoNYQ2IAdQ` | Email Follow-Up | Active | - |
| `ED04aRzwOmsA3gOA` | Call Transcript | Inactive | - |
| `xRF5aBAZZ8BLptYb` | Google Sheets Caller | Inactive | - |

---

## OpBros Workflows (4)

| ID | Name | Status |
|----|------|--------|
| `1y4ZJiQ9Z2gnDVYr` | Lead Capture | Active |
| `U9mZhtJiWUoJAKjL` | SMS v2 | Active |
| `XCUlLOSgBUiKX2q5` | ROI Report | Active |
| `yrHqLfn5uUbxaq5p` | AI Chat | Active |

---

## Quote Submission Flow

All quote forms submit to the ROI workflow:
```
POST https://nioctibinu.online/webhook/clean-up-bros-roi
Content-Type: application/json

{
  "type": "Residential|Commercial|Airbnb",
  "data": { ... form data ... },
  "timestamp": "ISO8601",
  "source": "website"
}
```

---

## Troubleshooting

### Workflow Not Triggering
1. Check workflow is active: `curl ... /workflows/{id}` check `active: true`
2. Verify webhook path matches
3. Check N8N logs at https://nioctibinu.online

### API Authentication Failed
1. Verify N8N_API_KEY in .env.local
2. Token format: JWT (starts with `eyJ...`)
3. Regenerate if expired

---

## Creating New Workflows

When asked to create a new workflow:
1. Design workflow in N8N UI (https://nioctibinu.online)
2. Export JSON via UI
3. Document in this file with ID and webhook path
4. Test webhook endpoint manually

---

*This skill enables Claude Code to manage N8N automations for Clean Up Bros.*
