const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type : {
        type: String,
        required: true
    },
    cardNumber : {
        type: String,
        required: true
    },
    expiryDate : {
        type: String,
        required: true
    },
    cvv : {
        type: String,
        required: true
    },
})

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
module.exports = PaymentMethod