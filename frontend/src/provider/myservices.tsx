import { motion } from "framer-motion";

export default function Services() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-semibold text-emerald-800">My Services</h1>
      <p className="text-gray-600">Manage and edit your listings below.</p>

      <div className="border-dashed border-2 border-emerald-300 rounded-xl p-6 text-center text-emerald-700">
        No services listed yet. Start by adding your first listing.
      </div>
    </motion.div>
  );
}
