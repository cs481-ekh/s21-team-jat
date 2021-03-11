var express = require('express');
var router = express.Router();
var cel = require('connect-ensure-login');
var fs = require('fs');
var parse = require('../parse');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/dashboard', cel.ensureLoggedIn("/login"), function (req, res) {
  res.locals.data = parse();
  res.render('dashboard');

});

router.get('/login', function (req, res) {
  res.render('login', {
    error: ""
  });
});

module.exports = router;