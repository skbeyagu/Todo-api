var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname +'/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		notEmpty: true,
		defaultValue: false
	}
});

var user = sequelize.define('user', {
	email: Sequelize.STRING
});

Todo.belongsTo(user);
user.hasMany(Todo);

sequelize.sync(
	//{force: true}
	).then(function(){

	user.findById(1).then(function(user){
		user.getTodos({
			where: {
				completed: false
			}
		}).then(function (todos){
				todos.forEach(function (todo){
					console.log(todo.toJSON());
				});
			});
		});



	// user.create({
	// 	email:'eeee@gmail.com'
	// }).then(function(){
	// 	Todo.create({
	// 		description: 'stuff'
	// 	});
	// }).then(function(todo){
	// 	user.findById(1).then(function(user){
	// 		user.addTodo(todo);
	// 	})
	// });
});

