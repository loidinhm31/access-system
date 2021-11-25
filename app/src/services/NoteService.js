const Note = require('../models/note');
const logger = require('../logger/Logger');

class NoteService {

    async getNotes(limit, skip, sortBy) {
        logger.info('service get notes');

        const sort = {}
        if (sortBy) {
            const parts = sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        const notes = await Note.find()
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .sort(sortBy)
            .exec();
        return notes;
    }


    async getOneNoteById(id) {
        logger.info(`service get one note, id: ${id}`);
        const note = await Note.findById(id);
        return note;
    }

    async getOneNotesBySessionCode(sessionId) {
        logger.info(`Service get one note by session code: ${sessionId}`);
        const note = await Note.findOne({sessionKey: sessionId});
        if (!note) {
            throw new Error('Cannot find note');
        }
        return note;
    }
}

module.exports = NoteService;
