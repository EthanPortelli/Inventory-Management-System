const pool = require("./Database"); // Import the database connection

// API Route: Add a new user to the database
exports.addUser = async (req, res) => {
    const { name, age } = req.body; // Extract name and age from the request body

    // Validate input
    if (!name || !age) {
        return res.status(400).send("Name and age are required"); // Return error if input is invalid
    }

    try {
        // Get a connection from the pool and execute the INSERT query
        const connection = await pool.getConnection();
        const result = await connection.query(
            "INSERT INTO users (name, age) VALUES (?, ?)",
            [name, age]
        );
        connection.release(); // Release the connection back to the pool

        res.status(201).send(`User added with ID: ${result.insertId}`); // Respond with the new user's ID
    } catch (err) {
        // Handle database errors
        res.status(500).send("Error adding user: " + err.message);
    }
};

