const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: false
    },
    accounttype: {
        type: String,
        required: true
    },
    accountplan: {
        type: String,
        required: false
    },
    pemail: {
        type: String,
        required: false
    },
    facebook: {
        type: String,
        required: false
    },
    twitter: {
        type: String,
        required: false
    },
    linkedin: {
        type: String,
        required: false
    },
    instagram: {
        type: String,
        required: false
    },
    profileimg: {
        type: String,
        required: false
    },
    generalinfo: {
        type: String,
        required: false
    },
    accountstatus: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    profilecompletion: {
        type: String,
        required: true
    },
    credit: {
        type: Number,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;