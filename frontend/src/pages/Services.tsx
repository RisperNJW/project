import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const services = [
  {
    name: "Stays",
    description: "From cozy lodges to coastal Airbnbs across Kenya.",
    link: "/stays",
    image: "https://images.unsplash.com/photo-1590490352118-8a9e7dc4f0f3",
    subcategories: ["Airbnb Stays", "Luxury Hotels", "Lodges & Camps", "Guest Houses"],
  },
  {
    name: "Meals",
    description: "Explore authentic Kenyan cuisine and local flavors.",
    link: "/meals",
    image: "https://images.unsplash.com/photo-1564758866816-86a092b8fadc",
    subcategories: ["Traditional Meals", "Fine Dining", "Local Delicacies", "Farm-to-Table"],
  },
  {
    name: "Transport",
    description: "Book rides, airport shuttles, or safari 4x4s.",
    link: "/transport",
    image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34",
    subcategories: ["Car Rentals", "Airport Transfers", "Tour Vans", "Boda Boda"],
  },
];

export default function Services() {
  return (
    <section className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <div className="bg-emerald-50 py-16 px-4 sm:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover Services that Power Your Kenyan Journey
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          From beautiful places to stay, meals to savor, to ways to explore — we connect you with local providers offering unforgettable experiences.
        </p>
      </div>

      {/* Gateway Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-12 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl shadow-lg overflow-hidden bg-white border"
          >
            <Link to={service.link}>
              <img
                src={service.image}
                alt={service.name}
                className="h-56 md:h-64 lg:h-72 w-full object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-emerald-700">
                  {service.name}
                </h2>
                <p className="text-gray-600">{service.description}</p>

                {service.subcategories.length > 0 && (
                  <ul className="mt-4 text-sm text-gray-700 space-y-1">
                    {service.subcategories.map((sub, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-500">•</span> {sub}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 text-emerald-600 font-medium">
                  Explore &rarr;
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Steps Section */}
      <div className="bg-emerald-50 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-emerald-900 mb-4">Go2bookings Explore</h2>
          <p className="text-lg text-emerald-800 mb-12">
            Simple steps to explore authentic Kenyan adventures.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-emerald-900 mb-2">1. Choose Your Path</h4>
              <p className="text-gray-700">
                Select from categories like safaris, beaches, stays, meals, or culture.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-emerald-900 mb-2">2. Explore Local Providers</h4>
              <p className="text-gray-700">
                Browse curated services from passionate Kenyans across the country.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-emerald-900 mb-2">3. Book & Enjoy</h4>
              <p className="text-gray-700">
                Reserve your experience and embrace Kenya your way.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Onboarding CTA */}
      <div className="py-20 px-6 text-center bg-white">
        <h3 className="text-2xl font-bold mb-4">On board as a Provider</h3>
        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
          Whether you run a guesthouse, offer meals, or provide transport — join our platform and reach travelers seeking authentic Kenyan experiences.
        </p>
        <Link
          to="/onboard"
          className="inline-block bg-emerald-600 text-white py-3 px-6 rounded-full shadow hover:bg-emerald-700 transition"
        >
          Get Started as a Provider
        </Link>
      </div>
    </section>
  );
}
