const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// ==================================================================================
// 1. REGISTER NEW EMPLOYEE
// POST /api/auth/register
// ==================================================================================
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, department, officeLocation, phone } = req.body;

        //Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An employee with this email already exists'});
        }

        // Hash the password with bcrypt (10 salt rounds)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            department: department || 'Engineering',
            officeLocation: officeLocation || 'HQ Building 1',
            phone: phone || '',
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Token valid for 7 days
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                officeLocation: user.officeLocation,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// ========================================================
// 2. LOGIN EMPLOYEE
// POST /api/auth/login
// ========================================================
router.post('/login', async (req, res) => {
    try {
        const {email, password } = req.body;

        //Check if employee exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid corporate email or password' });
        }

        // Verify password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid corporate email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                officeLocation: user.officeLocation,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// ========================================================
// 3. GET CURRENT LOGGED-IN EMPLOYEE PROFILE
// GET /api/auth/me (Protected Route)
// ========================================================
router.get('/me', auth, async (req, res) => {
    try {
        // req.user was attached by auth middleware; exclude password
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Profile Fetch Error:', err.message);
        res.status(500).json({ message: 'Server error fetching user profile' });
    }
});

module.exports = router;
