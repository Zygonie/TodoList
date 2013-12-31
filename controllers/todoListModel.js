/*
 * Todo List Schema
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// Schema
var todoListSchema = new Schema({	
	title: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    taskCount: { type: Number, default: 0 },
    user: { type: Schema.ObjectId, ref : 'User', required: true }
});

todoListSchema.pre('remove', function(next){    
	var list = this;    
    list.model('Task').remove({listId: list._id}, function (err, nbRemoved) {
	        if (err) {
	            console.log('An error has occured while trying to delete tasks from list with Id: ' + list._id + ' in the <pre> middleware of list deleting.');
	            console.log(err);
	            res.send(err);
	        }
	        else {
	            console.log(nbRemoved + ' tasks have been well removed from DB.');
                next();
	        }
	    });

});

// Export model
exports.todoListModel = mongoose.model('TodoList', todoListSchema);