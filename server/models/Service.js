const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        category: { 
            type: String, 
            required: true,
            enum: ['meals', 'stays', 'experiences', 'transport']
        },
        subcategory: { type: String },
        region: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        priceUnit: { type: String, default: 'per person' },
        image: { type: String },
        images: [{ type: String }],
        providerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        availability: {
            startDate: Date,
            endDate: Date,
            maxGuests: { type: Number, default: 1 }
        },
        location: {
            address: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        },
        amenities: [String],
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
