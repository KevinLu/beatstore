const aws = require('aws-sdk');
const { s3SecretAccessKey, s3AccessKeyId, s3PrivateBucket } = require('../config/key');

const s3 = new aws.S3()
aws.config.update({
    secretAccessKey: s3SecretAccessKey,
    accessKeyId: s3AccessKeyId,
    region: 'us-east-1'
});

const generateSignedUrl = (fileName, expiry) => {
    const url = s3.getSignedUrl('getObject', {
        Bucket: s3PrivateBucket,
        Key: fileName,
        Expires: expiry
    });

    return url;
};

module.exports = { generateSignedUrl }
