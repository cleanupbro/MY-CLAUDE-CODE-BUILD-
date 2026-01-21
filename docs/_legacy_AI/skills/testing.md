# testing.md - Testing Skill
## Clean Up Bros

**Trigger:** "test", "verify", "check", "validate"
**Purpose:** Verify functionality works correctly

---

## TESTING TYPES

### 1. Build Test
```bash
npm run build
```
Must pass with 0 errors.

### 2. Dev Server Test
```bash
npm run dev
```
Server must start on localhost:3000.

### 3. Manual Testing
Navigate through app and verify functionality.

### 4. Webhook Test
```bash
curl -X POST "https://nioctibinu.online/webhook/[PATH]" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","TEST":true}'
```

---

## BUILD TEST

```yaml
Command: npm run build

Expected:
- 0 errors
- 710+ modules transformed
- Build time ~3-4 seconds
- dist/ folder created

Check for:
- TypeScript errors
- Missing imports
- Circular dependencies
```

---

## DEV SERVER TEST

```yaml
Command: npm run dev

Expected:
- Server starts on localhost:3000
- No console errors
- Hot reload works

Test pages:
- / (landing)
- /residential
- /commercial
- /airbnb
- /contact
- /admin
```

---

## WEBHOOK TESTS

### Residential
```bash
curl -X POST "https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@test.com","phone":"0400000000","suburb":"Liverpool","bedrooms":3,"bathrooms":2,"serviceType":"standard","TEST":true}'
```

### Commercial
```bash
curl -X POST "https://nioctibinu.online/webhook/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32" \
  -H "Content-Type: application/json" \
  -d '{"businessName":"Test Business","contactName":"Test","email":"test@test.com","TEST":true}'
```

### Airbnb
```bash
curl -X POST "https://nioctibinu.online/webhook/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f" \
  -H "Content-Type: application/json" \
  -d '{"propertyName":"Test Property","email":"test@test.com","TEST":true}'
```

### Expected Response
```json
{"status":"success"}
```
or
```json
{"message":"received"}
```

If you get `{"message":"Workflow not found"}`, the N8N workflow is inactive.

---

## FORM TESTING CHECKLIST

For each form:
- [ ] All fields render
- [ ] Validation works
- [ ] Submit button works
- [ ] Loading state shows
- [ ] Success message appears
- [ ] Error handling works
- [ ] Webhook receives data

---

## TESTING WORKFLOW

### Step 1: Build Test
```bash
npm run build
```
Must pass.

### Step 2: Start Dev Server
```bash
npm run dev
```

### Step 3: Manual Testing
Open localhost:3000 and test:
- Navigation
- Forms
- Buttons
- Responsiveness

### Step 4: Webhook Tests
Run curl commands above.

### Step 5: Document Results
```yaml
Update MEMORY.md WEBHOOK STATUS:
| Webhook | Status | Last Tested |
| Residential | WORKING | [date] |
```

---

## CHECKLIST

- [ ] Build passes
- [ ] Dev server starts
- [ ] Pages render correctly
- [ ] Forms submit successfully
- [ ] Webhooks respond
- [ ] MEMORY.md updated

---

*Test everything. Trust nothing.*
