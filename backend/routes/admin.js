const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const Student = require('../models/Student');
const ServiceApplication = require('../models/ServiceApplication');
const Notification = require('../models/Notification');
const Commission = require('../models/Commission');

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