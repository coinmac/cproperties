var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var contactSchema = new Schema({
    senderid: {type: String},
    receiverid:  { type: String },
    firstname: {type: String },
    lastname: {type: String },
    email: {type: String},
    subject: {type: String},
    message: {type: String},
    datesent: {type: Date,default: Date.now},
    status: {type: String}
  });
module.exports = mongoose.model('Contact', contactSchema);