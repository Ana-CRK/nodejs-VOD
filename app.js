const express = require('express');
const app = express();

const session = require('express-session');
const { flash } = require('express-flash-message');

require('dotenv').config()

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { expires: 60 * 1000 }
}));

require('./passport')(app);

app.use(flash({ sessionKeyName: 'flashMessage', useCookieSession: true }));

app.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_VOD)
    .then(() => {console.log('Connected to mongoose')})
    .catch(err => console.log('Connection error'));

app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
});

app.use((req, res, next) => {
    req.consumeFlash('error').then((flash) => {
        res.locals.errors = flash;
        next();
    });
});

app.get('/', async (req, res) => {
    res.render('index.ejs');
})

const accountRoutes = require('./routes/accountRoutes');
app.use('/account', accountRoutes);

const movieRoutes = require('./routes/movieRoutes');
app.use('/movie', movieRoutes);

app.listen(3000, () => {
    console.log('server running');
})