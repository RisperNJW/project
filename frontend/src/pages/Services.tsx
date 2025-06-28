import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export interface ServiceItem {
  id: string;
  type: 'airbnb' | 'car' | 'hotel' | 'event' | 'venue';
  title: string;
  description: string;
  image: string;
  rating: number;
  pricePerUnit: number;
  unit: string;
}

// Example fetch function (replace with your API)
const fetchServices = async (): Promise<ServiceItem[]> => {
  return (await fetch('/api/services')).json();
};

export default function Service() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices()
      .then(data => setServices(data))
      .finally(() => setLoading(false));
  }, []);

  const grouped = services.reduce((acc, svc) => {
    (acc[svc.type] = acc[svc.type] || []).push(svc);
    return acc;
  }, {} as Record<string, ServiceItem[]>);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-b-4 border-primary rounded-full"></div></div>;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative w-full h-[60vh] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(https://source.unsplash.com/1600x900/?kenya,travel)' }}>
        <div className="absolute inset-0 bg-black/40" />
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl text-white font-serif font-bold z-10 text-center px-6">
          Experience Kenya, Your Way
        </motion.h1>
      </section>

      {/* Offers section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Latest Offers</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {services.slice(0, 2).map(svc => (
            <motion.div key={svc.id} whileHover={{ scale: 1.02 }} className="rounded-xl overflow-hidden shadow-lg transition">
              <img src={svc.image} alt={svc.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{svc.title}</h3>
                <p className="text-gray-600 mb-4">{svc.description}</p>
                <Link to={`/services/${svc.id}`} className="inline-block text-primary hover:underline">Discover Now →</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Service categories */}
      {['airbnb', 'hotel', 'car', 'event', 'venue'].map(type => (
        grouped[type]?.length ? (
          <section key={type} className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {grouped[type].slice(0,3).map(svc => (
                <motion.div key={svc.id} whileHover={{ scale: 1.03 }} 
                   className="rounded-xl overflow-hidden shadow-md bg-white transition">
                  <img src={svc.image} alt={svc.title} className="h-48 w-full object-cover" />
                  <div className="p-5">
                    <h3 className="text-lg font-medium mb-1">{svc.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{svc.unit} · ${svc.pricePerUnit}</p>
                    <div className="flex items-center text-yellow-500 mb-2">
                      {'★'.repeat(Math.floor(svc.rating))}
                      {'☆'.repeat(5 - Math.floor(svc.rating))}
                      <span className="text-gray-600 ml-2 text-sm">{svc.rating.toFixed(1)}</span>
                    </div>
                    <Link to={`/services/${svc.id}`} className="text-primary hover:underline text-sm">Learn More →</Link>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link to={`/services?type=${type}`} className="mt-6 inline-block text-primary font-medium hover:underline">See all {type}s →</Link>
          </section>
        ) : null
      ))}

      {/* Expert Tips */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Expert Tips from Local Guides</h2>
          <p className="text-gray-600 mb-8">Get insider advice and hidden gems from those who know Kenya best.</p>
          <Link to="/tips" className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark transition">Read Tips</Link>
        </div>
      </section>

      {/* Top Destinations */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Top Destinations</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {['Masai Mara', 'Diani Beach', 'Mount Kenya'].map((place, i) => (
            <Link key={i} to={`/destinations/${place.toLowerCase().replace(/ /g,'-')}`} className="block rounded-2xl overflow-hidden shadow-lg group">
              <img src={`https://source.unsplash.com/600x400/?kenya,${place}`} 
                   alt={place} className="w-full h-56 object-cover group-hover:scale-105 transition-transform" />
              <div className="p-5">
                <h3 className="text-xl font-semibold">{place}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
