const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Require routes
const games = require('./routes/games');

// Require models if needed

// Mongoose for MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/trivia', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
const publicDir = path.join(__dirname, 'build');
app.use(express.static(publicDir));

// Set up routes
app.use('/api/games', games);
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

module.exports = app;
