/*
 * Todo List Schema
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// Schema
var todoListSchema = new Schema({	
	title: { type: String, required: true },
    items: [ { type : Schema.ObjectId, ref : 'Task' } ],    
    user: { type : Schema.ObjectId, ref : 'User', required: true }
});

// Export model
exports.todoListModel = mongoose.model('TodoList', todoListSchema);