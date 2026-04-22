const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// Submit Review
router.post('/', async (req, res) => {
    const { name, rating, comment } = req.body;

    try {
        if (!name || !rating || !comment) {
            return res.status(400).json({ message: "Please provide name, rating, and comment" });
        }

        // Insert review
        await query(
            `INSERT INTO Reviews (name, rating, comment_text) VALUES ($1, $2, $3)`,
            [name, rating, comment]
        );

        res.status(201).json({ message: "Review submitted successfully" });

    } catch (err) {
        console.error("Review error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get Latest 3 Reviews (for Home Page)
router.get('/latest', async (req, res) => {
    try {
        const result = await query(
            `SELECT name, rating, comment_text, created_at 
             FROM Reviews 
             ORDER BY created_at DESC 
             LIMIT 3`
        );

        res.json(result.rows);

    } catch (err) {
        console.error("Fetch latest reviews error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get All Reviews (for Reviews Page)
router.get('/', async (req, res) => {
    try {
        const result = await query(
            `SELECT name, rating, comment_text, created_at 
             FROM Reviews 
             ORDER BY created_at DESC`
        );

        res.json(result.rows);

    } catch (err) {
        console.error("Fetch all reviews error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
