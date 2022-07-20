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
                //cross references users ID on mongo with Author's name
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            favoriteCount: {
                type: Number,
                default: 0
            },
            favoritedBy: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                 }
            ]
        },
        {
            //assigns timestamps
            timestamps: true
        }
);

//define the 'Note' model with the schema
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;