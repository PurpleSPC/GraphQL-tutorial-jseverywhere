const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');

//run on specified port OR 4000
const port = process.env.PORT || 4000;

//array of data to get started. will be replaced with db 
let notes = [
    {id:'1', content: 'this is a note', author: 'Adam Scott'},
    {id:'2', content: 'this is another note', author: 'Harlow Everly'},
    {id:'3', content: 'oh hey look more notes', author: 'Riley Harrison'}
];

//createss a gql schema
const typeDefs = gql`
type Note {
    id: ID!
    content: String!
    author: String!
}

type Query {
    hello: String!
    notes: [Note!]!
    note(id:ID!): Note!
}

type Mutation {
    newNote(content: String!): Note!
}
`;

//creates a resolver that returns a value to user
const resolvers = {
    Query: {
        //returns hello world
        hello: () => 'Hello World',
        //returns ALL notes
        notes: () => notes,
        //retruns note of a specified id#
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    },
   //mutation that allows user to create new note
    Mutation: {
        newNote: (parent, args) => {
            let noteValue = {
                id: String(notes.length + 1),
                content: args.content,
                author: 'Adam Scott'
            };
            notes.push(noteValue);
            return noteValue;
        }
    }
};


const app = express();

//setup apollo server
const server = new ApolloServer({typeDefs, resolvers});

//apply apollo GraphQL middleware and set the path to /api
server.applyMiddleware({app, path: '/api'});

app.listen(port, () => 
    console.log(`GraphQL server running at http://localhost:${port}${server.graphqlPath}`)
);


