const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { Order } = require("../models/Order");
const { Payment } = require("../models/Payment");
const { stripeSecret, endpointSecret } = require("../config/key");
const stripe = require('stripe')(stripeSecret);

//=================================
//             Webhook
//=================================

const handleCheckoutSession = (intent) => {
    stripe.checkout.sessions.listLineItems(
        intent.id,
        { limit: 100 },
        (err, lineItems) => {
            if (err) console.log(err);

            const data = {
                user: intent.client_reference_id,
                checkoutSession: intent,
                products: lineItems.data
            };

            const order = new Order(data);
            order.save((err, doc) => {
                if (err) console.log(err);
            });
        }
    );
};

const handlePaymentSuccess = (intent) => {
    delete intent.client_secret;

    const data = {
        paymentIntent: intent,
        success: true
    };

    const payment = new Payment(data);
    payment.save((err, doc) => {
        if (err) console.log(err);
    });
};

const handlePaymentFailure = (intent) => {
    delete intent.client_secret;

    const data = {
        paymentIntent: intent,
        success: false
    };

    const payment = new Payment(data);
    payment.save((err, doc) => {
        if (err) console.log(err);
    });
};

// Match the raw body to content type application/json
router.post('/v1', bodyParser.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event = null;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    let intent = null;

    switch (event['type']) {
        case 'checkout.session.completed':
            intent = event.data.object;
            handleCheckoutSession(intent);
            break;
        case 'payment_intent.succeeded':
            intent = event.data.object;
            handlePaymentSuccess(intent);
            break;
        case 'payment_intent.payment_failed':
            intent = event.data.object;
            handlePaymentFailure(intent);
            break;
    }

    // Return a response to acknowledge receipt of the event
    res.status(200).json({ received: true });
});


module.exports = router;
