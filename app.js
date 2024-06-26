const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const hotelRouter = require("./routes/hotelRoutes");
const roomRouter = require("./routes/roomRoutes");

const app = express();

// app.use(cors({
//     origin: ['http://localhost:5173','https://hotel-booking-be-6h4d.onrender.com'],
//     credentials: true
// }));

const corsOptions = {
    origin: ['http://localhost:5173', 'https://spiffy-lily-853399.netlify.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 
};

app.options('*', cors(corsOptions)); 
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);

app.get('/api', (req, res) => {
    res.send('Hello!');
});

module.exports = app;