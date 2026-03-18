<div align="center">

<img src="https://img.shields.io/badge/DevMate_AI-Developer_Intelligence-10b981?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMi41IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTUtMTAtNXpNMiAxN2wxMCA1IDEwLTVNMiAxMmwxMCA1IDEwLTUiLz48L3N2Zz4=" />

# DevMate AI 🤖

### The AI co-pilot for a better developer career

**Resume Analyzer · Interview Trainer · Code Reviewer · Learning Paths · Bug Fix AI**

<br/>

[![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js_18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![OpenAI](https://img.shields.io/badge/GPT--4o-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com)
[![License](https://img.shields.io/badge/License-MIT-10b981?style=flat-square)](LICENSE)

<br/>

![DevMate AI Dashboard](https://img.shields.io/badge/Status-Active_Development-10b981?style=flat-square)

</div>

---

## ✨ What is DevMate AI?

DevMate AI is a full-stack SaaS platform that gives software developers an unfair advantage in their careers. Powered by GPT-4o, it combines five intelligent tools into one beautiful dashboard — helping developers land better jobs, write better code, and grow faster.

```
Resume Analyzer    → ATS score, keyword gaps, GPT-4o feedback
Interview Trainer  → FAANG-level mock interviews with real-time scoring
Code Reviewer      → Security audits, performance tips, best practices
Learning Paths     → Personalized AI roadmaps toward your target role
Bug Fix AI         → Root cause diagnosis + working fix in seconds
```

---

## 🖥️ Preview

| Landing Page                        | Dashboard                               | Auth                                 |
| ----------------------------------- | --------------------------------------- | ------------------------------------ |
| Animated hero with aurora/starfield | Astronaut robot greeting, stats, charts | Glassmorphism card with tab switcher |

> Dark & light mode · Fully responsive · Mobile-first design

---

## 🗂️ Project Structure

```
devmate-ai/
├── client/                          # ⚛️  React + Vite frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── ui/                  # icons.jsx, index.jsx (shared UI)
│       │   ├── layout/              # AppShell, Sidebar, Topbar
│       │   └── shared/              # ChatWindow, RobotWave
│       ├── pages/
│       │   ├── auth/                # Login, Register, AICircuitVisual
│       │   ├── tools/               # Resume, Interview, Code, Learning, Bug
│       │   ├── Landing.jsx          # Public landing page
│       │   ├── AuthPage.jsx         # /auth route (glassmorphism)
│       │   ├── Dashboard.jsx        # Main dashboard
│       │   ├── Profile.jsx
│       │   └── Settings.jsx
│       ├── hooks/                   # useAuth, useTheme
│       ├── store/                   # Zustand (authStore, uiStore)
│       ├── services/                # Axios API services
│       └── styles/                  # Global CSS
│
└── server/                          # 🟢  Node.js + Express backend
    ├── src/
    │   ├── config/                  # DB, OpenAI, env validation
    │   ├── controllers/             # Auth, Resume, Interview, Code, Learning, Bug
    │   ├── models/                  # Mongoose schemas
    │   ├── routes/                  # Express routers
    │   ├── middleware/              # JWT, rate-limit, credits
    │   ├── services/ai/prompts/     # Engineered GPT-4o prompts
    │   └── utils/                   # ApiError, ApiResponse, asyncHandler
    └── server.js
```

---

## 🛠️ Tech Stack

### Frontend

| Technology      | Purpose                             |
| --------------- | ----------------------------------- |
| React 18 + Vite | UI framework & build tool           |
| Tailwind CSS    | Utility-first styling               |
| Framer Motion   | Page & scroll animations            |
| Zustand         | Global state (auth, theme, sidebar) |
| Axios           | HTTP client                         |
| React Router v6 | Client-side routing                 |
| React Hot Toast | Notifications                       |

### Backend

| Technology         | Purpose                              |
| ------------------ | ------------------------------------ |
| Node.js + Express  | REST API server                      |
| MongoDB + Mongoose | Database & ODM                       |
| JWT + Passport.js  | Auth (local + GitHub + Google OAuth) |
| OpenAI SDK         | GPT-4o / GPT-4o-mini                 |
| bcryptjs           | Password hashing                     |
| Zod                | Request validation                   |
| express-rate-limit | API protection                       |
| Helmet + CORS      | Security headers                     |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [Atlas](https://cloud.mongodb.com) — free tier works)
- **OpenAI API key** from [platform.openai.com](https://platform.openai.com/api-keys)

### 1 — Clone & install

```bash
git clone https://github.com/kamali-dev-code100/devmate-ai.git
cd devmate-ai

# Install all deps at once
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 2 — Configure environment

```bash
cp .env.example server/.env
```

Open `server/.env` and fill in:

```env
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/devmate
JWT_SECRET=your-super-secret-32-char-string-here
OPENAI_API_KEY=sk-...

# Optional — OAuth (leave blank to skip)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3 — Start development

```bash
# Starts both client (5173) and server (5000)
npm run dev
```

Or separately:

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

### 4 — Open in browser

```
Frontend  →  http://localhost:5173
Backend   →  http://localhost:5000
Health    →  http://localhost:5000/api/health
```

---

## 📡 API Reference

### Auth

```
POST   /api/auth/register        Create account
POST   /api/auth/login           Sign in
POST   /api/auth/logout          Sign out
GET    /api/auth/me              Get current user
GET    /api/auth/github          GitHub OAuth
GET    /api/auth/google          Google OAuth
```

### AI Tools

```
POST   /api/resume/analyze       Analyze resume (5 credits)
POST   /api/resume/:id/chat      Chat about resume
GET    /api/resume               List analyses

POST   /api/interview/start      Start session (1 credit/msg)
POST   /api/interview/:id/message Send answer
POST   /api/interview/:id/end    End & score session

POST   /api/code-review          Review code (3 credits)
POST   /api/code-review/:id/chat Chat about review

POST   /api/learning-path/generate  Generate path (5 credits)
GET    /api/learning-path           List paths
PATCH  /api/learning-path/:id/module/:moduleId  Mark complete

POST   /api/bug-fix              Diagnose bug (2 credits)
POST   /api/bug-fix/:id/message  Follow-up chat
```

### User

```
GET    /api/user/profile         Get profile
PATCH  /api/user/profile         Update profile
PATCH  /api/user/settings        Update settings
DELETE /api/user/account         Delete account
```

---

## 💳 Credit System

| Action                   | Credits |
| ------------------------ | ------- |
| Resume analysis          | 5       |
| Code review              | 3       |
| Bug fix diagnosis        | 2       |
| Interview message        | 1       |
| Learning path generation | 5       |

| Plan          | Monthly Credits  |
| ------------- | ---------------- |
| Free          | 100              |
| Pro ($19/mo)  | 1,000 + GPT-4o   |
| Team ($49/mo) | 5,000 + 10 seats |

---

## 🚀 Production Deployment

```bash
# 1. Build frontend
cd client && npm run build

# 2. Set env vars on your server
NODE_ENV=production
MONGODB_URI=...
JWT_SECRET=...
OPENAI_API_KEY=...

# 3. Start production server (serves frontend dist/)
cd server && npm start
```

> **Recommended platforms:** Railway · Render · Fly.io · AWS EC2

---

## 🔐 Security Notes

- All `.env` files are gitignored — **never commit secrets**
- JWT tokens expire in 7 days; refresh tokens in 30 days
- Rate limiting: 100 req/15min per IP on all routes
- Helmet.js sets secure HTTP headers
- All AI inputs are validated with Zod before processing

---

## 📁 Key Files Reference

| File            | Location                                     |
| --------------- | -------------------------------------------- |
| Route config    | `client/src/App.jsx`                         |
| Theme system    | `client/src/hooks/index.js`                  |
| UI store        | `client/src/store/uiStore.js`                |
| Icon library    | `client/src/components/ui/icons.jsx`         |
| Astronaut robot | `client/src/components/shared/RobotWave.jsx` |
| Auth page       | `client/src/pages/AuthPage.jsx`              |
| Landing page    | `client/src/pages/Landing.jsx`               |
| Dashboard       | `client/src/pages/Dashboard.jsx`             |
| All AI tools    | `client/src/pages/tools/index.jsx`           |

---

## 🤝 Contributing

```bash
# 1. Fork the repo
# 2. Create a branch
git checkout -b feature/your-feature

# 3. Commit
git commit -m "feat: add your feature"

# 4. Push & open a PR
git push origin feature/your-feature
```

---

## 📄 License

MIT © 2026 DevMate AI

---

<div align="center">

**Built with ♥ for developers, by developers**

[⭐ Star this repo](https://github.com/kamali-dev-code100/devmate-ai) · [🐛 Report a bug](https://github.com/kamali-dev-code100/devmate-ai/issues) · [💡 Request a feature](https://github.com/kamali-dev-code100/devmate-ai/issues)

</div>
