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

    // Update historical data for any client that connects later
    parse("data_json/past_data.json", function (many) {

      // Don't add the same entry twice
      if (many.data_log.length == 0 || many.data_log[many.data_log.length - 1].Timestamp !== single.data_log[0].Timestamp) {

        // Send an update event to all connected clients
        io.emit("update", single);

        // Store up to 360 data entries (30 minutes)
        if (many.timestamp.length >= 360) {
          many.data_log.shift();
          many.exe_table.shift();
          many.doses_delta.shift();
          many.summary.shift();
          many.timestamp.shift();
        }

        // Build object to send
        var newEntry = {
          "Timestamp": single.data_log[0].Timestamp,
          "Chamber Pressure": single.data_log[0]["Chamber Pressure"],
          "MFC 1 Flow": single.data_log[0]["MFC 1 Flow"],
          "MFC 2 Flow": single.data_log[0]["MFC 2 Flow"],
          "MFC 3 Flow": single.data_log[0]["MFC 3 Flow"],
          "MFC 4 Flow": single.data_log[0]["MFC 4 Flow"],
          "MFC 5 Flow": single.data_log[0]["MFC 5 Flow"]
        };

        // Push the new data into an array
        many.data_log.push(newEntry);


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