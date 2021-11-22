const mongoose = require('mongoose');

// define a Schema
const UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true}
});

// model
const User = mongoose.model('User', UserSchema);

module.exports = User;