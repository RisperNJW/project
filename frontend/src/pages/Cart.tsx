import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Calendar,
  Users,
  MapPin,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const { items, totalAmount, totalItems, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(itemId);
      await updateCartItem(itemId, { quantity: newQuantity });
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setUpdating(null);
    }
  };

  const handleGuestsChange = async (itemId: string, newGuests: number) => {
    if (newGuests < 1) return;
    
    try {
      setUpdating(itemId);
      await updateCartItem(itemId, { guests: newGuests });
      toast.success('Guest count updated');
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        await clearCart();
        toast.success('Cart cleared');
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    }
  };

  const proceedToCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Your Trip Cart</h1>
            <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-800 font-medium flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start building your perfect Kenyan adventure!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/meals')}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
              >
                Browse Meals
              </button>
              <button
                onClick={() => navigate('/stays')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Find Stays
              </button>
              <button
                onClick={() => navigate('/experiences')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Discover Experiences
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            {/* Cart Items */}
            <div className="lg:col-span-7">
              <div className="space-y-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.image}
                        alt={item.serviceName}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.serviceName}</h3>
                            <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                            <p className="text-sm text-gray-500">By {item.providerName}</p>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item._id!)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Quantity */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantity
                            </label>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item._id!, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updating === item._id}
                                className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item._id!, item.quantity + 1)}
                                disabled={updating === item._id}
                                className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Guests */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              <Users className="h-4 w-4 inline mr-1" />
                              Guests
                            </label>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleGuestsChange(item._id!, item.guests - 1)}
                                disabled={item.guests <= 1 || updating === item._id}
                                className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.guests}</span>
                              <button
                                onClick={() => handleGuestsChange(item._id!, item.guests + 1)}
                                disabled={updating === item._id}
                                className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Dates */}
                          {(item.startDate || item.endDate) && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="h-4 w-4 inline mr-1" />
                                Dates
                              </label>
                              <div className="text-sm text-gray-600">
                                {item.startDate && (
                                  <div>From: {new Date(item.startDate).toLocaleDateString()}</div>
                                )}
                                {item.endDate && (
                                  <div>To: {new Date(item.endDate).toLocaleDateString()}</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            KSh {item.price} × {item.quantity} × {item.guests} guests
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            KSh {(item.price * item.quantity * item.guests).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">KES {totalAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">KES 0</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-emerald-600">KES {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="w-full mt-6 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center space-x-2 font-medium"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate('/services')}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
