require('dotenv').config()

const express = require('express');
const app = express();

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_VOD)
    .then(() => {console.log('Connected to mongoose')})
    .catch(err => console.log('Connection error'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const store = new MongoDBStore({
    uri: process.env.DB_VOD,
    collection: 'sessions'
});
store.on('error', function(error) {
    console.log(error);
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { expires: 60 * 1000 }
}));


app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
});

require('./passport')(app);

app.set('view engine', 'ejs');

const { flash } = require('express-flash-message');
app.use(flash({ sessionKeyName: 'flashMessage', useCookieSession: true }));
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