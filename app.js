var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');

// Require routes
var games = require('./routes/games');

// Require models if needed

// Mongoose for MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/trivia', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Express
var app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
const publicDir = path.join(__dirname, 'build');
app.use(express.static(publicDir));

// Set up routes
app.use('/api/games', games);
app.get('*', function(req, res) {
    res.sendFile(path.join(publicDir, 'index.html'));
});

module.exports = app;
