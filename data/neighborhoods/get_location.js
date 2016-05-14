#!/usr/bin/env node

var geocoder = require('geocoder')
var jsonfile = require('jsonfile')

var idToLatLng = {};

Promise.promisifyAll(
  ids.map((id) => {
    return new Promise((resolve) => {
      geocoder.geocode('14004 FREMANTLE CT, BAKERSFIELD, CA', (err, data) => {
        if (err) { throw err; }
        var geometry = data.results[0].geometry;
        var location = geometry.location;
        idToLatLng[id] = location;
        resolve();
      });
    });
  })
).then(() => {
  var outputFile = path.join(__dirname, `kern_locations.json`);
  jsonfile.writeFileSync(outputFile, idToLatLng, {spaces: 2})
});
