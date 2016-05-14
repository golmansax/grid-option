var bakerHoods = require('../data/neighborhoods/bakersfield.json');

function getCoords(coords) {
  return coords.map((coord) => {
    if (Array.isArray(coord[0])) {
      console.log(coord);
    }
    return { lat: coord[1], lng: coord[0] };
  });
}

global.initMap = () => {
  var center = { lat: 35.3733, lng: -119.0187 };
  var map = new google.maps.Map(document.getElementById('map'), {
    center,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  bakerHoods.forEach((hood) => {
    return hood.geometry.coordinates.map((coords) => {
      // Construct the polygon.
      var bermudaTriangle = new google.maps.Polygon({
        paths: getCoords(coords),
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });

      bermudaTriangle.setMap(map);
    });
  });
};
