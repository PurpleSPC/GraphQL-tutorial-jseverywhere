const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express');
require('dotenv').config();
const gravatar = require('../util/gravatar');

module.exports = {
        newNote: async (parent, args, {models, user}) => {
            //if there is no user, throw auth error
            if (!user) {
                throw new AuthenticationError('You must be signed in to create a note')
            }
            return await models.Note.create({
                content: args.content,
                //references users ID
                author: mongoose.Types.ObjectId(user.id)
            });
        },
        deleteNote: async (parent, {id}, {models, user}) => {
            //if not a user, throw an auth error
            if(!user) {
                throw new AuthenticationError('You must be signed in to delete a note');
            }
            
            //find the note
            const note = await models.Note.findById(id);
            //if the note owner and current user dont match, throw forbidden error
            if (note && String(note.author) !== user.id) {
                throw new ForbiddenError('You dont have permission to delete this note');
            }
            try {
                await note.remove();
                return true;
            } catch (err) {
                return false;
            }
        },
        updateNote: async (parent, {content, id}, {models, user}) => {
            //if not a user, throw an auth error
            if (!user) {
                throw new AuthenticationError('You must be signed in to update this note');
            }
            //find the note
            const note = await models.Note.findById(id);
            //if the note owner doesn't match current user, throw forbidden error
            if (note && String(note.author) !== user.id) {
                throw new ForbiddenError('You dont have permission to update this note');
            }
            return await models.Note.findOneAndUpdate(
                {
                    _id: id
                },
                {
                    $set: {
                        content
                    }
                },
                {
                    new: true
                }
            );
        },
        signUp: async(parent, {username, email, password}, {models}) => {
            //normalize email address
            email = email.trim().toLowerCase();
            //hash the password
            const hashed = await bcrypt.hash(password, 10);
            //create gravatar url
            const avatar = gravatar(email);
            try {
                const user = await models.User.create({
                    username,
                    email,
                    password: hashed
                });
                //create and return json web token
                return jwt.sign({id: user._id}, process.env.JWT_SECRET);
            } catch(err) {
                console.log(err);
                //if problem creating account, throw an error
                throw new Error('Error creating account');
            }
        },
        signIn: async(parent, {username, email, password}, {models}) => {
            if (email) {
                //normalize email address
                email = email.trim().toLowerCase();
            }
            const user = await models.User.findOne({
                //find EITHER email OR username
                $or: [{email}, {username}]
            });
            //if no user found, throw error
            if (!user) {
                throw new AuthenticationError('Error Signing In');
            }
            //if the password doesnt match, throw error
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new AuthenticationError('Error Signing In');
            }
            //create and return json web token
            return jwt.sign({id: user._id}, process.env.JWT_SECRET);
        },
        toggleFavorite: async(parent, {id}, {models,user}) => {
            //if no user found, throw error
            if (!user) {
                throw new AuthenticationError();
        }
        //check to see if user has already favorited
        //first find the note by ID
        let noteCheck = await models.Note.findById(id);
        //find the index of current user in favoritedBy array
        const hasUser = noteCheck.favoritedBy.indexOf(user.id);
        //if exists, remove from list and decrement favoriteCount
        if (hasUser >= 0) {
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    //set new to true to return updated doc
                    new: true
                }
            );
        } else {
            //if the user hasn't already favorited, add to favoritedBy and increment favoriteCount
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },
                {
                    new:true
                }
            );
        }
    }
}