# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Statrix (https://statrix.app) is a social game-tracking app: users track games (status, score, hours played), write/like reviews, build drag-and-drop ordered lists, import their Steam library, add friends and chat in real time. Game data comes from the IGDB API.

## Commands

```bash
npm run dev          # Next.js dev server (port 3000)
npm run chat         # Socket.IO chat server in watch mode (src/chat/server.ts, port 4000)
npm run build        # Production build of the Next.js app
npm run lint         # next lint (eslint-config-next + plugin:react)
npm test             # Jest (jsdom, @testing-library)
npx jest path/to/file.test.tsx      # single test file
npx jest -t "test name"             # single test by name
```

Jest only picks up `*.test.{js,jsx,ts,tsx}` files; `@/` maps to `src/`. `src/components/__tests__/` exists but currently has no tests.

## Architecture

**Next.js 14 App Router, no REST API layer.** Almost all data access is done through Server Actions in `src/actions/` — one default/named export per file, each starting with `"use server"`. Client components import these directly. The only route handlers in `src/app/api/` are NextAuth and the Steam OpenID login/callback.

Server action conventions (follow these when adding new ones):
- Get the current user with `getSessionUser()` (wraps `getServerSession(authOptions)`) and read `session.user.id`; never trust a user id passed from the client.
- Query PostgreSQL with raw parameterized SQL via the shared `pool` from `@/util/postgres` (`pg`, no ORM). Tables include `user_videogame`, etc.
- Return `{ success: boolean, message: string }`-style objects rather than throwing.
- Naming: `get*` / `insert*` / `update*` / `delete*` + entity; IGDB calls are `*IGDB.ts`.

**Auth** (`src/util/auth.ts`): NextAuth with JWT sessions, Google provider + Credentials provider (bcrypt-checked via `logInUser`). The Credentials provider is also re-invoked with `trigger: "updateUser"` to refresh the session after a username change; the JWT callback injects `id` and `isNewUser` into the token. `src/util/provider.js` wraps the app in `SessionProvider`.

**External services:**
- IGDB (`CLIENT_ID`, `BEARER`) — game search/details, images served from `images.igdb.com`.
- Steam Web API (`STEAM_API_KEY`) — library import.
- Cloudflare R2 via `@aws-sdk/client-s3` (`R2_*` env vars) — avatars/banners, processed with `sharp` (validated, resized, re-encoded) before upload, served from `media.statrix.app`.
- Resend (`RESEND_API_KEY`) — verification and password-reset emails, templates are React components in `src/components/EmailTemplate*.tsx`.
- Upload size limit is 12 MB, set in both `next.config.mjs` (`serverActions.bodySizeLimit`) and `nginx/default.conf`; change both together.

**Chat** is split in two:
- Messages are persisted through server actions (`insertChatMessage`, `getChatMessages`, `getCreateChat`, ...).
- `src/chat/` is a separate Express + Socket.IO package (own `package.json`/`tsconfig.json`) that only relays events (`joinRoom`, `typing`, `messageData`) between room members; it does not touch the DB. The client (`src/app/chat/[roomId]/page.tsx`) connects to the same origin at `/socket.io`, which nginx proxies to the chat container.

Shared types live in `src/types/`, string enums (game status, friendship status, view/list/review modes) in `src/enums/`. Styling is Tailwind CSS v4.

## Deployment

Pushing to `main` auto-deploys (`.github/workflows/auto-deploy.yml`): SSH into the VPS, `git pull`, then `docker compose up --build -d`. Compose runs `web` (Dockerfile.web, Next.js), `chat` (Dockerfile.chat, built from `src/chat` only), `nginx` (TLS termination + routing) and `certbot`. The database runs on the host, reached via `host.docker.internal`. Environment variables are read from `.env`.
