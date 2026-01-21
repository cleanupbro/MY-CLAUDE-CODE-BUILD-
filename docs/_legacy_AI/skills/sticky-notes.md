# sticky-notes.md - Token Saving Summaries
## Clean Up Bros

**Trigger:** Reading large files/folders, "summarize", "sticky note"
**Purpose:** Create README summaries to avoid re-reading files

---

## WHEN TO USE

Auto-trigger when:
- Reading a file > 100 lines
- Reading a folder with > 5 files
- User says "summarize" or "sticky note"

---

## WORKFLOW

### For Files (> 100 lines)

1. Read the file once
2. Create summary with:
   - Purpose (1 line)
   - Key exports/functions
   - Dependencies
   - Line count
3. Save as `_README_[filename].md` in same folder

### For Folders (> 5 files)

1. List all files
2. Create `README.md` in folder with:
   - Folder purpose
   - File list with 1-line descriptions
   - Key patterns
   - Entry point(s)

---

## SUMMARY FORMAT (Files)

```markdown
# SUMMARY: [filename]
**Purpose:** [1 line description]
**Lines:** [count]

## Key Parts
| Function/Class | Purpose |
|----------------|---------|
| [name] | [what it does] |
| [name] | [what it does] |

## Dependencies
- [import 1]
- [import 2]

*Updated: [date]*
```

---

## SUMMARY FORMAT (Folders)

```markdown
# README - [folder name]
**Purpose:** [1 line]

## Files
| File | Purpose |
|------|---------|
| file1 | desc |
| file2 | desc |

**Entry Point:** [main file]

*Updated: [date]*
```

---

## BENEFITS

- No re-reading = fewer tokens used
- Faster context loading
- Works for both Claude and Gemini
- Summaries stay with code

---

## EXAMPLE USE CASES

### LandingViewNew.tsx (1200+ lines)
```markdown
# SUMMARY: LandingViewNew.tsx
**Purpose:** Main landing page with Ken Burns, testimonials, premium CTA
**Lines:** 1247

## Key Parts
| Component | Purpose |
|-----------|---------|
| Hero | Ken Burns background, headline, CTAs |
| ServicesGrid | 4 service cards with hover effects |
| BeforeAfterGallery | Local cleaning images with slider |
| TestimonialsGrid | 3-card testimonial layout |
| PremiumCTA | Gradient background, sparkles, glassmorphic button |

## Dependencies
- React, useState, useEffect
- lucide-react icons
- NewsletterPopup, RecentBookingToast

*Updated: January 19, 2026*
```

---

## CHECKLIST

When creating a sticky note:
- [ ] Read the file/folder once
- [ ] Identify key parts
- [ ] Write concise summary
- [ ] Save to appropriate location
- [ ] Verify summary is accurate

---

*Auto-invoked by skills/SKILLS_INDEX.md*
*Created: January 19, 2026*
