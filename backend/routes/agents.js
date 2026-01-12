const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const Student = require('../models/Student');
const ServiceApplication = require('../models/ServiceApplication');
const Commission = require('../models/Commission');
const User = require('../models/User');
const { logAudit } = require('../utils/auditLogger');
const { emitToUser } = require('../socket/socketManager');

// Get assigned students (for agents)
router.get('/my-students', authMiddleware, roleMiddleware('agent'), async (req, res) => {
  try {
    const students = await Student.find({ assignedAgent: req.user.userId });
    
    const studentsWithDetails = [];
    for (const student of students) {
      const user = await User.findOne({ userId: student.userId }).select('-password');
      const applications = await ServiceApplication.find({ 
        studentId: student.studentId,
        assignedAgent: req.user.userId 
      });
      
      studentsWithDetails.push({
        ...student.toObject(),
        user,
        applications
      });
    }

    res.json({ students: studentsWithDetails });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get commission data
router.get('/commissions', authMiddleware, roleMiddleware('agent'), async (req, res) => {
  try {
    const commissions = await Commission.find({ agentId: req.user.userId });
    
    const totalPending = commissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.amount, 0);
    
    const totalApproved = commissions
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + c.amount, 0);
    
    const totalPaid = commissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.amount, 0);

    res.json({
      commissions,
      summary: {
        totalPending,
        totalApproved,
        totalPaid,
        lifetimeEarnings: totalPaid
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch commissions' });
  }
});

module.exports = router;