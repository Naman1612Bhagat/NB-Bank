const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { query } = require('../config/db');

// Create Account
router.post('/create', protect, async (req, res) => {
    const { accountType, initialBalance } = req.body;

    try {
        if (!['Savings', 'Current'].includes(accountType)) {
            return res.status(400).json({ message: "Invalid account type" });
        }
        
        // Insert account
        const result = await query(
            `INSERT INTO Accounts (user_id, account_type, balance) VALUES ($1, $2, $3) RETURNING id`,
            [req.user.id, accountType, initialBalance || 0]
        );

        res.status(201).json({
            message: "Account created successfully",
            accountId: result.rows[0].id,
            accountType,
            balance: initialBalance || 0
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get User Accounts
router.get('/', protect, async (req, res) => {
    try {
        const result = await query(
            `SELECT id, account_type, balance, created_at FROM Accounts WHERE user_id = $1`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
