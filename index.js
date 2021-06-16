// Dependency Imports ------------
const {ApolloServer} = require('apollo-server');
const gql = require('graphql-tag');
//connect to the MongoDB database through mongoose - object relational mapper that lets us interact with mongodb database
const mongoose = require('mongoose');


// Relative Imports ------------
const {MONGODB} = require('./config.js');
const Post = require('./models/Post');



// working with graph ql queries
const typeDefinitions = gql`
    type Post {
        id: ID!,
        body: String, 
        createdAt: String!,
        username: String!
    }
    type Query {
        getPosts: [Post]
    }
`

const resolvers = {
    Query: {
        async getPosts() { // async since if query fails, server might stop, so this is error handling that the app still runs even if this function fails
            try {
                const posts = await Post.find();
                return posts; 
            } catch( err ) {
                throw new err;
            }
        }
    }
}

// setup Apollo server
const server = new ApolloServer({
    typeDefs: typeDefinitions,
    resolvers
});


// need to connect to the database, and then connect to our apollos server in a chained promise
mongoose.connect(MONGODB, {useNewUrlParser: true}, { useUnifiedTopology: true })
    .then( () => {
        console.log('MongoDB database connected!');
        // Start server and show where it's listening from
        return server.listen({port: 5000})
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
    });