// src/pages/provider/Settings.tsx
import { motion } from "framer-motion";

export default function Settings() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-semibold text-emerald-800">Settings</h1>
      <p className="text-gray-600">Manage your provider profile and preferences.</p>

      <div className="bg-white rounded-xl p-6 shadow text-gray-500">
        Settings functionality coming soon.
      </div>
    </motion.div>
  );
}
