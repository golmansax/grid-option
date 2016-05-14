var bakerHoods = require('../data/neighborhoods/bakersfield.json');
var bakerHomes = require('../data/kern.json');
var predictions = require('../data/quandl/real_predictions.json');

function isFuture() {
  return location.pathname.indexOf('future') >= 0;
}

function getCoords(coords) {
  return coords.map((coord) => {
    return { lat: coord[1], lng: coord[0] };
  });
}

var COLORS = ['#828282', '#e86828'];

function getCenter(coords) {
  var latSum = 0;
  var lngSum = 0;

  coords.forEach((coord) => {
    latSum += coord.lat;
    lngSum += coord.lng;
  });

  return { lat: latSum / coords.length, lng: lngSum / coords.length };
}

var lastWindow = null;
var hoodData = {};

global.initMap = () => {
  var center = { lat: 35.3733, lng: -119.0187 };
  var map = new google.maps.Map(document.getElementById('map'), {
    center,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  var graphHouse = (coords) => {
    var marker = new google.maps.Circle({
      center: coords,
      map: map,
      radius: 60,
      strokeOpacity: 0,
      fillColor: '#e86828',
      fillOpacity: .8,
    });
  };
  bakerHomes.forEach((house) => {
    graphHouse(house.geoLocation);

    var regionId = house.regionId || 'blah';
    hoodData[regionId] = hoodData[regionId] || { kwSum: 0, homeCount: 0 };
    hoodData[regionId].homeCount++;
    hoodData[regionId].kwSum += house.kw;
  });

  bakerHoods.forEach((hood, index) => {
    var present = index % 2;
    // var color = COLORS[good];
    var future = predictions[hood.properties.REGIONID] || present;
    var color = COLORS[isFuture() ? future : present];
    var hoodName = hood.properties.NAME;
    var myData = hoodData[hood.properties.REGIONID] || {};

    return hood.geometry.coordinates.map((coords) => {
      // Construct the polygon.
      var polygon = new google.maps.Polygon({
        paths: getCoords(coords),
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35
      });

      polygon.setMap(map);

      var center = getCenter(getCoords(coords));
      var infowindow = new google.maps.InfoWindow({
        content: [
          '<div>',
          `<h3>${hoodName}</h3>`,
          `<p>kW installed: ${myData.kwSum || 0}</p>`,
          `<p>Num installations: ${myData.homeCount || 0}</p>`,
          `<p>% installations: 5</p>`,
          '</div>',
        ].join(''),
        position: center,
      });

      polygon.addListener('click', function() {
        if (lastWindow) { lastWindow.close(); }
        infowindow.open(map);
        lastWindow = infowindow;
      });
    });
  });
};
