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
    done: {type: Boolean, default: false},
    list: { type : Schema.ObjectId, ref : 'TodoList', required: true }
});

// Export model
exports.taskModel = mongoose.model('Task', taskSchema);