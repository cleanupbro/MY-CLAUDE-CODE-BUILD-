# Services Inventory
> All backend services in Clean Up Bros portal
> Last Updated: 2026-01-22

## Summary
- **Location**: `src/services/`
- **Total Services**: 16 files
- **External APIs**: Stripe, Square, Google, N8N

---

## Core Services

### 1. webhookService.ts
**Purpose**: Send form data to N8N webhooks
**Function**: `sendToWebhook<T>(url: string, data: T)`
**Features**:
- Standard JSON POST request
- Fallback to no-cors mode for CORS issues
- Returns `{ success: boolean, error?: string }`

### 2. submissionService.ts
**Purpose**: Save successful submissions locally
**Usage**: Called after webhook success for local backup

### 3. failedSubmissionsService.ts
**Purpose**: Store failed submissions for retry
**Usage**: Called when webhook fails for offline-first capability

### 4. authService.ts
**Purpose**: Admin authentication
**Usage**: Login/logout for admin dashboard

### 5. bookingService.ts
**Purpose**: Manage booking records
**Usage**: CRUD operations for cleaning bookings

---

## Payment Services

### 6. stripeService.ts
**Purpose**: Stripe payment integration
**Keys Used**:
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
**Features**: Payment links, checkout sessions

### 7. squareService.ts
**Purpose**: Square invoicing integration
**Keys Used**:
- `SQUARE_APPLICATION_ID`
- `SQUARE_ACCESS_TOKEN`
**Features**: Invoice creation, payment links

### 8. giftCardService.ts
**Purpose**: Gift card management
**Usage**: Purchase, validate, redeem gift cards

---

## Google Services

### 9. googleSheetsService.ts
**Purpose**: Google Sheets integration
**Usage**: Data export, reporting

### 10. geminiService.ts
**Purpose**: Google Gemini AI integration
**Keys Used**: `VITE_GEMINI_API_KEY`
**Usage**: AI chat, content generation

### 11. gmailService.ts
**Purpose**: Gmail API integration
**Keys Used**: Google OAuth credentials
**Usage**: Email sending, inbox management

### 12. googleCalendarService.ts
**Purpose**: Google Calendar integration
**Usage**: Booking scheduling, availability

---

## Other Services

### 13. contractService.ts
**Purpose**: Contract document management
**Usage**: Generate, sign, store cleaning contracts

### 14. fileStorageService.ts
**Purpose**: File upload and storage
**Usage**: Resume uploads, photos, documents

### 15. teamService.ts
**Purpose**: Team/staff management
**Usage**: Employee records, assignments

### 16. complaintService.ts
**Purpose**: Customer complaint handling
**Usage**: Track and resolve customer issues

---

## Notification Services (Created 2026-01-22)

### 17. telegramService.ts
**Purpose**: Send notifications to Telegram group
**Credentials**:
- Bot Token: `7851141818:AAE7KnPJUL5QW82OhaLN2aaE7Shpq1tQQbk`
- Group ID: `-1003155659527`
**Status**: WORKING (tested)
**Functions**:
- `sendTelegramMessage(text, parseMode)`
- `sendResidentialQuoteNotification(data)`
- `sendCommercialQuoteNotification(data)`
- `sendAirbnbQuoteNotification(data)`
- `sendJobApplicationNotification(data)`
- `sendContactNotification(data)`
- `sendFeedbackNotification(data)`
- `sendTestMessage()`

### 18. whatsappService.ts
**Purpose**: Send WhatsApp messages via Meta Business API
**Credentials**:
- Phone Number ID: `92512258402625` (NEEDS RECONFIGURATION)
- Business Account ID: `880203244738731`
- System User Token: (in API_KEYS.env)
**Status**: NEEDS SETUP - Phone Number ID not found/permissions issue
**Functions**:
- `sendWhatsAppMessage(to, text)`
- `sendBusinessNotification(text)`
- `sendResidentialQuoteNotification(data)`
- `sendCommercialQuoteNotification(data)`
- `sendAirbnbQuoteNotification(data)`
- `sendJobApplicationNotification(data)`
- `sendContactNotification(data)`
- `sendFeedbackNotification(data)`
- `sendTestMessage()`

---

## Service Dependencies

```
Form Submission Flow:
1. User fills form (View)
2. webhookService.sendToWebhook() → N8N
3. submissionService.saveSubmission() → Local backup
4. On failure: failedSubmissionsService.saveFailedSubmission()

N8N then handles:
- Email notification (Gmail SMTP)
- SMS notification (Twilio)
- Telegram notification (Bot API)
- WhatsApp notification (Meta API)
- Supabase database insert
```
