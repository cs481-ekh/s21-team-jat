var socket = io();

$(function () {

  $.get("/getData", function (data) {
    var pumpData = {
      x: [],
      y: []
    };

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

    data.data_log.forEach(function (value, index) {
      pumpData.x.push(value.Timestamp);
      pumpData.y.push(value["Chamber Pressure"]);

      flowData.x.push(value.Timestamp);
      flowData[1].y.push(value["MFC 1 Flow"]);
      flowData[2].y.push(value["MFC 2 Flow"]);
      flowData[3].y.push(value["MFC 3 Flow"]);
      flowData[4].y.push(value["MFC 4 Flow"]);
      flowData[5].y.push(value["MFC 5 Flow"]);
    });



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

    socket.on("update", function (single) {
      if (data.data_log.length == 0 || data.data_log[data.timestamp.length - 1].Timestamp !== single.data_log[0].Timestamp) {
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

        pressureChart.data.labels.push(single.data_log[0].Timestamp);
        pressureChart.data.datasets[0].data.push(single.data_log[0]["Chamber Pressure"]);

        flowChart.data.labels.push(single.data_log[0].Timestamp);
        flowChart.data.datasets[0].data.push(single.data_log[0]["MFC 1 Flow"]);
        flowChart.data.datasets[1].data.push(single.data_log[0]["MFC 2 Flow"]);
        flowChart.data.datasets[2].data.push(single.data_log[0]["MFC 3 Flow"]);
        flowChart.data.datasets[3].data.push(single.data_log[0]["MFC 4 Flow"]);
        flowChart.data.datasets[4].data.push(single.data_log[0]["MFC 5 Flow"]);

        pressureChart.update();
        flowChart.update();
      }
    });

    console.log(pumpData);
  });


});