const path = require("path");
const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 4000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate environment variables
if (!GITHUB_TOKEN) {
  console.error("❌ Missing GITHUB_TOKEN");
  process.exit(1);
}

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI");
  process.exit(1);
}

// ✅✅✅ CRITICAL: CORS MUST BE ABSOLUTE FIRST THING ✅✅✅
// This MUST come before express.json() and ALL routes
app.use((req, res, next) => {
  // ALWAYS set these headers for EVERY request
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Log request
  console.log(`${req.method} ${req.path} from ${req.headers.origin || 'direct'}`);
  
  // Handle preflight immediately
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS preflight - returning 200');
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// MongoDB connection
let db;
let reviewsCollection;
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
    db = client.db("portfolio");
    reviewsCollection = db.collection("reviews");
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
    message: "🚀 Portfolio API Server is running!",
    status: "healthy",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    cors: "ENABLED - All origins allowed (*)",
    endpoints: {
      health: "/api/health",
      reviews: "/api/reviews",
      github_pinned: "/api/github/pinned?username=Ryderhxrzy",
      test_github: "/api/test-github"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    ok: true,
    message: "Server healthy",
    cors: "enabled (*)",
    database: reviewsCollection ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// Get reviews
app.get("/api/reviews", async (req, res) => {
  try {
    console.log("📊 Fetching reviews");
    
    if (!reviewsCollection) {
      return res.status(500).json({ ok: false, error: "Database not connected" });
    }

    const reviews = await reviewsCollection.find({}).toArray();
    console.log(`✅ Returning ${reviews.length} reviews`);
    
    return res.json(reviews);
  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Get GitHub pinned repos
app.get("/api/github/pinned", async (req, res) => {
  try {
    const username = req.query.username || "Ryderhxrzy";
    console.log(`📊 GitHub repos for: ${username}`);

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
        "User-Agent": "Portfolio-Server",
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return res.status(response.status).json({ ok: false, error: text });
    }

    const json = await response.json();

    if (json.errors) {
      console.error('GitHub errors:', json.errors);
      return res.status(500).json({ ok: false, errors: json.errors });
    }

    const nodes = json.data?.user?.pinnedItems?.nodes || [];
    const repos = nodes.map((repo) => {
      const lang = repo.primaryLanguage?.name || null;
      return {
        id: repo.id,
        title: repo.name,
        description: repo.description || "No description",
        githubUrl: repo.url,
        liveUrl: repo.homepageUrl || null,
        stars: repo.stargazerCount || 0,
        forks: repo.forkCount || 0,
        language: lang || "Various",
        languageColor: getLanguageColor(lang),
        updated_at: repo.updatedAt,
        topics: (repo.repositoryTopics?.nodes || []).map((n) => n.topic?.name).filter(Boolean),
        technologies: lang ? [lang] : ["Various"],
        image: repo.openGraphImageUrl || `https://opengraph.githubassets.com/1/${username}/${repo.name}`,
        isPinned: true,
      };
    });

    console.log(`✅ Returning ${repos.length} repos`);
    return res.json({ ok: true, repos, count: repos.length });
  } catch (err) {
    console.error("❌ GitHub error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Test GitHub token
app.get("/api/test-github", async (req, res) => {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "Portfolio-Server",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ ok: false, error: `Status ${response.status}` });
    }

    const userData = await response.json();
    res.json({ ok: true, user: { login: userData.login, name: userData.name } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down...');
  if (mongoClient) await mongoClient.close();
  process.exit(0);
});

// Keep-alive for Render
if (NODE_ENV === 'production') {
  setInterval(async () => {
    try {
      await fetch('https://portfolio-oftk.onrender.com/api/health');
      console.log('✅ Keep-alive');
    } catch (err) {
      console.log('⚠️ Keep-alive failed');
    }
  }, 14 * 60 * 1000);
}

// Start server
connectToMongo().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════╗
║  ✅ SERVER RUNNING                   ║
║  Port: ${PORT}                       ║
║  Environment: ${NODE_ENV}            ║
║  CORS: ENABLED (*)                   ║
╚═══════════════════════════════════════╝
    `);
  });
}).catch(err => {
  console.error("❌ Failed to start:", err);
  process.exit(1);
});

function getLanguageColor(language) {
  const colors = {
    JavaScript: "#f7df1e", Python: "#3572A5", TypeScript: "#3178c6",
    Java: "#b07219", CSS: "#563d7c", HTML: "#e34c26", React: "#61dafb",
    "C++": "#f34b7d", PHP: "#4F5D95", Ruby: "#701516", Go: "#00ADD8",
    Rust: "#dea584", "C#": "#178600", Swift: "#ffac45", Kotlin: "#F18E33",
    Shell: "#89e051", Vue: "#41b883",
  };
  return colors[language] || "#2563eb";
}