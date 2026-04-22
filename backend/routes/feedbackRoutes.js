const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// Submit Feedback
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        // Insert feedback
        await query(
            `INSERT INTO Feedbacks (name, email, subject, message) VALUES ($1, $2, $3, $4)`,
            [name, email, subject, message]
        );

        res.status(201).json({ message: "Feedback submitted successfully" });

    } catch (err) {
        console.error("Feedback error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get Latest 3 Feedbacks (if ever needed again, currently Reviews are used on Home page)
router.get('/latest', async (req, res) => {
    try {
        const result = await query(
            `SELECT name, message, created_at 
             FROM Feedbacks 
             ORDER BY created_at DESC 
             LIMIT 3`
        );

        res.json(result.rows);

    } catch (err) {
        console.error("Fetch latest feedbacks error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
