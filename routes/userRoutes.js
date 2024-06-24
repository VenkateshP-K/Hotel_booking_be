//import express
const express = require('express');

//import express router
const userRouter = express.Router();

//import auth middleware
const Auth = require('../auth')

//import user controller
const userController = require('../controller/userController')

//define routes
userRouter.post('/', userController.register);
userRouter.post('/login', userController.login);

userRouter.get('/me', Auth.isAuth , userController.getMe);
userRouter.get('/bookedRooms', Auth.isAuth , userController.getMyBookings);
userRouter.get('/', Auth.isAuth ,Auth.isAdmin, userController.getAllUsers);
userRouter.put('/update', Auth.isAuth , userController.updateMe);
userRouter.post('/logout', Auth.isAuth , userController.logout);

//admin routes
userRouter.get('/', Auth.isAuth, Auth.isAdmin, userController.getAllUsers);

//export userRouter
module.exports = userRouter;