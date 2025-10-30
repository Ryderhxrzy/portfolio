const path = require("path");
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 4000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

if (!GITHUB_TOKEN) {
  console.error("❌ Missing GITHUB_TOKEN in environment. Add it to the root .env file.");
  process.exit(1);
}

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment. Add it to the root .env file.");
  process.exit(1);
}

app.use(
  cors({
    origin: true,
  })
);
app.use(express.json());

// MongoDB connection
let db;
let reviewsCollection;
let mongoClient;

async function connectToMongo() {
  try {
    console.log("🔗 Attempting MongoDB connection...");
    
    const client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
    });
    
    await client.connect();
    console.log("✅ Connected to MongoDB");
    
    mongoClient = client;
    db = client.db("portfolio");
    reviewsCollection = db.collection("reviews");
    
    // Test the connection
    await db.command({ ping: 1 });
    console.log("✅ MongoDB connection verified");
    
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("Full error:", err);
    process.exit(1);
  }
}

/**
 * GET /api/reviews
 * Returns all reviews from MongoDB
 */
app.get("/api/reviews", async (req, res) => {
  try {
    if (!reviewsCollection) {
      return res.status(500).json({ 
        ok: false, 
        error: "Database not connected" 
      });
    }

    const reviews = await reviewsCollection.find({}).toArray();
    
    return res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    return res.status(500).json({ 
      ok: false, 
      error: err.message || String(err) 
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
    timestamp: new Date().toISOString(),
    database: reviewsCollection ? "connected" : "disconnected"
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

// Start server after MongoDB connection
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
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