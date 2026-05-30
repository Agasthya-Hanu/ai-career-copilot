const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// SIGNUP
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }

  return res.json({
    message: "Signup successful",
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }

  const user = {
    id: Date.now(),
    email,
  };

  const token = jwt.sign(user, "secret123", {
    expiresIn: "1d",
  });

  return res.json({
    message: "Login successful",
    token,
  });
});

module.exports = router;