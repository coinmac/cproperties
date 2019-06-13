const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        unique: true,
        ref: 'Profile'
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;