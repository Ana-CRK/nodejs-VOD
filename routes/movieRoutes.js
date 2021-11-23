const express = require('express');
const router = express.Router();
const movieController = require('../controllers/MovieController');
const auth = require('../auth');

router.post('/search', movieController.searchOne);

router.get('/add', auth, async (req, res) => {
    res.render('add_movie.ejs');
})
router.post('/add', movieController.addOne);

module.exports = router;