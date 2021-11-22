const express = require('express');
const app = express();

const session = require('express-session');
const { flash } = require('express-flash-message');

require('dotenv').config()

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
    secret: 'azerty',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 60 * 1000 }
}));

app.use(flash({ sessionKeyName: 'flashMessage' }));

app.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_VOD)
    .then(() => {console.log('Connected to mongoose')})
    .catch(err => console.log('Connection error'));

const userController = require('./controllers/UserController');

app.get('/', (req, res) => {
    res.render('index.ejs');
})
app.get('/signup', async (req, res) => {
    console.log('get signup');
    const errors = await req.consumeFlash('error');
    res.render('signup.ejs', {errors});
})
app.post('/signup', userController.signUp)

app.listen(3000, () => {
    console.log('server running');
})