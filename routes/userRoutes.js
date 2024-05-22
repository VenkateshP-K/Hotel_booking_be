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
userRouter.put('/me', Auth.isAuth , userController.update);
userRouter.delete('/me', Auth.isAuth , userController.delete);
userRouter.get('/me', Auth.isAuth , userController.logout);

//admin routes
userRouter.get('/', Auth.isAuth, Auth.isAdmin, userController.getUsers);
userRouter.get('/:id', Auth.isAuth, Auth.isAdmin, userController.getUserById);
userRouter.put('/:id', Auth.isAuth, Auth.isAdmin, userController.updateUserById);
userRouter.delete('/:id', Auth.isAuth, Auth.isAdmin, userController.deleteUserById);

//export userRouter
module.exports = userRouter;