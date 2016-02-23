'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./user.model');

const INCORRECT_EMAIL = {message: 'Incorrect email or password.'};
const INCORRECT_PASSWORD = {message: 'Incorrect email or password.'};
const SUCCESS = {message: 'Success!'};


passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
  User.findOne({email: email}, (err, user) => {
    if (err) throw err;
    if (user) {
      //login
      user.authenticate(password, (err, valid) => {
        if (err) throw err;
        if (valid) {
          done(null, user, SUCCESS);
        } else {
          done(null, null, INCORRECT_PASSWORD);
        }
      });
    } else {
      done(null, null, INCORRECT_EMAIL);
    }
  });
}));
