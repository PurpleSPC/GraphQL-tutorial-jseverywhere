const express = require('express');
const {ApolloServer} = require('apollo-server-express');
require('dotenv').config();

//local module imports
const models = require('./models');
const db = require('./db');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

//run on specified port OR 4000
const port = process.env.PORT || 4000;
//store DB_HOST value as a variable
const DB_HOST = process.env.DB_HOST;
//runs js express server

const app = express();

//connect to db
db.connect(DB_HOST);

//setup apollo server
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: () => {
        //add the db models to context
        return {models};
    }
});

//apply apollo GraphQL middleware and set the path to /api
server.applyMiddleware({app, path: '/api'});

//set up app to listen on PORT 
app.listen(port, () => 
    console.log(`GraphQL server running at http://localhost:${port}${server.graphqlPath}`)
);


