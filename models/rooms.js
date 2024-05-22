//require mongoose
const mongoose = require('mongoose');

//define the room schema
const roomSchema = new mongoose.Schema({
    name : Number,
    description : String,
    capacity : Number,
    status:{
        type: String,
        default: 'available',
        enum : ['available', 'unavailable']
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
module.exports = mongoose.model('Room', roomSchema)