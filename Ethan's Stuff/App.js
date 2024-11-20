const express = require("express");
//const cors = require('cors');

const Routes = require("./Routes");

const app = express();
const PORT = 3000;

// Middleware for parsing URL-encoded and JSON data
app.use(express.json());
app.use(express.static(__dirname));

/* Currently not using cors
// Enable CORS for your frontend (localhost:5500 in this case)
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Adjust this if your frontend URL is different
}));
*/

// Serve static files (like your HTML)
app.use(express.static("inventory-system"));

// Use routes
app.use(Routes);

// Serve the frontend (HTML file)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require("express");
//const cors = require('cors');

const Routes = require("./Routes");

const app = express();
const PORT = 3000;

// Middleware for parsing URL-encoded and JSON data
app.use(express.json());
app.use(express.static(__dirname));

/* Currently not using cors
// Enable CORS for your frontend (localhost:5500 in this case)
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Adjust this if your frontend URL is different
}));
*/

// Serve static files (like your HTML)
app.use(express.static("inventory-system"));

// Use routes
app.use(Routes);

// Serve the frontend (HTML file)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

