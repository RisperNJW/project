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
  Camera,
  Mountain,
  Clock,
  Calendar,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface ExperienceService {
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
  highlights: string[];
  provider: {
    id: string;
    name: string;
    verified: boolean;
  };
  popular: boolean;
}

const Experiences: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Sample experiences data - in production, this would come from API
  const experiences: ExperienceService[] = [
    {
      id: 'exp-1',
      name: 'Masai Mara Big Five Safari',
      description: 'Full-day game drive in the world-famous Masai Mara with expert guide, seeking the Big Five and witnessing the Great Migration.',
      category: 'experiences',
      subcategory: 'safari',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500',
      location: 'Masai Mara National Reserve',
      rating: 4.9,
      reviews: 342,
      duration: 'Full day (8-10 hours)',
      groupSize: '2-6 people',
      highlights: ['Big Five spotting', 'Great Migration viewing', 'Expert guide', 'Lunch included'],
      provider: { id: 'provider-19', name: 'Mara Wildlife Expeditions', verified: true },
      popular: true
    },
    {
      id: 'exp-2',
      name: 'Mount Kenya Hiking Adventure',
      description: 'Multi-day trekking expedition to Point Lenana, Kenya\'s second highest peak, with camping and mountain guide.',
      category: 'experiences',
      subcategory: 'hiking',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=500',
      location: 'Mount Kenya National Park',
      rating: 4.8,
      reviews: 156,
      duration: '3-4 days',
      groupSize: '4-8 people',
      highlights: ['Point Lenana summit', 'Alpine scenery', 'Mountain camping', 'Professional guide'],
      provider: { id: 'provider-20', name: 'Kenya Mountain Adventures', verified: true },
      popular: true
    },
    {
      id: 'exp-3',
      name: 'Maasai Cultural Village Experience',
      description: 'Authentic cultural immersion with Maasai community, traditional dances, village tour, and local crafts workshop.',
      category: 'experiences',
      subcategory: 'cultural',
      price: 6500,
      image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=500',
      location: 'Kajiado County',
      rating: 4.7,
      reviews: 234,
      duration: 'Half day (4-5 hours)',
      groupSize: '2-12 people',
      highlights: ['Traditional dances', 'Village tour', 'Crafts workshop', 'Local lunch'],
      provider: { id: 'provider-21', name: 'Maasai Cultural Center', verified: true },
      popular: true
    },
    {
      id: 'exp-4',
      name: 'Tsavo East Wildlife Photography Safari',
      description: 'Specialized photography safari in Tsavo East with professional photographer guide and equipment support.',
      category: 'experiences',
      subcategory: 'photography',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500',
      location: 'Tsavo East National Park',
      rating: 4.6,
      reviews: 89,
      duration: 'Full day (10-12 hours)',
      groupSize: '2-4 people',
      highlights: ['Photography guidance', 'Equipment support', 'Wildlife tracking', 'Editing tips'],
      provider: { id: 'provider-22', name: 'Kenya Photo Safaris', verified: true },
      popular: false
    },
    {
      id: 'exp-5',
      name: 'Samburu Community Visit & Crafts',
      description: 'Visit authentic Samburu community, learn traditional beadwork, and participate in cultural ceremonies.',
      category: 'experiences',
      subcategory: 'cultural',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      location: 'Samburu County',
      rating: 4.5,
      reviews: 167,
      duration: 'Full day (6-8 hours)',
      groupSize: '3-10 people',
      highlights: ['Beadwork workshop', 'Cultural ceremonies', 'Traditional meals', 'Community interaction'],
      provider: { id: 'provider-23', name: 'Samburu Heritage Tours', verified: false },
      popular: false
    },
    {
      id: 'exp-6',
      name: 'Aberdare Forest Canopy Walk',
      description: 'Guided forest walk through Aberdare canopy with wildlife viewing, bird watching, and nature photography.',
      category: 'experiences',
      subcategory: 'nature',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500',
      location: 'Aberdare National Park',
      rating: 4.4,
      reviews: 123,
      duration: 'Half day (3-4 hours)',
      groupSize: '2-8 people',
      highlights: ['Canopy walkway', 'Bird watching', 'Forest wildlife', 'Nature photography'],
      provider: { id: 'provider-24', name: 'Forest Adventures Kenya', verified: true },
      popular: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Experiences', icon: <Mountain className="w-4 h-4" /> },
    { id: 'safari', name: 'Safari & Game Drives', icon: <Binoculars className="w-4 h-4" /> },
    { id: 'cultural', name: 'Cultural Tours', icon: <Users className="w-4 h-4" /> },
    { id: 'hiking', name: 'Hiking & Trekking', icon: <Mountain className="w-4 h-4" /> },
    { id: 'photography', name: 'Photography Safaris', icon: <Camera className="w-4 h-4" /> },
    { id: 'nature', name: 'Nature & Wildlife', icon: <Mountain className="w-4 h-4" /> }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'budget', name: 'Budget (Under KSh 8,000)', min: 0, max: 8000 },
    { id: 'mid', name: 'Mid-range (KSh 8,000 - 15,000)', min: 8000, max: 15000 },
    { id: 'premium', name: 'Premium (Over KSh 15,000)', min: 15000, max: Infinity }
  ];

  // Filter and sort experiences
  const filteredExperiences = experiences
    .filter(experience => {
      const matchesSearch = experience.name.toLowerCase().includes(search.toLowerCase()) ||
                           experience.description.toLowerCase().includes(search.toLowerCase()) ||
                           experience.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || experience.subcategory === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const range = priceRanges.find(r => r.id === priceRange);
        if (range && 'min' in range && 'max' in range && range.min !== undefined && range.max !== undefined) {
          matchesPrice = experience.price >= range.min && experience.price <= range.max;
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

  const handleAddToCart = async (experience: ExperienceService) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login', { state: { returnTo: '/experiences' } });
      return;
    }

    try {
      await addToCart({
        serviceId: experience.id,
        serviceName: experience.name,
        category: experience.category,
        price: experience.price,
        image: experience.image,
        providerId: experience.provider.id,
        providerName: experience.provider.name,
        quantity: 1,
        guests: 2
      });
      toast.success(`${experience.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const getHighlightIcon = (highlight: string) => {
    if (highlight.toLowerCase().includes('guide')) return <Award className="w-4 h-4" />;
    if (highlight.toLowerCase().includes('photography')) return <Camera className="w-4 h-4" />;
    if (highlight.toLowerCase().includes('wildlife')) return <Binoculars className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
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
              Safari & Adventure Experiences
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Discover Kenya's incredible wildlife, breathtaking landscapes, and rich cultural heritage 
              through unforgettable adventures led by expert local guides.
            </p>
            <div className="flex items-center justify-center space-x-6 text-emerald-200">
              <div className="flex items-center space-x-2">
                <Binoculars className="w-5 h-5" />
                <span>Wildlife Experts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Certified Guides</span>
              </div>
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Photo Opportunities</span>
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
                placeholder="Search experiences, wildlife, locations..."
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
                Found <span className="font-semibold text-emerald-600">{filteredExperiences.length}</span> amazing experiences
              </p>
            </div>
            
            {/* Navigation Helper */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800 font-medium text-sm">Complete Your Adventure Package</span>
              </div>
              <p className="text-emerald-700 text-xs">
                Add experiences to your cart, then explore 
                <Link to="/stays" className="underline hover:text-emerald-800 mx-1">accommodations</Link>
                and
                <Link to="/transport" className="underline hover:text-emerald-800 mx-1">transport</Link>
                for a complete Kenya adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map((experience, idx) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={experience.image}
                    alt={experience.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Popular Badge */}
                  {experience.popular && (
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Popular</span>
                    </div>
                  )}
                  
                  {/* Verification Badge */}
                  {experience.provider.verified && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </div>
                  )}
                  
                  {/* Quick Info Overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{experience.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{experience.groupSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{experience.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{experience.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{experience.rating}</span>
                        <span className="text-gray-500 text-sm">({experience.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{experience.description}</p>
                  
                  {/* Highlights */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {experience.highlights.slice(0, 3).map((highlight, highlightIdx) => (
                        <div 
                          key={highlightIdx}
                          className="flex items-center space-x-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full"
                        >
                          {getHighlightIcon(highlight)}
                          <span>{highlight}</span>
                        </div>
                      ))}
                      {experience.highlights.length > 3 && (
                        <span className="text-xs text-gray-500">+{experience.highlights.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Provider Info */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      By <span className="font-medium text-gray-900">{experience.provider.name}</span>
                      {experience.provider.verified && (
                        <span className="ml-2 text-blue-600 text-xs">✓ Verified</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Pricing and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">KSh {experience.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(experience)}
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
          
          {filteredExperiences.length === 0 && (
            <div className="text-center py-16">
              <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No experiences found</h3>
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
          <h2 className="text-3xl font-bold mb-6">Complete Your Kenya Adventure</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Amazing! You've chosen incredible experiences. Now add accommodations and transport 
            to create your perfect Kenya adventure package.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/stays" 
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Find Accommodations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/transport" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-emerald-600 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Book Transport</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {user && (
              <Link 
                to="/cart" 
                className="bg-emerald-700 text-white px-8 py-3 rounded-lg hover:bg-emerald-800 transition-colors font-medium flex items-center justify-center space-x-2"
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

export default Experiences;
