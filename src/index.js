const helmet = require('helmet');
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const depthLimit = require('graphql-depth-limit');
const {createComplexityLimitRule} = require('graphql-validation-complexity');


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

//run helmet middleware for security
app.use(helmet());

//enable Cross Origin Resource Sharing
app.use(cors());

//connect to db
db.connect(DB_HOST);

//get user info from Json Web Token
const getUser = token => {
    if (token) {
        try {
            //return user info from token
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch(err) {
            //if there is a problem with token, throw an error
            throw new Error('Session Invalid')
        }
    }
};

//setup apollo server
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
    context: ({req}) => {
        //get the user token from header
        const token = req.headers.authorization;
        // try to retreive a user ID with token
        const user = getUser(token);
        //TEMP - log user to console
        console.log(user);
        //add the db models to context
        return {models, user};
    }
});

//apply apollo GraphQL middleware and set the path to /api
server.applyMiddleware({app, path: '/api'});

//set up app to listen on PORT 
app.listen(port, () => 
    console.log(`GraphQL server running at http://localhost:${port}${server.graphqlPath}`)
);

