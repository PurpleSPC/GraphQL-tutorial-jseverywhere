const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
require('dotenv').config();
const models = require('./models');
const db = require('./db');

//run on specified port OR 4000
const port = process.env.PORT || 4000;
//store DB_HOST value as a variable
const DB_HOST = process.env.DB_HOST;

//array of data to get started. will be replaced with db 
let notes = [
    {id:'1', content: 'this is a note', author: 'Adam Scott'},
    {id:'2', content: 'this is another note', author: 'Harlow Everly'},
    {id:'3', content: 'oh hey look more notes', author: 'Riley Harrison'}
];

//createss a gql schema
const typeDefs = gql`
type Note {
    id: ID
    content: String
    author: String
}

type Query {
    hello: String
    notes: [Note]
    note(id:ID): Note
}

type Mutation {
    newNote(content: String!): Note
}
`;

//creates a resolver that returns a value to user
const resolvers = {
    Query: {
        //returns hello world
        hello: () => 'Hello World',
        //returns ALL notes
        notes: async () => {
            return await models.Note.find();
        },
        //retruns note of a specified id#
        note: async (parent, args) => {
            return await models.Note.findById(args.id);
        }
    },
   //mutation that allows user to create new note
    Mutation: {
        newNote: async (parent, args) => {
            return await models.Note.create({
                content: args.content,
                author: 'Adam Scott'
            });
        }
    }
};


const app = express();

//connect to db
db.connect(DB_HOST);

//setup apollo server
const server = new ApolloServer({typeDefs, resolvers});

//apply apollo GraphQL middleware and set the path to /api
server.applyMiddleware({app, path: '/api'});

app.listen(port, () => 
    console.log(`GraphQL server running at http://localhost:${port}${server.graphqlPath}`)
);


