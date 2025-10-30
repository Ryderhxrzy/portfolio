// server.js
const path = require("path");
const express = require("express");
const fetch = require("node-fetch"); // fine if you have node-fetch installed
const cors = require("cors");
const helmet = require("helmet"); // small security middleware
const rateLimit = require("express-rate-limit"); // optional but recommended
const { MongoClient } = require("mongodb");

// Load .env only in development (Render / production will use real environment variables)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 4000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || ""; // e.g. https://your-frontend.vercel.app
const BACKEND_URL = process.env.BACKEND_URL || "";   // optional, e.g. your Render URL

// Validate required envs (fail fast)
if (!GITHUB_TOKEN) {
  console.error("❌ Missing GITHUB_TOKEN in environment. Add it to Render env vars.");
  process.exit(1);
}
if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment. Add it to Render env vars.");
  process.exit(1);
}

// Basic security hardening
app.use(helmet());

// Basic rate limiting (adjust values as needed)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Configure CORS
const allowedOrigins = [];
if (FRONTEND_URL) allowedOrigins.push(FRONTEND_URL);

// allow local dev origin too (optional)
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173", "http://localhost:3000");
}

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) {
        // if no allowedOrigins provided, allow all (dev fallback) — but prefer explicit FRONTEND_URL
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy: The origin ${origin} is not allowed.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(express.json());

// MongoDB connection
let db;
let reviewsCollection;

async function connectToMongo() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    db = client.db("portfolio");
    reviewsCollection = db.collection("reviews");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

/* --- Routes --- */

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    database: reviewsCollection ? "connected" : "disconnected",
    backendUrl: BACKEND_URL || undefined,
  });
});

app.get("/api/reviews", async (req, res) => {
  try {
    if (!reviewsCollection) {
      return res.status(500).json({ ok: false, error: "Database not connected" });
    }
    const reviews = await reviewsCollection.find({}).toArray();
    return res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
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
      const text = await response.text().catch(() => "");
      return res.status(response.status).json({ ok: false, status: response.status, error: text });
    }

    const json = await response.json();

    if (json.errors) {
      console.error("GitHub API Errors:", json.errors);
      return res.status(500).json({ ok: false, errors: json.errors });
    }

    const nodes = json.data?.user?.pinnedItems?.nodes || [];

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
        topics: (repo.repositoryTopics?.nodes || []).map((n) => n.topic?.name).filter(Boolean),
        technologies: lang ? [lang] : ["Various"],
        image: repo.openGraphImageUrl || `https://opengraph.githubassets.com/1/${username}/${repo.name}`,
        isPinned: true,
      };
    });

    return res.json({ ok: true, repos, count: repos.length });
  } catch (err) {
    console.error("❌ Error in /api/github/pinned:", err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

app.get("/api/test-github", async (req, res) => {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "Pinned-Repos-Server",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ ok: false, error: `GitHub API returned ${response.status}` });
    }

    const userData = await response.json();
    res.json({ ok: true, user: { login: userData.login, name: userData.name } });
  } catch (err) {
    console.error("❌ Error in /api/test-github:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* --- Start server --- */
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
    if (BACKEND_URL) {
      console.log(`🌐 Health check: ${BACKEND_URL}/api/health`);
      console.log(`🌐 Pinned repos: ${BACKEND_URL}/api/github/pinned?username=Ryderhxrzy`);
    } else {
      console.log(`🌐 Health check: /api/health`);
    }
  });
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
