const express = require("express");
const Routes = require("./Routes");

const app = express();
const PORT = 3000;

// Middleware for parsing URL-encoded and JSON data
app.use(express.json());

// Serve static files (like your HTML)
app.use(express.static("Project"));

// Use routes
app.use("/api", Routes);

// Serve the frontend (HTML file)
app.get("/", (req, res) => {
    // Serve the index.html file when the root URL is accessed
    res.sendFile(__dirname + "/ManageUsers.html");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

