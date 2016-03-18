var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

var MOVIES_FILE = path.join(__dirname, 'movies.json');

app.set('port', (process.env.PORT || 3001));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/api/movies', function(req, res) {
  fs.readFile(MOVIES_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/movies', function(req, res) {
  fs.readFile(MOVIES_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var movies = JSON.parse(data);
    var newMovie = {
      id: Date.now(),
      title: req.body.title,
      rating: req.body.rating,
      runtime: req.body.runtime,
      poster: req.body.poster
    };
    movies.push(newMovie);

    fs.writeFile(MOVIES_FILE, JSON.stringify(movies, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(movies);
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/api/movies');
});
