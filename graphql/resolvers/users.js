const User = require('../../models/User');
const bcrypt = require('bcryptjs');

const { validateRegisterInput, validateLoginInput } = require("../../util/validators");
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../../config');
const { UserInputError } = require('apollo-server');


function generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
  }



module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);
      
            if (!valid) {
              throw new UserInputError('Errors', { errors });
            }
      
            const user = await User.findOne({ username });
      
            if (!user) {
              errors.general = 'User not found';
              throw new UserInputError('User not found', { errors });
            }
      
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
              errors.general = 'Wrong crendetials';
              throw new UserInputError('Wrong crendetials', { errors });
            }
      
            const token = generateToken(user);
      
            return {
              ...user._doc,
              id: user._id,
              token
            };
          },
          async register(_,
            {registerInput: 
            {
                username, email, password, confirmPassword}
            },
            context,
            info
            ) {
            // need to validate user data
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );

            if (!valid) {
              throw new UserInputError('Errors', { errors });
            }

            //username doesn't already exist
            const user = await User.findOne({username});
            if(user) {
                throw new UserInputError("Username  taken", {
                    errors: {
                        username: "This username is taken"
                    }
                });
            }

            //make sure passwords match .. hash pw and create auth token
            password = await bcrypt.hash(password, 12);

            // new user object that is passed in all of required fields
            const newUser = new User({
                email,
                username, 
                password,
                createdAt: new Date().toISOString()
            });

            // this is to save the user to the database
            const res = await newUser.save();

            // create a token for each user
            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username,

            }, SECRET_KEY, {expiresIn: '1h'});

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}