var express = require('express');
var router = express.Router();
var cel = require('connect-ensure-login');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/dashboard', cel.ensureLoggedIn("/login"), function (req, res) {

  fs.readFile('data_json/data.json', function (err, data) {
    var jsonData = data;

    var parsed = JSON.parse(jsonData);

    res.locals.data = parsed;
    res.render('dashboard');
  });
});

router.get('/login', function (req, res) {
  res.render('login', {
    error: ""
  });
});

module.exports = router;