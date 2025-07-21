// src/pages/provider/Bookings.tsx
import { motion } from "framer-motion";

export default function Bookings() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-semibold text-emerald-800">Bookings</h1>
      <p className="text-gray-600">View all recent bookings for your services.</p>

      <div className="bg-white rounded-xl p-6 shadow text-center text-gray-500">
        No bookings yet.
      </div>
    </motion.div>
  );
}
