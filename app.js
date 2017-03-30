var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path');
var jquery = require('jquery');
var deviceCreator = require('./create-device-identity');

//create our express app
var app = express();

var port = process.env.port || 3000
//setup our app to use handlebars.js for templating
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Routes
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/api/create-device', function(req, res) {
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


app.use(express.static(__dirname + '/static'));
//app.use(express.static('static'));

//have our app listen on azure port local port 3000
app.listen(port);
