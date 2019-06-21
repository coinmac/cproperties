const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    propertyname: {
        type: String,
        required: true
    },
    propertyoffer: {
        type: String,
        required: true
    },
    propertysize: {
        type: String,
        required: false
    },
    propertycategory: {
        type: String,
        required: true
    },
    offerstatus: {
        type: String,
        required: true
    },
    physicalcondition: {
        type: String,
        required: true
    },
    featuredimg: {
        type: String,
        required: false
    },
    propertyprice: {
        type: String,
        required: false
    },
    phonenumber: {
        type: String,
        required: false
    },
    propertydescription: {
        type: String,
        required: false
    },
    physicallocation: {
        type: String,
        required: true
    },
    propertystate: {
        type: String,
        required: false
    },
    propertycity: {
        type: String,
        required: false
    },
    viewcategory: {
        type: String,
        required: true
    },
    propertytype: {
        type: String,
        required: false
    },
    bedrooms: {
        type: Number,
        required: false
    },
    baths: {
        type: Number,
        required: false
    },
    garage: {
        type: Number,
        required: false
    },
    property_video: {
        type: String,
        required: false
    },
    agentswarning: {
        type: String,
        required: false
    },
    pterms: {
        type: String,
        required: true
    },
    datepublished: {
        type: Date,
        default: Date.now
    },
    propertyid:{
        type: String,
        default: true,
        required: true,
        unique: true

        // default: function() {
           //  return randToken.generate(64);
        // }
    },
    approval:{
        type: String,
        default: false
    }
    });

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;