import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, MapPin, ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const navLinks = [
  { name: 'Home', path: '/', description: 'Discover Kenya' },
  { name: 'Explore', path: '/explore', description: 'Plan Your Journey' },
  { name: 'Services', path: '/services', description: 'All Services' },
  { name: 'Stays', path: '/stays', description: 'Accommodations' },
  { name: 'Meals', path: '/meals', description: 'Local Cuisine' },
  { name: 'Transport', path: '/transport', description: 'Get Around' },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md border-b' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex justify-between items-center h-16">
        {/* Logo */}
            <Link to="/" className="flex font-bold gap-2 items-center text-gray-700">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Go2Bookings</span>
            </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <div key={link.name} className="relative group">
                <Link
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'text-emerald-600' 
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  {link.name}
                </Link>
                {/* Tooltip with description */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  {link.description}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/search" 
            className="text-gray-600 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-emerald-50"
            title="Search services"
          >
            <Search size={20} />
          </Link>
          
          {user ? (
            <>
              {/* Cart Icon */}
              <Link 
                to="/cart" 
                className="relative text-gray-600 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-emerald-50"
                title="View cart"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-emerald-50"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <User size={16} />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <Settings size={16} />
                      <span>Profile</span>
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-emerald-700 transition text-sm font-medium px-3 py-2 rounded-lg hover:bg-emerald-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-emerald-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-emerald-700 transition shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/search" className="text-gray-700 hover:text-emerald-600">
            <Search size={22} />
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 py-5 space-y-4 border-t">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-gray-800 font-medium text-lg hover:text-emerald-600 transition"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t space-y-2">
            <Link to="/login" className="block text-gray-600">
              Login
            </Link>
            <Link
              to="/register"
              className="block bg-emerald-600 text-white text-center py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
