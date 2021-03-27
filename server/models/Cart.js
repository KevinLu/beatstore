const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    array: {
        type: Array,
        default: []
    }
})

const Cart = mongoose.model('Cart', cartSchema);

module.exports = { Cart }
