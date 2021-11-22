const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

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
            req.flash('error', 'Hmm.. il nous semble que ' + user.email + ' existe déjà');
            res.redirect('/signup');
        } else {
            res.redirect('/');
        }
    });
}