/**
 * User Schema
 */
var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'), 
	Schema = mongoose.Schema,
	SALT_WORK_FACTOR = 10;

// User schema
var UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String },
  idFromProvider: { type: String, unique: true },
  creationDate: { type: Date, default: Date.now }
});


// Bcrypt middleware
UserSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Password verification
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

// Export user model
exports.userModel = mongoose.model('User', UserSchema);