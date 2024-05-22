//import rooom model
const Room = require('../models/rooms');

//import user model
const User = require('../models/users');

//import hotel model
const Hotel = require('../models/hotels');

//create roomController object
const roomController = {

    //create new room
    createRoom: async (req, res) => {
        try {
            //get the userId from the request object
            const userId = req.userId;

            //get the hotelId from the request object
            const hotelId = req.body.hotelId;

            //create a new room
            const newRoom = new Room({
                ...req.body,
                Hotel : hotelId,
                createdBy : userId
            })

            //save the new room
            const room = await newRoom.save();

            //push the room to the hotel
            await Hotel.findByIdAndUpdate(hotelId, {
                $push : {
                    rooms : room._id
                }
            })

            //send the response
            res.status(200).json(room);

        } catch (error) {
            res.status(500).json({message:error.message});            
        }
},
//get all rooms
getRooms : async (req, res) => {
    try {
        //get all rooms
        const rooms = await Room.find();

        //send the response
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
},
//get a room
getRoom : async (req, res) => {
    try {
        //get room id from the request object
        const roomId = req.params.roomId;

        //get the room
        const room = await Room.findById(roomId);

        //send the response
        res.status(200).json(room);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
},
//update a room
updateRoom : async(req, res) => {
    try {
        //get the room id from the request object
        const roomId = req.params.roomId;

        //update the job
        const room = await Room.findByIdAndUpdate(roomId, req.body, {
            new : true
        });

        //send the response
        res.status(200).json(room);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
},
//delete a room
deleteRoom : async (req, res) => {
    try {
        //get the roomid from the request object
        const roomId = req.params.roomId;

        //delete the room
        await Room.findByIdAndDelete(roomId);

        //send the response
        res.status(200).json({message:'Room deleted successfully'});

    } catch (error) {
        res.ststus(500).json({message:error.message});
    }
},
//to book a room
bookRoom : async (req, res) => {
    try {
        //get the room id from the request object
        const roomId = req.params.roomId;

        //get the userId from the request object
        const userId = req.userId;

        //get the room
        const room = await Room.findById(roomId);

        //check if the room status is available or not
        if(room.status !== 'available'){
            return res.status(400).json({message:'Room is already booked'});
        }

        //update the room
        const updatedRoom = await Room.findByIdAndUpdate(roomId, {
            staus : 'booked'
        }, {
            new : true
        });

        //push the userid to the room's customers array
        await Room.findByIdAndUpdate(roomId, {
            $push : {
                customers : userId
            },
            status : true
        })

        //send the booked room as response
        res.status(200).json(room);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
},
//to unbook a room
unbookRoom : async (req, res) => {
    try {
        //get the room id from the request object
        const roomId = req.params.roomId;

        //get the userId from the request object
        const userId = req.userId;

        //get the room
        const room = await Room.findById(roomId);

        //check if the room status is available or not  
        if(room.status !== 'booked'){
            return res.status(400).json({message:'Room is not booked'});
        }

        //update the room
        const updatedRoom = await Room.findByIdAndUpdate(roomId, {
            staus : 'available'
        }, {
            new : true
        });

        //remove the userid from the room's customers array
        await Room.findByIdAndUpdate(roomId, {
            $pull : {
                customers : userId
            },
            status : false
        });

        //send the unbooked room as response
        res.status(200).json(room);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
}

//export roomController object
module.exports = roomController;