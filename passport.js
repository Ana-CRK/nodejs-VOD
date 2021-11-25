const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new GoogleStrategy({
        clientID: process.env.ID_APP_GOOGLE,
        clientSecret: process.env.KEY_GOOGLE,
        callbackURL: "/account/google/callback",
        passReqToCallback: true
    },
    (request, accessToken, refreshToken, profile, done) => {
        console.log(profile)
        request.session.user = {
            id: 0,
            firstname : profile.name.givenName,
            lastname : profile.name.familyName
        }
        //request.flash('success', `Vous êtes maintenant connecté !`);
        return done(null, request.session.user);
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
