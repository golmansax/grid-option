var express = require('express');
var server = express();
var stylus = require('stylus');
var nib = require('nib');
var morgan = require('morgan');
var kern = require('./scripts/kernDB');

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
  res.render('index', { future: false });
});

server.get('/future', (req, res) => {
  res.render('index', { future: true });
});

server.get('/kern', (req, res) => {
    kern().then(function(arr) {
        res.json(arr);
    });
});

var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
