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

// Routes
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/api/create-id', function(req, res) {
	var newID = deviceCreator.createID();
	res.send(newID);
});

app.use(express.static(__dirname + '/static'));
//app.use(express.static('static'));

//have our app listen on azure port local port 3000
app.listen(port);
