const analyzeAI = (text) => {
  const lower = text.toLowerCase();

  let score = 50;

  const strengths = [];
  const weaknesses = [];
  const missing = [];

  // EXPERIENCE
  if (lower.includes("project")) {
    score += 10;
    strengths.push("Has project experience");
  } else {
    weaknesses.push("No projects mentioned");
    missing.push("Add 2–3 real-world projects");
  }

  // GITHUB
  if (lower.includes("github")) {
    score += 10;
    strengths.push("Has GitHub profile");
  } else {
    missing.push("Add GitHub profile link");
  }

  // INTERNSHIP
  if (lower.includes("intern")) {
    score += 15;
    strengths.push("Has internship experience");
  } else {
    missing.push("Add internship or freelance work");
  }

  // TECH STACK DEPTH
  const techKeywords = [
    "react",
    "node",
    "express",
    "mongodb",
    "sql",
    "python",
    "javascript"
  ];

  let techCount = 0;

  techKeywords.forEach((t) => {
    if (lower.includes(t)) techCount++;
  });

  score += techCount * 5;

  if (techCount < 3) {
    weaknesses.push("Weak technical stack mentioned");
    missing.push("Add more technologies (React, Node, DB etc.)");
  }

  // JOB ROLE PREDICTION
  let role = "General Developer";

  if (lower.includes("react") && lower.includes("javascript")) {
    role = "Frontend Developer";
  }

  if (lower.includes("node") || lower.includes("express")) {
    role = "Backend Developer";
  }

  if (lower.includes("react") && lower.includes("node")) {
    role = "Full Stack Developer";
  }

  return {
    score: Math.min(score, 100),
    role,
    strengths,
    weaknesses,
    missing
  };
};

module.exports = analyzeAI;