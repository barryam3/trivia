var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var webpackDevHelper = require('./hotReload.js');

// Require routes
var games = require('./routes/games');

// Require models if needed

// Mongoose for MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/trivia');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Express
var app = express();
// Set up webpack-hot-middleware for development, express-static for production
if (process.env.NODE_ENV !== 'production') {
    console.log("DEVELOPMENT: Turning on WebPack middleware...");
    app = webpackDevHelper.useWebpackMiddleware(app);
} else {
    console.log("PRODUCTION: Serving static files from /public...");
    app.use(express.static(path.join(__dirname, 'public')));
}
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/vendor', express.static(path.join(__dirname, 'public/vendor')));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up routes
app.use('/games', games);
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

module.exports = app;
