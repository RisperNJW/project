const { TripCart } = require('../models/bookings');
const Service = require('../models/service');

// Get user's active cart
exports.getCart = async (req, res) => {
  try {
    const cart = await TripCart.findOne({ 
      userId: req.user.userId, 
      status: 'active' 
    }).populate('items.serviceId');
    
    if (!cart) {
      return res.json({ cart: null, items: [], totalAmount: 0 });
    }
    
    res.json({ cart, items: cart.items, totalAmount: cart.totalAmount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { serviceId, quantity = 1, startDate, endDate, guests = 1, specialRequests } = req.body;
    
    // Validate service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    // Find or create cart
    let cart = await TripCart.findOne({ 
      userId: req.user.userId, 
      status: 'active' 
    });
    
    if (!cart) {
      cart = new TripCart({ userId: req.user.userId, items: [] });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.serviceId.toString() === serviceId
    );
    
    const itemPrice = service.price * quantity * guests;
    
    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].guests = guests;
      cart.items[existingItemIndex].price = service.price * cart.items[existingItemIndex].quantity * guests;
      if (startDate) cart.items[existingItemIndex].startDate = startDate;
      if (endDate) cart.items[existingItemIndex].endDate = endDate;
      if (specialRequests) cart.items[existingItemIndex].specialRequests = specialRequests;
    } else {
      // Add new item
      cart.items.push({
        serviceId,
        quantity,
        price: itemPrice,
        startDate,
        endDate,
        guests,
        specialRequests
      });
    }
    
    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => total + item.price, 0);
    
    await cart.save();
    await cart.populate('items.serviceId');
    
    res.json({ 
      success: true, 
      message: 'Item added to cart',
      cart,
      totalItems: cart.items.length,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, startDate, endDate, guests, specialRequests } = req.body;
    
    const cart = await TripCart.findOne({ 
      userId: req.user.userId, 
      status: 'active' 
    }).populate('items.serviceId');
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    const item = cart.items[itemIndex];
    const service = item.serviceId;
    
    // Update item properties
    if (quantity !== undefined) item.quantity = quantity;
    if (startDate !== undefined) item.startDate = startDate;
    if (endDate !== undefined) item.endDate = endDate;
    if (guests !== undefined) item.guests = guests;
    if (specialRequests !== undefined) item.specialRequests = specialRequests;
    
    // Recalculate price
    item.price = service.price * item.quantity * item.guests;
    
    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => total + item.price, 0);
    
    await cart.save();
    
    res.json({ 
      success: true, 
      message: 'Cart item updated',
      cart,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const cart = await TripCart.findOne({ 
      userId: req.user.userId, 
      status: 'active' 
    });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    cart.totalAmount = cart.items.reduce((total, item) => total + item.price, 0);
    
    await cart.save();
    await cart.populate('items.serviceId');
    
    res.json({ 
      success: true, 
      message: 'Item removed from cart',
      cart,
      totalItems: cart.items.length,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await TripCart.findOne({ 
      userId: req.user.userId, 
      status: 'active' 
    });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    cart.items = [];
    cart.totalAmount = 0;
    
    await cart.save();
    
    res.json({ 
      success: true, 
      message: 'Cart cleared',
      cart,
      totalItems: 0,
      totalAmount: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
