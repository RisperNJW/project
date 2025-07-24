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
  Wifi,
  Car,
  Coffee,
  Bed,
  Mountain,
  Waves,
  TreePine,
  Building
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface StayService {
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
  amenities: string[];
  provider: {
    id: string;
    name: string;
    verified: boolean;
  };
  popular: boolean;
}

const Stays: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Sample stays data - in production, this would come from API
  const stays: StayService[] = [
    {
      id: 'stay-1',
      name: 'Diani Beach Resort & Spa',
      description: 'Luxury beachfront resort with pristine white sand beaches, world-class spa, and authentic Swahili architecture.',
      category: 'stays',
      subcategory: 'resort',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500',
      location: 'Diani Beach, Kwale',
      rating: 4.8,
      reviews: 324,
      capacity: '2-4 guests',
      amenities: ['wifi', 'pool', 'spa', 'restaurant', 'beach-access', 'parking'],
      provider: { id: 'provider-7', name: 'Coastal Retreats Kenya', verified: true },
      popular: true
    },
    {
      id: 'stay-2',
      name: 'Mount Kenya Safari Lodge',
      description: 'Spectacular mountain lodge with panoramic views of Mount Kenya, wildlife viewing, and cozy fireplaces.',
      category: 'stays',
      subcategory: 'lodge',
      price: 8500,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
      location: 'Mount Kenya, Nanyuki',
      rating: 4.7,
      reviews: 189,
      capacity: '1-3 guests',
      amenities: ['wifi', 'restaurant', 'wildlife-viewing', 'fireplace', 'parking'],
      provider: { id: 'provider-8', name: 'Highland Adventures', verified: true },
      popular: true
    },
    {
      id: 'stay-3',
      name: 'Masai Mara Luxury Tented Camp',
      description: 'Authentic safari experience in luxury tents with private bathrooms, overlooking the great migration route.',
      category: 'stays',
      subcategory: 'camp',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500',
      location: 'Masai Mara, Narok',
      rating: 4.9,
      reviews: 267,
      capacity: '2 guests',
      amenities: ['restaurant', 'game-drives', 'private-bathroom', 'wildlife-viewing'],
      provider: { id: 'provider-9', name: 'Mara Wilderness Camps', verified: true },
      popular: true
    },
    {
      id: 'stay-4',
      name: 'Nairobi City Center Hotel',
      description: 'Modern business hotel in the heart of Nairobi with contemporary amenities and easy access to attractions.',
      category: 'stays',
      subcategory: 'hotel',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500',
      location: 'Nairobi CBD',
      rating: 4.3,
      reviews: 445,
      capacity: '1-2 guests',
      amenities: ['wifi', 'gym', 'restaurant', 'business-center', 'parking'],
      provider: { id: 'provider-10', name: 'Urban Hospitality Group', verified: true },
      popular: false
    },
    {
      id: 'stay-5',
      name: 'Lake Nakuru Eco Lodge',
      description: 'Sustainable eco-lodge overlooking Lake Nakuru with bird watching opportunities and organic gardens.',
      category: 'stays',
      subcategory: 'eco-lodge',
      price: 6000,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500',
      location: 'Lake Nakuru, Nakuru',
      rating: 4.5,
      reviews: 156,
      capacity: '2-4 guests',
      amenities: ['wifi', 'restaurant', 'bird-watching', 'organic-garden', 'eco-friendly'],
      provider: { id: 'provider-11', name: 'Green Kenya Lodges', verified: true },
      popular: false
    },
    {
      id: 'stay-6',
      name: 'Lamu Old Town Boutique Hotel',
      description: 'Historic Swahili house converted into charming boutique hotel in UNESCO World Heritage Lamu Old Town.',
      category: 'stays',
      subcategory: 'boutique',
      price: 7500,
      image: 'https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=500',
      location: 'Lamu Old Town, Lamu',
      rating: 4.6,
      reviews: 98,
      capacity: '2-3 guests',
      amenities: ['wifi', 'restaurant', 'cultural-tours', 'rooftop-terrace', 'historic'],
      provider: { id: 'provider-12', name: 'Heritage Hospitality', verified: false },
      popular: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Stays', icon: <Bed className="w-4 h-4" /> },
    { id: 'resort', name: 'Beach Resorts', icon: <Waves className="w-4 h-4" /> },
    { id: 'lodge', name: 'Safari Lodges', icon: <Mountain className="w-4 h-4" /> },
    { id: 'camp', name: 'Tented Camps', icon: <TreePine className="w-4 h-4" /> },
    { id: 'hotel', name: 'City Hotels', icon: <Building className="w-4 h-4" /> },
    { id: 'eco-lodge', name: 'Eco Lodges', icon: <TreePine className="w-4 h-4" /> },
    { id: 'boutique', name: 'Boutique Hotels', icon: <Building className="w-4 h-4" /> }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'budget', name: 'Budget (Under KSh 5,000)', min: 0, max: 5000 },
    { id: 'mid', name: 'Mid-range (KSh 5,000 - 10,000)', min: 5000, max: 10000 },
    { id: 'luxury', name: 'Luxury (Over KSh 10,000)', min: 10000, max: Infinity }
  ];

  // Filter and sort stays
  const filteredStays = stays
    .filter(stay => {
      const matchesSearch = stay.name.toLowerCase().includes(search.toLowerCase()) ||
                           stay.description.toLowerCase().includes(search.toLowerCase()) ||
                           stay.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || stay.subcategory === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const range = priceRanges.find(r => r.id === priceRange);
        if (range && 'min' in range && 'max' in range) {
          matchesPrice = stay.price >= range.min && stay.price <= range.max;
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

  const handleAddToCart = async (stay: StayService) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login', { state: { returnTo: '/stays' } });
      return;
    }

    try {
      await addToCart({
        serviceId: stay.id,
        serviceName: stay.name,
        category: stay.category,
        price: stay.price,
        image: stay.image,
        providerId: stay.provider.id,
        providerName: stay.provider.name,
        quantity: 1,
        guests: 2
      });
      toast.success(`${stay.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      case 'restaurant': return <Coffee className="w-4 h-4" />;
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
              Exceptional Places to Stay
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              From luxury beach resorts to authentic safari lodges, discover accommodations 
              that enhance your Kenya experience with comfort and local charm.
            </p>
            <div className="flex items-center justify-center space-x-6 text-emerald-200">
              <div className="flex items-center space-x-2">
                <Bed className="w-5 h-5" />
                <span>Comfort Guaranteed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Verified Properties</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mountain className="w-5 h-5" />
                <span>Unique Locations</span>
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
                placeholder="Search accommodations, locations, or amenities..."
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
                Found <span className="font-semibold text-emerald-600">{filteredStays.length}</span> amazing places to stay
              </p>
            </div>
            
            {/* Navigation Helper */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800 font-medium text-sm">Complete Your Trip Package</span>
              </div>
              <p className="text-emerald-700 text-xs">
                Add accommodations to your cart, then explore 
                <Link to="/meals" className="underline hover:text-emerald-800 mx-1">meals</Link>
                and
                <Link to="/transport" className="underline hover:text-emerald-800 mx-1">transport</Link>
                for a seamless Kenya experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stays Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStays.map((stay, idx) => (
              <motion.div
                key={stay.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Popular Badge */}
                  {stay.popular && (
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Popular</span>
                    </div>
                  )}
                  
                  {/* Verification Badge */}
                  {stay.provider.verified && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </div>
                  )}
                  
                  {/* Capacity Overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-1 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{stay.capacity}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{stay.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{stay.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{stay.rating}</span>
                        <span className="text-gray-500 text-sm">({stay.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{stay.description}</p>
                  
                  {/* Amenities */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {stay.amenities.slice(0, 4).map((amenity, amenityIdx) => (
                        <div 
                          key={amenityIdx}
                          className="flex items-center space-x-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {getAmenityIcon(amenity)}
                          <span className="capitalize">{amenity.replace('-', ' ')}</span>
                        </div>
                      ))}
                      {stay.amenities.length > 4 && (
                        <span className="text-xs text-gray-500">+{stay.amenities.length - 4} more</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Provider Info */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      By <span className="font-medium text-gray-900">{stay.provider.name}</span>
                      {stay.provider.verified && (
                        <span className="ml-2 text-blue-600 text-xs">✓ Verified</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Pricing and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">KSh {stay.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">per night</p>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(stay)}
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
          
          {filteredStays.length === 0 && (
            <div className="text-center py-16">
              <Bed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No accommodations found</h3>
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
            Perfect! You've secured your accommodation. Now add dining and transport 
            to create a seamless Kenya experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/meals" 
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Explore Meals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/transport" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-emerald-600 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Find Transport</span>
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

export default Stays;
