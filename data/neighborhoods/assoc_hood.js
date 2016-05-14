#!/usr/bin/env node

var geolib = require('geolib')
var hoods = require('./bakersfield.json');

module.exports = function(lat, lng) {
  //var input = { latitude: 35.3733, longitude: -119.0187 };
  var input = { latitude: lat, longitude: lng };

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

  if (matchedHood) {
    return matchedHood.properties.REGIONID;
  } else {
    return -1;
  }
}
