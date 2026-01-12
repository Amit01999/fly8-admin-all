const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

let io;

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userRole})`);

    // Join user-specific room
    socket.join(`user:${socket.userId}`);
    
    // Join role-specific room
    socket.join(`role:${socket.userRole}`);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });

    // Handle custom events
    socket.on('join_student_room', (studentId) => {
      socket.join(`student:${studentId}`);
    });

    socket.on('join_application_room', (applicationId) => {
      socket.join(`application:${applicationId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Emit notification to specific user
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

// Emit to all users with specific role
const emitToRole = (role, event, data) => {
  if (io) {
    io.to(`role:${role}`).emit(event, data);
  }
};

// Emit to all super admins
const emitToAdmins = (event, data) => {
  emitToRole('super_admin', event, data);
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToRole,
  emitToAdmins
};