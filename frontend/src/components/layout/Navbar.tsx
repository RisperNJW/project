import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search,MapPin } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Explore', path: '/explore' },
  { name: 'Services', path: '/services' },
  { name: 'Stays', path: '/stays' },
  { name: 'Meals', path: '/meals' },
  { name: 'Transport', path: '/transport' },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

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
        <nav className="hidden md:flex items-center space-x-8 text-[15px]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-800 hover:text-emerald-600 transition font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/search" className="text-gray-600 hover:text-emerald-600">
            <Search size={20} />
          </Link>
          <Link
            to="/login"
            className="text-gray-600 hover:text-emerald-700 transition text-sm"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-emerald-600 text-white px-4 py-1.5 text-sm rounded-full hover:bg-emerald-700 transition"
          >
            Sign up
          </Link>
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
