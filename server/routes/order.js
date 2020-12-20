const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth } = require("../middleware/auth");
const { Order } = require("../models/Order");
const { Beat } = require("../models/Beat");
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
            const orders = await Order.find({ user: req.user._id }).sort({_id: -1});
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
        success_url: 'http://localhost:3000/download?session_id={CHECKOUT_SESSION_ID}',
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

router.get("/getOrderStatus", async (req, res) => {
    try {
        const session_id = req.query.session_id;
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

        if (paymentIntent.status === "succeeded") {
            try {
                const lineItems = await stripe.checkout.sessions.listLineItems(session_id, { limit: 100 });

                if (lineItems.data) {
                    var objectIds = [];
                    lineItems.data.map((item, i) => {
                        objectIds[i] = mongoose.Types.ObjectId(item.price.metadata.mongo_id);
                    });

                    Beat.find({
                        '_id': { $in: objectIds }
                    }, function (err, docs) {
                        if (err) {
                            return res.status(400).send({
                                success: false,
                                err
                            });
                        } else {
                            const expiry = 7200; // link expiry in seconds
                            var downloadLinks = [];

                            docs.forEach((doc, index) => {
                                var audioUrl = doc.purchaseAudio[0];
                                var processedLink = decodeURIComponent(audioUrl.substr(audioUrl.lastIndexOf('/') + 1)).normalize('NFD');
                                downloadLinks[index] = generateSignedUrl(processedLink, expiry);
                            });
                            
                            return res.status(200).json({
                                success: true,
                                orderStatus: paymentIntent.status,
                                lineItems: docs,
                                downloadLinks: downloadLinks
                            });
                        }
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        orderStatus: paymentIntent.status,
                        lineItems: lineItems
                    });
                }
            } catch (err) {
                return res.status(400).send({
                    success: false,
                    err
                });
            }
        } else {
            return res.status(200).json({
                success: true,
                orderStatus: paymentIntent.status
            });
        }
    } catch (err) {
        return res.status(400).send({
            success: false,
            err
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

module.exports = router;
