var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/add', function(req, res) {
	res.render('add');
});

app.listen(1994);
console.log('Server listening on port 1994');
