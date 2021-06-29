
const Post = require('../../models/Post');

module.exports = {
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