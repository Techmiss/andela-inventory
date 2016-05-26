var express = require('express');
var formidable = require('formidable');
var Firebase = require('firebase');

var firebase = new Firebase("https://andela-inventory-web.firebaseio.com/");
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
	var inventoryItems = [];
	var missingItems = [];
	firebase.once('value', function(snapshot){
		snapshot.child('items').forEach(function (item){
			var inventoryItem = item.val();
			inventoryItem['id'] = item.key();
			if (!inventoryItem.missing)
				inventoryItems.push(inventoryItem);
			else
				missingItems.push(inventoryItem);
		});

		res.render('index',{
			items: inventoryItems,
			missingItems: missingItems
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

app.get('/delete/:id', function (req, res) {
	var id = req.params.id;
	firebase.child('items').child(id).remove();
	res.redirect('/');
});

app.get('/edit/:id', function (req, res){
	var id = req.params.id;
	var inventoryItem = {};
	firebase.once('value', function (snapshot){
		snapshot.child('items').forEach(function (item){
			if (item.key() == id)
				inventoryItem = item.val();
		});

		res.render('edit',{
			id:id,
			item:inventoryItem
		});
	});
});

app.post('/edit/:id', function (req, res){
	var id = req.params.id;
	var form = formidable.IncomingForm();
	form.parse(req, function (err, fields, files){
		firebase.child('items').child(id).update(fields);
	});
	res.redirect('/');
});

app.get('/missing/:id', function (req, res) {
	var id = req.params.id;
	firebase.child('items').child(id).child('missing').set(true);
	res.redirect('/');
});

app.get('/found/:id', function (req, res){
	var id = req.params.id;
	firebase.child('items').child(id).child('missing').set(false);
	res.redirect('/');
});

app.listen(1994);
console.log('Server listening on port 1994');
