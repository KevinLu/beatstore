const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beatSchema = mongoose.Schema({
    producer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
    audios: {
        type: Array,
        default: []
    },
    images: {
        type: Array,
        default: []
    },
    tags: {
        type: Array,
        default: []
    },
    url: {
        type: String
    }
})

beatSchema.index(
    { tags: "text", title: "text" },
    { default_language: "english" },
    { weights: { tags: 5, title: 4 } },
    { name: "TagsAndTitle" }
);

/*beatSchema.index(
    { tags: "text" },
    { default_language: "english" },
    { name: "TagsOnly" }
);*/

const Beat = mongoose.model('Beat', beatSchema);

module.exports = { Beat }
