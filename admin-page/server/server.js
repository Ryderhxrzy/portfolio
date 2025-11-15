const path = require("path");
const express = require("express");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

// Keep your dotenv path config
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json({ limit: '10mb' }));

// CORS middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} from ${req.headers.origin || 'unknown'}`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  if (req.method === "OPTIONS") {
    console.log("✅ OPTIONS preflight handled");
    return res.sendStatus(200);
  }
  next();
});

// MongoDB connection
let adminCollection;
let mongoClient;

async function connectToMongo() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    const client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    mongoClient = client;

    const db = client.db("portfolio");
    adminCollection = db.collection("admin_account");

    await db.command({ ping: 1 });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB failed:", err.message);
    process.exit(1);
  }
}

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Admin Login API Server is running!",
    status: "healthy",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      admin_login: "/api/admin/login",
    },
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Server healthy",
    environment: NODE_ENV,
    database: adminCollection ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Helper function to escape regex special characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password, recaptchaToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "Email and password required" });
    }

    // Verify reCAPTCHA - TEMPORARILY DISABLED
    if (recaptchaToken) {
      // reCAPTCHA token provided but not verified for testing
    }
    /*
    if (!recaptchaToken) {
      return res.status(400).json({ ok: false, error: "reCAPTCHA verification required" });
    }

    try {
      const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
      });

      const recaptchaData = await recaptchaResponse.json();

      if (!recaptchaData.success) {
        return res.status(400).json({ ok: false, error: "reCAPTCHA verification failed" });
      }
    } catch (recaptchaError) {
      return res.status(500).json({ ok: false, error: "Failed to verify reCAPTCHA" });
    }
    */

    // Trim and normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Try both methods: direct match and case-insensitive regex
    let admin = await adminCollection.findOne({
      email: normalizedEmail
    });

    // If not found, try case-insensitive search
    if (!admin) {
      admin = await adminCollection.findOne({
        email: { $regex: `^${escapeRegex(email.trim())}$`, $options: "i" }
      });
    }

    if (!admin) {
      return res.status(401).json({ ok: false, error: "Invalid email or password" });
    }

    // Check if password field exists and is a valid bcrypt hash
    if (!admin.password) {
      return res.status(500).json({ ok: false, error: "Account configuration error" });
    }

    if (!admin.password.startsWith('$2a$') && !admin.password.startsWith('$2b$') && !admin.password.startsWith('$2y$')) {
      return res.status(500).json({ ok: false, error: "Account configuration error" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ ok: false, error: "Invalid email or password" });
    }

    const { password: _, ...safeAdmin } = admin;
    return res.json({ ok: true, admin: safeAdmin });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down...");
  if (mongoClient) await mongoClient.close();
  process.exit(0);
});

// Start server
connectToMongo().then(() => {
  // Validate required environment variables
  const requiredEnvVars = ['MONGO_URI', 'RECAPTCHA_SECRET_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    console.error('Please set these in your Render environment variables.');
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Admin Login API Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`📊 Database: Connected`);
  });
}).catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});