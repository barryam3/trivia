/* express framework */
var express = require('express');
var app = express();

/* url & request parsing */
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));

/* rendering engine */
var mustache = require('mustache-express');
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname + '/public/html');

/* main app handlers */
require('./trivia.js')(app);

/** start the server */
app.listen(process.env.PORT || 3000);