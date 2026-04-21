const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');

// Submit Feedback
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;
    let connection;

    try {
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Please provide name, email, and message" });
        }

        connection = await getConnection();
        
        // Insert feedback
        await connection.execute(
            `INSERT INTO Feedbacks (name, email, subject, message) VALUES (:name, :email, :subject, :message)`,
            {
                name,
                email,
                subject: subject || null,
                message
            },
            { autoCommit: true }
        );

        res.status(201).json({ message: "Feedback submitted successfully" });

    } catch (err) {
        console.error("Feedback error:", err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Get Latest Feedback
router.get('/latest', async (req, res) => {
    let connection;

    try {
        connection = await getConnection();
        
        // Fetch the 3 most recent feedbacks
        const result = await connection.execute(
            `SELECT * FROM (
                SELECT name, message, created_at 
                FROM Feedbacks 
                ORDER BY created_at DESC
            ) WHERE ROWNUM <= 3`,
            [],
            { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
        );

        res.json(result.rows);

    } catch (err) {
        console.error("Fetch feedback error:", err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
