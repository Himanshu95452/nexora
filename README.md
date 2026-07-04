# Nexora — MVP Codebase

India's trusted platform for verified home service professionals. Next.js 14
(App Router) + TypeScript + Tailwind CSS + Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:3000

```bash
npm run build   # production build (verified to pass cleanly)
npm run start   # run the production build
```

## What's here

- **Landing page** (`app/page.tsx`) — hero with city selector + search, emergency
  booking banner, service pricing, featured professionals, booking flow preview,
  trust pillars, verification timeline, partner CTA, sample testimonials,
  FAQ. Below-the-fold sections are code-split with `next/dynamic` for faster
  first load.
- **Booking flow** (`app/book`) — 10-step wizard: city → service → professional →
  date/time → price estimate → confirm → payment → live tracking → completed →
  rating & review.
- **Auth** (`app/login/[role]`, `app/signup/[role]`, `app/forgot-password`,
  `app/verify-otp`, `app/verify-email`) — one dynamic route handles all three
  roles (customer/professional/admin) rather than duplicating near-identical
  pages.
- **Dashboards** (`app/dashboard/{customer,professional,admin}`) — each is a
  single-page app with a sidebar + tabs, built on the shared
  `DashboardShell` component. All data comes from `lib/mock-data.ts` and is
  clearly placeholder content.
- **Dark mode** — class-based, toggled via `lib/theme-context.tsx`, persisted
  to `localStorage`.
- **SEO** — metadata in `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`.

## What's mocked vs. real

Everything here is real, working frontend code — routing, state, forms,
animations. What's mocked (by design, since there's no backend yet):

- All data lives in `lib/mock-data.ts` — bookings, professionals, complaints,
  trust scores. Swap this for real API calls when the backend exists.
- Payment methods, OTP, and KYC are UI-only — no real payment gateway or SMS
  provider is wired up.
- Auth forms don't call an API yet; wire them to your auth provider
  (NextAuth, Clerk, custom JWT, etc.) via the `<form>` handlers.

## Suggested next steps toward a real MVP

1. Replace `lib/mock-data.ts` reads with a real API/database layer.
2. Add an actual auth provider and protect `/dashboard/*` routes with
   middleware based on role.
3. Wire the booking flow's payment step to a real gateway (Razorpay/Stripe).
4. Add real professional/customer photo uploads (KYC documents, portfolio).
5. Turn the admin dashboard's action buttons (approve/reject/refund) into
   real mutations once there's a backend to call.

## Design system

Colors, type scale, and the "verification seal" motif are defined once in
`tailwind.config.ts` and reused throughout — see `components/ui/`.
