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
      // Top of page fields
      $("#timestamp").text("Latest Timestamp: " + new Date(single.data_log[0].Timestamp).toLocaleDateString("en-US") + " " + new Date(single.data_log[0].Timestamp).toLocaleTimeString("en-US"));
      $("#chamber").val(single.data_log[0]['Chamber Pressure'] + " Torr");
      $("#mchange").val(single.data_log[0]['Mass Offset'] + " ng/cm²");
      $("#step").val(single.exe_table[0]['Recipe Step']);

      // Precursors
      // TODO

      // Doses
      $("#recipe-step").text(single.doses_delta[0]["Recipe Step #"]);
      $("#precursor-number").text(single.doses_delta[0]["Precursor #"]);
      $("#precursor-name").text(single.doses_delta[0]["Precursor Name"]);
      $("#process-type").text(single.doses_delta[0]["ALD Process Type"]);
      $("#initial-mass").text(single.doses_delta[0]["Initial Mass"] + " ng/cm²");
      $("#final-mass").text(single.doses_delta[0]["Final Mass"] + " ");
      $("#delta-m").text(single.doses_delta[0]["delta-M"]);

      if (single.doses_delta[0]["Hold Start Timestamp"] != "NaN") {
        $("#hold-timestamp").text(new Date(single.doses_delta[0]["Hold Start Timestamp"]).toLocaleDateString("en-US") + " " + new Date(single.doses_delta[0]["Hold Start Timestamp"].toLocaleTimeString("en-US")));
      } else {
        $("#hold-timestamp").text();
      }

      $("#hold-etime").text(single.doses_delta[0]["Hold Start Elapsed Time"] + "s");

      if (single.doses_delta[0]["Purge Start Timestamp"] != "NaN") {
        $("#purge-timestamp").text(new Date(single.doses_delta[0]["Purge Start Timestamp"]).toLocaleDateString("en-US") + " " + new Date(single.doses_delta[0]["Purge Start Timestamp"]).toLocaleTimeString("en-US"));
      } else {
        $("#purge-timestamp").text();
      }

      $("#purge-etime").text(single.doses_delta[0]["Purge Start Elapsed Time"]);

      if (single.doses_delta[0]["Pulse/Fill Start Timestamp"] != "NaN") {
        $("#pulse-timestamp").text(new Date(single.doses_delta[0]["Pulse/Fill Start Timestamp"]).toLocaleDateString("en-US") + " " + new Date(single.doses_delta[0]["Pulse/Fill Start Timestamp"]).toLocaleTimeString("en-US"));
      } else {
        $("#pulse-timestamp").text();
      }

      $("#pulse-etime").text(single.doses_delta[0]["Pulse/Fill Start Elapsed Time"] + " s");

      // Data
      $("#total-etime").text(single.data_log[0]["Elapsed Time"] + "s");
      $("#pump-pressure").text(single.data_log[0]["Pump Pressure"]);
      $("#xtal-ok").text(single.data_log[0]["Xtal OK?"]);
      $("#xtal-life").text(single.data_log[0]["Xtal Life"]);
      $("#mass").text(single.data_log[0].Mass + " ng/cm²");
      $("#mass-offset").text(single.data_log[0]["Mass Offset"] + " ng/cm²");
      $("#frequency").text(single.data_log[0].Frequency + "s");
      $("#iteration-duration").text(single.data_log[0]["Iteration Duration"] + "s");

      // Thermocouples
      $("#tc-1").css("width", parseInt(single.data_log[0]['Thermocouple 1']) / 2 + "%");
      $("#tc-1").text(single.data_log[0]['Thermocouple 1'] + "°C");
      $("#tc-2").css("width", parseInt(single.data_log[0]['Thermocouple 2']) / 2 + "%");
      $("#tc-2").text(single.data_log[0]['Thermocouple 2'] + "°C");
      $("#tc-3").css("width", parseInt(single.data_log[0]['Thermocouple 3']) / 2 + "%");
      $("#tc-3").text(single.data_log[0]['Thermocouple 3'] + "°C");
      $("#tc-4").css("width", parseInt(single.data_log[0]['Thermocouple 4']) / 2 + "%");
      $("#tc-4").text(single.data_log[0]['Thermocouple 4'] + "°C");

      // Mod7/Mod8
      // Mod7
      if (single.data_log[0]["Mod7/do0"] == 1) {
        $("#mod7-0").prop("checked", true);
      } else {
        $("#mod7-0").prop("checked", false);
      }

      if (single.data_log[0]["Mod7/do1"] == 1) {
        $("#mod7-1").prop("checked", true);
      } else {
        $("#mod7-1").prop("checked", false);
      }

      if (single.data_log[0]["Mod7/do2"] == 1) {
        $("#mod7-2").prop("checked", true);
      } else {
        $("#mod7-2").prop("checked", false);
      }

      if (single.data_log[0]["Mod7/do3"] == 1) {
        $("#mod7-3").prop("checked", true);
      } else {
        $("#mod7-3").prop("checked", false);
      }

      if (single.data_log[0]["Mod7/do4"] == 1) {
        $("#mod7-4").prop("checked", true);
      } else {
        $("#mod7-4").prop("checked", false);
      }

      if (single.data_log[0]["Mod7/do5"] == 1) {
        $("#mod7-5").prop("checked", true);
      } else {
        $("#mod7-5").prop("checked", false);
      }

      if (single.data_log[0]["Mod7/do6"] == 1) {
        $("#mod7-6").prop("checked", true);
      } else {
        $("#mod7-6").prop("checked", false);
      }

      if (single.data_log[0]["Mod7/do7"] == 1) {
        $("#mod7-7").prop("checked", true);
      } else {
        $("#mod7-7").prop("checked", false);
      }

      // Mod8
      if (single.data_log[0]["Mod8/do0"] == 1) {
        $("#mod8-0").prop("checked", true);
      } else {
        $("#mod8-0").prop("checked", false);
      }

      if (single.data_log[0]["Mod8/do1"] == 1) {
        $("#mod8-1").prop("checked", true);
      } else {
        $("#mod8-1").prop("checked", false);
      }

      if (single.data_log[0]["Mod8/do2"] == 1) {
        $("#mod8-2").prop("checked", true);
      } else {
        $("#mod8-2").prop("checked", false);
      }

      if (single.data_log[0]["Mod8/do3"] == 1) {
        $("#mod8-3").prop("checked", true);
      } else {
        $("#mod8-3").prop("checked", false);
      }

      if (single.data_log[0]["Mod8/do4"] == 1) {
        $("#mod8-4").prop("checked", true);
      } else {
        $("#mod8-4").prop("checked", false);
      }

      if (single.data_log[0]["Mod8/do5"] == 1) {
        $("#mod8-5").prop("checked", true);
      } else {
        $("#mod8-5").prop("checked", false);
      }

      if (single.data_log[0]["Mod8/do6"] == 1) {
        $("#mod8-6").prop("checked", true);
      } else {
        $("#mod8-6").prop("checked", false);
      }

      if (single.data_log[0]["Mod8/do7"] == 1) {
        $("#mod8-7").prop("checked", true);
      } else {
        $("#mod8-7").prop("checked", false);
      }
    });

  });


});