var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pg = require('pg');
var routes = require('./routes/index');
var users = require('./routes/users');
var herd = require('./routes/herd.js');

var app = express();

var client = new pg.Client({
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
  host: 'learn-postgres.c3ccnecqsxt1.us-west-2.rds.amazonaws.com',
  port: 5432
});

// Docker machine host
// 192.168.99.100

// AWS endpoint
// learn-postgres.c3ccnecqsxt1.us-west-2.rds.amazonaws.com
client.connect();
// var query = client.query(
//   'CREATE TABLE herd (id SERIAL PRIMARY KEY, breed VARCHAR(80), name VARCHAR(80), purchase_date DATE)'
// );
// query.on('end', function() {
//   client.end(function(err) {
//     if(err) throw err;
//   })
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/herd', herd);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
