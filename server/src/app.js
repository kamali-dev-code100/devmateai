require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');

const routes = require('./routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// ─── Security ─────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ─── CORS ─────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://devmate-ai-sigma.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    // Allow localhost
    if (origin.includes('localhost')) return callback(null, true);

    // Allow your Vercel domain (all preview URLs too)
    if (origin.includes('vercel.app')) return callback(null, true);

    // Allow your custom domain if you add one later
    if (origin.includes('devmate-ai')) return callback(null, true);

    console.log('CORS blocked:', origin);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
}));

app.options('*', cors());

// Handle preflight
app.options('*', cors());

// Handle preflight requests
app.options('*', cors());

// ─── Parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Session ──────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'devmate_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
}));

// ─── Passport ─────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── Logging ──────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Trust Proxy (needed for Render/Railway deployments) ──────
app.set('trust proxy', 1);

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
  });
});

// ─── API Routes ───────────────────────────────────────────────
app.use('/api', routes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

module.exports = app;