const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => console.log(`Established connection to MongoDB on host ${result.connection.host}:${result.connection.port} with user ${result.connection.user}`))
  .catch(err => console.error(err));
