const express = require('express');
const router = express.Router();
const Printer = require('../models/Printer');

// Get all printers
router.get('/', async (req, res) => {
    try {
        const printers = await Printer.find();
        res.json(printers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update printer status or queue
router.patch('/:id', async (req, res) => {
    try {
        const printer = await Printer.findById(req.params.id);
        if (req.body.status) printer.status = req.body.status;
        if (req.body.queue !== undefined) printer.queue = req.body.queue;
        
        const updatedPrinter = await printer.save();
        res.json(updatedPrinter);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
