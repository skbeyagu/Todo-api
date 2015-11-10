var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = (process.env.PORT || 3000);
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// Get /todes

app.get('/todos', function (req, res){
	res.json(todos);
});

app.get('/todos/:id', function (req, res){
	var todoID = parseInt(req.params.id, 10);
	var matchedID;

	todos.forEach(function (todo){
		if(todoID === todo.id){
			matchedID = todo;
		}
	});

	if (matchedID) {
		res.json(matchedID);
		
	} else{
		res.status(404).send();
	}

});

//POST /todos/

app.post('/todos', function(req, res){
	var body = req.body;
	body.id = todoNextId++;

	todos.push(body);


	res.json(body);
});


app.listen(PORT, function () {
	console.log('Express listen on port ' + PORT);
});