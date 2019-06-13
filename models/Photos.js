var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var photoSchema = new Schema({
    userid: {type: String},
    filename:  { type: String },
    propertyid: {type: String, ref: 'Property' },
    uploaded: {type: Date, default: Date.now } 
  });
module.exports = mongoose.model('Photos', photoSchema);