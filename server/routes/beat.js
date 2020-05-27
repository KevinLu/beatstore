const express = require('express');
const router = express.Router();
const { Beat } = require("../models/Beat");
const multer = require('multer');
const { auth } = require("../middleware/auth");
const { stripeSecret } = require("../config/dev");
const stripe = require('stripe')(stripeSecret);

var path = require('path');

const mediaFilter = function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.mp3' && ext !== '.wav' && ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return cb(new Error('File type not supported.'), false);
    } else {
        cb(null, true)
    }
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.mp3' || ext === '.wav') {
            cb(null, 'uploads/beats/')
        } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
            cb(null, 'uploads/img')
        } else {
            cb(new Error('File type not supported.'));
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: mediaFilter
}).single("file");

//=================================
//             Beat
//=================================

router.post("/uploadAudio", auth, (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        } else {
            return res.json({ success: true, file: res.req.file.path, fileName: res.req.file.filename });
        }
    })
});

router.post("/uploadImage", auth, (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        } else {
            return res.json({ success: true, file: res.req.file.path, fileName: res.req.file.filename });
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
