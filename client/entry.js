var bakerHoods = require('../data/neighborhoods/bakersfield.json');

function getCoords(hood) {
  return hood.geometry.coordinates[0].map((coords) => {
    return { lat: coords[1], lng: coords[0] };
  });
}

global.initMap = () => {
  var center = getCoords(bakerHoods[0])[0];
  var map = new google.maps.Map(document.getElementById('map'), {
    center,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  bakerHoods.forEach((hood) => {
    // Construct the polygon.
    var bermudaTriangle = new google.maps.Polygon({
      paths: getCoords(hood),
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });

    bermudaTriangle.setMap(map);
  });
};
