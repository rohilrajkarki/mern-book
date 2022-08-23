const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,//user model ma userko id hunxa teii lyako
        ref: 'user'//lyauna laii user wala ref leko
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('notes', NotesSchema);