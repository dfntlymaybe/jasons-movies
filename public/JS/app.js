var app = angular.module('JasonsMoviesApp', ['angular-loading-bar', 'ui.router']);


app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home',{
    url:'/home',
    controller:'moviesController',
    templateUrl:'../states/home.html'
    })
    .state('movies',{
      url:'/movies',
      controller: 'moviesController',
      templateUrl: '../states/movies.html'
    })
    .state('result',{
      url:'/result',
      controller: 'moviesController',
      templateUrl: '../states/result.html'
    })

  $urlRouterProvider.otherwise('home');

}]);

 