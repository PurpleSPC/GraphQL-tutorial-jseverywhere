const { models } = require("mongoose");

module.exports = {
    //returns all notes
    notes: async (parent, args, {models}) => {
        return await models.Note.find().limit(100);
    },
    //retruns note of a specified id#
    note: async (parent, args, {models}) => {
        return await models.Note.findById(args.id);
    },
    //returns user info for a username
    user: async (parent, {username}, {models}) => {
        return await models.User.findOne({username});
    },
    //returns all users
    users: async (parent, args, {models}) => {
        return await models.User.find({});
    },
    //show current user info
    me: async (parent, args, {models, user}) => {
        return await models.User.findById(user.id);
    },
    //cursor-based pagination of noteFeed query
    noteFeed: async (parent, {cursor}, {models}) => {
        //hardcode limit to 10 items
        const limit = 10;
        //set default hasNextPage to false
        let hasNextPage = false;
        //if no cursor is passed the default query will be empty
        //this will pull the newest notes from the db
        let cursorQuery = {};
        //if there is a cursor, pull note ObjIds less than the cursor
        if (cursor) {
            cursorQuery = {_id: {$lt: cursor}};
        }
        //find limit +1 of notes, sorted new to old
        let notes = await models.Note.find(cursorQuery)
        .sort({_id: -1})
        .limit(limit +1);

        //if the # of notes exceeds limit, hasNextPage is true, trim notes to limit
        if (notes.length > limit) {
            hasNextPage = true;
            notes = notes.slice(0,-1);
        }

        //new cursor set to ObjId of the last note in the feed
        const newCursor = notes[notes.length-1]._id;
        return {
            notes,
            cursor: newCursor,
            hasNextPage
        };
    } 
};