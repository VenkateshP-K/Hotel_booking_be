const Hotel = require('../models/hotels');
const User = require('../models/users');

const hotelController = {
    createHotel: async (req, res) => {
        try {
            const { name, address, description } = req.body;
            const userId = req.userId;

            // Verify user existence
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const newHotel = new Hotel({
                name,
                address,
                description,
                createdBy: userId,
            });

            const savedHotel = await newHotel.save();
            res.status(200).json({ message: 'Hotel created successfully', savedHotel });
        } catch (error) {
            console.error('Error in createHotel:', error);
            res.status(500).json({ message: error.message });
        }
    },
    getAllHotels: async (req, res) => {
        try {
            const hotels = await Hotel.find().populate('rooms');
            res.status(200).json(hotels);
        } catch (error) {
            console.error('Error in getAllHotels:', error);
            res.status(500).json({ message: error.message });
        }
    },
    getHotel: async (req, res) => {
        try {
            const { hotelId } = req.params;
            const hotel = await Hotel.findById(hotelId).populate('rooms');

            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            res.status(200).json({ hotel });
        } catch (error) {
            console.error('Error in getHotel:', error);
            res.status(500).json({ message: error.message });
        }
    },
    updateHotel: async (req, res) => {
        try {
            const { hotelId } = req.params;
            const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, req.body, { new: true });

            if (!updatedHotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            res.status(200).json({ message: 'Hotel updated successfully', updatedHotel });
        } catch (error) {
            console.error('Error in updateHotel:', error);
            res.status(500).json({ message: error.message });
        }
    },
    deleteHotel: async (req, res) => {
        try {
            const { hotelId } = req.params;
            const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

            if (!deletedHotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            res.status(200).json({ message: 'Hotel deleted successfully' });
        } catch (error) {
            console.error('Error in deleteHotel:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = hotelController;
