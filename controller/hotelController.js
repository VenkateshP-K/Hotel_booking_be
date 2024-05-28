//import company model
const Hotel = require('../models/hotels')

//import the user model
const User = require('../models/users')

//define the hotel controller
const hotelController = {
    //create hotel
    createHotel : async (req, res) => {
        try {
            //get the data from the request body
            const {name, address,price} = req.body;

            //get the userid from the request
            const {userId}= req.userId;

            //create new hotel
            const newHotel = new Hotel({
                ...req.body,
                createdBy:userId,
            })

            //save the hotel
            const savedHotel = await newHotel.save();

            //return the response
            res.status(200).json({message : 'Hotel created successfully', savedHotel})

        } catch (error) {
            res.status(500).json({message : error.message})
        }
    },
   //get all hotels
   getAllHotels : async (req, res) => {
    try {
        //get all hotels
        const hotels = await Hotel.find();

        //return the response
        res.status(200).json(hotels)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
   },
   //get a hotel
   getHotel : async(req, res) => {
    try {
        //get the hotel id from the request params
        const {hotelId} = req.params;

        //get the hotel
        const hotel = await Hotel.findById(hotelId);
        
        //return the response
        res.status(200).json({hotel})

    } catch (error) {
        res.status(500).json({message : error.message})
    }
   },
   //update a hotel
   updateHotel : async (req, res) => {
    try {
        
        //get the hotel id from the request params
        const {hotelId} = req.params;

        //update hotel
        const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, req.body, {new : true});
          
        //return the response
        res.status(200).json({message : 'Hotel updated successfully', updatedHotel})

    } catch (error) {
        res.status(500).json({message : error.message})
    }
   },

   //delete a hotel
   deleteHotel : async (req, res) => {
    try {
        //get the hotel id from the request params
        const {hotelId} = req.params;

        //delete the hotel
        await Hotel.findByIdAndDelete(hotelId);

        //return the response
        res.status(200).json({message : 'Hotel deleted successfully'})

    } catch (error) {
        res.status(500).json({message : error.message})
    }
   }
}

//export the controller
module.exports = hotelController;