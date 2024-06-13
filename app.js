const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const userRouter = require('./routes/userRoutes');
const hotelRouter = require("./routes/hotelRoutes");
const roomRouter = require("./routes/roomRoutes");

const app = express();

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);

app.get('/', (req, res) => {
    res.send('Hello!');
});

module.exports = app;