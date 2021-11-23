const Movie = require('../models/MovieModel');


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

exports.searchOne = async(req, res, next) => {
    console.log(req.body);
    res.redirect('/');
}