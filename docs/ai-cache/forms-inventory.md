# Forms Inventory
> All forms in Clean Up Bros portal with fields and endpoints
> Last Updated: 2026-01-22

## Summary
- **Total Forms**: 6 main forms
- **Working Forms**: 5
- **Broken Forms**: 1 (ContactView.tsx)

---

## 1. Residential Quote Form
**File**: `src/views/ResidentialQuoteView.tsx`
**Status**: Working
**Webhook**: `https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c`

### Fields
| Field | Type | Required | Options |
|-------|------|----------|---------|
| suburb | text | Yes | - |
| propertyType | select | Yes | Apartment, Townhouse, House |
| bedrooms | number | Yes | 1-10 |
| bathrooms | number | Yes | 1-10 |
| serviceType | select | Yes | General, Deep, End-of-Lease, Post-Construction |
| condition | select | Yes | Standard, Moderate, Heavy, Extreme |
| frequency | select | Yes | One-time, Weekly, Bi-weekly, Monthly |
| subscribedToOneYearPlan | checkbox | No | - |
| addOns | multi-select | No | Oven, Window, Carpet, Fridge, Wall, Balcony, Garage |
| preferredDate | date | Yes | - |
| preferredTime | select | Yes | Morning, Afternoon, Flexible |
| notes | textarea | No | - |
| fullName | text | Yes | - |
| email | email | Yes | - |
| phone | tel | Yes | - |
| agreedToTerms | checkbox | Yes | - |

### Submission Payload
```json
{
  "suburb": "Liverpool",
  "propertyType": "House",
  "bedrooms": 3,
  "bathrooms": 2,
  "serviceType": "End-of-Lease",
  "condition": "Standard",
  "frequency": "One-time",
  "subscribedToOneYearPlan": false,
  "addOns": ["Oven Cleaning", "Carpet Steam Cleaning"],
  "preferredDate": "2026-01-25",
  "preferredTime": "Morning",
  "notes": "",
  "fullName": "John Smith",
  "email": "john@example.com",
  "phone": "0400-123-456",
  "agreedToTerms": true,
  "priceEstimate": 450,
  "referenceId": "CUB-ABC123",
  "submittedAt": "2026-01-22T10:00:00Z"
}
```

---

## 2. Commercial Quote Form
**File**: `src/views/CommercialQuoteView.tsx`
**Status**: Working
**Webhook**: `https://nioctibinu.online/webhook/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32`

### Fields
| Field | Type | Required | Options |
|-------|------|----------|---------|
| companyName | text | Yes | - |
| contactPerson | text | Yes | - |
| email | email | Yes | - |
| phone | tel | Yes | - |
| facilityType | select | Yes | Office, Warehouse, Medical, Gym, School, etc. |
| squareMeters | text | Yes | - |
| cleaningFrequency | select | Yes | Daily, Weekly, Bi-weekly, Monthly |
| complianceNeeds | multi-select | No | WHS Certified, Police Checks, Insured, WWC, NDIS |
| painPoints | textarea | No | - |
| preferredStartDate | date | Yes | - |
| contractTerm | select | Yes | 3 months, 6 months, 12 months |

---

## 3. Airbnb Quote Form
**File**: `src/views/AirbnbQuoteView.tsx`
**Status**: Working
**Webhook**: `https://nioctibinu.online/webhook/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f`

### Fields
| Field | Type | Required | Options |
|-------|------|----------|---------|
| listingUrl | text | No | - |
| propertyType | select | Yes | Studio, 1-Bed, 2-Bed, 3-Bed, 4+ Bed |
| bedrooms | text | Yes | - |
| bathrooms | text | Yes | - |
| turnoverRequirements | multi-select | No | Linen Change, Laundry, Restocking, etc. |
| accessMethod | select | Yes | Key, Lockbox, Host, Smart Lock |
| preferredTurnoverTime | select | Yes | 10am, 11am, 12pm, 1pm |
| preferredStartDate | date | Yes | - |
| cleaningFrequency | select | Yes | Per Checkout, Weekly, On-demand |
| contactName | text | Yes | - |
| email | email | Yes | - |
| phone | tel | Yes | - |

---

## 4. Job Application Form
**File**: `src/views/JobApplicationView.tsx`
**Status**: Working
**Webhook**: `https://nioctibinu.online/webhook/67f764f2-adff-481e-aa49-fd3de1feecde`

### Fields
| Field | Type | Required | Options |
|-------|------|----------|---------|
| fullName | text | Yes | - |
| email | email | Yes | - |
| phone | tel | Yes | - |
| hasWorkRights | checkbox | Yes | - |
| experience | select | Yes | None, 1-2 years, 3-5 years, 5+ years |
| hasOwnEquipment | checkbox | No | - |
| availability | multi-select | Yes | Mon, Tue, Wed, Thu, Fri, Sat, Sun |
| serviceSuburbs | text | Yes | - |
| preferredStartDate | date | Yes | - |
| referenceName | text | No | - |
| referenceContact | text | No | - |
| attachments | file | No | Resume/CV |
| photos | file | No | ID/Photos |
| agreedToChecks | checkbox | Yes | - |

---

## 5. Client Feedback Form
**File**: `src/views/ClientFeedbackView.tsx`
**Status**: Working
**Webhook**: `https://nioctibinu.online/webhook/client-feedback`

### Fields
| Field | Type | Required |
|-------|------|----------|
| name | text | Yes |
| email | email | Yes |
| bookingReference | text | No |
| rating | number (1-5) | Yes |
| feedbackType | select | Yes |
| message | textarea | Yes |

---

## 6. Contact Form
**File**: `src/views/ContactView.tsx`
**Status**: BROKEN - Only logs to console, does NOT send data

### Fields
| Field | Type | Required |
|-------|------|----------|
| name | text | Yes |
| email | email | Yes |
| phone | tel | Yes |
| subject | select | Yes |
| message | textarea | Yes |

### Issue
Line 46: `console.log('Contact form submitted:', formData);`
- Data is never sent to a webhook
- Needs to be fixed to use `sendToWebhook()`

### Fix Required
Add webhook integration using `sendToWebhook()` service

---

## Test Payloads

### Residential Test
```json
{
  "fullName": "Test Residential",
  "email": "cleanupbros.au@gmail.com",
  "phone": "+61406764585",
  "suburb": "Liverpool",
  "bedrooms": 3,
  "bathrooms": 2,
  "serviceType": "General",
  "condition": "Standard",
  "frequency": "One-time",
  "propertyType": "House",
  "preferredDate": "2026-01-25",
  "preferredTime": "Morning",
  "priceEstimate": 299,
  "_test": true
}
```

### Commercial Test
```json
{
  "companyName": "Test Company Pty Ltd",
  "contactPerson": "Test Commercial",
  "email": "cleanupbros.au@gmail.com",
  "phone": "+61406764585",
  "facilityType": "Office",
  "squareMeters": "500",
  "cleaningFrequency": "Weekly",
  "contractTerm": "6 months",
  "priceEstimate": 1200,
  "_test": true
}
```

### Airbnb Test
```json
{
  "contactName": "Test Airbnb Host",
  "email": "cleanupbros.au@gmail.com",
  "phone": "+61406764585",
  "propertyType": "2-Bed Apartment",
  "bedrooms": "2",
  "bathrooms": "1",
  "cleaningFrequency": "Per Checkout",
  "preferredStartDate": "2026-01-25",
  "priceEstimate": 180,
  "_test": true
}
```

### Job Application Test
```json
{
  "fullName": "Test Applicant",
  "email": "cleanupbros.au@gmail.com",
  "phone": "+61406764585",
  "hasWorkRights": true,
  "experience": "1-2 years",
  "availability": ["Mon", "Wed", "Fri"],
  "serviceSuburbs": "Liverpool, Cabramatta",
  "_test": true
}
```
