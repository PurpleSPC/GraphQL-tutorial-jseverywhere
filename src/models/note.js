//require mongoose library
const mongoose = require('mongoose');

//define the note's db schema
const noteSchema = new mongoose.Schema(
        {
            content: {
                type: String,
                required: true
            },
            author: {
                type: String,
                required: true
            }
        },
        {
            //assigns timestamps
            timestamps: true
        }
);

//define the 'Note' model with the schema
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;