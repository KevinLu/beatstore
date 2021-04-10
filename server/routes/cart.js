const express = require('express');
const router = express.Router();
const {Cart} = require("../models/Cart");
const {Beat} = require("../models/Beat");

/**
 * @route   GET api/cart/cartById
 * @desc    Get cart by its id
 * @access  Public
 */
router.get('/cartById', async (req, res) => {
    try {
        const cartId = req.query.cartId;
        if (!cartId) throw Error('Cart id is not present in request url.');

        const foundCart = await Cart.findById(cartId).select('-__v').exec();

        if (foundCart === null) {
            throw Error('Cannot find a cart by that id.');
        }

        return res.status(200).json({
            success: true,
            cart: foundCart
        });
    } catch (e) {
        console.log(e);
        return res.status(400).json({success: false, msg: e.message});
    }
});

router.post("/create", async (req, res) => {
    try {
        const cart = new Cart(req.body);

        const savedCart = await cart.save();

        return res.status(201).json({
            success: true,
            cart: savedCart
        });
    } catch (e) {
        console.log(e);
        return res.status(400).json({success: false, msg: e.message});
    }
});

router.post("/add", (req, res) => { // doesn't have to be logged in
    const beatId = req.query.beatId;
    const cartId = req.query.cartId;

    Cart.findOne({_id: cartId}, (err, cart) => {
        let duplicateItem = false;

        cart.items.forEach((i) => {
            if (i.item.toString() === beatId) { // beat already in cart
                duplicateItem = true;
            }
        });

        if (duplicateItem) {
            Cart.findOneAndUpdate(
                {_id: cartId, "items.item": beatId},
                {$inc: {"items.$.quantity": 1}},
                {new: true},
                (err, cart) => {
                    if (err) {
                        return res.json({success: false, err});
                    }
                    res.status(200).json(cart);
                }
            );
        } else {
            Cart.findOneAndUpdate(
                {_id: cartId},
                {
                    $push: {
                        items: {
                            item: beatId,
                            quantity: 1,
                            timestamp: Date.now()
                        }
                    }
                },
                {new: true},
                (err, cart) => {
                    if (err) return res.json({success: false, err});
                    res.status(200).json(cart);
                }
            )
        }
    })
})

router.post("/remove", (req, res) => {
    const beatId = req.query.beatId;
    const cartId = req.query.cartId;

    Cart.findOneAndUpdate(
        {_id: cartId},
        {
            "$pull":
                {"items": {"item": beatId}}
        },
        {new: true},
        (err, cartInfo) => {
            let cart = cartInfo.items;
            let idArray = cart.map(i => i.item);

            Beat.find({'_id': {$in: idArray}})
                .populate('producer')
                .exec((err, cartDetail) => {
                    return res.status(200).json({
                        cartDetail,
                        cart
                    })
                })

        }
    )
})

router.post("/removeAll", (req, res) => {
    const cartId = req.query.cartId;

    Cart.findOneAndUpdate(
        {_id: cartId},
        {"$pull": {"items": {"$exists": true}}},
        (err, cartInfo) => {
            if (err) {
                console.log(err);
                return res.status(500).json({success: false, err});
            }
            return res.status(200).json({cartDetail: [], cart: []});
        }
    )
})

module.exports = router;
