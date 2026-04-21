const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getConnection } = require('../config/db');

// Create Account
router.post('/create', protect, async (req, res) => {
    const { accountType, initialBalance } = req.body;
    let connection;

    try {
        if (!['Savings', 'Current'].includes(accountType)) {
            return res.status(400).json({ message: "Invalid account type" });
        }

        connection = await getConnection();
        
        // Insert account
        const result = await connection.execute(
            `INSERT INTO Accounts (user_id, account_type, balance) VALUES (:user_id, :account_type, :balance) RETURNING id INTO :id`,
            {
                user_id: req.user.id,
                account_type: accountType,
                balance: initialBalance || 0,
                id: { type: require('oracledb').NUMBER, dir: require('oracledb').BIND_OUT }
            },
            { autoCommit: true }
        );

        res.status(201).json({
            message: "Account created successfully",
            accountId: result.outBinds.id[0],
            accountType,
            balance: initialBalance || 0
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Get User Accounts
router.get('/', protect, async (req, res) => {
    let connection;

    try {
        connection = await getConnection();
        
        const result = await connection.execute(
            `SELECT id, account_type, balance, created_at FROM Accounts WHERE user_id = :user_id`,
            [req.user.id],
            { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
