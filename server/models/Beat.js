const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beatSchema = Schema({
    producer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    licenses: [{
        license: {
            type: Schema.Types.ObjectId,
            ref: 'License'
        },
        enabled_for_beat: {
            type: Boolean,
            default: true
        },
        price_override: {
            type: Number,
            default: 0
        },
        _id: false,
    }],
    title: {
        type: String,
        maxlength: 80
    },
    description: {
        type: String
    },
    bpm: {
        type: Number,
        default: 0
    },
    length: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    date: {
        type: Date
    },
    previewAudio: {
        type: Array,
        default: []
    },
    purchaseAudio: {
        type: Array,
        default: []
    },
    trackStems: {
        type: Array,
        default: []
    },
    artwork: {
        type: Array,
        default: []
    },
    tags: {
        type: Array,
        default: []
    },
    url: {
        type: String
    },
    // stripeProductId: {
    //     type: String
    // },
    // stripePriceId: {
    //     type: String
    // }
})

beatSchema.index(
    {tags: "text", title: "text"},
    {default_language: "english"},
    {weights: {tags: 5, title: 4}},
    {name: "TagsAndTitle"}
);

/*beatSchema.index(
    { tags: "text" },
    { default_language: "english" },
    { name: "TagsOnly" }
);*/

const Beat = mongoose.model('Beat', beatSchema);

module.exports = {Beat}
