const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// IMPORT RESUME ROUTES
const resumeRoutes = require("./routes/resumeRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/resume", resumeRoutes);

// CONNECT RESUME ROUTES
app.use("/api/resume", resumeRoutes);

// Temporary in-memory database
let users = [];

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Backend Working");
});

// SIGNUP ROUTE
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  // HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
  };

  users.push(newUser);

  res.json({
    message: "Signup successful",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

// LOGIN ROUTE
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  // CHECK PASSWORD
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  // GENERATE JWT TOKEN
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    "secretkey",
    {
      expiresIn: "1h",
    }
  );

  res.json({
    message: "Login successful",
    token,
  });
});

// AUTH MIDDLEWARE
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secretkey");

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

// PROTECTED PROFILE ROUTE
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected profile data",
    user: req.user,
  });
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});