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

app.use(flash({ sessionKeyName: 'flashMessage' }));

app.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_VOD)
    .then(() => {console.log('Connected to mongoose')})
    .catch(err => console.log('Connection error'));

const userController = require('./controllers/UserController');

app.use((req, res, next) => {
    console.log('logged ?')
    console.log(req.session)
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
})

app.get('/', async (req, res) => {
    const infos = await req.consumeFlash('info');
    res.render('index.ejs', {infos});
})

app.get('/signup', async (req, res) => {
    const errors = await req.consumeFlash('error');
    res.render('signup.ejs', {errors});
})
app.post('/signup', userController.signUp);

app.get('/login', async (req, res) => {
    const errors = await req.consumeFlash('error');
    res.render('login.ejs', {errors});
})
app.post('/login', userController.logIn);

app.get('/logout', userController.logOut);

app.listen(3000, () => {
    console.log('server running');
})