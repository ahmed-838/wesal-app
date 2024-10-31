const express = require('express');
const router = express.Router();
const Apartment = require('../models/Apartment'); 

router.get('/', (req, res) => {
    res.render('rental');
});

router.get('/components/navbar', (req, res) => {
    res.render('rental-components/navbar');
});

router.get('/components/map', (req, res) => {
    res.render('rental-components/map');
});

router.get('/components/details', (req, res) => {
    res.render('rental-components/details');
});


router.get('/listings', async (req, res) => {
    try {
        const listings = await Apartment.find();
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching listings' });
    }
});
module.exports = router;
