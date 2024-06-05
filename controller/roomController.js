// Import room model
const Room = require('../models/rooms');

// Import user model
const User = require('../models/users');

// Import hotel model
const Hotel = require('../models/hotels');

// Create roomController object
const roomController = {

    // Create new room
    createRoom: async (req, res) => {
        try {
            // Get the userId from the request object
            const userId = req.userId;

            // Get the hotelId from the request object
            const { hotelId, name, description, capacity, status, amentities, date } = req.body;


            // Create a new room
            const newRoom = new Room({
                name,
                description,
                capacity,
                status,
                amentities,
                price,
                date,
                Hotel: hotelId,
                createdBy: userId
            });

            // Save the new room
            const room = await newRoom.save();

            // Push the room to the hotel
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: { rooms: room._id }
            });

            // Send the response
            res.status(200).json(room);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all rooms
    getRooms: async (req, res) => {
        try {
            // Get all rooms
            const rooms = await Room.find();

            // Send the response
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get a room
    getRoom: async (req, res) => {
        try {
            // Get room id from the request object
            const roomId = req.params.roomId;

            // Get the room
            const room = await Room.findById(roomId);

            // Send the response
            res.status(200).json(room);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update a room
    updateRoom : async (req, res) => {
        try {
            const  {roomId}  = req.params;
            const updatedRoom = await Room.findByIdAndUpdate(roomId, req.body, { new: true });
    
            if (!updatedRoom) {
                return res.status(404).json({ message: 'Room not found' });
            }
    
            res.status(200).json({ message: 'Room updated successfully', updatedRoom });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete a room
    deleteRoom: async (req, res) => {
        try {
            // Get the room id from the request object
            const roomId = req.params.roomId;

            // Delete the room
            await Room.findByIdAndDelete(roomId);

            // Send the response
            res.status(200).json({ message: 'Room deleted successfully' });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Book a room
    bookRoom: async (req, res) => {
        try {
            // Get the room id from the request object
            const roomId = req.params.roomId;

            // Get the userId from the request object
            const userId = req.userId;

            // Get the room
            const room = await Room.findById(roomId);

            // Check if the room status is available or not
            if (room.status !== 'available') {
                return res.status(400).json({ message: 'Room is already booked' });
            }

            // Update the room
            const updatedRoom = await Room.findByIdAndUpdate(roomId, {
                isBooked: true,
                status: 'booked'
            }, { new: true });

            // Push the userId to the room's customers array
            await Room.findByIdAndUpdate(roomId, {
                $push: { customers: userId }
            });

            // Push the booked rooms to the user
            await User.findByIdAndUpdate(userId, {
                $push: { rooms: roomId }
            });

            // Send the booked room as response
            res.status(200).json(updatedRoom);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get booked rooms
    getBookedRooms: async (req, res) => {
        try {
            // Get the userId from the request object
            const userId = req.params.userId;

            // Get the rooms
            const rooms = await Room.find({ customers: userId });

            // Send the response
            res.status(200).json(rooms);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Unbook a room
    unbookRoom: async (req, res) => {
        try {
            // Get the room id from the request object
            const roomId = req.params.roomId;

            // Get the userId from the request object
            const userId = req.userId;

            // Get the room
            const room = await Room.findById(roomId);

            // Check if the room status is booked or not
            if (room.status !== 'booked') {
                return res.status(400).json({ message: 'Room is not booked' });
            }

            // Update the room
            const updatedRoom = await Room.findByIdAndUpdate(roomId, {
                status: 'available'
            }, { new: true });

            // Remove the userId from the room's customers array
            await Room.findByIdAndUpdate(roomId, {
                $pull: { customers: userId }
            });

            // Send the unbooked room as response
            res.status(200).json(updatedRoom);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

// Export roomController object
module.exports = roomController;