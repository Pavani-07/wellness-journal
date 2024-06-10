const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const session = require('express-session');
const indexRoutes = require('./routes/index');

mongoose.connect('mongodb://127.0.0.1:27017/wellness');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use('/', indexRoutes);

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const PORT = 8088;
app.listen(PORT, ()=> {
  console.log(`Server is running at ${PORT}`)
})