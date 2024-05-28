//import User model
const User = require('../models/users');

//import bcrypt
const bcrypt = require('bcrypt')

//import jsonwebtoken
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const userController = {
    //define the register function
    register: async (req, res) => {
        try {
            //get the user data from the request body
            const { username, email, password, location } = req.body;

            //check if the user already exists
            const user = await User.findOne({ email });

            //if the user already exists, return an error
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            //hash the password
            const passwordHash = await bcrypt.hash(password, 10);

            //create a new user
            const newUser = new User({
                ...req.body,
                passwordHash
            });

            //save the user to the database
            const savedUser = await newUser.save();

            //return the saved user
            res.status(201).json({ message: 'user created successfully', savedUser });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    //login function
    login : async (req, res) => {
      try {
        //get the user data from the request body
        const { email, password } = req.body;

        //check if the user exists
        const user = await User.findOne({ email });

        //if the user does not exist, return an error
        if (!user) {
          return res.status(401).json({ message: 'User Not Found' });
        }

        //check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

        //if the password is incorrect, return an error
        if (!isPasswordCorrect) {
          return res.status(401).json({ message: 'Invalid Password' });
        }

        //if the user exists and the password is correct, generate a token
        const token = jwt.sign({ id: user._id,
          email: user.email,
          username: user.username,
         },JWT_SECRET);

         //set a cookie with the token
         res.cookie('token', token, { httpOnly: true ,
          sameSite: 'none',
          secure: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 86400)
         });

         //return the token
         res.status(200).json({'message': 'user logged in successfully', token });

      } catch (error) {
        //return an error
        res.status(500).json({ message: error.message });
      }
    },

    //get the current user
    getMe : async (req, res) => {
        try {
           //get the userId from the request
           const userId = req.userId;
           
           //find the user by id from db
           const user = await User.findById(userId).select('-passwordHash -__v -_id');

           //if the user does not exist, return an error
           if (!user) {
              return res.status(404).json({ message: 'User not found' });
           }

           //if the user exist return the user
           res.status(200).json({ user });

        } catch (error) {
           //catch error
           res.status(500).json({ message: error.message }); 
        }
},

//update the user details
update : async (req, res) => {
     try {
        //get the userId from the request
        const userId = req.userId;

        //get user data from the request body
        const { username, email, location } = req.body;

        //find the user by id
        const user = await User.findById(userId);

        //if the user does not exist, return an error
        if (!user) {
           return res.status(404).json({ message: 'User not found' });
        }

        //if user available update the user
        if(username) user.username = username;
        if(email) user.email = email;
        if(location)user.location = location;

        //save the user
        const updatedUser = await user.save();

        //return a success message with updated user
        res.status(200).json({ message: 'User updated successfully', updatedUser });

     } catch (error) {
        res.status(500).json({ message: error.message });
     }
},

//delete the user
delete: async (req, res) => {
    try {
        //get the userid from the request
        const userId = req.userId;

        //find the user by id
        const user = await User.findById(userId);

        //if the user does not exist, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //return a success message
        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

//logout the user
logout : async(req, res) => {
    try {
        //clear the cookie
        res.clearCookie('token');

        //return a success message
        res.status(200).json({ message: 'user logged out successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

//get all the users
getUsers: async (req, res) => {
    try {
        //get users by id
        const users = await User.find().select('-passwordHash -__v -_id');

        //return all users
        res.status(200).json({ users });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

//get user by id
getUserById : async (req, res) => {
    try {
        //get the userId from the request
        const userId = req.params.id;

        //find the user by id
        const user = await User.findById(userId).select('-passwordHash -__v -_id');

        //if the user does not exist, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //return the user
        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

//update user by id
updateUserById : async (req, res) => {
    try {
        //get userId from the request
        const userId = req.params.id;

        //get user data from the request body
        const { username, email, location } = req.body;

        //find the user by id
        const user = await User.findById(userId);

        //if the user does not exist, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //if user available update the user
        if(username) user.username = username;
        if(email) user.email = email;
        if(location)user.location = location;

        //save the user
        const updatedUser = await user.save();

        //return a success message with updated user
        res.status(200).json({ message: 'User updated successfully', updatedUser });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

//delete user by id
deleteUserById : async (req, res) => {
    try {
        //delete user by id
        const userId = req.params.id;

        //delete the user
        const user = await User.findByIdAndDelete(userId);

        //if the user does not exist, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //return a success message
        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
}
//export userController
module.exports = userController;