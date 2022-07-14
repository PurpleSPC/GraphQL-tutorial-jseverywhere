module.exports = {
    notes: async (parent, args, {models}) => {
        return await models.Note.find();
    },
    //retruns note of a specified id#
    note: async (parent, args, {models}) => {
        return await models.Note.findById(args.id);
    }
};