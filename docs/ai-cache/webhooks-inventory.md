# Webhooks Inventory
> All N8N webhook endpoints for Clean Up Bros
> Last Updated: 2026-01-22

## Summary
- **N8N Base URL**: `https://nioctibinu.online`
- **Total Webhooks**: 12
- **Status**: All operational (tested Dec 28, 2025)

---

## Quote Webhooks

### Residential Quote
```
URL: https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c
Method: POST
Content-Type: application/json
```
**Triggers**:
- Email confirmation to customer
- SMS notification to business
- Database insert to Supabase

### Commercial Quote
```
URL: https://nioctibinu.online/webhook/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32
Method: POST
Content-Type: application/json
```
**Triggers**: Same as residential

### Airbnb Quote
```
URL: https://nioctibinu.online/webhook/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f
Method: POST
Content-Type: application/json
```
**Triggers**: Same as residential

### Landing Lead (Quick Quote)
```
URL: https://nioctibinu.online/webhook/8fe0b2c9-3d5b-44f5-84ff-0d0ef896e1fa
Method: POST
Content-Type: application/json
```
**Triggers**: SMS notification, lead capture

---

## Other Webhooks

### Job Application
```
URL: https://nioctibinu.online/webhook/67f764f2-adff-481e-aa49-fd3de1feecde
Method: POST
Content-Type: application/json
```
**Triggers**: Email to HR, database insert

### Client Feedback
```
URL: https://nioctibinu.online/webhook/client-feedback
Method: POST
Content-Type: application/json
```
**Triggers**: Email alert, review request

### Contact Form
```
URL: https://nioctibinu.online/webhook/contact-form
Method: POST
Content-Type: application/json
```
**Status**: WEBHOOK NOT CREATED in N8N
**Note**: ContactView.tsx updated (2026-01-22), but N8N workflow needs to be created
**Action Required**: Create `/webhook/contact-form` in N8N with notification nodes

---

## Admin Webhooks

### Booking Confirmation
```
URL: https://nioctibinu.online/webhook/booking-confirmed
Method: POST
```
**Usage**: Send booking confirmation after payment

### Square Payment Link
```
URL: https://nioctibinu.online/webhook/create-payment-link
Method: POST
```
**Usage**: Generate Square payment link

### AI Chat
```
URL: https://nioctibinu.online/webhook/cub-ai-chat
Method: POST
```
**Usage**: Customer service chatbot

### SMS Follow-up
```
URL: https://nioctibinu.online/webhook/cub-sms-followup
Method: POST
```
**Usage**: Automated SMS follow-ups

### Inbound Call
```
URL: https://nioctibinu.online/webhook/cub-inbound-call
Method: POST
```
**Usage**: Twilio inbound call handling

### Outbound Call
```
URL: https://nioctibinu.online/webhook/cub-outbound-call
Method: POST
```
**Usage**: Twilio outbound call initiation

---

## Production vs Development

In `src/constants.ts`:
```typescript
// Production uses API proxy (hides N8N URLs)
API_PROXY_URLS = {
  quote: '/api/webhooks/quote',
  jobApplication: '/api/webhooks/job-application',
  feedback: '/api/webhooks/feedback',
}

// Development uses direct N8N URLs
DEV_FALLBACK_URLS = {
  residential: '${N8N_BASE}/webhook/98d35453...',
  // etc.
}
```

---

## Testing Webhooks

### cURL Test Command
```bash
curl -X POST https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "cleanupbros.au@gmail.com",
    "phone": "+61406764585",
    "suburb": "Liverpool",
    "bedrooms": 3,
    "bathrooms": 2,
    "serviceType": "General",
    "_test": true
  }'
```

### Expected Response
```json
{
  "success": true,
  "referenceId": "CUB-ABC123",
  "message": "Quote request received"
}
```

---

## Webhook Flow Diagram

```
[Frontend Form]
    ↓ POST JSON
[N8N Webhook]
    ↓ Process
├── [Supabase] → Insert record
├── [Gmail] → Send confirmation email
├── [Twilio] → Send SMS notification
├── [Telegram] → Send group notification
└── [WhatsApp] → Send business notification
```
