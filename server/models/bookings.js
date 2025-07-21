const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: Date,
  status: { type: String, default: "pending" },
});
module.exports = mongoose.model("Booking", bookingSchema);

// server/models/Payment.js
const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  amount: Number,
  method: String,
  status: { type: String, default: "unpaid" },
});
module.exports = mongoose.model("Payment", paymentSchema);