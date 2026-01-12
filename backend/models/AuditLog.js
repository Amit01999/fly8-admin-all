const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  logId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  action: {
    type: String,
    required: true,
    enum: [
      'user_created',
      'user_login',
      'student_onboarded',
      'service_applied',
      'counselor_assigned',
      'agent_assigned',
      'application_status_updated',
      'payment_initiated',
      'payment_completed',
      'commission_approved',
      'commission_paid',
      'document_uploaded',
      'note_added'
    ]
  },
  resourceType: {
    type: String,
    enum: ['user', 'student', 'application', 'payment', 'commission', 'document']
  },
  resourceId: String,
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);