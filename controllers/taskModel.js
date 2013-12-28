/*
 * Task Schema
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , dbTodoList = require('./todoListModel')
  , TodoListEntry = dbTodoList.todoListModel;

// Schema
var taskSchema = new Schema({	
    description: { type: String },
    importance: { type: Number, required: true },
    postedDate: { type: Date, default: Date.now },
    listId: { type : Schema.ObjectId, ref : 'TodoList' },
    done: {type: Boolean, default: false}
});

taskSchema.pre('remove', function(next){
    this.model('TodoList').findById(this.listId, function(list,next) {
        list.items.id(this._id).remove();
        next();
    });
});

// Export model
exports.taskModel = mongoose.model('Task', taskSchema);