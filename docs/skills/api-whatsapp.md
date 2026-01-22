# Skill: WhatsApp Business Cloud API

## Trigger Words
"whatsapp", "wa", "whatsapp message", "send whatsapp"

## Current Status
**Test Account**: Ready for Cloud API (Account ID: 880203244738731)
**CUBS Account**: Blocked - Created via mobile app, cannot use Cloud API

## Account Configuration

### Test WhatsApp Business Account (ACTIVE)
```
Business Account ID: 880203244738731
Phone Number ID: 92512258402625
Access Token: FACEBOOK_SYSTEM_USER_TOKEN (see API_KEYS.env)
Status: 3 people assigned, Cloud API ready
```

### Clean Up Bros - CUBS Account (BLOCKED)
```
Business Account ID: 1784171325827278
Phone Number: +61 406 764 585
Status: Created via mobile app, 0 people assigned
Issue: Cannot use Cloud API - needs migration
```

## API Endpoint
```
POST https://graph.facebook.com/v18.0/{phone_number_id}/messages
```

## Authentication
Bearer Token in Authorization header

```
Authorization: Bearer ${FACEBOOK_SYSTEM_USER_TOKEN}
```

## Request Format
Content-Type: `application/json`

```json
{
  "messaging_product": "whatsapp",
  "to": "61406764585",
  "type": "text",
  "text": {
    "body": "Your message here"
  }
}
```

## cURL Example (Test Account)
```bash
curl -X POST "https://graph.facebook.com/v18.0/92512258402625/messages" \
  -H "Authorization: Bearer ${FACEBOOK_SYSTEM_USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "61406764585",
    "type": "text",
    "text": {"body": "Test message from Clean Up Bros"}
  }'
```

## N8N Workflow Configuration

### Workflow ID: `49xi6gSdDwMlcHmj`

**Manual Update Instructions** (N8N MCP auth currently unavailable):

1. Log in to N8N at https://nioctibinu.online
2. Open workflow `49xi6gSdDwMlcHmj`
3. Find the WhatsApp HTTP Request node
4. Update the node configuration:

```json
{
  "method": "POST",
  "url": "https://graph.facebook.com/v18.0/92512258402625/messages",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "Bearer ${FACEBOOK_SYSTEM_USER_TOKEN}"
      },
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  },
  "sendBody": true,
  "contentType": "json",
  "specifyBody": "json",
  "jsonBody": "={{ JSON.stringify({ messaging_product: 'whatsapp', to: '61406764585', type: 'text', text: { body: $json.message } }) }}"
}
```

5. Save and activate the workflow
6. Test by triggering with a test payload

## Response Example
```json
{
  "messaging_product": "whatsapp",
  "contacts": [
    {
      "input": "61406764585",
      "wa_id": "61406764585"
    }
  ],
  "messages": [
    {
      "id": "wamid.XXXXXXXXXXXXXXXXXXX"
    }
  ]
}
```

## Message Types
| Type | Use Case |
|------|----------|
| text | Simple text messages |
| template | Pre-approved message templates |
| image | Send images |
| document | Send PDFs, docs |
| location | Share locations |

## Template Messages (Required for Business Initiated)
For first-time contact or outside 24h window, use templates:

```json
{
  "messaging_product": "whatsapp",
  "to": "61406764585",
  "type": "template",
  "template": {
    "name": "hello_world",
    "language": {"code": "en_US"}
  }
}
```

## Important Notes
1. **24-Hour Window**: Free-form messages only within 24h of user's last message
2. **Outside Window**: Must use pre-approved templates
3. **Phone Format**: No + prefix, just country code + number (e.g., 61406764585)
4. **Rate Limits**: 1000 messages per second per phone number

## Error Handling
Common errors:
- `131030`: Phone number not on WhatsApp
- `131026`: Rate limit exceeded
- `131047`: 24h window expired, use template
- `100`: Invalid parameter

## Migration Plan for +61 406 764 585 (Future)

### Why Migration is Needed
The CUBS account was created via WhatsApp Business mobile app, which:
- Cannot be assigned to people in Meta Business Suite
- Has limited Cloud API capabilities
- Blocks verification code delivery

### Migration Steps (When Ready)
1. **Backup**: Export chat history from WhatsApp Business app
2. **Uninstall**: Remove WhatsApp Business app from phone
3. **Wait**: Allow 24-48 hours for number to be released
4. **Register**: Add phone number through Cloud API in Meta Business Suite
5. **Configure**: Update all credentials with new Phone Number ID
6. **Test**: Verify messages send and receive correctly

### Files to Update After Migration
| File | Change |
|------|--------|
| `src/services/whatsappService.ts` | New Phone Number ID |
| `docs/credentials/API_KEYS.env` | New credentials |
| N8N Workflow `49xi6gSdDwMlcHmj` | New Phone Number ID in HTTP node |
| This file (`api-whatsapp.md`) | Updated documentation |

### Important Notes
- User will lose access to mobile WhatsApp Business app for this number
- Existing chat history will not transfer to Cloud API
- Consider using a second number if mobile app access is important

## Use Cases
- Lead notifications (business owner)
- Booking confirmations (customer - via template)
- Rich media messages (quotes with images)
- Interactive buttons (confirm/reschedule)

## Status
- Test Account: **Ready** | Phone Number ID: 92512258402625
- Production (CUBS): **Blocked** | Needs migration
- N8N Workflow: `49xi6gSdDwMlcHmj` | Update manually required
