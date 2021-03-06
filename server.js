
/*********include****************/

var express = require('express');
var request = require('request');
// var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config');
// mongoose.connect('mongodb://localhost/movies');

/**********Set Up****************/

var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());   // This is the type of body we're interested in
app.use(bodyParser.urlencoded({extended: false}));

/***************Vars*******************/

// Key
var key = config.key;

/*************API Functionality***************/

//Gettint Data from our external API
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

/*******************Event Handlers*******************/

//Sending HTML bundle on first GET
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//Send genre List from API to client on request
app.get('/genre', function (req, res) {
  requestDataFromApi(config.getGenreListUrl, function(data){
    res.send(data);
  });

});

//Sending list of random movies by genre id
app.get('/moviesByGenre:genreId', function (req, res) {

  var url = config.getMoviesByGenreUrl + req.params.genreId;
  requestDataFromApi(url, function(data){
    var obj = JSON.parse(data);
    //Random page
    console.log('total pages: ' + obj.total_pages);
    var totalPages = Math.min(obj.total_pages, 1000);//max 1000 pages
    var pageNum = Math.floor(Math.random() * (totalPages - 1)) + 1;
    console.log('rand: ' + pageNum)

    requestDataFromApi(url + '&page=' + pageNum, function(data){
      res.send(data);
    });
  });

});

//Sending actor id by actor name
app.get('/actor:actorName', function (req, res) {

  requestDataFromApi(config.getActorByNameUrl + req.params.actorName, function(data){
    res.send(data);
  });

});

//Sending list of movies by actor id
app.get('/moviesByActor:actorId', function (req, res) {

  var url = config.getMoviesByActorIdUrl + req.params.actorId;
  requestDataFromApi(url, function(data){
    //Random page
    var obj = JSON.parse(data);
    console.log('total pages: ' + obj.total_pages);
    var pageNum = Math.floor(Math.random() * (obj.total_pages - 1)) + 1;
    console.log('rand: ' + pageNum)

    requestDataFromApi(url + '&page=' + pageNum, function(data){
      res.send(data);
    });
    
  });

});


app.listen(process.env.PORT || '4000');
console.log("Server is running on port 4000");
