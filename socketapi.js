const io = require("socket.io")();
var debug = require('debug')('ald-monitor:server');

const socketapi = {
  io: io
};

io.on("connection", function (socket) {
  debug(socket.id + " connected");
});

module.exports = socketapi;