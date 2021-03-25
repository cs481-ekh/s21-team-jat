var express = require('express');
var router = express.Router();
var cel = require('connect-ensure-login');
var fs = require('fs');
var path = require('path');
const parse = require('../parse');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/dashboard', cel.ensureLoggedIn("/login"), function (req, res) {
  parse("data_json/data.json", function (data) {
    res.locals.data = data;
    res.render("dashboard");
  });
});

router.get('/getData', cel.ensureLoggedIn("/login"), function (req, res) {
  res.sendFile(path.join(__dirname, '../data_json/past_data.json'));
});

router.get('/login', function (req, res) {
  res.render('login', {
    error: ""
  });
});

module.exports = router;