var express = require('express');
var server = express();
var stylus = require('stylus');
var nib = require('nib');
var morgan = require('morgan');
var grid = require('./gridDB');

var env = process.env.NODE_ENV || 'development';

function isDev() {
  return env === 'development';
}

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

server.set('view engine', 'pug');

server.use(morgan(isDev() ? 'dev' : 'short'));
server.use(stylus.middleware({
  src: __dirname + '/public',
  compile: compile,
}))


if (isDev()) {
  const httpProxy = require('http-proxy');
  const proxy = httpProxy.createProxyServer();

  server.get('/dist/*', (req, res) => {
    proxy.web(req, res, { target: 'http://localhost:8080' });
  });
}

server.use(express.static('public'));

server.get('/', (req, res) => {
  res.render('index');
});

server.get('/kern', (req, res) => {
    grid().then(function(arr) {
        res.json(arr);
    });
});

server.listen(3000, function () {
  console.log("Listening on port 3000");
});
