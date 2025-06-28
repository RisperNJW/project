import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface BookingData {
  startDate: string;
  endDate: string;
  guests: number;
  contact: { name: string; email: string; phone: string; };
}

const Booking: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [svc, setSvc] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>({ startDate:'', endDate:'', guests:1, contact:{name:'',phone:'',email:''} });

  useEffect(() => {
    fetch(`/api/services/${id}`).then(r => r.json()).then(setSvc);
  }, [id]);

  const submit = () => {
    if (!data.startDate || !data.contact.email) return toast.error('Required fields missing');
    fetch('/api/bookings', { method:'POST',body:JSON.stringify({ serviceId: id, ...data })})
      .then(r => r.json())
      .then(res => {
        if(res.success){ toast.success('Booked!'); navigate(`/confirmation/${res.id}`); }
        else toast.error(res.error);
      });
  };

  if (!svc) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const total = svc.pricePerUnit * data.guests;

  return (
    <section className="min-h-screen bg-white px-6 md:px-16 py-20">
      <div className="max-w-3xl mx-auto bg-gray-50 p-10 rounded-xl shadow-lg space-y-8">
        <h2 className="text-3xl font-semibold text-center">Book: {svc.title}</h2>
        
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity:1 }} transition={{duration:0.4}}>
            <div className="mb-6 space-y-4">
              <label className="block"><span>Check-In</span><input type="date" value={data.startDate} onChange={e=> setData({...data,startDate:e.target.value})} className="mt-1 w-full border-gray-300 rounded-md px-4 py-2" /></label>
              <label className="block"><span>Check-Out</span><input type="date" value={data.endDate} onChange={e=> setData({...data,endDate:e.target.value})} className="mt-1 w-full border-gray-300 rounded-md px-4 py-2" /></label>
              <label className="block"><span>Guests</span><input type="number" min="1" value={data.guests} onChange={e=> setData({...data,guests: +e.target.value})} className="mt-1 w-full border-gray-300 rounded-md px-4 py-2" /></label>
            </div>
            <button onClick={()=>setStep(2)} className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition">Next</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity:1 }} transition={{duration:0.4}}>
            <div className="space-y-4 mb-8">
              <label className="block"><span>Full Name</span><input type="text" placeholder="John Doe" value={data.contact.name} onChange={e=>setData({...data,contact:{...data.contact,name:e.target.value}})} className="mt-1 w-full border-gray-300 rounded-md px-4 py-2"/></label>
              <label className="block"><span>Email</span><input type="email" placeholder="you@example.com" value={data.contact.email} onChange={e=>setData({...data,contact:{...data.contact,email:e.target.value}})} className="mt-1 w-full border-gray-300 rounded-md px-4 py-2"/></label>
              <label className="block"><span>Phone</span><input type="tel" placeholder="+254700000000" value={data.contact.phone} onChange={e=>setData({...data,contact:{...data.contact,phone:e.target.value}})} className="mt-1 w-full border-gray-300 rounded-md px-4 py-2"/></label>
            </div>
            <button onClick={()=>submit()} className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition">Submit Booking</button>
          </motion.div>
        )}

        <div className="pt-4 border-t text-right text-gray-600">
          {step === 2 && (
            <p>Total: <span className="font-semibold">${total}</span></p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Booking;
