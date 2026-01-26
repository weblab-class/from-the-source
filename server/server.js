require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');
const fs = require('fs');

console.log("My DB Link is:", process.env.MONGODB_URI);

// Import routes
const bountyRoutes = require('./routes/bounties');
const recipeRoutes = require('./routes/recipes');
const restaurantRoutes = require('./routes/restaurants');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require('./models/user');

// Initialize express app
const app = express();

// CORS
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,            // e.g. https://your-frontend.onrender.com (optional)
  'http://localhost:5173'              // local dev
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow same-origin / curl / server-to-server
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.options('*', cors());

app.use(express.json());              

// Behind Render/any proxy
app.set('trust proxy', 1);

// tells server to remember users using a secret key
app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret-stuff',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// auth logic
app.post('/api/login', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload(); // This is the user's Google info!

    // check if user exists, if not, create them
    let user = await User.findOne({ googleid: payload.sub });
    if (!user) {
      user = new User({
        name: payload.name,
        googleid: payload.sub,
      });
      await user.save();
    }

    req.session.user = user; // This logs them in!
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Login failed" });
  }
});

app.get('/api/whoami', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.json({});
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.send({});
});


// 1. Manually define the connection string here
const atlasURI = "mongodb+srv://mhhan_db_user:abcd@fromthesource.idrfeoz.mongodb.net/fromthesource?retryWrites=true&w=majority";

// 2. Connect using that manual string
mongoose.connect(atlasURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));
// Routes
app.use('/api/bounties', bountyRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Test route - visit http://localhost:5000/ to check if server is running
app.get("/api", (req, res) => res.json({ message: "From the Source API is running!" }));

// Serve built frontend (Vite)
const distCandidates = [
  path.join(__dirname, '../client/dist'),
  path.join(__dirname, '../client/src/dist'),
];

const distPath = distCandidates.find((p) => fs.existsSync(path.join(p, 'index.html')));

if (distPath) {
  app.use(express.static(distPath));

  // SPA fallback — keep this AFTER /api routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.warn('⚠️ No frontend dist folder found. Looked in:', distCandidates);
}

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
