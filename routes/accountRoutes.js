const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/signup', async (req, res) => {
    res.render('signup.ejs');
})
router.post('/signup', userController.signUp);

router.get('/login', async (req, res) => {
    res.render('login.ejs');
})
router.post('/login', userController.logIn);

router.get('/logout', userController.logOut);

module.exports = router;