const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, phone, password, role } = req.body;

        // Check if there is an existing user with the provided email and role
        const existingUser = await User.findOne({ email, role });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ email, phone, password, role });
        console.log(user);
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**{

"email":"Himanshu@gmail.com",
"password":"123456",
"role":"user"
} */


router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email, role });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Include additional information in the JWT token payload
        const tokenPayload = {
            userId: user._id,
            email: user.email,
            role: user.role // You may add more data here if needed
        };

        const token = jwt.sign(tokenPayload, 'jwt_secret_key', { expiresIn: 60 * 60 });

        // Store user ID in session authorization
        req.session.authorization = {
            token,
            userId: user._id, // Store user ID
            email,
            role
        };

        console.log("User ID:", user._id); // Log user ID
        res.status(200).json({ message: 'User Login Successfully', token, userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});





router.post('/logout', async (req, res) => {
    try {
        // Clear the session data

        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ message: 'Server error' });
            }
            res.status(200).json({ message: 'User logged out successfully' });
        });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router;
