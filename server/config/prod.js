module.exports = {
    mongoURI: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    stripeSecret: process.env.STRIPE_SECRET
    s3SecretAccessKey: process.env.S3_SECRET_KEY,
    s3AccessKeyId: process.env.S3_ACCESS_KEY,
    s3Bucket: process.env.S3_BUCKET
}