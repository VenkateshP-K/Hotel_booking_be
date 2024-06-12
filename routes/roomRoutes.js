//require express
const express = require("express");

//require auth
const auth = require('../auth');

//require room controller
const roomController = require('../controller/roomController');

//create router
const roomRouter = express.Router();

//define routes
roomRouter.post('/', auth.isAuth , auth.isAdmin, roomController.createRoom);
roomRouter.get('/', auth.isAuth , roomController.getRooms);
roomRouter.get('/:roomId', auth.isAuth , roomController.getRoom);
roomRouter.get('/bookedRooms/:userId', auth.isAuth , roomController.getBookedRooms);
roomRouter.put('/:roomId', auth.isAuth , auth.isAdmin, roomController.updateRoom);
roomRouter.delete('/:roomId', auth.isAuth , auth.isAdmin, roomController.deleteRoom);

roomRouter.post('/book/:roomId/', auth.isAuth , roomController.bookRoom);
roomRouter.post('/unbook/:roomId/', auth.isAuth , roomController.unbookRoom);

roomRouter.get('/',(req, res) => {
    res.send('Room routes');
})

//export router
module.exports = roomRouter;