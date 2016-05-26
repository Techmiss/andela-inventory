var express = require('express');
var formidable = require('formidable');
var Firebase = require('firebase');

var firebase = new Firebase("https://andela-inventory-web.firebaseio.com/");
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
	var inventoryItems = [];
	firebase.once('value', function(snapshot){
		snapshot.child('items').forEach(function (item){
			var inventoryItem = item.val();
			inventoryItem['id'] = item.key();
			inventoryItems.push(inventoryItem);
		});

		res.render('index',{
			items: inventoryItems
		});
	});
});

app.get('/add', function(req, res) {
	res.render('add');
});

app.post('/add',function (req, res){
	var form = formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		var inventoryItems = firebase.child('items');
		inventoryItems.push(fields);
	});
	res.redirect('/');
});
app.get('/report', function(req, res) {
	res.render('report');
});
app.post('/report',function (req, res){
	var form = formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		console.log(fields);
	});
	res.redirect('/');
});
app.get('/found', function(req, res) {
	res.render('found');
});
app.post('/found',function (req, res){
	var form = formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		console.log(fields);
	});
	res.redirect('/');
});
app.listen(1994);
console.log('Server listening on port 1994');
