const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: [true, 'Please add text'] },
    amount: { type: Number, required: [true, 'Please add a number'] },
    category: { 
        type: String, 
        required: true,
        enum: ['Salary', 'Food', 'Rent', 'Entertainment', 'Other']
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);