const express = require('express');
const app = express();

app.use(require('body-parser').json());
app.use(express.static(__dirname + '/static'));

app.listen(4000, () => console.log('Listening on port 4000'));

const gracefulShutdown = () => {
    process.exit();
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
