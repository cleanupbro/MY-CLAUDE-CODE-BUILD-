# Skill: Twilio SMS API

## Trigger Words
"twilio", "sms", "text message", "send sms"

## Config
```
Provider: Twilio
Account SID: See docs/credentials/API_KEYS.env → TWILIO_ACCOUNT_SID
Auth Token: See docs/credentials/API_KEYS.env → TWILIO_AUTH_TOKEN
API Key SID: See docs/credentials/API_KEYS.env → TWILIO_API_KEY_SID
Phone Number: +15162102609 (US number for Australia)
```

## API Endpoint
```
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSID}/Messages.json
```

## Authentication
HTTP Basic Auth with `AccountSID:AuthToken` (Base64 encoded)

```
Authorization: Basic {base64(AccountSID:AuthToken)}
```

## Request Format
Content-Type: `application/x-www-form-urlencoded`

| Parameter | Value | Description |
|-----------|-------|-------------|
| From | +15162102609 | Twilio phone number |
| To | +61XXXXXXXXX | Recipient (E.164 format) |
| Body | message text | SMS content (max 1600 chars) |

## cURL Example
```bash
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json" \
  -u "${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}" \
  -d "From=+15162102609" \
  -d "To=+61406764585" \
  -d "Body=Test message from Clean Up Bros"
```

## N8N HTTP Request Node Setup
```json
{
  "method": "POST",
  "url": "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "Basic {base64_encoded_credentials}"
      },
      {
        "name": "Content-Type",
        "value": "application/x-www-form-urlencoded"
      }
    ]
  },
  "sendBody": true,
  "contentType": "form-urlencoded",
  "bodyParameters": {
    "parameters": [
      {"name": "From", "value": "+15162102609"},
      {"name": "To", "value": "+61406764585"},
      {"name": "Body", "value": "={{ $json.message }}"}
    ]
  }
}
```

## Response Example
```json
{
  "sid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "date_created": "Wed, 22 Jan 2026 00:00:00 +0000",
  "status": "queued",
  "to": "+61406764585",
  "from": "+15162102609",
  "body": "Test message"
}
```

## Status Codes
| Status | Meaning |
|--------|---------|
| queued | Message queued for delivery |
| sent | Message sent to carrier |
| delivered | Message delivered to device |
| failed | Delivery failed |
| undelivered | Could not be delivered |

## Error Handling
Common errors:
- `21608`: Phone number not verified (for trial accounts)
- `21211`: Invalid 'To' phone number
- `21614`: 'To' number not SMS capable
- `20003`: Authentication error

## N8N Workflow Integration
The SMS node in workflow `49xi6gSdDwMlcHmj` sends SMS to +61406764585 for all leads.

## Use Cases
- Lead notifications (business owner)
- Booking confirmations (customer)
- Reminder notifications (24h before)
- Follow-up messages

## Status
Working | Node: Send SMS | Workflow: 49xi6gSdDwMlcHmj
