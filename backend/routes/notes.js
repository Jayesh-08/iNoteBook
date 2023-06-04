const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note = require('../model/Note');
const { body, validationResult } = require('express-validator');

//Route-1 : Get All notes of user using: GET "api/notes/fetchallnotes". Login Required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error")
    }
})


//Route-2 : Add a new note using: POST "api/notes/addnote". Login Required

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title must be atleast 3 charercters').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 charercters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save();
        res.json(saveNote);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error")
    }
})

//Route-3 : Update a note using: PUT "api/notes/updatenote". Login Required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {


        const { title, description, tag } = req.body;

        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found!") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Authorized");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error")
    }
})


//Route-4 : Delete a note using: DELETE "api/notes/deletenote". Login Required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {


        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found!") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Authorized");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error")
    }
})
module.exports = router;