# Notification Channels
> All notification integrations for Clean Up Bros
> Last Updated: 2026-01-22

## Summary
- **Email**: Gmail SMTP (via N8N)
- **SMS**: Twilio (via N8N)
- **Telegram**: Bot API (integrated)
- **WhatsApp**: Meta Business API (integrated, needs token refresh)

---

## 1. Email (Gmail)

### Configuration
- **Provider**: Gmail SMTP via N8N
- **Sender**: cleanupbros.au@gmail.com
- **Recipients**: cleanupbros.au@gmail.com (business), customer email

### Credentials
See `docs/credentials/API_KEYS.env`:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Status: WORKING

---

## 2. SMS (Twilio)

### Configuration
- **Provider**: Twilio
- **Region**: Australia
- **From Number**: Configured in Twilio console
- **To Number**: +61406764585 (business)

### Credentials
See `docs/credentials/API_KEYS.env`:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_API_KEY_SID`

### Status: NEEDS TOKEN REFRESH

---

## 3. Telegram

### Configuration
- **Bot Name**: Clean Up Bros Bot @CLEANUPBROSBOT
- **Bot Token**: See CLAUDE.md (Telegram Bot section)
- **Supergroup ID**: -1003155659527

### API Call Example
```bash
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "-1003155659527",
    "text": "Test message",
    "parse_mode": "HTML"
  }'
```

### Message Templates

#### New Quote
```html
<b>NEW RESIDENTIAL QUOTE</b>

<b>Customer:</b> {{fullName}}
<b>Phone:</b> {{phone}}
<b>Suburb:</b> {{suburb}}
<b>Service:</b> {{serviceType}}
<b>Date:</b> {{preferredDate}}
<b>Est. Price:</b> ${{priceEstimate}}

<b>Reference:</b> {{referenceId}}
```

#### New Job Application
```html
<b>NEW JOB APPLICATION</b>

<b>Applicant:</b> {{fullName}}
<b>Phone:</b> {{phone}}
<b>Email:</b> {{email}}
<b>Experience:</b> {{experience}}
```

### Status: WORKING
**Service File**: `src/services/telegramService.ts`
**Test Result**: Message ID 363 delivered successfully (2026-01-22)

---

## 4. WhatsApp (Meta Business API)

### Configuration
- **Provider**: Meta Business API (Cloud API)
- **Phone Number ID**: See API_KEYS.env → WHATSAPP_PHONE_NUMBER_ID
- **Business Account ID**: See API_KEYS.env → WHATSAPP_BUSINESS_ACCOUNT_ID
- **API Version**: v18.0

### Credentials
See `docs/credentials/API_KEYS.env`:
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_BUSINESS_ACCOUNT_ID`
- `FACEBOOK_SYSTEM_USER_TOKEN`

### API Call Example
```bash
curl -X POST "https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer ${FACEBOOK_SYSTEM_USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "61406764585",
    "type": "text",
    "text": {
      "body": "Test WhatsApp message"
    }
  }'
```

### Status: NEEDS RECONFIGURATION
**Service File**: `src/services/whatsappService.ts`
**Test Result**: Failed - Phone Number ID not found or missing permissions
**Action Required**: Reconfigure WhatsApp Business API in Meta Business Manager

---

## Integration Architecture

### Current (via N8N)
```
[Form Submission] → [N8N Webhook]
                         ↓
                    ├── Email (Gmail SMTP node)
                    ├── SMS (Twilio node)
                    ├── Telegram (HTTP Request to Bot API)
                    └── WhatsApp (HTTP Request to Meta API)
```

---

## Testing Checklist

### For Each Form Submission:
- [x] Email received at cleanupbros.au@gmail.com
- [x] Telegram message in group -1003155659527
- [ ] SMS received at +61406764585 (needs token refresh)
- [ ] WhatsApp message at +61406764585 (needs reconfiguration)

---

## Service Files

| Channel | Service File | Status |
|---------|--------------|--------|
| Email | N8N Gmail node | Working |
| SMS | N8N Twilio node | Needs Token |
| Telegram | `src/services/telegramService.ts` | WORKING |
| WhatsApp | `src/services/whatsappService.ts` | NEEDS SETUP |

## Action Items

1. **Twilio SMS**: Refresh auth token at twilio.com/console

2. **WhatsApp**: Reconfigure in Meta Business Manager
   - Verify Phone Number ID exists
   - Check System User Token permissions
   - Test with WhatsApp Business API
