const io = require("socket.io")();
const chokidar = require('chokidar');
var debug = require('debug')('ald-monitor:server');
var parse = require('./parse');
var fs = require("fs");

const socketapi = {
  io: io
};

// This function is called every time data.json is updated
chokidar.watch('./data_json/data.json', {
  awaitWriteFinish: true
}).on('all', function (event, path) {

  // Parse the singular entry json data
  parse("data_json/data.json", function (single) {

    // Send an update event to all connected clients
    io.emit("update", single);

    // Update historical data for any client that connects later
    parse("data_json/past_data.json", function (many) {

      // Don't add the same entry twice
      if (many.data_log.length == 0 || many.data_log[many.timestamp.length - 1].Timestamp !== single.data_log[0].Timestamp) {

        // Store up to 24 data entries (2 minutes)
        if (many.timestamp.length >= 360) {
          many.data_log.shift();
          many.exe_table.shift();
          many.doses_delta.shift();
          many.summary.shift();
          many.timestamp.shift();
        }

        // Push the new data into an array
        many.data_log.push(single.data_log[0]);
        many.exe_table.push(single.exe_table[0]);
        many.doses_delta.push(single.doses_delta[0]);
        many.summary.push(single.summary);
        many.timestamp.push(single.timestamp);

        // Convert the object into a string
        jsonString = JSON.stringify(many, null, 4);

        // Write the object to a file
        fs.writeFile("data_json/past_data.json", jsonString, function () {

        });
      }
    });
  });
});



module.exports = socketapi;