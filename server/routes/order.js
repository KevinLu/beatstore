const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth } = require("../middleware/auth");
const { Order } = require("../models/Order");
const { Payment } = require("../models/Payment");
const { Beat } = require("../models/Beat");
const { Cart } = require("../models/Cart");
const { stripeSecret } = require("../config/key");
const stripe = require('stripe')(stripeSecret);
const generateurl = require('../services/generateurl');
const generateSignedUrl = generateurl.generateSignedUrl;

//=================================
//             Order
//=================================

router.get("/getUserOrders", auth, async (req, res) => {
    if (req.isAuth) {
        try {
            if (!req.user) throw Error('User does not exist');
            const orders = await Order.find({ user: req.user._id })
                                      .populate({
                                          path: 'products',
                                          populate: {
                                              path: 'producer',
                                              select: 'username',
                                          }
                                        })
                                      .select([
                                        'date',
                                        'products',
                                        'checkoutSession.payment_intent',
                                        'checkoutSession.amount_total',
                                        'checkoutSession.amount_subtotal',
                                        'checkoutSession.total_details',
                                        'checkoutSession.payment_status',])
                                      .sort({_id: -1});
            return res.status(200).json({ success: true, orders });
        } catch (e) {
            return res.status(400).json({ success: false, msg: e.message });
        }
    }
});

router.post("/createSession", auth, async (req, res) => {
    try {
        const cartId = req.body.cartId;
        if (!cartId) throw Error('Cart id is not present in request.');

        const foundCart = await Cart.findById(cartId).populate('items.item').select('-__v').exec();
        if (foundCart === null) throw Error('Cannot find a cart by that id.');

        let productIds = foundCart.items.map(i => i.item.id);

        let line_items = [];

        foundCart.items.forEach(i => {
            line_items.push({
                price_data: {
                    currency: 'usd',
                    unit_amount: i.item.price * 100,
                    product_data: {
                        name: i.item.title,
                        description: `${i.item.description} - MP3 LEASE`,
                        images: i.item.artwork,
                        metadata: {
                            mongo_id: i.item.id,
                        }
                    }
                },
                quantity: 1,
            });
        });
        
        let sessionData = {
            payment_method_types: ['card'],
            line_items,
            metadata: {productIds: JSON.stringify(productIds)},
            mode: 'payment',
            success_url: 'http://localhost:3000/download?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cart',
        };
        if (req.isAuth && req.user) {
            // without the JSON methods, Stripe will crash because apparently req.user._id is not a string?
            sessionData.client_reference_id = req.user.id;
        }
        const session = await stripe.checkout.sessions.create(sessionData);
        return res.status(201).json({
            success: true,
            sessionId: session.id
        });
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
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

router.get("/getOrderStatus", async (req, res) => {
    try {
        const session_id = req.query.session_id;
        if (!session_id) throw Error('Session id is not present in request.');

        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
        const productIds = JSON.parse(checkoutSession.metadata.productIds);
        // See: https://stripe.com/docs/payments/intents#intent-statuses
        const paymentIntent = await stripe.paymentIntents.retrieve(checkoutSession.payment_intent);
        if (paymentIntent && paymentIntent.status !== 'succeeded') {
            return res.status(200).send({
                success: true,
                orderStatus: paymentIntent.status,
            });
        }

        const products = await Beat.find({'_id': { $in: productIds }})
                                   .select(['-producer', '-licenses', '-_id', '-__v', '-bpm', '-length', '-date'])
                                   .exec();
        const expiry = 7200; // link expiry in seconds
        let downloadLinks = [];

        products.forEach(doc => {
            var audioUrl = doc.purchaseAudio[0];
            var processedLink = decodeURIComponent(audioUrl.substr(audioUrl.lastIndexOf('/') + 1)).normalize('NFD');
            downloadLinks.push(generateSignedUrl(processedLink, expiry));
        });
        
        return res.status(200).json({
            success: true,
            orderStatus: paymentIntent.status,
            products: products,
            downloadLinks: downloadLinks
        });
    } catch (e) {
        console.log(e);
        return res.status(400).send({
            success: false,
            msg: e.message
        });
    }
});

router.post("/getDownloadLink", auth, async (req, res) => {
    if (req.isAuth) {
        try {
            if (!req.body.mongo_id) throw Error('No beat ID attached with your request.');
            const mongo_id = req.body.mongo_id;

            const beat = await Beat.findById(mongo_id);

            const expiry = 7200; // link expiry in seconds

            var audioUrl = beat.purchaseAudio[0];
            var processedLink = decodeURIComponent(audioUrl.substr(audioUrl.lastIndexOf('/') + 1)).normalize('NFD');
            var downloadLink = generateSignedUrl(processedLink, expiry);
            
            return res.status(200).json({
                success: true,
                downloadLink: downloadLink
            });
        } catch (e) {
            return res.status(400).json({ success: false, msg: e.message });
        }
    } else {
        return res.status(401).json({ success: false, msg: "You must be logged in to do this." });
    }
});

router.post("/getReceiptLink", auth, async (req, res) => {
    if (req.isAuth) {
        try {
            if (!req.body.paymentIntent) throw Error('No payment ID attached with your request.');
            const paymentIntent = req.body.paymentIntent;

            const payment = await Payment.find({ 'paymentIntent.id': paymentIntent });

            const receiptLink = payment[0].paymentIntent.charges.data[0].receipt_url;
            
            return res.status(200).json({
                success: true,
                receiptLink: receiptLink
            });
        } catch (e) {
            return res.status(400).json({ success: false, msg: e.message });
        }
    } else {
        return res.status(401).json({ success: false, msg: "You must be logged in to do this." });
    }
});

module.exports = router;
