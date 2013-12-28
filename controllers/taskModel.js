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
    this.model('TodoList').findById(this.listId, function (err, list, next) {
        if (err) {
            console.log('An error has occured while trying to delete task entry with Id: ' + this._id + ' in the <pre> middleware');
            console.log(err);
            res.send(err);
        }
        else {
            if(!list) console.log('Could not find list with _id:' + this.listId);
            list.items.pull(this._id);
            list.save(function (err, updatedlist, next) {
                if (err) {
                    console.log('An error has occured while trying to save the updted list when deleting task entry with Id: ' + this._id + ' in the <pre> middleware');
                    console.log(err);
                    res.send(err);
                }
                else {
                    next();
                }
            });
        }
    });
});

// Export model
exports.taskModel = mongoose.model('Task', taskSchema);