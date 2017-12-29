var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// work with Angular
app.use(express.static(path.join(__dirname, 'dist')));

// set our api routes
const api = require('./routes/api');
app.use('/api', api);

// catch all other routes and return the index file
const defaultRoutes = require('./routes/default');
app.use('/', defaultRoutes);

module.exports = app;
