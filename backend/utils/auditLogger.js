const AuditLog = require('../models/AuditLog');
const { v4: uuidv4 } = require('uuid');

const logAudit = async (userId, action, resourceType, resourceId, details, req) => {
  try {
    const log = new AuditLog({
      logId: uuidv4(),
      userId,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.get('user-agent')
    });
    await log.save();
  } catch (error) {
    console.error('Audit log error:', error);
  }
};

module.exports = { logAudit };