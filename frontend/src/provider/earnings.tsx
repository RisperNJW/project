// src/pages/provider/Earnings.tsx
import { motion } from "framer-motion";

export default function Earnings() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-semibold text-emerald-800">Earnings</h1>
      <p className="text-gray-600">Track your earnings and payout history.</p>

      <div className="bg-white rounded-xl p-6 shadow">
        <p className="text-xl font-bold text-emerald-600">KES 0.00</p>
        <p className="text-gray-500 mt-2">No payouts yet.</p>
      </div>
    </motion.div>
  );
}
