var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var favouriteSchema = new Schema({
    userid: {type: String},
    propertyuid:  { type: String },
    propertyid: {type: String, ref: 'Property' }
  });
module.exports = mongoose.model('Favourite', favouriteSchema);