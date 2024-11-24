const pool = require("./Database"); // Import the database connection
const bcrypt = require('bcryptjs');

// Login route to check credentials
exports.login = async (req, res) => {
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
};

// Example inventory route (GET) to retrieve inventory items
exports.inventory = async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM inventory");
        res.json(rows);
        conn.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// ADD ITEM ROUTE (new)
exports.addItem = async (req, res) => {
    const { item_name, item_price, quantity } = req.body;
    console.log(`[POST /add-item] Adding item: ${item_name}, Quantity: ${quantity}`);

    try {
        const conn = await pool.getConnection();
        
        // Insert the new item into the inventory table
        const result = await conn.query(
            "INSERT INTO inventory (item_name, item_price, quantity) VALUES (?, ?, ?)", 
            [item_name, item_price, quantity]
        );
        
        console.log(`Item added: ${item_name}, Price: ${item_price}, Quantity: ${quantity}`);
        res.json({ message: 'Item added successfully!' });

        conn.release();
    } catch (err) {
        console.error(`[POST /add-item] Error adding item:`, err);
        res.status(500).json({ error: 'Failed to add item' });
    }
};

// DELETE ITEM ROUTE (Admin Only)
exports.deleteItem = async (req, res) => {
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
};

exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    
    console.log(`Received UPDATE request to update item with ID: ${id}`); // Added log to confirm route is hit

    try {
        const conn = await pool.getConnection();
        const result = await conn.query("UPDATE inventory SET quantity = ? WHERE id = ?", [quantity, id]);
        conn.release();

        if (result.affectedRows > 0) {
            console.log(`Item with ID ${id} updated successfully.`); // Log successful update
            res.json({ message: 'Item updated successfully!' });
        } else {
            console.log(`Item with ID ${id} not found in the database.`); // Log not found
            res.status(404).json({ error: 'Item not found.' });
        }
    } catch (err) {
        console.error(`[PATCH /update-item/:id] Error updating item:`, err);
        res.status(500).json({ error: 'Failed to update item' });
    }

}
