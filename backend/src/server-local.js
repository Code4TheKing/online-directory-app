const app = require('./express/server');

const port = process.env.API_PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));
