// src/pages/provider/Overview.tsx
import { motion } from "framer-motion";

export default function Overview() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-semibold text-emerald-800">Dashboard Overview</h1>
      <p className="text-gray-600">Here’s a snapshot of your performance and activity.</p>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-medium text-gray-800">Bookings</h3>
          <p className="text-2xl font-bold text-emerald-600 mt-2">12</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-medium text-gray-800">Total Earnings</h3>
          <p className="text-2xl font-bold text-emerald-600 mt-2">KES 42,500</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-medium text-gray-800">Profile Views</h3>
          <p className="text-2xl font-bold text-emerald-600 mt-2">134</p>
        </div>
      </div>
    </motion.div>
  );
}
