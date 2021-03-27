const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const licenseSchema = Schema({
    // Basic info
    name: {
        type: String,
        maxlength: 80
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    min_offer_price: {
        type: Number,
        default: 0 // 0 means offers are off
    },
    enabled: {
        type: Boolean,
        default: false
    },
    // File info
    included_mp3: {
        type: Boolean,
        default: true // should always be included (true)
    },
    mp3_untagged: {
        type: Boolean,
        default: true // false means mp3 is tagged
    },
    included_wav: {
        type: Boolean,
        default: false
    },
    included_stems: {
        type: Boolean,
        default: false
    },
    // License values
    audio_streams: {
        type: Number,
        default: 10000
    },
    distribution_copies: {
        type: Number,
        default: 10000
    },
    free_downloads: {
        type: Number,
        default: 10000
    },
    music_videos: {
        type: Number,
        default: 1
    },
    music_video_streams: {
        type: Number,
        default: 10000
    },
    radio_stations: {
        type: Number,
        default: 1
    },
    allow_for_profit_performances: {
        type: Boolean,
        default: false
    },
    non_profit_performances: {
        type: Number,
        default: -1 // -1 means unlimited
    }
});

const License = mongoose.model('License', licenseSchema);

module.exports = { License: License };
