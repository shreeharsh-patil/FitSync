# FitSync Frontend

Next.js frontend for FitSync — AI-powered fitness tracking platform.

## Getting Started

### Prerequisites

- Node.js 20+
- Backend server running (see `../backend/README.md`)

### Setup

```bash
# Copy environment variables
cp .env.example .env.local

# Install dependencies (from project root)
cd .. && npm install

# Start dev server
npm run dev
```

The frontend will run on **http://localhost:3000**.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | Express backend URL |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Frontend URL |

### Architecture

- **Next.js 16** with App Router
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **JWT Auth** via custom auth context (no NextAuth)
- **API Proxy**: All `/api/*` requests are proxied to the Express backend via Next.js rewrites (configured in `next.config.ts`)

### Key Files

| File | Purpose |
|---|---|
| `src/lib/api.ts` | API client with JWT handling |
| `src/lib/auth-context.tsx` | JWT auth context (login/signup/logout) |
| `src/lib/providers.tsx` | Provider wrapper |
| `src/middleware.ts` | Route protection (checks JWT cookie) |
| `next.config.ts` | Proxy config for backend API |
