//create a new user
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    passwordHash: String,
    location:{
        type: String,
        default: "Unknown"
    },
    role: {
        type: String,
        enum: ["user", "admin"],    
        default: "user"
    }
})

const User = mongoose.model('User', userSchema,);

module.exports = User;