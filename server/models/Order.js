const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    checkoutSession: {
        type: Object
    },
    products: {
        type: Array,
        default: []
    }
})

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order }
