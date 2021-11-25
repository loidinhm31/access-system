const mongoose = require('mongoose');

const collectionName = 'tags';

const tagSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    thumbnail: {
        type: String,
    },
    extension: {
        type: String,
        required: true
    },
    noteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'notes'
    }
}, {
    timestamps: true
})

const Tag = mongoose.model(collectionName, tagSchema);

module.exports = Tag;