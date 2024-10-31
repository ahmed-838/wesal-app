const express = require('express');
const router = express.Router();
const Apartment = require('../models/Apartment');
const upload = require('../middlewares/upload'); // Import Multer middleware

router.get('/manage-apartments', (req, res) => {
    res.render('manage-apartments');
});

router.get('/add-apartment', (req, res) => {
    res.render('manage-apartments-components/add-apartment');
});

router.get('/edit-apartment', (req, res) => {
    res.render('manage-apartments-components/edit-apartment');
});

router.get('/delete-apartment', (req, res) => {
    res.render('manage-apartments-components/delete-apartment');
});


router.post('/apartments', upload.array('images'), async (req, res) => {
    try {
        const { type, title, price, latitude, longitude } = req.body;
        
        // Store image file paths in an array
        const images = req.files.map(file => file.path);

        // Create and save new apartment
        const apartment = new Apartment({
            type,
            title,
            price,
            images,
            location: {
                latitude,
                longitude
            }
        });

        await apartment.save();
        res.redirect('/admin/manage-apartments'); // Redirect after saving
    } catch (error) {
        console.error('Error creating apartment:', error);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;
