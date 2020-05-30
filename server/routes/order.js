const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { Order } = require("../models/Order");
const { stripeSecret } = require("../config/key");
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

router.post("/createSession", auth, async (req, res) => {
    var sessionData = {
        payment_method_types: ['card'],
        line_items: req.body.line_items,
        mode: 'payment',
        success_url: 'http://localhost:3000/orders?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/cart',
    };
    if (req.isAuth) {
        // without the JSON methods, Stripe will crash because apparently req.user._id is not a string?
        console.log(JSON.parse(JSON.stringify(req.user._id)));
        sessionData.client_reference_id = JSON.parse(JSON.stringify(req.user._id));
    }
    const session = await stripe.checkout.sessions.create(sessionData);
    return res.status(200).json({
        success: true,
        sessionId: session.id
    });
});

router.get("/getSession", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        return res.status(200).json({
            success: true,
            session: session
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            err
        });
    }
});

module.exports = router;
