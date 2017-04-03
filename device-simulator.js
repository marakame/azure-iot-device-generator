'use strict';

var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

var connectionString;
var deviceID, deviceKey;

var client;
var simulatedDevices = {};

function printResultFor(op) {
		return function printResult(err, res) {
		 if (err) console.log(op + ' error: ' + err.toString());
		 if (res) console.log(op + ' status: ' + res.constructor.name);
		};
	}


function simulateTelemetry(telemetryDeviceID){
	var temperature = getRandomInt(0, 40);
	var data = JSON.stringify({ deviceId: telemetryDeviceID, temperature: temperature });
	var message = new Message(data);
	console.log("Sending message: " + message.getData());
	client.sendEvent(message, printResultFor('send'));
}

function startSimulation(simulationDeviceID, simulationDeviceKey, callback){
	deviceID = simulationDeviceID;
	deviceKey = simulationDeviceKey;

	connectionString = 'HostName={AppHostName};DeviceId=' + simulationDeviceID + ';SharedAccessKey=' + simulationDeviceKey;

	client = clientFromConnectionString(connectionString);

	client.open(function(err) {
		if (err) {
			console.log('Could not connect: ' + err);
			callback(err);
		} else {
			console.log('Client connected');
			simulatedDevices[simulationDeviceID] = {};
			simulatedDevices[simulationDeviceID].timer = setInterval(simulateTelemetry, 1000, simulationDeviceID);
			callback(null, "OK");
		}
	});
}

function pauseSimulation(simulationDeviceID, callback){

	clearInterval(simulatedDevices[simulationDeviceID].timer);
	callback(null, "OK");
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    startSimulation: startSimulation,
    pauseSimulation: pauseSimulation
}
