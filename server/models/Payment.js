const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    paymentIntent: {
        type: Object
    },
    sucess: {
        type: Boolean
    }
})

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment }
