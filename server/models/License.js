const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const licenseSchema = Schema({
    // Basic info
    name: {
        type: String,
        maxlength: 80,
        default: 'Unnamed License',
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0,
        min: 0,
        max: 999999,
        required: true
    },
    min_offer_price: {
        type: Number,
        default: 0, // 0 means offers are off
        min: 0,
        max: 999999,
        required: true
    },
    enabled: {
        type: Boolean,
        default: false,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false, // soft delete
        required: true
    },
    // File info
    included_mp3: {
        type: Boolean,
        default: true, // should always be included (true)
        required: true
    },
    mp3_untagged: {
        type: Boolean,
        default: true, // false means mp3 is tagged
        required: true
    },
    included_wav: {
        type: Boolean,
        default: false,
        required: true
    },
    included_stems: {
        type: Boolean,
        default: false,
        required: true
    },
    // License values
    audio_streams: {
        type: Number,
        default: 10000,
        min: -1,
        required: true
    },
    distribution_copies: {
        type: Number,
        default: 10000,
        min: -1,
        required: true
    },
    free_downloads: {
        type: Number,
        default: 10000,
        min: -1,
        required: true
    },
    music_videos: {
        type: Number,
        default: 1,
        min: -1,
        required: true
    },
    music_video_streams: {
        type: Number,
        default: 10000,
        min: -1,
        required: true
    },
    radio_stations: {
        type: Number,
        default: 1,
        min: -1,
        required: true
    },
    allow_for_profit_performances: {
        type: Boolean,
        default: false,
        required: true
    },
    non_profit_performances: {
        type: Number,
        default: -1, // -1 means unlimited
        min: -1,
        required: true
    }
});

const License = mongoose.model('License', licenseSchema);

module.exports = { License: License };
