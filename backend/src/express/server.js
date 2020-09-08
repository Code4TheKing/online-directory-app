const express = require('express');
const path = require('path');
const cors = require('cors')
const serverless = require('serverless-http');
const app = express();
try {
  var mongoose = require('mongoose');
} catch (e) {
  console.error(e);
}
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

app.use(require('body-parser').json());
app.use(express.static(path.join(__dirname, '../static')));

// CORS handler
const corsHandler = cors({
  origin: (origin, callback) => {
    const originWhitelist = process.env.API_ALLOWED_ORIGINS.split(',');
    if (originWhitelist.indexOf(origin) > -1) {
      callback(null, true);
    } else {
      const error = new Error(`Origin ${origin} not allowed by CORS`);
      error.statusCode = 401;
      callback(error);
    }
  }
});
app.use(corsHandler);

// Root-level logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip}`, '-', req.body, '-', req.query);
  next();
});

// JWT handler
var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.API_AUTH0_JWKS_URI
  }),
  audience: process.env.API_AUTH0_AUDIENCE,
  issuer: process.env.API_AUTH0_ISSUER,
  algorithms: ['RS256']
});
app.use(jwtCheck);

// Mongoose healthcheck route
app.get('/is-mongoose-ok', (req, res) => {
  if (mongoose) {
    res.json({ isMongooseOk: !!mongoose.connection.readyState })
  } else {
    res.json({ isMongooseOk: false })
  }
});

// Contacts route
const contactsRoute = require('../routes/contactsRoute');
app.use(`/${process.env.REACT_APP_API_BASE_PATH}/contacts`, contactsRoute);

// Profile Contacts route
const profileContactsRoute = require('../routes/profileContactsRoute');
app.use(`/${process.env.REACT_APP_API_BASE_PATH}/profile-contacts`, profileContactsRoute);

// Error handler
app.use((err, req, res, next) => {
  if (err) {
    const error = {
      message: err.message || err.error_description || 'Internal Server Error',
      statusCode: err.statusCode || 500,
      timestamp: new Date().toISOString()
    }
    console.error(`[${new Date().toISOString()}]`, 'Error occurred', error);
    res.status(error.statusCode)
      .type('json')
      .send(error);
  }
});

// Unmatched routes handler
app.use((req, res) => {
  if (req.method.toLowerCase() === 'options') {
    res.end();
  } else {
    const error = {
      message: 'Not Found',
      timestamp: new Date().toISOString(),
      statusCode: 404
    }
    res.status(error.statusCode)
      .type('json')
      .send(error);
  }
})

const gracefulShutdown = () => {
  process.exit();
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon

module.exports = app;
module.exports.handler = serverless(app);