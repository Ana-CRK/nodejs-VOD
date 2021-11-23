const express = require('express');
const app = express();

const session = require('express-session');
//const { flash } = require('express-flash-message');

require('dotenv').config()

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { expires: 60 * 1000 }
}));

//app.use(flash({ sessionKeyName: 'flashMessage' }));

app.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_VOD)
    .then(() => {console.log('Connected to mongoose')})
    .catch(err => console.log('Connection error'));

app.use((req, res, next) => {
    console.log('logged ?')
    if (req.session.user) {
        console.log('session ok');
        res.locals.user = req.session.user;
    }
    next();
})

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