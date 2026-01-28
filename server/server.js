require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const { OAuth2Client } = require('google-auth-library');
const path = require("path");
const fs = require('fs');

console.log("My DB Link is:", process.env.MONGODB_URI);

const bountyRoutes = require('./routes/bounties');
const recipeRoutes = require('./routes/recipes');
const restaurantRoutes = require('./routes/restaurants');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require('./models/user');

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://from-the-source.onrender.com",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.options('*', cors());
app.use(express.json());
app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret-stuff',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
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
    const payload = ticket.getPayload();

    // check if user exists, if not, create them
    let user = await User.findOne({ googleid: payload.sub });
    if (!user) {
      user = new User({
        name: payload.name,
        googleid: payload.sub,
      });
      await user.save();
    }

    req.session.user = user;
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

app.post('/api/user/update', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "not logged in" });
  }

  try {
    const { name, picture } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.session.user._id,
      { name, picture },
      { new: true }
    );

    req.session.user = updatedUser;

    res.json(updatedUser);
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ message: "failed to update profile" });
  }
});

// routes
app.use('/api/bounties', bountyRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.get("/api", (req, res) => res.json({ message: "From the Source API is running!" }));

const atlasURI = "mongodb+srv://mhhan_db_user:abcd@fromthesource.idrfeoz.mongodb.net/fromthesource?retryWrites=true&w=majority";
mongoose.connect(atlasURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const distPath = path.join(__dirname, '../client/dist');

if (fs.existsSync(path.join(distPath, 'index.html'))) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ message: "API route not found" });
    } else {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
} else {
  console.log("Dist folder not found at:", distPath);
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
