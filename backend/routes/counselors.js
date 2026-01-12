const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const Student = require('../models/Student');
const ServiceApplication = require('../models/ServiceApplication');
const User = require('../models/User');

// Get assigned students (for counselors)
router.get('/my-students', authMiddleware, roleMiddleware('counselor'), async (req, res) => {
  try {
    const students = await Student.find({ assignedCounselor: req.user.userId });
    
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

// Update service application status
router.put('/applications/:applicationId', authMiddleware, roleMiddleware('counselor'), async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    const application = await ServiceApplication.findOne({ applicationId });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status || application.status;
    
    if (notes) {
      application.notes.push({
        text: notes,
        addedBy: req.user.userId,
        addedAt: new Date()
      });
    }

    if (status === 'completed') {
      application.completedAt = new Date();
    }

    await application.save();

    res.json({ message: 'Application updated', application });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});

module.exports = router;