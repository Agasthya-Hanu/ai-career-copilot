const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// TEMP LOGIN (NO DB YET)
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const user = {
    id: Date.now(),
    email
  };

  const token = jwt.sign(user, "secret123", {
    expiresIn: "1d"
  });

  return res.json({
    message: "Login successful",
    token: token   // 🔥 MUST BE EXACTLY THIS
  });
});

module.exports = router;