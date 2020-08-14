const express = require('express');
const app = express();
try {
  var mongoose = require('mongoose');
} catch (e) {
  console.error(e);
}

app.use(require('body-parser').json());
app.use(express.static(__dirname + '/static'));

// Root-level logger
app.use((req, res, next) => {
  console.log(req.method, req.path, "-", req.ip);
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
const contacts = require('./routes/contacts');
app.use('/contacts', contacts);

// Error handler
app.use((err, req, res, next) => {
  if (err) {
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
