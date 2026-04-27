const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: String,
        default: 'Anonymous'
    },
    initials: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Books", "Notes", "Equipment", "Food", "Other"],
        default: 'Other'
    },
    body: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
