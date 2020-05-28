const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    data: {
        type: Array,
        default: []
    },
    products: {
        type: Array,
        default: []
    }
})

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order }
