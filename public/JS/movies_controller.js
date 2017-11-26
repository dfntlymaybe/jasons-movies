
/************movies main controller******************/
/******Handle all the inputs and outputs*************/
/****************************************************/


app.controller('moviesController', ['$scope', 'moviesService', '$window' , '$state', function($scope, moviesService, $window, $state){

  $scope.pickedActor = false;
  $scope.pickedGenre = false;
  $scope.selectedMovie =  moviesService.movie;
  $scope.suggestedMovies = moviesService.moviesOptions;
  $scope.actorModel = "";
  $scope.error = moviesService.error;
  $scope.rendomizeExpression = moviesService.searchExpression;
 

  moviesService.getGenreList().then(function () {
    $scope.genreOptions = moviesService.genre;
    $scope.firstColGenreOptions = moviesService.genre.slice(0, Math.round(moviesService.genre.length/3));
    $scope.secondColGenreOptions = moviesService.genre.slice(Math.round(moviesService.genre.length/3),Math.round(moviesService.genre.length*2/3));
    $scope.thirdColGenreOptions = moviesService.genre.slice(Math.round(moviesService.genre.length*2/3), moviesService.genre.length);
  });

  $scope.reset = function(){
    $scope.pickedActor = false;
    $scope.pickedGenre = false;
    $scope.actorModel = "";
  }
  $scope.showGenre = function(){
    // moviesService.emptyMoviesPull();
    // $scope.error = moviesService.error;
    $scope.pickedActor = false;
    $scope.pickedGenre = true;
    moviesService.byGenre = true;
  };

  $scope.showActor = function(){
    // moviesService.emptyMoviesPull();
    // $scope.error = moviesService.error;
    $scope.pickedActor = true;
    $scope.pickedGenre = false;
    moviesService.byGenre = false;
  };

  $scope.selectGenre = function(genre){
    $scope.selectedGenre = genre;
    $scope.btnRand();
  };


  $scope.btnRand = function(){

    moviesService.emptyMoviesPull();
    $scope.error = moviesService.error;
    
    if(moviesService.byGenre){ //Getting movies by Genre
      if($scope.selectedGenre.id === 0){
        $scope.error = {isError:true , error:"Please Select Genre"};
        return;
      }else{
        moviesService.getMoviesByGenre($scope.selectedGenre);
        $scope.reset(); 
      }
    }else{ //Getting movies by Actor
      if($scope.actorModel === ""){
        $scope.error = {isError:true , error:"Please type actor name"};
        return;
      }else{
        moviesService.actorIdByActorName($scope.actorModel).then(function (data){
          if(data.id){
            moviesService.getMoviesByActor(moviesService.actor.id); 
            $scope.reset(); 
          }else{
            $scope.error = moviesService.error;
            $state.go('home');
          }
        }, function(err){
          $scope.error = {isError:true , error: err.error};
        });
      } 
    }
  };

  $scope.btnRemove = function(movie){
    moviesService.removeMovie(movie);
  };

  $scope.btnChoose = function(movie){
    moviesService.chooseMovie(movie);
  };

}]);
