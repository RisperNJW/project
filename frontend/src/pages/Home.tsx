import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mountain,
  Waves,
  Camera,
  Utensils,
  Bed,
  Car,
  Hand
} from 'lucide-react';

const Home: React.FC = () => {
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
              Welcome and discover the beauty of our mother land
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              Explore the soul of Africa — its people, culture, wildlife, and hidden treasures
            </p>
            <Link
              to="/Explore"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors"
            >
              Start Exploring
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Storytelling Section */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-6"
          >
            Discover the Heart of Kenya
          </motion.h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Kenya is more than just a destination — it's a storybook of wild beauty, ancient culture,
            rich flavors, and welcoming smiles. Whether you're tracking the Big Five on a golden savannah,
            walking barefoot on Diani’s white sands, savoring a Swahili dish in Lamu, or learning crafts
            from local artisans — you’re part of something timeless.
          </p>
        </div>
      </section>

      {/* Visual Sections for Core Services */}
      <section className="grid md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto py-20">
        {[
          {
            icon: <Mountain className="w-10 h-10 mb-3 text-white" />,
            title: 'Safari Adventures',
            text: 'Track wildlife across iconic landscapes like the Maasai Mara and Tsavo.',
            image: 'https://cdn.pixabay.com/photo/2019/08/08/05/34/landscape-4391967_1280.jpg',
          },
          {
            icon: <Waves className="w-10 h-10 mb-3 text-white" />,
            title: 'Beach Escapes',
            text: 'Relax on serene coastlines from Diani to Watamu.',
            image: 'https://cdn.pixabay.com/photo/2019/03/13/09/15/africa-4052510_1280.jpg',
          },
          {
            icon: <Camera className="w-10 h-10 mb-3 text-white" />,
            title: 'Cultural Immersion',
            text: 'Experience Kenya’s diversity through music, dance, and heritage.',
            image: 'https://cdn.pixabay.com/photo/2019/07/29/21/15/warrior-4371555_1280.jpg',
          },
          {
            icon: <Utensils className="w-10 h-10 mb-3 text-white" />,
            title: 'Local Cuisine',
            text: 'Taste authentic Kenyan dishes across regions and cultures.',
            image: 'https://cdn.pixabay.com/photo/2021/10/16/12/51/steak-6714964_1280.jpg',
          },
          {
            icon: <Bed className="w-10 h-10 mb-3 text-white" />,
            title: 'Stays & Retreats',
            text: 'From safari lodges to eco-friendly hideaways — rest in style.',
            image: 'https://cdn.pixabay.com/photo/2023/02/06/17/11/hotelroom-7772422_960_720.jpg',
          },
          {
            icon: <Car className="w-10 h-10 mb-3 text-white" />,
            title: 'Transport & Tours',
            text: 'Seamless booking for rides, transfers, and local tours.',
            image: 'https://cdn.pixabay.com/photo/2014/07/02/19/39/safari-382383_1280.jpg',
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            className="relative rounded-2xl overflow-hidden shadow-lg group"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 text-white">
              {item.icon}
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="text-sm">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Local Artisans Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Crafted by Kenya</h2>
            <p className="text-lg text-gray-600">
              Discover unique handmade goods, stories, and culture from local artisans
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-md"
              >
                <img
                  src={`https://images.squarespace-cdn.com/content/v1/58933bb2e3df28b756717818/1487226651608-PHLEUULKWQ7ZTTYWYI38/IMG_0802.jpg?format=500w${i + 1}.jpg`}
                  alt={`Artisan ${i + 1}`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">Maasai Beadwork</h4>
                  <p className="text-gray-600 text-sm">
                    Handmade jewelry and accessories rich in tradition and symbolism.
                  </p>
                </div>
              </motion.div>
            ))}
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
