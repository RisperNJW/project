// src/pages/provider/NewService.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  "Stay",
  "Meals",
  "Transport",
  "Safari Adventure",
  "Cultural Tour",
  "Beach Escape",
];

type ServiceForm = {
  title: string;
  category: string;
  region: string;
  description: string;
  price: string;
  image: string;
};

export default function NewService() {
  const [form, setForm] = useState<ServiceForm>({
    title: "",
    category: "",
    region: "",
    description: "",
    price: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);

    try {
      // ✅ Placeholder for API call
      console.log("Submitting service:", form);

      // await createService(form); // To implement later
      setSubmitted(true);
      setForm({
        title: "",
        category: "",
        region: "",
        description: "",
        price: "",
        image: "",
      });
    } catch (err) {
      console.error("Error submitting service:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto py-12 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-semibold text-emerald-800 mb-6">Add New Service</h1>

      {submitted && (
        <p className="text-green-600 mb-4 font-medium">✅ Service submitted successfully!</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-xl p-6">
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-xl"
            placeholder="e.g. Luxury Safari Lodge"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-xl"
          >
            <option value="">-- Select --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Region / Location</label>
          <input
            type="text"
            name="region"
            value={form.region}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-xl"
            placeholder="e.g. Diani, Nairobi, Kisumu"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-xl"
            placeholder="Describe your service and what makes it unique..."
          ></textarea>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Price (KES)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-xl"
            placeholder="Optional (leave blank if not priced)"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-xl"
            placeholder="e.g. https://..."
          />
          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="w-full h-48 object-cover mt-4 rounded-xl border"
            />
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={`w-full text-white py-3 rounded-xl transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Service"}
        </motion.button>
      </form>
    </motion.div>
  );
}
