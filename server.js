// Example from https://github.com/jaredhanson/passport-local/tree/master/examples/express3-mongoose

/*
 * Pour ajouter des changements : git add .
 * Pour commiter les changements : git commit -m "message"
 * Pour pousser les commit :
 *         git push [remote name] local_branch:remote_branch
 * Pour pousser sur github (de dev à dev) : git push GitHub dev:dev
 * Pour pousser sur heroku (de dev à master) : git push dev-heroku dev:master
 */

var express = require('express')
  , app = express()
  , mongoose = require('mongoose')
  , passport = require('passport')
  , path = require ('path')
  , pass = require('./controllers/passport')  
  , routes = require('./controllers/routes')
  , port = process.env.PORT || 8080;

//Database connect
var uristring = 'mongodb://' + process.env.UserNameMongoHQ + ':' + process.env.PassWordMongoHQ + '@paulo.mongohq.com:10001/TodoListDB';
var mongoOptions = { db: { safe: true }};
mongoose.connect(uristring, mongoOptions, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Successfully connected to MongoHQ');
  }
});

// configure Express
app.configure(function () {
    this.set('views', path.join(__dirname + '/views'));
    this.set('view engine', 'jade');
    this.set('view options', { layout: false });
    this.use(express.logger('dev'));
    this.use(express.cookieParser());
    this.use(express.bodyParser());
    this.use(express.methodOverride());
});

// Use browser cookies for development purpose
app.configure('development', function () {
    this.use(express.session({ secret: 'pas touche' }));
});

// Configure redis for production purpose
app.configure('production', function () {
    var redisUrl = url.parse(process.env.REDISTOGO_URL);
    var redisAuth = redisUrl.auth.split(':');
    this.use(express.session({
        secret: process.env.REDIS_PWD,
        store: new RedisStore({
            host: redisUrl.hostname,
            port: redisUrl.port,
            db: redisAuth[0],
            pass: redisAuth[1]
        })
    }));
});

// configure passport
app.configure(function() {
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
	this.use(passport.initialize());
	this.use(passport.session());
	this.use(this.router);
	this.use(express.static(__dirname + '/public'));
	this.use(function(req,res){
	    res.status(404).send('This requested page does not exist... yet');
	});
});

/********************** 
 *     Basic pages    *
 *********************/
app.get('/', pass.ensureAuthenticated, routes.todoList);
app.get('/todoList', pass.ensureAuthenticated, routes.todoList);
app.get('/todoList/home', pass.ensureAuthenticated, routes.home);
app.get('/todoList/details', pass.ensureAuthenticated, routes.details);
app.get('/todoList/details/:listId', pass.ensureAuthenticated, routes.details);


/**********************
 *   Login/out pages  *
 *********************/
app.get('/signin', routes.signin);
app.post('/signin', routes.login);
app.get('/logout', routes.logout);
app.get('/auth/google', routes.googleLogin);
app.get('/auth/google/return', routes.googleReturn);

/****************
 *   API REST   *
 ***************/
app.get('/api/todoList/:Id?', pass.ensureAuthenticated, routes.getList); //The ? indicates an optional parameter
app.post('/api/todoList', pass.ensureAuthenticated, routes.createList);
app.post('/api/todoList/:Id/:TaskId', pass.ensureAuthenticated, routes.addTaskToList);
app.del('/api/todoList/:Id', pass.ensureAuthenticated, routes.removeList);
app.post('/api/todoList/:Id', pass.ensureAuthenticated, routes.updateList);

app.get('/api/task/:Id', pass.ensureAuthenticated, routes.getTask);
app.post('/api/task', pass.ensureAuthenticated, routes.createTask);
app.del('/api/task/:Id', pass.ensureAuthenticated, routes.removeTask);
app.post('/api/task/:Id', pass.ensureAuthenticated, routes.updateTask);


app.listen(port, function() {
  console.log('Express server listening on port: ' + port);
});
