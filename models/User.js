const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/iclc', { useNewUrlParser: true, useUnifiedTopology: true });

// Session setup
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/iclc' })
}));

app.use(express.json());

app.listen(3000, () => {
  console.log('Server running on port 3000');
});