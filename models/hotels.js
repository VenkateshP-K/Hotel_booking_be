//require mongoose
const mongoose = require('mongoose');

//define schema
const hotelSchema = new mongoose.Schema({
    name : String,
    address : String,
    price : Number,
    rooms:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room'
    }
})

//create model
const Hotel = mongoose.model('Hotel',hotelSchema);

//export model
module.exports = Hotel;