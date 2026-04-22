const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getConnection, query } = require('../config/db');

// Helper to check if account belongs to user
const verifyAccountOwnership = async (accountId, userId) => {
    const result = await query(
        `SELECT * FROM Accounts WHERE id = $1 AND user_id = $2`,
        [accountId, userId]
    );
    return result.rows.length > 0;
};

// Deposit
router.post('/deposit', protect, async (req, res) => {
    const { accountId, amount, description } = req.body;
    let client;

    try {
        if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than 0" });

        const isOwner = await verifyAccountOwnership(accountId, req.user.id);
        if (!isOwner) return res.status(403).json({ message: "Not authorized for this account" });

        client = await getConnection();
        await client.query('BEGIN');

        // Update balance
        await client.query(
            `UPDATE Accounts SET balance = balance + $1 WHERE id = $2`,
            [amount, accountId]
        );

        // Record transaction
        await client.query(
            `INSERT INTO Transactions (account_id, transaction_type, amount, description) VALUES ($1, 'Deposit', $2, $3)`,
            [accountId, amount, description || 'Deposit']
        );

        await client.query('COMMIT');
        res.json({ message: "Deposit successful" });

    } catch (err) {
        if (client) {
            try { await client.query('ROLLBACK'); } catch(e) { console.error(e); }
        }
        console.error(err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Withdraw
router.post('/withdraw', protect, async (req, res) => {
    const { accountId, amount, description } = req.body;
    let client;

    try {
        if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than 0" });

        const isOwner = await verifyAccountOwnership(accountId, req.user.id);
        if (!isOwner) return res.status(403).json({ message: "Not authorized for this account" });

        client = await getConnection();
        await client.query('BEGIN');

        // Check balance
        const accResult = await client.query(
            `SELECT balance FROM Accounts WHERE id = $1`,
            [accountId]
        );
        if (Number(accResult.rows[0].balance) < amount) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Update balance
        await client.query(
            `UPDATE Accounts SET balance = balance - $1 WHERE id = $2`,
            [amount, accountId]
        );

        // Record transaction
        await client.query(
            `INSERT INTO Transactions (account_id, transaction_type, amount, description) VALUES ($1, 'Withdraw', $2, $3)`,
            [accountId, amount, description || 'Withdrawal']
        );

        await client.query('COMMIT');
        res.json({ message: "Withdrawal successful" });

    } catch (err) {
        if (client) {
            try { await client.query('ROLLBACK'); } catch(e) { console.error(e); }
        }
        console.error(err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Transfer
router.post('/transfer', protect, async (req, res) => {
    const { fromAccountId, toAccountId, amount, description } = req.body;
    let client;

    try {
        if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than 0" });
        if (fromAccountId === toAccountId) return res.status(400).json({ message: "Cannot transfer to same account" });

        const isOwner = await verifyAccountOwnership(fromAccountId, req.user.id);
        if (!isOwner) return res.status(403).json({ message: "Not authorized for source account" });

        client = await getConnection();
        await client.query('BEGIN');

        // Check target account exists
        const toAccResult = await client.query(
            `SELECT id FROM Accounts WHERE id = $1`,
            [toAccountId]
        );
        if (toAccResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Target account not found" });
        }

        // Check balance
        const accResult = await client.query(
            `SELECT balance FROM Accounts WHERE id = $1`,
            [fromAccountId]
        );
        if (Number(accResult.rows[0].balance) < amount) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Deduct from source
        await client.query(
            `UPDATE Accounts SET balance = balance - $1 WHERE id = $2`,
            [amount, fromAccountId]
        );

        // Add to target
        await client.query(
            `UPDATE Accounts SET balance = balance + $1 WHERE id = $2`,
            [amount, toAccountId]
        );

        // Record source transaction
        await client.query(
            `INSERT INTO Transactions (account_id, transaction_type, amount, description) VALUES ($1, 'Transfer', $2, $3)`,
            [fromAccountId, amount, `Transfer to Acc ${toAccountId}: ` + (description || '')]
        );

        // Record target transaction
        await client.query(
            `INSERT INTO Transactions (account_id, transaction_type, amount, description) VALUES ($1, 'Deposit', $2, $3)`,
            [toAccountId, amount, `Transfer from Acc ${fromAccountId}: ` + (description || '')]
        );

        await client.query('COMMIT');
        res.json({ message: "Transfer successful" });

    } catch (err) {
        if (client) {
            try { await client.query('ROLLBACK'); } catch(e) { console.error(e); }
        }
        console.error(err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Transaction History
router.get('/:accountId', protect, async (req, res) => {
    try {
        const accountId = req.params.accountId;

        const isOwner = await verifyAccountOwnership(accountId, req.user.id);
        if (!isOwner) return res.status(403).json({ message: "Not authorized for this account" });

        const result = await query(
            `SELECT * FROM Transactions WHERE account_id = $1 ORDER BY transaction_date DESC`,
            [accountId]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
