const express = require('express');
const router = express.Router();
const { Beat } = require("../models/Beat");
const multer = require('multer');
const { auth } = require("../middleware/auth");

var path = require('path');

const audioFilter = function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.mp3' && ext !== '.wav') {
        return cb(new Error('Only mp3 and wav files allowed.'), false);
    } else {
        cb(null, true);
    }
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: audioFilter
}).single("file");

//=================================
//             Beat
//=================================

router.post("/uploadFile", auth, (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, error: err })
        } else {
            return res.json({ success: true, file: res.req.file.path, fileName: res.req.file.filename })
        }
    })
});

router.post("/uploadBeat", auth, (req, res) => {
    const beat = new Beat(req.body)

    beat.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })
});

module.exports = router;
