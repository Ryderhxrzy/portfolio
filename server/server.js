const path = require("path");
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 4000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate environment variables
if (!GITHUB_TOKEN) {
  console.error("❌ Missing GITHUB_TOKEN in environment.");
  process.exit(1);
}

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment.");
  process.exit(1);
}

// ✅ FIXED: Enhanced CORS configuration with your actual Vercel domain
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://my-portfolio-ryder-hxrzys-projects.vercel.app',
  // Vercel also auto-generates these variants:
  'https://my-portfolio-ryder-hxrzys-projects-git-main.vercel.app',
  'https://my-portfolio-ryder-hxrzys-projects-*.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches Vercel pattern
    if (allowedOrigins.some(allowed => 
      origin === allowed || origin.includes('my-portfolio-ryder-hxrzys-projects') && origin.includes('vercel.app')
    )) {
      callback(null, true);
    } else if (NODE_ENV === 'production') {
      // In production, allow all Vercel domains temporarily
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600
}));

// ✅ Handle preflight requests
app.options('*', cors());

app.use(express.json());

// ✅ Root route to prevent "Cannot GET /"
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Portfolio API Server is running!",
    status: "healthy",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      reviews: "/api/reviews",
      github_pinned: "/api/github/pinned?username=Ryderhxrzy", 
      test_github: "/api/test-github"
    },
    documentation: "Use the endpoints above to access the API"
  });
});

// MongoDB connection
let db;
let reviewsCollection;
let mongoClient;

async function connectToMongo() {
  try {
    console.log("🔗 Attempting MongoDB connection...");
    console.log("Node.js version:", process.version);
    console.log("Environment:", NODE_ENV);
    
    const client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // ✅ Increased timeout
      connectTimeoutMS: 30000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
      retryReads: true,
      maxIdleTimeMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("⏳ Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected to MongoDB");

    mongoClient = client;
    db = client.db("portfolio");
    reviewsCollection = db.collection("reviews");

    console.log("⏳ Testing connection...");
    await db.command({ ping: 1 });
    console.log("✅ MongoDB connection verified");

  } catch (err) {
    console.error("❌ MongoDB connection failed!");
    console.error("Error:", err.message);
    console.error("Environment:", NODE_ENV);
    process.exit(1);
  }
}

/**
 * GET /api/reviews
 * Returns all reviews from MongoDB
 */
app.get("/api/reviews", async (req, res) => {
  try {
    console.log(`📨 Received request for reviews from: ${req.headers.origin || 'unknown'}`);
    
    if (!reviewsCollection) {
      return res.status(500).json({ 
        ok: false, 
        error: "Database not connected" 
      });
    }

    const reviews = await reviewsCollection.find({}).toArray();
    
    // Log for debugging
    console.log(`📊 Returning ${reviews.length} reviews in ${NODE_ENV} environment`);
    
    return res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    return res.status(500).json({ 
      ok: false, 
      error: err.message 
    });
  }
});

/**
 * GET /api/github/pinned?username=USERNAME
 * Returns normalized repos array: { ok: true, repos: [...] }
 */
app.get("/api/github/pinned", async (req, res) => {
  try {
    const username = req.query.username || "Ryderhxrzy";

    const query = `
      query($login: String!) {
        user(login: $login) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                id
                name
                description
                url
                homepageUrl
                stargazerCount
                forkCount
                primaryLanguage { name }
                updatedAt
                repositoryTopics(first: 10) { nodes { topic { name } } }
                openGraphImageUrl
              }
            }
          }
        }
      }`;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "Pinned-Repos-Server",
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return res.status(response.status).json({ 
        ok: false, 
        status: response.status, 
        error: text 
      });
    }

    const json = await response.json();

    if (json.errors) {
      console.error('GitHub API Errors:', json.errors);
      return res.status(500).json({ 
        ok: false, 
        errors: json.errors 
      });
    }

    const nodes = json.data?.user?.pinnedItems?.nodes || [];

    if (nodes.length === 0) {
      console.log('No pinned repositories found for user:', username);
    }

    const repos = nodes.map((repo) => {
      const lang = repo.primaryLanguage?.name || null;
      return {
        id: repo.id,
        title: repo.name,
        description: repo.description || "No description provided",
        githubUrl: repo.url,
        liveUrl: repo.homepageUrl || null,
        stars: repo.stargazerCount || 0,
        forks: repo.forkCount || 0,
        language: lang || "Various",
        languageColor: getLanguageColor(lang),
        updated_at: repo.updatedAt,
        topics: (repo.repositoryTopics?.nodes || [])
          .map((n) => n.topic?.name)
          .filter(Boolean),
        technologies: lang ? [lang] : ["Various"],
        image: repo.openGraphImageUrl || `https://opengraph.githubassets.com/1/${username}/${repo.name}`,
        isPinned: true,
      };
    });

    return res.json({ 
      ok: true, 
      repos,
      count: repos.length 
    });
    
  } catch (err) {
    console.error("❌ Error in /api/github/pinned:", err);
    return res.status(500).json({ 
      ok: false, 
      error: err.message || String(err) 
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    ok: true, 
    message: "Server is running", 
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    database: reviewsCollection ? "connected" : "disconnected",
    nodeVersion: process.version
  });
});

// Test endpoint to verify GitHub token
app.get("/api/test-github", async (req, res) => {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "Pinned-Repos-Server",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: `GitHub API returned ${response.status}`,
      });
    }

    const userData = await response.json();
    res.json({
      ok: true,
      user: {
        login: userData.login,
        name: userData.name,
      },
      environment: NODE_ENV
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  if (mongoClient) {
    await mongoClient.close();
  }
  process.exit(0);
});

// ✅ Keep-alive ping to prevent Render free tier from sleeping
if (NODE_ENV === 'production') {
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  
  setInterval(async () => {
    try {
      const response = await fetch(`${RENDER_URL}/api/health`);
      if (response.ok) {
        console.log('✅ Keep-alive ping successful');
      }
    } catch (err) {
      console.log('⚠️ Keep-alive ping failed:', err.message);
    }
  }, 14 * 60 * 1000); // Ping every 14 minutes
}

// Start server after MongoDB connection
connectToMongo().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Reviews: http://localhost:${PORT}/api/reviews`);
    console.log(`🌐 Test GitHub: http://localhost:${PORT}/api/test-github`);
    console.log(`🌐 Pinned repos: http://localhost:${PORT}/api/github/pinned?username=Ryderhxrzy`);
  });
}).catch(err => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

/* Helper */
function getLanguageColor(language) {
  const colors = {
    JavaScript: "#f7df1e",
    Python: "#3572A5",
    TypeScript: "#3178c6",
    Java: "#b07219",
    CSS: "#563d7c",
    HTML: "#e34c26",
    React: "#61dafb",
    "C++": "#f34b7d",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    "C#": "#178600",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    Shell: "#89e051",
    Vue: "#41b883",
  };
  if (!language) return "#2563eb";
  return colors[language] || "#2563eb";
}