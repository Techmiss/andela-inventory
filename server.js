var express = require('express');
var app = express();
var formidable = require('formidable');

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/add', function(req, res) {
	res.render('add');
});

app.post('/add',function (req, res){
	var form = formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		console.log(fields);
	});
	res.redirect('/');
});

app.listen(1994);
console.log('Server listening on port 1994');
