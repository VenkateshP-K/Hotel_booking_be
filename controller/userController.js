const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const userController = {
    register: async (req, res) => {
        try {
            const { username, email, password, location } = req.body;
            const user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                email,
                passwordHash,
                location
            });

            await newUser.save();
            res.status(200).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Error in register:', error);
            res.status(500).json({ message: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({ message: 'Logged in successfully', token });
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).json({ message: error.message });
        }
    },
    getMe: async (req, res) => {
        try {
          const user = await User.findById(req.userId);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          res.status(200).json({ user });
        } catch (error) {
          console.error('Error in getMe:', error);
          res.status(500).json({ message: error.message });
        }
      },
    getMyBookings : async (req, res) => {
        try {
          const user = await User.findById(req.userId).populate('bookedRooms');
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          res.status(200).json({ bookings: user.bookedRooms });
        } catch (error) {
          console.error('Error in getMyBookings:', error);
          res.status(500).json({ message: error.message });
        }
      },

    updateMe : async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user });
        } catch (error) {
            console.error('Error in updateMe:', error);
            res.status(500).json({ message: error.message });
    }
},

    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json({ users });
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            res.status(500).json({ message: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Error in logout:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;