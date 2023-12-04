require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// Custom modules
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnect');

const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/', require('./routes/root'));
app.use('/signup', require('./routes/authRoutes/signup'));
app.use('/login', require('./routes/authRoutes/auth'));
app.use('/refresh', require('./routes/authRoutes/refresh'));
app.use('/logout', require('./routes/authRoutes/logout'));

// Routes that require authentication and authorization
// Verifying JWT(JSON Web Token)
app.use(verifyJWT);

// Routes
app.use('/users', require('./routes/api/users'));


// 
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});