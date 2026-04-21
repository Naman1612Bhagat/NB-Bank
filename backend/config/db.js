const oracledb = require('oracledb');
require('dotenv').config();

// Enable Thick mode for Oracle 11g compatibility using local Oracle XE installation
try {
    oracledb.initOracleClient({ libDir: 'C:\\oraclexe\\app\\oracle\\product\\11.2.0\\server\\bin' });
    console.log("Oracle Client initialized in Thick mode.");
} catch (err) {
    console.error("Failed to initialize Oracle Client Thick mode:", err);
}

// Ensure the db config handles both cloud wallet and local connections
async function connectDB() {
    try {
        await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING
        });
        console.log("Connected to Oracle Database successfully");
    } catch (err) {
        console.error("Error connecting to Oracle DB:", err);
        process.exit(1);
    }
}

// Function to get a connection from the pool
async function getConnection() {
    return await oracledb.getConnection();
}

module.exports = { connectDB, getConnection, oracledb };
