const isAuth = (req, res, next) => {
    console.log('authentification')
    if (!req.session.user) {
        res.redirect('/account/login');
    } else {
        next();
    }
}

module.exports = isAuth;