const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'app_user',
    password: 'app_password',
    database: 'inventory_system'
});

async function testConnection() {
    try {
        const conn = await pool.getConnection();
        console.log("Database connection successful!");
        conn.release();
    } catch (err) {
        console.error("Database connection failed:", err);
    }
}

testConnection();
