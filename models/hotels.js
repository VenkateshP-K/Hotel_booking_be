//require mongoose
const mongoose = require('mongoose');

//define schema
const hotelSchema = new mongoose.Schema({
    name : String,
    address : String,
    description : String,
    rooms:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room'
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

//create model
const Hotel = mongoose.model('Hotel',hotelSchema);

//export model
module.exports = Hotel;