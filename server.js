var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');

var app = express();
var PORT = (process.env.PORT || 3000);
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// Get /todes

app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var where = {};

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		where.completed = true;
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		where.completed = false;
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		where.description = {
			$like: '%' + queryParams.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});

	// var filteredTodos = todos;

	// if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: true
	// 	});
	// } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: false
	// 	});
	// }

	// if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function(todo) {
	// 		return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1
	// 	})

	// }



	// res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res) {
	var todoID = parseInt(req.params.id, 10);
	var matchedID = _.findWhere(todos, {
		id: todoID
	});


	db.todo.findById(todoID).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
	// todos.forEach(function (todo){
	// 	if(todoID === todo.id){
	// 		matchedID = todo;
	// 	}
	// });

	// if (matchedID) {
	// 	res.json(matchedID);

	// } else {
	// 	res.status(404).send();
	// }

});

//POST /todos/

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});
	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }

	// body.description = body.description.trim();

	// body.id = todoNextId++;

	// todos.push(body);


	// res.json(body);
});

app.delete('/todos/:id', function(req, res) {
	var todoID = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoID
		}
	}).then(function(rowsDeleted) {
			if (rowsDeleted === 0) {
				res.status(404).json({
					error: 'no todo with id'
				});
			} else {
				res.status(204).send();
			}
		},
		function() {
			res.status(500).send();
		});



	// var matchedID = _.findWhere(todos, {
	// 	id: todoID
	// });

	// todos.forEach(function (todo){
	// 	if(todoID === todo.id){
	// 		matchedID = todo;
	// 	}
	// });

	// if (matchedID) {
	// 	res.json(matchedID);
	// 	todos = _.without(todos, matchedID);
	// } else {
	// 	res.status(404).send();
	// }

});


app.put('/todos/:id', function(req, res) {
	var todoID = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};



	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findById(todoID).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());

			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}

	}, function() {
		res.status(500).send();
	});


});

app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});

// POST /users/login
app.post('/users/login', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.authenticate(body).then(function (user) {
		var token = user.generateToken('authentication');
		if (token){
			res.header('Auth', token).json(user.toPublicJSON());
		}else {
			res.status(401).send();
		}
		
	}, function () {
		res.status(401).send();
	});
});

db.sequelize.sync({force: true}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listen on port ' + PORT);
	});
});