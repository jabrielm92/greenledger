# CLAUDE CODE BUILD PROMPT: GreenLedger — AI ESG Compliance Automation for SMBs

> **Instructions for Claude Code:** Build this entire application from scratch following the specifications below. Work through the build order sequentially. Every file, schema, component, and route is specified. Do not skip sections. Ask no questions — everything you need is here.

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Directory Structure](#3-directory-structure)
4. [Environment Variables](#4-environment-variables)
5. [Database Schema (Prisma)](#5-database-schema-prisma)
6. [Authentication & Multi-Tenant Onboarding](#6-authentication--multi-tenant-onboarding)
7. [Document Upload & AI Extraction Pipeline](#7-document-upload--ai-extraction-pipeline)
8. [Scope 1 & 2 Emissions Calculator](#8-scope-1--2-emissions-calculator)
9. [CSRD Report Generator](#9-csrd-report-generator)
10. [QuickBooks Integration](#10-quickbooks-integration)
11. [Compliance Dashboard](#11-compliance-dashboard)
12. [Supply Chain ESG Monitoring (Lite)](#12-supply-chain-esg-monitoring-lite)
13. [Stripe Billing Integration](#13-stripe-billing-integration)
14. [Email Notifications (Resend)](#14-email-notifications-resend)
15. [Landing Page / Marketing Site](#15-landing-page--marketing-site)
16. [Docker & Deployment](#16-docker--deployment)
17. [API Route Reference](#17-api-route-reference)
18. [UI Pages & Components Reference](#18-ui-pages--components-reference)
19. [AI Prompts & Integration Specs](#19-ai-prompts--integration-specs)
20. [Build Order (File-by-File)](#20-build-order-file-by-file)

---

## 1. PROJECT OVERVIEW

### What You're Building

**GreenLedger** is a lightweight, AI-powered SaaS platform that automates ESG (Environmental, Social, Governance) data collection, reporting, and compliance for small-to-medium businesses (50–500 employees).

### Core Value Proposition

- Transform complex regulatory requirements (CSRD, ISSB S1/S2, California SB-253) into simple workflows
- Automate data extraction from invoices, utility bills, and supplier communications
- AI-powered carbon emissions estimation (Scope 1 & 2)
- Pre-built compliance templates for CSRD (MVP), with GRI and SASB planned
- Natural language report generation with audit-ready traceability
- 10-minute onboarding, no dedicated sustainability team required

### Target Users

- **Primary:** SMBs in supply chains of Fortune 1000 companies (50–500 employees)
- **Secondary:** PE/VC portfolio companies requiring ESG disclosure
- **Persona:** CFO, Operations Manager, or Office Manager at an SMB who has been told "we need ESG reporting" and has no idea where to start

### Design Philosophy

- **Mobile-first responsive** — field teams upload data on-site
- **Radically simple** — if a feature requires a manual, it's too complex
- **Audit-ready from day 1** — every data point traceable to source document
- **Explainable AI** — show calculation methodology, not just numbers

### Brand

- **Name:** GreenLedger
- **Tagline:** "ESG compliance on autopilot."
- **Tone:** Professional but approachable. Think "Stripe for ESG" — developer-quality product, human-friendly UX.
- **Colors:** Primary: `#059669` (emerald-600), Secondary: `#0F172A` (slate-900), Accent: `#2563EB` (blue-600), Background: `#F8FAFC` (slate-50)

---

## 2. TECH STACK & DEPENDENCIES

### Core Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 14.2+ |
| Language | TypeScript | 5.x |
| Database | PostgreSQL | 16 |
| ORM | Prisma | 5.x |
| Styling | Tailwind CSS | 3.4+ |
| UI Components | shadcn/ui | latest |
| Auth | NextAuth.js (Auth.js v5) | 5.x |
| File Storage | Local filesystem (MVP) / S3-compatible | — |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) | — |
| Payments | Stripe | latest |
| Email | Resend | latest |
| Charts | Recharts | 2.x |
| Forms | React Hook Form + Zod | latest |
| State | Zustand | latest |
| Containerization | Docker + Docker Compose | — |

### package.json Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "@prisma/client": "^5.14.0",
    "next-auth": "^5.0.0",
    "@auth/prisma-adapter": "^2.0.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.23.0",
    "recharts": "^2.12.0",
    "@anthropic-ai/sdk": "^0.24.0",
    "stripe": "^15.0.0",
    "@stripe/stripe-js": "^3.0.0",
    "resend": "^3.2.0",
    "react-dropzone": "^14.2.0",
    "pdf-parse": "^1.1.1",
    "sharp": "^0.33.0",
    "date-fns": "^3.6.0",
    "uuid": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "lucide-react": "^0.372.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-toast": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "@radix-ui/react-progress": "^1.0.0",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-switch": "^1.0.0",
    "react-pdf": "^7.7.0",
    "mammoth": "^1.7.0"
  },
  "devDependencies": {
    "prisma": "^5.14.0",
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "@types/bcryptjs": "^2.4.0",
    "@types/uuid": "^9.0.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 3. DIRECTORY STRUCTURE

```
greenledger/
├── .env.local                          # Environment variables (see Section 4)
├── .env.example                        # Template for env vars
├── docker-compose.yml                  # Docker Compose config
├── Dockerfile                          # Production Dockerfile
├── Dockerfile.dev                      # Development Dockerfile
├── next.config.js                      # Next.js configuration
├── tailwind.config.ts                  # Tailwind configuration
├── tsconfig.json                       # TypeScript configuration
├── postcss.config.js                   # PostCSS configuration
├── package.json
├── prisma/
│   ├── schema.prisma                   # Database schema
│   ├── seed.ts                         # Seed data (emission factors, frameworks)
│   └── migrations/                     # Auto-generated migrations
├── public/
│   ├── logo.svg                        # GreenLedger logo
│   ├── favicon.ico
│   └── images/
│       ├── hero-dashboard.png          # Landing page hero image placeholder
│       ├── onboarding-step1.svg
│       ├── onboarding-step2.svg
│       └── onboarding-step3.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (providers, fonts, metadata)
│   │   ├── page.tsx                    # Landing page (marketing)
│   │   ├── globals.css                 # Global styles + Tailwind imports
│   │   ├── (marketing)/               # Marketing pages group
│   │   │   ├── layout.tsx              # Marketing layout (navbar + footer)
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx            # Pricing page
│   │   │   ├── about/
│   │   │   │   └── page.tsx            # About page
│   │   │   └── contact/
│   │   │       └── page.tsx            # Contact page
│   │   ├── (auth)/                     # Auth pages group
│   │   │   ├── layout.tsx              # Auth layout (centered card)
│   │   │   ├── login/
│   │   │   │   └── page.tsx            # Login page
│   │   │   ├── register/
│   │   │   │   └── page.tsx            # Registration page
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx            # Email verification
│   │   │   └── forgot-password/
│   │   │       └── page.tsx            # Password reset
│   │   ├── onboarding/                 # Post-registration onboarding
│   │   │   ├── layout.tsx              # Onboarding layout (stepper)
│   │   │   ├── page.tsx                # Step 1: Company profile
│   │   │   ├── industry/
│   │   │   │   └── page.tsx            # Step 2: Industry & framework
│   │   │   ├── integrations/
│   │   │   │   └── page.tsx            # Step 3: Connect QuickBooks
│   │   │   └── complete/
│   │   │       └── page.tsx            # Onboarding complete
│   │   ├── dashboard/                  # Main app (authenticated)
│   │   │   ├── layout.tsx              # Dashboard layout (sidebar + topbar)
│   │   │   ├── page.tsx                # Dashboard home (compliance overview)
│   │   │   ├── emissions/
│   │   │   │   ├── page.tsx            # Emissions overview
│   │   │   │   ├── scope-1/
│   │   │   │   │   └── page.tsx        # Scope 1 detail + entry
│   │   │   │   └── scope-2/
│   │   │   │       └── page.tsx        # Scope 2 detail + entry
│   │   │   ├── documents/
│   │   │   │   ├── page.tsx            # Document library
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # Document detail + extracted data
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx            # Reports list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx        # Generate new report (wizard)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # Report viewer + export
│   │   │   ├── suppliers/
│   │   │   │   ├── page.tsx            # Supplier list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # Supplier detail + ESG status
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx            # General settings
│   │   │   │   ├── billing/
│   │   │   │   │   └── page.tsx        # Billing & subscription (Stripe)
│   │   │   │   ├── team/
│   │   │   │   │   └── page.tsx        # Team management
│   │   │   │   └── integrations/
│   │   │   │       └── page.tsx        # Connected integrations
│   │   │   └── audit-log/
│   │   │       └── page.tsx            # Full audit trail
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts        # NextAuth catch-all
│   │       ├── users/
│   │       │   └── route.ts            # User CRUD
│   │       ├── organizations/
│   │       │   ├── route.ts            # Org CRUD
│   │       │   └── [id]/
│   │       │       └── route.ts        # Org detail
│   │       ├── documents/
│   │       │   ├── route.ts            # Upload + list documents
│   │       │   ├── [id]/
│   │       │   │   └── route.ts        # Document detail
│   │       │   └── extract/
│   │       │       └── route.ts        # AI extraction endpoint
│   │       ├── emissions/
│   │       │   ├── route.ts            # Emissions CRUD
│   │       │   ├── calculate/
│   │       │   │   └── route.ts        # Emissions calculation engine
│   │       │   └── summary/
│   │       │       └── route.ts        # Emissions summary/aggregation
│   │       ├── reports/
│   │       │   ├── route.ts            # Reports CRUD
│   │       │   ├── generate/
│   │       │   │   └── route.ts        # AI report generation
│   │       │   └── [id]/
│   │       │       ├── route.ts        # Report detail
│   │       │       └── export/
│   │       │           └── route.ts    # PDF/CSV export
│   │       ├── suppliers/
│   │       │   ├── route.ts            # Supplier CRUD
│   │       │   └── [id]/
│   │       │       └── route.ts        # Supplier detail
│   │       ├── quickbooks/
│   │       │   ├── connect/
│   │       │   │   └── route.ts        # OAuth initiation
│   │       │   ├── callback/
│   │       │   │   └── route.ts        # OAuth callback
│   │       │   └── sync/
│   │       │       └── route.ts        # Data sync endpoint
│   │       ├── stripe/
│   │       │   ├── checkout/
│   │       │   │   └── route.ts        # Create checkout session
│   │       │   ├── portal/
│   │       │   │   └── route.ts        # Customer portal
│   │       │   └── webhook/
│   │       │       └── route.ts        # Stripe webhooks
│   │       ├── audit-log/
│   │       │   └── route.ts            # Audit log queries
│   │       └── onboarding/
│   │           └── route.ts            # Onboarding state management
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── table.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── alert.tsx
│   │   │   └── sheet.tsx
│   │   ├── layout/
│   │   │   ├── sidebar.tsx             # Dashboard sidebar navigation
│   │   │   ├── topbar.tsx              # Dashboard top bar
│   │   │   ├── mobile-nav.tsx          # Mobile navigation drawer
│   │   │   ├── marketing-navbar.tsx    # Marketing site navbar
│   │   │   └── marketing-footer.tsx    # Marketing site footer
│   │   ├── dashboard/
│   │   │   ├── compliance-score.tsx    # Circular compliance score widget
│   │   │   ├── emissions-chart.tsx     # Emissions over time chart
│   │   │   ├── quick-actions.tsx       # Quick action cards
│   │   │   ├── recent-activity.tsx     # Recent activity feed
│   │   │   ├── framework-progress.tsx  # Framework completion progress
│   │   │   └── stats-cards.tsx         # KPI stat cards
│   │   ├── documents/
│   │   │   ├── upload-zone.tsx         # Drag-and-drop upload zone
│   │   │   ├── document-card.tsx       # Document preview card
│   │   │   ├── extraction-review.tsx   # Review AI-extracted data
│   │   │   └── document-list.tsx       # Document list/grid view
│   │   ├── emissions/
│   │   │   ├── emissions-form.tsx      # Manual emissions entry form
│   │   │   ├── emissions-table.tsx     # Emissions data table
│   │   │   ├── scope-breakdown.tsx     # Scope 1 vs 2 breakdown chart
│   │   │   └── calculation-detail.tsx  # Show calculation methodology
│   │   ├── reports/
│   │   │   ├── report-wizard.tsx       # Multi-step report generation
│   │   │   ├── report-preview.tsx      # Report preview with sections
│   │   │   ├── report-card.tsx         # Report list item card
│   │   │   └── section-editor.tsx      # Edit individual report section
│   │   ├── suppliers/
│   │   │   ├── supplier-form.tsx       # Add/edit supplier form
│   │   │   ├── supplier-card.tsx       # Supplier status card
│   │   │   └── risk-badge.tsx          # ESG risk level badge
│   │   ├── onboarding/
│   │   │   ├── stepper.tsx             # Onboarding step indicator
│   │   │   ├── company-form.tsx        # Company profile form
│   │   │   ├── industry-picker.tsx     # Industry selection
│   │   │   └── framework-selector.tsx  # Compliance framework picker
│   │   ├── billing/
│   │   │   ├── plan-card.tsx           # Pricing plan card
│   │   │   ├── usage-meter.tsx         # Usage/limits display
│   │   │   └── invoice-list.tsx        # Invoice history
│   │   └── shared/
│   │       ├── page-header.tsx         # Page title + description + actions
│   │       ├── empty-state.tsx         # Empty state illustrations
│   │       ├── loading-spinner.tsx     # Loading spinner
│   │       ├── data-table.tsx          # Reusable data table component
│   │       ├── file-icon.tsx           # File type icon
│   │       ├── confirm-dialog.tsx      # Confirmation dialog
│   │       ├── search-input.tsx        # Search input with debounce
│   │       └── audit-badge.tsx         # Audit trail badge (shows source)
│   ├── lib/
│   │   ├── prisma.ts                   # Prisma client singleton
│   │   ├── auth.ts                     # NextAuth configuration
│   │   ├── auth-options.ts             # Auth providers + callbacks
│   │   ├── stripe.ts                   # Stripe client initialization
│   │   ├── resend.ts                   # Resend client initialization
│   │   ├── anthropic.ts               # Anthropic client initialization
│   │   ├── utils.ts                    # cn() utility + helpers
│   │   ├── constants.ts               # App-wide constants
│   │   ├── validations/
│   │   │   ├── auth.ts                 # Auth form schemas (Zod)
│   │   │   ├── organization.ts         # Organization schemas
│   │   │   ├── document.ts             # Document upload schemas
│   │   │   ├── emissions.ts            # Emissions entry schemas
│   │   │   ├── report.ts              # Report generation schemas
│   │   │   └── supplier.ts            # Supplier schemas
│   │   ├── emissions/
│   │   │   ├── calculator.ts           # Emissions calculation engine
│   │   │   ├── emission-factors.ts     # Emission factor database
│   │   │   └── unit-conversions.ts     # Unit conversion utilities
│   │   ├── ai/
│   │   │   ├── extract-document.ts     # Document data extraction
│   │   │   ├── generate-report.ts      # Report content generation
│   │   │   ├── classify-document.ts    # Document type classification
│   │   │   └── prompts.ts             # All AI prompt templates
│   │   ├── quickbooks/
│   │   │   ├── client.ts              # QuickBooks API client
│   │   │   ├── oauth.ts               # OAuth flow helpers
│   │   │   └── sync.ts               # Data sync logic
│   │   ├── reports/
│   │   │   ├── csrd-template.ts       # CSRD report template + structure
│   │   │   ├── gri-template.ts        # GRI Standards template (stub)
│   │   │   └── pdf-generator.ts       # PDF generation from report data
│   │   └── audit/
│   │       └── logger.ts              # Audit log utility
│   ├── hooks/
│   │   ├── use-current-user.ts        # Current auth user hook
│   │   ├── use-organization.ts        # Current org context hook
│   │   ├── use-emissions.ts           # Emissions data hook
│   │   ├── use-documents.ts           # Documents data hook
│   │   └── use-debounce.ts            # Debounce hook
│   ├── store/
│   │   ├── onboarding-store.ts        # Onboarding wizard state
│   │   └── report-wizard-store.ts     # Report generation wizard state
│   ├── types/
│   │   ├── index.ts                   # Shared TypeScript types
│   │   ├── emissions.ts               # Emissions-specific types
│   │   ├── documents.ts               # Document-specific types
│   │   ├── reports.ts                 # Report-specific types
│   │   └── quickbooks.ts             # QuickBooks API types
│   └── emails/
│       ├── welcome.tsx                # Welcome email template
│       ├── report-ready.tsx           # Report generated notification
│       ├── compliance-alert.tsx       # Compliance deadline alert
│       └── invite-team.tsx            # Team invitation email
└── scripts/
    ├── seed-emission-factors.ts       # Seed emission factor database
    └── generate-test-data.ts          # Generate test data for development
```

---

## 4. ENVIRONMENT VARIABLES

Create `.env.example` with the following. All variables are required unless marked optional.

```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://greenledger:greenledger@localhost:5432/greenledger?schema=public"

# ============================================
# NEXTAUTH
# ============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-32-char-string-here"

# ============================================
# ANTHROPIC (AI)
# ============================================
ANTHROPIC_API_KEY="sk-ant-..."

# ============================================
# STRIPE (BILLING)
# ============================================
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_BASE_PLAN_PRICE_ID="price_..."
STRIPE_PRO_PLAN_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PLAN_PRICE_ID="price_..."

# ============================================
# RESEND (EMAIL)
# ============================================
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@greenledger.app"

# ============================================
# QUICKBOOKS (OPTIONAL FOR MVP)
# ============================================
QUICKBOOKS_CLIENT_ID=""
QUICKBOOKS_CLIENT_SECRET=""
QUICKBOOKS_REDIRECT_URI="http://localhost:3000/api/quickbooks/callback"
QUICKBOOKS_ENVIRONMENT="sandbox"

# ============================================
# FILE STORAGE
# ============================================
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=25

# ============================================
# APP
# ============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="GreenLedger"
```

---

## 5. DATABASE SCHEMA (PRISMA)

Create `prisma/schema.prisma` with the following complete schema:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// AUTH & USERS
// ============================================

model User {
  id              String    @id @default(cuid())
  name            String?
  email           String    @unique
  emailVerified   DateTime?
  hashedPassword  String?
  image           String?
  role            UserRole  @default(MEMBER)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  organizationId  String?
  organization    Organization? @relation(fields: [organizationId], references: [id])

  accounts        Account[]
  sessions        Session[]
  auditLogs       AuditLog[]
  uploadedDocuments Document[] @relation("UploadedBy")

  @@index([organizationId])
  @@index([email])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

enum UserRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

// ============================================
// ORGANIZATION (MULTI-TENANT)
// ============================================

model Organization {
  id                String   @id @default(cuid())
  name              String
  slug              String   @unique
  industry          Industry?
  employeeCount     Int?
  country           String?
  city              String?
  website           String?
  fiscalYearStart   Int      @default(1) // Month (1=Jan)
  onboardingComplete Boolean @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Stripe
  stripeCustomerId       String?   @unique
  stripeSubscriptionId   String?   @unique
  stripePriceId          String?
  stripeCurrentPeriodEnd DateTime?
  plan                   PlanTier  @default(FREE_TRIAL)

  // QuickBooks
  quickbooksRealmId      String?
  quickbooksAccessToken  String?   @db.Text
  quickbooksRefreshToken String?   @db.Text
  quickbooksTokenExpiry  DateTime?

  // Relations
  users               User[]
  documents            Document[]
  emissionEntries      EmissionEntry[]
  emissionFactors      CustomEmissionFactor[]
  reports              Report[]
  suppliers            Supplier[]
  auditLogs            AuditLog[]
  complianceFrameworks OrgFramework[]
  reportingPeriods     ReportingPeriod[]

  @@index([slug])
  @@index([stripeCustomerId])
}

enum Industry {
  MANUFACTURING
  LOGISTICS
  PROFESSIONAL_SERVICES
  CONSTRUCTION
  TECHNOLOGY
  RETAIL
  FOOD_BEVERAGE
  HEALTHCARE
  ENERGY
  AGRICULTURE
  OTHER
}

enum PlanTier {
  FREE_TRIAL
  BASE
  PROFESSIONAL
  ENTERPRISE
}

// ============================================
// COMPLIANCE FRAMEWORKS
// ============================================

model ComplianceFramework {
  id          String   @id @default(cuid())
  name        String   @unique // "CSRD", "GRI", "SASB", "ISSB_S1", "ISSB_S2"
  displayName String
  version     String
  description String?  @db.Text
  regions     String[] // ["EU", "US-CA", "GLOBAL"]
  isActive    Boolean  @default(true)

  sections    FrameworkSection[]
  orgFrameworks OrgFramework[]
}

model FrameworkSection {
  id          String   @id @default(cuid())
  frameworkId String
  code        String   // "E1", "S1", "G1" etc.
  title       String
  description String?  @db.Text
  parentId    String?
  sortOrder   Int      @default(0)
  isRequired  Boolean  @default(true)

  framework   ComplianceFramework @relation(fields: [frameworkId], references: [id])
  parent      FrameworkSection?   @relation("SectionHierarchy", fields: [parentId], references: [id])
  children    FrameworkSection[]  @relation("SectionHierarchy")
  dataPoints  FrameworkDataPoint[]

  @@index([frameworkId])
}

model FrameworkDataPoint {
  id          String   @id @default(cuid())
  sectionId   String
  code        String   // "E1-1", "E1-2" etc.
  label       String
  description String?  @db.Text
  dataType    DataPointType
  unit        String?  // "tCO2e", "MWh", "EUR", "%"
  isRequired  Boolean  @default(true)

  section     FrameworkSection @relation(fields: [sectionId], references: [id])
  reportDataPoints ReportDataPoint[]

  @@index([sectionId])
}

enum DataPointType {
  NUMERIC
  TEXT
  BOOLEAN
  DATE
  PERCENTAGE
  CURRENCY
  NARRATIVE
}

model OrgFramework {
  id             String   @id @default(cuid())
  organizationId String
  frameworkId     String
  targetYear      Int     // Reporting year (e.g., 2025)
  status         FrameworkStatus @default(NOT_STARTED)
  completionPct  Float   @default(0)
  dueDate        DateTime?
  createdAt      DateTime @default(now())

  organization   Organization @relation(fields: [organizationId], references: [id])
  framework      ComplianceFramework @relation(fields: [frameworkId], references: [id])

  @@unique([organizationId, frameworkId, targetYear])
}

enum FrameworkStatus {
  NOT_STARTED
  IN_PROGRESS
  REVIEW
  SUBMITTED
  COMPLETED
}

// ============================================
// REPORTING PERIODS
// ============================================

model ReportingPeriod {
  id             String   @id @default(cuid())
  organizationId String
  name           String   // "FY2025"
  startDate      DateTime
  endDate        DateTime
  isCurrent      Boolean  @default(false)
  createdAt      DateTime @default(now())

  organization   Organization @relation(fields: [organizationId], references: [id])
  emissionEntries EmissionEntry[]
  reports        Report[]

  @@unique([organizationId, name])
  @@index([organizationId])
}

// ============================================
// DOCUMENTS & AI EXTRACTION
// ============================================

model Document {
  id               String   @id @default(cuid())
  organizationId   String
  uploadedById     String
  fileName         String
  fileType         String   // "application/pdf", "image/png", etc.
  filePath         String
  fileSize         Int      // bytes
  documentType     DocumentType?
  status           DocumentStatus @default(UPLOADED)
  extractedData    Json?    // AI-extracted structured data
  extractionConfidence Float? // 0-1 confidence score
  processingError  String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  organization     Organization @relation(fields: [organizationId], references: [id])
  uploadedBy       User @relation("UploadedBy", fields: [uploadedById], references: [id])
  emissionEntries  EmissionEntry[]
  auditReferences  AuditLog[] @relation("AuditDocument")

  @@index([organizationId])
  @@index([documentType])
  @@index([status])
}

enum DocumentType {
  UTILITY_BILL
  FUEL_RECEIPT
  INVOICE
  SUPPLIER_REPORT
  TRAVEL_RECORD
  WASTE_MANIFEST
  FLEET_LOG
  REFRIGERANT_LOG
  OTHER
}

enum DocumentStatus {
  UPLOADED
  PROCESSING
  EXTRACTED
  REVIEWED
  FAILED
}

// ============================================
// EMISSIONS DATA
// ============================================

model EmissionEntry {
  id               String   @id @default(cuid())
  organizationId   String
  reportingPeriodId String?
  documentId       String?  // Source document (audit trail)

  scope            EmissionScope
  category         String   // "stationary_combustion", "purchased_electricity", etc.
  subcategory      String?  // More specific classification
  source           String   // "Natural Gas Boiler", "Grid Electricity", etc.
  description      String?

  // Activity data
  activityValue    Float    // Quantity consumed
  activityUnit     String   // "kWh", "liters", "km", "therms", etc.

  // Emission factor used
  emissionFactorId String?
  emissionFactor   Float    // kgCO2e per unit
  emissionFactorSource String? // "EPA 2024", "DEFRA 2025", "Custom"

  // Calculated emissions
  co2e             Float    // Total kg CO2e
  co2              Float?   // CO2 component
  ch4              Float?   // CH4 component (CO2e)
  n2o              Float?   // N2O component (CO2e)

  // Metadata
  startDate        DateTime
  endDate          DateTime
  location         String?  // Facility/site name
  isEstimated      Boolean  @default(false)
  confidenceScore  Float?   // 0-1, how confident we are in the data
  notes            String?
  calculationMethod String? // "activity-based", "spend-based", "distance-based"

  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  organization     Organization @relation(fields: [organizationId], references: [id])
  reportingPeriod  ReportingPeriod? @relation(fields: [reportingPeriodId], references: [id])
  document         Document? @relation(fields: [documentId], references: [id])

  @@index([organizationId, scope])
  @@index([organizationId, startDate, endDate])
  @@index([reportingPeriodId])
}

enum EmissionScope {
  SCOPE_1
  SCOPE_2
  SCOPE_3
}

// Emission factors database
model EmissionFactor {
  id           String   @id @default(cuid())
  category     String   // "electricity", "natural_gas", "diesel", etc.
  subcategory  String?
  region       String   // "US", "EU", "UK", "US-CA", "GLOBAL"
  unit         String   // "kgCO2e/kWh", "kgCO2e/liter", etc.
  co2ePerUnit  Float
  co2PerUnit   Float?
  ch4PerUnit   Float?
  n2oPerUnit   Float?
  source       String   // "EPA", "DEFRA", "IEA", etc.
  year         Int      // Year of the factor
  validFrom    DateTime
  validTo      DateTime?
  isActive     Boolean  @default(true)

  @@unique([category, subcategory, region, source, year])
  @@index([category, region])
}

// Custom emission factors per org
model CustomEmissionFactor {
  id             String   @id @default(cuid())
  organizationId String
  name           String
  category       String
  unit           String
  co2ePerUnit    Float
  source         String   // "Supplier-provided", "Third-party audit", etc.
  notes          String?
  createdAt      DateTime @default(now())

  organization   Organization @relation(fields: [organizationId], references: [id])

  @@index([organizationId])
}

// ============================================
// REPORTS
// ============================================

model Report {
  id               String   @id @default(cuid())
  organizationId   String
  reportingPeriodId String?
  frameworkType     String   // "CSRD", "GRI", "SASB"
  title            String
  status           ReportStatus @default(DRAFT)
  generatedContent Json?    // AI-generated report sections
  manualEdits      Json?    // User edits layered on top
  finalContent     Json?    // Merged final content
  version          Int      @default(1)
  publishedAt      DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  organization     Organization @relation(fields: [organizationId], references: [id])
  reportingPeriod  ReportingPeriod? @relation(fields: [reportingPeriodId], references: [id])
  dataPoints       ReportDataPoint[]
  exports          ReportExport[]

  @@index([organizationId])
  @@index([status])
}

enum ReportStatus {
  DRAFT
  GENERATING
  REVIEW
  APPROVED
  PUBLISHED
}

model ReportDataPoint {
  id              String   @id @default(cuid())
  reportId        String
  dataPointId     String
  value           String?  @db.Text
  numericValue    Float?
  isComplete      Boolean  @default(false)
  source          String?  // "auto-calculated", "manual", "ai-estimated"
  notes           String?

  report          Report @relation(fields: [reportId], references: [id], onDelete: Cascade)
  dataPoint       FrameworkDataPoint @relation(fields: [dataPointId], references: [id])

  @@unique([reportId, dataPointId])
  @@index([reportId])
}

model ReportExport {
  id        String   @id @default(cuid())
  reportId  String
  format    String   // "pdf", "csv", "xlsx"
  filePath  String
  createdAt DateTime @default(now())

  report    Report @relation(fields: [reportId], references: [id], onDelete: Cascade)
}

// ============================================
// SUPPLIERS
// ============================================

model Supplier {
  id             String   @id @default(cuid())
  organizationId String
  name           String
  contactEmail   String?
  contactName    String?
  industry       Industry?
  country        String?
  website        String?
  esgRiskLevel   RiskLevel @default(UNKNOWN)
  esgScore       Float?    // 0-100
  lastAssessment DateTime?
  notes          String?   @db.Text
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  organization   Organization @relation(fields: [organizationId], references: [id])

  @@index([organizationId])
  @@index([esgRiskLevel])
}

enum RiskLevel {
  LOW
  MEDIUM
  HIGH
  CRITICAL
  UNKNOWN
}

// ============================================
// AUDIT LOG
// ============================================

model AuditLog {
  id             String   @id @default(cuid())
  organizationId String
  userId         String?
  action         String   // "emission_created", "report_generated", "document_uploaded"
  entityType     String   // "EmissionEntry", "Report", "Document"
  entityId       String
  previousValue  Json?
  newValue       Json?
  documentId     String?  // Source document reference
  metadata       Json?    // Additional context
  ipAddress      String?
  createdAt      DateTime @default(now())

  organization   Organization @relation(fields: [organizationId], references: [id])
  user           User? @relation(fields: [userId], references: [id])
  document       Document? @relation("AuditDocument", fields: [documentId], references: [id])

  @@index([organizationId, createdAt])
  @@index([entityType, entityId])
  @@index([action])
}
```

---

## 6. AUTHENTICATION & MULTI-TENANT ONBOARDING

### Auth Configuration (`src/lib/auth-options.ts`)

Use NextAuth v5 with the Prisma adapter. Support two auth methods for MVP:

1. **Email/Password** — credentials provider with bcryptjs hashing
2. **Google OAuth** — social login (optional, include provider config but can be disabled)

**Key behaviors:**

- On registration, create a User record. Do NOT create an Organization yet — that happens in onboarding.
- After first login, check if `user.organizationId` is null. If so, redirect to `/onboarding`.
- JWT strategy (not database sessions) for simplicity.
- Include `organizationId`, `role`, and `plan` in the JWT token and session.
- All dashboard API routes must verify the session and scope queries to the user's `organizationId`.

### Registration Flow (`src/app/(auth)/register/page.tsx`)

**Form fields:**
- Full name
- Work email
- Password (min 8 chars, 1 uppercase, 1 number)
- Confirm password

**On submit:**
1. Validate with Zod schema
2. POST to `/api/users` — hash password, create User
3. Send welcome email via Resend
4. Auto-login and redirect to `/onboarding`

### Onboarding Flow (4 Steps, Target: < 10 minutes)

#### Step 1: Company Profile (`/onboarding`)

**Form fields:**
- Company name (required)
- Number of employees (dropdown: 1-50, 51-100, 101-250, 251-500, 500+)
- Country (searchable select)
- City
- Industry (select from Industry enum)
- Fiscal year start month (select, default January)

**On submit:** Create Organization, link to User (set as OWNER), create default ReportingPeriod for current fiscal year.

#### Step 2: Framework Selection (`/onboarding/industry`)

**UI:** Cards with checkboxes showing available frameworks:
- CSRD (EU) — recommended if country is in EU
- ISSB S1/S2 — recommended if country is CA, UK, JP, SG
- California SB-253 — recommended if country is US
- GRI Standards — voluntary, global
- SASB Standards — voluntary, global

Auto-recommend based on country from Step 1. Show a brief description for each. User selects 1+.

**On submit:** Create OrgFramework records for selected frameworks.

#### Step 3: Integrations (`/onboarding/integrations`)

**UI:** Integration cards with "Connect" buttons:
- QuickBooks Online — "Auto-import financial data for emissions calculation"
- Xero — "Coming soon" badge (disabled)
- Manual upload — "Skip for now, upload documents manually"

Each card shows what data it pulls and why.

**On submit:** If QuickBooks selected, initiate OAuth. Otherwise, skip.

#### Step 4: Complete (`/onboarding/complete`)

**UI:** Success animation (checkmark), quick stats:
- "Your GreenLedger workspace is ready!"
- "Framework: CSRD" (shows selected)
- "Reporting period: FY2025"
- "Next step: Upload your first utility bill"

**CTA button:** "Go to Dashboard" → redirect to `/dashboard`

**On complete:** Set `organization.onboardingComplete = true`.

### Middleware (`src/middleware.ts`)

Implement Next.js middleware that:
1. Checks auth status for all `/dashboard/*` and `/onboarding/*` routes
2. If not authenticated → redirect to `/login`
3. If authenticated but no organization → redirect to `/onboarding`
4. If authenticated with org but onboarding incomplete → redirect to `/onboarding`
5. If authenticated with org and onboarding complete → allow access to `/dashboard/*`
6. Marketing routes (`/`, `/pricing`, `/about`, `/contact`) are always public

---

## 7. DOCUMENT UPLOAD & AI EXTRACTION PIPELINE

### Overview

This is the core AI feature. Users upload documents (utility bills, fuel receipts, invoices), and the system uses Claude to extract structured data that feeds into emissions calculations.

### Upload Zone Component (`src/components/documents/upload-zone.tsx`)

- Use `react-dropzone` for drag-and-drop
- Accept: PDF, PNG, JPG, JPEG, WEBP, CSV, XLSX
- Max file size: 25MB
- Show upload progress bar
- Support multiple files at once (batch upload)
- Mobile: Show camera capture option

### Upload API (`src/app/api/documents/route.ts`)

**POST** — Upload document:
1. Receive multipart form data
2. Validate file type and size
3. Save file to `UPLOAD_DIR/{organizationId}/{uuid}.{ext}`
4. Create Document record with status `UPLOADED`
5. Create AuditLog entry
6. Trigger extraction (call `/api/documents/extract` internally)
7. Return Document with ID

**GET** — List documents:
- Query by organizationId (from session)
- Filter by: documentType, status, dateRange
- Paginate (20 per page)
- Sort by: createdAt (desc default)

### AI Extraction Pipeline (`src/lib/ai/extract-document.ts`)

This is the main AI extraction function. It takes a document and returns structured data.

#### Step 1: Document Classification

Use Claude to classify the document type. Send the first page/image to Claude with this prompt:

```
System: You are a document classification system for ESG/sustainability reporting. Classify the uploaded document into exactly one of these categories: UTILITY_BILL, FUEL_RECEIPT, INVOICE, SUPPLIER_REPORT, TRAVEL_RECORD, WASTE_MANIFEST, FLEET_LOG, REFRIGERANT_LOG, OTHER.

Respond with ONLY a JSON object:
{
  "documentType": "UTILITY_BILL",
  "confidence": 0.95,
  "reasoning": "Document shows electricity consumption from a utility provider with kWh readings and billing period."
}
```

#### Step 2: Data Extraction

Based on the classified type, use a type-specific extraction prompt. Here's the UTILITY_BILL example (create similar for each type):

```
System: You are an ESG data extraction system. Extract structured data from this utility bill for carbon emissions calculation. Be precise with numbers and units.

Extract the following fields and respond with ONLY a JSON object:

{
  "provider": "string - Utility company name",
  "accountNumber": "string - Account number if visible",
  "billingPeriod": {
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD"
  },
  "utilityType": "electricity | natural_gas | water | district_heating",
  "consumption": {
    "value": 0.0,
    "unit": "kWh | therms | m3 | MWh | gallons"
  },
  "cost": {
    "value": 0.0,
    "currency": "USD | EUR | GBP | CAD"
  },
  "facilityAddress": "string - Service address",
  "meterNumber": "string | null",
  "rateType": "string | null - e.g., commercial, industrial",
  "renewablePercentage": "number | null - % of renewable energy if stated",
  "confidence": 0.92,
  "extractionNotes": "string - Any uncertainties or assumptions made"
}

If a field cannot be determined from the document, set it to null. Never guess — mark confidence lower if uncertain.
```

#### Step 3: Confidence Review

If `confidence < 0.8`, set document status to `EXTRACTED` but flag for human review. If `confidence >= 0.8`, auto-accept but still allow review.

#### Extraction Review UI (`src/components/documents/extraction-review.tsx`)

Show a side-by-side view:
- **Left:** Original document (PDF viewer or image)
- **Right:** Extracted data in editable form fields

Each field shows:
- Extracted value (editable)
- Confidence indicator (green/yellow/red dot)
- "Accept" / "Edit" toggle

**Bottom actions:**
- "Confirm & Create Emission Entry" — Creates EmissionEntry from extracted data
- "Re-extract" — Re-runs AI extraction
- "Reject" — Marks document as failed, won't create emission entry

### Document Detail Page (`src/app/dashboard/documents/[id]/page.tsx`)

Shows:
- Document metadata (name, type, upload date, uploaded by)
- Document preview (embedded PDF/image viewer)
- Extracted data summary
- Linked emission entries (if any)
- Audit trail for this document

---

## 8. SCOPE 1 & 2 EMISSIONS CALCULATOR

### Emissions Calculation Engine (`src/lib/emissions/calculator.ts`)

This is the core calculation module. It takes activity data and returns emissions in kgCO2e.

#### Scope 1 Categories

Scope 1 = Direct emissions from owned/controlled sources.

| Category | Activity Data | Unit | Example |
|----------|--------------|------|---------|
| Stationary Combustion | Fuel consumed | liters, therms, m3, gallons | Natural gas boiler, diesel generator |
| Mobile Combustion | Fuel consumed or distance | liters, km, miles | Company fleet vehicles |
| Fugitive Emissions | Refrigerant quantity | kg | HVAC refrigerant leaks |
| Process Emissions | Production output | tonnes, units | Manufacturing processes |

#### Scope 2 Categories

Scope 2 = Indirect emissions from purchased energy.

| Category | Activity Data | Unit | Example |
|----------|--------------|------|---------|
| Purchased Electricity | Electricity consumed | kWh, MWh | Grid electricity |
| Purchased Heat/Steam | Heat consumed | kWh, MWh, GJ | District heating |
| Purchased Cooling | Cooling consumed | kWh, MWh | District cooling |

#### Calculation Formula

```
Emissions (kgCO2e) = Activity Data × Emission Factor

Where:
- Activity Data = quantity consumed (e.g., 10,000 kWh)
- Emission Factor = kgCO2e per unit (e.g., 0.42 kgCO2e/kWh for US grid average)
```

#### Implementation

```typescript
// src/lib/emissions/calculator.ts

interface CalculationInput {
  activityValue: number;
  activityUnit: string;
  category: string;
  subcategory?: string;
  region: string;
  year: number;
  customFactorId?: string;
}

interface CalculationResult {
  co2e: number;       // Total kgCO2e
  co2: number;        // CO2 component
  ch4: number;        // CH4 component (in CO2e)
  n2o: number;        // N2O component (in CO2e)
  emissionFactor: number;
  emissionFactorSource: string;
  calculationMethod: string;
  methodology: string; // Human-readable explanation of calculation
}

export async function calculateEmissions(input: CalculationInput): Promise<CalculationResult> {
  // 1. Convert units to standard (e.g., gallons → liters)
  // 2. Look up emission factor from database (or use custom)
  // 3. Apply calculation formula
  // 4. Break down by gas type (CO2, CH4, N2O)
  // 5. Return result with full methodology explanation
}
```

### Emission Factors Database (`prisma/seed.ts`)

Seed the database with real emission factors. Include at minimum:

**Electricity Grid Factors (Scope 2):**
- US average: 0.417 kgCO2e/kWh (EPA eGRID 2024)
- EU average: 0.256 kgCO2e/kWh (EEA 2024)
- UK: 0.207 kgCO2e/kWh (DEFRA 2025)
- Germany: 0.366 kgCO2e/kWh
- France: 0.052 kgCO2e/kWh
- Canada: 0.120 kgCO2e/kWh
- US-California: 0.225 kgCO2e/kWh

**Natural Gas (Scope 1):**
- Per therm: 5.31 kgCO2e (EPA)
- Per m3: 2.02 kgCO2e
- Per kWh: 0.184 kgCO2e

**Transport Fuels (Scope 1):**
- Diesel per liter: 2.68 kgCO2e (DEFRA)
- Gasoline per liter: 2.31 kgCO2e
- Per km (avg car): 0.171 kgCO2e
- Per mile (avg car): 0.275 kgCO2e

**Refrigerants (Scope 1):**
- R-410A: 2,088 kgCO2e/kg (GWP)
- R-134a: 1,430 kgCO2e/kg
- R-32: 675 kgCO2e/kg

**Include 50+ emission factors** covering common categories for US, EU, UK, and Canada.

### Manual Emissions Entry (`src/components/emissions/emissions-form.tsx`)

For data not extracted from documents:

**Form fields:**
1. Scope (radio: Scope 1 / Scope 2)
2. Category (select — filtered by scope)
3. Source description (text, e.g., "Office natural gas heating")
4. Activity value (number)
5. Activity unit (select — filtered by category)
6. Date range (start/end date pickers)
7. Location/facility (text, optional)
8. Notes (textarea, optional)

**On submit:**
1. Call calculation engine
2. Show calculation result with methodology before saving
3. On confirm, create EmissionEntry + AuditLog
4. Redirect to emissions overview

### Emissions Overview Page (`src/app/dashboard/emissions/page.tsx`)

**Summary cards at top:**
- Total Scope 1 emissions (tCO2e) for current period
- Total Scope 2 emissions (tCO2e) for current period
- Combined total with YoY change (if data exists)
- Number of data entries

**Charts:**
- Stacked bar chart: Monthly emissions by scope (Recharts)
- Donut chart: Emissions by category
- Trend line: Cumulative emissions over time

**Data table below:**
- All EmissionEntry records for current period
- Columns: Date, Scope, Category, Source, Activity, Emissions (tCO2e), Source Doc, Actions
- Filter by: scope, category, date range
- Sort by any column
- Each row links to source document (audit trail)

**Actions:**
- "Add Entry" button → emissions form
- "Upload Document" button → document upload
- "Export CSV" button → download all data

---

## 9. CSRD REPORT GENERATOR

### Overview

Generate CSRD-compliant sustainability reports using AI. The system collects all emissions data, supplier information, and organizational context, then uses Claude to generate narrative sections that meet CSRD disclosure requirements.

### CSRD Template Structure (`src/lib/reports/csrd-template.ts`)

The CSRD report follows the European Sustainability Reporting Standards (ESRS). For MVP, implement these core sections:

```typescript
export const CSRD_TEMPLATE = {
  id: "CSRD_2024",
  name: "CSRD / ESRS Report",
  sections: [
    {
      code: "ESRS2",
      title: "General Disclosures",
      subsections: [
        { code: "ESRS2-BP1", title: "Basis for Preparation", required: true },
        { code: "ESRS2-GOV1", title: "Governance — Role of Administrative Bodies", required: true },
        { code: "ESRS2-SBM1", title: "Strategy — Market Position & Business Model", required: true },
        { code: "ESRS2-IRO1", title: "Impact, Risk & Opportunity Identification", required: true },
      ]
    },
    {
      code: "E1",
      title: "Climate Change",
      subsections: [
        { code: "E1-1", title: "Transition Plan for Climate Change Mitigation", required: true },
        { code: "E1-4", title: "Targets Related to Climate Change", required: true },
        { code: "E1-5", title: "Energy Consumption & Mix", required: true },
        { code: "E1-6", title: "Gross Scope 1, 2, 3 GHG Emissions", required: true },
        { code: "E1-7", title: "GHG Removals & Carbon Credits", required: false },
        { code: "E1-9", title: "Anticipated Financial Effects of Climate Change", required: false },
      ]
    },
    {
      code: "S1",
      title: "Own Workforce",
      subsections: [
        { code: "S1-1", title: "Policies Related to Own Workforce", required: true },
        { code: "S1-6", title: "Characteristics of Employees", required: true },
        { code: "S1-9", title: "Diversity Metrics", required: false },
      ]
    },
    {
      code: "G1",
      title: "Business Conduct",
      subsections: [
        { code: "G1-1", title: "Corporate Culture & Business Conduct Policies", required: true },
        { code: "G1-3", title: "Prevention & Detection of Corruption/Bribery", required: true },
      ]
    }
  ]
};
```

### Report Generation Wizard (`src/components/reports/report-wizard.tsx`)

A multi-step wizard to configure and generate a report:

#### Step 1: Report Configuration

- Report title (auto-suggest: "{Company} CSRD Report FY{Year}")
- Framework (select from org's active frameworks)
- Reporting period (select from ReportingPeriod)
- Sections to include (checkboxes, all required sections pre-checked)

#### Step 2: Data Completeness Check

Show a checklist of required data for each section:

```
✅ E1-5 Energy Consumption — 12/12 months data available
✅ E1-6 GHG Emissions — Scope 1: 45.2 tCO2e, Scope 2: 128.7 tCO2e
⚠️ S1-6 Employee Data — Not yet entered (manual input needed)
❌ G1-1 Business Conduct — No data available
```

For incomplete sections: show "Enter Data" button that opens a quick form, or "Skip Section" option.

#### Step 3: AI Generation

- Show "Generate Report" button with estimated time
- While generating, show progress indicator per section
- Use Claude to generate each section (see AI prompts in Section 19)
- Stream results if possible (show sections appearing as generated)

#### Step 4: Review & Edit

- Show full report preview
- Each section is editable (rich text editor)
- AI-generated content has a subtle "AI Generated" badge
- User edits tracked separately (`manualEdits` field)
- "Regenerate Section" button for any section
- Sidebar shows compliance checklist (data points covered)

#### Step 5: Export

- Save as draft
- Export as PDF
- Export as DOCX (stretch goal, optional for MVP)
- Export raw data as CSV

### Report Generation AI Logic (`src/lib/ai/generate-report.ts`)

For each section, call Claude with the organization's data. Example for E1-6 (GHG Emissions):

```typescript
async function generateSection(
  sectionCode: string,
  orgData: OrganizationContext,
  emissionsData: EmissionsSummary,
  supplierData: SupplierSummary
): Promise<GeneratedSection> {
  // Build context-rich prompt with all relevant data
  // Call Claude API
  // Parse and validate response
  // Return structured section content
}
```

See Section 19 for complete prompt templates.

### Report Viewer (`src/app/dashboard/reports/[id]/page.tsx`)

- Full report rendered with proper heading hierarchy
- Table of contents sidebar (sticky)
- Each section shows: AI content, user edits (highlighted), data sources
- Print-friendly styling via `@media print` CSS
- Export buttons: PDF, CSV
- Status indicator: Draft / Review / Approved / Published
- Version history (list of saves with timestamps)

---

## 10. QUICKBOOKS INTEGRATION

### Overview

Connect to QuickBooks Online to auto-import financial data that feeds emissions calculations. Specifically: utility expenses, fuel purchases, travel costs, and supplier spend.

### OAuth Flow (`src/lib/quickbooks/oauth.ts`)

1. **Initiate** (`/api/quickbooks/connect`):
   - Generate state parameter (store in session)
   - Redirect to Intuit OAuth URL with scopes: `com.intuit.quickbooks.accounting`
   - Include redirect_uri

2. **Callback** (`/api/quickbooks/callback`):
   - Validate state parameter
   - Exchange auth code for access + refresh tokens
   - Store tokens encrypted in Organization record
   - Redirect to `/onboarding/integrations` or `/dashboard/settings/integrations`

3. **Token Refresh** (`src/lib/quickbooks/client.ts`):
   - Before each API call, check if access token is expired
   - If expired, use refresh token to get new access token
   - Update stored tokens

### Data Sync (`src/lib/quickbooks/sync.ts`)

**Sync endpoint** (`/api/quickbooks/sync`) — triggered manually or on schedule.

**What to sync:**

1. **Expense accounts** — Look for accounts categorized as:
   - Utilities Expense
   - Fuel/Gas Expense
   - Travel Expense
   - Vehicle Expense

2. **Bills/Invoices** — From the expense accounts above, pull:
   - Vendor name
   - Amount
   - Date
   - Description/memo
   - Category

3. **Vendors** — Import as Supplier records:
   - Name, email, address, industry

**Sync logic:**
```typescript
async function syncQuickBooksData(organizationId: string) {
  // 1. Fetch expense transactions from QB for current reporting period
  // 2. Classify each transaction (utility, fuel, travel, other)
  // 3. For utility/fuel transactions, create Document records (virtual)
  //    with extractedData populated from QB data
  // 4. Optionally auto-create EmissionEntry if high confidence
  // 5. Log sync in AuditLog
  // 6. Return summary of synced data
}
```

### Integrations Settings Page (`src/app/dashboard/settings/integrations/page.tsx`)

Show connected integrations:
- QuickBooks: Connected as "{Company Name}" — Last synced: {date}
  - "Sync Now" button
  - "Disconnect" button
  - Sync history log (last 10 syncs with counts)
- Xero: "Coming Soon"
- Manual Upload: Always available

---

## 11. COMPLIANCE DASHBOARD

### Dashboard Home (`src/app/dashboard/page.tsx`)

This is the main view users see after login. It must communicate: "Here's where you stand on compliance, and here's what to do next."

#### Layout: 2-column grid on desktop, single column on mobile

**Top Row — Key Metrics (4 stat cards):**

1. **Compliance Score** — Circular progress gauge (0-100%)
   - Calculated: (completed data points / total required data points) × 100
   - Color: Red (<40%), Yellow (40-70%), Green (>70%)

2. **Total Emissions** — Current period total tCO2e
   - Scope 1 + Scope 2 combined
   - Arrow showing trend vs. previous period (if exists)

3. **Documents Processed** — Count of documents with status EXTRACTED or REVIEWED
   - Sub-text: "{n} pending review"

4. **Days Until Deadline** — Countdown to next compliance deadline
   - Based on OrgFramework.dueDate
   - Red if < 30 days

**Middle Row — Charts:**

5. **Emissions Over Time** (Recharts AreaChart)
   - X-axis: Months
   - Y-axis: tCO2e
   - Two series: Scope 1, Scope 2
   - Stacked area

6. **Framework Progress** (Horizontal progress bars)
   - One bar per active OrgFramework
   - Shows completion % with section breakdown
   - Click to jump to relevant data entry

**Bottom Row — Action Items:**

7. **Quick Actions** (3-4 action cards):
   - "Upload a Document" → /dashboard/documents
   - "Add Emissions Data" → /dashboard/emissions
   - "Generate Report" → /dashboard/reports/new
   - "Invite Team Member" → /dashboard/settings/team

8. **Recent Activity** (Feed):
   - Last 10 AuditLog entries for the org
   - Shows: icon, description, user, timestamp
   - e.g., "Sarah uploaded Q3-utility-bill.pdf — 2 hours ago"

---

## 12. SUPPLY CHAIN ESG MONITORING (LITE)

### Overview

MVP version: Manual supplier tracking with basic risk assessment. No automated supplier data collection (that's Phase 2).

### Supplier List (`src/app/dashboard/suppliers/page.tsx`)

**Table columns:**
- Name
- Industry
- Country
- ESG Risk Level (badge: Low/Medium/High/Critical/Unknown)
- ESG Score (0-100 or "—")
- Last Assessment Date
- Actions (Edit, View, Delete)

**Add Supplier button** → Opens `supplier-form.tsx`

### Supplier Form (`src/components/suppliers/supplier-form.tsx`)

**Fields:**
- Supplier name (required)
- Contact name
- Contact email
- Industry (select)
- Country (select)
- Website
- ESG Risk Level (select: Low/Medium/High/Critical/Unknown)
- Notes (textarea)

### Supplier Detail Page (`src/app/dashboard/suppliers/[id]/page.tsx`)

- Supplier info card
- ESG risk level with explanation
- Notes/assessment history
- Placeholder section: "Automated ESG data collection coming soon"

---

## 13. STRIPE BILLING INTEGRATION

### Plans & Pricing

| Feature | Base ($249/mo) | Professional ($399/mo) | Enterprise ($699/mo) |
|---------|---------------|----------------------|---------------------|
| Employees | Up to 100 | Up to 300 | Up to 500 |
| Frameworks | 1 | 3 | Unlimited |
| Admin users | 1 | 3 | Unlimited |
| Suppliers | 5 | 25 | Unlimited |
| Document uploads/mo | 50 | 200 | Unlimited |
| Reports/year | 2 | 12 | Unlimited |
| AI extractions/mo | 50 | 200 | Unlimited |
| QuickBooks integration | ❌ | ✅ | ✅ |
| Audit assistance | ❌ | ❌ | ✅ |
| Support | Email | Priority email | Priority + Slack |

**Free Trial:** 14 days, Professional plan features, no credit card required.

### Stripe Setup (`src/lib/stripe.ts`)

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
});
```

### Checkout Flow (`src/app/api/stripe/checkout/route.ts`)

1. User clicks "Upgrade" on pricing page or billing settings
2. Create Stripe Checkout Session:
   - `mode: 'subscription'`
   - `line_items`: selected plan price ID
   - `success_url`: `/dashboard/settings/billing?success=true`
   - `cancel_url`: `/dashboard/settings/billing`
   - `customer_email`: user's email
   - `metadata`: { organizationId }
3. Redirect to Stripe Checkout

### Webhook Handler (`src/app/api/stripe/webhook/route.ts`)

Handle these events:
- `checkout.session.completed` — Update org with stripeCustomerId, subscriptionId, plan
- `invoice.payment_succeeded` — Update stripeCurrentPeriodEnd
- `invoice.payment_failed` — Send email alert, mark plan as past_due
- `customer.subscription.updated` — Update plan tier and period
- `customer.subscription.deleted` — Downgrade to FREE_TRIAL (read-only mode)

**Webhook verification:** Always verify signature using `stripe.webhooks.constructEvent()`.

### Customer Portal (`src/app/api/stripe/portal/route.ts`)

Create Stripe Customer Portal session for self-service:
- Update payment method
- View invoices
- Cancel subscription
- Change plan

### Billing Page (`src/app/dashboard/settings/billing/page.tsx`)

**Layout:**
- Current plan card (plan name, price, next billing date, status)
- "Change Plan" button → shows plan comparison (all 3 tiers)
- "Manage Billing" button → Stripe Customer Portal
- Usage meters (documents uploaded, AI extractions used, reports generated)
- Invoice history table (last 12 months)

### Plan Enforcement (Middleware/API level)

Create a `checkPlanLimits` utility:

```typescript
export async function checkPlanLimits(
  organizationId: string,
  resource: 'documents' | 'extractions' | 'reports' | 'users' | 'suppliers' | 'frameworks'
): Promise<{ allowed: boolean; current: number; limit: number }> {
  // Query current usage for the billing period
  // Compare against plan limits
  // Return result
}
```

Call this before creating documents, running extractions, generating reports, adding users, etc. If limit reached, return 403 with a clear message about upgrading.

---

## 14. EMAIL NOTIFICATIONS (RESEND)

### Resend Setup (`src/lib/resend.ts`)

```typescript
import { Resend } from 'resend';
export const resend = new Resend(process.env.RESEND_API_KEY);
```

### Email Templates (React Email)

All templates go in `src/emails/` and use React for rendering.

#### 1. Welcome Email (`src/emails/welcome.tsx`)

**Trigger:** User registration
**Subject:** "Welcome to GreenLedger — Let's simplify your ESG compliance"
**Body:**
- Greeting with user's name
- 3 quick-start steps (with links):
  1. Complete your company profile
  2. Upload your first document
  3. Generate your first report
- Link to help center / getting started guide
- Unsubscribe link

#### 2. Report Ready (`src/emails/report-ready.tsx`)

**Trigger:** Report generation complete
**Subject:** "Your {Framework} report is ready for review"
**Body:**
- Report title and framework
- Compliance score summary
- CTA: "Review Your Report" (link to report)
- Quick stats: sections completed, data points covered

#### 3. Compliance Alert (`src/emails/compliance-alert.tsx`)

**Trigger:** 30 days, 14 days, 7 days before compliance deadline
**Subject:** "{n} days until your {Framework} reporting deadline"
**Body:**
- Deadline date and framework
- Current completion percentage
- Missing data points count
- CTA: "Complete Your Data" (link to dashboard)

#### 4. Team Invitation (`src/emails/invite-team.tsx`)

**Trigger:** Owner invites team member
**Subject:** "You've been invited to join {Company} on GreenLedger"
**Body:**
- Inviter's name and company
- Role being assigned
- CTA: "Accept Invitation" (link to register/join)

### Email Sending Utility

```typescript
// src/lib/resend.ts
export async function sendEmail(params: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    ...params,
  });
}
```

---

## 15. LANDING PAGE / MARKETING SITE

### Marketing Layout (`src/app/(marketing)/layout.tsx`)

- Sticky transparent navbar that becomes solid on scroll
- Logo (left), nav links (center: Features, Pricing, About), CTA buttons (right: Login, Get Started)
- Footer: links, legal, social, newsletter signup

### Homepage (`src/app/page.tsx`)

Build a modern, conversion-optimized landing page with these sections:

#### Hero Section
- **Headline:** "ESG Compliance on Autopilot"
- **Subheadline:** "Stop drowning in spreadsheets. GreenLedger automates ESG data collection, emissions calculation, and compliance reporting for SMBs — in minutes, not months."
- **CTA:** "Start Free Trial" (primary), "See How It Works" (secondary/ghost)
- **Visual:** Dashboard screenshot/mockup or animated illustration
- **Trust bar:** "Trusted by 500+ companies" + logo placeholders

#### Problem Section
- **Headline:** "ESG Compliance Shouldn't Cost $100K"
- 3 pain point cards:
  1. "Enterprise tools cost $30K-$100K/year" — icon: dollar sign
  2. "Manual reporting takes 200+ hours" — icon: clock
  3. "Regulations are changing faster than you can track" — icon: document

#### Solution Section
- **Headline:** "From Upload to Compliant in 3 Steps"
- Step 1: "Upload Documents" — drag-and-drop utility bills, invoices
- Step 2: "AI Extracts & Calculates" — automatic emissions data extraction
- Step 3: "Generate Reports" — CSRD-compliant reports at a click
- Each step has an illustration/icon and brief description

#### Features Grid (2x3 grid)
1. AI Document Extraction — "Upload a bill, get emissions data in seconds"
2. Multi-Framework Support — "CSRD, GRI, SASB, ISSB — all in one place"
3. Audit-Ready Traceability — "Every number linked to its source document"
4. QuickBooks Integration — "Auto-import financial data"
5. Supply Chain Monitoring — "Track supplier ESG risk"
6. Mobile-First — "Capture data from anywhere"

#### Social Proof
- 3 testimonial cards (use placeholder text for MVP)
- Metrics: "50,000+ data points processed", "1,200+ hours saved", "99.2% audit accuracy"

#### CTA Section
- "Start Your 14-Day Free Trial"
- "No credit card required. Setup in 10 minutes."
- Email input + "Get Started" button

### Pricing Page (`src/app/(marketing)/pricing/page.tsx`)

- 3-tier pricing cards (Base, Professional, Enterprise)
- Feature comparison table
- FAQ section (6-8 questions about plans, billing, frameworks)
- CTA: "Start Free Trial" on each card

### About Page (`src/app/(marketing)/about/page.tsx`)

- Mission statement
- Team placeholder (for future)
- Regulatory expertise section
- Contact information

### Contact Page (`src/app/(marketing)/contact/page.tsx`)

- Contact form (name, email, company, message)
- Submits to `/api/contact` → sends email via Resend
- Office location placeholder
- "Book a Demo" link (placeholder)

---

## 16. DOCKER & DEPLOYMENT

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://greenledger:greenledger@db:5432/greenledger
      - NEXTAUTH_URL=http://localhost:3000
    env_file:
      - .env.local
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
      - uploads:/app/uploads
    depends_on:
      db:
        condition: service_healthy
    command: npm run dev

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: greenledger
      POSTGRES_PASSWORD: greenledger
      POSTGRES_DB: greenledger
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U greenledger"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  uploads:
```

### Dockerfile.dev

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### Dockerfile (Production)

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
```

### Setup Script

Create a `scripts/setup.sh`:

```bash
#!/bin/bash
echo "🌱 Setting up GreenLedger..."

# Copy env file
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "📝 Created .env.local — please fill in your API keys"
fi

# Start database
docker-compose up -d db
sleep 3

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

echo "✅ Setup complete! Run 'npm run dev' to start."
```

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:migrate": "npx prisma migrate dev",
    "db:seed": "npx prisma db seed",
    "db:studio": "npx prisma studio",
    "db:reset": "npx prisma migrate reset",
    "docker:dev": "docker-compose up --build",
    "docker:prod": "docker-compose -f docker-compose.prod.yml up --build -d",
    "setup": "bash scripts/setup.sh"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## 17. API ROUTE REFERENCE

### Authentication

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/[...nextauth]` | NextAuth handlers | No |
| POST | `/api/users` | Register new user | No |

### Organizations

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/organizations` | Create organization (onboarding) | Yes |
| GET | `/api/organizations/[id]` | Get org details | Yes (scoped) |
| PATCH | `/api/organizations/[id]` | Update org | Yes (admin+) |

### Documents

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/documents` | Upload document | Yes |
| GET | `/api/documents` | List documents | Yes (scoped) |
| GET | `/api/documents/[id]` | Get document detail | Yes (scoped) |
| DELETE | `/api/documents/[id]` | Delete document | Yes (admin+) |
| POST | `/api/documents/extract` | Trigger AI extraction | Yes |

### Emissions

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/emissions` | Create emission entry | Yes |
| GET | `/api/emissions` | List emissions (filterable) | Yes (scoped) |
| PATCH | `/api/emissions/[id]` | Update emission entry | Yes |
| DELETE | `/api/emissions/[id]` | Delete emission entry | Yes (admin+) |
| POST | `/api/emissions/calculate` | Calculate emissions from input | Yes |
| GET | `/api/emissions/summary` | Aggregated emissions summary | Yes (scoped) |

### Reports

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/reports` | Create report | Yes |
| GET | `/api/reports` | List reports | Yes (scoped) |
| GET | `/api/reports/[id]` | Get report detail | Yes (scoped) |
| PATCH | `/api/reports/[id]` | Update report (manual edits) | Yes |
| DELETE | `/api/reports/[id]` | Delete report | Yes (admin+) |
| POST | `/api/reports/generate` | AI-generate report content | Yes |
| GET | `/api/reports/[id]/export` | Export report (PDF/CSV) | Yes |

### Suppliers

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/suppliers` | Create supplier | Yes |
| GET | `/api/suppliers` | List suppliers | Yes (scoped) |
| GET | `/api/suppliers/[id]` | Get supplier detail | Yes (scoped) |
| PATCH | `/api/suppliers/[id]` | Update supplier | Yes |
| DELETE | `/api/suppliers/[id]` | Delete supplier | Yes (admin+) |

### QuickBooks

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/quickbooks/connect` | Initiate OAuth | Yes |
| GET | `/api/quickbooks/callback` | OAuth callback | Yes |
| POST | `/api/quickbooks/sync` | Trigger data sync | Yes (admin+) |

### Stripe

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/stripe/checkout` | Create checkout session | Yes |
| POST | `/api/stripe/portal` | Create portal session | Yes |
| POST | `/api/stripe/webhook` | Stripe webhook handler | No (verified) |

### Misc

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/onboarding` | Save onboarding progress | Yes |
| GET | `/api/audit-log` | Query audit logs | Yes (admin+) |

---

## 18. UI PAGES & COMPONENTS REFERENCE

### Page Specifications

Each page below lists: route, layout, key components used, data requirements, and key interactions.

#### Dashboard Home (`/dashboard`)
- **Layout:** Dashboard layout (sidebar + topbar)
- **Components:** stats-cards, compliance-score, emissions-chart, framework-progress, quick-actions, recent-activity
- **Data:** Emissions summary, framework completion, recent audit logs, document counts
- **Mobile:** Stack all cards vertically, charts full-width

#### Emissions Overview (`/dashboard/emissions`)
- **Components:** stats-cards (scope totals), scope-breakdown chart, emissions-table, page-header
- **Data:** All EmissionEntry records for current period
- **Actions:** Add Entry, Upload Document, Export CSV, filter/sort

#### Scope 1 Detail (`/dashboard/emissions/scope-1`)
- **Components:** emissions-form (pre-filtered to Scope 1), emissions-table, calculation-detail
- **Data:** Scope 1 entries only
- **Focus:** Category breakdown (stationary combustion, mobile, fugitive)

#### Scope 2 Detail (`/dashboard/emissions/scope-2`)
- **Components:** emissions-form (pre-filtered to Scope 2), emissions-table, calculation-detail
- **Data:** Scope 2 entries only
- **Focus:** Electricity, heat, cooling breakdown

#### Documents Library (`/dashboard/documents`)
- **Components:** upload-zone, document-list (grid/list toggle), document-card, search-input
- **Data:** All documents for org, paginated
- **Actions:** Upload, filter by type/status, search

#### Document Detail (`/dashboard/documents/[id]`)
- **Components:** extraction-review (side-by-side), audit-badge
- **Data:** Document + extractedData + linked EmissionEntries
- **Actions:** Confirm extraction, re-extract, delete

#### Reports List (`/dashboard/reports`)
- **Components:** report-card list, page-header
- **Data:** All reports for org
- **Actions:** Generate New Report, filter by status/framework

#### New Report (`/dashboard/reports/new`)
- **Components:** report-wizard (multi-step), framework-selector
- **Data:** Org frameworks, emissions summary, supplier data
- **Multi-step flow as described in Section 9**

#### Report Viewer (`/dashboard/reports/[id]`)
- **Components:** report-preview, section-editor, page-header
- **Data:** Full report content (generated + edits)
- **Actions:** Edit sections, regenerate, export, change status

#### Suppliers (`/dashboard/suppliers`)
- **Components:** supplier-card list/table, supplier-form (dialog), risk-badge
- **Data:** All suppliers for org

#### Supplier Detail (`/dashboard/suppliers/[id]`)
- **Components:** supplier info card, risk-badge, notes section

#### Settings — General (`/dashboard/settings`)
- **Components:** Company profile form (editable), danger zone (delete org)
- **Data:** Organization record

#### Settings — Billing (`/dashboard/settings/billing`)
- **Components:** plan-card (current), usage-meter, invoice-list, plan comparison
- **Data:** Stripe subscription, usage counts

#### Settings — Team (`/dashboard/settings/team`)
- **Components:** Team member table, invite form (dialog)
- **Data:** Users in org
- **Actions:** Invite, change role, remove

#### Settings — Integrations (`/dashboard/settings/integrations`)
- **Components:** Integration cards (QuickBooks, Xero placeholder)
- **Data:** QuickBooks connection status

#### Audit Log (`/dashboard/audit-log`)
- **Components:** data-table (paginated, filterable)
- **Data:** AuditLog entries for org
- **Columns:** Timestamp, User, Action, Entity, Details

### Shared Component Specs

#### Sidebar (`src/components/layout/sidebar.tsx`)
Navigation items:
- Dashboard (Home icon)
- Emissions (BarChart3 icon)
  - Overview
  - Scope 1
  - Scope 2
- Documents (FileText icon)
- Reports (FileBarChart icon)
- Suppliers (Truck icon)
- Audit Log (Shield icon)
- Settings (Settings icon)

Bottom section:
- Current plan badge
- User avatar + name + role
- Logout button

Collapsible on desktop (icon-only mode). Drawer on mobile.

#### Topbar (`src/components/layout/topbar.tsx`)
- Breadcrumb navigation
- Search input (global search — stretch goal)
- Notification bell (placeholder)
- User dropdown (Profile, Settings, Logout)

---

## 19. AI PROMPTS & INTEGRATION SPECS

### Anthropic Client Setup (`src/lib/anthropic.ts`)

```typescript
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const AI_MODEL = 'claude-sonnet-4-20250514';
export const MAX_TOKENS = 4096;
```

### Prompt Templates (`src/lib/ai/prompts.ts`)

#### Document Classification Prompt

```typescript
export const DOCUMENT_CLASSIFICATION_PROMPT = `You are a document classification system for ESG/sustainability reporting at a small-to-medium business.

Analyze the uploaded document and classify it into exactly ONE of these categories:
- UTILITY_BILL: Electricity, gas, water, or district heating bills
- FUEL_RECEIPT: Fuel purchase receipts (diesel, gasoline, propane)
- INVOICE: General business invoices from suppliers
- SUPPLIER_REPORT: ESG or sustainability reports from suppliers
- TRAVEL_RECORD: Travel expenses, flight tickets, hotel receipts
- WASTE_MANIFEST: Waste disposal or recycling records
- FLEET_LOG: Vehicle mileage logs or fleet management records
- REFRIGERANT_LOG: HVAC maintenance or refrigerant purchase records
- OTHER: Does not fit any category above

Respond with ONLY a valid JSON object (no markdown, no explanation):
{
  "documentType": "CATEGORY_NAME",
  "confidence": 0.0,
  "reasoning": "Brief explanation of classification"
}`;
```

#### Utility Bill Extraction Prompt

```typescript
export const UTILITY_BILL_EXTRACTION_PROMPT = `You are an ESG data extraction system. Extract structured data from this utility bill for carbon emissions calculation.

Be precise with numbers and units. If a field cannot be determined, set it to null.
Never guess values — lower the confidence score if uncertain about any field.

Respond with ONLY a valid JSON object (no markdown):
{
  "provider": "string or null",
  "accountNumber": "string or null",
  "billingPeriod": {
    "start": "YYYY-MM-DD or null",
    "end": "YYYY-MM-DD or null"
  },
  "utilityType": "electricity | natural_gas | water | district_heating | null",
  "consumption": {
    "value": 0.0,
    "unit": "kWh | therms | m3 | MWh | gallons | null"
  },
  "cost": {
    "value": 0.0,
    "currency": "USD | EUR | GBP | CAD | null"
  },
  "facilityAddress": "string or null",
  "meterNumber": "string or null",
  "rateType": "string or null",
  "renewablePercentage": 0,
  "confidence": 0.0,
  "extractionNotes": "string describing any uncertainties"
}`;
```

#### Fuel Receipt Extraction Prompt

```typescript
export const FUEL_RECEIPT_EXTRACTION_PROMPT = `You are an ESG data extraction system. Extract structured data from this fuel receipt for Scope 1 emissions calculation.

Respond with ONLY a valid JSON object:
{
  "vendor": "string or null",
  "fuelType": "diesel | gasoline | propane | natural_gas | other | null",
  "quantity": {
    "value": 0.0,
    "unit": "liters | gallons | kg | m3 | null"
  },
  "cost": {
    "value": 0.0,
    "currency": "USD | EUR | GBP | CAD | null"
  },
  "date": "YYYY-MM-DD or null",
  "vehicleId": "string or null",
  "odometerReading": 0,
  "location": "string or null",
  "confidence": 0.0,
  "extractionNotes": "string"
}`;
```

#### Invoice Extraction Prompt

```typescript
export const INVOICE_EXTRACTION_PROMPT = `You are an ESG data extraction system. Extract structured data from this business invoice that may contain ESG-relevant information (energy costs, fuel, materials, waste services, etc.).

Respond with ONLY a valid JSON object:
{
  "vendor": "string or null",
  "invoiceNumber": "string or null",
  "invoiceDate": "YYYY-MM-DD or null",
  "dueDate": "YYYY-MM-DD or null",
  "totalAmount": {
    "value": 0.0,
    "currency": "USD | EUR | GBP | CAD | null"
  },
  "lineItems": [
    {
      "description": "string",
      "quantity": 0.0,
      "unit": "string or null",
      "amount": 0.0,
      "esgRelevant": true,
      "esgCategory": "energy | fuel | waste | water | materials | transport | null"
    }
  ],
  "vendorAddress": "string or null",
  "confidence": 0.0,
  "extractionNotes": "string"
}`;
```

#### CSRD Report Section Generation Prompt

```typescript
export function buildReportSectionPrompt(
  sectionCode: string,
  sectionTitle: string,
  orgContext: {
    name: string;
    industry: string;
    employeeCount: number;
    country: string;
    reportingYear: number;
  },
  sectionData: Record<string, any>
): string {
  return `You are an expert sustainability report writer helping a small-to-medium business comply with the EU Corporate Sustainability Reporting Directive (CSRD) under the European Sustainability Reporting Standards (ESRS).

COMPANY CONTEXT:
- Company: ${orgContext.name}
- Industry: ${orgContext.industry}
- Employees: ${orgContext.employeeCount}
- Location: ${orgContext.country}
- Reporting Year: ${orgContext.reportingYear}

SECTION TO GENERATE:
- Code: ${sectionCode}
- Title: ${sectionTitle}

AVAILABLE DATA:
${JSON.stringify(sectionData, null, 2)}

INSTRUCTIONS:
1. Write a professional, audit-ready narrative section for this ESRS disclosure requirement.
2. Use the provided data to support all claims with specific numbers.
3. Where data is missing, note it as a disclosure gap and suggest what data is needed.
4. Write in third person referring to the company by name.
5. Use clear, professional language appropriate for a regulatory filing.
6. Include relevant metrics, percentages, and year-over-year comparisons where data allows.
7. Structure the section with appropriate subheadings if the content warrants it.
8. Keep the tone factual and balanced — do not overstate achievements.
9. Reference specific ESRS data point codes where applicable (e.g., "As required by E1-6...").

RESPONSE FORMAT:
Respond with ONLY a valid JSON object:
{
  "sectionCode": "${sectionCode}",
  "sectionTitle": "${sectionTitle}",
  "content": "The full narrative text in Markdown format",
  "dataPointsCovered": ["E1-6-a", "E1-6-b"],
  "dataGaps": ["List of missing data points with descriptions"],
  "recommendations": ["Suggestions for improving this section"],
  "confidence": 0.0
}`;
}
```

#### Emissions Estimation Prompt (for spend-based or incomplete data)

```typescript
export const EMISSIONS_ESTIMATION_PROMPT = `You are an emissions estimation system. Given limited data (e.g., cost-based rather than activity-based), estimate greenhouse gas emissions using industry-standard methodologies.

IMPORTANT:
- Always state your estimation method clearly
- Provide confidence ranges (low, mid, high estimates)
- Cite the methodology (e.g., "EPA EEIO model", "DEFRA 2025 conversion factors")
- Flag this as an estimate, not a measured value
- Prefer activity-based calculations when sufficient data exists

Respond with ONLY a valid JSON object:
{
  "estimatedCO2e": {
    "low": 0.0,
    "mid": 0.0,
    "high": 0.0,
    "unit": "kgCO2e"
  },
  "methodology": "string describing calculation approach",
  "assumptions": ["list of assumptions made"],
  "dataQuality": "high | medium | low",
  "recommendedAction": "string suggesting how to improve data quality",
  "confidence": 0.0
}`;
```

### AI Extraction Function (`src/lib/ai/extract-document.ts`)

```typescript
import { anthropic, AI_MODEL, MAX_TOKENS } from '@/lib/anthropic';
import {
  DOCUMENT_CLASSIFICATION_PROMPT,
  UTILITY_BILL_EXTRACTION_PROMPT,
  FUEL_RECEIPT_EXTRACTION_PROMPT,
  INVOICE_EXTRACTION_PROMPT,
} from './prompts';
import { DocumentType } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const EXTRACTION_PROMPTS: Record<string, string> = {
  UTILITY_BILL: UTILITY_BILL_EXTRACTION_PROMPT,
  FUEL_RECEIPT: FUEL_RECEIPT_EXTRACTION_PROMPT,
  INVOICE: INVOICE_EXTRACTION_PROMPT,
  // Add more as needed
};

export async function classifyDocument(filePath: string, mimeType: string) {
  const fileBuffer = fs.readFileSync(filePath);
  const base64 = fileBuffer.toString('base64');

  const mediaType = mimeType.startsWith('image/')
    ? mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'
    : 'image/png'; // For PDFs, convert first page to image

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          { type: 'text', text: DOCUMENT_CLASSIFICATION_PROMPT },
        ],
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

export async function extractDocumentData(
  filePath: string,
  mimeType: string,
  documentType: DocumentType
) {
  const prompt = EXTRACTION_PROMPTS[documentType];
  if (!prompt) {
    return { error: 'No extraction prompt for this document type', confidence: 0 };
  }

  const fileBuffer = fs.readFileSync(filePath);
  const base64 = fileBuffer.toString('base64');

  const mediaType = mimeType.startsWith('image/')
    ? mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'
    : 'image/png';

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          { type: 'text', text: prompt },
        ],
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}
```

### Report Generation Function (`src/lib/ai/generate-report.ts`)

```typescript
import { anthropic, AI_MODEL } from '@/lib/anthropic';
import { buildReportSectionPrompt } from './prompts';
import { prisma } from '@/lib/prisma';

interface ReportGenerationInput {
  organizationId: string;
  reportingPeriodId: string;
  frameworkType: string;
  sections: string[]; // Section codes to generate
}

export async function generateReport(input: ReportGenerationInput) {
  // 1. Fetch organization context
  const org = await prisma.organization.findUnique({
    where: { id: input.organizationId },
  });

  // 2. Fetch emissions data for the reporting period
  const emissions = await prisma.emissionEntry.findMany({
    where: {
      organizationId: input.organizationId,
      reportingPeriodId: input.reportingPeriodId,
    },
  });

  // 3. Aggregate emissions by scope and category
  const emissionsSummary = aggregateEmissions(emissions);

  // 4. Fetch supplier data
  const suppliers = await prisma.supplier.findMany({
    where: { organizationId: input.organizationId },
  });

  // 5. Generate each section
  const generatedSections: Record<string, any> = {};

  for (const sectionCode of input.sections) {
    const sectionInfo = getSectionInfo(sectionCode, input.frameworkType);

    const sectionData = buildSectionData(
      sectionCode,
      emissionsSummary,
      suppliers,
      org
    );

    const prompt = buildReportSectionPrompt(
      sectionCode,
      sectionInfo.title,
      {
        name: org!.name,
        industry: org!.industry || 'Unknown',
        employeeCount: org!.employeeCount || 0,
        country: org!.country || 'Unknown',
        reportingYear: new Date().getFullYear() - 1,
      },
      sectionData
    );

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    generatedSections[sectionCode] = JSON.parse(
      text.replace(/```json|```/g, '').trim()
    );
  }

  return generatedSections;
}

function aggregateEmissions(entries: any[]) {
  // Group by scope, category, month
  // Calculate totals
  // Return structured summary
  return {};
}

function getSectionInfo(code: string, framework: string) {
  // Look up section metadata from template
  return { title: '', description: '' };
}

function buildSectionData(
  sectionCode: string,
  emissions: any,
  suppliers: any[],
  org: any
) {
  // Build section-specific data payload
  // E1-6 gets emissions data
  // S1-6 gets employee data
  // etc.
  return {};
}
```

---

## 20. BUILD ORDER (FILE-BY-FILE)

Follow this exact sequence. Each phase builds on the previous one.

### Phase 0: Project Initialization

```
1.  Initialize Next.js project with TypeScript + Tailwind + App Router
2.  Install all dependencies from Section 2
3.  Configure tailwind.config.ts with GreenLedger brand colors
4.  Configure next.config.js (Section 16)
5.  Set up postcss.config.js
6.  Create .env.example (Section 4)
7.  Create docker-compose.yml (Section 16)
8.  Create Dockerfile.dev and Dockerfile (Section 16)
9.  Initialize shadcn/ui: npx shadcn-ui@latest init
10. Install all shadcn/ui components listed in the directory structure
```

### Phase 1: Database & Core Utilities

```
11. Create prisma/schema.prisma (Section 5 — full schema)
12. Run: npx prisma migrate dev --name init
13. Create prisma/seed.ts — seed emission factors (50+ factors from Section 8)
14. Create prisma/seed.ts — seed compliance frameworks (CSRD template from Section 9)
15. Run: npx prisma db seed
16. Create src/lib/prisma.ts (Prisma singleton)
17. Create src/lib/utils.ts (cn utility, formatters, etc.)
18. Create src/lib/constants.ts (plan limits, industries, countries, etc.)
19. Create src/types/index.ts + all type files
20. Create src/lib/validations/ — all Zod schemas
```

### Phase 2: Authentication

```
21. Create src/lib/auth-options.ts (NextAuth config — credentials + Google)
22. Create src/lib/auth.ts (getServerSession helper)
23. Create src/app/api/auth/[...nextauth]/route.ts
24. Create src/app/api/users/route.ts (POST — registration)
25. Create src/middleware.ts (auth + onboarding redirect logic)
26. Create src/app/(auth)/layout.tsx
27. Create src/app/(auth)/login/page.tsx
28. Create src/app/(auth)/register/page.tsx
29. Create src/app/(auth)/verify-email/page.tsx
30. Create src/app/(auth)/forgot-password/page.tsx
31. Create src/hooks/use-current-user.ts
```

### Phase 3: Onboarding

```
32. Create src/store/onboarding-store.ts
33. Create src/app/api/onboarding/route.ts
34. Create src/app/api/organizations/route.ts
35. Create src/components/onboarding/stepper.tsx
36. Create src/components/onboarding/company-form.tsx
37. Create src/components/onboarding/industry-picker.tsx
38. Create src/components/onboarding/framework-selector.tsx
39. Create src/app/onboarding/layout.tsx
40. Create src/app/onboarding/page.tsx (Step 1)
41. Create src/app/onboarding/industry/page.tsx (Step 2)
42. Create src/app/onboarding/integrations/page.tsx (Step 3)
43. Create src/app/onboarding/complete/page.tsx (Step 4)
```

### Phase 4: Dashboard Layout & Home

```
44. Create src/components/layout/sidebar.tsx
45. Create src/components/layout/topbar.tsx
46. Create src/components/layout/mobile-nav.tsx
47. Create src/app/dashboard/layout.tsx
48. Create src/components/shared/ (all shared components)
49. Create src/components/dashboard/stats-cards.tsx
50. Create src/components/dashboard/compliance-score.tsx
51. Create src/components/dashboard/emissions-chart.tsx
52. Create src/components/dashboard/framework-progress.tsx
53. Create src/components/dashboard/quick-actions.tsx
54. Create src/components/dashboard/recent-activity.tsx
55. Create src/app/dashboard/page.tsx
56. Create src/hooks/use-organization.ts
```

### Phase 5: Document Upload & AI Extraction

```
57. Create src/lib/anthropic.ts
58. Create src/lib/ai/prompts.ts (all prompts)
59. Create src/lib/ai/classify-document.ts
60. Create src/lib/ai/extract-document.ts
61. Create src/lib/audit/logger.ts
62. Create src/app/api/documents/route.ts (POST + GET)
63. Create src/app/api/documents/[id]/route.ts
64. Create src/app/api/documents/extract/route.ts
65. Create src/components/documents/upload-zone.tsx
66. Create src/components/documents/document-card.tsx
67. Create src/components/documents/document-list.tsx
68. Create src/components/documents/extraction-review.tsx
69. Create src/app/dashboard/documents/page.tsx
70. Create src/app/dashboard/documents/[id]/page.tsx
71. Create src/hooks/use-documents.ts
```

### Phase 6: Emissions Calculator

```
72. Create src/lib/emissions/unit-conversions.ts
73. Create src/lib/emissions/emission-factors.ts (lookup functions)
74. Create src/lib/emissions/calculator.ts
75. Create src/app/api/emissions/route.ts
76. Create src/app/api/emissions/calculate/route.ts
77. Create src/app/api/emissions/summary/route.ts
78. Create src/components/emissions/emissions-form.tsx
79. Create src/components/emissions/emissions-table.tsx
80. Create src/components/emissions/scope-breakdown.tsx
81. Create src/components/emissions/calculation-detail.tsx
82. Create src/app/dashboard/emissions/page.tsx
83. Create src/app/dashboard/emissions/scope-1/page.tsx
84. Create src/app/dashboard/emissions/scope-2/page.tsx
85. Create src/hooks/use-emissions.ts
```

### Phase 7: Report Generator

```
86.  Create src/lib/reports/csrd-template.ts
87.  Create src/lib/reports/gri-template.ts (stub)
88.  Create src/lib/ai/generate-report.ts
89.  Create src/lib/reports/pdf-generator.ts
90.  Create src/store/report-wizard-store.ts
91.  Create src/app/api/reports/route.ts
92.  Create src/app/api/reports/generate/route.ts
93.  Create src/app/api/reports/[id]/route.ts
94.  Create src/app/api/reports/[id]/export/route.ts
95.  Create src/components/reports/report-wizard.tsx
96.  Create src/components/reports/report-preview.tsx
97.  Create src/components/reports/report-card.tsx
98.  Create src/components/reports/section-editor.tsx
99.  Create src/app/dashboard/reports/page.tsx
100. Create src/app/dashboard/reports/new/page.tsx
101. Create src/app/dashboard/reports/[id]/page.tsx
```

### Phase 8: Suppliers

```
102. Create src/app/api/suppliers/route.ts
103. Create src/app/api/suppliers/[id]/route.ts
104. Create src/components/suppliers/supplier-form.tsx
105. Create src/components/suppliers/supplier-card.tsx
106. Create src/components/suppliers/risk-badge.tsx
107. Create src/app/dashboard/suppliers/page.tsx
108. Create src/app/dashboard/suppliers/[id]/page.tsx
```

### Phase 9: QuickBooks Integration

```
109. Create src/lib/quickbooks/oauth.ts
110. Create src/lib/quickbooks/client.ts
111. Create src/lib/quickbooks/sync.ts
112. Create src/app/api/quickbooks/connect/route.ts
113. Create src/app/api/quickbooks/callback/route.ts
114. Create src/app/api/quickbooks/sync/route.ts
```

### Phase 10: Stripe Billing

```
115. Create src/lib/stripe.ts
116. Create src/app/api/stripe/checkout/route.ts
117. Create src/app/api/stripe/portal/route.ts
118. Create src/app/api/stripe/webhook/route.ts
119. Create src/components/billing/plan-card.tsx
120. Create src/components/billing/usage-meter.tsx
121. Create src/components/billing/invoice-list.tsx
122. Create src/app/dashboard/settings/billing/page.tsx
```

### Phase 11: Email Notifications

```
123. Create src/lib/resend.ts
124. Create src/emails/welcome.tsx
125. Create src/emails/report-ready.tsx
126. Create src/emails/compliance-alert.tsx
127. Create src/emails/invite-team.tsx
```

### Phase 12: Settings Pages

```
128. Create src/app/dashboard/settings/page.tsx (General)
129. Create src/app/dashboard/settings/team/page.tsx
130. Create src/app/dashboard/settings/integrations/page.tsx
131. Create src/app/dashboard/audit-log/page.tsx
132. Create src/app/api/audit-log/route.ts
```

### Phase 13: Landing Page & Marketing

```
133. Create src/components/layout/marketing-navbar.tsx
134. Create src/components/layout/marketing-footer.tsx
135. Create src/app/(marketing)/layout.tsx
136. Create src/app/page.tsx (Homepage — full marketing page)
137. Create src/app/(marketing)/pricing/page.tsx
138. Create src/app/(marketing)/about/page.tsx
139. Create src/app/(marketing)/contact/page.tsx
```

### Phase 14: Global Styles & Polish

```
140. Create src/app/globals.css (Tailwind + custom styles + print styles)
141. Create src/app/layout.tsx (Root layout — providers, fonts, metadata)
142. Create public/logo.svg (simple SVG logo)
143. Create scripts/setup.sh
144. Update package.json scripts
145. Final: Run build, fix any TypeScript errors, test all routes
```

---

## FINAL NOTES FOR CLAUDE CODE

### Quality Checklist

Before considering the build complete, verify:

- [ ] `npm run build` completes with zero errors
- [ ] All API routes return proper JSON responses with error handling
- [ ] Every database query is scoped to `organizationId` (multi-tenant isolation)
- [ ] All forms have Zod validation (client + server)
- [ ] Auth middleware protects all `/dashboard/*` routes
- [ ] Audit log entries created for all data mutations
- [ ] Mobile responsive on all pages (test at 375px width)
- [ ] Loading states on all async operations (skeletons or spinners)
- [ ] Error boundaries on all pages
- [ ] Empty states for all list views
- [ ] `docker-compose up` starts the full stack successfully

### Error Handling Pattern

Every API route should follow this pattern:

```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse & validate body
    const body = await req.json();
    const validated = schema.parse(body);

    // 3. Business logic (scoped to org)
    const result = await prisma.model.create({
      data: {
        ...validated,
        organizationId: session.user.organizationId,
      },
    });

    // 4. Audit log
    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: 'entity_created',
      entityType: 'Model',
      entityId: result.id,
      newValue: result,
    });

    // 5. Return response
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[API_ROUTE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Key Conventions

- **File naming:** kebab-case for files, PascalCase for components
- **Imports:** Use `@/` path aliases (configured in tsconfig.json)
- **API responses:** Always return `{ data: ... }` on success, `{ error: string, details?: ... }` on failure
- **Date handling:** Store all dates as UTC in database, display in user's timezone on client
- **Currency:** Store amounts in smallest unit (cents) as integers, display formatted
- **Emissions:** Store in kgCO2e internally, display in tCO2e (÷ 1000) in UI
- **Pagination:** Use cursor-based pagination for lists, default 20 items per page

---

*End of build specification. This document contains everything needed to build the complete GreenLedger MVP. Start from Phase 0 and work sequentially through Phase 14.*
