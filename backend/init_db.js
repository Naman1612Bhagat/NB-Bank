const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runSetup() {
    try {
        const sql = fs.readFileSync('./setup_pg.sql', 'utf8');
        await pool.query(sql);
        console.log("Database initialized successfully!");
    } catch (err) {
        console.error("Error initializing database:", err);
    } finally {
        await pool.end();
    }
}

runSetup();
