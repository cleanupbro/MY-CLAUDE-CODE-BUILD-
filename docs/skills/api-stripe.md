# Skill: Stripe Payments

## Trigger Words
"stripe", "payment", "charge", "invoice", "subscription", "customer"

## Config
```
PUBLISHABLE: See docs/credentials/API_KEYS.env → VITE_STRIPE_PUBLISHABLE_KEY
SECRET: See docs/credentials/API_KEYS.env → STRIPE_SECRET_KEY
MODE: Live
```

## MCP Tools Available
Use `mcp__stripe__*` tools directly:
- `retrieve_balance` - Get account balance
- `list_customers` - List customers
- `create_customer` - Create customer
- `list_products` - List products
- `create_product` - Create product
- `list_prices` - List prices
- `create_price` - Create price
- `create_payment_link` - Create payment link
- `create_invoice` - Create invoice
- `list_invoices` - List invoices
- `list_subscriptions` - List subscriptions

## Quick Test (MCP)
```
mcp__stripe__retrieve_balance
mcp__stripe__list_customers with limit=5
```

## Quick Test (curl)
```bash
curl https://api.stripe.com/v1/balance \
  -u sk_live_YOUR_KEY:
```

## Status
✅ MCP Connected | ✅ Live Keys Active
