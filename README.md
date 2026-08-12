# PixelGrade AI

The [Next.js](https://nextjs.org) (App Router) frontend for **PixelGrade AI** — authentication UI, a dashboard shell, settings pages, and Redux Toolkit Query wired up.

## Stack

- **Next.js 15** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **Ant Design 6** (with dark mode via `next-themes`)
- **Redux Toolkit + RTK Query** for state and API calls
- **Vitest + React Testing Library** for tests
- **Prettier + ESLint** for formatting & linting

## What's included

| Area             | Details                                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Auth pages       | Login (incl. Google Sign-In UI), signup, forgot/reset password, verify code — `src/app/(auth)/`                         |
| Route protection | Cookie-aware middleware (`src/middleware.ts`) — open by default, ready to gate (see [Authentication](#authentication))  |
| Public site      | Navbar, footer, and demo landing/marketing pages — `src/app/(main)/`                                                    |
| Dashboards       | Responsive sidebar + header layout for **user** and **admin** — `src/app/(userDashboard)/`, `src/app/(adminDashboard)/` |
| Demo routes      | User: Projects, Billing, Support · Admin: Analytics, Orders, Reports — patterns to copy (table, form, stat cards)       |
| Settings         | Profile, security (change password), notifications, data & privacy (account deletion)                                   |
| API layer        | RTK Query `baseApi` with token injection + 401 refresh retry — `src/redux/api/baseApi.ts`                               |
| Feature APIs     | Auth, user, notification, settings, account-deletion, demo — `src/redux/features/<feature>/`                            |
| Theming          | Light/dark toggle synced across Tailwind and Ant Design — `src/Providers/ThemeProvider.tsx`, `src/utils/antTheme.ts`    |
| SEO              | `metadataBase` + OG/Twitter tags, `robots.ts`, `sitemap.ts`, web `manifest.ts` driven by `src/config/site.ts`           |
| UI states        | `error.tsx`, `global-error.tsx`, `not-found.tsx`, `loading.tsx`, plus `EmptyState` & `Skeleton` components              |
| Utilities        | Ant Design alert helpers, API error parsing, auth cookie helpers, env accessor — `src/utils/`, `src/config/`            |

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` by copying `.env.example`:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000        # backend API base URL
   NEXT_PUBLIC_IMAGE_URL=http://localhost:8000       # where uploaded files are served
   NEXT_PUBLIC_SITE_URL=http://localhost:3000        # this site's public URL (SEO)
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id # only if using Google Sign-In
   ```

   Env vars are read through `src/config/env.ts`, which warns (dev) or throws (prod) when a required one is missing.

3. Run the dev server:

   ```bash
   npm run dev
   ```

## Scripts

| Script                 | What it does                      |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the dev server (Turbopack)  |
| `npm run build`        | Production build                  |
| `npm run start`        | Serve the production build        |
| `npm run lint`         | ESLint                            |
| `npm run format`       | Format the repo with Prettier     |
| `npm run format:check` | Verify formatting without writing |
| `npm run test`         | Run the Vitest suite once         |
| `npm run test:watch`   | Vitest in watch mode              |

## Route groups

The `src/app/` folder uses [route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) (parentheses, which don't affect the URL) to give each area its own layout:

- `(auth)/` — centered card layout for login/signup/password flows.
- `(main)/` — public marketing site with the shared Navbar + Footer.
- `(userDashboard)/` — signed-in user area at `/user-dashboard` with its own sidebar.
- `(adminDashboard)/` — admin area at `/admin` with an admin sidebar.

## Authentication & Backend Integration

The frontend is **fully integrated with the Express.js REST API backend** using RTK Query and JWT authentication.

- **API Layer**: All requests are routed through `src/redux/api/baseApi.ts`, injecting JWT bearer tokens and automatically handling 401 token refreshes.
- **Route Protection**: Server-side middleware (`src/middleware.ts`) gates protected routes (`/user-dashboard`, `/admin`) based on authentication state and user roles.
- **Key Workflows Integrated**:
  - Full Authentication & User Profile Management (Login, Signup, Google OAuth, Change/Reset Password)
  - Scrydex AI Vision Card Identification & OpenAI GPT-4o AI Grading
  - PixelScope Multi-Image Upload & Pixel Verified Badge workflow
  - Slab Generator & Physical Slab Order Fulfillment with automated USPS Tracking and HTML confirmation emails
  - Stripe Subscription Checkout & Plan Management
  - Admin & Super Admin Management Dashboards

## Customizing for a new project

- The brand lives in `src/config/site.ts` (name, title, description, URL) — this feeds SEO, sitemap, robots, and manifest.
- The **PixelGrade AI** wordmark is rendered in `src/components/shared/Navbar.tsx`, `Footer.tsx`, `src/app/(auth)/layout.tsx`, and the dashboard `Sidebar.tsx` files.
- Build your landing page in `src/app/(main)/page.tsx` and add nav links in `Navbar.tsx` / `Footer.tsx`.
- Add dashboard pages under `src/app/(userDashboard)/user-dashboard/` and register them in the `Sidebar.tsx` navigation array.
- Add API modules under `src/redux/features/<feature>/` by injecting endpoints into `baseApi` (add new tag types in `src/redux/api/baseApi.ts`).
- Adjust the auth endpoints in `src/redux/features/auth/authApi.ts` to match your backend.
- Drop `favicon.ico` / app icons into `public/` and extend `src/app/manifest.ts`.

## Backend expectations

The auth layer assumes endpoints like `/api/auth/login/`, `/api/auth/register/`, `/api/auth/password/reset/`, and `/api/auth/token/refresh/`. Adjust `src/redux/features/auth/authApi.ts` and `src/redux/features/user/userApi.ts` to fit your API.
