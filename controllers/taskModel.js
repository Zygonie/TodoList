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

//http://stackoverflow.com/questions/20009122/removing-many-to-many-reference-in-mongoose
//need to index items for better performances because full table is scanned
taskSchema.pre('remove', function(next){
    this.model('TodoList').findById(this.listId, function(list,next) {
        list.items.id(this._id).remove();
        next();
    });
});

// Export model
exports.taskModel = mongoose.model('Task', taskSchema);