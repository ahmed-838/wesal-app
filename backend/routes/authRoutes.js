const express = require('express');
const router = express.Router();
const africastalking = require('africastalking');
const User = require('../models/User');

// إعداد معلومات حسابك على Africastalking
const africastalkingClient = africastalking({
    apiKey: 'atsk_7df307def5576d9f6a6300a8fb63c47bc6698e7acf287a40e394d0cbc7342e005a0d5b2b',
    username: 'sandbox',
});

const sms = africastalkingClient.SMS; // تهيئة خدمة SMS

// ربط الواجهات
router.get('/signup', (req, res) => {
    res.render('register/signup'); // صفحة التسجيل
});

router.get('/login', (req, res) => {
    res.render('register/login'); // صفحة الدخول
});

router.get('/verify', (req, res) => {
    res.render('register/verify', { phoneNumber: req.query.phoneNumber }); // صفحة إدخال OTP مع رقم الهاتف
});

const sendOTP = (phoneNumber, otp) => {

    if (!username || !email || !phoneNumber || !password) {
        console.error('Missing required fields:', { username, email, phoneNumber, password });
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
        console.error('Invalid phone number format:', phoneNumber);
        return res.status(400).json({ message: 'Phone number must be in international format (e.g., +201234567890).' });
    }
    

    const message = `Your OTP is ${otp}`;
    const recipients = [phoneNumber];

    sms.send({
        to: recipients,
        message: message,
        from: 'Wesal-Company',
    }).then(response => {
        console.log('OTP sent successfully:', response);
    }).catch(error => {
        console.error('Error sending SMS:', error);
    });
};

// داخل المسار /signup
router.post('/signup', async (req, res) => {
    const { username, email, phoneNumber, password } = req.body;

    // التحقق من الحقول المطلوبة
    if (!username || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    // التحقق من صحة رقم الهاتف
    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
        return res.status(400).json({ message: 'Phone number must be in international format (e.g., +201234567890).' });
    }

    try {
        // التحقق من وجود اسم مستخدم مكرر
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken, please choose another.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000); // إنشاء OTP عشوائي
        const otpExpiration = new Date();
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

        const newUser = new User({
            username,
            email,
            phoneNumber,
            password,
            otp,
            otpExpiration,
        });

        await newUser.save(); // حفظ المستخدم
        await sendOTP(phoneNumber, otp); // إرسال OTP

        res.status(200).json({ message: 'OTP sent to your phone number, please verify.' });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `${field} is already taken.` });
        }
        console.error('Error saving user or sending OTP:', error);
        res.status(500).json({ message: 'Error occurred while saving user data or sending OTP.' });
    }
});

// مسار التحقق من OTP
router.post('/verify', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const now = new Date();

        if (user.otpExpiration < now) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // إذا تم التحقق من الـ OTP بنجاح
        res.status(200).json({ message: 'OTP verified successfully, user registered.' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error occurred while verifying OTP.' });
    }
});

module.exports = router;
