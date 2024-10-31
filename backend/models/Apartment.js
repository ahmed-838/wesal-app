const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],  // Array to store image paths
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Apartment', apartmentSchema);
