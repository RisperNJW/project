import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  Users, 
  ShoppingCart, 
  ArrowRight,
  Car,
  Bike,
  Bus,
  Plane,
  Clock,
  Shield,
  Fuel,
  Route
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface TransportService {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  capacity: string;
  duration: string;
  features: string[];
  provider: {
    id: string;
    name: string;
    verified: boolean;
  };
  popular: boolean;
}

const Transport: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Sample transport data - in production, this would come from API
  const transports: TransportService[] = [
    {
      id: 'transport-1',
      name: 'Airport Transfer - Luxury SUV',
      description: 'Comfortable airport pickup and drop-off service in luxury SUV with professional driver and complimentary refreshments.',
      category: 'transport',
      subcategory: 'transfer',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500',
      location: 'Nairobi - JKIA Airport',
      rating: 4.8,
      reviews: 234,
      capacity: '1-4 passengers',
      duration: '45 mins',
      features: ['air-conditioning', 'wifi', 'luggage-space', 'professional-driver'],
      provider: { id: 'provider-13', name: 'Elite Transport Kenya', verified: true },
      popular: true
    },
    {
      id: 'transport-2',
      name: 'Safari Game Drive Vehicle',
      description: 'Open-roof 4WD safari vehicle with experienced guide for wildlife viewing in national parks and reserves.',
      category: 'transport',
      subcategory: 'safari',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500',
      location: 'Masai Mara & National Parks',
      rating: 4.9,
      reviews: 189,
      capacity: '6-8 passengers',
      duration: 'Full day',
      features: ['open-roof', 'experienced-guide', '4wd', 'wildlife-viewing'],
      provider: { id: 'provider-14', name: 'Mara Safari Tours', verified: true },
      popular: true
    },
    {
      id: 'transport-3',
      name: 'Coastal Shuttle Service',
      description: 'Daily shuttle service between Nairobi and coastal destinations with comfortable seating and refreshment stops.',
      category: 'transport',
      subcategory: 'shuttle',
      price: 2200,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500',
      location: 'Nairobi - Mombasa Route',
      rating: 4.5,
      reviews: 156,
      capacity: '14-20 passengers',
      duration: '8-10 hours',
      features: ['air-conditioning', 'refreshments', 'comfort-seats', 'scheduled-stops'],
      provider: { id: 'provider-15', name: 'Coast Express', verified: true },
      popular: true
    },
    {
      id: 'transport-4',
      name: 'City Tour Matatu Experience',
      description: 'Authentic Kenyan matatu ride with local guide showcasing Nairobi\'s vibrant street culture and music.',
      category: 'transport',
      subcategory: 'cultural',
      price: 800,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      location: 'Nairobi City Center',
      rating: 4.3,
      reviews: 89,
      capacity: '12-14 passengers',
      duration: '2-3 hours',
      features: ['local-guide', 'cultural-experience', 'music', 'street-food-stops'],
      provider: { id: 'provider-16', name: 'Urban Culture Tours', verified: false },
      popular: false
    },
    {
      id: 'transport-5',
      name: 'Private Car Rental - 4WD',
      description: 'Self-drive 4WD vehicle rental with GPS navigation, insurance, and 24/7 roadside assistance for independent exploration.',
      category: 'transport',
      subcategory: 'rental',
      price: 5500,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      location: 'Multiple Pickup Locations',
      rating: 4.6,
      reviews: 267,
      capacity: '5 passengers',
      duration: 'Per day',
      features: ['gps-navigation', 'insurance', 'roadside-assistance', 'fuel-efficient'],
      provider: { id: 'provider-17', name: 'Kenya Car Rentals', verified: true },
      popular: false
    },
    {
      id: 'transport-6',
      name: 'Boda Boda City Tours',
      description: 'Exciting motorcycle taxi tours through Nairobi\'s neighborhoods with experienced riders and safety gear provided.',
      category: 'transport',
      subcategory: 'adventure',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      location: 'Nairobi Various Routes',
      rating: 4.4,
      reviews: 134,
      capacity: '1-2 passengers',
      duration: '1-2 hours',
      features: ['safety-gear', 'experienced-rider', 'flexible-routes', 'photo-stops'],
      provider: { id: 'provider-18', name: 'Boda Adventures', verified: true },
      popular: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Transport', icon: <Car className="w-4 h-4" /> },
    { id: 'transfer', name: 'Airport Transfers', icon: <Plane className="w-4 h-4" /> },
    { id: 'safari', name: 'Safari Vehicles', icon: <Route className="w-4 h-4" /> },
    { id: 'shuttle', name: 'Shuttle Services', icon: <Bus className="w-4 h-4" /> },
    { id: 'rental', name: 'Car Rentals', icon: <Car className="w-4 h-4" /> },
    { id: 'cultural', name: 'Cultural Tours', icon: <Bus className="w-4 h-4" /> },
    { id: 'adventure', name: 'Adventure Rides', icon: <Bike className="w-4 h-4" /> }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'budget', name: 'Budget (Under KSh 2,000)', min: 0, max: 2000 },
    { id: 'mid', name: 'Mid-range (KSh 2,000 - 5,000)', min: 2000, max: 5000 },
    { id: 'premium', name: 'Premium (Over KSh 5,000)', min: 5000, max: Infinity }
  ];

  // Filter and sort transports
  const filteredTransports = transports
    .filter(transport => {
      const matchesSearch = transport.name.toLowerCase().includes(search.toLowerCase()) ||
                           transport.description.toLowerCase().includes(search.toLowerCase()) ||
                           transport.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || transport.subcategory === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const range = priceRanges.find(r => r.id === priceRange);
        if (range && 'min' in range && 'max' in range && range.min !== undefined && range.max !== undefined) {
          matchesPrice = transport.price >= range.min && transport.price <= range.max;
        }
      }
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'popular': return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        default: return 0;
      }
    });

  const handleAddToCart = async (transport: TransportService) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login', { state: { returnTo: '/transport' } });
      return;
    }

    try {
      await addToCart({
        serviceId: transport.id,
        serviceName: transport.name,
        category: transport.category,
        price: transport.price,
        image: transport.image,
        providerId: transport.provider.id,
        providerName: transport.provider.name,
        quantity: 1,
        guests: 2
      });
      toast.success(`${transport.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'air-conditioning': return <Fuel className="w-4 h-4" />;
      case 'wifi': return <Shield className="w-4 h-4" />;
      case 'professional-driver': return <Users className="w-4 h-4" />;
      case 'safety-gear': return <Shield className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Reliable Transport Solutions
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              From airport transfers to safari adventures, discover safe and comfortable 
              transport options that connect you to every corner of Kenya.
            </p>
            <div className="flex items-center justify-center space-x-6 text-emerald-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Safety First</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Trusted Drivers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Route className="w-5 h-5" />
                <span>All Destinations</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transport services, routes, or destinations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {priceRanges.map(range => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results Count and Navigation Helper */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-gray-600">
                Found <span className="font-semibold text-emerald-600">{filteredTransports.length}</span> transport options
              </p>
            </div>
            
            {/* Navigation Helper */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800 font-medium text-sm">Final Step: Complete Your Package</span>
              </div>
              <p className="text-emerald-700 text-xs">
                Add transport to complete your Kenya experience with 
                <Link to="/meals" className="underline hover:text-emerald-800 mx-1">meals</Link>
                and
                <Link to="/stays" className="underline hover:text-emerald-800 mx-1">accommodations</Link>
                in one seamless booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transport Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTransports.map((transport, idx) => (
              <motion.div
                key={transport.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={transport.image}
                    alt={transport.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Popular Badge */}
                  {transport.popular && (
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Popular</span>
                    </div>
                  )}
                  
                  {/* Verification Badge */}
                  {transport.provider.verified && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </div>
                  )}
                  
                  {/* Quick Info Overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{transport.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{transport.capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{transport.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{transport.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{transport.rating}</span>
                        <span className="text-gray-500 text-sm">({transport.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{transport.description}</p>
                  
                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {transport.features.slice(0, 3).map((feature, featureIdx) => (
                        <div 
                          key={featureIdx}
                          className="flex items-center space-x-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {getFeatureIcon(feature)}
                          <span className="capitalize">{feature.replace('-', ' ')}</span>
                        </div>
                      ))}
                      {transport.features.length > 3 && (
                        <span className="text-xs text-gray-500">+{transport.features.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Provider Info */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      By <span className="font-medium text-gray-900">{transport.provider.name}</span>
                      {transport.provider.verified && (
                        <span className="ml-2 text-blue-600 text-xs">✓ Verified</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Pricing and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">KSh {transport.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">per service</p>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(transport)}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 font-medium"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{!user ? 'Sign in to Add' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredTransports.length === 0 && (
            <div className="text-center py-16">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No transport options found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters to find more options.</p>
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                }}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Your Kenya Adventure Awaits!</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Excellent! You've planned your transport. Now review your complete Kenya experience 
            package and proceed to secure your bookings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link 
                  to="/cart" 
                  className="bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Review Cart & Checkout</span>
                </Link>
                <Link 
                  to="/meals" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-emerald-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <span>Add More Meals</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/stays" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-emerald-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <span>Browse Stays</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <span>Sign Up to Book</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/login" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-emerald-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <span>Already have an account?</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Transport;
