# Clean Up Bros - Development Tasks

**Last Updated:** February 2026  
**Project:** Website → Full App Conversion

---

## 📋 TASK BREAKDOWN

### Phase 0: Foundation ✅ COMPLETE
- [x] Codebase audit (26 pages mapped)
- [x] Backend architecture documented
- [x] n8n integrations mapped (13 webhooks)
- [x] PWA support added
- [x] MIT license added
- [x] UI enhancements (gradients, animations)
- [x] Micro-interactions added
- [x] Testing setup (Vitest + Playwright)

---

### Phase 1: Bug Fixes & Performance
**Priority: HIGH | ETA: 1-2 days**

#### Critical Bugs
- [ ] Mobile nav menu animation polish
- [ ] Form validation error messages consistency
- [ ] Price calculator edge cases (6+ bedrooms, extreme conditions)
- [ ] Exit intent popup less aggressive timing

#### Performance
- [ ] Optimize hero images (compress to <100KB)
- [ ] Lazy load below-fold images
- [ ] Code split admin routes
- [ ] Add loading skeletons

#### SEO
- [ ] Add missing meta tags to dynamic pages
- [ ] Auto-generate sitemap on build
- [ ] Update favicon to modern format (webp/svg)
- [ ] Create proper 404 page

---

### Phase 2: Customer Features
**Priority: HIGH | ETA: 1 week**

#### Booking Tracker
- [ ] Real-time job status updates
- [ ] Push notifications (cleaning started, completed)
- [ ] ETA countdown
- [ ] Cleaner photo + name display

#### Payment Portal
- [ ] View invoices
- [ ] Pay online (Square integration)
- [ ] Download receipts
- [ ] Gift card redemption

#### Communication
- [ ] In-app messaging with cleaners
- [ ] AI chatbot for quick answers
- [ ] SMS notification preferences

---

### Phase 3: Cleaner App (Mobile)
**Priority: MEDIUM | ETA: 2 weeks**

#### Job Management
- [ ] Today's jobs dashboard
- [ ] Navigate to address (Google Maps link)
- [ ] View customer notes
- [ ] Special instructions display

#### Check-In System
- [ ] GPS-verified arrival
- [ ] Before photos (required)
- [ ] After photos (required)
- [ ] Digital signature capture

#### Earnings
- [ ] Weekly earnings summary
- [ ] Tip tracking
- [ ] Hours logged

---

### Phase 4: Admin Enhancements
**Priority: MEDIUM | ETA: 1 week**

#### Dashboard
- [ ] Real-time map of active jobs
- [ ] Revenue analytics graphs
- [ ] Customer lifetime value
- [ ] Conversion funnel

#### Automation
- [ ] Auto-assign cleaners based on location
- [ ] Smart scheduling suggestions
- [ ] Follow-up email sequences
- [ ] Review request automation

---

### Phase 5: Native App
**Priority: LOW | ETA: 3-4 weeks**

#### Setup
- [ ] Expo/React Native project
- [ ] Share components with web
- [ ] Push notification setup (FCM)
- [ ] App store assets

#### Customer App
- [ ] iOS build
- [ ] Android build
- [ ] TestFlight deployment
- [ ] Play Store beta

#### Cleaner App
- [ ] Separate app or role-based access
- [ ] Offline support
- [ ] Background location (for ETA)

---

## 🔗 BACKEND INTEGRATION STATUS

### n8n Webhooks (nioctibinu.online)
| Webhook | Status | Last Tested |
|---------|--------|-------------|
| Residential Quote | ✅ Working | Feb 2026 |
| Commercial Quote | ✅ Working | Feb 2026 |
| Airbnb Quote | ✅ Working | Feb 2026 |
| Job Application | ✅ Working | Feb 2026 |
| Landing Lead | ✅ Working | Feb 2026 |
| Booking Confirm | ✅ Working | Feb 2026 |
| Payment Link | ✅ Working | Feb 2026 |
| AI Chat | ✅ Working | Feb 2026 |
| SMS Follow-up | ✅ Working | Feb 2026 |
| Inbound Call | ✅ Working | Feb 2026 |
| Outbound Call | ✅ Working | Feb 2026 |
| Client Feedback | ✅ Working | Feb 2026 |
| Contact Form | ✅ Working | Feb 2026 |

### Supabase Tables
| Table | Status | RLS |
|-------|--------|-----|
| submissions | ✅ Active | ✅ |
| admin_users | ✅ Active | ✅ |
| customers | ✅ Active | ✅ |
| team_members | ✅ Active | ✅ |
| bookings | ✅ Active | ✅ |
| invoices | ✅ Active | ✅ |
| complaints | ✅ Active | ✅ |
| job_applications | ✅ Active | ✅ |

---

## 📊 METRICS TO TRACK

| Metric | Current | Target | Due |
|--------|---------|--------|-----|
| Lighthouse Score | ~75 | 90+ | Mar 2026 |
| Quote Conversion | ~15% | 25% | Apr 2026 |
| Page Load (3G) | ~4s | <2s | Mar 2026 |
| Bounce Rate | ~45% | <35% | Apr 2026 |
| App Installs | 0 | 500+ | Jun 2026 |

---

## 🚀 QUICK WINS (Do Today)

1. [ ] Compress hero images with TinyPNG
2. [ ] Add loading="lazy" to all images
3. [ ] Fix any console errors
4. [ ] Test all forms submit correctly
5. [ ] Verify n8n webhooks still work

---

*Use this file to track progress. Update checkboxes as tasks complete.*
