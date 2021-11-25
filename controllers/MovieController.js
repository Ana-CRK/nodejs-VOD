const Movie = require('../models/MovieModel');
const fetch = require('cross-fetch');

const key = process.env.API_KEY;

exports.getAll = async(req, res, next) => {
    const movies = await Movie.find();
    console.log(movies);
    res.render('all_movies.ejs', { movies })
}

exports.getOne = async(req, res, next) => {
    const movie = await Movie.findOne({_id: req.params.id});
    res.render('one_movie.ejs', { movie })
}

exports.addOne = async(req, res, next) => {
    console.log(req.body);
    let actors = req.body.actors.split(", "); 
    const movie = new Movie({
        title: req.body.title,
        img: req.body.img,
        year: req.body.year,
        category: req.body.category,
        actors,
        description: req.body.description
    });
    movie.save(function(err) {
        if (err) {
            console.log("error in save movie");
            res.redirect('/admin/movie/add');
        } else {
            res.redirect('/');
        }
    });
}

exports.suggestMovies = async(req, res, next) => {
    let movieTitle = req.params.title;
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=fr&page=1&include_adult=false&query=${movieTitle}`);
    const data = await response.json();
    //console.log(data);
    return res.json(data);
}
exports.getMovieDetails = async(req, res, next) => {
    let movieId = req.params.movieId;
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${key}`);
    const data = await response.json();
    //console.log(data);
    return res.json(data);
}
exports.findActors = async(req, res, next) => {
    let movieId = req.params.movieId;
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${key}`);
    const data = await response.json();
    return res.json(data);
}

exports.searchOne = async(req, res, next) => {
    console.log(req.body);
    res.redirect('/');
}