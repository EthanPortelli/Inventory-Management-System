const express = require('express');
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());

// Enable CORS for your frontend (localhost:5500 in this case)
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Adjust this if your frontend URL is different
}));

// MariaDB connection pool
const pool = mariadb.createPool({
    host: 'localhost',    // MariaDB server address
    user: 'app_user',         // Your MariaDB username
    password: 'app_password',  // Your MariaDB password
    database: 'inventory_system',  // Your database name (ensure it's correct)
    connectionLimit: 10
});

// Login route to check credentials
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE username = ?", [username]);

        if (rows.length > 0) {
            const user = rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                res.json({ role: user.role, success: true });
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }

        conn.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Example inventory route (you can modify or add more routes as needed)
app.get('/inventory', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM inventory");
        res.json(rows);
        conn.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

