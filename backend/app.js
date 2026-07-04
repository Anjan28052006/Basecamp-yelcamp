if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
app.set('query parser', 'extended');

const mongoose = require('mongoose');
const sanitizeV5 = require('./utils/mongoSanitizeV5.js');
const ExpressError = require('./utils/ExpressError');
const campgroundsRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/reviews')
const userRoute = require('./routes/user')
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const User = require('./module/user')
const helmet = require('helmet');
const cors = require('cors');

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database Connection");
})

// Frontend dev server origin(s) allowed to talk to this API with credentials
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',');

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

const sessionConfig = {
    name: 'session',
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));

//use of inbuilt package for the authentication called passport
app.use(passport.initialize());
app.use(passport.session());//must be below the app.use session
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(sanitizeV5({ replaceWith: '_' }));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use('/', userRoute);
app.use('/campground', campgroundsRoute);
app.use('/campground/:id/reviews', reviewsRoute)

app.get('/', (req, res) => {
    res.json({ message: 'YelpCamp API is running' });
})

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Not Found', 404));
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'something went wrong' } = err;
    if (!err.message) err.message = 'Page Not Found';
    if (!err.status) err.status = 500;
    res.status(status).json({ error: true, status, message: err.message });
})

app.listen(3000, () => {
    console.log('listning on the port 3000');
})
