# Clean Up Bros - Setup Without N8N

This guide shows how to run the website with **zero N8N dependency**.

---

## ✅ What Works Without Any Setup

These features work immediately with no additional configuration:

| Feature | How It Works |
|---------|--------------|
| Form submissions | Saved to Supabase |
| Telegram notifications | Direct API call |
| SMS notifications | Direct Twilio API |
| Admin dashboard | Reads from Supabase |
| Pipeline management | Supabase CRUD |
| Square invoices | Direct Square API |

---

## 📧 Email Setup (Optional)

To enable customer emails, add **one** environment variable to Vercel:

### Step 1: Get Resend API Key (Free)
1. Go to [resend.com](https://resend.com)
2. Sign up (free tier = 3,000 emails/month)
3. Create an API key

### Step 2: Add to Vercel
1. Go to your Vercel project → Settings → Environment Variables
2. Add:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   ```
3. Redeploy

### Step 3: Verify Domain (Optional but Recommended)
1. In Resend dashboard, add domain: `cleanupbros.com.au`
2. Add the DNS records they provide
3. Once verified, emails come from `hello@cleanupbros.com.au`

Without domain verification, emails come from `onboarding@resend.dev` (works but looks less professional).

---

## 📅 Google Calendar Setup (Optional)

To enable automatic calendar events when bookings are approved:

### Option A: Simple Webhook (Recommended)
Use Zapier, Make, or a simple Google Apps Script to receive webhooks:

1. Create a Google Apps Script that creates calendar events
2. Deploy as web app
3. Add to Vercel:
   ```
   GOOGLE_CALENDAR_WEBHOOK=https://script.google.com/macros/s/xxx/exec
   ```

### Option B: Service Account (Advanced)
1. Create a Google Cloud project
2. Enable Calendar API
3. Create service account
4. Share your calendar with the service account email
5. Add to Vercel:
   ```
   GOOGLE_CALENDAR_ID=your-calendar@gmail.com
   GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
   ```

---

## 🔧 Environment Variables Summary

### Required (Already Set)
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
VITE_SQUARE_APPLICATION_ID=sq0idp-xxx
```

### Optional (For Full Features)
```env
# Email sending
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=Clean Up Bros <hello@cleanupbros.com.au>

# Calendar events
GOOGLE_CALENDAR_WEBHOOK=https://your-webhook-url
# OR
GOOGLE_CALENDAR_ID=calendar@gmail.com
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

---

## 📊 What Happens Without Optional Setup

| If Missing | Behavior |
|------------|----------|
| `RESEND_API_KEY` | Emails skipped silently (no errors) |
| `GOOGLE_CALENDAR_*` | Calendar events skipped silently |

The system gracefully degrades - core functionality always works.

---

## 🚀 Quick Start Checklist

1. ✅ Supabase configured (done)
2. ✅ Telegram bot token set (done)
3. ✅ Twilio credentials set (done)
4. ✅ Square credentials set (done)
5. ⬜ (Optional) Add `RESEND_API_KEY` for emails
6. ⬜ (Optional) Add calendar webhook for events

---

## 🆘 Troubleshooting

### Emails not sending
1. Check `RESEND_API_KEY` is set in Vercel
2. Check Vercel function logs for errors
3. Verify Resend dashboard for delivery status

### Calendar events not creating
1. Check `GOOGLE_CALENDAR_WEBHOOK` is set and accessible
2. Test webhook URL manually with curl
3. Check Vercel function logs

### Telegram not working
1. Bot token is in `src/services/telegramService.ts`
2. Chat ID is `-1003155659527`
3. Test with `/api/test-telegram` endpoint (if created)

---

## 📱 Testing

Test form submission:
1. Go to `/quote/residential`
2. Fill out form
3. Check:
   - ✅ Telegram group received notification
   - ✅ SMS received (if configured)
   - ✅ Supabase has new row in `submissions`
   - ✅ Email sent (if Resend configured)

---

*Last updated: February 2, 2026*
