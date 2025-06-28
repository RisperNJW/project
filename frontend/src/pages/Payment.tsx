import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import PaymentForm from '../components/payment/PaymentForm';
import toast from 'react-hot-toast';

interface BookingDetails {
  bookingId: string;
  service: {
    title: string;
    image: string;
    location: string;
  };
  totalAmount: number;
  currency: string;
  status: string;
}

const Payment: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      // Mock data - replace with API call
      const mockBooking: BookingDetails = {
        bookingId: bookingId || 'BK-123456',
        service: {
          title: 'Maasai Mara Safari Adventure',
          image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg',
          location: 'Maasai Mara, Kenya'
        },
        totalAmount: 900,
        currency: 'USD',
        status: 'pending'
      };

      setTimeout(() => {
        setBooking(mockBooking);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
      toast.error('Failed to load booking details');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('completed');
    toast.success('Payment successful!');
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  const handlePaymentError = () => {
    setPaymentStatus('failed');
    toast.error('Payment failed. Please try again.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-emerald-600 hover:underline"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-6 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your booking has been confirmed. You will receive a confirmation email shortly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-1">Booking ID</div>
            <div className="font-bold text-lg">{booking.bookingId}</div>
          </div>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            View My Bookings
          </button>
        </motion.div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-6 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h2>
          
          <p className="text-gray-600 mb-6">
            We couldn't process your payment. Please try again or contact support.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => setPaymentStatus('pending')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your Payment
          </h1>
          <p className="text-gray-600">
            Secure your booking with our trusted payment partners
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h2>
            
            <div className="flex gap-4 mb-6">
              <img 
                src={booking.service.image} 
                alt={booking.service.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {booking.service.title}
                </h3>
                <p className="text-gray-600 text-sm">{booking.service.location}</p>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-semibold">{booking.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold capitalize">{booking.status}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Amount:</span>
                  <span>${booking.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Shield size={16} />
                <span className="font-semibold text-sm">Secure Payment</span>
              </div>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• 256-bit SSL encryption</li>
                <li>• PCI DSS compliant</li>
                <li>• Fraud protection</li>
                <li>• Money-back guarantee</li>
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <PaymentForm
              bookingId={booking.bookingId}
              amount={booking.totalAmount}
              currency={booking.currency}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Need help with your payment?
          </p>
          <div className="flex justify-center gap-4">
            <button className="text-emerald-600 hover:underline">
              Contact Support
            </button>
            <span className="text-gray-400">|</span>
            <button className="text-emerald-600 hover:underline">
              Payment FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;