const mongoose = require('mongoose');

// define a Schema
const MovieSchema = new mongoose.Schema({
    title: String,
    img: String,
    year: String,
    category: String,
    actors: [String],
    description: String
});

// model
const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;