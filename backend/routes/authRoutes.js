const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/db');

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password, phone } = req.body;
    let connection;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        connection = await getConnection();
        
        // Check if user exists
        const checkUser = await connection.execute(
            `SELECT * FROM Users WHERE email = :email`,
            [email]
        );

        if (checkUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await connection.execute(
            `INSERT INTO Users (name, email, password_hash, phone) VALUES (:name, :email, :password, :phone) RETURNING id INTO :id`,
            {
                name,
                email,
                password: hashedPassword,
                phone: phone || null,
                id: { type: require('oracledb').NUMBER, dir: require('oracledb').BIND_OUT }
            },
            { autoCommit: true }
        );

        const newUserId = result.outBinds.id[0];
        
        const token = jwt.sign({ id: newUserId }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            id: newUserId,
            name,
            email,
            token
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

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let connection;

    try {
        connection = await getConnection();
        
        // Use outFormat to get objects
        const result = await connection.execute(
            `SELECT * FROM Users WHERE email = :email`,
            [email],
            { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];
        
        const isMatch = await bcrypt.compare(password, user.PASSWORD_HASH);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.ID }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            id: user.ID,
            name: user.NAME,
            email: user.EMAIL,
            token
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

module.exports = router;
