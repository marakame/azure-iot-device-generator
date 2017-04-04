'use strict';

var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

var connectionString;
var deviceID, deviceKey;

var client;

function printResultFor(op) {
		return function printResult(err, res) {
		 if (err) console.log(op + ' error: ' + err.toString());
		 if (res) console.log(op + ' status: ' + res.constructor.name);
		};
	}


function simulateTelemetry(telemetryDeviceID){

	// Check if temperature measure exists
	if (typeof global.simulatedDevices[telemetryDeviceID].data.temperature !== 'undefined') {
		var currentTemperature = global.simulatedDevices[telemetryDeviceID].data.temperature;
		global.simulatedDevices[telemetryDeviceID].data.temperature = getRandomTemp(currentTemperature, 12);
	} else {
		global.simulatedDevices[telemetryDeviceID].data.temperature = getRandomTemp();
	}

	var data = JSON.stringify(global.simulatedDevices[telemetryDeviceID].data);
	var message = new Message(data);
	console.log("Sending message: " + message.getData());
	client.sendEvent(message, printResultFor('send'));
}

function startSimulation(simulationDeviceID, simulationDeviceKey, callback){
	deviceID = simulationDeviceID;
	deviceKey = simulationDeviceKey;

	connectionString = 'HostName={AppHostName};DeviceId=' + simulationDeviceID + ';SharedAccessKey=' + simulationDeviceKey;

	client = clientFromConnectionString(connectionString);

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

function pauseSimulation(simulationDeviceID, callback){

	clearInterval(global.simulatedDevices[simulationDeviceID].timer);
	callback(null, "OK");
}

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

module.exports = {
    startSimulation: startSimulation,
    pauseSimulation: pauseSimulation
}
