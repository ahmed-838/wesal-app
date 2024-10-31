const express = require('express');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('register/signup');
});

router.get('/login', (req, res) => {
    res.render('register/login');
});

router.get('/forget-password', (req, res) => {
    res.render('register/forget-password');
});

module.exports = router;
