# DevMate AI 🚀

> AI-powered developer platform — Resume Analyzer, Interview Trainer, Code Reviewer, Learning Paths, Bug Fix Assistant

---

## 🗂 Folder Structure

```
devmate-ai/
├── client/                          # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Button, Input, Badge, Toggle, Modal, Toast
│   │   │   ├── layout/              # AppShell, Sidebar, Topbar, ProtectedRoute
│   │   │   └── shared/              # ChatWindow, CodeEditor, ScoreBadge
│   │   ├── pages/
│   │   │   ├── auth/                # Login, Register
│   │   │   ├── tools/               # Resume, Interview, CodeReview, Learning, BugFix
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Settings.jsx
│   │   ├── hooks/                   # useAuth, useAI, useTheme
│   │   ├── store/                   # Zustand stores
│   │   ├── services/                # Axios API calls
│   │   ├── utils/                   # Helpers
│   │   └── styles/                  # Global CSS + themes
│   ├── .env
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                          # Node.js + Express backend
    ├── src/
    │   ├── config/                  # DB, OpenAI, env validation
    │   ├── controllers/             # Auth, Resume, Interview, Code, Learning, Bug
    │   ├── models/                  # Mongoose schemas
    │   ├── routes/                  # Express routers
    │   ├── middleware/              # JWT auth, rate limit, validate, credits
    │   ├── services/
    │   │   └── ai/prompts/          # Engineered prompts for each tool
    │   └── utils/                   # ApiError, ApiResponse, asyncHandler
    └── server.js
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- OpenAI API key

### Step 1 — Clone & Install

```bash
git clone https://github.com/yourname/devmate-ai.git
cd devmate-ai

# Install root deps
npm install

# Install client deps
cd client && npm install && cd ..

# Install server deps
cd server && npm install && cd ..
```

### Step 2 — Configure Environment

```bash
# Copy env template
cp .env.example server/.env

# Edit with your values
nano server/.env   # or code server/.env
```

**Required values:**
- `MONGODB_URI` — Your MongoDB connection string
- `JWT_SECRET` — Any random 32+ char string
- `OPENAI_API_KEY` — From https://platform.openai.com/api-keys

### Step 3 — Start Development

```bash
# From project root — starts both client & server
npm run dev
```

Or start separately:
```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

### Step 4 — Open in Browser

```
Frontend:  http://localhost:5173
Backend:   http://localhost:5000
API Docs:  http://localhost:5000/api/health
```

---

## 🚀 Production Build

```bash
# Build frontend
cd client && npm run build

# The dist/ folder is served by Express in production
# Set NODE_ENV=production in server/.env

# Start production server
cd server && npm start
```

---

## 📡 API Routes

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me

POST   /api/resume/analyze
POST   /api/resume/:id/chat
GET    /api/resume

POST   /api/interview/start
POST   /api/interview/:id/message
GET    /api/interview/:id
POST   /api/interview/:id/end

POST   /api/code-review
POST   /api/code-review/:id/chat
GET    /api/code-review

POST   /api/learning-path/generate
GET    /api/learning-path
PATCH  /api/learning-path/:id/module/:moduleId

POST   /api/bug-fix
POST   /api/bug-fix/:id/message

GET    /api/user/profile
PATCH  /api/user/profile
PATCH  /api/user/settings
DELETE /api/user/account
```

---

## 🛠 Tech Stack

**Frontend:** React 18, Vite, TailwindCSS, Zustand, Axios, React Router v6, React Hot Toast

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, OpenAI SDK, Multer, pdf-parse, Zod, express-rate-limit, helmet, cors, morgan

---

## 📄 License
MIT
