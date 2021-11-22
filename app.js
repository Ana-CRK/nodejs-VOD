const express = require('express');
const app = express();

require('dotenv').config()

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_VOD)
    .then(() => {console.log('Connected to mongoose')})
    .catch(err => console.log('Connection error'));

const userController = require('./controllers/UserController');

app.get('/', (req, res) => {
    res.render('index.ejs');
})
app.get('/signup', (req, res) => {
    console.log('get signup');
    res.render('signup.ejs');
})
app.post('/signup', userController.signUp)

app.listen(3000, () => {
    console.log('server running');
})