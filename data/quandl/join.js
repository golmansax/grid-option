#!/usr/bin/env node

var Promise = require('bluebird');
var fs = require('fs');
var request = require('request');
var CSV = require('csv-string');
var ids = require('./hoods.json');
var path = require('path');
var csvWriter = require('csv-write-stream');

var indicators = ['MVSF', 'RAH', 'A'];

var data = {};

indicators.forEach((indicator) => {
  ids.forEach((id) => {
    var file = path.join(__dirname, indicator, `${id}.csv`);
    var body = fs.readFileSync(file, 'utf8')
    var ans = CSV.parse(body);
    var val = parseFloat(ans[1][1]);
    data[id] = data[id] || {};
    data[id][indicator] = val;
  });
});

var writer = csvWriter({ headers: ['hoodId'].concat(indicators) })
var outFile = path.join(__filename, 'joined_hood_data.csv');
writer.pipe(fs.createWriteStream('joined_hood_data.csv'));

Object.keys(data).forEach((id) => {
  var me = data[id];
  writer.write(Object.assign({}, me, { hoodId: id }));
});
writer.end();



/*
Promise.all(ids.map((id) => {
  var file = `http://www.quandl.com/api/v3/datasets/ZILL/N${id}_${indicator}.csv?api_key=${api_key}`

  return new Promise((resolve) => {
    request(file, (err, res, body) => {
      var val = parseFloat(ans[1][1]);
      data[id] = val;
      resolve();
    });
  });
})).then(() => console.log(data));
*/
