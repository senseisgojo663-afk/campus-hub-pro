const mongoose = require('mongoose');

const printerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '🖨️'
    },
    status: {
        type: String,
        enum: ['available', 'busy', 'offline'],
        default: 'available'
    },
    queue: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Printer', printerSchema);
