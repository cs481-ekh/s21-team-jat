var fs = require('fs');

module.exports = function (filename, callback) {
  fs.readFile(filename, function (err, data) {

    // Parse the data for use by EJS
    var parsed = JSON.parse(data, function (key, value) {
      if (key.includes("Timestamp")) {
        var d = new Date(value);
        if (!isNaN(d)) {
          return d;
        }
      }
      return value;
    });

    if (typeof callback === "function") {
      callback(parsed);
    } else {
      return parsed;
    }
  });
};