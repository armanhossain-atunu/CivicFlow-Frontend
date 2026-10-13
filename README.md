# CivicFlow Frontend

CivicFlow is a civic complaint management frontend. Citizens can submit and
track complaints, while authorized city staff can manage assignments and
complaint progress.

## Features

- Public marketing pages and CivicFlow service information.
- Citizen dashboard for complaint tracking, payments, and feedback on closed
  complaints.
- Manager dashboard for reviewing complaints and assigning technicians.
- Technician dashboard for assigned complaint work.
- Admin tools for users, complaints, assignments, categories, payments, and
  reports.
- Responsive layouts, skeleton loading states, and light/dark theme styling.

## Technology

- Next.js 16 App Router and React 19
- TypeScript
- Tailwind CSS 4 and shared UI components
- TanStack Query for server state and mutations
- `ofetch` API client
- Biome for linting and formatting checks

## Requirements

- Node.js compatible with the versions required by Next.js 16.
- pnpm 12 (the package manifest specifies `pnpm@12.9.1`).
- A running CivicFlow API server.

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a local environment file from the example:

   ```bash
   Copy-Item .env.example .env.local
   ```

   On macOS or Linux, use `cp .env.example .env.local`.

3. Set the environment values for your local API and Google sign-in client:

   ```dotenv
   API_BASE_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```

   `API_BASE_URL` must point to the API base path expected by the backend. All
   API requests are sent through the Next.js app, which sets the authentication
   cookies on the frontend origin. In Vercel, configure `API_BASE_URL` for each
   deployment environment and redeploy after changing it. The backend does not
   need to allow browser requests from the frontend origin.

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local Next.js development server. |
| `pnpm build` | Create an optimized production build. |
| `pnpm start` | Serve the production build. |
| `pnpm lint:check` | Run Biome lint checks on `src`. |
| `pnpm lint:fix` | Apply Biome lint fixes on `src`. |
| `pnpm format:check` | Check formatting in `src`. |
| `pnpm format:fix` | Apply formatting in `src`. |

## Project structure

```text
src/
  api/                 API request functions
  app/                 App Router routes and layouts
  components/
    common/            Shared application components
    modules/           Feature and page sections
    ui/                Shared UI primitives
  hooks/               React Query hooks
  lib/                 API client and shared utilities
  types/               Shared TypeScript types
```

The main dashboards are under `src/app/(dashboard)/dashboard/`:

- `/dashboard/citizen`
- `/dashboard/manager`
- `/dashboard/technician`
- `/dashboard/admin`

Public marketing routes are under `src/app/(public)/(marketing)/`.

## API and authentication

API calls use the shared `ofetch` client in `src/lib/apiClient.ts`. Requests
include browser credentials (`credentials: "include"`), and API errors are
surfaced as exceptions for query and mutation handlers.

Configure the API base URL and its CORS settings to match the frontend origin.
Access control must also be enforced by the backend; hiding or protecting a
frontend route is not a substitute for API authorization.

## Remote images

Next.js image optimization is configured to accept HTTPS images from
`images.unsplash.com`. Add a host-specific `remotePatterns` entry in
`next.config.ts` before using images from another remote host.
