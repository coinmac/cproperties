const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    amountpaid: {
        type: Number,
        required: true
    },
    payref: {
        type: String,
        required: true
    },
    depositorname: {
        type: String,
        required: true
    },
    methodofpayment: {
        type: String,
        required: true
    },
    bankpaidto: {
        type: String,
        required: true
    },
    paymentdate: {
        type: String,
        required: true
    },
    payid: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    dateadded: {type: Date, default: Date.now } 
    });

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;