const express = require('express');
const router = express.Router();
const { Cart } = require("../models/Cart");

/**
 * @route   GET api/cart/cartById
 * @desc    Get cart by its id
 * @access  Public
 */
router.get('/cartById', (req, res) => {
    const cartId = req.query.cartId;

    Cart.findOne({ _id: cartId }, (err, cart) => {
        if (err) { return res.status(400).json({ success: false, err }); }
        res.status(200).json({ success: true, cart });
    });
});

router.post("/create", (req, res) => {

    const cart = new Cart(req.body);

    cart.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
            cartId: cart._id
        });
    });
});

router.post("/add", (req, res) => { // doesn't have to be logged in
    const beatId = req.query.beatId;
    const cartId = req.query.cartId;

    Cart.findOne({ _id: cartId }, (err, cart) => {
        let duplicateItem = false;

        cart.array.forEach((item) => {
            if (item.id === beatId) { // beat already in cart
                duplicateItem = true;
            }
        });

        if (duplicateItem) {
            Cart.findOneAndUpdate(
                { _id: cartId, "array.id": beatId },
                { $inc: { "array.$.quantity": 1 } },
                { new: true },
                (err, cart) => {
                    if (err) {
                        return res.json({ success: false, err });
                    }
                    res.status(200).json(cart);
                }
            );
        } else {
            Cart.findOneAndUpdate(
                { _id: cartId },
                {
                    $push: {
                        array: {
                            id: beatId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, cart) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(cart);
                }
            )
        }
    })
})


module.exports = router;
