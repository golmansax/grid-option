#!/usr/bin/env node

var geolib = require('geolib')
var hoods = require('./bakersfield.json');

var idToLatLng = {};

var input = { latitude: 35.3733, longitude: -119.0187 };

var matchedHood = null;

hoods.forEach((hood) => {
  var polygons = hood.geometry.coordinates.map((coords) => {
    return coords.map((coord) => {
      return {
        latitude: coord[1],
        longitude: coord[0],
      };
    });
  });

  if (polygons.some((polygon) => geolib.isPointInside(input, polygon))) {
    matchedHood = hood;
    return;
  }
});

console.log(matchedHood);
if (matchedHood) { console.log('ID', matchedHood.properties.REGIONID); }
