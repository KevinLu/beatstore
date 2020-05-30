const express = require('express');
const router = express.Router();
const upload = require("../services/fileupload");
const singleUpload = upload.single('file');
const { Beat } = require("../models/Beat");
const { auth } = require("../middleware/auth");
const { stripeSecret } = require("../config/key");
const stripe = require('stripe')(stripeSecret);

//=================================
//             Beat
//=================================

router.post("/uploadFile", (req, res) => {
    singleUpload(req, res, err => {
        if (err) {
            return res.status(415).json({ success: false, err });
        } else {
            return res.status(200).json({ success: true, file: { location: req.file.Location, name: req.file.originalname } });
        }
    })
});

router.post("/uploadBeat", auth, (req, res) => {
    var beatDetails = req.body;

    stripe.products.create(
        {
            name: req.body.title,
            type: 'good',
            description: req.body.description,
            images: req.body.images,
            shippable: false
        }, (err, product) => {
            if (err) return res.status(400).json({ success: false, err });

            beatDetails['stripeProductId'] = product.id;

            stripe.prices.create(
                {
                    unit_amount: req.body.price * 100,
                    currency: 'usd',
                    product: product.id,
                }, (err, price) => {
                    if (err) return res.status(400).json({ success: false, err });

                    beatDetails['stripePriceId'] = price.id;
                    const beat = new Beat(beatDetails);
                    beat.save((err) => {
                        if (err) return res.status(400).json({ success: false, err });
                        return res.status(200).json({ success: true });
                    });
                }
            );
        }
    );
});

router.post("/getBeats", (req, res) => { // no need auth
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let terms = req.body.searchTerm;

    if (terms) { // if a search term is specified, only then we look for specific beats
        Beat.find({ $text: { $search: terms } })
            .populate("producer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, beats) => {
                if (err) return res.status(400).json({ success: false, err });
                res.status(200).json({ success: true, beats, count: beats.length });
            });
    } else {
        Beat.find()
            .populate("producer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, beats) => {
                if (err) return res.status(400).json({ success: false, err });
                res.status(200).json({ success: true, beats, count: beats.length });
            });
    }
});

router.get("/beats_by_url", (req, res) => { // no need auth
    let type = req.query.type;
    let beatUrls = req.query.url;

    if (type === "array") {
        let urls = req.query.url.split(',');
        beatUrls = [];
        beatUrls = urls.map(item => {
            return item;
        });
    }

    Beat.find({ 'url': { $in: beatUrls } })
        .populate('producer')
        .exec((err, beat) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(beat);
        });
});

router.get("/beats_by_id", (req, res) => { // no need auth
    let type = req.query.type;
    let beatIds = req.query.id;

    if (type === "array") {
        let ids = req.query.id.split(',');
        beatIds = [];
        beatIds = ids.map(item => {
            return item;
        });
    }

    Beat.find({ '_id': { $in: beatIds } })
        .populate('producer')
        .exec((err, beat) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(beat);
        });
});

module.exports = router;
