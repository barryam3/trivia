var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var webpackDevHelper = require('./hotReload.js');

// Require routes

// Require models if needed

var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/trivia');
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));

var app = express();

// Set up webpack-hot-middleware for development, express-static for production
if (process.env.NODE_ENV !== 'production'){
    console.log("DEVELOPMENT: Turning on WebPack middleware...");
    app = webpackDevHelper.useWebpackMiddleware(app);
    app.use('/css', express.static(path.join(__dirname, 'public/css')));
    app.use('/js', express.static(path.join(__dirname, 'public/js')));
    app.use('/vendor', express.static(path.join(__dirname, 'public/vendor')));
} else {
    console.log("PRODUCTION: Serving static files from /public...");
    app.use(express.static(path.join(__dirname, 'public')));
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret : 'T12345', resave : true, saveUninitialized : true }));


// Set up routes
app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'public/index.html'))
});

module.exports = app;
