require("dotenv").config();

const express = require("express");

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Security
app.disable("x-powered-by");

// Body parser — JSON requests ke liye
app.use(express.json());

// In-memory storage (temporary — DB baad me aayega)
const users = new Map();

// Health check (production me load balancer isse puchhta hai)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Root — sanity check
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// POST /users — abhi skeleton, logic next action me
app.post("/users", (req, res) => {
  res.status(201).json({
    message: "user endpoint coming soon",
    receivedBody: req.body,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} (env: ${NODE_ENV})`);
});
