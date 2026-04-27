const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Printer = require('./models/Printer');

// Load env
dotenv.config();

const updatePrinter = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas...');

        // Update Printer B2 to be available
        const result = await Printer.findOneAndUpdate(
            { name: "Printer B2" },
            { status: "available", queue: 0 },
            { new: true }
        );

        if (result) {
            console.log(`SUCCESS: ${result.name} is now ${result.status}!`);
        } else {
            console.log('Printer B2 not found.');
        }

        process.exit();
    } catch (err) {
        console.error('Update failed:', err);
        process.exit(1);
    }
};

updatePrinter();
