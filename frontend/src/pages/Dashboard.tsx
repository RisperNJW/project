import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Star, 
  Clock, 
  CreditCard,
  User,
  Settings,
  Heart,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Booking {
  id: string;
  bookingId: string;
  service: {
    title: string;
    image: string;
    location: string;
    category: string;
  };
  startDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  guests: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, activeTab, searchTerm]);

  const fetchBookings = async () => {
    try {
      // Mock data - replace with API call
      const mockBookings: Booking[] = [
        {
          id: '1',
          bookingId: 'BK-2024-001',
          service: {
            title: 'Maasai Mara Safari Adventure',
            image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg',
            location: 'Maasai Mara, Kenya',
            category: 'safari'
          },
          startDate: '2024-04-15',
          status: 'confirmed',
          totalAmount: 900,
          guests: 2,
          paymentStatus: 'completed'
        },
        {
          id: '2',
          bookingId: 'BK-2024-002',
          service: {
            title: 'Diani Beach Paradise',
            image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
            location: 'Diani Beach, Kenya',
            category: 'beach'
          },
          startDate: '2024-03-20',
          status: 'completed',
          totalAmount: 360,
          guests: 2,
          paymentStatus: 'completed'
        },
        {
          id: '3',
          bookingId: 'BK-2024-003',
          service: {
            title: 'Mount Kenya Climbing',
            image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
            location: 'Mount Kenya, Kenya',
            category: 'mountain'
          },
          startDate: '2024-05-10',
          status: 'pending',
          totalAmount: 640,
          guests: 2,
          paymentStatus: 'pending'
        }
      ];

      setTimeout(() => {
        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(booking => booking.status === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your bookings and explore new adventures
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming Trips</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${bookings.reduce((sum, b) => sum + b.totalAmount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Loyalty Points</p>
                <p className="text-2xl font-bold text-gray-900">1,250</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              to="/services"
              className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Search className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-emerald-700">Browse Services</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <User className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-700">Edit Profile</span>
            </Link>
            <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Heart className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-700">Favorites</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Settings</span>
            </button>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-0">My Bookings</h2>
            
            {/* Search */}
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'all', label: 'All' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Start exploring our amazing services!'}
                </p>
                <Link
                  to="/services"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Browse Services
                </Link>
              </div>
            ) : (
              filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={booking.service.image}
                      alt={booking.service.title}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {booking.service.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPin size={16} />
                            {booking.service.location}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={16} />
                            {new Date(booking.startDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="text-right mt-4 md:mt-0">
                          <div className="text-2xl font-bold text-gray-900 mb-2">
                            ${booking.totalAmount}
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <span className={`text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                              Payment: {booking.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Booking ID: {booking.bookingId}</span>
                          <span>Guests: {booking.guests}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-sm">
                            View Details
                          </button>
                          {booking.status === 'completed' && (
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1">
                              <Download size={14} />
                              Receipt
                            </button>
                          )}
                          {booking.status === 'pending' && booking.paymentStatus === 'pending' && (
                            <Link
                              to={`/payment/${booking.bookingId}`}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                            >
                              Complete Payment
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;