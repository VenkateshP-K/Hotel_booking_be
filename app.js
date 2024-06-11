//import express
const express = require("express");

//import cors
const cors = require("cors");

//import morgan
const morgan = require("morgan");

//import cookie-parser
const cookieParser = require("cookie-parser");

//import user router
const userRouter = require('./routes/userRoutes');
const hotelRouter = require("./routes/hotelRoutes");
const roomRouter = require("./routes/roomRoutes");

//create express app
const app = express();

//use cors
app.use(cors({
    origin:['http://localhost:5173'],
    credentials:true
}));

//USE COOKIE PARSER
app.use(cookieParser());

//use morgan
app.use(morgan('dev'));

//use express middleware
app.use(express.json());

//define endpoints
app.use('/api/users', userRouter);
app.use('/api/hotels',hotelRouter);
app.use('/api/rooms',roomRouter);

//render views
app.get('/', (req, res) => {
    res.send('Hello!');
})

//export app 
module.exports = app;