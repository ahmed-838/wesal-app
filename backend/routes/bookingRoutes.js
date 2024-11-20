const express = require('express');
const router = express.Router();
const Apartment = require('../models/Apartment'); 

router.get('/:id', async (req, res) => {
    try {
        const apartmentId = req.params.id;

        const apartment = await Apartment.findById(apartmentId);

        console.log(apartment)

        if (!apartment) {
            return res.status(404).send('Apartment not found');
        }

        res.render('booking', { apartment });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
module.exports = router ;