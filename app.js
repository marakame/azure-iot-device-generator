var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path');
var jquery = require('jquery');
var deviceCreator = require('./create-device-identity');
var deviceSimulator = require('./device-simulator');

// Create express app
var app = express();

// Create a global variable to store all simulated device values
global.simulatedDevices = {};

// If running in Azure process.env.port will get the port assigned to the app
// If running locally the app will use a fixed port
var port = process.env.port || 3001;

// Setup the app to use handlebars.js for templating and set the view path
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Use bodyParser for json and url handling
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Define app endpoints
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/api/create-device', function(req, res) {
	// Call the create device function and respond accordingly
	deviceCreator.createDevice(function(err, data){
		if (err){
			console.log(err);
			res.json(data);
		}
		if (data){
			res.json(data);
		}
	});
});

app.post('/api/delete-device', function(req, res) {
	// Call the delete device function and respond accordingly
	deviceCreator.deleteDevice(req.body.deviceID, function(err, data){
		if (err){
			console.log(err);
			res.send(err);
		}
		if (data){
			if (data == 'OK'){
				console.log("Device " + req.body.deviceID + " deleted.");
			}
			res.send(data);
		}
	});
});

app.post('/api/start-device', function(req, res) {
	// Call the start device function and respond accordingly
	deviceSimulator.startSimulation(req.body.deviceID, req.body.deviceKey, function(err, data){
		if (err){
			console.log(err);
			res.send(err);
		}
		if (data){
			if (data == 'OK'){
				console.log("Device " + req.body.deviceID + " started.");
			}
			res.send(data);
		}
	});
});

app.post('/api/pause-device', function(req, res) {
	deviceSimulator.pauseSimulation(req.body.deviceID, function(err, data){
		if (err){
			console.log(err);
			res.send(err);
		}
		if (data){
			if (data == 'OK'){
				console.log("Device " + req.body.deviceID + " paused.");
			}
			res.send(data);
		}
	});
});


app.use(express.static(__dirname + '/static'));
//app.use(express.static('static'));

//have our app listen on azure port local port 3000
app.listen(port);
