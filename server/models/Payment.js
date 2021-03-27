const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = Schema({
    paymentIntent: {
        type: Object
    },
    sucess: {
        type: Boolean
    }
})

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment }
