const mongoose = require("mongoose");
const crypto = require('crypto');
const { createPasswordResetToken, createEmailVerificationToken } = require('../utils/tokenUtils');

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
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    phoneVerified: { type: Boolean, default: false },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    loginAttempts: {
        type: Number,
        default: 0,
        select: false
    },
    lockUntil: {
        type: Date,
        select: false
    },
    lastActive: Date
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'providerInfo.businessName': 'text' });

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Document middleware: runs before .save() and .create()
userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    
    // Set passwordChangedAt to current time
    this.passwordChangedAt = Date.now() - 1000; // 1 second in past to ensure token is created after
    next();
});

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
    const { resetToken, passwordResetToken, passwordResetExpires } = createPasswordResetToken();
    
    this.passwordResetToken = passwordResetToken;
    this.passwordResetExpires = passwordResetExpires;
    
    return resetToken;
};

// Generate email verification token
userSchema.methods.createVerificationToken = function() {
    const { verificationToken, emailVerificationToken, emailVerificationExpires } = createEmailVerificationToken();
    
    this.emailVerificationToken = emailVerificationToken;
    this.emailVerificationExpires = emailVerificationExpires;
    
    return verificationToken;
};

// Check if password matches the hashed password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Handle failed login attempts
userSchema.methods.incrementLoginAttempts = async function() {
    // If we have a previous lock that has expired
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return await this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }
    
    // Otherwise increment login attempts
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Lock the account if we've reached max attempts
    if (this.loginAttempts + 1 >= 5) {
        updates.$set = { 
            lockUntil: Date.now() + 30 * 60 * 1000, // 30 minutes
            loginAttempts: this.loginAttempts + 1
        };
    }
    
    return await this.updateOne(updates);
};

// Reset login attempts on successful login
userSchema.methods.resetLoginAttempts = async function() {
    return await this.updateOne({
        $set: { loginAttempts: 0 },
        $unset: { lockUntil: 1 }
    });
};

module.exports = mongoose.model("User", userSchema);

// server/controllers/authController.js
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