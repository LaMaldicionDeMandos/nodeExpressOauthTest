var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Requerido
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var user = require('./model/user');

var app = express();

var passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy;


//Este se llama al logearte
passport.serializeUser(function(user, done) {
    console.log("Serealize User: " + user.openId);
  done(null, user);
});


//Este se llama antes de enrutar un request
passport.deserializeUser(function(user, done) {
  console.log("Deserealize User: " + user.openId);
  done(null, user);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'ohhhh!!', saveUninitialized: true, resave: true}));
app.use(express.static(path.join(__dirname, 'public')));
passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/callback',
    realm: 'http://localhost:3000'
  },
  function(identifier, profile, done) {
    user.findOrCreate({ openId: identifier, profile: profile }, function(err, user) {
      done(err, user);
    });
  }
));

app.use(passport.initialize());
app.use(passport.session());

// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
app.get('/auth/google', passport.authenticate('google'));
// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/callback', 
  passport.authenticate('google', { successRedirect: '/users',
                                    failureRedirect: '/' }));

app.use('/', routes);
app.use('/users', users);

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
