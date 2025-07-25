import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  ShoppingCart, 
  ArrowRight,
  Filter,
  Heart,
  Utensils,
  ChefHat,
  Leaf
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface MealService {
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
  preparationTime: string;
  servingSize: string;
  dietary: string[];
  provider: {
    id: string;
    name: string;
    verified: boolean;
  };
  popular: boolean;
}

const Meals: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Sample meal data - in production, this would come from API
  const meals: MealService[] = [
    {
      id: 'meal-1',
      name: 'Authentic Nyama Choma',
      description: 'Perfectly grilled goat meat served with ugali, sukuma wiki, and traditional kachumbari salad.',
      category: 'meals',
      subcategory: 'traditional',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500',
      location: 'Nairobi, Karen',
      rating: 4.8,
      reviews: 156,
      preparationTime: '45 mins',
      servingSize: '2-3 people',
      dietary: ['gluten-free'],
      provider: { id: 'provider-1', name: 'Mama Njeri\'s Kitchen', verified: true },
      popular: true
    },
    {
      id: 'meal-2',
      name: 'Coastal Pilau Feast',
      description: 'Aromatic spiced rice with tender beef, served with coconut beans and fresh mango chutney.',
      category: 'meals',
      subcategory: 'coastal',
      price: 800,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=500',
      location: 'Mombasa, Old Town',
      rating: 4.6,
      reviews: 89,
      preparationTime: '30 mins',
      servingSize: '1-2 people',
      dietary: ['halal'],
      provider: { id: 'provider-2', name: 'Swahili Delights', verified: true },
      popular: true
    },
    {
      id: 'meal-3',
      name: 'Vegetarian Githeri Bowl',
      description: 'Nutritious mix of maize and beans with vegetables, served with avocado and chapati.',
      category: 'meals',
      subcategory: 'vegetarian',
      price: 450,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
      location: 'Nakuru, Town Center',
      rating: 4.4,
      reviews: 67,
      preparationTime: '25 mins',
      servingSize: '1 person',
      dietary: ['vegetarian', 'vegan', 'gluten-free'],
      provider: { id: 'provider-3', name: 'Green Valley Eatery', verified: true },
      popular: false
    },
    {
      id: 'meal-4',
      name: 'Fish Curry & Coconut Rice',
      description: 'Fresh tilapia in rich coconut curry sauce with fragrant basmati rice and naan bread.',
      category: 'meals',
      subcategory: 'coastal',
      price: 950,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
      location: 'Kilifi, Watamu',
      rating: 4.7,
      reviews: 124,
      preparationTime: '35 mins',
      servingSize: '1-2 people',
      dietary: ['pescatarian', 'gluten-free'],
      provider: { id: 'provider-4', name: 'Ocean Breeze Restaurant', verified: true },
      popular: true
    },
    {
      id: 'meal-5',
      name: 'Samosa & Chai Experience',
      description: 'Crispy beef samosas with spiced tea, served with mint chutney and pickled vegetables.',
      category: 'meals',
      subcategory: 'snacks',
      price: 300,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500',
      location: 'Eldoret, Market Street',
      rating: 4.3,
      reviews: 203,
      preparationTime: '15 mins',
      servingSize: '1 person',
      dietary: ['halal'],
      provider: { id: 'provider-5', name: 'Chai Corner', verified: false },
      popular: false
    },
    {
      id: 'meal-6',
      name: 'Mukimo & Meat Stew',
      description: 'Traditional Kikuyu dish of mashed green peas, potatoes, and corn with rich meat stew.',
      category: 'meals',
      subcategory: 'traditional',
      price: 650,
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500',
      location: 'Nyeri, Central Kenya',
      rating: 4.5,
      reviews: 78,
      preparationTime: '40 mins',
      servingSize: '1-2 people',
      dietary: ['gluten-free'],
      provider: { id: 'provider-6', name: 'Heritage Kitchen', verified: true },
      popular: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Meals', icon: <Utensils className="w-4 h-4" /> },
    { id: 'traditional', name: 'Traditional', icon: <ChefHat className="w-4 h-4" /> },
    { id: 'coastal', name: 'Coastal', icon: <Utensils className="w-4 h-4" /> },
    { id: 'vegetarian', name: 'Vegetarian', icon: <Leaf className="w-4 h-4" /> },
    { id: 'snacks', name: 'Snacks & Tea', icon: <Utensils className="w-4 h-4" /> }
  ];

  const dietaryOptions = [
    { id: 'all', name: 'All Dietary' },
    { id: 'vegetarian', name: 'Vegetarian' },
    { id: 'vegan', name: 'Vegan' },
    { id: 'halal', name: 'Halal' },
    { id: 'gluten-free', name: 'Gluten-Free' },
    { id: 'pescatarian', name: 'Pescatarian' }
  ];

  // Filter and sort meals
  const filteredMeals = meals
    .filter(meal => {
      const matchesSearch = meal.name.toLowerCase().includes(search.toLowerCase()) ||
                           meal.description.toLowerCase().includes(search.toLowerCase()) ||
                           meal.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || meal.subcategory === selectedCategory;
      const matchesDietary = selectedDietary === 'all' || meal.dietary.includes(selectedDietary);
      return matchesSearch && matchesCategory && matchesDietary;
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

  const handleAddToCart = async (meal: MealService) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login', { state: { returnTo: '/meals' } });
      return;
    }

    try {
      await addToCart({
        serviceId: meal.id,
        serviceName: meal.name,
        category: meal.category,
        price: meal.price,
        image: meal.image,
        providerId: meal.provider.id,
        providerName: meal.provider.name,
        quantity: 1,
        guests: 1
      });
      toast.success(`${meal.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
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
              Authentic Kenyan Meals
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Discover the rich flavors of Kenya through traditional dishes prepared by local chefs. 
              From coastal delicacies to highland specialties.
            </p>
            <div className="flex items-center justify-center space-x-6 text-emerald-200">
              <div className="flex items-center space-x-2">
                <ChefHat className="w-5 h-5" />
                <span>Local Chefs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Authentic Recipes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5" />
                <span>Fresh Ingredients</span>
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
                placeholder="Search meals, locations, or cuisines..."
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
            
            {/* Dietary Filter */}
            <select
              value={selectedDietary}
              onChange={(e) => setSelectedDietary(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {dietaryOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
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
                Found <span className="font-semibold text-emerald-600">{filteredMeals.length}</span> delicious meals
              </p>
            </div>
            
            {/* Navigation Helper */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800 font-medium text-sm">Building Your Kenya Experience</span>
              </div>
              <p className="text-emerald-700 text-xs">
                Add meals to your cart, then explore 
                <Link to="/stays" className="underline hover:text-emerald-800 mx-1">stays</Link>
                and
                <Link to="/transport" className="underline hover:text-emerald-800 mx-1">transport</Link>
                for a complete trip package.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meals Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMeals.map((meal, idx) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Popular Badge */}
                  {meal.popular && (
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Popular</span>
                    </div>
                  )}
                  
                  {/* Verification Badge */}
                  {meal.provider.verified && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </div>
                  )}
                  
                  {/* Quick Info Overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{meal.preparationTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{meal.servingSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{meal.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{meal.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{meal.rating}</span>
                        <span className="text-gray-500 text-sm">({meal.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{meal.description}</p>
                  
                  {/* Dietary Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {meal.dietary.slice(0, 2).map((diet, dietIdx) => (
                        <span 
                          key={dietIdx}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full capitalize"
                        >
                          {diet}
                        </span>
                      ))}
                      {meal.dietary.length > 2 && (
                        <span className="text-xs text-gray-500">+{meal.dietary.length - 2} more</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Provider Info */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      By <span className="font-medium text-gray-900">{meal.provider.name}</span>
                      {meal.provider.verified && (
                        <span className="ml-2 text-blue-600 text-xs">✓ Verified</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Pricing and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">KSh {meal.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">per serving</p>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(meal)}
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
          
          {filteredMeals.length === 0 && (
            <div className="text-center py-16">
              <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No meals found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters to find more options.</p>
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setSelectedDietary('all');
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
          <h2 className="text-3xl font-bold mb-6">Complete Your Kenya Experience</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            You've found amazing meals! Now add accommodations and transport to create 
            your perfect Kenya adventure package.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/stays" 
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Explore Stays</span>
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

export default Meals;
