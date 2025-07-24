import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mountain,
  Waves,
  Camera,
  Utensils,
  Bed,
  Car,
  ArrowRight,
  MapPin,
  Star,
  Users,
  Calendar,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { totalItems } = useCart();

  // Service categories data - represents the 6 main cards that match actual page content
  const serviceCategories = [
    {
      id: 'stays',
      icon: <Bed className="w-8 h-8 mb-3 text-white" />,
      title: 'Stays & Accommodation',
      description: 'From luxury beach resorts to authentic safari lodges - find verified accommodations with detailed amenities',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      path: '/stays',
      features: ['Beach Resorts', 'Safari Lodges', 'City Hotels', 'Eco Lodges', 'Boutique Hotels', 'Tented Camps'],
      startingPrice: 'KSh 4,500 - 15,000/night',
      popular: true
    },
    {
      id: 'meals',
      icon: <Utensils className="w-8 h-8 mb-3 text-white" />,
      title: 'Authentic Kenyan Meals',
      description: 'Discover traditional and coastal cuisines from verified local chefs with dietary options and cultural stories',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      path: '/meals',
      features: ['Traditional Dishes', 'Coastal Cuisine', 'Vegetarian Options', 'Snacks & Tea', 'Cultural Dining'],
      startingPrice: 'KSh 300 - 1,200/serving',
      popular: true
    },
    {
      id: 'transport',
      icon: <Car className="w-8 h-8 mb-3 text-white" />,
      title: 'Reliable Transport Solutions',
      description: 'Safe and comfortable transport from airport transfers to safari adventures with trusted drivers',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      path: '/transport',
      features: ['Airport Transfers', 'Safari Vehicles', 'Shuttle Services', 'Car Rentals', 'Cultural Tours', 'Adventure Rides'],
      startingPrice: 'KSh 800 - 8,000/service',
      popular: true
    },
    {
      id: 'experiences',
      icon: <Mountain className="w-8 h-8 mb-3 text-white" />,
      title: 'Safari & Adventures',
      description: 'Wildlife encounters, cultural immersion, and outdoor adventures across Kenya\'s diverse landscapes',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      path: '/services?category=experiences',
      features: ['Game Drives', 'Cultural Tours', 'Hiking Expeditions', 'Photography Safaris', 'Community Visits'],
      startingPrice: 'KSh 5,000 - 20,000/day',
      popular: false
    },
    {
      id: 'beaches',
      icon: <Waves className="w-8 h-8 mb-3 text-white" />,
      title: 'Coastal Beach Escapes',
      description: 'Pristine beaches, water sports, and island adventures along Kenya\'s stunning Indian Ocean coastline',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      path: '/beaches',
      features: ['Beach Resorts', 'Water Sports', 'Island Excursions', 'Diving & Snorkeling', 'Dhow Cruises'],
      startingPrice: 'KSh 3,000 - 12,000/day',
      popular: false
    },
    {
      id: 'culture',
      icon: <Camera className="w-8 h-8 mb-3 text-white" />,
      title: 'Cultural Heritage Tours',
      description: 'Immerse yourself in Kenya\'s rich traditions, local communities, and authentic cultural experiences',
      image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      path: '/culture',
      features: ['Village Visits', 'Traditional Markets', 'Art & Crafts Workshops', 'Music & Dance', 'Historical Sites'],
      startingPrice: 'KSh 2,000 - 8,000/experience',
      popular: false
    }
  ];

  const handleServiceNavigation = (service: any) => {
    // Coordinated navigation logic - guide users based on their journey stage
    if (!user) {
      // For non-authenticated users, show login prompt with context
      navigate('/login', { 
        state: { 
          returnTo: service.path,
          context: `Continue to explore ${service.title.toLowerCase()}` 
        }
      });
    } else {
      // For authenticated users, navigate directly to service
      navigate(service.path);
    }
  };

  const handleStartJourney = () => {
    if (!user) {
      navigate('/register', { 
        state: { 
          returnTo: '/explore',
          context: 'Start planning your Kenya adventure'
        }
      });
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Immersive Video */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="https://cdn.pixabay.com/video/2025/02/06/256964_large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center px-6 text-white max-w-4xl"
          >
            <h1 className="text-3xl md:text-6xl font-extrabold mb-4 leading-tight">
              One Platform. Complete Kenya Experience.
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              No more juggling multiple websites. Plan your entire Kenya adventure in one place — from safari lodges to local experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartJourney}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>{user ? 'Continue Planning' : 'Start Your Journey'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              {user && totalItems > 0 && (
                <Link
                  to="/cart"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-4 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>View Cart ({totalItems})</span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement & Solution */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold mb-6 text-gray-900"
            >
              End the Travel Planning Struggle
            </motion.h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Stop juggling multiple websites and scattered bookings. Our platform connects you directly with local providers, 
              letting you plan your complete Kenya experience in one place — from safari lodges to authentic meals to cultural experiences.
            </p>
          </div>
          
          {/* User Journey Indicators */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-gray-600">Browse curated experiences from verified local providers</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Plan</h3>
              <p className="text-gray-600">Add stays, meals, and experiences to your trip cart</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book</h3>
              <p className="text-gray-600">Complete your entire trip with one secure checkout</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Coordinated Service Categories - The 6 Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold mb-6 text-gray-900"
            >
              Everything You Need for Your Kenya Adventure
            </motion.h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse our curated services from verified local providers. Each category connects you to authentic experiences 
              while supporting Kenya's tourism community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                onClick={() => handleServiceNavigation(service)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Popular</span>
                    </div>
                  )}
                  
                  {/* Icon and Title Overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    {service.icon}
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                  
                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {service.features.slice(0, 3).map((feature, featureIdx) => (
                        <span 
                          key={featureIdx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {service.features.length > 3 && (
                        <span className="text-xs text-gray-500">+{service.features.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Pricing and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-lg font-bold text-emerald-600">{service.startingPrice}</p>
                    </div>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 group-hover:bg-emerald-700">
                      <span className="text-sm font-medium">
                        {!user ? 'Sign in to Book' : 'Explore'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Navigation Helper */}
          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Users className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-800 font-medium">Pro Tip</span>
              </div>
              <p className="text-emerald-700 text-sm leading-relaxed">
                {!user 
                  ? "Create an account to add services to your trip cart and plan your complete Kenya experience in one booking."
                  : "Add multiple services to your cart to create a complete Kenya experience package with coordinated bookings."
                }
              </p>
              {!user && (
                <Link 
                  to="/register" 
                  className="inline-flex items-center space-x-2 mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  <span>Get started now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Local Artisans Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Crafted by Kenya</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the talented hands behind Kenya's most beautiful crafts. Each piece tells a story 
                of heritage, skill, and the vibrant spirit of our local communities.
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Maasai Beadwork",
                description: "Intricate jewelry and accessories that tell stories through colors and patterns, handcrafted by Maasai women using traditional techniques.",
                image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500",
                artisan: "Mary Sankale",
                location: "Kajiado County",
                specialty: "Traditional Jewelry"
              },
              {
                title: "Kikuyu Wood Carving",
                description: "Beautiful sculptures and functional art pieces carved from indigenous woods, representing wildlife and cultural symbols of Kenya.",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
                artisan: "Samuel Mwangi",
                location: "Central Kenya",
                specialty: "Wildlife Sculptures"
              },
              {
                title: "Coastal Makuti Weaving",
                description: "Traditional palm leaf weaving creating baskets, mats, and decorative items that showcase the coastal heritage of Kenya.",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
                artisan: "Fatuma Ali",
                location: "Lamu Island",
                specialty: "Palm Weaving"
              }
            ].map((artisan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={artisan.image}
                    alt={artisan.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-sm font-medium">{artisan.artisan}</div>
                    <div className="text-xs text-gray-200">{artisan.location}</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-gray-900">{artisan.title}</h4>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                      {artisan.specialty}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {artisan.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Handcrafted</span> • <span>Authentic</span>
                    </div>
                    <button className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors">
                      Learn More →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link 
                to="/culture" 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-medium text-lg group shadow-lg hover:shadow-xl"
              >
                <span>Meet All Our Artisans</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">
                Support local communities • Authentic craftsmanship • Cultural heritage
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-emerald-600 text-white py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto px-6"
        >
          <h2 className="text-4xl font-bold mb-6">Plan Your Journey Today</h2>
          <p className="text-lg mb-8">
            Begin your adventure through Kenya with trusted partners, easy bookings, and magical experiences.
          </p>
          <Link
            to="/services"
            className="bg-white text-emerald-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Explore Services
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
