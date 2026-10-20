# 🎮 Statrix

Statrix is a web platform where gamers **share their gaming journey**, connect with friends, and explore a large database of video games.

🌐 Live at **[statrix.app](https://statrix.app)**

With Statrix you can:

- Build a **public gaming profile** with a custom avatar and banner.
- Browse and search a **video game database** (powered by [IGDB](https://www.igdb.com/)).
- **Rate, review, and favorite** games, and track their status in your library.
- **Import your Steam library**.
- Create **custom game lists** (drag-and-drop ordering) to show off your backlog or recommendations.
- Add **friends**, see their activity, and **chat** with them in real time.

---

## 🚀 Tech Stack

| Area | Technology |
| --- | --- |
| Framework | **Next.js 14** (App Router, Server Actions), **React 18**, **TypeScript** |
| Styling | **Tailwind CSS 4**, Radix UI, Motion, Swiper |
| Auth | **NextAuth** (email/password with bcrypt, Google OAuth), Steam login |
| Database | **PostgreSQL** (`pg`) |
| Real-time chat | **Socket.IO** + Express (separate service in `src/chat`) |
| Storage | **Cloudflare R2** (S3 API) for user-uploaded avatars and banners, processed with `sharp` |
| Email | **Resend** + React Email (account verification, password reset) |
| Testing | Jest + React Testing Library |
| Deployment | Docker Compose, nginx, Let's Encrypt (certbot), GitHub Actions |

---

## 📁 Project Structure

```
src/
├── app/          # Next.js App Router pages (profile, gamePage, browseGames, mylists, chat, …)
│   └── api/      # Route handlers: NextAuth, Steam login/callback
├── actions/      # Server Actions (DB queries, IGDB calls, uploads, emails)
├── components/   # Reusable React components
├── chat/         # Standalone Socket.IO chat server (own package.json)
├── enums/        # Shared enums (GameStatus, FriendshipStatus, ListMode, …)
├── types/        # TypeScript types
└── util/         # Postgres pool, auth config, helpers
public/           # Static assets (preset avatars, banners, icons, logos)
nginx/            # nginx reverse-proxy config (HTTPS + WebSocket proxy)
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js 22+** and npm
- A **PostgreSQL** database (the schema is not included in this repo)
- API credentials for the services listed below

### 1. Clone and install

```bash
git clone https://github.com/ErikColacios/VideogameList.git statrix
cd statrix
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (it is git-ignored):

```env
# Next / NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
NODE_ENV=development

# PostgreSQL
POSTGRES_HOST=
POSTGRES_PORT=5432
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# IGDB API (Twitch developer credentials)
CLIENT_ID=
BEARER=
BASE_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Resend (transactional email)
RESEND_API_KEY=

# Steam Web API
STEAM_API_KEY=

# Cloudflare R2 (avatar/banner uploads)
R2_ACCOUNT_ID=
R2_BUCKET_NAME=
R2_ACCESS_KEY=
R2_SECRET_KEY=
R2_TOKEN_VALUE=
R2_CDN_URL=
```

| Service | Where to get credentials |
| --- | --- |
| IGDB | [IGDB API docs](https://api-docs.igdb.com/#getting-started): register a Twitch app to get a Client ID and an access token (`BEARER`). |
| Google OAuth | [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Add `http://localhost:3000/api/auth/callback/google` as a redirect URI. |
| Resend | [resend.com](https://resend.com) |
| Steam | [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) |
| Cloudflare R2 | Cloudflare dashboard → R2 → Manage API tokens |

### 3. Run in development

```bash
# Next.js app → http://localhost:3000
npm run dev

# Chat server (in a second terminal) → port 4000
npm run chat
```

> **Note:** The chat client connects to `/socket.io` on the same origin as the website. In production nginx forwards that path to the chat service. Locally the Next.js dev server does not proxy `/socket.io`, so the chat only works if you put a reverse proxy in front of both servers.

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run chat` | Start the chat server in watch mode (`tsx`) |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run Jest in watch mode |

---

## 🐳 Deployment

Production runs on a VPS with **Docker Compose**:

| Service | Description |
| --- | --- |
| `web` | Next.js app (`Dockerfile.web`), port 3000 |
| `chat` | Socket.IO server (`Dockerfile.chat`), port 4000 |
| `nginx` | Reverse proxy on ports 80/443. Handles HTTPS, forwards `/socket.io/` to `chat` and everything else to `web` |
| `certbot` | Let's Encrypt certificates (`letsencrypt/`, `certbot/`) |

```bash
docker compose up --build -d
```

### Continuous deployment

Every push to `main` triggers [`.github/workflows/auto-deploy.yml`](.github/workflows/auto-deploy.yml). It connects to the VPS over SSH, pulls the latest code, and rebuilds the containers. It needs these repository secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT`.

> ⚠️ Pushing to `main` deploys to production.

---

## 🙏 Credits

- Game data provided by [IGDB](https://www.igdb.com/).
- Built by [Erik Colacios](https://github.com/ErikColacios).
