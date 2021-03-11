const io = require("socket.io")();
const chokidar = require('chokidar');
var debug = require('debug')('ald-monitor:server');
var parse = require('./parse');

const socketapi = {
  io: io
};

chokidar.watch('./data_json/data.json', {
  awaitWriteFinish: true
}).on('all', function (event, path) {
  io.emit("update", parse());
});



module.exports = socketapi;