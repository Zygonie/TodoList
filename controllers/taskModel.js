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

taskSchema.pre('remove', function(next){    
	var task = this;
    this.model('TodoList').findById(task.listId, function (err, list) {
        if (err) {
            console.log('An error has occured while trying to delete task entry with Id: ' + task._id + ' in the <pre> middleware');
            console.log(err);
            res.send(err);
        }
        else {
            if(!list) console.log('Could not find list with _id:' + task.listId);
            list.items.pull(task._id);
            list.save(function (err, updatedlist) {
                if (err) {
                    console.log('An error has occured while trying to save the updted list when deleting task entry with Id: ' + task._id + ' in the <pre> middleware');
                    console.log(err);
                    res.send(err);
                }
                else {
                    console.log('Task entry with Id ' + task._id + ' has well been removed from list items.');
                    next();
                }
            });
        }
    });
});

// Export model
exports.taskModel = mongoose.model('Task', taskSchema);