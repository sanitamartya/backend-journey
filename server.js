require("dotenv").config();

const express = require("express");
const crypto = require("node:crypto");
const { z } = require("zod");

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.disable("x-powered-by");
app.use(express.json());

const users = new Map();

const createUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Email must be a valid email address"),
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be at most 100 characters"),
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/users", (req, res) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const { email, name } = result.data;

  // Duplicate check
  if (users.has(email)) {
    return res.status(409).json({
      error: "Conflict",
      message: "An account with this email already exists",
    });
  }

  // Naya user
  const user = {
    id: crypto.randomUUID(),
    email,
    name,
    createdAt: new Date().toISOString(),
  };

  users.set(email, user);

  return res.status(201).json(user);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} (env: ${NODE_ENV})`);
});
