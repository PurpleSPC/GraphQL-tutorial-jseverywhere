module.exports = {
    //return author info for a specific note
    author: async (note, args, {models}) => {
        return await models.User.findById(note.author);
    },
    //returns favoritedBy info for a user
    favoritedBy: async (note, args, {models}) => {
        return await models.User.find({_id: {$in: note.favoritedBy}});
    }
};