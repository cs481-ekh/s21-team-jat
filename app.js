var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('ald-monitor:server');
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

// For our sessions
var secret = 'z6[q2MrHb(r_KzS/,Q)cJ:xeP)vyxYR4ASU*bBLVYJ)vE54nwPnJp7hAXyg]mT-@';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev', {
  stream: {
    write: msg => debug(msg)
  }
}));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport setup for express
app.use(cookieParser());
app.use(expressSession({
  secret: secret,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Passport configuration
passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
  },
  function (username, password, done) {
    fs.readFile('users.json', function (err, data) {
      if (err) {
        return res.send(err);
      }

      var parsed = JSON.parse(data);
      var userFound = false;
      var pwMatch = false;

      parsed.users.forEach(function (element) {
        if (element.username == username) {
          userFound = true;
          if (element.password == password) {
            pwMatch = true;
            return done(null, element, {
              code: 0,
              message: "Login success, redirecting..."
            });
          }
        }
      });

      if (!userFound) {
        return done(null, false, {
          code: 1,
          message: 'Incorrect username.'
        });
      }

      if (!pwMatch) {
        return done(null, false, {
          code: 2,
          message: 'Incorrect password.'
        });
      }
    });
  }
));

// Passport method to serialize a user
passport.serializeUser(function (user, done) {
  done(null, user.username);
});

// Passport method to deserialize a user
passport.deserializeUser(function (id, done) {
  fs.readFile('users.json', function (err, data) {
    if (err) {
      return res.send(err);
    }

    var parsed = JSON.parse(data);

    parsed.users.forEach(function (element) { 
      if (element.username == id) {
        done(err, element);
      }
    });
  });
});

module.exports = app;