import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Star, MapPin, Calendar } from 'lucide-react';

interface ServiceDetailType {
  id: string;
  type: string;
  title: string;
  description: string;
  images: string[];
  pricePerUnit: number;
  unit: string;
  rating: number;
  host: { name: string, avatar: string };
  highlights: string[];
  itinerary?: { day: number, text: string }[];
}

const fetchDetail = async (id: string): Promise<ServiceDetailType> =>
  fetch(`/api/services/${id}`).then(r => r.json());

export default function ServiceDetail() {
  const { id } = useParams();
  const [svc, setSvc] = useState<ServiceDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchDetail(id).then(data => setSvc(data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-b-4 border-primary rounded-full"></div></div>;
  if (!svc) return <div className="p-8 text-center">Service not found → <Link to="/services" className="text-primary hover:underline">Back to all</Link></div>;

  return (
    <article className="bg-white">
      {/* Gallery */}
      <section className="relative h-[60vh]">
        <img src={svc.images[imgIdx]} alt="" className="w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button onClick={() => setImgIdx((imgIdx - 1 + svc.images.length) % svc.images.length)} className="text-white bg-black/30 p-2 rounded-full">‹</button>
          <button onClick={() => setImgIdx((imgIdx + 1) % svc.images.length)} className="text-white bg-black/30 p-2 rounded-full">›</button>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {svc.images.map((_, i) => (
            <span key={i} className={`w-3 h-3 rounded-full ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`}></span>
          ))}
        </div>
        <div className="absolute top-4 left-4 text-white bg-black/30 py-1 px-3 rounded">{svc.unit} · ${svc.pricePerUnit}</div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-gray-900">{svc.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <MapPin /> <span>{svc.type}</span> · {svc.unit}
          </div>
          <div className="flex items-center gap-2 text-yellow-500">
            {'★'.repeat(Math.floor(svc.rating))}
            {'☆'.repeat(5 - Math.floor(svc.rating))}
            <span className="text-gray-600">{svc.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-gray-700 leading-loose">{svc.description}</p>

        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {svc.highlights.map((hl, i) => <li key={i}>{hl}</li>)}
          </ul>
        </div>

        {svc.itinerary?.length && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Itinerary</h2>
            <div className="space-y-6">
              {svc.itinerary.map((day) => (
                <motion.div key={day.day} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: day.day * 0.1 }}
                  className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-white font-bold rounded-full grid place-items-center">{day.day}</div>
                  <p className="text-gray-700 leading-normal">{day.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <img src={svc.host.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
          <div>
            <p className="font-medium">{svc.host.name}</p>
            <p className="text-sm text-gray-500">Host</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to={`/booking/${svc.id}`}
            className="inline-block bg-primary text-white px-10 py-3 rounded-lg text-lg font-medium hover:bg-primary-dark transition">
            Book Now
          </Link>
        </div>
      </section>
    </article>
  );
}
