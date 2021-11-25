const express = require("express");
const multer = require('multer');
const sharp = require('sharp');

const auth = require('../middleware/auth');
const NoteService = require('../services/NoteService');

const router = new express.Router();

router.get('/notes', async (req, res) => {
    try {
        const notes = await NoteService.prototype.getNotes(req.query.limit, req.query.skip, req.query.sortBy);
        res.send(notes);
    } catch (e) {
        res.status(500).send()
    }
});

router.get('/note/:id', async (req, res) => {
    const noteId = req.params.id;
    try {
        const note = await NoteService.prototype.getOneNoteById(noteId);
        res.send(note);
    } catch (e) {
        res.status(500).send()
    }
});

router.get('/note/sessionCode/:sessionCode', async (req, res) => {
    const sessionName = req.params.sessionCode;

    try {
        const note = await NoteService.prototype.getOneNotesBySessionCode(sessionName);
        res.send(note);
    } catch (e) {
        res.status(404).send({
            status: 404,
            error: e.message
        });
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

// router.post('/notes/:noteId/thumbnail', auth, upload.single('avatar'), async (req, res) => {
//     const image = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).jpeg();
//     req.user.avatar = image.toBuffer();
//     await req.user.save()
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })
//
// router.get('/notes/:noteId/thumbnail', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)
//
//         if (!user || !user.avatar) {
//             throw new Error()
//         }
//
//         res.set('Content-Type', 'image/png')
//         res.send(user.avatar)
//     } catch (e) {
//         res.status(404).send()
//     }
// })
//
// router.delete('/notes/:noteId/thumbnail', auth, async (req, res) => {
//     req.user.avatar = undefined
//     await req.user.save()
//     res.send()
// })

module.exports = router;
