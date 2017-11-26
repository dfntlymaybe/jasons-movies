var config = {
  key:"?api_key=ac5bfb1c99b5f392467f92b03c6d872b",
}
config.getGenreListUrl = "https://api.themoviedb.org/3/genre/movie/list"+ config.key + "&language=en-US";
config.getActorByNameUrl = "https://api.themoviedb.org/3/search/person" + config.key + "&query=";
config.getMoviesByActorIdUrl = "https://api.themoviedb.org/3/discover/movie" + config.key + "&with_cast=";
config.getMoviesByGenreUrl = "https://api.themoviedb.org/3/discover/movie" + config.key + "&with_genres=";

module.exports = config;