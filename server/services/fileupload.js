const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { s3SecretAccessKey, s3AccessKeyId, s3Bucket } = require('../config/key');

const s3 = new aws.S3();

aws.config.update({
    secretAccessKey: s3SecretAccessKey,
    accessKeyId: s3AccessKeyId,
    region: 'us-east-1'
});

const mediaFilter = function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.mp3' && ext !== '.wav' && ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return cb(new Error('File type not supported.'), false);
    } else {
        cb(null, true)
    }
}

var upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: s3Bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, Object.assign({}, req.body));
        },
        key: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
    fileFilter: mediaFilter
});

module.exports = upload;
