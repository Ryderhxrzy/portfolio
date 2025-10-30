const path = require("path");
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 4000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

// Validate environment variables
if (!GITHUB_TOKEN) {
  console.error("❌ Missing GITHUB_TOKEN in environment.");
  process.exit(1);
}

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment.");
  process.exit(1);
}

app.use(cors({ origin: true }));
app.use(express.json());

// MongoDB connection
let db;
let reviewsCollection;
let mongoClient;

async function connectToMongo() {
  try {
    console.log("🔗 Attempting MongoDB connection...");
    console.log("Node.js version:", process.version);
    
    // Enhanced connection options for Render.com
    const client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
      retryReads: true,
      maxIdleTimeMS: 10000,
      socketTimeoutMS: 20000,
    });

    console.log("⏳ Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected to MongoDB");

    mongoClient = client;
    db = client.db("portfolio");
    reviewsCollection = db.collection("reviews");

    // Test the connection
    console.log("⏳ Testing connection...");
    await db.command({ ping: 1 });
    console.log("✅ MongoDB connection verified");

  } catch (err) {
    console.error("❌ MongoDB connection failed!");
    console.error("Error:", err.message);
    console.error("Error details:", {
      name: err.name,
      code: err.code
    });
    
    console.log("\n🔧 Troubleshooting steps:");
    console.log("1. Check MongoDB Atlas Network Access → Add 0.0.0.0/0");
    console.log("2. Verify database user has correct permissions");
    console.log("3. Ensure connection string in Render.com environment variables is correct");
    console.log("4. Try creating a new database user in MongoDB Atlas");
    
    process.exit(1);
  }
}

// Routes
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
      error: err.message 
    });
  }
});

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
      return res.status(response.status).json({ 
        ok: false, 
        error: `GitHub API returned ${response.status}` 
      });
    }

    const json = await response.json();
    
    if (json.errors) {
      return res.status(500).json({ 
        ok: false, 
        errors: json.errors 
      });
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
        topics: (repo.repositoryTopics?.nodes || [])
          .map((n) => n.topic?.name)
          .filter(Boolean),
        technologies: lang ? [lang] : ["Various"],
        image: repo.openGraphImageUrl || `https://opengraph.githubassets.com/1/${username}/${repo.name}`,
        isPinned: true,
      };
    });

    return res.json({ ok: true, repos, count: repos.length });
  } catch (err) {
    console.error("❌ Error in /api/github/pinned:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    ok: true, 
    message: "Server is running", 
    timestamp: new Date().toISOString(),
    database: reviewsCollection ? "connected" : "disconnected",
    nodeVersion: process.version
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  if (mongoClient) {
    await mongoClient.close();
  }
  process.exit(0);
});

// Start server
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  });
}).catch(err => {
  console.error("❌ Failed to start server:", err);
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