const express = require('express');
const router = express.Router();
const Pulse = require('../models/Pulse');

// Get all pulse locations
router.get('/', async (req, res) => {
    try {
        const pulses = await Pulse.find();
        res.json(pulses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update status of a location
router.patch('/:id', async (req, res) => {
    try {
        const pulse = await Pulse.findById(req.params.id);
        if (req.body.status) {
            pulse.status = req.body.status;
        }
        const updatedPulse = await pulse.save();
        res.json(updatedPulse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
