var path = require('path');
var jsonfile = require('jsonfile')
var getHood = require('../../data/neighborhoods/assoc_hood.js');

module.exports = function() {
  var dirName = path.resolve(__dirname, "../../", "data/kern_locations");

  var pidToRegionId = {};

  for (var i=0; i < 547; i++) {
    var fileName = dirName + "/kern_locations" + i + ".json";
    var obj = jsonfile.readFileSync(fileName);
    for (var attr in obj) {
      var regionId = getHood(obj[attr].lat, obj[attr].lng);
      if (regionId > 0) {
        pidToRegionId[attr] = regionId; 
      }
    }
    console.log("currently on file: " + i);
  }
  console.log(pidToRegionId);
  return pidToRegionId;
}
