const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Beat'
        },
        quantity: {
            type: Number
        },
        timestamp: {
            type: Date
        }
    }]
})

const Cart = mongoose.model('Cart', cartSchema);

module.exports = {Cart}
