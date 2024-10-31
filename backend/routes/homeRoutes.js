const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home.ejs');
});

router.get('/components/navbar', (req, res) => {
    res.render('home-components/navbar');
});

router.get('/components/upper-page', (req, res) => {
    res.render('home-components/upper-page');
});

router.get('/components/auth', (req, res) => {
    res.render('home-components/auth');
});

router.get('/components/cards', (req, res) => {
    res.render('home-components/cards');
});

router.get('/components/footer', (req, res) => {
    res.render('home-components/footer');
});


module.exports = router;
