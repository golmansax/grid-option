var express = require('express');
var server = express();

server.get('/', (req, res) => {
  res.send('Hello, world');
});


server.listen(3000, function () {
    console.log("Listening on port 3000");
});

module.exports = server;
