var bakerHoods = require('../data/neighborhoods/bakersfield.json');
var bakerHomes = require('../data/kern.json');
var predictions = require('../data/quandl/real_predictions.json');

var isFuture = location.pathname.indexOf('future') >= 0;

var switchToFuture = {
  275377: true,
  275333: true,
  275721: true,
  275786: true,
  275334: true,
  276536: true,
}

var withSolar = {
  273528: true,
  274019: true,
  272843: true,
  273584: true,
  274211: true,
  273308: true,
  273495: true,
  272940: true,
  275579: true,
  275482: true,
  276240: true,
  275156: true,
  273154: true,
};

function getCoords(coords) {
  return coords.map((coord) => {
    return { lat: coord[1], lng: coord[0] };
  });
}

var COLORS = ['#828282', '#e86828', '#e25010'];

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
var avgUsage = 7.1; // this would be computed from the assoc_hood module

var hoodData = {
  273308: {
    kwSum: avgUsage * 2,
    homeCount: 2
  },
  274019: {
    kwSum: avgUsage * 31,
    homeCount: 31
  },
  272843: {
    kwSum: avgUsage * 39,
    homeCount: 39
  },
  273584: {
    kwSum: avgUsage * 1,
    homeCount: 1
  },
  273528: {
    kwSum: avgUsage * 19,
    homeCount: 19
  },
  274211: {
    kwSum: avgUsage * 15,
    homeCount: 15
  },
  273495: {
    kwSum: avgUsage * 5,
    homeCount: 5
  },
  275579: {
    kwSum: avgUsage * 8,
    homeCount: 8
  },
  272940: {
    kwSum: avgUsage * 32,
    homeCount: 32
  },
  276240: {
    kwSum: avgUsage * 15,
    homeCount: 15
  },
  275156: {
    kwSum: avgUsage * 15,
    homeCount: 15
  },
  273154: {
    kwSum: avgUsage * 5,
    homeCount: 5
  },
  275482: {
    kwSum: avgUsage * 4,
    homeCount: 4
  },
};

var hoodsThatChange = [];

global.initMap = () => {
  window.document.getElementById("switch").addEventListener('click', (event) => {
    event.preventDefault();

    isFuture = !isFuture;

    window.document.getElementById("switch").innerHTML =
      isFuture ? 'Show current data' : 'Show future predictions';

    window.document.getElementById("header").innerHTML =
      isFuture ? 'Future predictions for Bakersfield, CA' : 'Current data for Bakersfield, CA'

    hoodsThatChange.forEach((hood) => {
      var color = COLORS[isFuture ? 2 : hood.present];
      hood.polygons.forEach((polygon) => {
        polygon.setOptions({
          strokeColor: color,
          fillColor: color,
          fillOpacity: isFuture ? 0.7 : 0.35,
        });
      });
    });
  });

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
    var hoodName = hood.properties.NAME;
    var regionId = hood.properties.REGIONID;

    // var present = index % 2;
    var present = 0 + (withSolar[regionId] ? 1 : 0);
    // var color = COLORS[good];
    var future = predictions[regionId] || switchToFuture[regionId] || present;

    var color = COLORS[isFuture ? future : present];
    var myData = hoodData[regionId] || {};

    var polygons = hood.geometry.coordinates.map((coords) => {
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
          `<h3>${regionId}</h3>`,
          `<p>kW installed: ${myData.kwSum || 0}</p>`,
          `<p>Num installations: ${myData.homeCount || 0}</p>`,
          '</div>',
        ].join(''),
        position: center,
      });

      polygon.addListener('click', function() {
        if (lastWindow) { lastWindow.close(); }
        infowindow.open(map);
        lastWindow = infowindow;
      });

      return polygon;
    });
    console.log(polygons);

    if (future !== present) {
      hoodsThatChange.push({ polygons, future, present });
    }

    return polygons;
  });
};
