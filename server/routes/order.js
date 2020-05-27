const express = require('express');
const router = express.Router();
const { Order } = require("../models/Order");
const { stripeSecret } = require("../config/dev");
const stripe = require('stripe')(stripeSecret);

//=================================
//             Order
//=================================

router.post("/add", (req, res) => {

    const order = new Order(req.body);

    order.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
            orderId: order._id
        });
    });
});

router.post("/createSession", async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: req.body.line_items,
        mode: 'payment',
        success_url: 'http://localhost:3000/',
        cancel_url: 'http://localhost:3000/cart',
    });
    return res.status(200).json({
        success: true,
        sessionId: session.id
    });
});

module.exports = router;
