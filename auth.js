const jwt = require("jsonwebtoken");
const config = require("./config");
const User = require('./models/users');

const Auth = {
    isAuth: (req, res, next) => {
        // Get the token from cookies
        const token = req.cookies.token;
        console.log('Token:', token); // Log the token

        // If the token is not present, return an error
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Verify the token
        try {
            const decodedToken = jwt.verify(token, config.JWT_SECRET);
            console.log('Decoded Token:', decodedToken); // Log the decoded token

            // Get the user from the token and attach it to the request
            req.userId = decodedToken.id;

            // Next middleware
            next();
        } catch (error) {
            // If the token is invalid, return an error
            console.error('Token Verification Error:', error); // Log the error
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
    },
    isAdmin: async (req, res, next) => {
        try {
            // Get userId from request
            const userId = req.userId;
            console.log('User ID:', userId); // Log the user ID
            
            // Find the user by userId
            const user = await User.findById(userId);
            console.log('User:', user); // Log the user
            
            // If the user not found, return an error
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            // If the user is not an admin, return an error
            if (user.role !== 'admin') {
                return res.status(403).json({
                    message: "Forbidden"
                });
            }

            // Call next middleware
            next();
        } catch (error) {
            console.error('Admin Check Error:', error); // Log the error
            res.status(500).json({ message: error.message });
        }
    }
}

// Export Auth
module.exports = Auth;