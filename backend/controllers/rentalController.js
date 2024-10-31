// controllers/rentalController.js
const Rental = require('../models/rentalModel');

// جلب جميع الإيجارات
const getRentals = async (req, res) => {
    try {
        const rentals = await Rental.find();
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rentals' });
    }
};

// إضافة إيجار جديد
const createRental = async (req, res) => {
    const newRental = new Rental(req.body);
    try {
        const savedRental = await newRental.save();
        res.status(201).json(savedRental);
    } catch (error) {
        res.status(500).json({ message: 'Error creating rental' });
    }
};

// حذف إيجار معين
const deleteRental = async (req, res) => {
    try {
        const rental = await Rental.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rental deleted', rental });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting rental' });
    }
};

module.exports = { getRentals, createRental, deleteRental };
