const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getConnection } = require('../config/db');

// Helper to check if account belongs to user
const verifyAccountOwnership = async (connection, accountId, userId) => {
    const result = await connection.execute(
        `SELECT * FROM Accounts WHERE id = :accountId AND user_id = :userId`,
        [accountId, userId],
        { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );
    return result.rows.length > 0;
};

// Deposit
router.post('/deposit', protect, async (req, res) => {
    const { accountId, amount, description } = req.body;
    let connection;

    try {
        if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than 0" });

        connection = await getConnection();
        
        const isOwner = await verifyAccountOwnership(connection, accountId, req.user.id);
        if (!isOwner) return res.status(403).json({ message: "Not authorized for this account" });

        // Update balance
        await connection.execute(
            `UPDATE Accounts SET balance = balance + :amount WHERE id = :accountId`,
            [amount, accountId],
            { autoCommit: false }
        );

        // Record transaction
        await connection.execute(
            `INSERT INTO Transactions (account_id, transaction_type, amount, description) VALUES (:accountId, 'Deposit', :amount, :description)`,
            { accountId, amount, description: description || 'Deposit' },
            { autoCommit: false }
        );

        await connection.commit();

        res.json({ message: "Deposit successful" });

    } catch (err) {
        if (connection) {
            try { await connection.rollback(); } catch(e) { console.error(e); }
        }
        console.error(err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Withdraw
router.post('/withdraw', protect, async (req, res) => {
    const { accountId, amount, description } = req.body;
    let connection;

    try {
        if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than 0" });

        connection = await getConnection();
        
        const isOwner = await verifyAccountOwnership(connection, accountId, req.user.id);
        if (!isOwner) return res.status(403).json({ message: "Not authorized for this account" });

        // Check balance
        const accResult = await connection.execute(
            `SELECT balance FROM Accounts WHERE id = :accountId`,
            [accountId],
            { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
        );
        if (accResult.rows[0].BALANCE < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Update balance
        await connection.execute(
            `UPDATE Accounts SET balance = balance - :amount WHERE id = :accountId`,
            [amount, accountId],
            { autoCommit: false }
        );

        // Record transaction
        await connection.execute(
            `INSERT INTO Transactions (account_id, transaction_type, amount, description) VALUES (:accountId, 'Withdraw', :amount, :description)`,
            { accountId, amount, description: description || 'Withdrawal' },
            { autoCommit: false }
        );

        await connection.commit();

        res.json({ message: "Withdrawal successful" });

    } catch (err) {
        if (connection) {
            try { await connection.rollback(); } catch(e) { console.error(e); }
        }
        console.error(err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Transfer
router.post('/transfer', protect, async (req, res) => {
    const { fromAccountId, toAccountId, amount, description } = req.body;
    let connection;

    try {
        if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than 0" });
        if (fromAccountId === toAccountId) return res.status(400).json({ message: "Cannot transfer to same account" });

        connection = await getConnection();
        
        const isOwner = await verifyAccountOwnership(connection, fromAccountId, req.user.id);
        if (!isOwner) return res.status(403).json({ message: "Not authorized for source account" });

        // Check target account exists
        const toAccResult = await connection.execute(
            `SELECT id FROM Accounts WHERE id = :toAccountId`,
            [toAccountId]
        );
        if (toAccResult.rows.length === 0) return res.status(404).json({ message: "Target account not found" });

        // Check balance
        const accResult = await connection.execute(
            `SELECT balance FROM Accounts WHERE id = :fromAccountId`,
            [fromAccountId],
            { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
        );
        if (accResult.rows[0].BALANCE < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Deduct from source
        await connection.execute(
            `UPDATE Accounts SET balance = balance - :amount WHERE id = :fromAccountId`,
            [amount, fromAccountId],
            { autoCommit: false }
        );

        // Add to target
        await connection.execute(
            `UPDATE Accounts SET balance = balance + :amount WHERE id = :toAccountId`,
            [amount, toAccountId],
            { autoCommit: false }
        );

        // Record source transaction
        await connection.execute(
            `INSERT INTO Transactions (account_id, transaction_type, amount, description) VALUES (:fromAccountId, 'Transfer', :amount, :description)`,
            { fromAccountId, amount, description: `Transfer to Acc ${toAccountId}: ` + (description || '') },
            { autoCommit: false }
        );

        // Record target transaction (optional, depending on requirements, usually 'Deposit' or 'Transfer In')
        await connection.execute(
            `INSERT INTO Transactions (account_id, transaction_type, amount, description) VALUES (:toAccountId, 'Deposit', :amount, :description)`,
            { toAccountId, amount, description: `Transfer from Acc ${fromAccountId}: ` + (description || '') },
            { autoCommit: false }
        );

        await connection.commit();

        res.json({ message: "Transfer successful" });

    } catch (err) {
        if (connection) {
            try { await connection.rollback(); } catch(e) { console.error(e); }
        }
        console.error(err);
        res.status(500).json({ message: "Server error" });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Transaction History
router.get('/:accountId', protect, async (req, res) => {
    let connection;

    try {
        connection = await getConnection();
        const accountId = req.params.accountId;

        const isOwner = await verifyAccountOwnership(connection, accountId, req.user.id);
        if (!isOwner) return res.status(403).json({ message: "Not authorized for this account" });

        const result = await connection.execute(
            `SELECT * FROM Transactions WHERE account_id = :accountId ORDER BY transaction_date DESC`,
            [accountId],
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
