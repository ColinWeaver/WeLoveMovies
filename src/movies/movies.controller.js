const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");



async function list(req, res) {
  let filteredMovies;
  const isShowing = req.query.is_showing;
  const dataAllMovies = await moviesService.list();
  if (isShowing){
    const dataIsShowing = await moviesService.isShowingList();
    filteredMovies = dataAllMovies.filter((movie) => {
      return dataIsShowing.find((data) => data.movie_id === movie.movie_id)
    });
    if (filteredMovies) res.json({ data: filteredMovies })
  }
  res.json({ data: dataAllMovies });
}


async function movieExists(req, res, next) {
  const movie = await moviesService.read(req.params.movieId);
  const originalUrl = req.originalUrl;
  if (movie[0]) {
    res.locals.movie = movie;
    res.locals.originalUrl = originalUrl;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}


function read(req, res) {
  const data = res.locals.movie[0];
  res.json({ data });
}


async function readTableExtension(req, res){
  const originalUrl = res.locals.originalUrl;
  const movieId = res.locals.movie[0].movie_id;
  let theaters;
  let reviews;
  if (originalUrl.includes("theaters")){
    theaters = await moviesService.readTheaters(movieId);
    res.json({ data: theaters })
  }
  if (originalUrl.includes("reviews")){
    reviews = await moviesService.readReviews(movieId);
    res.json({ data: reviews })
  }
}


module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  readTableExtension: [asyncErrorBoundary(movieExists), readTableExtension]
};





