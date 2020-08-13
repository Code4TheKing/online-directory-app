const express = require('express');
const app = express();
try {
  var mongoose = require('mongoose');
} catch (e) {
  console.error(e);
}

app.use(require('body-parser').json());
app.use(express.static(__dirname + '/static'));

// Mongoose healthcheck route
app.get('/is-mongoose-ok', function (req, res) {
  if (mongoose) {
    res.json({ isMongooseOk: !!mongoose.connection.readyState })
  } else {
    res.json({ isMongooseOk: false })
  }
});

// Contacts route
app.use('/contacts', require('./routes/contacts'));

// Error handler
app.use(function (err, req, res, next) {
  if (err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }
});

// Unmatched routes handler
app.use(function (req, res) {
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
