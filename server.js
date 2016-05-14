var express = require('express');
var server = express();

server.get('/', (req, res) => {
  res.send('Hello, world');
});

module.exports = server;
