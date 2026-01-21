# Skill: WhatsApp Business Cloud API

## Trigger Words
"whatsapp", "wa", "whatsapp message", "send whatsapp"

## Config
```
Provider: Meta (Facebook) Business Cloud API
Phone Number ID: See API_KEYS.env → WHATSAPP_PHONE_NUMBER_ID
Business Account ID: See API_KEYS.env → WHATSAPP_BUSINESS_ACCOUNT_ID
Access Token: See API_KEYS.env → FACEBOOK_SYSTEM_USER_TOKEN
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

## cURL Example
```bash
curl -X POST "https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer ${FACEBOOK_SYSTEM_USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "61406764585",
    "type": "text",
    "text": {"body": "Test message from Clean Up Bros"}
  }'
```

## N8N HTTP Request Node Setup
```json
{
  "method": "POST",
  "url": "https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages",
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

## N8N Workflow Integration
The WhatsApp node in workflow `49xi6gSdDwMlcHmj` sends messages to +61406764585 for all leads.

## Use Cases
- Lead notifications (business owner)
- Booking confirmations (customer - via template)
- Rich media messages (quotes with images)
- Interactive buttons (confirm/reschedule)

## Status
Working | Node: Send WhatsApp | Workflow: 49xi6gSdDwMlcHmj
