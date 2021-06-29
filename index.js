// Dependency Imports ------------
const {ApolloServer} = require('apollo-server');
//connect to the MongoDB database through mongoose - object relational mapper that lets us interact with mongodb database
const mongoose = require('mongoose');


// Relative Imports ------------
const {MONGODB} = require('./config.js');


// Resolvers are how the Apollo server processes GraphQL operations. Its a function that populates data for a single field in ur schema. Contains the logic
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefinitions');



// setup Apollo server with the schema and resolvers
const server = new ApolloServer({
    typeDefs,
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