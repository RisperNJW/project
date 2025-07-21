const express = require("express");
const router = express.Router();
const Booking = require("../models/bookings");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
    try {
        const booking = await Booking.create(req.body);
        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const bookings = await Booking.find().populate("service");
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
