const express = require('express');
const router = express.Router();
const User = require('./user.model');
const passport = require('passport');

require('./user.local');

// get login
router.get('/login', (req, res) => {
  res.render('login');
});

// post login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'Incorrect email or password.',
    successFlash: 'Success!'
    }
  )
);

// get register
router.get('/register', (req, res) => {
  res.render('register');
});

// post register
router.post('/register', (req, res) => {
  if (req.body.password === req.body.verify) {
    User.findOne({email: req.body.email}, (err, user) => {
      if (err) throw err;
      if (user) {
        res.redirect('/login');
      } else {
        User.create(req.body, (err, user) => {
          if (err) throw err;
          res.redirect('/login');
        });
      }
    });
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Passwords do not match.'
    });
  }
});

// log out and regenerate session id
router.delete('/login', (req, res) => {
  req.session.regenerate(err => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;
