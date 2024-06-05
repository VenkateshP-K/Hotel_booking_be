//require mongoose
const mongoose = require('mongoose');

//define the room schema
const roomSchema = new mongoose.Schema({
    name : Number,
    description : String,
    capacity : Number,
    price : Number,
    status:{
        type: String,
        default: 'available',
        enum: ['available', 'booked']
    },
    amentities:{
        type: Array,
        default: 'no amentities',
    },
    date: Date,
    Hotel : {type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'},
    customers : [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
})

//export the model
const Room = mongoose.model('Room', roomSchema)

module.exports = Room