// import the dotenv package
require('dotenv').config();

// create all the necessary configuration variables
const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT : process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET
}

// export the configuration variables
module.exports = config;