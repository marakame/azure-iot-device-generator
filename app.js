var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path');
var jquery = require('jquery');

//create our express app
var app = express();

//add some standard express middleware
//app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
//app.use(express.bodyParser());
//app.use(express.cookieParser());
//app.use(express.static('static'));

var port = process.env.port || 3000
//setup our app to use handlebars.js for templating
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//routes
app.get('/', function(req, res) {
    res.render('index');
});

app.use(express.static(__dirname + '/static'));
//app.use(express.static('static'));

//have our app listen on azure port local port 3000
app.listen(port);
