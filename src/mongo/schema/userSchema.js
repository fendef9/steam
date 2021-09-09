const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    role: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String,
        default: "null"
    },
    username: {
        type: String,
    },
    friends: {
        type: Array
    },
    games: {
        type: Array
    }
})

module.exports = { userSchema };