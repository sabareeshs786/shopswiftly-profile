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

const signupController = require('./controller/AuthControllers/signupController');
const loginController = require('./controller/AuthControllers/loginController');
const logoutController = require('./controller/AuthControllers/logoutController');
const refreshController = require('./controller/AuthControllers/refreshTokenController');

const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// routes
app.post('/signup', signupController.handleNewUser);
app.post('/login', loginController.handleLogin);
app.get('/refresh', refreshController.handleRefreshToken);
app.get('/logout', logoutController.handleLogout);

// Routes that require authentication and authorization
// Verifying JWT(JSON Web Token)
app.use(verifyJWT);

// Routes
app.use('/users', require('./routes/api/users'));
app.use('/profiles', require('./routes/api/profile'));

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