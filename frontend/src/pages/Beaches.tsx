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
  Waves,
  Anchor,
  Sun,
  Clock,
  Calendar,
  Award,
  Fish
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface BeachService {
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
  duration: string;
  groupSize: string;
  activities: string[];
  provider: {
    id: string;
    name: string;
    verified: boolean;
  };
  popular: boolean;
}

const Beaches: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Sample beach experiences data - in production, this would come from API
  const beachExperiences: BeachService[] = [
    {
      id: 'beach-1',
      name: 'Diani Beach Water Sports Package',
      description: 'Full day of water sports including jet skiing, parasailing, and banana boat rides on pristine Diani Beach.',
      category: 'beaches',
      subcategory: 'watersports',
      price: 8500,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500',
      location: 'Diani Beach, Kwale',
      rating: 4.8,
      reviews: 245,
      duration: 'Full day (6-8 hours)',
      groupSize: '2-8 people',
      activities: ['Jet skiing', 'Parasailing', 'Banana boat', 'Snorkeling'],
      provider: { id: 'provider-25', name: 'Diani Water Adventures', verified: true },
      popular: true
    },
    {
      id: 'beach-2',
      name: 'Wasini Island Dolphin Tour',
      description: 'Dhow sailing trip to Wasini Island with dolphin watching, snorkeling at Kisite Marine Park, and seafood lunch.',
      category: 'beaches',
      subcategory: 'island-tour',
      price: 6500,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
      location: 'Wasini Island, Kwale',
      rating: 4.7,
      reviews: 189,
      duration: 'Full day (8-10 hours)',
      groupSize: '4-12 people',
      activities: ['Dolphin watching', 'Snorkeling', 'Dhow sailing', 'Seafood lunch'],
      provider: { id: 'provider-26', name: 'Wasini Island Tours', verified: true },
      popular: true
    },
    {
      id: 'beach-3',
      name: 'Malindi Deep Sea Fishing',
      description: 'Professional deep sea fishing expedition with experienced crew, equipment provided, and catch preparation.',
      category: 'beaches',
      subcategory: 'fishing',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      location: 'Malindi Marine',
      rating: 4.6,
      reviews: 134,
      duration: 'Half day (4-6 hours)',
      groupSize: '2-6 people',
      activities: ['Deep sea fishing', 'Equipment included', 'Catch preparation', 'Professional crew'],
      provider: { id: 'provider-27', name: 'Malindi Fishing Charters', verified: true },
      popular: true
    },
    {
      id: 'beach-4',
      name: 'Watamu Marine Park Snorkeling',
      description: 'Guided snorkeling tour in Watamu Marine National Park with coral reef exploration and marine life spotting.',
      category: 'beaches',
      subcategory: 'snorkeling',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=500',
      location: 'Watamu Marine Park',
      rating: 4.5,
      reviews: 178,
      duration: 'Half day (3-4 hours)',
      groupSize: '2-10 people',
      activities: ['Coral reef snorkeling', 'Marine life spotting', 'Equipment provided', 'Guide included'],
      provider: { id: 'provider-28', name: 'Watamu Marine Tours', verified: true },
      popular: false
    },
    {
      id: 'beach-5',
      name: 'Lamu Dhow Sunset Cruise',
      description: 'Traditional dhow sailing experience around Lamu archipelago with sunset views and Swahili cultural stories.',
      category: 'beaches',
      subcategory: 'cultural-cruise',
      price: 5500,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      location: 'Lamu Archipelago',
      rating: 4.8,
      reviews: 156,
      duration: 'Half day (3-4 hours)',
      groupSize: '4-15 people',
      activities: ['Traditional dhow sailing', 'Sunset viewing', 'Cultural stories', 'Refreshments'],
      provider: { id: 'provider-29', name: 'Lamu Cultural Dhows', verified: true },
      popular: false
    },
    {
      id: 'beach-6',
      name: 'Kilifi Creek Kayaking Adventure',
      description: 'Mangrove kayaking through Kilifi Creek with bird watching, local village visit, and traditional lunch.',
      category: 'beaches',
      subcategory: 'kayaking',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      location: 'Kilifi Creek',
      rating: 4.4,
      reviews: 89,
      duration: 'Half day (4-5 hours)',
      groupSize: '2-8 people',
      activities: ['Mangrove kayaking', 'Bird watching', 'Village visit', 'Traditional lunch'],
      provider: { id: 'provider-30', name: 'Kilifi Eco Adventures', verified: false },
      popular: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Beach Activities', icon: <Waves className="w-4 h-4" /> },
    { id: 'watersports', name: 'Water Sports', icon: <Waves className="w-4 h-4" /> },
    { id: 'island-tour', name: 'Island Tours', icon: <Anchor className="w-4 h-4" /> },
    { id: 'fishing', name: 'Deep Sea Fishing', icon: <Fish className="w-4 h-4" /> },
    { id: 'snorkeling', name: 'Snorkeling & Diving', icon: <Fish className="w-4 h-4" /> },
    { id: 'cultural-cruise', name: 'Cultural Cruises', icon: <Anchor className="w-4 h-4" /> },
    { id: 'kayaking', name: 'Kayaking & Eco Tours', icon: <Waves className="w-4 h-4" /> }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'budget', name: 'Budget (Under KSh 5,000)', min: 0, max: 5000 },
    { id: 'mid', name: 'Mid-range (KSh 5,000 - 8,000)', min: 5000, max: 8000 },
    { id: 'premium', name: 'Premium (Over KSh 8,000)', min: 8000, max: Infinity }
  ];

  // Filter and sort beach experiences
  const filteredBeaches = beachExperiences
    .filter(beach => {
      const matchesSearch = beach.name.toLowerCase().includes(search.toLowerCase()) ||
                           beach.description.toLowerCase().includes(search.toLowerCase()) ||
                           beach.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || beach.subcategory === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const range = priceRanges.find(r => r.id === priceRange);
        if (range && 'min' in range && 'max' in range && range.min !== undefined && range.max !== undefined) {
          matchesPrice = beach.price >= range.min && beach.price <= range.max;
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

  const handleAddToCart = async (beach: BeachService) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login', { state: { returnTo: '/beaches' } });
      return;
    }

    try {
      await addToCart({
        serviceId: beach.id,
        serviceName: beach.name,
        category: beach.category,
        price: beach.price,
        image: beach.image,
        providerId: beach.provider.id,
        providerName: beach.provider.name,
        quantity: 1,
        guests: 2
      });
      toast.success(`${beach.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const getActivityIcon = (activity: string) => {
    if (activity.toLowerCase().includes('snorkeling')) return <Fish className="w-4 h-4" />;
    if (activity.toLowerCase().includes('sailing')) return <Anchor className="w-4 h-4" />;
    if (activity.toLowerCase().includes('fishing')) return <Fish className="w-4 h-4" />;
    return <Waves className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Coastal Beach Escapes
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Discover Kenya's stunning Indian Ocean coastline through thrilling water sports, 
              cultural dhow cruises, and pristine marine park adventures.
            </p>
            <div className="flex items-center justify-center space-x-6 text-blue-200">
              <div className="flex items-center space-x-2">
                <Waves className="w-5 h-5" />
                <span>Crystal Clear Waters</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="w-5 h-5" />
                <span>Year-Round Sunshine</span>
              </div>
              <div className="flex items-center space-x-2">
                <Fish className="w-5 h-5" />
                <span>Rich Marine Life</span>
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
                placeholder="Search beach activities, islands, water sports..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priceRanges.map(range => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Found <span className="font-semibold text-blue-600">{filteredBeaches.length}</span> coastal experiences
              </p>
            </div>
            
            {/* Navigation Helper */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 font-medium text-sm">Build Your Coastal Adventure</span>
              </div>
              <p className="text-blue-700 text-xs">
                Add beach experiences to your cart, then explore 
                <Link to="/stays" className="underline hover:text-blue-800 mx-1">beachfront stays</Link>
                and
                <Link to="/transport" className="underline hover:text-blue-800 mx-1">coastal transport</Link>
                for the perfect beach getaway.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beach Experiences Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBeaches.map((beach, idx) => (
              <motion.div
                key={beach.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={beach.image}
                    alt={beach.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Popular Badge */}
                  {beach.popular && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Popular</span>
                    </div>
                  )}
                  
                  {/* Verification Badge */}
                  {beach.provider.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </div>
                  )}
                  
                  {/* Quick Info Overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{beach.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{beach.groupSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{beach.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{beach.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{beach.rating}</span>
                        <span className="text-gray-500 text-sm">({beach.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{beach.description}</p>
                  
                  {/* Activities */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {beach.activities.slice(0, 3).map((activity, activityIdx) => (
                        <div 
                          key={activityIdx}
                          className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {getActivityIcon(activity)}
                          <span>{activity}</span>
                        </div>
                      ))}
                      {beach.activities.length > 3 && (
                        <span className="text-xs text-gray-500">+{beach.activities.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Provider Info */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      By <span className="font-medium text-gray-900">{beach.provider.name}</span>
                      {beach.provider.verified && (
                        <span className="ml-2 text-green-600 text-xs">✓ Verified</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Pricing and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">KSh {beach.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(beach)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{!user ? 'Sign in to Add' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredBeaches.length === 0 && (
            <div className="text-center py-16">
              <Waves className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No beach experiences found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters to find more options.</p>
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Complete Your Coastal Getaway</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Fantastic! You've chosen amazing beach experiences. Now add beachfront accommodations 
            and coastal transport to complete your perfect seaside adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/stays" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Find Beachfront Stays</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/transport" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Book Coastal Transport</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {user && (
              <Link 
                to="/cart" 
                className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>View Cart</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Beaches;
