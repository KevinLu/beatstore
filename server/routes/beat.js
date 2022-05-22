const express = require('express');
const router = express.Router();
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');
const sharp = require('sharp');
const {uploadPrivate, uploadFilePublic} = require("../services/fileupload");
const singleUploadPrivate = uploadPrivate.single('file');
const {Beat} = require("../models/Beat");
const {auth} = require("../middleware/auth");
const {stripeSecret} = require("../config/key");
const mongoose = require('mongoose');

//=================================
//             Beat
//=================================

const imageWidth = 208; //px
const imageHeight = 208; //px

router.post("/uploadPublicFile", (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(415).json({success: false, error});
        };
        try {
            const path = files.file[0].path;
            const buffer = fs.readFileSync(path);
            const type = await fileType.fromBuffer(buffer);
            const fileName = files.file[0].originalFilename;
            // Only use Sharp to resize if these aren't audio files
            if (type.ext !== "mp3" && type.ext !== "wav") {
                const rsz = await sharp(buffer).resize(imageWidth, imageHeight).toBuffer();
                const data = await uploadFilePublic(rsz, fileName, type);
                return res.status(200).json({success: true, file: {location: data.Location, name: data.Key}});
            } else {
                const data = await uploadFilePublic(buffer, fileName, type);
                return res.status(200).json({success: true, file: {location: data.Location, name: data.Key}});
            }
        } catch (err) {
            return res.status(415).json({success: false, err});
        }
    });
});

router.post("/uploadPrivateFile", (req, res) => {
    singleUploadPrivate(req, res, err => {
        if (err) {
            console.log(err);
            return res.status(415).json({success: false, err});
        } else {
            return res.status(200).json({success: true, file: {location: req.file.location, name: req.file.originalname}});
        }
    })
});

router.post("/uploadBeat", auth, (req, res) => {
    let beatToBeCreated = req.body;
    beatToBeCreated.licenses = beatToBeCreated.licenses.map(id => ({license: id}));
    const beat = new Beat(beatToBeCreated);

    // DEPRECATED: Create a new product on Stripe
    // stripe.products.create(
    //     {
    //         name: req.body.title,
    //         type: 'good',
    //         description: req.body.description,
    //         attributes: ['name'],
    //         metadata: {mongo_id: beat.id},
    //         images: req.body.artwork,
    //         shippable: false
    //     }, (err, product) => {
    //         if (err) return res.status(400).json({success: false, err});

    //         stripe.prices.create(
    //             {
    //                 unit_amount: req.body.price * 100,
    //                 currency: 'usd',
    //                 product: product.id,
    //                 metadata: {mongo_id: beat.id}
    //             }, (err, price) => {
    //                 if (err) return res.status(400).json({success: false, err});

    //                 beat.stripeProductId = product.id;
    //                 beat.stripePriceId = price.id;

    //                 beat.save((err) => { // Save beat into MongoDB
    //                     if (err) return res.status(400).json({success: false, err});

    //                     return res.status(200).json({success: true});
    //                 });
    //             }
    //         );
    //     }
    // );

    beat.save((err) => { // Save beat into MongoDB
        if (err) return res.status(400).json({success: false, err});

        return res.status(200).json({success: true});
    });
});

router.post("/getBeats", (req, res) => { // no need auth
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let terms = req.body.searchTerm;
    console.log("getBeats: ", terms + " [" + skip + ", " + limit + "]");

    if (terms) { // if a search term is specified, only then we look for specific beats
        Beat.find({$text: {$search: terms}})
            .populate('producer', 'username -_id')
            .populate({path: 'licenses.license', model: 'License'})
            .select(['-purchaseAudio', '-trackStems'])
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, beats) => {
                if (err) return res.status(400).json({success: false, err});
                res.status(200).json({success: true, beats, count: beats.length});
            });
    } else {
        Beat.find()
            .populate('producer', 'username -_id')
            .populate({path: 'licenses.license', model: 'License'})
            .select(['-purchaseAudio', '-trackStems'])
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, beats) => {
                if (err) return res.status(400).json({success: false, err});
                res.status(200).json({success: true, beats, count: beats.length});
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

    Beat.find({'url': {$in: beatUrls}})
        .populate('producer', 'username -_id')
        .select(['-purchaseAudio', '-trackStems'])
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

    Beat.find({'_id': {$in: beatIds}})
        .populate('producer', 'username -_id')
        .select(['-purchaseAudio', '-trackStems'])
        .exec((err, beat) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(beat);
        });
});

module.exports = router;
