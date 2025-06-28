import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
// import clsx from 'clsx';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false); // close menu on route change
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/services' },
    { name: 'Stays', path: '/stays' },
    { name: 'Meals', path: '/meals' },
    { name: 'Transport', path: '/transport' },
  ];

  return (
    <header
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-emerald-600 tracking-tight">
          Go2Bookings<span className="text-emerald-400">.KE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/login"
            className="ml-6 text-gray-700 hover:text-emerald-600 transition"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="ml-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
          >
            Sign up
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block text-gray-700 font-medium hover:text-emerald-600"
            >
              {item.name}
            </Link>
          ))}
          <hr className="border-gray-200" />
          <Link
            to="/login"
            className="block text-gray-700 hover:text-emerald-600 font-medium"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="block bg-emerald-600 text-white text-center py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
