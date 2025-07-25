import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'All Services', path: '/services' },
      { label: 'Explore Kenya', path: '/explore' },
      { label: 'Cultural Heritage Tours', path: '/culture' },
      { label: 'Coastal Beach Escapes', path: '/beaches' },
    ],
    transport: [
      { label: 'Transport Services', path: '/transport' },
      { label: 'Car Rentals', path: '/transport#car-rentals' },
      { label: 'Airport Transfers', path: '/transport#transfers' },
      { label: 'Safari Transport', path: '/transport#safari' },
    ],
    meals: [
      { label: 'Kenyan Cuisine', path: '/meals' },
      { label: 'Traditional Dishes', path: '/meals#traditional' },
      { label: 'Coastal Cuisine', path: '/meals#coastal' },
      { label: 'Local Restaurants', path: '/meals#restaurants' },
    ],
    stay: [
      { label: 'Accommodations', path: '/stays' },
      { label: 'Safari Lodges', path: '/stays#lodges' },
      { label: 'Beach Resorts', path: '/stays#resorts' },
      { label: 'City Hotels', path: '/stays#hotels' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'Accessibility', path: '/accessibility' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Go2Bookings</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Discover the magic of Kenya through authentic experiences—from safaris and culture
              to unforgettable meals and warm stays.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">info@go2bookings.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Service Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Transport</h3>
            <ul className="space-y-2">
              {footerLinks.transport.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Meals</h3>
            <ul className="space-y-2">
              {footerLinks.meals.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stay</h3>
            <ul className="space-y-2">
              {footerLinks.stay.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-300">
                Get the latest travel tips, exclusive offers, and destination insights.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <span>© {currentYear} Go2Bookings. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>in Kenya</span>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
