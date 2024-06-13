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
            const newUser = new User({ username, email, passwordHash, location });
            const savedUser = await newUser.save();

            res.status(201).json({ message: 'User created successfully', savedUser });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: 'User Not Found' });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Invalid Password' });
            }

            const token = jwt.sign({
                id: user._id,
                email: user.email,
                username: user.username,
            }, JWT_SECRET);

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });

            res.status(200).json({ message: 'User logged in successfully', token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getMe: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId).select('-passwordHash -__v -_id'); 

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const userId = req.userId;
            const { username, email, location } = req.body;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (username) user.username = username;
            if (email) user.email = email;
            if (location) user.location = location;

            const updatedUser = await user.save();
            res.status(200).json({ message: 'User updated successfully', updatedUser });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await User.findByIdAndDelete(userId);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'User logged out successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getUsers: async (req, res) => {
        try {
            const users = await User.find().select('-passwordHash -__v -_id');
            res.status(200).json({ users });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getUserById: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId).select('-passwordHash -__v -_id');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateUserById: async (req, res) => {
        try {
            const { userId } = req.params;
            const { username, email, location } = req.body;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (username) user.username = username;
            if (email) user.email = email;
            if (location) user.location = location;

            const updatedUser = await user.save();
            res.status(200).json({ message: 'User updated successfully', updatedUser });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteUserById: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await User.findByIdAndDelete(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;