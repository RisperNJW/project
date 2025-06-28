import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Settings,
  Plus,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';

const ProviderDashboard: React.FC = () => {
  const location = useLocation();
  const [stats] = useState({
    totalServices: 5,
    totalBookings: 23,
    totalRevenue: 8450,
    averageRating: 4.8,
    pendingBookings: 3,
    completedBookings: 20
  });

  const sidebarItems = [
    { path: '/provider', label: 'Overview', icon: BarChart3 },
    { path: '/provider/services', label: 'My Services', icon: MapPin },
    { path: '/provider/bookings', label: 'Bookings', icon: Calendar },
    { path: '/provider/earnings', label: 'Earnings', icon: CreditCard },
    { path: '/provider/settings', label: 'Settings', icon: Settings },
  ];

  const Overview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
        <Link
          to="/provider/services/new"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Service
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">My Services</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
              <p className="text-green-600 text-sm">All active</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-emerald-600" />
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
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              <p className="text-green-600 text-sm">+3 this week</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
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
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-green-600 text-sm">+12% this month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
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
              <p className="text-gray-600 text-sm">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              <p className="text-green-600 text-sm">Excellent rating</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {[
              { service: 'Maasai Mara Safari', customer: 'John Doe', amount: 450, status: 'confirmed' },
              { service: 'Cultural Village Tour', customer: 'Jane Smith', amount: 120, status: 'pending' },
              { service: 'Maasai Mara Safari', customer: 'Mike Johnson', amount: 450, status: 'completed' },
              { service: 'Cultural Village Tour', customer: 'Sarah Wilson', amount: 120, status: 'confirmed' }
            ].map((booking, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{booking.service}</p>
                  <p className="text-sm text-gray-600">{booking.customer} • ${booking.amount}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Service Performance</h2>
          <div className="space-y-4">
            {[
              { name: 'Maasai Mara Safari', bookings: 15, revenue: 6750, rating: 4.9 },
              { name: 'Cultural Village Tour', bookings: 8, revenue: 960, rating: 4.7 },
              { name: 'Mount Kenya Climbing', bookings: 0, revenue: 0, rating: 0 },
            ].map((service, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{service.rating || 'No ratings'}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{service.bookings} bookings</span>
                  <span>${service.revenue.toLocaleString()} revenue</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Provider Panel</h2>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors ${
                location.pathname === item.path ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' : ''
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/services" element={<div>My Services</div>} />
          <Route path="/bookings" element={<div>Bookings Management</div>} />
          <Route path="/earnings" element={<div>Earnings & Analytics</div>} />
          <Route path="/settings" element={<div>Provider Settings</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default ProviderDashboard;