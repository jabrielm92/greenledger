# GreenLedger — Complete Build & Feature Overview

## 1. What Is GreenLedger?

GreenLedger is a **full-stack SaaS platform for ESG (Environmental, Social, Governance) compliance automation**. It targets SMBs (50–500 employees) in supply chains that must meet regulatory ESG reporting requirements under frameworks like CSRD, GRI, SASB, ISSB, and California SB-253.

**Core value proposition:** Automates ESG data collection from uploaded documents, calculates greenhouse gas emissions (Scope 1/2/3), and generates audit-ready compliance reports — replacing manual spreadsheet workflows with an AI-powered pipeline.

There is **no blockchain integration** despite the name. "Ledger" refers to the traditional audit trail; "Green" refers to sustainability.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) + React 18 + TypeScript 5 |
| **Database** | PostgreSQL 16 + Prisma ORM 5 |
| **Auth** | NextAuth.js v5 (Credentials + Google OAuth) |
| **UI** | Tailwind CSS 3 + shadcn/ui (Radix primitives) + Lucide icons |
| **AI** | OpenAI API (document extraction, classification, analysis, report generation) |
| **Payments** | Stripe (subscriptions, checkout, customer portal, webhooks) |
| **Email** | Resend + React Email templates |
| **State** | Zustand (client-side) |
| **Charts** | Recharts |
| **File Parsing** | pdf-parse, pdfjs-dist (PDF), mammoth (Word), sharp (images) |
| **Forms** | React Hook Form + Zod validation |
| **File Storage** | Local filesystem (`./uploads/`) or S3-compatible (AWS S3, Cloudflare R2, MinIO) |
| **Containerization** | Docker (multi-stage Dockerfile) + Docker Compose |
| **i18n** | Custom implementation (12 locales) |

---

## 3. Build System & Scripts

### NPM Scripts

```
npm run dev          # Start Next.js dev server
npm run build        # Production build (standalone output)
npm run start        # Start production server via server.js
npm run lint         # ESLint (next lint)
npm run db:migrate   # Run Prisma migrations (dev mode)
npm run db:seed      # Seed database with emission factors, frameworks, etc.
npm run db:studio    # Open Prisma Studio GUI
npm run db:reset     # Reset database and re-run migrations
npm run docker:dev   # Docker Compose dev (app + postgres)
npm run docker:prod  # Docker Compose production (detached)
npm run setup        # First-time setup script (env, docker, install, migrate, seed)
```

### Build Pipeline

1. `npx prisma generate` — Generate Prisma client from schema
2. `npx tsc prisma/seed.ts` — Compile seed script to JS
3. `next build` — Compile Next.js (standalone output mode)
4. Multi-stage Docker: `deps` → `builder` → `runner` (node:20-alpine, runs as non-root `nextjs` user on port 8080)

### Next.js Configuration

- **Output mode:** `standalone` (self-contained server.js)
- **External packages:** `@prisma/client`, `bcryptjs`, `pdfjs-dist`, `pdf-parse`, `mammoth`
- **Dark mode:** Tailwind class-based
- **Path alias:** `@/*` → `./src/*`
- **TypeScript:** Strict mode, bundler module resolution

### Docker Compose (Dev)

- **app:** Next.js dev server on port 3000, hot-reload via volume mount
- **db:** PostgreSQL 16-alpine on port 5432 (user: `greenledger`, password: `greenledger`, db: `greenledger`)
- **Volumes:** `postgres_data` (persistent DB), `uploads` (document storage)

---

## 4. Database Schema (Prisma)

**Location:** `prisma/schema.prisma`

**8 migrations** from `20260305` to `20260317` (init → super admin role + profile fields).

### Core Models

#### Authentication & Identity
- **User** — Email, hashed password (bcrypt), role enum (`SUPER_ADMIN | OWNER | ADMIN | MEMBER | VIEWER`), profile fields (phone, jobTitle, department, timezone, bio, locale), linked to Organization
- **Account** — OAuth provider records (Google, etc.)
- **Session** — JWT-based, 30-day expiry with refresh on every request
- **VerificationToken** — Email verification and password reset

#### Multi-Tenant Organization
- **Organization** — Tenant container with Stripe IDs (customerId, subscriptionId), plan tier, industry, country, employee count, QuickBooks credentials, trial tracking (trialEndsAt, trialStartedAt)
- **Industry enum** — Manufacturing, Logistics, Technology, Retail, FoodBeverage, Healthcare, Energy, Agriculture, Construction, Transportation, Finance, Other
- **PlanTier enum** — `FREE_TRIAL` | `BASE` ($249/mo) | `PROFESSIONAL` ($399/mo) | `ENTERPRISE` ($699/mo)

#### Compliance & Reporting
- **ComplianceFramework** — CSRD, GRI, SASB, ISSB_S1, ISSB_S2, SB253
- **FrameworkSection** — Hierarchical sections within each framework
- **FrameworkDataPoint** — Individual disclosure requirements (numeric, text, boolean, date, percentage, currency, narrative types)
- **OrgFramework** — Organization's active frameworks with completion tracking and due dates
- **ReportingPeriod** — Fiscal year windows
- **Report** — Generated compliance reports; status workflow: `DRAFT → GENERATING → REVIEW → APPROVED → PUBLISHED`
- **ReportDataPoint** — Data values mapped to report sections with sources
- **ReportExport** — Exported file records

#### Documents & AI Extraction
- **Document** — Uploaded files with metadata; status: `UPLOADED → PROCESSING → EXTRACTED → REVIEWED → FAILED`
  - Types: `UTILITY_BILL`, `FUEL_RECEIPT`, `INVOICE`, `SUPPLIER_REPORT`, `TRAVEL_RECORD`, `WASTE_MANIFEST`, `FLEET_LOG`, `REFRIGERANT_LOG`
  - Stores: extracted JSON, confidence score, AI analysis text
  - Max 25MB; accepts PDF, CSV, Excel, Word, images (PNG, JPEG, WEBP, TIFF)

#### Emissions
- **EmissionEntry** — Core data record: scope (1/2/3), category, subcategory, activity data (value + unit), calculated CO2e, gas breakdown (CO2, CH4, N2O), emission factor reference, location, methodology, confidence, estimation flag
- **EmissionFactor** — Standard factors database (IPCC, EPA, etc.) with region/year
- **CustomEmissionFactor** — Org-specific overrides

#### Supply Chain
- **Supplier** — Vendor records with ESG risk level (`LOW | MEDIUM | HIGH | CRITICAL | UNKNOWN`), ESG score (0–100), industry, country, notes

#### System
- **Notification** — In-app alerts (type, title, message, read status, org/user scope)
- **AuditLog** — Complete change trail (userId, action, entityType, entityId, previousValue, newValue, metadata)
- **Lead** — Marketing email captures (source, metadata)

---

## 5. Authentication & Authorization

**Files:** `src/lib/auth-options.ts`, `src/lib/admin-auth.ts`, `src/lib/auth.ts`

- **Credentials login:** Email + bcrypt password hashing
- **OAuth:** Google Sign-In (optional, via `NEXT_PUBLIC_GOOGLE_CLIENT_ID`)
- **JWT tokens:** 30-day expiry, auto-refresh on each request
- **Session enrichment:** organizationId, role, plan tier, trial status, locale injected into JWT
- **Trial system:** 3-day default trial + 7-day grace period (view-only during grace)
- **Super Admin portal:** Separate `/admin/login` with `SUPER_ADMIN` role check
- **Email verification:** Via Resend integration during onboarding

### Role Hierarchy & Permissions

| Role | Capabilities |
|------|-------------|
| `SUPER_ADMIN` | Platform-level admin portal, cross-tenant visibility |
| `OWNER` | Full org access, billing management, team invites (all roles) |
| `ADMIN` | Full org access except billing, can invite MEMBER/VIEWER |
| `MEMBER` | Create/edit documents, reports, emissions |
| `VIEWER` | Read-only access |

### Plan Limits

| Feature | FREE_TRIAL | BASE ($249) | PROFESSIONAL ($399) | ENTERPRISE ($699) |
|---------|-----------|-------------|---------------------|-------------------|
| Documents | 50 | 50 | 200 | Unlimited |
| AI Extractions | 50 | 50 | 200 | Unlimited |
| Reports | 2 | 2 | 12 | Unlimited |
| Team Members | 3 | 1 | 3 | Unlimited |
| Suppliers | 25 | 5 | 25 | Unlimited |
| Frameworks | 3 | 1 | 3 | Unlimited |

Every create/edit operation calls `enforceTrialWriteAccess()` and `checkPlanLimit()` before proceeding.

---

## 6. Document Upload & AI Extraction Pipeline

**Files:** `src/app/api/documents/route.ts`, `src/app/api/documents/extract/route.ts`, `src/lib/ai/extract-document.ts`, `src/lib/ai/classify-document.ts`, `src/lib/ai/analyze-document.ts`, `src/lib/ai/parse-document-content.ts`

### Workflow

```
Upload (PDF/CSV/Excel/Word/Image, max 25MB)
  → Store to filesystem or S3
  → Document record created (status: UPLOADED)
  → Async extraction triggered:
      1. Parse file content (OCR for scanned documents)
      2. AI Classification → determine document type (confidence ≥ 0.90)
      3. AI Extraction → field-level data extraction (multilingual, 30+ languages)
      4. AI Analysis → sustainability context assessment
  → Status: EXTRACTED (or FAILED)
  → Event dispatcher fires post-extraction events
```

### AI Capabilities
- **Multilingual support:** Handles 30+ languages with automatic translation to English
- **OCR error correction:** Detects scanner misreads (0/O, 1/l, etc.)
- **Date normalization:** All date formats handled (DD/MM/YYYY, ISO, locale-specific)
- **Unit extraction:** Preserves exact quantities, standardizes to calculation units
- **Confidence scoring:** Per-document extraction confidence metric (0.0–1.0)

### Post-Extraction Events
When a document is successfully extracted, the event dispatcher triggers:
1. **Auto-create EmissionEntry** — If extraction confidence ≥ 0.8
2. **Auto-detect suppliers** — From invoice/supplier documents
3. **Update compliance score** — Recalculate org-wide score
4. **Send notifications** — In-app alert for extraction completion
5. **Flag stale reports** — Mark affected reports for regeneration

---

## 7. Emissions Calculation Engine

**Files:** `src/lib/emissions/calculator.ts`, `src/lib/emissions/emission-factors.ts`, `src/lib/emissions/unit-conversions.ts`, `src/lib/emissions/infer-region.ts`, `src/lib/emissions/ensure-seed.ts`

### Calculation Formula

```
Activity Value (e.g., 100 kWh)
  → Unit conversion (to standard unit for the category)
  → Emission factor lookup (CO2e per unit, by region + year)
  → CO2e = activity × factor
  → Gas breakdown: CO2, CH4, N2O (proportional split if per-gas factors unavailable)
  → Human-readable methodology explanation generated
```

### Features
- **Regional factors:** Region-specific emission factors with `GLOBAL` fallback
- **Custom factors:** Org-level overrides for specific categories
- **Factor sources:** IPCC, EPA, government databases — tracked by year
- **Unit conversions:** Automatic conversion (tons, kg, lbs, kWh, MWh, GJ, liters, gallons, etc.)
- **Scope 3 inference:** Region inference for cross-border value chain emissions
- **Seed data:** Pre-populated factor database via `prisma/seed.ts`

### Emission Scopes
- **Scope 1 (Direct):** Natural gas, diesel, fleet fuel, refrigerants
- **Scope 2 (Indirect Energy):** Purchased electricity, heating, cooling, steam
- **Scope 3 (Value Chain):** Purchased goods, business travel, employee commuting, waste, transportation

---

## 8. Report Generation

**Files:** `src/app/api/reports/generate/route.ts`, `src/lib/ai/generate-report.ts`, `src/lib/reports/csrd-template.ts`, `src/lib/reports/gri-template.ts`

### Supported Compliance Frameworks

| Framework | Standard | Key Disclosures |
|-----------|---------|----------------|
| **CSRD/ESRS** (2024) | EU Corporate Sustainability Reporting Directive | General Disclosures (ESRS2), Climate (E1), Workforce (S1) |
| **GRI** (2021) | Global Reporting Initiative | Universal, economic, environmental, social standards |
| **SASB** (2023) | Sustainability Accounting Standards Board | Industry-specific materiality-based metrics |
| **ISSB S1 & S2** (2023) | IFRS Sustainability Standards | General sustainability + climate disclosures |
| **SB-253** (2024) | California Climate Corporate Data Accountability Act | Scope 1/2/3 mandatory reporting |

### Report Workflow

```
1. DRAFT      → User creates report (selects framework, reporting period)
2. GENERATING → AI generates sections using:
                 - Org context (name, industry, employees, country)
                 - Aggregated emissions data (by scope/category)
                 - Supplier ESG assessments
                 - Framework-specific templates
3. REVIEW     → User reviews, edits narrative sections, fills data gaps
4. APPROVED   → Sign-off by authorized role
5. PUBLISHED  → Final version, exportable to PDF
```

---

## 9. QuickBooks Integration

**Files:** `src/lib/quickbooks/client.ts`, `src/lib/quickbooks/oauth.ts`, `src/lib/quickbooks/sync.ts`, `src/app/api/quickbooks/connect/route.ts`, `src/app/api/quickbooks/callback/route.ts`, `src/app/api/quickbooks/sync/route.ts`

### Features
- **OAuth 2.0 flow:** Connect QuickBooks realm, store access/refresh tokens on Organization
- **Expense sync:** Imports purchases & bills, classifies by emission-relevant account patterns
- **Vendor sync:** Creates Supplier records from QuickBooks vendors
- **Document creation:** Virtual document records for synced transactions
- **Auto-emission:** Triggers document extraction pipeline for QB data
- **Date range filtering:** Sync specific periods (default: current fiscal year)

### Classification Patterns
- **Utility:** electricity, gas, water, heating, energy, power
- **Fuel:** fuel, gasoline, diesel, petrol
- **Travel:** travel, transport, vehicle, fleet, mileage

---

## 10. Compliance Scoring

**File:** `src/lib/compliance-score.ts`

### Algorithm

```
Overall Score = (70% × Framework Completion) + (30% × Data Readiness)
If no frameworks selected: Score = 100% × Data Readiness
```

### Data Readiness Components (100 max points)

| Component | Points | What It Measures |
|-----------|--------|-----------------|
| Scope 1 Emissions | 15 | Direct emission entries exist |
| Scope 2 Emissions | 15 | Indirect energy entries exist |
| Scope 3 Emissions | 10 | Value chain entries exist |
| Supporting Documents | 15 | Utility bills, fuel receipts, invoices uploaded |
| Supply Chain ESG | 10 | Supplier assessments completed |
| Compliance Reports | 15 | Generated reports exist |
| Governance Documentation | 10 | Policy docs and evidence uploaded |
| Category Coverage | 10 | Diversity of emission source types |

### Framework Completion
Per-framework: `coverage % = covered data points / total data points`

---

## 11. Supplier ESG Assessment

**Files:** `src/app/api/suppliers/route.ts`, `src/app/api/suppliers/[id]/score/route.ts`

### Scoring Engine
- **Rule-based baseline:** Industry risk weighting, country risk, keyword analysis on notes
- **AI enhancement:** OpenAI-powered deep assessment (falls back to rules if API unavailable)
- **Risk levels:** LOW (70–100), MEDIUM (50–69), HIGH (30–49), CRITICAL (0–29), UNKNOWN (no assessment)
- **Risk factors:** Industry type (manufacturing = higher), country risk (developing = higher), certifications (ISO 14001 = lower), violations (lawsuit keywords = higher)

---

## 12. Billing & Stripe Integration

**Files:** `src/lib/stripe.ts`, `src/app/api/stripe/webhook/route.ts`, `src/app/api/stripe/checkout/route.ts`, `src/app/api/stripe/portal/route.ts`

### Stripe Events Handled
- `checkout.session.completed` — New subscription activated
- `invoice.payment_succeeded` — Recurring payment confirmed
- `invoice.payment_failed` — Payment failure logged
- `customer.subscription.updated` — Plan change tracked
- `customer.subscription.deleted` — Downgraded to FREE_TRIAL

Products and prices are **auto-created on first checkout** — no Stripe dashboard setup required.

---

## 13. Event-Driven Architecture

**Files:** `src/lib/events/dispatcher.ts`, `src/lib/events/index.ts`, `src/lib/events/handlers/`

### Event Types & Handlers

| Event | Handlers |
|-------|---------|
| `document.extracted` | auto-create-emission, auto-detect-supplier, notify, update-compliance, flag-stale-reports |
| `document.extraction_failed` | notify failure |
| `emission.auto_created` | update-compliance, flag-stale-reports, notify |
| `supplier.auto_created` | notify, update-compliance |

All handlers are async and fire-and-forget with error isolation (one handler failure doesn't block others).

---

## 14. Internationalization (i18n)

**Files:** `src/lib/i18n/index.ts`, `src/lib/i18n/locales/`

**12 supported locales:** English (en), Spanish (es), French (fr), German (de), Portuguese (pt), Chinese (zh), Japanese (ja), Arabic (ar), Welsh (cy), Polish (pl), Urdu (ur), Bengali (bn)

Per-user locale stored in `User.locale`, auto-applied on login. AI extraction prompts are multilingual.

---

## 15. Audit Logging

**Files:** `src/lib/audit/logger.ts`, `src/app/api/audit-log/route.ts`

### Tracked Actions
`entity_created`, `field_changed`, `document_uploaded`, `document_extracted`, `emission_auto_created`, `billing_updated`, `team_invite_sent`

### Features
- Every entity change logged with: userId, action, timestamp, before/after values, metadata (IP, references)
- Filterable by organization, action type, entity type, date range
- Exportable as CSV for external audit compliance

---

## 16. Notification System

**Files:** `src/app/api/notifications/route.ts`, `src/lib/events/handlers/create-notification.ts`

### Event-Driven Alerts
- Document extraction complete / failed
- Emission auto-created from document
- Supplier ESG assessment updated
- Compliance deadline approaching
- Report ready for review
- Team invite received

Features: per-user and org-wide broadcasts, read/unread status, pagination, bulk mark-as-read.

---

## 17. Compliance Alerts & Deadlines

**Files:** `src/app/api/compliance-alerts/route.ts`, `src/app/api/compliance-alerts/send/route.ts`

- **Framework-specific deadlines:** CSRD (June 30), SB-253 (March 31), default (Dec 31)
- **Alert schedule:** 30, 14, 7, 3, 1 days before deadline
- **Delivery:** Cron-triggered endpoint (protected by `CRON_SECRET`) sends email via Resend
- **Content:** Completion %, missing data points, urgency flags

---

## 18. Rate Limiting & Security

**File:** `src/lib/rate-limit.ts`

- Memory-based per-key rate limiting (configurable window)
- Extraction endpoint: 20 requests per 60 seconds
- Auto-cleanup of expired entries every 60 seconds
- Response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`

---

## 19. API Endpoints (Complete)

### Authentication
| Method | Path | Purpose |
|--------|------|---------|
| `*` | `/api/auth/[...nextauth]` | NextAuth routes (login, logout, session) |
| `POST` | `/api/auth/verify-email` | Email verification |
| `POST` | `/api/auth/forgot-password` | Password reset request |
| `POST` | `/api/auth/reset-password` | Password reset execution |
| `POST` | `/api/auth/change-password` | Change password |
| `GET/POST` | `/api/auth/api-key` | API key management |

### Documents
| Method | Path | Purpose |
|--------|------|---------|
| `GET/POST` | `/api/documents` | List / upload documents |
| `POST` | `/api/documents/extract` | Trigger AI extraction |
| `GET` | `/api/documents/[id]/file` | Download file |
| `POST` | `/api/documents/[id]/create-emission` | Manual emission from document |
| `GET` | `/api/documents/export` | Export as CSV |

### Emissions
| Method | Path | Purpose |
|--------|------|---------|
| `GET/POST` | `/api/emissions` | List / create emissions |
| `GET` | `/api/emissions/summary` | Scope breakdown & totals |
| `POST` | `/api/emissions/calculate` | Calculate CO2e from activity data |
| `GET` | `/api/emissions/export` | Export as CSV |

### Reports
| Method | Path | Purpose |
|--------|------|---------|
| `GET/POST` | `/api/reports` | List / create reports |
| `GET/PATCH/DELETE` | `/api/reports/[id]` | Report CRUD |
| `POST` | `/api/reports/generate` | AI-generate report sections |
| `GET` | `/api/reports/[id]/export` | Export as PDF/CSV |

### Suppliers
| Method | Path | Purpose |
|--------|------|---------|
| `GET/POST` | `/api/suppliers` | List / create suppliers |
| `GET/PATCH/DELETE` | `/api/suppliers/[id]` | Supplier CRUD |
| `POST` | `/api/suppliers/[id]/score` | ESG assessment |
| `GET` | `/api/suppliers/export` | Export as CSV |

### Organization & Compliance
| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/organizations/current` | Current org details |
| `PATCH` | `/api/organization` | Update org profile |
| `GET/PUT` | `/api/organization/frameworks` | Manage active frameworks |
| `GET` | `/api/compliance-breakdown` | Detailed score breakdown |
| `POST` | `/api/compliance-alerts/send` | Trigger deadline alerts (cron) |

### Team
| Method | Path | Purpose |
|--------|------|---------|
| `GET/POST` | `/api/team` | List / remove team members |
| `POST` | `/api/team/invite` | Send invite (7-day expiry token) |
| `POST` | `/api/team/accept` | Accept invite |
| `PATCH` | `/api/team/[userId]` | Update member role |

### Billing
| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/billing` | Subscription details |
| `POST` | `/api/stripe/checkout` | Create checkout session |
| `POST` | `/api/stripe/portal` | Customer portal link |
| `POST` | `/api/stripe/webhook` | Stripe event handler |

### QuickBooks
| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/quickbooks/connect` | OAuth initiation |
| `GET` | `/api/quickbooks/callback` | OAuth callback |
| `POST` | `/api/quickbooks/sync` | Sync expenses & vendors |

### Dashboard & Analytics
| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/dashboard` | Aggregated stats (scopes, compliance, counts) |
| `GET` | `/api/dashboard/frameworks-guide` | Framework education content |
| `GET/PATCH` | `/api/notifications` | List / mark-as-read |
| `GET` | `/api/audit-log` | Organization audit logs |
| `GET` | `/api/audit-log/export` | Export audit logs as CSV |

### Admin Portal
| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/admin/stats` | Platform-wide statistics |
| `GET` | `/api/admin/users` | User management |
| `GET` | `/api/admin/tenants` | Organization management |
| `GET` | `/api/admin/subscriptions` | Subscription analytics |
| `GET` | `/api/admin/audit-log` | Platform audit logs |

### Other
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/onboarding` | Framework selection & completion |
| `POST` | `/api/leads/roi-calculator` | Capture ROI calculator leads |
| `GET/POST` | `/api/reporting-periods` | Manage fiscal years |
| `PATCH` | `/api/reporting-periods/[id]` | Mark period as current |

---

## 20. Frontend Architecture

### Page Routes

```
/(auth)/                      Auth pages (login, register, forgot-password, verify-email, reset-password)
/(marketing)/                 Landing pages (home, about, pricing, blog, ROI calculator, contact, terms, privacy)
/dashboard/                   Authenticated application shell
  ├── emissions/              Emission tracking (Scope 1/2/3)
  ├── documents/              Document management & extraction
  ├── reports/                Report generation & viewing
  ├── suppliers/              Supplier ESG assessment
  ├── compliance/             Compliance score & breakdown
  ├── frameworks/             Framework settings
  ├── audit-log/              Activity history
  └── settings/
      ├── billing/            Subscription management
      ├── team/               Team member management
      ├── integrations/       QuickBooks connection
      ├── notifications/      Notification preferences
      ├── security/           API keys, password change
      ├── data-export/        Bulk data download
      └── frameworks/         Framework selection
/onboarding/                  Post-signup wizard
/admin/(portal)/              Super admin dashboard
  ├── users/
  ├── tenants/
  ├── subscriptions/
  ├── audit-log/
  └── monitoring/
/invite/[token]               Team invite acceptance
```

### Key UI Components
- **Document upload** — Drag-and-drop zone (react-dropzone)
- **Emissions table** — Filterable by scope, category, date; inline editing
- **Report wizard** — Multi-step with section-by-section AI generation and manual editing
- **Supplier dashboard** — Risk heatmap, ESG scoring interface
- **Compliance score** — Circular progress visualization with breakdown
- **Framework tracker** — Data point coverage progress bars
- **Audit log viewer** — Paginated, filterable activity timeline

### Custom Hooks
- `use-current-user.ts` — Session and user data
- `use-organization.ts` — Current org context
- `use-emissions.ts` — Emission CRUD operations
- `use-documents.ts` — Document management
- `use-notifications.ts` — Notification polling and state
- `use-debounce.ts` — Input debouncing

### UI Library
shadcn/ui components built on Radix primitives: Avatar, Dialog, Dropdown Menu, Label, Progress, Select, Separator, Slot, Switch, Tabs, Toast, Tooltip. Styled with Tailwind CSS + CSS variables for theming.

### Brand Colors
- Primary: `#059669` (emerald-600)
- Secondary: `#0F172A` (slate-900)
- Accent: `#2563EB` (blue-600)
- Background: `#F8FAFC` (slate-50)

---

## 21. Environment Variables

```bash
# Database
DATABASE_URL="postgresql://greenledger:greenledger@localhost:5432/greenledger?schema=public"

# Auth
AUTH_SECRET="<random-32-char-string>"
NEXTAUTH_URL="http://localhost:3000"

# AI
OPENAI_API_KEY="sk-..."

# Billing
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@greenledger.app"

# QuickBooks (optional)
QUICKBOOKS_CLIENT_ID=""
QUICKBOOKS_CLIENT_SECRET=""
QUICKBOOKS_REDIRECT_URI="http://localhost:3000/api/quickbooks/callback"
QUICKBOOKS_ENVIRONMENT="sandbox"

# File Storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=25
# Optional S3: S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="GreenLedger"
NEXT_PUBLIC_GOOGLE_CLIENT_ID=""  # Optional OAuth

# Cron
CRON_SECRET="<secret>"  # Protects scheduled alert endpoints

# Logging
LOG_LEVEL="info"  # debug, info, warn, error
```

---

## 22. Key Architecture Patterns

1. **Document → Emissions Pipeline:** Upload → AI Extract → Classify → Auto-create EmissionEntry (confidence ≥ 0.8). The entire flow is async and event-driven.

2. **Event-Driven Architecture:** Entity mutations fire cascading events through a dispatcher. Handlers run in parallel with error isolation — one handler failure doesn't block others.

3. **Multi-Tenant Isolation:** Every database query is scoped by `organizationId`. No cross-tenant data leakage is possible at the ORM level.

4. **Plan Enforcement:** Every write operation checks trial status and plan limits before proceeding. Grace period provides read-only access for 7 days post-trial.

5. **AI Fallback Strategy:** AI extraction falls back to template prompts. Supplier scoring falls back to rule-based engine. App remains functional without OpenAI connectivity (degraded mode).

6. **Audit-First Design:** Every mutation is logged to AuditLog with before/after values, enabling regulatory compliance traceability.

7. **Rate Limiting:** Memory-based per-key limiting with automatic cleanup. Currently applied to extraction endpoints (20/min).

---

## 23. File Structure

```
greenledger/
├── prisma/
│   ├── schema.prisma              # Full data model (all 20+ models)
│   ├── seed.ts                    # Database seeding (emission factors, frameworks)
│   └── migrations/                # 8 migration files
├── scripts/
│   └── setup.sh                   # First-time setup automation
├── src/
│   ├── app/
│   │   ├── api/                   # 50+ API route handlers
│   │   ├── (auth)/                # Auth pages
│   │   ├── (marketing)/           # Public marketing pages
│   │   ├── admin/                 # Super admin portal
│   │   ├── dashboard/             # Main application
│   │   ├── onboarding/            # Post-signup wizard
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives
│   │   ├── layout/                # Sidebar, navbar, shells
│   │   ├── dashboard/             # Dashboard widgets
│   │   ├── emissions/             # Emission forms, tables
│   │   ├── documents/             # Upload, viewer, list
│   │   ├── reports/               # Report wizard, viewer
│   │   ├── suppliers/             # Supplier cards, scoring
│   │   ├── admin/                 # Admin portal components
│   │   ├── billing/               # Plan cards, checkout
│   │   ├── onboarding/            # Onboarding steps
│   │   └── shared/                # Reusable utilities
│   ├── hooks/                     # Custom React hooks
│   ├── lib/
│   │   ├── ai/                    # OpenAI integration (extract, classify, analyze, generate)
│   │   ├── emissions/             # Calculation engine, factors, conversions
│   │   ├── events/                # Event dispatcher + handlers
│   │   ├── reports/               # CSRD/GRI report templates
│   │   ├── quickbooks/            # QB OAuth, client, sync
│   │   ├── validations/           # Zod schemas (auth, docs, emissions, orgs, reports, suppliers)
│   │   ├── i18n/                  # Internationalization (12 locales)
│   │   ├── audit/                 # Audit logger
│   │   ├── auth-options.ts        # NextAuth configuration
│   │   ├── auth.ts                # Server-side session retrieval
│   │   ├── prisma.ts              # Singleton Prisma client
│   │   ├── stripe.ts              # Plan definitions, Stripe helpers
│   │   ├── storage.ts             # File storage (local/S3)
│   │   ├── openai.ts              # OpenAI client config
│   │   ├── resend.ts              # Email service
│   │   ├── logger.ts              # Structured logging
│   │   ├── compliance-score.ts    # Scoring algorithm
│   │   ├── trial.ts               # Trial enforcement
│   │   ├── plan-limits.ts         # Plan limit checks
│   │   ├── rate-limit.ts          # Rate limiting
│   │   ├── constants.ts           # App-wide constants
│   │   └── utils.ts               # Utility functions
│   ├── types/                     # TypeScript type definitions
│   └── emails/                    # React Email templates
├── public/                        # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── Dockerfile                     # Multi-stage production build
├── docker-compose.yml             # Dev environment (app + postgres)
├── server.js                      # Production server entry
├── start.sh                       # Docker entrypoint
└── .env.example                   # Environment variable template
```

---

## 24. Dependencies Summary

### Production (Key)
- `next@14.2.35` — Framework
- `react@18` / `react-dom@18` — UI runtime
- `@prisma/client@5.22` — Database ORM
- `next-auth@5.0.0-beta.30` — Authentication
- `openai@6.25` — AI integration
- `stripe@15.12` / `@stripe/stripe-js@3.5` — Billing
- `resend@3.5` — Email delivery
- `zod@3.25` — Schema validation
- `zustand@4.5` — Client state management
- `recharts@2.15` — Data visualization
- `react-hook-form@7.71` — Form management
- `react-dropzone@14.4` — File upload
- `pdf-parse@1.1` / `pdfjs-dist@3.11` — PDF processing
- `mammoth@1.11` — Word document parsing
- `sharp@0.33` — Image processing
- `bcryptjs@2.4` — Password hashing
- `date-fns@3.6` — Date utilities
- `uuid@9.0` — ID generation

### Dev
- `typescript@5` — Type checking
- `eslint@8` + `eslint-config-next` — Linting
- `tailwindcss@3.4` + `tailwindcss-animate` — Styling
- `prisma@5.22` — Migration CLI
- `postcss@8.5` + `autoprefixer` — CSS processing
