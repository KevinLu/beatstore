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
        const beat = await Beat.findById(item).exec();

        if (beat.length > 0) {
            order.products[index].title = beat.title;
            order.products[index].image = beat.artwork[0];
            order.products[index].url = beat.url;
            const producer = await User.findById(beat.producer).exec();
            const savedProducer = {_id: producer._id, username: producer.username, email: producer.email};
            order.products[index].producer = savedProducer;
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
