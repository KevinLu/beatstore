const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Beat } = require("../models/Beat");

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
    },
    date: {
        type: Date,
        default: new Date()
    }
});

orderSchema.pre('save', function (next) {
    var order = this;

    const mutateOrder = async (item, index) => {
        const beat = await Beat.find({_id: item}).exec();

        if (beat.length > 0) {
            order.products[index].image = beat[0].artwork[0];
            order.products[index].url = beat[0].url;
        }

        return order;
    }

    const mapOrder = async () => {
        return Promise.all(order.products.map((product, index) => mutateOrder(product.price.metadata.mongo_id, index)));
    };

    mapOrder().then(data => {
        next();
    });
});

const Order = mongoose.model('Order', orderSchema);

module.exports = {Order}
