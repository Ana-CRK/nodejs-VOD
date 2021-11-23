
function getMovie(movie) {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=fr&page=1&include_adult=false&query=${movie}`)
    .then(response => response.json())
    .then(response => {
        
    })
    .catch(err => console.log(err))
}