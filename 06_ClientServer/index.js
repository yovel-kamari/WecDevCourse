const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, "client")));

// ROUTE: home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// ROUTE: about page
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});


app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
