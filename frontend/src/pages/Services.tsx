import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Bed, 
  Utensils, 
  Car, 
  Mountain, 
  Waves, 
  Camera,
  Star,
  Users,
  MapPin,
  ArrowRight,
  Shield,
  Award,
  TrendingUp
} from 'lucide-react';

const serviceCategories = [
  {
    id: "stays",
    name: "Stays & Accommodation",
    description: "From luxury beach resorts to authentic safari lodges - verified accommodations with detailed amenities.",
    link: "/stays",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
    icon: <Bed className="w-8 h-8" />,
    subcategories: ["Beach Resorts", "Safari Lodges", "City Hotels", "Eco Lodges", "Boutique Hotels", "Tented Camps"],
    priceRange: "KSh 4,500 - 15,000/night",
    providerCount: 45,
    popular: true,
    color: "emerald"
  },
  {
    id: "meals",
    name: "Authentic Kenyan Meals",
    description: "Traditional and coastal cuisines from verified local chefs with dietary options and cultural stories.",
    link: "/meals",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500",
    icon: <Utensils className="w-8 h-8" />,
    subcategories: ["Traditional Dishes", "Coastal Cuisine", "Vegetarian Options", "Snacks & Tea", "Cultural Dining"],
    priceRange: "KSh 300 - 1,200/serving",
    providerCount: 32,
    popular: true,
    color: "orange"
  },
  {
    id: "transport",
    name: "Reliable Transport Solutions",
    description: "Safe and comfortable transport from airport transfers to safari adventures with trusted drivers.",
    link: "/transport",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500",
    icon: <Car className="w-8 h-8" />,
    subcategories: ["Airport Transfers", "Safari Vehicles", "Shuttle Services", "Car Rentals", "Cultural Tours", "Adventure Rides"],
    priceRange: "KSh 800 - 8,000/service",
    providerCount: 28,
    popular: true,
    color: "blue"
  },
  {
    id: "experiences",
    name: "Safari & Adventures",
    description: "Wildlife encounters, cultural immersion, and outdoor adventures across Kenya's diverse landscapes.",
    link: "/experiences",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500",
    icon: <Mountain className="w-8 h-8" />,
    subcategories: ["Game Drives", "Cultural Tours", "Hiking Expeditions", "Photography Safaris", "Community Visits"],
    priceRange: "KSh 5,000 - 20,000/day",
    providerCount: 38,
    popular: false,
    color: "green"
  },
  {
    id: "beaches",
    name: "Coastal Beach Escapes",
    description: "Pristine beaches, water sports, and island adventures along Kenya's stunning Indian Ocean coastline.",
    link: "/beaches",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500",
    icon: <Waves className="w-8 h-8" />,
    subcategories: ["Water Sports", "Island Tours", "Deep Sea Fishing", "Snorkeling & Diving", "Cultural Cruises"],
    priceRange: "KSh 3,000 - 12,000/day",
    providerCount: 22,
    popular: false,
    color: "cyan"
  },
  {
    id: "culture",
    name: "Cultural Heritage Tours",
    description: "Immerse yourself in Kenya's rich traditions, local communities, and authentic cultural experiences.",
    link: "/culture",
    image: "https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=500",
    icon: <Camera className="w-8 h-8" />,
    subcategories: ["Village Visits", "Traditional Markets", "Arts & Crafts Workshops", "Music & Dance", "Historical Sites"],
    priceRange: "KSh 2,000 - 8,000/experience",
    providerCount: 19,
    popular: false,
    color: "purple"
  }
];

export default function Services() {
  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; border: string; hover: string } } = {
      emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-200', hover: 'hover:bg-emerald-700' },
      orange: { bg: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:bg-orange-700' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-700' },
      green: { bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-200', hover: 'hover:bg-green-700' },
      cyan: { bg: 'bg-cyan-600', text: 'text-cyan-600', border: 'border-cyan-200', hover: 'hover:bg-cyan-700' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-700' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">Discover Kenya's Best</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Your gateway to authentic Kenyan experiences - from luxury accommodations to cultural adventures, 
              all curated by local experts and verified providers.
            </p>
            <div className="flex items-center justify-center space-x-8 text-blue-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Quality Assured</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Growing Network</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Verified Providers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">6</div>
              <div className="text-gray-600">Service Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600">Available Services</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Travel Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From accommodation to cultural experiences, we've curated the best Kenya has to offer. 
              Each category features verified providers and detailed service information.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((service, index) => {
              const colors = getColorClasses(service.color);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Popular Badge */}
                    {service.popular && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span>Popular</span>
                      </div>
                    )}
                    
                    {/* Icon and Title Overlay */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 ${colors.bg} rounded-lg`}>
                          {service.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{service.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-200">
                            <Users className="w-4 h-4" />
                            <span>{service.providerCount} providers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                    
                    {/* Price Range */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Price Range:</span>
                        <span className={`font-semibold ${colors.text}`}>{service.priceRange}</span>
                      </div>
                    </div>
                    
                    {/* Subcategories */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Available Services:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.subcategories.slice(0, 4).map((sub, idx) => (
                          <span
                            key={idx}
                            className={`text-xs ${colors.text} bg-${service.color}-50 border ${colors.border} px-2 py-1 rounded-full`}
                          >
                            {sub}
                          </span>
                        ))}
                        {service.subcategories.length > 4 && (
                          <span className="text-xs text-gray-500">+{service.subcategories.length - 4} more</span>
                        )}
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <Link
                      to={service.link}
                      className={`w-full ${colors.bg} text-white py-3 px-6 rounded-lg ${colors.hover} transition-colors font-medium text-center block flex items-center justify-center space-x-2 group`}
                    >
                      <span>Explore {service.name.split(' ')[0]}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Provider Onboarding CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Provider Network</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Are you a service provider in Kenya? Join our growing network of verified providers 
            and reach thousands of travelers looking for authentic experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/onboard" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
            >
              Become a Provider
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-gray-600 text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our curated services, add them to your cart, and create the perfect Kenyan adventure. 
            Our verified providers are ready to make your trip unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/stays" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Start with Accommodation
            </Link>
            <Link 
              to="/experiences" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium"
            >
              Explore Adventures
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
