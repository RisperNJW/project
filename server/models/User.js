const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: String,
    role: { type: String, enum: ['user', 'provider', 'admin'], default: 'user' },
    profile: {
        avatar: String,
        bio: String,
        location: String,
        dateOfBirth: Date
    },
    // Provider-specific fields
    providerInfo: {
        businessName: String,
        businessType: String,
        licenseNumber: String,
        description: String,
        website: String,
        socialMedia: {
            facebook: String,
            instagram: String,
            twitter: String
        },
        bankDetails: {
            accountName: String,
            accountNumber: String,
            bankName: String,
            swiftCode: String
        },
        isVerified: { type: Boolean, default: false },
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 }
    },
    preferences: {
        currency: { type: String, default: 'KES' },
        language: { type: String, default: 'en' },
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true }
        }
    },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

// server/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ user });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
};