import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Calendar, 
  Users, 
  MapPin, 
  CreditCard,
  Download,
  Share2,
  ArrowRight,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BookingDetails {
  _id: string;
  bookingNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    serviceName: string;
    category: string;
    price: number;
    quantity: number;
    guests: number;
    providerName: string;
    image: string;
  }>;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  notes?: string;
}

const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const data = await response.json();
        setBooking(data);
      } catch (error) {
        setError((error as Error).message);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleDownloadReceipt = () => {
    // In a real implementation, this would generate and download a PDF receipt
    toast.success('Receipt download would start here');
  };

  const handleShareBooking = () => {
    if (navigator.share && booking) {
      navigator.share({
        title: `Booking Confirmation - ${booking.bookingNumber}`,
        text: `My Kenya tourism booking is confirmed! Booking #${booking.bookingNumber}`,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Booking link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'We couldn\'t find your booking details.'}</p>
          <Link 
            to="/dashboard" 
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for choosing Kenya Tourism! Your booking has been confirmed and you'll receive 
            a confirmation email shortly.
          </p>
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          {/* Header */}
          <div className="bg-emerald-600 text-white p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Booking #{booking.bookingNumber}</h2>
                <div className="flex items-center space-x-4 text-emerald-100">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(booking.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-3xl font-bold">
                  KSh {booking.totalAmount.toLocaleString()}
                </div>
                <div className="text-emerald-100">
                  {booking.paymentStatus === 'completed' ? 'Payment Confirmed' : 'Payment Pending'}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{booking.contactInfo.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{booking.contactInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{booking.contactInfo.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booked Services */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booked Services</h3>
            <div className="space-y-4">
              {booking.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.serviceName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.serviceName}</h4>
                    <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                    <p className="text-sm text-gray-500">By {item.providerName}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      KSh {(item.price * item.quantity * item.guests).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.quantity} × {item.guests} guests
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Credit Card'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {booking.paymentStatus === 'completed' ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  KSh {booking.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{booking.currency}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <button
            onClick={handleDownloadReceipt}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Receipt</span>
          </button>
          <button
            onClick={handleShareBooking}
            className="border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Share2 className="w-5 h-5" />
            <span>Share Booking</span>
          </button>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center"
        >
          <h3 className="text-xl font-semibold text-blue-900 mb-4">What's Next?</h3>
          <p className="text-blue-800 mb-6">
            Your providers will contact you within 24 hours to confirm details and arrange your experiences. 
            You can track all your bookings in your dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Book More Experiences
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
