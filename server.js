'use strict';

const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./lib/user/user.routes');
const bodyParser = require('body-parser');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'secretsss';

// use jade
app.set('view engine', 'jade');

// body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));

// session middleware with redis
// saves req.session in memory
// run redis with redis-server in CL
app.use(session({
  secret: SESSION_SECRET,
  store: new RedisStore()
}));

// use flash messages
app.use(flash());

// below session. use passport. have to npm install each version i.e. local, google, facebook
app.use(passport.initialize());
app.use(passport.session());

// // test middleware to count visits to each page per user
// app.use((req, res, next) => {
//   req.session.visits = req.session.visits || {};
//   req.session.visits[req.url] = req.session.visits[req.url] || 0;
//   req.session.visits[req.url]++;
//   console.log(req.session);
//   next();
// });

// set email based on session with passport
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// flash message
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// method override, after body-parser
app.use(methodOverride('_method'));

// get home
app.get('/', (req, res) => {
  res.render('index');
});

// user routes
app.use(userRoutes);


// connect
mongoose.connect('mongodb://localhost:27017/node-authentication', (err) => {
  if (err) throw err;
  // listen
  app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
  });

});

