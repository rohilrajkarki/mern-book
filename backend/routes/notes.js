const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const router = express.Router();
const { body, validationResult } = require('express-validator');


//Route1: Get All Notes User using : Get "/api/note/getuser". login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {

    try {
        const notes = await Notes.find({ postedBy: req.user.id })
        // console.log({ user: req.user.id })
        res.json(notes)

    } catch (error) {
        console.log(error)
        res.status(500).send("some error occured")
    }
})

//Route2: Add New Notes : POST "/api/note/addnotes". login required
router.post('/addnotes', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description should be at least 5 characters').isLength({ min: 5 }),
]
    , async (req, res) => {
        try {
            const { title, description, tag } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array() });
            }
            const note = new Notes({
                title, description, tag, postedBy: req.user.id
            })
            const savedNotes = await note.save()
            res.json(savedNotes)

        } catch (error) {
            console.log(error)
            res.status(500).send("some error occured")
        }
    })


//Route3: Update Notes : PUT(update garda put)"/api/note/updatenotes". login required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the note to be updated (by _id in database) and update it
        let note = await Notes.findById(req.params.id);
        // console.log(note)
        if (!note) { return res.status(404).send("Not Found") }

        // console.log(req.user.id)// yo postedby wala id(i.e user ko aafno id )
        // console.log(note.postedBy)
        if (note.postedBy.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.log(error)
        res.status(500).send("some error occured")
    }
})

//Route3: Delete Notes : PUT(update garda put)"/api/delete/:id". login required
router.delete('/delete/:id', fetchUser, async (req, res) => {
    try {

        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.send("Note does not exist")
        }
        // console.log(typeof (note.postedBy), typeof (req.user.id))
        // console.log(note.postedBy.toString(), req.user.id)
        // console.log(note.postedBy == req.user.id)
        //== and !== (i.e same as ===) samjine yo wala
        if (note.postedBy.toString() !== req.user.id) {
            return res.status(401).send("No Access")
        }

        await Notes.findByIdAndDelete(req.params.id)
        // res.json('Deleted')
        res.json({ "Success": "Note has been deleted", note: note });


    } catch (error) {
        console.log(error)
        res.status(500).send("some error occured")
    }
})


module.exports = router
