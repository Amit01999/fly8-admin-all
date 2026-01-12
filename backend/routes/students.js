const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const Student = require('../models/Student');
const ServiceApplication = require('../models/ServiceApplication');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { logAudit } = require('../utils/auditLogger');
const { emitToAdmins, emitToUser } = require('../socket/socketManager');

// Complete student onboarding
router.post('/onboarding', authMiddleware, roleMiddleware('student'), async (req, res) => {
  try {
    const { interestedCountries, selectedServices, phone, country } = req.body;

    // Update user profile
    await User.findOneAndUpdate(
      { userId: req.user.userId },
      { phone, country }
    );

    const studentId = uuidv4();
    const student = new Student({
      studentId,
      userId: req.user.userId,
      interestedCountries: interestedCountries || [],
      selectedServices: selectedServices || [],
      onboardingCompleted: true
    });

    await student.save();

    // Notify super admin about new student
    const superAdmins = await User.find({ role: 'super_admin' });
    for (const admin of superAdmins) {
      const notification = new Notification({
        notificationId: uuidv4(),
        recipientId: admin.userId,
        type: 'general',
        title: 'New Student Registration',
        message: `${req.user.firstName} ${req.user.lastName} completed onboarding`,
        metadata: { studentId }
      });
      await notification.save();
    }

    res.status(201).json({
      message: 'Onboarding completed',
      student
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Onboarding failed' });
  }
});

// Get student profile
router.get('/profile', authMiddleware, roleMiddleware('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.userId });
    
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    res.json({ student });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Apply for services
router.post('/apply-services', authMiddleware, roleMiddleware('student'), async (req, res) => {
  try {
    const { serviceIds } = req.body;
    
    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const applications = [];
    for (const serviceId of serviceIds) {
      const existingApp = await ServiceApplication.findOne({
        studentId: student.studentId,
        serviceId
      });

      if (!existingApp) {
        const application = new ServiceApplication({
          applicationId: uuidv4(),
          studentId: student.studentId,
          serviceId,
          status: 'not_started'
        });
        await application.save();
        applications.push(application);

        // Notify super admin
        const superAdmins = await User.find({ role: 'super_admin' });
        for (const admin of superAdmins) {
          const notification = new Notification({
            notificationId: uuidv4(),
            recipientId: admin.userId,
            type: 'service_application',
            title: 'New Service Application',
            message: `${req.user.firstName} ${req.user.lastName} applied for service`,
            metadata: { studentId: student.studentId, serviceId }
          });
          await notification.save();
        }
      }
    }

    res.status(201).json({
      message: 'Services applied successfully',
      applications
    });
  } catch (error) {
    console.error('Service application error:', error);
    res.status(500).json({ error: 'Failed to apply for services' });
  }
});

// Get student's service applications (timeline data)
router.get('/my-applications', authMiddleware, roleMiddleware('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const applications = await ServiceApplication.find({ studentId: student.studentId });
    
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

module.exports = router;