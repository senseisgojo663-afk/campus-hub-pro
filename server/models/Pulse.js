const mongoose = require('mongoose');

const pulseSchema = new mongoose.Schema({
    place: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Busy', 'Moderate', 'Low'],
        default: 'Low'
    }
}, { timestamps: true });

module.exports = mongoose.model('Pulse', pulseSchema);
