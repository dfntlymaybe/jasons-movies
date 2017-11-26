
/*******************movies main service*********************/
/*handle main client logic and comunicates with the server**/
/***********************************************************/

app.factory('moviesService', ['$http', '$state', function ($http, $state) {
  //movies obj
  var movies = {
    moviesOptions: [{img:'images/film-negatives-black.svg'},{img:'images/film-negatives-black.svg'}],
    moviesPull: [],
    genre: [],
    byActor: false,
    byGenre: false,
    movie: {img:'images/film-negatives-black.svg'},
    error:{isError:false, error:"", if:false},
    searchExpression: ""
  }

/***************Helper Funcs************************/

  //Helper func to get a random movie obj from the movies pull
  movies.getRandMovie = function(){
    if(movies.moviesPull.length > 0){
      var movieIndex = Math.floor((Math.random() * (movies.moviesPull.length-1))); //get random index
      var temp = movies.moviesPull[movieIndex];
      movies.moviesPull.splice(movieIndex, 1);
      return temp;
    }else{
      return false;
    }
  };

  //Helper func to retrieve genre name by genre id
  movies.getGenreById = function(id){
    for(i in movies.genre){
      if(id == movies.genre[i].id){
        return movies.genre[i].name;
      }
    }
  }

  //Helper func for emptying the movies pull
  movies.emptyMoviesPull = function(){
    movies.moviesPull = [];
    movies.error = {isError:false, error:"", id:false};
    // movies.moviesOptions = [];
    // movies.movie = null;
  };

  movies.removeMovie = function(movie){
    var temp = movies.getRandMovie();
    if (temp){
      movies.moviesOptions[movies.moviesOptions.indexOf(movie)] = temp;
    }else{
      movies.moviesOptions.splice(movies.moviesOptions.indexOf(movie),1);
      movies.movie = movies.moviesOptions[0];
      $state.go('result');
    }
  };

  movies.chooseMovie = function(movie){
    movies.movie = movie;
    movies.moviesOptions = [];
    $state.go('result');
  };

  movies.getRandomTen = function(tempMoviList){

  };

  /*************server comunication***************/

  //Ask for the Genre list from the server
  movies.getGenreList = function () {
    return $http.get('/genre').then(function(data){
    angular.copy(data.data.genres, movies.genre);
    // movies.genre.splice(0, 0, {id: 0, name: "Select Genre"});
    });
  };

  //Ask for list of movies with the requsted genre
  movies.getMoviesByGenre = function (genre) {
    movies.searchExpression = genre.name;
     $http.get('/moviesByGenre' + genre.id).then(function (data) {

      var tempMovieList = [];
      angular.copy(data.data.results, tempMovieList);
      var randTen = Math.floor(Math.random() * 9);
      for(var i = randTen; i < randTen+10; i++){
        var year = tempMovieList[i].release_date.substring(0,4);
        movies.moviesPull.push(
          {
            title: tempMovieList[i].title,
            genre: genre.name,
            overview: tempMovieList[i].overview,
            img:'images/film-negatives-black.svg',
            release_date: year
          })
          if(tempMovieList[i].backdrop_path){
            movies.moviesPull[movies.moviesPull.length-1].img = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + tempMovieList[i].backdrop_path;
          }else if(tempMovieList[i].poster_path){
            movies.moviesPull[movies.moviesPull.length-1].img = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + tempMovieList[i].poster_path;
          }
      }
      for(var i = 0; i < 2; i++){
        movies.moviesOptions[i] = movies.getRandMovie();
      }
      $state.go('movies', {}, { reload: true });
    });
  };

  //Ask for actor id by actor name
  movies.actorIdByActorName = function(actorName){

    return $http.get('/actor' + actorName).then(function (data) {
      if(data.data.results.length > 0){
        movies.actor = {name: data.data.results[0].name, id: data.data.results[0].id};
        movies.searchExpression = movies.actor.name;
        return movies.actor;
      }else{
        movies.error = {isError:true, error:"Could Not find actor: " + actorName, id:false};
        return  movies.error;
      }
    }, function(err){
      return err;
    });
  };

  //Ask for list of movies by actor id
  movies.getMoviesByActor = function(actorId){

    $http.get('/moviesByActor' + actorId).then(function (data) {

      var tempMovieList = [];
      var start = 0;
      angular.copy(data.data.results, tempMovieList);

      if(tempMovieList.length === 20){
        start = Math.floor(Math.random() * 9);
      }
      var end = Math.min(tempMovieList.length, start+10);
      for(var i = start; i < end; i++){
      var currentGenre = movies.getGenreById(tempMovieList[i].genre_ids[0]);
      var year = tempMovieList[i].release_date.substring(0,4);
        movies.moviesPull.push(
          {
            title: tempMovieList[i].title,
            genre: currentGenre,
            img: 'images/film-negatives-black.svg',
            overview: tempMovieList[i].overview,
            release_date: year
          })
        if(tempMovieList[i].backdrop_path){
          movies.moviesPull[movies.moviesPull.length-1].img = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + tempMovieList[i].backdrop_path;
        }else if(tempMovieList[i].poster_path){
          movies.moviesPull[movies.moviesPull.length-1].img = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + tempMovieList[i].poster_path;
        }
      }
      for(var i = 0; i < 2; i++){
        movies.moviesOptions[i] = movies.getRandMovie();
      } 
      $state.go('movies', {}, { reload: true });
    });
  };

  return movies;

}]);

