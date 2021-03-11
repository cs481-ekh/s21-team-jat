var fs = require('fs');

module.exports = function () {
  var parsed;

  var jsonData = fs.readFileSync('data_json/data.json');

  // Parse and manipulate the data for use by EJS
  parsed = JSON.parse(jsonData, function (key, value) {

    // Add pressure unit label
    if (key.includes("Pressure")) {
      value += " Torr";
    }

    // Add percent unit label
    if (key.includes("Xtal Life")) {
      value += "%";
    }

    // Add flow unit label
    if (key.includes("Flow")) {
      value += " sccm";
    }

    // Add mass unit label
    if (key.includes("Mass")) {
      value += " ng/cm²";
    }

    // Add temp unit label
    if (key.includes("Thermocouple")) {
      value += " ºC";
    }

    // Convert dates and add seconds unit label
    if (key.includes("Time")) {
      if (key.includes("Timestamp")) {
        if (value != "NaN") {
          var date = new Date(value);
          value = date.toLocaleDateString("en-US") + " " + date.toLocaleTimeString("en-US");
        }
      } else {
        value += "s";
      }
    }

    // Convert duration to time units
    if (key.includes("Duration")) {
      value += "s";
    }

    // Add freq unit label
    if (key.includes("Frequency")) {
      value = value.toLocaleString("en-US");
      value += " Hz";
    }

    // Mutate 1 or 0 into "yes" or "no"
    if (key == "Xtal OK?") {
      if (value == 0) {
        value = "No";
      } else {
        value = "Yes";
      }
    }

    // Convert "NaN" to "N/A"
    if (typeof (value) === 'string' && value.includes("NaN")) {
      value = "N/A";
    }

    return value;
  });
  
  return parsed;
};