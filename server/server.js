require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const { OAuth2Client } = require('google-auth-library');

console.log("My DB Link is:", process.env.MONGODB_URI);

// Import routes
const bountyRoutes = require('./routes/bounties');
const recipeRoutes = require('./routes/recipes');
const restaurantRoutes = require('./routes/restaurants');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require('./models/user');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true // This allows the "Login Session" to work
}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle the "preflight" request specifically
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());                 // Parses JSON request bodies

// tells server to remems users using a secret key
app.use(session({
  secret: 'session-secret-stuff',
  resave: false,
  saveUninitialized: false,
  proxy: true, // Add this if you're using a proxy
  cookie: {
    secure: false,   // MUST be false for localhost
    httpOnly: true,
    sameSite: 'lax', // This allows the cookie to be sent during development
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
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

// NEW: Route to check "Who am I?" when the page refreshes
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
app.get('/', (req, res) => {
  res.json({ message: 'From the Source API is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
