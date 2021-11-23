const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const session = require('express-session');

exports.signUp = async(req, res, next) => {
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword
    });
    user.save(function(err) {
        if (err) {
            res.redirect('/account/signup');
        } else {
            res.redirect('/');
        }
    });
}

exports.logIn = async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        console.log('user does not exist');
        res.redirect('/account/signup');
    }
    
    let match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
        console.log('password wrong')
        res.redirect('/account/login');
    }
    req.session.user = user;
    res.redirect('/');
}

exports.logOut = async(req, res, next) => {
    req.session.destroy(function(err) {
        if (err) {
            console.log(error);
        }
        res.redirect('/');
    })
}