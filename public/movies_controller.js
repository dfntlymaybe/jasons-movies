
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
 

  moviesService.getGenreList().then(function () {
    $scope.genreOptions = moviesService.genre;
  });

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
        // alert("Please Select Genre");
        return;
      }else{
        moviesService.getMoviesByGenre($scope.selectedGenre);
      }
    }else{ //Getting movies by Actor
      if($scope.actorModel === ""){
        $scope.error = {isError:true , error:"Please type actor name"};
        // alert("Please type actor name");
        return;
      }else{
        moviesService.actorIdByActorName($scope.actorModel).then(function (data){
          if(data.id){
            moviesService.getMoviesByActor(moviesService.actor.id);
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
