/*
 * Todo List Schema
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , async = require("async");

// Schema
var todoListSchema = new Schema({	
	title: { type: String, required: true },
    items: [ { type : Schema.ObjectId, ref : 'Task' } ],
    creationDate: { type: Date, default: Date.now },
    user: { type : Schema.ObjectId, ref : 'User', required: true }
});

todoListSchema.pre('remove', function(next){    
	var list = this;
    async.each(list.items, function (taskId, callback) {
	    list.model('Task').findByIdAndRemove(taskId, function (err, removedTaskId) {
	        if (err) {
	            console.log('An error has occured while trying to delete task entry with Id: ' + removedTaskId._id + ' in the <pre> middleware from list deleting.');
	            console.log(err);
	            res.send(err);
	        }
	        else {
	            console.log('Task entry with Id: ' + removedTaskId.id + ' in the <pre> middleware from list deleting has well been removed from DB.');
	        }
	    });
	    callback(null);
    }, function (err) {
        if (err) {
            console.log('An error has occured during each loop when trying to delete tasks of list ' + list._id);
        }
        else {
            console.log('All tasks sub-documents have well been removed from DB.');
            next();
        }
    });
});

// Export model
exports.todoListModel = mongoose.model('TodoList', todoListSchema);