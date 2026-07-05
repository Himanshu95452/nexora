# Nexora — Full-Stack MVP

India's trusted platform for verified home service professionals.
Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion on the
frontend; Prisma + PostgreSQL + Auth.js (NextAuth) on the backend.

## Getting started

```bash
npm install                 # also runs `prisma generate` via postinstall
cp .env.example .env        # fill in DATABASE_URL and NEXTAUTH_SECRET at minimum
npx prisma migrate dev      # creates tables from prisma/schema.prisma
npm run db:seed             # seeds cities, categories, services, and one admin account
npm run dev
```

Visit http://localhost:3000. The seed script prints a working admin login
(`admin@nexora.example` / `ChangeMe123!` — change this immediately in any
real deployment).

> **Note on this sandbox:** I built and ran this in an environment whose
> network is locked to a small allowlist that doesn't include
> `binaries.prisma.sh`, so I couldn't run `prisma generate` or a full
> `next build` here to verify the backend end-to-end the way I did for the
> frontend-only version. I reviewed every route by hand for schema/type
> consistency instead. On your machine or in CI with normal internet access,
> `npm install` and `npm run build` should both succeed — if something
> doesn't compile, it's most likely a small mismatch I'd want to know about.

## Architecture

```
prisma/schema.prisma     Database schema (see "Data model" below)
prisma/seed.ts           Seeds catalog data + one bootstrap admin

lib/prisma.ts            Prisma client singleton
lib/auth.ts               Auth.js (NextAuth) config — Credentials provider + Prisma adapter
lib/rbac.ts               requireAuth() / requireRole() guards for API routes
lib/tokens.ts             Password-reset & email-verification token helpers (placeholder "sending")

middleware.ts             Edge-level route protection for /dashboard/*

app/api/
  auth/
    [...nextauth]/         NextAuth handler (session, JWT, sign-in)
    register/               POST — customer/professional self sign-up
    forgot-password/        POST — request a reset link (placeholder email)
    reset-password/         POST — consume reset token, set new password
    verify-email/           GET  — consume email verification token
    resend-verification/    POST — re-send a verification link
  bookings/                 GET (role-aware list) · POST (create)
  bookings/[id]/            GET · PATCH (status transitions, ownership-checked)
  professionals/            GET (public directory, filterable by city/category)
  professionals/[id]/       GET (public profile)
  professionals/onboarding/ PATCH — professional sets category/city/bio post-signup
  payments/                 POST — placeholder gateway charge
  reviews/                   POST — rating & review, recomputes professional's avg rating
  complaints/                GET/POST — raise + list complaints
  complaints/[id]/          PATCH — admin investigate/resolve/approve refund
  notifications/             GET — current user's notifications
  notifications/[id]/       PATCH — mark read
  admin/professionals/[id]/verify/  PATCH — admin KYC approve/reject
  categories/, services/, cities/    GET — public catalog
```

The existing UI pages and components are untouched in structure and style.
What changed there is wiring: forms that used to be static now call these
API routes and Auth.js, using the same markup and Tailwind classes as before.

## Data model

- **User** — the Auth.js identity (email/phone, password hash, `role` enum:
  `CUSTOMER` / `PROFESSIONAL` / `ADMIN`). One user has exactly one of the
  three profile records below, matching their role.
- **Customer** — wallet balance, referral code, rewards points, addresses,
  bookings, reviews written.
- **Professional** — category, city, KYC status, trust score, badge tier,
  online/offline flag, rating, jobs completed. `categoryId`/`cityId` are
  nullable — set via `/api/professionals/onboarding` after sign-up, since the
  sign-up form itself only collects name/email/phone/password.
- **Admin** — a `permissions` JSON array for future fine-grained admin roles
  (currently any admin can do anything; the array is there to grow into).
- **Category**, **Service**, **City** — the service catalog.
- **Booking** — links customer, professional (nullable until assigned),
  service, city; carries status, schedule, address, estimated/final price.
- **Payment** — one-to-one with a booking; placeholder gateway.
- **Review** — one-to-one with a booking; feeds the professional's `ratingAvg`.
- **Complaint** — linked to a booking and to whoever raised it; status enum
  drives the admin complaint workflow.
- **Notification** — simple per-user feed, `read` boolean.

## Authentication & authorization

- **Auth.js (NextAuth v4)** with a Credentials provider (`lib/auth.ts`).
  Sessions are JWTs; the user's `role` is embedded in the token and exposed
  on `session.user.role` (see `types/next-auth.d.ts` for the type augmentation).
- **Three separate login portals** (`/login/customer`, `/login/professional`,
  `/login/admin`) all post to the same Credentials provider, but the portal
  itself is passed as `role` and checked against the account's actual role in
  `authorize()` — so a customer's credentials are rejected on the admin
  portal, even if the password is correct.
- **Registration** (`/api/auth/register`) only accepts `customer` or
  `professional` — there is no self-service admin sign-up. The one admin
  account comes from `prisma/seed.ts`; creating more admins is an
  admin-to-admin action you'd add once the admin dashboard needs it.
- **Middleware** (`middleware.ts`) protects every `/dashboard/*` route at the
  edge, before any page code runs:
  - Not logged in → redirected to the matching `/login/[role]`, with a
    `callbackUrl` back to where they were headed.
  - Logged in but wrong role for that section → redirected to *their own*
    dashboard, not shown an error page. A customer hitting
    `/dashboard/professional` lands on `/dashboard/customer` instead.
- **API routes** are independently protected via `requireAuth()` /
  `requireRole([...])` in `lib/rbac.ts` — so the same rules hold even if
  something calls the API directly rather than through a page.
- **Password reset / email verification** use single-use tokens in the
  standard NextAuth `VerificationToken` table (namespaced with a
  `reset:`/`verify:` prefix on the identifier), with a 1-hour / 24-hour
  expiry respectively. "Sending" the email is a placeholder
  (`lib/tokens.ts` → `sendPlaceholderNotification`) that logs the link to
  the console — swap it for Resend/SendGrid/Twilio when you're ready.

## What's still a placeholder

- **Payments** (`app/api/payments/route.ts`) — a mock charge, not a real
  gateway call.
- **Email/SMS sending** — logged to console, not actually delivered.
- **OTP verification** — UI only (`/verify-otp`), not backed by a real SMS
  provider or checked against a stored code.
- **Dashboard data** — the three dashboards still render the original mock
  data from `lib/mock-data.ts` rather than fetching from the new API routes.
  Wiring each dashboard tab to its matching endpoint (e.g. Customer
  Dashboard's "My Bookings" → `GET /api/bookings`) is the natural next step
  and doesn't require any UI changes, just swapping the data source.

## Environment variables

See `.env.example`. At minimum you need `DATABASE_URL` (a real Postgres
instance) and `NEXTAUTH_SECRET` (`openssl rand -base64 32`) to run this.

## Payments (Razorpay)

Real integration, not a stub — with a built-in mock fallback so the whole
booking flow stays demoable without a live Razorpay account:

- **Order creation**: `POST /api/payments/razorpay/order` creates a Razorpay
  Order and a local `Payment` row keyed by `razorpayOrderId`.
- **Client checkout**: the booking flow (`app/book/page.tsx`) loads the real
  Razorpay Checkout widget (`checkout.razorpay.com/v1/checkout.js`) for
  UPI/Card/Net Banking. If no real keys are configured, it skips the widget
  and calls `/verify` directly — see `lib/razorpay.ts`.
- **Verification**: `POST /api/payments/razorpay/verify` checks the
  HMAC-SHA256 signature Checkout returns (`lib/razorpay-verify.ts`).
- **Webhooks**: `POST /api/webhooks/razorpay` is the source of truth —
  handles `payment.captured`, `payment.failed`, `refund.processed`,
  independent of whether the client-side `/verify` call ever completes.
  Configure this URL in the Razorpay Dashboard once deployed.
- **Wallet payments**: `POST /api/payments/wallet` — an internal ledger
  transfer, never touches Razorpay.
- **Cash after service**: `POST /api/payments` — recorded as `PENDING` until
  the professional marks the job `COMPLETED`, then flipped to `SUCCESS`.
- **Refunds**: `POST /api/payments/[bookingId]/refund` (admin) and the same
  logic is triggered automatically when an admin approves a complaint's
  refund. Routes Razorpay-gateway payments through a real Razorpay refund
  call; wallet/cash payments are refunded as a wallet credit instead, since
  there's no gateway transaction to reverse.
- **Payment Settlement**: `POST /api/bookings/[id]/settle` computes the
  platform's commission (`Category.commissionRate`) vs. the professional's
  payout, credits the professional's `walletBalance`, and is triggered
  automatically right after a customer submits their rating — matching the
  booking engine's `Rating → Payment Settlement` step. Also available as a
  manual admin action from the Manage Bookings tab.
- **Invoices**: `app/invoice/[bookingId]/page.tsx` — a server-rendered,
  access-controlled, printable invoice (browser Print → Save as PDF covers
  "download" without a PDF-generation dependency).
- **Payment History**: `GET /api/payments` — role-aware (customer sees their
  own; professional sees bookings assigned to them; admin sees everything).
  Feeds the Customer Dashboard's Wallet tab.
- **Professional Earnings Dashboard**: `GET /api/professionals/earnings` —
  this week / this month settled totals plus a recent-settlements list,
  feeding the Professional Dashboard's Earnings tab alongside the real
  wallet balance from `GET /api/professionals/me`.

To go live: set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and
`RAZORPAY_WEBHOOK_SECRET` in `.env` — no code changes needed, `lib/razorpay.ts`
switches off the mock automatically once real keys are present.

## Booking engine

The full state machine lives in `app/api/bookings/[id]/route.ts`:

```
PENDING → (professional accepts) → CONFIRMED → (travels) → ON_THE_WAY
  → (starts job) → IN_PROGRESS → (completes job) → COMPLETED
PENDING/CONFIRMED → (either side cancels) → CANCELLED
```

Each transition is role-gated (only the professional can accept/travel/
start/complete; customer or admin can cancel early) and fires a
`Notification` to the customer. Pricing is computed server-side in
`lib/pricing.ts` (never trusted from the client), and settlement math lives
in `lib/commission.ts`.
