# Skill: Supabase Database

## Trigger Words
"supabase", "database", "db", "query", "table", "insert", "select"

## Config
```
URL: https://rtnamqbkowtrwogelgqv.supabase.co
ANON_KEY: See docs/credentials/API_KEYS.env → VITE_SUPABASE_ANON_KEY
SERVICE_ROLE: See docs/credentials/API_KEYS.env → SUPABASE_SERVICE_ROLE
```

## Usage in Code
```typescript
import { supabase } from '@/lib/supabase';

// Query
const { data, error } = await supabase
  .from('submissions')
  .select('*')
  .limit(10);

// Insert
const { data, error } = await supabase
  .from('submissions')
  .insert({ name: 'Test', email: 'test@test.com' });
```

## Tables
- `submissions` - Quote submissions
- `bookings` - Confirmed bookings
- `customers` - Customer records
- `gift_cards` - Gift card records
- `complaints` - Customer complaints

## Quick Test (curl)
```bash
curl 'https://rtnamqbkowtrwogelgqv.supabase.co/rest/v1/submissions?limit=1' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Status
✅ Connected | ✅ Used in App
