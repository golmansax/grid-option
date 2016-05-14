#!/usr/bin/env node

var jsonfile = require('jsonfile');
var path = require('path');

var inputFile = path.resolve(__dirname, 'data_predictions.json');
var input = jsonfile.readFileSync(inputFile);

var namesFile = path.resolve(__dirname, 'kern_hood_data.json');
var names = jsonfile.readFileSync(namesFile);

var nameToId = {};
names.forEach(({ name, hoodId }) => {
  nameToId[name] = hoodId;
});

var match = {};

var hoodsFile = path.resolve(__dirname, '..', 'neighborhoods', 'bakersfield.json');
var hoods = jsonfile.readFileSync(hoodsFile);

var count = 0;
hoods.forEach((hood) => {
  var name = hood.properties.NAME;
  if (name in nameToId) {
    match[nameToId[name]] = hood.properties.REGIONID;
  }
});

var ans = {};
Object.keys(input).forEach((id) => {
  if (id in match) {
    ans[match[id]] = input[id];
  }
});
console.log(Object.keys(ans).length, 'matched');

var outFile = path.resolve(__dirname, 'real_predictions.json');
jsonfile.writeFileSync(outFile, ans)
