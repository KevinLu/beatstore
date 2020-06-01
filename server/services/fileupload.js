const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-sharp-s3');
const path = require('path');
const { s3SecretAccessKey, s3AccessKeyId, s3PublicBucket, s3PrivateBucket } = require('../config/key');

const imageWidth = 208; //px
const imageHeight = 208; //px

const s3 = new aws.S3();

aws.config.update({
    secretAccessKey: s3SecretAccessKey,
    accessKeyId: s3AccessKeyId,
    region: 'us-east-1'
});

const mediaFilter = function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.mp3' && ext !== '.wav' && ext !== '.png'
        && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.zip'
        && ext !== '.rar') {
        return cb(new Error('File type not supported.'), false);
    } else {
        cb(null, true);
    }
}

// uploadPublic is used to upload public files that can be accessed by anyone
var uploadPublic = multer({
    storage: multerS3({
        s3: s3,
        ACL: 'public-read',
        Bucket: s3PublicBucket,
        ContentType: multerS3.AUTO_CONTENT_TYPE,
        Key: (req, file, cb) => {
            cb(null, file.originalname);
        },
        resize: {
            width: imageWidth,
            height: imageHeight
        }
    }),
    fileFilter: mediaFilter
});

// uploadPrivate is used to upload private files that can only be accessed by paying customers
var uploadPrivate = multer({
    storage: multerS3({
        s3: s3,
        Bucket: s3PrivateBucket,
        ContentType: multerS3.AUTO_CONTENT_TYPE,
        ContentDisposition: 'attachment',
        Key: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
    fileFilter: mediaFilter
});

module.exports = { uploadPublic, uploadPrivate };
