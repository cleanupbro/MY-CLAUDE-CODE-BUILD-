# new-feature.md - New Feature Skill
## Clean Up Bros

**Trigger:** "feature", "add", "build", "implement", "create"
**Purpose:** Systematic feature implementation

---

## WORKFLOW

### Step 1: Understand Requirements
```yaml
Clarify with user:
- What does the feature do?
- Who uses it?
- Where does it fit in the app?
- Any specific design requirements?
```

### Step 2: Plan the Implementation
```yaml
Create plan:
1. Files to create/modify
2. Components needed
3. Data flow
4. API integrations
5. Estimated steps

Present plan to user for approval.
```

### Step 3: Check Existing Patterns
```yaml
Review codebase:
- How are similar features built?
- What patterns are used?
- What components can be reused?
```

### Step 4: Implement
```yaml
Build in order:
1. Types (src/types.ts if needed)
2. Components (src/components/)
3. Views (src/views/)
4. Services (src/services/)
5. Integration (src/App.tsx)
```

### Step 5: Follow Design System
```yaml
Use brand colors:
- Primary: #008080 (teal)
- Accent: #F2B705 (gold)
- Background: #0B2545 (navy)

Use existing components:
- btn-primary for buttons
- input for form fields
- floating-card for cards
```

### Step 6: Test
```yaml
1. npm run build (must pass)
2. npm run dev
3. Test new feature manually
4. Test it doesn't break existing features
```

### Step 7: Document
```yaml
Update if needed:
- MEMORY.md (VERSION HISTORY)
- TASKS.md (mark complete)
- AI_CONFIG/UNIVERSAL.md (if new patterns)
```

---

## ADDING A NEW VIEW

```typescript
// 1. Create src/views/NewView.tsx
import React from 'react';

const NewView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2545] via-[#134074] to-[#0B2545]">
      {/* Content */}
    </div>
  );
};

export default NewView;

// 2. Add to src/types.ts
export type ViewType = 'landing' | 'newview' | ...;

// 3. Add lazy import in src/App.tsx
const NewView = lazy(() => import('./views/NewView'));

// 4. Add case in renderView()
case 'newview':
  return <NewView />;
```

---

## ADDING A NEW COMPONENT

```typescript
// Create src/components/NewComponent.tsx
import React from 'react';

interface NewComponentProps {
  title: string;
  onClick?: () => void;
}

const NewComponent: React.FC<NewComponentProps> = ({ title, onClick }) => {
  return (
    <div className="floating-card">
      <h3>{title}</h3>
      <button className="btn-primary" onClick={onClick}>
        Action
      </button>
    </div>
  );
};

export default NewComponent;
```

---

## CHECKLIST

- [ ] Requirements understood
- [ ] Plan approved by user
- [ ] Existing patterns followed
- [ ] Brand design system used
- [ ] Build passes
- [ ] Feature tested
- [ ] Documented
- [ ] sync.md run

---

*Build features systematically. Follow patterns.*
