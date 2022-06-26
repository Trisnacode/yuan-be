require('dotenv').config();

const express = require('express')
const app = express()
require('express-group-routes');
const port = process.env.PORT || 3000

const fs = require('fs');
const path = require('path');

const logger = require('morgan');
const cors = require('cors');
const prisma = require('./prisma')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cors());

// somehow cors failed #Testing only
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

fs.readdirSync(__dirname + '/routes').filter((file) => {
  return file.toLowerCase().endsWith('.js');
}).forEach((file) => {
  app.use('/', require(__dirname + '/routes/' + file));
});

// Default error handler
app.use((err, req, res, next) => {
  if (typeof err.handle === 'function') {
    err.handle();
  }

  if (err.printMsg === undefined) {
    console.error(err);
  }

  res.status(err.statusCode || 500).json({
    code: err.statusCode || 500,
    msg: err.printMsg || 'Something went wrong!',
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})