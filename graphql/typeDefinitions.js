
const {gql} = require('apollo-server');



// The schema, working with graph ql queries, schema defined language defining types for resolvers 
module.exports = gql`
    type Post {
        id: ID!,
        body: String, 
        createdAt: String!,
        username: String!
    }
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        getPosts: [Post]
    }
    type Mutation { 
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
    }
`;