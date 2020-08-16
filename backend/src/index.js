const express = require('express');
const cors = require('cors')
const app = express();
try {
  var mongoose = require('mongoose');
} catch (e) {
  console.error(e);
}

app.use(require('body-parser').json());
app.use(express.static(__dirname + '/static'));

// CORS handler
const corsHandler = cors({
  origin: (origin, callback) => {
    const originWhitelist = ["http://localhost", "http://localhost:3000"];
    if (originWhitelist.indexOf(origin) > -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }

  }
});
app.use(corsHandler);

// Root-level logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip} -`, req.body);
  next();
});

// Mongoose healthcheck route
app.get('/is-mongoose-ok', (req, res) => {
  if (mongoose) {
    res.json({ isMongooseOk: !!mongoose.connection.readyState })
  } else {
    res.json({ isMongooseOk: false })
  }
});

// Contacts route
const contactsRoute = require('./routes/contactsRoute');
app.use('/_api/v1/contacts', contactsRoute);
contactsRoute.all('*', corsHandler);

// Error handler
app.use((err, req, res, next) => {
  if (err) {
    console.error(`[${new Date().toISOString()}] ${err}`);
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }
});

// Unmatched routes handler
app.use((req, res) => {
  if (req.method.toLowerCase() === 'options') {
    res.end();
  } else {
    res.status(404).type('txt').send('Not Found');
  }
})

app.listen(4000, () => console.log('Listening on port 4000'));

const gracefulShutdown = () => {
  process.exit();
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
