const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const app = express();
const bodyParser = require('body-parser');
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

// // middleware
// app.use((req, res, next) => {
//   req.session.visits = req.session.visits || {};
//   req.session.visits[req.url] = req.session.visits[req.url] || 0;
//   req.session.visits[req.url]++;
//   console.log(req.session);
//   next();
// });

// get home
app.get('/', (req, res) => {
  res.render('index');
});

// get login
app.get('/login', (req, res) => {
  res.render('login');
});

// post login
app.post('/login', (req, res) => {
  res.redirect('/');
});

// get register
app.get('/register', (req, res) => {
  res.render('register');
});

// post register
app.post('/register', (req, res) => {
  if (req.body.password === req.body.verify) {
    res.redirect('/login');
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Passwords do not match.'
    });
  }
});

// listen
app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});
