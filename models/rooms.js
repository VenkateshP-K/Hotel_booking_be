const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    capacity: { type: Number, required: true },
    status: { type: String, required: true },
    amenities: { type: [Array], required: true },
    price: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isBooked: { type: Boolean, default: false }
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;