#!/usr/bin/env node

var env = process.env.NODE_ENV || 'development';
if (env === 'development') { require('dotenv').config(); }

var Promise = require('bluebird');
var fs = require('fs');
var request = require('request');
var CSV = require('csv-string');
var ids = require('./hoods.json');
var path = require('path');

var indicator = 'RAH';
var api_key = process.env.QUANDL_API_KEY;

var data = {};

ids.map((id) => {
  var file = `http://www.quandl.com/api/v3/datasets/ZILL/N${id}_${indicator}.csv?api_key=${api_key}`
  var outputFile = path.join(__dirname, indicator, `${id}.csv`);
  request.get(file).pipe(fs.createWriteStream(outputFile))
});
/*
Promise.all(ids.map((id) => {
  var file = `http://www.quandl.com/api/v3/datasets/ZILL/N${id}_${indicator}.csv?api_key=${api_key}`

  return new Promise((resolve) => {
    request(file, (err, res, body) => {
      var ans = CSV.parse(body);
      var val = parseFloat(ans[1][1]);
      data[id] = val;
      resolve();
    });
  });
})).then(() => console.log(data));
*/
