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

    // Parse and manipulate the data for use by EJS
    var parsed = JSON.parse(jsonData, function (key, value) {

      // Add pressure unit label
      if (key.includes("Pressure")) {
        value += " Torr";
      }

      // Add percent unit label
      if (key.includes("Xtal Life")) {
        value += "%";
      }

      // Add flow unit label
      if (key.includes("Flow")) {
        value += " sccm";
      }

      // Add mass unit label
      if (key.includes("Mass")) {
        value += " ng/cm²";
      }

      // Add temp unit label
      if (key.includes("Thermocouple")) {
        value += " ºC";
      }

      // Convert dates and add seconds unit label
      if (key.includes("Time")) {
        if (key.includes("Timestamp")) {
          if (value != "NaN") {
            var date = new Date(value);
            value = date.toLocaleDateString("en-US") + " " + date.toLocaleTimeString("en-US");
          }
        } else {
          value += "s";
        }
      }

      // Convert duration to time units
      if (key.includes("Duration")) {
        value += "s";
      }

      // Add freq unit label
      if (key.includes("Frequency")) {
        value += " Hz";
      }

      // Mutate 1 or 0 into "yes" or "no"
      if (key == "Xtal OK?") {
        if (value == 0) {
          value = "No";
        } else {
          value = "Yes";
        }
      }

      // Convert "NaN" to "N/A"
      if (typeof (value) === 'string' && value.includes("NaN")) {
        value = "N/A";
      }

      return value;
    });

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