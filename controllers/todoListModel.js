/**
 * Backlog entry Schema
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

//Profile schema
var todoListSchema = new Schema({	
	title: { type: String, required: true },
    items: [{
        description: { type: String },
        importance: { type: Number, required: true },
        postedDate: { type: Date, default: Date.now },
        done: {type: Boolean, default: false}
        }],    
    user: { type : Schema.ObjectId, ref : 'User', required: true }
});

// Export profile model
exports.todoListModel = mongoose.model('TodoList', todoListSchema);