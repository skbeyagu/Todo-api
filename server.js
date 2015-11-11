var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = (process.env.PORT || 3000);
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// Get /todes

app.get('/todos', function (req, res){
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true' ){
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(filteredTodos, {completed: false});
	}
	

	res.json(filteredTodos);
});

app.get('/todos/:id', function (req, res){
	var todoID = parseInt(req.params.id, 10);
	var matchedID = _.findWhere(todos,{id: todoID});


	// todos.forEach(function (todo){
	// 	if(todoID === todo.id){
	// 		matchedID = todo;
	// 	}
	// });

	if (matchedID) {
		res.json(matchedID);
		
	} else{
		res.status(404).send();
	}

});

//POST /todos/

app.post('/todos', function(req, res){
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.description = body.description.trim();

	body.id = todoNextId++;

	todos.push(body);


	res.json(body);
});

app.delete('/todos/:id', function (req, res){
	var todoID = parseInt(req.params.id, 10);
	var matchedID = _.findWhere(todos,{id: todoID});

	// todos.forEach(function (todo){
	// 	if(todoID === todo.id){
	// 		matchedID = todo;
	// 	}
	// });

	if (matchedID) {
		res.json(matchedID);
		todos = _.without(todos, matchedID);
	} else{
		res.status(404).send();
	}

});


app.put('/todos/:id', function (req, res){
	var todoID = parseInt(req.params.id, 10);
	var matchedID = _.findWhere(todos,{id: todoID});
	var body = _.pick(req.body, 'description', 'completed');
	var vaildAttributes = {};

	if (!matchedID) {
	return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		vaildAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')){
		return res.status(404).send();
	} else {
		return res.status(404).send();
	} 

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		vaildAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')){
		return res.status(404).send();
	} 




	// todos.forEach(function (todo){
	// 	if(todoID === todo.id){
	// 		matchedID = todo;
	// 	}
	// });
	_.extend(matchedID, vaildAttributes);

	res.json(matchedID);

});


app.listen(PORT, function () {
	console.log('Express listen on port ' + PORT);
});