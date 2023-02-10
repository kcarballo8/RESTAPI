const http = require('http');
const app = require('./app');
require('./db');
const config = require('./config');
//require db

const server = http.createServer(app);

server.listen(config.hostPort, () => {
    console.log(`Listening on port ${config.hostPort}...`)
});