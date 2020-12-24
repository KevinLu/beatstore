const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { s3SecretAccessKey, s3AccessKeyId, s3PublicBucket, s3PrivateBucket } = require('../config/key');

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

const uploadFilePublic = (buffer, name, type) => {
    const params = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: s3PublicBucket,
      ContentType: type.mime,
      Key: name,
    };
    return s3.upload(params).promise();
  };

// uploadPrivate is used to upload private files that can only be accessed by paying customers
var uploadPrivate = multer({
    storage: multerS3({
        s3: s3,
        bucket: s3PrivateBucket,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        contentDisposition: 'attachment',
        key: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
    fileFilter: mediaFilter
});

module.exports = { uploadFilePublic, uploadPrivate };
