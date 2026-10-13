const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3002;

app.use(cors({ origin: "*" }));
app.use(express.json());

// Mock database
let mockUser = {
  _id: "66b1a2c3d4e5f67890123456",
  username: "alokkumar",
  email: "alok@example.com"
};

let mockRepos = [
  {
    _id: "repo-1",
    name: "CODEVAULT",
    description: "A GitHub-like version control system built with Node.js and MongoDB.",
    visibility: true
  },
  {
    _id: "repo-2",
    name: "my-sandbox",
    description: "Interactive playground testing custom Git engine.",
    visibility: true
  },
  {
    _id: "repo-3",
    name: "developer-portfolio",
    description: "Personal developer showcase and project demos.",
    visibility: false
  }
];

// Auth routes
app.post("/login", (req, res) => {
  console.log("Login request received:", req.body);
  res.json({
    token: "mock-jwt-token-12345",
    userId: mockUser._id
  });
});

app.post("/signup", (req, res) => {
  console.log("Signup request received:", req.body);
  if (req.body.username) mockUser.username = req.body.username;
  if (req.body.email) mockUser.email = req.body.email;
  res.json({
    token: "mock-jwt-token-12345",
    userId: mockUser._id
  });
});

// User routes
app.get("/userProfile/:id", (req, res) => {
  res.json(mockUser);
});

// Repository routes
app.get("/repo/all", (req, res) => {
  res.json(mockRepos);
});

app.get("/repo/user/:userId", (req, res) => {
  res.json({
    message: "Repositories found!",
    repositories: mockRepos
  });
});

app.post("/repo/create", (req, res) => {
  const newRepo = {
    _id: "repo-" + Date.now(),
    name: req.body.name || "new-repo",
    description: req.body.description || "No description provided.",
    visibility: req.body.visibility !== false
  };
  mockRepos.unshift(newRepo);
  console.log("Created repository:", newRepo.name);
  res.status(201).json({ message: "Repository created!", repository: newRepo });
});

app.delete("/repo/delete/:id", (req, res) => {
  const { id } = req.params;
  mockRepos = mockRepos.filter(r => r._id !== id);
  console.log("Deleted repository:", id);
  res.json({ message: "Repository deleted successfully!" });
});

app.listen(PORT, () => {
  console.log(`Demo backend server is running on http://localhost:${PORT}`);
});
