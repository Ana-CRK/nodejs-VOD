const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


passport.use(new FacebookStrategy({
    clientID: process.env.ID_APP_FACEBOOK,
    clientSecret: process.env.KEY_FACEBOOK,
    callbackURL: "http://localhost:3000/account/facebook/callback",
    passReqToCallback: true
},
(request, accessToken, refreshToken, profile, done) => {
    console.log('new facebook strategy');
    request.session.user = {
        firstname : profile.displayName,
        lastname : '',
        email: ''
    };
    return done(null, request.session.user);
}));


exports.facebook = (req, res, next) => {
    //console.log('facebook login');
    //console.log(passport);
    passport.authenticate('facebook', { scope: ['profile'] })
}

exports.facebookCallback = () => {
    passport.authenticate('facebook', { 
        successRedirect: '/', 
        failureRedirect: '/account/signup' 
    })
}

exports.signUp = async(req, res, next) => {
    //console.log(req.body);
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