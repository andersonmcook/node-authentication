const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

// use jade
app.set('view engine', 'jade');

// body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));

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

// listen
app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});
