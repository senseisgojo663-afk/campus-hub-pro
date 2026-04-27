const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');
const pulseRoutes = require('./routes/pulse');
const postRoutes = require('./routes/posts');
const printerRoutes = require('./routes/printers');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/pulse', pulseRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/printers', printerRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Campus Hub Pro Server is running!');
});

// Setup Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Pulse Dashboard real-time events
    socket.on('join_pulse', () => {
        socket.join('pulse_room');
        console.log(`User ${socket.id} joined pulse_room`);
    });

    socket.on('leave_pulse', () => {
        socket.leave('pulse_room');
        console.log(`User ${socket.id} left pulse_room`);
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campus_hub_pro';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });
