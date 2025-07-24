const express = require("express");
const router = express.Router();
const Booking = require("../models/bookings");
const auth = require("../middleware/auth");
const { v4: uuidv4 } = require('uuid');

// Create booking from cart (multi-service booking)
router.post("/from-cart", auth, async (req, res) => {
    try {
        const { items, contactInfo, notes, totalAmount } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items provided for booking' });
        }
        
        if (!contactInfo || !contactInfo.name || !contactInfo.email) {
            return res.status(400).json({ error: 'Contact information is required' });
        }
        
        // Generate unique booking number
        const bookingNumber = `KTB-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        
        // Create booking with cart items
        const booking = new Booking({
            userId: req.user.userId,
            bookingNumber,
            items: items.map(item => ({
                serviceId: item.serviceId,
                serviceName: item.serviceName,
                category: item.category,
                price: item.price,
                quantity: item.quantity || 1,
                guests: item.guests || 1,
                providerId: item.providerId,
                providerName: item.providerName,
                image: item.image,
                startDate: item.startDate,
                endDate: item.endDate
            })),
            contactInfo,
            notes,
            totalAmount: totalAmount || items.reduce((sum, item) => 
                sum + (item.price * (item.quantity || 1) * (item.guests || 1)), 0
            ),
            status: 'confirmed',
            paymentStatus: 'pending'
        });
        
        await booking.save();
        
        res.status(201).json({
            success: true,
            booking,
            message: 'Multi-service booking created successfully'
        });
    } catch (err) {
        console.error('Cart booking creation error:', err);
        res.status(400).json({ error: err.message });
    }
});

// Create single service booking (legacy support)
router.post("/", auth, async (req, res) => {
    try {
        const booking = await Booking.create({
            ...req.body,
            userId: req.user.userId,
            bookingNumber: `KTB-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
        });
        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get user's bookings
router.get("/", auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.userId })
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get specific booking by ID
router.get("/:id", auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({ 
            _id: req.params.id, 
            userId: req.user.userId 
        });
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update booking status
router.patch("/:id/status", auth, async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { status, updatedAt: new Date() },
            { new: true }
        );
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all bookings (admin/provider access)
router.get("/admin/all", auth, async (req, res) => {
    try {
        // Check if user has admin access or is a provider
        if (req.user.role !== 'admin' && req.user.role !== 'provider') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        let query = {};
        
        // If provider, only show bookings for their services
        if (req.user.role === 'provider') {
            query = { 'items.providerId': req.user.userId };
        }
        
        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');
            
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
