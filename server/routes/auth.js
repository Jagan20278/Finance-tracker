const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        res.json({ success: true, user });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // Create Token
        const token = jwt.sign({ id: user._id }, 'mysecretkey', { expiresIn: '1d' });
        res.json({ success: true, token, username: user.username });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;