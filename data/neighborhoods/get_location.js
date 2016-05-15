#!/usr/bin/env node

var env = process.env.NODE_ENV || 'development';
if (env === 'development') { require('dotenv').config(); }

var geocoder = require('geocoder')
var jsonfile = require('jsonfile')
var kern = require('../../scripts/kernDB');
var Promise = require('bluebird');
var path = require('path');

var idToLatLng = {};

geocoder.selectProvider("google",{"key":, process.env.GOOGLE_MAPS_SERVER_API_KEY, "region": "US"});

var tempKern = [
  {
    "address":"14004 FREMANTLE CT BAKERSFIELD, CA",
    "kw":9.1,
    "permitId":"KERNCO-16CAP-00000-000O1"
  },
  {
    "address":"319 BUCHANAN ST TAFT, CA",
    "kw":8,
    "permitId":"KERNCO-16CAP-00000-000MT"
  },
  {"address":"11330 SNOW RD BAKERSFIELD, CA","kw":7.21,"permitId":"KERNCO-16CAP-00000-000J2"},{"address":"10665 ODYSSY WY TAFT, CA","kw":6.1,"permitId":"KERNCO-16CAP-00000-000IZ"},{"address":"2408 CORTO ST BAKERSFIELD, CA","kw":4.6,"permitId":"KERNCO-16CAP-00000-000FW"},{"address":"2201 60TH  ROSAMOND, CA","kw":4.5,"permitId":"KERNCO-16CAP-00000-000FO"},{"address":"3324 SUSAN CT ROSAMOND, CA","kw":5.28,"permitId":"KERNCO-16CAP-00000-000EG"},{"address":"7901 OLIVE DR BAKERSFIELD, CA","kw":5.61,"permitId":"KERNCO-16CAP-00000-000EC"},
  {"address":"11330 SNOW RD BAKERSFIELD, CA","kw":7.21,"permitId":"KERNCO-16CAP-00000-000J2"},{"address":"10665 ODYSSY WY TAFT, CA","kw":6.1,"permitId":"KERNCO-16CAP-00000-000IZ"},{"address":"2408 CORTO ST BAKERSFIELD, CA","kw":4.6,"permitId":"KERNCO-16CAP-00000-000FW"},{"address":"2201 60TH  ROSAMOND, CA","kw":4.5,"permitId":"KERNCO-16CAP-00000-000FO"},{"address":"3324 SUSAN CT ROSAMOND, CA","kw":5.28,"permitId":"KERNCO-16CAP-00000-000EG"},{"address":"7901 OLIVE DR BAKERSFIELD, CA","kw":5.61,"permitId":"KERNCO-16CAP-00000-000EC"},
  {"address":"11330 SNOW RD BAKERSFIELD, CA","kw":7.21,"permitId":"KERNCO-16CAP-00000-000J2"},{"address":"10665 ODYSSY WY TAFT, CA","kw":6.1,"permitId":"KERNCO-16CAP-00000-000IZ"},{"address":"2408 CORTO ST BAKERSFIELD, CA","kw":4.6,"permitId":"KERNCO-16CAP-00000-000FW"},{"address":"2201 60TH  ROSAMOND, CA","kw":4.5,"permitId":"KERNCO-16CAP-00000-000FO"},{"address":"3324 SUSAN CT ROSAMOND, CA","kw":5.28,"permitId":"KERNCO-16CAP-00000-000EG"},{"address":"7901 OLIVE DR BAKERSFIELD, CA","kw":5.61,"permitId":"KERNCO-16CAP-00000-000EC"},
  {"address":"11330 SNOW RD BAKERSFIELD, CA","kw":7.21,"permitId":"KERNCO-16CAP-00000-000J2"},{"address":"10665 ODYSSY WY TAFT, CA","kw":6.1,"permitId":"KERNCO-16CAP-00000-000IZ"},{"address":"2408 CORTO ST BAKERSFIELD, CA","kw":4.6,"permitId":"KERNCO-16CAP-00000-000FW"},{"address":"2201 60TH  ROSAMOND, CA","kw":4.5,"permitId":"KERNCO-16CAP-00000-000FO"},{"address":"3324 SUSAN CT ROSAMOND, CA","kw":5.28,"permitId":"KERNCO-16CAP-00000-000EG"},{"address":"7901 OLIVE DR BAKERSFIELD, CA","kw":5.61,"permitId":"KERNCO-16CAP-00000-000EC"},
  {"address":"11330 SNOW RD BAKERSFIELD, CA","kw":7.21,"permitId":"KERNCO-16CAP-00000-000J2"},{"address":"10665 ODYSSY WY TAFT, CA","kw":6.1,"permitId":"KERNCO-16CAP-00000-000IZ"},{"address":"2408 CORTO ST BAKERSFIELD, CA","kw":4.6,"permitId":"KERNCO-16CAP-00000-000FW"},{"address":"2201 60TH  ROSAMOND, CA","kw":4.5,"permitId":"KERNCO-16CAP-00000-000FO"},{"address":"3324 SUSAN CT ROSAMOND, CA","kw":5.28,"permitId":"KERNCO-16CAP-00000-000EG"},{"address":"7901 OLIVE DR BAKERSFIELD, CA","kw":5.61,"permitId":"KERNCO-16CAP-00000-000EC"}
];

kern().then(function(arr) {

console.log(arr.length);
});

var idx = 0;

var missingHomes = [];

kern().then(function(arr) {
  function queryBatch(start) {
    console.log("Start at index: " + start);
    if (start > arr.length) {
      console.log("Missing Homes: \n");
      console.log(missingHomes);
      return;
    }

    Promise.all(
        arr.slice(start, start+10).map((house) => {
          return new Promise((resolve) => {
            geocoder.geocode(house['address'], (err, data) => {
              if (err) { throw err; }
              //console.log(data);
              if (data.results.length === 0) {
                missingHomes.push(house);
                resolve();
                return;
              }
              var geometry = data.results[0].geometry;
              var location = geometry.location;
              idToLatLng[house['permitId']] = location;
              resolve();
            });
          });
        })
    ).then(() => {
      var outputFile = path.join(__dirname, 'kern_locations' + idx + '.json');
      idx++;
      jsonfile.writeFileSync(outputFile, idToLatLng, {spaces: 2})
      setTimeout(function() {
        queryBatch(start+10);
      }, 1300);
    });
  }

  queryBatch(0);

});
