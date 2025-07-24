const Service = require('../models/service');
const { Booking, TripCart } = require('../models/bookings');
const User = require('../models/user');

// Get all services with filtering
exports.getServices = async (req, res) => {
    try {
        const { category, region, minPrice, maxPrice, search, providerId } = req.query;
        const filter = { isActive: true };
        
        if (category) filter.category = category;
        if (region) filter.region = region;
        if (providerId) filter.providerId = providerId;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { region: { $regex: search, $options: 'i' } }
            ];
        }
        
        const services = await Service.find(filter)
            .populate('providerId', 'name providerInfo.businessName providerInfo.rating')
            .sort({ createdAt: -1 });
        
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single service
exports.getService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('providerId', 'name providerInfo.businessName providerInfo.rating providerInfo.description');
        
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create service (provider only)
exports.createService = async (req, res) => {
    try {
        const serviceData = {
            ...req.body,
            providerId: req.user.userId
        };
        
        const service = new Service(serviceData);
        await service.save();
        
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create booking from cart
exports.createBookingFromCart = async (req, res) => {
    try {
        const { contactInfo, paymentMethod, notes } = req.body;
        
        // Get user's active cart
        const cart = await TripCart.findOne({ 
            userId: req.user.userId, 
            status: 'active' 
        }).populate('items.serviceId');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        
        // Prepare booking items with provider IDs
        const bookingItems = cart.items.map(item => ({
            serviceId: item.serviceId._id,
            providerId: item.serviceId.providerId,
            quantity: item.quantity,
            price: item.price,
            startDate: item.startDate,
            endDate: item.endDate,
            guests: item.guests,
            specialRequests: item.specialRequests
        }));
        
        // Create booking
        const booking = new Booking({
            userId: req.user.userId,
            tripCartId: cart._id,
            items: bookingItems,
            contactInfo,
            totalAmount: cart.totalAmount,
            paymentMethod,
            notes
        });
        
        await booking.save();
        
        // Mark cart as completed
        cart.status = 'completed';
        await cart.save();
        
        // Populate booking for response
        await booking.populate([
            { path: 'items.serviceId', select: 'title category image' },
            { path: 'items.providerId', select: 'name providerInfo.businessName' }
        ]);
        
        res.status(201).json({
            success: true,
            booking,
            message: 'Booking created successfully'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter = { userId: req.user.userId };
        
        if (status) filter.status = status;
        
        const bookings = await Booking.find(filter)
            .populate([
                { path: 'items.serviceId', select: 'title category image region' },
                { path: 'items.providerId', select: 'name providerInfo.businessName' }
            ])
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await Booking.countDocuments(filter);
        
        res.json({
            bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get provider bookings
exports.getProviderBookings = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        
        // Find bookings that contain items from this provider
        const bookings = await Booking.find({
            'items.providerId': req.user.userId,
            ...(status && { 'items.status': status })
        })
        .populate([
            { path: 'userId', select: 'name email phone' },
            { path: 'items.serviceId', select: 'title category image region' }
        ])
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
        
        // Filter items to only show this provider's items
        const filteredBookings = bookings.map(booking => ({
            ...booking.toObject(),
            items: booking.items.filter(item => 
                item.providerId.toString() === req.user.userId
            )
        }));
        
        res.json({
            bookings: filteredBookings,
            total: filteredBookings.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update booking status (provider only)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { bookingId, itemId, status } = req.body;
        
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        // Find the specific item and verify provider ownership
        const item = booking.items.find(item => 
            item._id.toString() === itemId && 
            item.providerId.toString() === req.user.userId
        );
        
        if (!item) {
            return res.status(403).json({ error: 'Unauthorized or item not found' });
        }
        
        item.status = status;
        
        // Update overall booking status if all items are confirmed
        const allItemsConfirmed = booking.items.every(item => 
            item.status === 'confirmed' || item.status === 'completed'
        );
        
        if (allItemsConfirmed && booking.status === 'pending') {
            booking.status = 'confirmed';
        }
        
        await booking.save();
        
        res.json({
            success: true,
            message: 'Booking status updated',
            booking
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
