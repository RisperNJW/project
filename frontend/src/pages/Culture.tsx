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
  Music,
  Palette,
  Clock,
  Calendar,
  Award,
  Heart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface CulturalService {
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
  culturalElements: string[];
  provider: {
    id: string;
    name: string;
    verified: boolean;
  };
  popular: boolean;
}

const Culture: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Featured artisans data - matches Home page artisans
  const featuredArtisans = [
    {
      id: 'artisan-1',
      name: 'Mary Sankale',
      craft: 'Maasai Beadwork',
      location: 'Kajiado County',
      specialty: 'Traditional Jewelry',
      description: 'Master beadworker creating intricate jewelry that tells stories through colors and patterns, using techniques passed down through generations.',
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500',
      workshopPrice: 4000,
      rating: 4.8,
      reviews: 156,
      verified: true
    },
    {
      id: 'artisan-2', 
      name: 'Samuel Mwangi',
      craft: 'Kikuyu Wood Carving',
      location: 'Central Kenya',
      specialty: 'Wildlife Sculptures',
      description: 'Renowned wood carver specializing in wildlife sculptures and functional art pieces from indigenous Kenyan woods.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      workshopPrice: 5500,
      rating: 4.7,
      reviews: 203,
      verified: true
    },
    {
      id: 'artisan-3',
      name: 'Fatuma Ali', 
      craft: 'Coastal Makuti Weaving',
      location: 'Lamu Island',
      specialty: 'Palm Weaving',
      description: 'Expert in traditional palm leaf weaving, creating beautiful baskets, mats, and decorative items that showcase coastal heritage.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      workshopPrice: 3500,
      rating: 4.6,
      reviews: 134,
      verified: true
    }
  ];

  // Sample cultural experiences data - in production, this would come from API
  const culturalExperiences: CulturalService[] = [
    {
      id: 'culture-1',
      name: 'Maasai Manyatta Village Experience',
      description: 'Authentic immersion in Maasai culture with traditional ceremonies, warrior training, and community storytelling.',
      category: 'culture',
      subcategory: 'village-visit',
      price: 7500,
      image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=500',
      location: 'Kajiado County',
      rating: 4.8,
      reviews: 267,
      duration: 'Full day (6-8 hours)',
      groupSize: '2-15 people',
      culturalElements: ['Traditional ceremonies', 'Warrior training', 'Community stories', 'Traditional meals'],
      provider: { id: 'provider-31', name: 'Maasai Cultural Heritage', verified: true },
      popular: true
    },
    {
      id: 'culture-2',
      name: 'Lamu Old Town Heritage Walk',
      description: 'UNESCO World Heritage site tour through ancient Swahili architecture, traditional crafts, and local markets.',
      category: 'culture',
      subcategory: 'heritage-site',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=500',
      location: 'Lamu Old Town',
      rating: 4.7,
      reviews: 189,
      duration: 'Half day (4-5 hours)',
      groupSize: '3-12 people',
      culturalElements: ['Swahili architecture', 'Traditional crafts', 'Local markets', 'Historical stories'],
      provider: { id: 'provider-32', name: 'Lamu Heritage Foundation', verified: true },
      popular: true
    },
    {
      id: 'culture-3',
      name: 'Kikuyu Traditional Music & Dance',
      description: 'Interactive workshop learning traditional Kikuyu music, dance, and instruments with local cultural group.',
      category: 'culture',
      subcategory: 'music-dance',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
      location: 'Kiambu County',
      rating: 4.6,
      reviews: 145,
      duration: 'Half day (3-4 hours)',
      groupSize: '4-20 people',
      culturalElements: ['Traditional music', 'Dance lessons', 'Instrument making', 'Cultural stories'],
      provider: { id: 'provider-33', name: 'Kikuyu Cultural Center', verified: true },
      popular: true
    },
    {
      id: 'culture-4',
      name: 'Turkana Pastoralist Life Experience',
      description: 'Learn traditional pastoralist lifestyle with cattle herding, traditional crafts, and desert survival skills.',
      category: 'culture',
      subcategory: 'lifestyle-immersion',
      price: 9500,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      location: 'Turkana County',
      rating: 4.5,
      reviews: 78,
      duration: 'Full day (8-10 hours)',
      groupSize: '2-8 people',
      culturalElements: ['Cattle herding', 'Traditional crafts', 'Desert skills', 'Community interaction'],
      provider: { id: 'provider-34', name: 'Turkana Cultural Tours', verified: false },
      popular: false
    },
    {
      id: 'culture-5',
      name: 'Kisii Soapstone Carving Workshop',
      description: 'Hands-on workshop learning traditional soapstone carving techniques with master craftsmen in Kisii.',
      category: 'culture',
      subcategory: 'crafts-workshop',
      price: 5500,
      image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500',
      location: 'Kisii County',
      rating: 4.4,
      reviews: 123,
      duration: 'Full day (5-6 hours)',
      groupSize: '2-10 people',
      culturalElements: ['Soapstone carving', 'Master craftsmen', 'Traditional techniques', 'Take-home art'],
      provider: { id: 'provider-35', name: 'Kisii Artisan Collective', verified: true },
      popular: false
    },
    // Featured Artisan Workshops - Direct connection to Home page artisans
    {
      id: 'culture-mary',
      name: 'Maasai Beadwork Workshop with Mary Sankale',
      description: 'Learn traditional Maasai beadwork directly from master artisan Mary Sankale. Create your own jewelry while learning the cultural significance of colors and patterns.',
      category: 'culture',
      subcategory: 'crafts-workshop',
      price: 4000,
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500',
      location: 'Kajiado County',
      rating: 4.8,
      reviews: 156,
      duration: 'Half day (4-5 hours)',
      groupSize: '2-8 people',
      culturalElements: ['Traditional beadwork', 'Cultural storytelling', 'Color symbolism', 'Take-home jewelry'],
      provider: { id: 'provider-mary', name: 'Mary Sankale Artisan Studio', verified: true },
      popular: true
    },
    {
      id: 'culture-samuel',
      name: 'Wood Carving Masterclass with Samuel Mwangi',
      description: 'Join renowned wood carver Samuel Mwangi in his workshop to learn traditional Kikuyu carving techniques and create your own wildlife sculpture.',
      category: 'culture',
      subcategory: 'crafts-workshop',
      price: 5500,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      location: 'Central Kenya',
      rating: 4.7,
      reviews: 203,
      duration: 'Full day (6-7 hours)',
      groupSize: '2-6 people',
      culturalElements: ['Wood selection', 'Carving techniques', 'Wildlife symbolism', 'Finishing methods'],
      provider: { id: 'provider-samuel', name: 'Mwangi Wood Art Studio', verified: true },
      popular: true
    },
    {
      id: 'culture-fatuma',
      name: 'Makuti Weaving Workshop with Fatuma Ali',
      description: 'Experience the ancient art of palm leaf weaving with master weaver Fatuma Ali on beautiful Lamu Island. Learn coastal traditions and create functional art.',
      category: 'culture',
      subcategory: 'crafts-workshop',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      location: 'Lamu Island',
      rating: 4.6,
      reviews: 134,
      duration: 'Half day (4-5 hours)',
      groupSize: '3-10 people',
      culturalElements: ['Palm preparation', 'Weaving patterns', 'Coastal heritage', 'Functional crafts'],
      provider: { id: 'provider-fatuma', name: 'Lamu Traditional Crafts', verified: true },
      popular: true
    },
    {
      id: 'culture-6',
      name: 'Samburu Beadwork & Storytelling',
      description: 'Learn traditional Samburu beadwork patterns and meanings while listening to ancient oral traditions.',
      category: 'culture',
      subcategory: 'crafts-workshop',
      price: 4000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      location: 'Samburu County',
      rating: 4.6,
      reviews: 156,
      duration: 'Half day (4-5 hours)',
      groupSize: '3-12 people',
      culturalElements: ['Beadwork patterns', 'Cultural meanings', 'Oral traditions', 'Handmade jewelry'],
      provider: { id: 'provider-36', name: 'Samburu Women Collective', verified: true },
      popular: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Cultural Experiences', icon: <Heart className="w-4 h-4" /> },
    { id: 'village-visit', name: 'Village Visits', icon: <Users className="w-4 h-4" /> },
    { id: 'heritage-site', name: 'Heritage Sites', icon: <Camera className="w-4 h-4" /> },
    { id: 'music-dance', name: 'Music & Dance', icon: <Music className="w-4 h-4" /> },
    { id: 'crafts-workshop', name: 'Arts & Crafts', icon: <Palette className="w-4 h-4" /> },
    { id: 'lifestyle-immersion', name: 'Lifestyle Immersion', icon: <Heart className="w-4 h-4" /> }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'budget', name: 'Budget (Under KSh 5,000)', min: 0, max: 5000 },
    { id: 'mid', name: 'Mid-range (KSh 5,000 - 7,500)', min: 5000, max: 7500 },
    { id: 'premium', name: 'Premium (Over KSh 7,500)', min: 7500, max: Infinity }
  ];

  // Filter and sort cultural experiences
  const filteredCulture = culturalExperiences
    .filter(culture => {
      const matchesSearch = culture.name.toLowerCase().includes(search.toLowerCase()) ||
                           culture.description.toLowerCase().includes(search.toLowerCase()) ||
                           culture.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || culture.subcategory === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const range = priceRanges.find(r => r.id === priceRange);
        if (range && 'min' in range && 'max' in range && range.min !== undefined && range.max !== undefined) {
          matchesPrice = culture.price >= range.min && culture.price <= range.max;
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

  const handleAddToCart = async (culture: CulturalService) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login', { state: { returnTo: '/culture' } });
      return;
    }

    try {
      await addToCart({
        serviceId: culture.id,
        serviceName: culture.name,
        category: culture.category,
        price: culture.price,
        image: culture.image,
        providerId: culture.provider.id,
        providerName: culture.provider.name,
        quantity: 1,
        guests: 2
      });
      toast.success(`${culture.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const getCulturalElementIcon = (element: string) => {
    if (element.toLowerCase().includes('music')) return <Music className="w-4 h-4" />;
    if (element.toLowerCase().includes('craft')) return <Palette className="w-4 h-4" />;
    if (element.toLowerCase().includes('dance')) return <Music className="w-4 h-4" />;
    if (element.toLowerCase().includes('story')) return <Camera className="w-4 h-4" />;
    return <Heart className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cultural Heritage Tours
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Immerse yourself in Kenya's rich cultural tapestry through authentic community experiences, 
              traditional arts, and time-honored customs passed down through generations.
            </p>
            <div className="flex items-center justify-center space-x-6 text-purple-200">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Authentic Experiences</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Community-Led</span>
              </div>
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Traditional Arts</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Artisans Section - Connected to Home Page */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Meet Our Master Artisans</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Learn directly from Kenya's most skilled craftspeople. Each artisan brings generations 
                of knowledge and offers hands-on workshops where you can create your own masterpiece.
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredArtisans.map((artisan, i) => (
              <motion.div
                key={artisan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={artisan.image}
                    alt={artisan.craft}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-lg font-bold">{artisan.name}</div>
                    <div className="text-sm text-gray-200">{artisan.location}</div>
                  </div>
                  {artisan.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                      <Award className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{artisan.craft}</h3>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                      {artisan.specialty}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {artisan.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{artisan.rating}</span>
                      <span className="text-sm text-gray-500">({artisan.reviews} reviews)</span>
                    </div>
                    <div className="text-lg font-bold text-amber-600">
                      KSh {artisan.workshopPrice.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Scroll to workshops section and filter by this artisan
                      const workshopsSection = document.getElementById('workshops-section');
                      if (workshopsSection) {
                        workshopsSection.scrollIntoView({ behavior: 'smooth' });
                        setSearch(artisan.name);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-6 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2 group"
                  >
                    <span>Book Workshop</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Learn from Our Artisans?</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Master Craftspeople</h4>
                  <p className="text-sm text-gray-600">Learn from recognized experts with decades of experience</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cultural Stories</h4>
                  <p className="text-sm text-gray-600">Discover the meaning and history behind each craft</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Community Impact</h4>
                  <p className="text-sm text-gray-600">Support local communities and preserve traditions</p>
                </div>
              </div>
            </motion.div>
          </div>
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
                placeholder="Search cultural experiences, communities, traditions..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {priceRanges.map(range => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                Found <span className="font-semibold text-purple-600">{filteredCulture.length}</span> cultural experiences
              </p>
            </div>
            
            {/* Navigation Helper */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingCart className="w-4 h-4 text-purple-600" />
                <span className="text-purple-800 font-medium text-sm">Enrich Your Cultural Journey</span>
              </div>
              <p className="text-purple-700 text-xs">
                Add cultural experiences to your cart, then explore 
                <Link to="/stays" className="underline hover:text-purple-800 mx-1">cultural accommodations</Link>
                and
                <Link to="/meals" className="underline hover:text-purple-800 mx-1">traditional meals</Link>
                for an immersive cultural adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Experiences Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCulture.map((culture, idx) => (
              <motion.div
                key={culture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={culture.image}
                    alt={culture.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Popular Badge */}
                  {culture.popular && (
                    <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Popular</span>
                    </div>
                  )}
                  
                  {/* Verification Badge */}
                  {culture.provider.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </div>
                  )}
                  
                  {/* Quick Info Overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{culture.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{culture.groupSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{culture.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{culture.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{culture.rating}</span>
                        <span className="text-gray-500 text-sm">({culture.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{culture.description}</p>
                  
                  {/* Cultural Elements */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {culture.culturalElements.slice(0, 3).map((element, elementIdx) => (
                        <div 
                          key={elementIdx}
                          className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                        >
                          {getCulturalElementIcon(element)}
                          <span>{element}</span>
                        </div>
                      ))}
                      {culture.culturalElements.length > 3 && (
                        <span className="text-xs text-gray-500">+{culture.culturalElements.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Provider Info */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      By <span className="font-medium text-gray-900">{culture.provider.name}</span>
                      {culture.provider.verified && (
                        <span className="ml-2 text-green-600 text-xs">✓ Verified</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Pricing and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">KSh {culture.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(culture)}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 font-medium"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{!user ? 'Sign in to Add' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredCulture.length === 0 && (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No cultural experiences found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters to find more options.</p>
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="bg-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Complete Your Cultural Journey</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Wonderful! You've chosen meaningful cultural experiences. Now add traditional accommodations 
            and local transport to create an authentic Kenya cultural adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/stays" 
              className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Find Cultural Stays</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/meals" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-purple-600 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Try Traditional Meals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {user && (
              <Link 
                to="/cart" 
                className="bg-purple-700 text-white px-8 py-3 rounded-lg hover:bg-purple-800 transition-colors font-medium flex items-center justify-center space-x-2"
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

export default Culture;
