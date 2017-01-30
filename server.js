
/*********include****************/

var express = require('express');
var request = require('request');
// var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// mongoose.connect('mongodb://localhost/movies');

/**********Set Up****************/

var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(bodyParser.json());   // This is the type of body we're interested in
app.use(bodyParser.urlencoded({extended: false}));

// app.set('view engine', 'ejs');



/***************Vars*******************/

// Key
var key = "?api_key=ac5bfb1c99b5f392467f92b03c6d872b";

//URL templste for getting the genre list
var getGenreListUrl = "https://api.themoviedb.org/3/genre/movie/list"+ key + "&language=en-US";

//URL template for getting actor by name
var getActorByNameUrl = "https://api.themoviedb.org/3/search/person" + key + "&query="

//URL template for getting movies list by Genre id
var getMoviesByGenreUrl = "https://api.themoviedb.org/3/discover/movie" + key + "&with_genres=";

//URL template for getting movies list by actor id
var getMoviesByActorIdUrl = "https://api.themoviedb.org/3/discover/movie" + key + "&with_cast=";


/*************API Functionality***************/

//Gettint Data from out external API
var requestDataFromApi = function(url, returnData){
  return request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      returnData(body);
    }else{
      console.log(response.body);
      returnData(null);
    }
  })
};

//

/*******************Event Handlers*******************/

//Sending HTML bundle on first GET
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//Send genre List from API to client on request
app.get('/genre', function (req, res) {
  requestDataFromApi(getGenreListUrl, function(data){
    res.send(data);
  });

});

//Sending list of movies by genre id
app.get('/moviesByGenre:genreId', function (req, res) {

  var genre = req.params.genreId;

  requestDataFromApi(getMoviesByGenreUrl + genre, function(data){
    var obj = JSON.parse(data);
    console.log('total pages: ' + obj.total_pages);
    var totalPages = Math.min(obj.total_pages, 1000);//max 1000 pages
    var pageNum = Math.floor(Math.random() * (totalPages - 1)) + 1;
    console.log('rand: ' + pageNum)
    requestDataFromApi(getMoviesByGenreUrl + genre + '&page=' + pageNum, function(data){
      res.send(data);
    });
  });

});

//Sending actor id by actor name
app.get('/actor:actorName', function (req, res) {

  var actor = req.params.actorName;
  requestDataFromApi(getActorByNameUrl + actor, function(data){
    res.send(data);
  });

});

//Sending list of movies by actor id
app.get('/moviesByActor:actorId', function (req, res) {

  var actor = req.params.actorId;
  requestDataFromApi(getMoviesByActorIdUrl + actor, function(data){

    var obj = JSON.parse(data);
    console.log('total pages: ' + obj.total_pages);
    var pageNum = Math.floor(Math.random() * (obj.total_pages - 1)) + 1;
    console.log('rand: ' + pageNum)

    requestDataFromApi(getMoviesByActorIdUrl + actor + '&page=' + pageNum, function(data){
      res.send(data);
    });
    
  });

});



 app.listen(8000);
