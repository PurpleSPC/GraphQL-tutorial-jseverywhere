const {gql} = require('apollo-server-express');

//createss a gql schema
module.exports = gql`
#custom scalar for timestamps#
scalar DateTime

type Note {
    id: ID!
    content: String!
    author: User!
    createdAt: DateTime!
    updatedAt: DateTime!
    favoriteCount: Int!
    favoritedBy: [User]
}

type User{
    id: ID!
    username: String!
    email: String!
    avatar: String
    notes: [Note!]!
    favorites: [Note!]!
}

# a type for cursor-based pagination of a noteFeed query
type noteFeed {
    notes: [Note]!
    cursor: String!
    hasNextPage: Boolean!
}

type Query {
    notes: [Note!]!
    note(id:ID!): Note!
    user(username: String!): User
    users: [User!]!
    me: User!
    noteFeed(cursor: String): noteFeed
}

type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
    toggleFavorite(id:ID!): Note!
}
`;
