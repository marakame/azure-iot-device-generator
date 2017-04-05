'use strict';

// Load Azure modules, in this case we will be using the MQTT protocol for
// sending messages to the azure Iot Hub, which will in turn send the data to the
// registered listeners via web sockets
var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

var connectionString;
var deviceID, deviceKey;

var client;

// Function to print to the console the result of a message call of a device
function printResultFor(op) {
		return function printResult(err, res) {
		 if (err) console.log(op + ' error: ' + err.toString());
		 if (res) console.log(op + ' status: ' + res.constructor.name);
		};
	}

// simulateTelemetry will perform a simulation of a sensor measuring the
// temperature at a given location and send it as if it were an IoT device
function simulateTelemetry(telemetryDeviceID){

	// Check if temperature measure exists
	if (typeof global.simulatedDevices[telemetryDeviceID].data.temperature !== 'undefined') {
		// If a measure exists, calculate with a maximum variation of 12 degrees
		// to avoid overly drastic changes in the map an get a smooth animation
		// and update the value in the global devices array
		var currentTemperature = global.simulatedDevices[telemetryDeviceID].data.temperature;
		global.simulatedDevices[telemetryDeviceID].data.temperature = getRandomTemp(currentTemperature, 12);
	} else {
		// If a measure already exists then just calculate temperature within
		// the default values
		global.simulatedDevices[telemetryDeviceID].data.temperature = getRandomTemp();
	}

	// Finally, wrap the data in a JSON object, create a message with it and
	// send it to the hub with the Azure client
	var data = JSON.stringify(global.simulatedDevices[telemetryDeviceID].data);
	var message = new Message(data);
	console.log("Sending message: " + message.getData());
	client.sendEvent(message, printResultFor('send'));
}

// This function will start the simulation process for each device, it will create
// a timer for each device with setInterval to call the simulateTelemetry function
// every 10 seconds
function startSimulation(simulationDeviceID, simulationDeviceKey, callback){
	deviceID = simulationDeviceID;
	deviceKey = simulationDeviceKey;

	// Create the connection string with de device ID and primary key
	connectionString = 'HostName={AppHostName};DeviceId=' + simulationDeviceID + ';SharedAccessKey=' + simulationDeviceKey;
	client = clientFromConnectionString(connectionString);

	// If the client already exists, (i.e. was just paused or hasn't been started)
	// just call the telemetry simulation, otherwise, open the client connection
	// and then start the simulation
	if (client){
		global.simulatedDevices[simulationDeviceID].timer = setInterval(simulateTelemetry, 10000, simulationDeviceID);
		callback(null, "OK");
	} else {
		client.open(function(err) {
			if (err) {
				console.log('Could not connect: ' + err);
				callback(err);
			} else {
				console.log('Client connected');
				global.simulatedDevices[simulationDeviceID].timer = setInterval(simulateTelemetry, 10000, simulationDeviceID);
				callback(null, "OK");
			}
		});
	}
}

// pauseSimulation will just clear the timer for a given device efectively pausing
// the simulation
function pauseSimulation(simulationDeviceID, callback){

	clearInterval(global.simulatedDevices[simulationDeviceID].timer);
	callback(null, "OK");
}

// Function to calculate a random value of temperature. If called without parameters
// the functionwill use the defaults to calculate a temperature between 0 and
// 40 degrees. However the function accepts to be passed a currentValue and variation
// to calculate a value between currentValue minus variation and currentValue plus
// variation.
function getRandomTemp(currentValue=null, variation=3, absoluteMin=0, absoluteMax=40) {
	// If current value is not defined get random value, if it is defined, get
	// a random value no further than the specified variation and within the
	// specified limits
	if (currentValue === null) {
		return Math.floor(Math.random() * (absoluteMax - absoluteMin + 1)) + absoluteMin;
	} else {
		var min = currentValue - variation;
		var max = currentValue + variation;

		if (min < absoluteMin) {
			min = absoluteMin;
		}

		if (max > absoluteMax) {
			max = absoluteMax;
		}

		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}

// Functions to be exposed to other modules
module.exports = {
    startSimulation: startSimulation,
    pauseSimulation: pauseSimulation
}
