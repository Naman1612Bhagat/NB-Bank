const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        // Check if user exists
        const checkUser = await query(
            `SELECT * FROM Users WHERE email = $1`,
            [email]
        );

        if (checkUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await query(
            `INSERT INTO Users (name, email, password_hash, phone) VALUES ($1, $2, $3, $4) RETURNING id`,
            [name, email, hashedPassword, phone || null]
        );

        const newUserId = result.rows[0].id;
        
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
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await query(
            `SELECT * FROM Users WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];
        
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
