const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json({ services });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Initialize services (for first-time setup)
router.post('/init', async (req, res) => {
  try {
    const services = [
      { serviceId: 'service-1', name: 'Profile Assessment', description: 'Complete profile evaluation and career counseling', icon: 'UserCircle', color: '#3B82F6', order: 1 },
      { serviceId: 'service-2', name: 'Pre-application Support', description: 'Documentation and application preparation', icon: 'FileText', color: '#8B5CF6', order: 2 },
      { serviceId: 'service-3', name: 'Apply University', description: 'University selection and application submission', icon: 'School', color: '#A855F7', order: 3 },
      { serviceId: 'service-4', name: 'Visa & Interview Support', description: 'Visa processing and interview preparation', icon: 'Stamp', color: '#EC4899', order: 4 },
      { serviceId: 'service-5', name: 'Ticket & Travel Support', description: 'Flight booking and travel arrangements', icon: 'Plane', color: '#F97316', order: 5 },
      { serviceId: 'service-6', name: 'Find Accommodation', description: 'Student housing and accommodation search', icon: 'Home', color: '#F59E0B', order: 6 },
      { serviceId: 'service-7', name: 'Education Loan', description: 'Financial aid and loan assistance', icon: 'Banknote', color: '#10B981', order: 7 },
      { serviceId: 'service-8', name: 'Find Jobs Abroad', description: 'Job search and career placement', icon: 'Briefcase', color: '#14B8A6', order: 8 }
    ];

    for (const service of services) {
      await Service.findOneAndUpdate(
        { serviceId: service.serviceId },
        service,
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Services initialized', count: services.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize services' });
  }
});

module.exports = router;