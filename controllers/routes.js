﻿var mongoose = require('mongoose')
  , passport = require('passport')
  , dbUser = require('./userModel')
  , User = dbUser.userModel
  , dbTodoList = require('./todoListModel')
  , TodoListEntry = dbTodoList.todoListModel
  , dbTask = require('./taskModel')
  , TaskEntry = dbTask.taskModel; 

/*
 * Basic pages
 */
exports.todoList = function (req, res) {
    res.render('index', {
        id: 'Home',
        user: req.user
    });
};

exports.home = function (req, res) {
    res.render('partials/home', {
        id: 'Home',
        user: req.user
    });
};

exports.details = function (req, res) {
    res.render('partials/details', {
        id: 'Home',
        user: req.user
    });
};

exports.signin = function (req, res) {
    res.render('signin');
};

exports.logout = function(req, res) {
	var name = req.user.username;
	req.logout();
	console.log('User ' + name + ' has logged out.');
	res.redirect('/signin');
};

exports.login = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { console.log(info); }
    else {
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            else { 
                console.log(info); 
                return res.redirect('/todoList');
            }
        });
    }
  })(req, res, next);
};

/*
 * Google authentification
 */
exports.googleLogin = passport.authenticate('google');
exports.googleReturn = passport.authenticate('google', { successRedirect: '/todoList', failureRedirect: '/login' });

/*
 * REST API Todo List
 */
exports.getList = function(req, res) {
    var user = req.user;
    var id = req.params.Id;
    if (id) {
        TodoListEntry.findById(id).populate('items').exec(function (err, entries) {
            if (err) {
                console.log('Unable to retrieve todo list entry.');
            }
            res.send(JSON.stringify(entries));
        });
    }
    else {
        TodoListEntry.find({ user: user }).populate('items').exec(function (err, entries) {
            if (err) {
                console.log('Unable to retrieve todo list entry.');
            }
            res.send(JSON.stringify(entries));
        });
    }
};

exports.createList = function(req, res) {
    var user = req.user;
	var entry = new TodoListEntry({
        user: user,
        items: [],
        title: req.body.title
        });
	entry.save(function(err, entry) {
		if(err) {
			console.log(err);
	    } 
		else {
			console.log('New todo list entry has been posted.');	
			res.send(JSON.stringify(entry));
		}
	});
};

exports.updateList = function(req, res) {
	var Id = req.params.Id;
	var entry = req.body;
	delete entry._id;
	TodoListEntry.update({_id: Id}, entry, {safe:true, upsert: true}, function(err, result){
		if(err) {
			console.log('Error updating todo list. ' + err);
		}
		else{
			console.log(result + ' todo list entry updated');
			entry._id = Id;
			res.send(JSON.stringify(entry));
		}			
	});
};

exports.addTaskToList = function(req, res) {
	var listId = req.params.Id;
    var taskId = req.params.TaskId;
	TodoListEntry.update({_id: listId}, {$push: {items: taskId}}, {safe:true, upsert: true}, function(err, result){
		if(err) {
			console.log('Error updating todo list. ' + err);
		}
		else{
			console.log(result + ' todo list entry updated - New task added');
            res.send(JSON.stringify(err)); 
		}			
	});
};

exports.removeList = function(req,res) {
	var Id = req.params.Id;
	TodoListEntry.findByIdAndRemove(Id, function(err, entry) {
	    if (err) {
	    	console.log('An error hase occured while trying to delete todo list entry with Id: ' + Id);
	    }
	    else {
	        console.log('Todo list entry with Id ' + Id + ' has well been removed from DB');
	        res.send(JSON.stringify(entry));
	    }
	});
};

/*
 * REST API Task
 */
exports.getTask = function(req, res) {
    var user = req.user;
	TaskEntry.find({user: user}).exec(function(err, entries) { 
		if(err) {
			console.log('Unable to retrieve task entry.');
		}
		res.send(JSON.stringify(entries));
	});
};

exports.createTask = function(req, res) {
	var entry = new TaskEntry({
        description: req.body.description,
        importance: req.body.importance
        });
	entry.save(function(err, entry) {
		if(err) {
			console.log(err);
	    } 
		else {
			console.log('New task entry has been posted.');	
			res.send(JSON.stringify(entry));
		}
	});
};

exports.updateTask = function(req, res) {
	var Id = req.params.Id;
	var entry = req.body;
	delete entry._id;
	TaskEntry.update({_id: Id}, entry, {safe:true, upsert: true}, function(err, result){
		if(err) {
			console.log('Error updating task. ' + err);
		}
		else{
			console.log(result + ' task entry updated');
			entry._id = Id;
			res.send(JSON.stringify(entry));
		}			
	});
};

exports.removeTask = function(req,res) {
	var Id = req.params.Id;
	TaskEntry.findByIdAndRemove(Id, function(err, entry) {
	    if (err) {
	    	console.log('An error hase occured while trying to delete task entry with Id: ' + Id);
	    }
	    else {
	        console.log('Task entry with Id ' + Id + ' has well been removed from DB');
	        res.send(JSON.stringify(entry));
	    }
	});
};