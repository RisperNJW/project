const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Enhanced register function
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check existing user
        const existing = await User.findOne({ email }).lean();
        if (existing) {
            return res.status(409).json({ error: "Email already registered" });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashed
        });

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Secure response
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: userResponse
        });

    } catch (err) {
        console.error("Registration error:", err);
        next(err); // Pass to error middleware
    }
};

// Enhanced login function
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        // Find user with password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Secure response
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userResponse
        });

    } catch (err) {
        console.error("Login error:", err);
        next(err); // Pass to error middleware
    }
};