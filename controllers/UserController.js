const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const session = require('express-session');

exports.signUp = async(req, res, next) => {
    const userExists = await User.findOne({email: req.body.email});
    if (userExists) {
        req.flash('error', 'Hmm.. il nous semble que ' + req.body.email + ' existe déjà. Connectez-vous');
        res.redirect('/account/login');
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword
        });
        user.save(function(err) {
            if (err) {
                req.flash('error', 'Hmm.. une erreur s\'est produite. Essayez encore une fois');
                res.redirect('/account/signup');
            } else {
                res.redirect('/account/login');
            }
        });
    }
}

exports.logIn = async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        req.flash('error', 'Hmm.. utilisateur n\'existe pas. Inscrivez-vous');
        res.redirect('/account/signup');
        return;
    }
    
    let match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
        req.flash('error', 'Hmm.. mot de passe incorrect');
        res.redirect('/account/login');
        return;
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