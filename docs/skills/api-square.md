# Skill: Square Invoicing

## Trigger Words
"square", "invoice", "invoicing", "send invoice"

## Config
```
APPLICATION_ID: sq0idp-26xaIluyXJ4kKz6dT6noOA
ACCESS_TOKEN: See docs/credentials/API_KEYS.env → SQUARE_ACCESS_TOKEN
SECRET: See docs/credentials/API_KEYS.env → SQUARE_APPLICATION_SECRET
MODE: Production
```

## Usage in Code
```typescript
import { squareService } from '@/services/squareService';

// Create invoice
const invoice = await squareService.createInvoice({
  customerId: 'customer_id',
  lineItems: [{ name: 'Cleaning', amount: 25000 }] // cents
});
```

## API Endpoints
- `POST /v2/invoices` - Create invoice
- `GET /v2/invoices/{id}` - Get invoice
- `POST /v2/invoices/{id}/publish` - Send invoice
- `GET /v2/customers` - List customers

## Quick Test (curl)
```bash
curl https://connect.squareup.com/v2/locations \
  -H "Square-Version: 2024-01-18" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Status
✅ Production Keys | ✅ Used for Invoicing
