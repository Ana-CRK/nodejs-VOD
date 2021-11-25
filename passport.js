const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { 
        successRedirect: '/', 
        failureRedirect: '/account/signup' 
    }));

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { 
        successRedirect: '/', 
        failureRedirect: '/account/signup' 
    }));

    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', passport.authenticate('github', { 
        successRedirect: '/', 
        failureRedirect: '/account/signup' 
    }));

    passport.use(new GoogleStrategy({
        clientID: process.env.ID_APP_GOOGLE,
        clientSecret: process.env.KEY_GOOGLE,
        callbackURL: "/auth/google/callback",
        passReqToCallback: true
    },
    (request, accessToken, refreshToken, profile, done) => {
        //console.log(profile)
        request.session.user = {
            id: 0,
            firstname : profile.name.givenName,
            lastname : profile.name.familyName
        }
        return done(null, request.session.user);
    }));

    passport.use(new TwitterStrategy({
        consumerKey: process.env.KEY_TWITTER,
        consumerSecret: process.env.KEY_SECRET_TWITTER,
        callbackURL: "/auth/twitter/callback",
        passReqToCallback: true
    },
    (request, token, tokenSecret, profile, cb) => {
        //console.log(profile);
        request.session.user = {
            id: 0,
            firstname : profile.displayName,
            lastname : ''
        }
        return cb(null, request.session.user);
    }));

    passport.use(new GitHubStrategy({
        clientID: process.env.ID_APP_GITHUB,
        clientSecret: process.env.APP_SECRET_GITHUB,
        callbackURL: "/auth/github/callback",
        passReqToCallback: true

    },
    (request, token, tokenSecret, profile, cb) => {
        //console.log(profile);
        request.session.user = {
            id: 0,
            firstname : profile.displayName ?? profile.username,
            lastname : ''
        }
        return cb(null, request.session.user);
    }));

    passport.serializeUser((user, cb) => {
        cb(null, user);
    });

    passport.deserializeUser((user, cb) => {
        if(user.id > 0) {
            console.log('DeserializeUser id user > 0');
        } else {
            cb(null, {});
        }
    });
}
