var express = require('express');
var router = express.Router();
var fs = require('fs');


// Change this for prod
/* GET users listing. */
router.get('/', function (req, res, next) {

  fs.readFile('users.json', function (err, data) {
    if (err) {
      return res.send(err);
    }

    var parsed = JSON.parse(data);

    res.locals.users = parsed.users;
    return res.render("users");
  });
  
});

module.exports = router;
