const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { initSocket } = require('./socket/socketManager');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8001;

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'fly8_database';

mongoose.connect(`${MONGO_URL}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const serviceRoutes = require('./routes/services');
const counselorRoutes = require('./routes/counselors');
const agentRoutes = require('./routes/agents');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
const universityRoutes = require('./routes/universities');
const paymentRoutes = require('./routes/payments');
const auditRoutes = require('./routes/audit');

// Root Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fly8 API Server Running', 
    status: 'active',
    version: '1.0.0',
    features: ['Authentication', 'Real-time Notifications', 'Payment Processing', 'Audit Logging']
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/audit', auditRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: 'error'
  });
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Fly8 Server running on port ${PORT}`);
  console.log(`🔌 Socket.io enabled for real-time notifications`);
});

module.exports = { app, server };