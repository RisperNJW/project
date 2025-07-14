import React, { useState } from "react";
import { motion } from "framer-motion";

const serviceTypes = ["Stays", "Meals", "Transport", "Tours", "Culture", "Events"];

export default function Onboard() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    serviceType: "",
    region: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form:", form);
    // Connect to backend or API
    alert("Thank you! We’ll get back to you shortly.");
  };

  return (
    <section className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <div className="bg-emerald-50 py-16 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Join Kenya's Premier Tourism Network
        </motion.h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-700">
          Are you a service provider in Kenya? Whether you offer stays, meals, transport, or unique local experiences —
          we welcome you onboard.
        </p>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-xl"
              placeholder="Jane Muthoni"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-xl"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Service Type</label>
            <select
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-xl"
            >
              <option value="">-- Select Service --</option>
              {serviceTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Region / Location</label>
            <input
              type="text"
              name="region"
              value={form.region}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-xl"
              placeholder="Nairobi, Mombasa, Kisumu..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message or Details</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 p-3 border rounded-xl"
              placeholder="Tell us about your service and what makes it special"
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl shadow-lg hover:bg-emerald-700 transition"
          >
            Submit Your Service
          </motion.button>
        </form>
      </div>
    </section>
  );
}
