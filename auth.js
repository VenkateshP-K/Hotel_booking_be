const jwt = require("jsonwebtoken");
const config = require("./config");
const User = require('./models/users');

const Auth = {
    isAuth : (req, res, next) => {
        //get the token from cookies
        const token = req.cookies.token;

        //if the token is not prsent return an error
        if(!token) {
            return res.status(401).json({
                message : "Unauthorized"
            });
        }

        //verify the token
        try {
            const decodedToken = jwt.verify(token, config.JWT_SECRET);

            //get the user from the token and attach it to the request
            req.userId = decodedToken.id;

            //next middleware
            next();

        } catch (error) {
            //if the token is invalid return an error
            return res.status(401).json({
                message : error.message
            });
        }
},
isAdmin : async (req, res, next) => {
    try {
        //get userId from request
        const userId = req.userId;
        
        //find the user by userId
        const user = await User.findById(userId)
        
        //if the user not found return an error
        if(!user) {
            return res.status(404).json({
                message : "User not found"
            });
        }

        //if the user is not an admin return an error
        if(user.role !== 'admin') {
            return res.status(403).json({
                message : "Forbidden"
            });
        }

        //call next middleware
        next();
        
    } catch (error) {
        res.status(500).json({message : error.message});
    }
}
}

//export Auth
module.exports = Auth