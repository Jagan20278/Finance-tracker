const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Not authorized" });
    try {
        const decoded = jwt.verify(token, 'mysecretkey');
        req.user = decoded;
        next();
    } catch (e) { res.status(401).json({ error: "Token invalid" }); }
};

router.use(protect); // Apply protection to all routes below

// Get all transactions for the logged-in user
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });
        res.status(200).json({ count: transactions.length, data: transactions });
    } catch (err) { res.status(500).json({ error: 'Server Error' }); }
});

// Add transaction
router.post('/', async (req, res) => {
    try {
        const { text, amount, category } = req.body;
        const transaction = await Transaction.create({
            text, amount, category, userId: req.user.id
        });
        res.status(201).json({ data: transaction });
    } catch (err) { res.status(500).json({ error: 'Server Error' }); }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ error: 'No transaction found' });
        
        // Ensure user owns the transaction
        if (transaction.userId.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        await Transaction.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Server Error' }); }
});

module.exports = router;