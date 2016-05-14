var express = require('express');
var server = express();
var stylus = require('stylus');
var nib = require('nib');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

server.set('view engine', 'pug');

server.use(stylus.middleware({
  src: __dirname + '/public',
  compile: compile,
}))


server.use(express.static('public'));

server.get('/', (req, res) => {
  res.render('index');
});


server.listen(3000, function () {
    console.log("Listening on port 3000");
});
