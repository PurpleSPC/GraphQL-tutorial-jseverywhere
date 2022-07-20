const { models } = require("mongoose");

module.exports = {
    //returns all notes
    notes: async (parent, args, {models}) => {
        return await models.Note.find();
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
    } 
};