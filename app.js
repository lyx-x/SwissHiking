var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// allow serving public files
app.use('/static', express.static(path.join(__dirname, 'public')))

// set our api routes
const api = require('./routes/api');
app.use('/api', api);

// set our admin routes
const admin = require('./routes/admin');
app.use('/admin', admin);

// catch all other routes and return the index file
const defaultRoutes = require('./routes/default');
app.use('/', defaultRoutes);

module.exports = app;
