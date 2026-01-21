# pricing.md - Pricing Skill
## Clean Up Bros

**Trigger:** "quote", "price", "cost", "estimate"
**Purpose:** Calculate accurate cleaning quotes

---

## PRICING REFERENCE

Full pricing tables are in: `AI_CONFIG/UNIVERSAL.md`

---

## QUICK REFERENCE

### Base Prices (AUD)

| Beds | Baths | Standard | Deep | End-of-Lease |
|------|-------|----------|------|--------------|
| 1 | 1 | $150 | $210 | $225 |
| 2 | 1 | $200 | $280 | $300 |
| 2 | 2 | $250 | $350 | $375 |
| 3 | 2 | $320 | $448 | $480 |
| 4 | 2 | $400 | $560 | $600 |
| 4 | 3 | $450 | $630 | $675 |

### Multipliers

| Service | Multiplier |
|---------|------------|
| Standard | 1.0x |
| Deep Clean | 1.4x |
| End-of-Lease | 1.5x |
| Move-In | 1.3x |

### Add-Ons

| Add-On | Price |
|--------|-------|
| Oven (single) | $50 |
| Oven (double) | $80 |
| Fridge (inside) | $40 |
| Carpet Steam (/room) | $40 |
| Balcony | $50 |
| Garage (single) | $80 |
| Windows (interior/room) | $15 |

### Frequency Discounts

| Frequency | Discount |
|-----------|----------|
| Weekly | 15% |
| Fortnightly | 10% |
| Monthly | 5% |

### Travel Zones

| Zone | Adjustment |
|------|------------|
| Zone 1 (Liverpool area) | +$0 |
| Zone 2 (Campbelltown, Parramatta) | +$20 |
| Zone 3 (CBD, Penrith) | +$40 |

---

## CALCULATION WORKFLOW

### Step 1: Get Property Details
```yaml
Required:
- Bedrooms
- Bathrooms
- Suburb
- Service type

Optional:
- Add-ons
- Frequency
```

### Step 2: Calculate Base
```
Base = PRICE_TABLE[beds][baths]
```

### Step 3: Apply Service Multiplier
```
Subtotal = Base * SERVICE_MULTIPLIER[serviceType]
```

### Step 4: Add Add-Ons
```
Subtotal = Subtotal + SUM(addons)
```

### Step 5: Apply Travel Zone
```
Subtotal = Subtotal + ZONE_ADJUSTMENT[suburb]
```

### Step 6: Apply Frequency Discount
```
Total = Subtotal * (1 - FREQUENCY_DISCOUNT[frequency])
```

### Step 7: Calculate Deposit
```
Deposit = Total * 0.25
Balance = Total - Deposit
```

---

## QUOTE FORMAT

```
QUOTE FOR: [Customer Name]

Property: [X] bed, [X] bath in [Suburb]
Service: [Service Type]

BASE CLEAN: $[Amount]
ADD-ONS:
  - [Addon 1]: $[X]
  - [Addon 2]: $[X]
SUBTOTAL: $[Amount]
[TRAVEL: +$X (Zone 2/3)]
[DISCOUNT: -$X (Y% frequency discount)]

TOTAL: $[AMOUNT]

Deposit (25%): $[X]
Balance on completion: $[X]

Valid for 7 days | ABN: 26 443 426 374
```

---

## EXAMPLE CALCULATION

**Request:** 3 bed, 2 bath in Liverpool, end-of-lease, with oven and carpet steam (2 rooms)

```
Base (3bed/2bath): $320
Service (end-of-lease, 1.5x): $480
Oven (single): +$50
Carpet Steam (2 rooms): +$80
Zone 1 (Liverpool): +$0

TOTAL: $610

Deposit (25%): $152.50
Balance: $457.50
```

---

## CHECKLIST

- [ ] Property details confirmed
- [ ] Correct base price used
- [ ] Service multiplier applied
- [ ] Add-ons added
- [ ] Travel zone checked
- [ ] Frequency discount (if applicable)
- [ ] 25% deposit calculated
- [ ] Quote formatted properly

---

*Accurate quotes build trust.*
