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
    host: 'localhost',
    user: 'app_user',
    password: 'app_password',
    database: 'inventory_system',
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
                console.log(`User logged in: ${username}, Role: ${user.role}`);
                res.json({ role: user.role, success: true });
            } else {
                console.log(`Failed login attempt: ${username} (Invalid password)`);
                res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            console.log(`Failed login attempt: ${username} (User not found)`);
            res.status(404).json({ message: 'User not found' });
        }

        conn.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Example inventory route (GET) to retrieve inventory items
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

// ADD ITEM ROUTE (new)
app.post('/add-item', async (req, res) => {
    const { item_name, quantity } = req.body;
    console.log(`[POST /add-item] Adding item: ${item_name}, Quantity: ${quantity}`);

    try {
        const conn = await pool.getConnection();
        
        // Insert the new item into the inventory table
        const result = await conn.query(
            "INSERT INTO inventory (item_name, quantity) VALUES (?, ?)", 
            [item_name, quantity]
        );
        
        console.log(`Item added: ${item_name}, Quantity: ${quantity}`);
        res.json({ message: 'Item added successfully!' });

        conn.release();
    } catch (err) {
        console.error(`[POST /add-item] Error adding item:`, err);
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// DELETE ITEM ROUTE (Admin Only)
app.delete('/delete-item/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Received DELETE request to delete item with ID: ${id}`); // Added log to confirm route is hit

    try {
        const conn = await pool.getConnection();
        const result = await conn.query("DELETE FROM inventory WHERE id = ?", [id]);
        conn.release();

        if (result.affectedRows > 0) {
            console.log(`Item with ID ${id} deleted successfully.`); // Log successful deletion
            res.json({ message: 'Item deleted successfully!' });
        } else {
            console.log(`Item with ID ${id} not found in the database.`); // Log not found
            res.status(404).json({ error: 'Item not found.' });
        }
    } catch (err) {
        console.error(`[DELETE /delete-item/:id] Error deleting item:`, err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

