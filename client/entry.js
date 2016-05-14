var bakerHoods = require('../data/neighborhoods/bakersfield.json');
var bakerHomes = require('../data/kern.json');

function getCoords(coords) {
  return coords.map((coord) => {
    if (Array.isArray(coord[0])) {
      console.log(coord);
    }
    return { lat: coord[1], lng: coord[0] };
  });
}

var COLORS = ['#e86828', '#828282'];

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
      radius: 40,
      strokeOpacity: 0,
      fillColor: '#222',
    });
  };
  var houses = [
    { lat: 35.387531, lng: -119.1192875, kw: '100', regionId: 272766 },
  ];

  houses.forEach((house) => {
    graphHouse(house);

    var regionId = house.regionId;
    hoodData[regionId] = hoodData[regionId] || { kwSum: 0, homeCount: 0 };
    hoodData[regionId].homeCount++;
    hoodData[regionId].kwSum += house.kw;
  });

  bakerHoods.forEach((hood, index) => {
    var color = COLORS[index % 2];
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
