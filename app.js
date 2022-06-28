require('dotenv').config();

const express = require('express');
const app = express();

// Export Documentation
const expressJSDocSwagger = require('express-jsdoc-swagger');
const options = {
  info: {
    version: '1.0.0',
    title: 'Yuan Membership Apps',
    description: 'API description',
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Local Server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Local Server Basic',
    },
  ],
  security: {
    BasicAuth: {
      type: 'https',
      scheme: 'basic',
    },
    BasicBearer: {
      type: 'http',
      scheme: 'bearer',
    },
  },
  baseDir: __dirname,
  filesPattern: './routes/*.js',
  swaggerUIPath: '/api-docs',
  exposeSwaggerUI: true,
  exposeApiDocs: true,
  apiDocsPath: '/json/api-docs',
  notRequiredAsNullable: false,
  swaggerUiOptions: {},
  multiple: false,
};

expressJSDocSwagger(app)(options);

// Export express accessories
require('express-group-routes');
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

// Export other
const logger = require('morgan');
const cors = require('cors');

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

// Export each routers
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
  console.log(`App listening on port ${port}`);
});
