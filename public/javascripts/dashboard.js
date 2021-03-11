var socket = io();
$(function () {

  // Update packet received
  socket.on("update", function (data) {
    $("#data").empty();
    Object.entries(data.data_log[0]).forEach(function ([key, value]) {
      $("#data").append("<p>" + key + ": " + value + "</p>");
    });

    $("#delta").empty();
    Object.entries(data.doses_delta[0]).forEach(function ([key, value]) {
      $("#delta").append("<p>" + key + ": " + value + "</p>");
    });

    $("#exe").empty();
    Object.entries(data.exe_table[0]).forEach(function ([key, value]) {
      $("#exe").append("<p>" + key + ": " + value + "</p>");
    });

    $("#summary").text(data.summary);
  });

});