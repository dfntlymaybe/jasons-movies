
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
  };

  //Handle user clicking on X (remove movie button)
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

  //handle user selecting V (want the movie)
  movies.chooseMovie = function(movie){
    movies.movie = movie;
    movies.moviesOptions = [];
    $state.go('result');
  };

  //Get 10 random movies from array of 20 and format them
  movies.getRandomTen = function(tempMovieList, genre){
    var maxIterations = Math.min(tempMovieList.length, 10);
    for(var i = 0; i < maxIterations; i++){
      var index = Math.floor(Math.random() * tempMovieList.length);
      //Formating
      if(tempMovieList[index].poster_path){ 
        tempMovieList[index].img = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + tempMovieList[index].poster_path;
      }else if(tempMovieList[index].backdrop_path){
        tempMovieList[index].img = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + tempMovieList[index].backdrop_path;
      }else{
        tempMovieList[index].img = "images/film-negatives-black.svg";
      }
      if(tempMovieList[index].overview == ""){
        tempMovieList[index].overview = "Not Found";
      }
      if(genre){
        tempMovieList[index].genre = genre;
      }else{
        tempMovieList[index].genre = movies.getGenreById(tempMovieList[index].genre_ids[0])
      }
      //Push the movie object into the movies pull
      movies.moviesPull.push(tempMovieList.splice(index,1)[0]);
    }
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
      movies.getRandomTen(tempMovieList, genre.name);
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
      movies.getRandomTen(tempMovieList, null);
      for(var i = 0; i < 2; i++){
        movies.moviesOptions[i] = movies.getRandMovie();
      } 
      $state.go('movies', {}, { reload: true });
    });
  };

  return movies;
}]);

