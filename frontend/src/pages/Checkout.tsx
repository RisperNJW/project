import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  User, 
  Mail, 
  Phone, 
  Users,
  ArrowLeft,
  Check,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

const Checkout: React.FC = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: user?.name || '',
    email: user?.email || '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'mpesa'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      toast.error('Please fill in all contact information');
      return;
    }
    setStep(2);
  };

  const createBooking = async () => {
    try {
      const response = await fetch('/api/bookings/from-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            category: item.category,
            price: item.price,
            quantity: item.quantity,
            guests: item.guests,
            providerId: item.providerId,
            providerName: item.providerName,
            image: item.image,
            startDate: item.startDate,
            endDate: item.endDate,
            specialRequests: item.specialRequests
          })),
          contactInfo,
          notes,
          totalAmount
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const data = await response.json();
      return data.booking;
    } catch (error) {
      throw error;
    }
  };

  const processStripePayment = async (booking: any) => {
    try {
      // Create payment intent
      const intentResponse = await fetch('/api/payments/stripe/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: booking._id,
          amount: booking.totalAmount,
          currency: 'kes'
        })
      });

      if (!intentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await intentResponse.json();
      
      // Simulate card payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update booking payment status
      const updateResponse = await fetch(`/api/bookings/${booking._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          paymentStatus: 'completed',
          paymentMethod: 'stripe',
          paymentReference: `stripe_${Date.now()}`
        })
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update payment status');
      }
      
      return { success: true, paymentReference: `stripe_${Date.now()}` };
    } catch (error) {
      throw error;
    }
  };

  const processMpesaPayment = async (booking: any) => {
    try {
      const response = await fetch('/api/payments/mpesa/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: booking._id,
          phoneNumber: mpesaPhone,
          amount: booking.totalAmount
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate M-Pesa payment');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'mpesa' && !mpesaPhone) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    setProcessing(true);

    try {
      // Create booking
      const booking = await createBooking();
      setBookingId(booking._id);

      // Process payment
      if (paymentMethod === 'stripe') {
        await processStripePayment(booking);
      } else {
        await processMpesaPayment(booking);
      }

      // Clear cart and show success
      await clearCart();
      setStep(3);
      
      toast.success('Booking created successfully!');
    } catch (error) {
      toast.error((error as Error).message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const renderContactForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
      
      <form onSubmit={handleContactSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="h-4 w-4 inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            value={contactInfo.name}
            onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="h-4 w-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="h-4 w-4 inline mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="+254..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Any special requirements or notes..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition font-medium"
        >
          Continue to Payment
        </button>
      </form>
    </motion.div>
  );

  const renderPaymentForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Payment Method</h2>
        <button
          onClick={() => setStep(1)}
          className="text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setPaymentMethod('mpesa')}
          className={`p-4 border-2 rounded-lg transition ${
            paymentMethod === 'mpesa'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Smartphone className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <div className="font-medium">M-Pesa</div>
              <div className="text-sm text-gray-500">Mobile Money</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setPaymentMethod('stripe')}
          className={`p-4 border-2 rounded-lg transition ${
            paymentMethod === 'stripe'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-3">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">Credit/Debit Card</div>
              <div className="text-sm text-gray-500">Visa, Mastercard</div>
            </div>
          </div>
        </button>
      </div>

      {paymentMethod === 'mpesa' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            value={mpesaPhone}
            onChange={(e) => setMpesaPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="254712345678"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            You will receive an M-Pesa prompt on this number
          </p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={processing}
        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        {processing ? (
          <>
            <Loader className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Complete Payment</span>
            <span className="font-bold">KES {totalAmount.toLocaleString()}</span>
          </>
        )}
      </button>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Your booking has been created successfully. You will receive a confirmation email shortly.
        </p>
      </div>

      {bookingId && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Booking Reference</p>
          <p className="font-mono font-medium">{bookingId}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
        >
          View My Bookings
        </button>
        <button
          onClick={() => navigate('/services')}
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
        >
          Continue Shopping
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {step === 1 && renderContactForm()}
              {step === 2 && renderPaymentForm()}
              {step === 3 && renderSuccess()}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex items-start space-x-3">
                    <img
                      src={item.image || '/api/placeholder/60/60'}
                      alt={item.serviceName}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.serviceName}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span>{item.quantity}x</span>
                        <Users className="h-3 w-3" />
                        <span>{item.guests}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        KES {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-emerald-600">KES {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
