#!/usr/bin/env node

var state = 'california';
var city = 'Bakersfield';
var center = { latitude: 35.3733, longitude: -119.0187 };

var jsonfile = require('jsonfile')
var path = require('path');
var geolib = require('geolib');

var file = path.join(__dirname, `${state}.json`);

var obj = jsonfile.readFileSync(file);
var features = obj.features;

var bakersfieldFeatures = features.filter((feature) => {
  if (feature.properties.CITY === city) { return true; }

  var aCoord = feature.geometry.coordinates[0][0];
  var aPoint = { latitude: aCoord[1], longitude: aCoord[0] };
  console.log(center, aPoint, geolib.getDistance(center, aPoint));
  // if (geolib.getDistance(center, aPoint) < 100000) { return true; }
});
console.log(`Found ${bakersfieldFeatures.length} hoods for ${city}`);

var outputFile = path.join(__dirname, `${city.toLowerCase()}.json`);
jsonfile.writeFileSync(outputFile, bakersfieldFeatures, {spaces: 2})
