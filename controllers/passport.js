
var passport = require('passport')
  , mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  //, FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google').Strategy
  , dbUser = require('./userModel')
  , User = dbUser.userModel
  , config = require('../config.js'); 

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
    done(err, user);
  });
});

/*
 *  Local strategy
 */
passport.use(new LocalStrategy(function(email, password, done) {
	User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { //unknown user, register new one
            var newuser = new User({ email: req.body.email, password: req.body.password, provider: 'local' });
            newuser.save(function(err) {
                if(err) { return done(err); } 
                else {
                    return done(null, newuser, { message: 'New user: ' + newuser.email + " has register." });
                }
            });
        }
        else {
            user.comparePassword(password, function(err, isMatch) {
                if (err) { return done(err); }
                if(isMatch) {
                    return done(null, user, { message: 'User ' + user.email + ' has logged in.' });
                } 
                else {
                    return done(null, false, { message: 'User ' + user.email + ' login failed - Invalid password' });
                }
            });
        }
    });
}));


/*
 *  Facebook strategy not used yet
 */
/*passport.use(new FacebookStrategy({
    clientID: "570895642989531",
    clientSecret: "b853de80ca89f2f09a4a9cb0b558c56c",
    callbackURL: "http://localhost:8080/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
	  User.findOne({ username: profile.displayName, email: profile.emails[0].value }, function(err, olduser) {
		   if (err) { return done(err); }
	       if (olduser) { 
	    	   return done(null, olduser); 
	       }
	       else{
	    	   var birthday = new Date(profile._json.birthday);
	           var now = new Date;
	           var age = now.getFullYear() - birthday.getFullYear();
	           var ObjectId = mongoose.Types.ObjectId;
	    	   var newuser = new User({ 
	    		   username: profile.displayName, 
	    		   email: profile.emails[0].value,
	    		   fbId: profile.id,
	    		   strategy: 'facebook' });
	    	   var newprofile = new Profile({ 
	    		   username: profile.displayName, 
                   email: profile.emails[0].value, 
                   age: age, 
                   address: null, 
                   city: profile._json.location.name, 
                   zipcode: null,
                   user: newuser});
	    	   newuser.save(function(err,newuser) {
	    		   if(err) {
	    			   console.log(err);
	    			   }
	    		   else {
	    			   console.log('New user: ' + newuser.username + " has register.");
	    			   newprofile.save(function(err) {
	    				   if(err) {
	    					   console.log(err);
	    					   }
	    				   else {
	    					   console.log('Profile for user: ' + newprofile.username + " saved.");
	    					   done(null,newuser);
	    					   }
	    				   });
	    			   }
	    		   });
	       }
	  });
  })
);
*/

passport.use(new GoogleStrategy({
    returnURL: config.Config.google.returnURL,
    realm: config.Config.google.realm
  },
  function(identifier, profile, done) {
    User.findOne({ idFromProvider: profile.id }, function(err, olduser) {
        if (err) { return done(err); }
        if (olduser) { 
            console.log('User: ' + olduser.email + " has logged in.");
            return done(null, olduser); 
        }
        else{
            var newuser = new User({ 
                email: profile.emails[0].value,
                provider: profile.provider });
            newuser.save(function(err, user) {
                if(err) { console.log(err); }
                else {
                    console.log('New user: ' + user.email + " has register.");
                    done(null, user);
                }
            });
	    }
    });
  }
));

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/signin');
};