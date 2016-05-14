var express = require('express');
var server = express();

server.set('view engine', 'pug');

server.get('/', (req, res) => {
  res.render('index');
});


server.listen(3000, function () {
    console.log("Listening on port 3000");
});

module.exports = server;
