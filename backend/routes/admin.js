const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const Student = require('../models/Student');
const ServiceApplication = require('../models/ServiceApplication');
const Notification = require('../models/Notification');
const Commission = require('../models/Commission');
const { logAudit } = require('../utils/auditLogger');
const { emitToUser } = require('../socket/socketManager');

// Get dashboard metrics
router.get('/metrics', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCounselors = await User.countDocuments({ role: 'counselor' });
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const activeApplications = await ServiceApplication.countDocuments({ 
      status: { $in: ['not_started', 'in_progress'] } 
    });
    const completedApplications = await ServiceApplication.countDocuments({ status: 'completed' });

    res.json({
      metrics: {
        totalStudents,
        totalCounselors,
        totalAgents,
        activeApplications,
        completedApplications
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get all students
router.get('/students', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const students = await Student.find();
    
    const studentsWithDetails = [];
    for (const student of students) {
      const user = await User.findOne({ userId: student.userId }).select('-password');
      const applications = await ServiceApplication.find({ studentId: student.studentId });
      
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

// Assign counselor to student
router.put('/students/:studentId/assign-counselor', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const { studentId } = req.params;
    const { counselorId } = req.body;

    const student = await Student.findOneAndUpdate(
      { studentId },
      { assignedCounselor: counselorId },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update all applications
    await ServiceApplication.updateMany(
      { studentId },
      { assignedCounselor: counselorId }
    );

    // Notify counselor
    const notification = new Notification({
      notificationId: uuidv4(),
      recipientId: counselorId,
      type: 'assignment',
      title: 'New Student Assigned',
      message: 'A new student has been assigned to you',
      metadata: { studentId }
    });
    await notification.save();

    res.json({ message: 'Counselor assigned', student });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign counselor' });
  }

// Get all commissions
router.get('/commissions', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const commissions = await Commission.find().sort({ createdAt: -1 });
    
    const pendingCommissions = commissions.filter(c => c.status === 'pending');
    const approvedCommissions = commissions.filter(c => c.status === 'approved');
    const paidCommissions = commissions.filter(c => c.status === 'paid');

    res.json({
      commissions,
      summary: {
        total: commissions.length,
        pending: pendingCommissions.length,
        approved: approvedCommissions.length,
        paid: paidCommissions.length,
        totalPending: pendingCommissions.reduce((sum, c) => sum + c.amount, 0),
        totalPaid: paidCommissions.reduce((sum, c) => sum + c.amount, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch commissions' });
  }
});

// Approve commission
router.put('/commissions/:commissionId/approve', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const { commissionId } = req.params;
    
    const commission = await Commission.findOne({ commissionId });
    if (!commission) {
      return res.status(404).json({ error: 'Commission not found' });
    }

    commission.status = 'approved';
    await commission.save();

    await logAudit(
      req.user.userId,
      'commission_approved',
      'commission',
      commissionId,
      { amount: commission.amount, agentId: commission.agentId },
      req
    );

    // Notify agent
    const notification = new Notification({
      notificationId: uuidv4(),
      recipientId: commission.agentId,
      type: 'commission',
      title: 'Commission Approved',
      message: `Your commission of $${commission.amount} has been approved`,
      metadata: { commissionId }
    });
    await notification.save();
    emitToUser(commission.agentId, 'new_notification', notification);

    res.json({ message: 'Commission approved', commission });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve commission' });
  }
});

// Process commission payout (Admin initiates Stripe payout)
router.post('/commissions/:commissionId/payout', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const { commissionId } = req.params;
    
    const commission = await Commission.findOne({ commissionId });
    if (!commission) {
      return res.status(404).json({ error: 'Commission not found' });
    }

    if (commission.status !== 'approved') {
      return res.status(400).json({ error: 'Commission must be approved first' });
    }

    // TODO: Integrate with Stripe Connect for actual payout
    // const payout = await stripe.payouts.create({
    //   amount: Math.round(commission.amount * 100),
    //   currency: 'usd',
    //   destination: agent.stripeAccountId
    // });

    commission.status = 'paid';
    commission.paidAt = new Date();
    await commission.save();

    await logAudit(
      req.user.userId,
      'commission_paid',
      'commission',
      commissionId,
      { amount: commission.amount, agentId: commission.agentId },
      req
    );

    // Notify agent
    const notification = new Notification({
      notificationId: uuidv4(),
      recipientId: commission.agentId,
      type: 'commission',
      title: 'Commission Paid',
      message: `Your commission of $${commission.amount} has been paid`,
      metadata: { commissionId }
    });
    await notification.save();
    emitToUser(commission.agentId, 'new_notification', notification);

    res.json({ message: 'Commission payout processed', commission });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payout' });
  }
});

});

// Assign agent to student
router.put('/students/:studentId/assign-agent', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const { studentId } = req.params;
    const { agentId, commissionPercentage } = req.body;

    const student = await Student.findOneAndUpdate(
      { studentId },
      { 
        assignedAgent: agentId,
        commissionPercentage: commissionPercentage || 10
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update applications
    await ServiceApplication.updateMany(
      { studentId },
      { assignedAgent: agentId }
    );

    // Notify agent
    const notification = new Notification({
      notificationId: uuidv4(),
      recipientId: agentId,
      type: 'assignment',
      title: 'New Student Assigned',
      message: `A new student has been assigned to you with ${commissionPercentage}% commission`,
      metadata: { studentId }
    });
    await notification.save();

    res.json({ message: 'Agent assigned', student });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign agent' });
  }
});

// Get all counselors
router.get('/counselors', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const counselors = await User.find({ role: 'counselor' }).select('-password');
    res.json({ counselors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch counselors' });
  }
});

// Get all agents
router.get('/agents', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    res.json({ agents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Create counselor/agent
router.post('/users', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({
      userId: uuidv4(),
      email,
      password,
      firstName,
      lastName,
      role
    });

    await user.save();

    res.status(201).json({ message: 'User created', user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;