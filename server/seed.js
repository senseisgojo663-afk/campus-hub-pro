const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pulse = require('./models/Pulse');
const Printer = require('./models/Printer');

dotenv.config();

const INITIAL_DATA = [
  { place: "Canteen A",        icon: "🍽️", detail: "Ground Floor, Block A",  status: "Busy"    },
  { place: "Canteen B",        icon: "🍜", detail: "1st Floor, Block C",      status: "Low"     },
  { place: "Main Library",     icon: "📚", detail: "Central Block",           status: "Moderate"},
  { place: "Computer Lab 1",   icon: "💻", detail: "Block B, Room 102",       status: "Low"     },
  { place: "Sports Ground",    icon: "⚽", detail: "Behind Hostel C",         status: "Busy"    },
  { place: "Lecture Hall LH3", icon: "🎓", detail: "Block D, Hall 3",         status: "Moderate"},
];

const PRINTER_DATA = [
  { name: "Printer A1",      location: "Library — Ground Floor", icon: "🖨️", status: "available", queue: 0 },
  { name: "Printer B2",      location: "Block B — Admin Office", icon: "🖨️", status: "busy",      queue: 4 },
  { name: "Scanner S1",      location: "Library — 1st Floor",    icon: "📠", status: "available", queue: 0 },
  { name: "Printer C3",      location: "Hostel Block C",         icon: "🖨️", status: "offline",    queue: 0 },
  { name: "Color Printer X1", location: "Main Block — Room 201",  icon: "🖨️", status: "available", queue: 1 },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');
        
        await Pulse.deleteMany({});
        await Printer.deleteMany({});
        
        await Pulse.insertMany(INITIAL_DATA);
        await Printer.insertMany(PRINTER_DATA);
        
        console.log('Database seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
