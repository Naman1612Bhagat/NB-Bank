const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function connectDB() {
    try {
        const client = await pool.connect();
        console.log("Connected to PostgreSQL Database successfully");
        client.release();
    } catch (err) {
        console.error("Error connecting to PostgreSQL DB:", err);
        process.exit(1);
    }
}

// Function to execute a query (replaces getConnection().execute)
// Using this helper method so we don't have to rewrite every `await connection.execute(...)` to `await pool.query(...)` completely
async function query(text, params) {
    return await pool.query(text, params);
}

// Function to get a connection client from the pool (if transactions are needed)
async function getConnection() {
    return await pool.connect();
}

module.exports = { connectDB, query, getConnection, pool };
