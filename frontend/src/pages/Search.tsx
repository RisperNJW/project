import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter, MapPin, Star, Users, Calendar } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    priceRange: '',
    rating: ''
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      // Simulate search API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock search results
      const mockResults = [
        {
          id: 1,
          name: 'Maasai Mara Safari Adventure',
          category: 'Safari',
          location: 'Maasai Mara',
          price: 15000,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          description: 'Experience the Great Migration and Big Five in Kenya\'s most famous reserve'
        },
        {
          id: 2,
          name: 'Diani Beach Resort',
          category: 'Accommodation',
          location: 'Diani Beach',
          price: 8500,
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          description: 'Luxury beachfront resort with pristine white sand beaches'
        },
        {
          id: 3,
          name: 'Traditional Nyama Choma',
          category: 'Food',
          location: 'Nairobi',
          price: 1200,
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          description: 'Authentic Kenyan grilled meat experience with local sides'
        }
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.location.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const navigateToService = (result: any) => {
    switch (result.category.toLowerCase()) {
      case 'safari':
        navigate('/services');
        break;
      case 'accommodation':
        navigate('/stays');
        break;
      case 'food':
        navigate('/meals');
        break;
      default:
        navigate('/services');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Kenya Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect experiences, accommodations, meals, and transport for your Kenyan adventure
          </p>
        </div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for safaris, hotels, restaurants, transport..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Categories</option>
                <option value="safari">Safari</option>
                <option value="accommodation">Accommodation</option>
                <option value="food">Food & Dining</option>
                <option value="transport">Transport</option>
                <option value="culture">Cultural</option>
                <option value="beach">Beach</option>
              </select>
              
              <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Locations</option>
                <option value="nairobi">Nairobi</option>
                <option value="mombasa">Mombasa</option>
                <option value="maasai-mara">Maasai Mara</option>
                <option value="diani">Diani Beach</option>
                <option value="nakuru">Nakuru</option>
              </select>
              
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Any Price</option>
                <option value="0-1000">Under KSh 1,000</option>
                <option value="1000-5000">KSh 1,000 - 5,000</option>
                <option value="5000-15000">KSh 5,000 - 15,000</option>
                <option value="15000+">KSh 15,000+</option>
              </select>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <SearchIcon className="h-4 w-4" />
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Search Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Found {searchResults.length} results for "{searchQuery}"
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
                  onClick={() => navigateToService(result)}
                >
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        {result.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{result.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{result.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{result.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{result.location}</span>
                      </div>
                      <div className="text-lg font-semibold text-emerald-600">
                        KSh {result.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : searchQuery && !loading ? (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
