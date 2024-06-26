const Room = require('../models/rooms');
const User = require('../models/users');
const Hotel = require('../models/hotels');

const roomController = {
    createRoom: async (req, res) => {
        try {
            const userId = req.userId;
            const { hotelId, name, description, capacity, status, amenities, date, price } = req.body;
    
            const newRoom = new Room({
                name,
                description,
                capacity,
                status,
                amenities,
                price,
                date,
                checkIn: date,
                checkOut: date,
                hotel: hotelId, // Ensure this matches the expected field in the Room schema
                createdBy: userId
            });
    
            const room = await newRoom.save();
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: { rooms: room._id }
            });
    
            res.status(200).json(room);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getRooms : async (req, res) => {
        try {
            const rooms = await Room.find().populate('hotel').exec();
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getRoom: async (req, res) => {
        try {
            const roomId = req.params.roomId;
            const room = await Room.findById(roomId);

            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            const hotel = await Hotel.findById(room.hotel);
            const customers = await User.find({ bookedRooms: roomId });

            res.status(200).json({ ...room._doc, hotel, customers });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateRoom: async (req, res) => {
        try {
            const { roomId } = req.params;
            const updatedRoom = await Room.findByIdAndUpdate(roomId, req.body, { new: true });

            if (!updatedRoom) {
                return res.status(404).json({ message: 'Room not found' });
            }

            res.status(200).json({ message: 'Room updated successfully', updatedRoom });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteRoom: async (req, res) => {
        try {
            const roomId = req.params.roomId;
            const deletedRoom = await Room.findByIdAndDelete(roomId);

            if (!deletedRoom) {
                return res.status(404).json({ message: 'Room not found' });
            }

            res.status(200).json({ message: 'Room deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    bookRoom: async (req, res) => {
        try {
            const roomId = req.params.roomId;
            const userId = req.userId;
            const { checkIn, checkOut } = req.body;

            const room = await Room.findById(roomId);

            if (room.status !== 'available') {
                return res.status(400).json({ message: 'Room is already booked' });
            }

            const updatedRoom = await Room.findByIdAndUpdate(roomId, {
                isBooked: true,
                status: 'booked',
                checkIn,
                checkOut
            }, { new: true });

            await Room.findByIdAndUpdate(roomId, {
                $push: { customers: userId }
            });

            await User.findByIdAndUpdate(userId, {
                $push: { bookedRooms: roomId }
            });

            res.status(200).json(updatedRoom);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getBookedRooms: async (req, res) => {
        try {
            const bookedRooms = await Room.find({ status: "booked" }).populate("hotel").exec();
            if (bookedRooms.length === 0) {
                return res.status(404).json({ message: "No booked rooms found." });
            }
            res.status(200).json(bookedRooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    unbookRoom: async (req, res) => {
        try {
            const roomId = req.params.roomId;
            const userId = req.userId;
            const room = await Room.findById(roomId);

            if (room.status !== 'booked') {
                return res.status(400).json({ message: 'Room is not booked' });
            }

            const updatedRoom = await Room.findByIdAndUpdate(roomId, {
                status: 'available'
            }, { new: true });

            await Room.findByIdAndUpdate(roomId, {
                $pull: { customers: userId }
            });

            await User.findByIdAndUpdate(userId, {
                $pull: { bookedRooms: roomId }
            });

            res.status(200).json(updatedRoom);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = roomController;