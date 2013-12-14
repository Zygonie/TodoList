var mongoose = require('mongoose')
  , passport = require('passport')
  , dbUser = require('./userModel')
  , User = dbUser.userModel
  , dbTodoList = require('./todoListModel')
  , TodoListEntry = dbTodoList.todoListModel; 

/*
 * Basic pages
 */
exports.home = function (req, res) {
    res.render('home');
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
                return res.redirect('/home');
            }
        });
    }
  })(req, res, next);
};

/*
 * Google authentification
 */
exports.googleLogin = passport.authenticate('google');
exports.googleReturn = passport.authenticate('google', { successRedirect: '/home', failureRedirect: '/login' });

/*
 * REST API Todo List
 */
exports.all = function(req, res) {
	TodoListEntry.find().exec(function(err, entries) { 
		if(err) {
			console.log('Unable to retrieve todo list entry.');
		}
		res.send(JSON.stringify(entries));
	});
};

exports.create = function(req, res) {
	var entry = new TodoListEntry(req.body);
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

exports.update = function(req, res) {
	var Id = req.params.Id;
	var entry = req.body;
	delete entry._id;
	TodoListEntry.update({_id: Id}, entry, {safe:true, upsert: true}, function(err, result){
		if(err) {
			console.log('Error updating profile. ' + err);
		}
		else{
			console.log(result + ' todo list entry updated');
			entry._id = Id;
			res.send(JSON.stringify(entry));
		}			
	});
};

exports.remove = function(req,res) {
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