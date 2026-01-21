# Skill: Google APIs (Gemini, Calendar, Gmail)

## Trigger Words
"google", "gemini", "ai chat", "calendar", "gmail", "send email"

## Config
```
GEMINI_KEY: See docs/credentials/API_KEYS.env → VITE_GEMINI_API_KEY
GOOGLE_API_KEY: See docs/credentials/API_KEYS.env → GOOGLE_API_KEY
CLIENT_ID: See docs/credentials/API_KEYS.env → GOOGLE_CLIENT_ID
CLIENT_SECRET: See docs/credentials/API_KEYS.env → GOOGLE_CLIENT_SECRET
```

## Gemini Chat (In App)
```typescript
import { geminiService } from '@/services/geminiService';

const response = await geminiService.chat("What cleaning services do you offer?");
```

## Gmail via N8N
```bash
curl -X POST https://nioctibinu.online/webhook/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"customer@email.com","subject":"Booking Confirmed","body":"Your booking..."}'
```

## Calendar via N8N
```bash
curl -X POST https://nioctibinu.online/webhook/create-calendar-event \
  -H "Content-Type: application/json" \
  -d '{"title":"Cleaning - John","start":"2026-01-25T09:00:00","duration":3}'
```

## Direct Gemini API Test
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

## Status
✅ Gemini Active | ✅ OAuth Configured | ✅ N8N Integration
