require("dotenv").config();

const express = require("express");
const { z } = require("zod");

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Security
app.disable("x-powered-by");

// Body parser
app.use(express.json());

// In-memory storage
const users = new Map();

// Validation schema
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

// Health
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Root
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// POST /users — ab validation ke saath
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

  // Abhi validation ke baad bhi sirf skeleton response
  // (storage/duplicate/idempotency next actions me)
  return res.status(201).json({
    message: "user endpoint coming soon",
    validatedData: result.data,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} (env: ${NODE_ENV})`);
});
