const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Notification = require('../models/Notification');

// Get user notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({ 
      recipientId: req.user.userId,
      isRead: false 
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', authMiddleware, async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await Notification.findOneAndUpdate(
      { notificationId, recipientId: req.user.userId },
      { isRead: true }
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all as read
router.put('/mark-all-read', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user.userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

module.exports = router;