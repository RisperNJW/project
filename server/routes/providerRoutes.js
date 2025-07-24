const express = require('express');
const router = express.Router();
const Provider = require('../models/provider');
const auth = require('../middleware/auth');

// Submit provider onboarding application
router.post('/onboard', async (req, res) => {
  try {
    const { name, email, serviceType, region, message } = req.body;
    
    // Check if provider already exists
    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ error: 'A provider with this email already exists' });
    }
    
    // Create new provider application
    const provider = new Provider({
      name,
      email,
      serviceType,
      region,
      message,
      status: 'pending',
      submittedAt: new Date()
    });
    
    await provider.save();
    
    res.status(201).json({
      success: true,
      message: 'Provider application submitted successfully',
      providerId: provider._id
    });
  } catch (error) {
    console.error('Provider onboarding error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all provider applications (admin only)
router.get('/applications', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    const providers = await Provider.find().sort({ submittedAt: -1 });
    res.json(providers);
  } catch (error) {
    console.error('Get provider applications error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update provider application status (admin only)
router.patch('/applications/:id/status', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    const { status, notes } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be pending, approved, or rejected.' });
    }
    
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        notes,
        reviewedAt: new Date(),
        reviewedBy: req.user.userId
      },
      { new: true }
    );
    
    if (!provider) {
      return res.status(404).json({ error: 'Provider application not found' });
    }
    
    res.json({
      success: true,
      message: `Provider application ${status} successfully`,
      provider
    });
  } catch (error) {
    console.error('Update provider status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get provider application by ID
router.get('/applications/:id', auth, async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({ error: 'Provider application not found' });
    }
    
    // Only admin or the provider themselves can view the application
    if (req.user.role !== 'admin' && provider.email !== req.user.email) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(provider);
  } catch (error) {
    console.error('Get provider application error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
