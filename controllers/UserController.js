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
    user.save();
    res.redirect('/');
}