const mongoose = require('mongoose');

// Stores missed help notifications so mobile can fetch them on reconnect
const notificationSchema = new mongoose.Schema({
    sessionId: { type: String, required: true }, // the poster's session
    helperName: { type: String, default: 'Someone' },
    postBody: { type: String, required: true },
    category: { type: String, default: 'Other' },
    read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
