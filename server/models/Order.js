const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Beat } = require("../models/Beat");
const { User } = require("../models/User");

const orderSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    checkoutSession: {
        type: Object
    },
    lineItems: {
        type: Array,
        default: []
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Beat'
    }],
    date: {
        type: Date,
        default: new Date()
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = {Order}
