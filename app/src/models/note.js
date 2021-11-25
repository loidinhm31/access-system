const mongoose = require('mongoose');
const Tag = require('./tag');

const collectionName = 'notes';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    thumbnail: {
        type: String,
    }
}, {
    timestamps: true
})

noteSchema.virtual('tags', {
    ref: 'Tag',
    localField: '_id',      // db key
    foreignField: 'noteId'  // model key
})

noteSchema.pre('remove', async function (next) {
    const note = this;

    await Tag.deleteMany({ noteId: note._id });

    next();
})

const Note = mongoose.model(collectionName, noteSchema);

module.exports = Note;