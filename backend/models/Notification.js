const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    required: true,
    unique: true
  },
  recipientId: {
    type: String,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['service_application', 'assignment', 'status_update', 'commission', 'general'],
    required: true
  },
  title: String,
  message: String,
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);