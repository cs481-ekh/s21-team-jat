var socket = io();

// On page load
$(function () {

  // Get historical data for graphs
  $.get("/getData", function (data) {

    // Skeleton for chamber pressure chart
    var pumpData = {
      x: [],
      y: []
    };

    // Skeleton for flow rate chart
    var flowData = {
      x: [],
      1: {
        y: []
      },
      2: {
        y: []
      },
      3: {
        y: []
      },
      4: {
        y: []
      },
      5: {
        y: []
      }
    };

    // Add data to the charts
    data.data_log.forEach(function (value, index) {
      var d = new Date(value.Timestamp);
      pumpData.x.push(d.toLocaleTimeString("en-US"));
      pumpData.y.push(value["Chamber Pressure"]);

      flowData.x.push(d.toLocaleTimeString("en-US"));
      flowData[1].y.push(value["MFC 1 Flow"]);
      flowData[2].y.push(value["MFC 2 Flow"]);
      flowData[3].y.push(value["MFC 3 Flow"]);
      flowData[4].y.push(value["MFC 4 Flow"]);
      flowData[5].y.push(value["MFC 5 Flow"]);
    });



    // Pressure chart options
    var ctxPressure = $("#chamber-pressure");
    var pressureChart = new Chart(ctxPressure, {
      type: 'line',
      data: {
        labels: pumpData.x,
        datasets: [{
          label: "Chamber Pressure (Torr)",
          data: pumpData.y,
          lineTension: 0,
          fill: false,
          backgroundColor: 'rgba(0, 0, 0, 1)',
          borderColor: 'rgba(0, 0, 0, 0.5)',
          borderWidth: 2,
          pointRadius: 1
        }],
      }
    });

    // Flow rate chart options
    var ctxFlow = $("#flow");
    var flowChart = new Chart(ctxFlow, {
      type: 'line',
      data: {
        labels: flowData.x,
        datasets: [{
          label: "MFC 1 Flow (sccm)",
          data: flowData[1].y,
          lineTension: 0,
          fill: false,
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
          borderColor: 'rgba(255, 0, 0, 0.5)',
          borderWidth: 2,
          pointRadius: 1
        }, {
          label: "MFC 2 Flow (sccm)",
          data: flowData[2].y,
          lineTension: 0,
          fill: false,
          backgroundColor: 'rgba(255, 127, 0, 0.5)',
          borderColor: 'rgba(255, 127, 0, 0.5)',
          borderWidth: 2,
          pointRadius: 1
        }, {
          label: "MFC 3 Flow (sccm)",
          data: flowData[3].y,
          lineTension: 0,
          fill: false,
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
          borderColor: 'rgba(0, 255, 0, 0.5)',
          borderWidth: 2,
          pointRadius: 1
        }, {
          label: "MFC 4 Flow (sccm)",
          data: flowData[4].y,
          lineTension: 0,
          fill: false,
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
          borderColor: 'rgba(0, 0, 255, 0.5)',
          borderWidth: 2,
          pointRadius: 1
        }, {
          label: "MFC 5 Flow (sccm)",
          data: flowData[5].y,
          lineTension: 0,
          fill: false,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderColor: 'rgba(0, 0, 0, 0.5)',
          borderWidth: 2,
          pointRadius: 1
        }],
      }
    });

    // When we recieve an update from the websocket
    socket.on("update", function (single) {

      // Start sliding the graph (removing the first element) if it has been > 30 minutes
      if (pressureChart.data.labels.length >= 360) {
        pressureChart.data.labels.shift();
        pressureChart.data.datasets[0].data.shift();

        flowChart.data.labels.shift();
        flowChart.data.datasets[0].data.shift();
        flowChart.data.datasets[1].data.shift();
        flowChart.data.datasets[2].data.shift();
        flowChart.data.datasets[3].data.shift();
        flowChart.data.datasets[4].data.shift();
      }

      // Add labels and data to the chamber pressure chart
      var d = new Date(single.data_log[0].Timestamp);
      pressureChart.data.labels.push(d.toLocaleTimeString());
      pressureChart.data.datasets[0].data.push(single.data_log[0]["Chamber Pressure"]);

      // Add labels and data to the flow rate chart
      flowChart.data.labels.push(d.toLocaleTimeString());
      flowChart.data.datasets[0].data.push(single.data_log[0]["MFC 1 Flow"]);
      flowChart.data.datasets[1].data.push(single.data_log[0]["MFC 2 Flow"]);
      flowChart.data.datasets[2].data.push(single.data_log[0]["MFC 3 Flow"]);
      flowChart.data.datasets[3].data.push(single.data_log[0]["MFC 4 Flow"]);
      flowChart.data.datasets[4].data.push(single.data_log[0]["MFC 5 Flow"]);

      // Update the charts
      pressureChart.update();
      flowChart.update();

      // Update elements on the page
      $("#timestamp").text("Latest Timestamp: " + new Date(single.data_log[0].Timestamp).toLocaleDateString("en-US") + " " + new Date(single.data_log[0].Timestamp).toLocaleTimeString("en-US"));

    });

  });


});