const mongoose = require('mongoose');

const AmenitySchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    propertyid: {
        type: String,
        required: true,
        ref: 'Property'
    },
    amenityname: {
        type: String,
        required: false
    },
    quantity: {
        type: String,
        required: true
    },
    additional: {
        type: String,
        required: true
    }
    });

const Amenities = mongoose.model('Amenities', AmenitySchema);

module.exports = Amenities;