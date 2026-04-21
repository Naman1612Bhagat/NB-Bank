const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');

// Submit Review
router.post('/', async (req, res) => {
    const { name, rating, comment } = req.body;
    let connection;

    try {
        if (!name || !rating || !comment) {
            return res.status(400).json({ message: "Please provide name, rating, and comment" });
        }

        connection = await getConnection();
        
        // Insert review
        await connection.execute(
            `INSERT INTO Reviews (name, rating, comment_text) VALUES (:name, :rating, :comment_text)`,
            {
                name,
                rating,
                comment_text: comment
            },
            { autoCommit: true }
        );

        res.status(201).json({ message: "Review submitted successfully" });

    } catch (err) {
        console.error("Review error:", err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Get Latest 3 Reviews (for Home Page)
router.get('/latest', async (req, res) => {
    let connection;

    try {
        connection = await getConnection();
        
        const result = await connection.execute(
            `SELECT * FROM (
                SELECT name, rating, comment_text, created_at 
                FROM Reviews 
                ORDER BY created_at DESC
            ) WHERE ROWNUM <= 3`,
            [],
            { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
        );

        res.json(result.rows);

    } catch (err) {
        console.error("Fetch latest reviews error:", err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Get All Reviews (for Reviews Page)
router.get('/', async (req, res) => {
    let connection;

    try {
        connection = await getConnection();
        
        const result = await connection.execute(
            `SELECT name, rating, comment_text, created_at 
             FROM Reviews 
             ORDER BY created_at DESC`,
            [],
            { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
        );

        res.json(result.rows);

    } catch (err) {
        console.error("Fetch all reviews error:", err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
