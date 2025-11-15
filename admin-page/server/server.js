const path = require("path");
const express = require("express");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

// Keep your dotenv path config
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  if (req.method === "OPTIONS") return res.sendStatus(200);
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
    database: adminCollection ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Helper function to escape regex special characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Admin login - SECURE VERSION
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password, recaptchaToken } = req.body;
    console.log("🔐 Login attempt for:", email);

    if (!email || !password) {
      console.log("❌ Missing credentials");
      return res.status(400).json({ ok: false, error: "Email and password required" });
    }

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      console.log("❌ Missing reCAPTCHA token");
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
        console.log("❌ reCAPTCHA verification failed");
        return res.status(400).json({ ok: false, error: "reCAPTCHA verification failed" });
      }

      console.log("✅ reCAPTCHA verified successfully");
    } catch (recaptchaError) {
      console.error("❌ reCAPTCHA verification error:", recaptchaError);
      return res.status(500).json({ ok: false, error: "Failed to verify reCAPTCHA" });
    }

    // Trim and normalize email
    const normalizedEmail = email.trim().toLowerCase();
    console.log("📧 Normalized email:", normalizedEmail);

    // Try both methods: direct match and case-insensitive regex
    let admin = await adminCollection.findOne({
      email: normalizedEmail
    });

    // If not found, try case-insensitive search
    if (!admin) {
      console.log("🔍 Trying case-insensitive search...");
      admin = await adminCollection.findOne({
        email: { $regex: `^${escapeRegex(email.trim())}$`, $options: "i" }
      });
    }

    console.log("👤 Admin found:", admin ? "YES" : "NO");
    
    if (admin) {
      console.log("📝 Admin email in DB:", admin.email);
      console.log("🔑 Password hash exists:", !!admin.password);
      console.log("🔑 Hash starts with:", admin.password ? admin.password.substring(0, 7) : "N/A");
    }

    if (!admin) {
      console.log("❌ No admin found with email:", email);
      return res.status(401).json({ ok: false, error: "Invalid email or password" });
    }

    // Check if password field exists and is a valid bcrypt hash
    if (!admin.password) {
      console.log("❌ Admin account has no password field");
      return res.status(500).json({ ok: false, error: "Account configuration error" });
    }

    if (!admin.password.startsWith('$2a$') && !admin.password.startsWith('$2b$') && !admin.password.startsWith('$2y$')) {
      console.log("❌ Password is not a valid bcrypt hash");
      return res.status(500).json({ ok: false, error: "Account configuration error" });
    }

    console.log("🔑 Comparing passwords...");
    console.log("Input password length:", password.length);
    console.log("Stored hash:", admin.password);

    const isMatch = await bcrypt.compare(password, admin.password);
    
    console.log("🔓 Password match:", isMatch ? "YES ✅" : "NO ❌");

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ ok: false, error: "Invalid email or password" });
    }

    console.log("✅ Login successful for:", email);

    const { password: _, ...safeAdmin } = admin;
    return res.json({ ok: true, admin: safeAdmin });
  } catch (err) {
    console.error("❌ Admin login error:", err);
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
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});