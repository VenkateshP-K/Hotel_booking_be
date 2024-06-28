const express = require('express');
const auth = require('../auth');
const paymentController = require('../controller/paymentController');
const paymentRouter = express.Router();

paymentRouter.post('/', auth.isAuth, paymentController.createPayment);
paymentRouter.get('/', auth.isAuth, paymentController.getPayment);
paymentRouter.delete('/:id', auth.isAuth, paymentController.deletePayment);

module.exports = paymentRouter