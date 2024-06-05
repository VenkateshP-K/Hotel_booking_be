//require express
const express = require("express");

//require hotel controller
const hotelController = require('../controller/hotelController');

//require auth
const auth = require('../auth');

const hotelRouter = express.Router();

//define routes
hotelRouter.post('/',auth.isAuth,auth.isAdmin,hotelController.createHotel);
hotelRouter.get('/', auth.isAuth,hotelController.getAllHotels);
hotelRouter.get('/:id', auth.isAuth,auth.isAdmin,hotelController.getHotel);
hotelRouter.put('/:hotelId', auth.isAuth,auth.isAdmin,hotelController.updateHotel);
hotelRouter.delete('/:hotelId', auth.isAuth,auth.isAdmin,hotelController.deleteHotel);

//export hotel routes
module.exports = hotelRouter;