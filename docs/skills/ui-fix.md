# UI Fix Skill

> Fix invisible text, invisible buttons, and UI visibility issues across the application
> Priority: HIGH

---

## Triggers

- "invisible text"
- "can't see text"
- "invisible font"
- "btn-secondary"
- "invisible button"
- "UI broken"
- "dark text on dark background"
- "light text on light background"

---

## Pre-Flight Checks

1. [ ] Identify which component has the issue
2. [ ] Check if using problematic CSS classes
3. [ ] Verify if issue is in admin section or public pages
4. [ ] Check for brand color usage (may have contrast issues)

---

## Common Problems & Solutions

### Problem 1: Invisible Button Text (`btn-secondary`)

The `btn-secondary` class has invisible or low-contrast text.

**Before (Broken):**
```tsx
<button className="btn-secondary py-3 px-6">
  Cancel
</button>
```

**After (Fixed):**
```tsx
<button className="py-3 px-6 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-semibold">
  Cancel
</button>
```

---

### Problem 2: Invisible Input/Select Text

Inputs and selects missing explicit text color on light backgrounds.

**Before (Broken):**
```tsx
<input className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]" />
```

**After (Fixed):**
```tsx
<input className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white placeholder-gray-400" />
```

**Key additions:**
- `text-gray-900` - Dark visible text
- `bg-white` - Explicit white background
- `placeholder-gray-400` - Visible placeholder text

---

### Problem 3: Invisible Textarea Text

**Before (Broken):**
```tsx
<textarea className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]" />
```

**After (Fixed):**
```tsx
<textarea className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white placeholder-gray-400" />
```

---

### Problem 4: Brand Colors with Poor Contrast

Classes like `text-brand-navy` or `bg-brand-off-white` may have contrast issues.

**Solution:** Replace with explicit Tailwind colors:
- `text-brand-navy` → `text-gray-900` or `text-[#1D1D1F]`
- `bg-brand-off-white` → `bg-white` or `bg-gray-50`

---

### Problem 5: Header Overlap

Fixed headers blocking content below.

**Solution:** Add top padding to main content:
```tsx
<div className="min-h-screen bg-[#F5F5F7] pt-24">
  {/* pt-24 = 96px to clear fixed header */}
</div>
```

---

## Files to Check for UI Issues

| Component | Location | Common Issues |
|-----------|----------|---------------|
| ComplaintsView | `src/components/admin/ComplaintsView.tsx` | Filter dropdowns, btn-secondary |
| CustomerHistory | `src/components/admin/CustomerHistory.tsx` | Search input, note buttons |
| EmailTemplates | `src/components/admin/EmailTemplates.tsx` | All inputs and buttons |
| TeamManagement | `src/components/admin/TeamManagement.tsx` | Edit buttons |
| CalendarView | `src/components/admin/CalendarView.tsx` | Modal inputs |
| AdminDashboard | `src/views/AdminDashboardView.tsx` | Header padding |

---

## Step-by-Step Fix Process

### 1. Identify Problematic Classes

Search for these patterns:
```bash
grep -r "btn-secondary" src/
grep -r "text-brand" src/
grep -r "bg-brand" src/
```

### 2. Apply Standard Fix Pattern

For **buttons**:
```tsx
// Replace btn-secondary with explicit styling
className="py-2 px-4 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
```

For **inputs/selects**:
```tsx
// Add to existing classes
text-gray-900 bg-white placeholder-gray-400
```

### 3. Verify Build

```bash
npm run build
```

### 4. Test Visually

Start dev server and check all affected pages:
```bash
npm run dev
```

---

## Quick Reference: Standard Classes

### Buttons

| Type | Classes |
|------|---------|
| Primary | `bg-[#0071e3] text-white px-6 py-3 rounded-xl hover:bg-[#0066CC] font-semibold` |
| Secondary | `text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 font-semibold` |
| Danger | `text-white bg-red-500 rounded-xl hover:bg-red-600 font-semibold` |
| Success | `text-white bg-green-500 rounded-xl hover:bg-green-600 font-semibold` |

### Form Elements

| Element | Required Classes |
|---------|-----------------|
| Input | `text-gray-900 bg-white placeholder-gray-400` |
| Select | `text-gray-900 bg-white` |
| Textarea | `text-gray-900 bg-white placeholder-gray-400` |

### Text Colors

| Use Case | Class |
|----------|-------|
| Primary text | `text-[#1D1D1F]` or `text-gray-900` |
| Secondary text | `text-gray-500` or `text-gray-600` |
| Muted text | `text-gray-400` |
| Links | `text-[#0071e3]` |

---

## Verification Checklist

- [ ] All inputs have visible text
- [ ] All buttons have visible labels
- [ ] All dropdowns show selected value clearly
- [ ] Placeholders are visible (gray-400)
- [ ] Build passes
- [ ] No TypeScript errors

---

## Success Message

```
UI Fix Applied:
   Files changed: [list]
   Classes fixed: btn-secondary, inputs, selects
   Build: Passes
   Ready for testing
```

---

*After fixing UI issues, test on both desktop and mobile views.*
