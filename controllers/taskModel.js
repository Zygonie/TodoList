/*
 * Task Schema
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// Schema
var taskSchema = new Schema({	
    description: { type: String },
    importance: { type: Number, required: true },
    postedDate: { type: Date, default: Date.now },
    listId: { type : Schema.ObjectId, ref : 'TodoList' },
    done: {type: Boolean, default: false}
});

// Export model
exports.taskModel = mongoose.model('Task', taskSchema);