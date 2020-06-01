const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { Order } = require("../models/Order");
const { stripeSecret } = require("../config/key");
const stripe = require('stripe')(stripeSecret);

//=================================
//             Order
//=================================

router.get("/getUserOrders", auth, async (req, res) => {
    if (req.isAuth) {
        try {
            if (!req.user) throw Error('User does not exist');
            const orders = await Order.find({ user: req.user._id });
            return res.status(200).json({ success: true, orders });
        } catch (e) {
            return res.status(400).json({ success: false, msg: e.message });
        }
    }
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
