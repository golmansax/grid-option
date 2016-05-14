var path = require('path');
var jsonfile = require('jsonfile')

module.exports = function() {
  var dirName = path.resolve(__dirname, "../../", "data/kern_locations");

  var pidToLatLong = {};

  for (var i=0; i < 547; i++) {
    var fileName = dirName + "/kern_locations" + i + ".json";
    var obj = jsonfile.readFileSync(fileName);
    for (var attr in obj) {
      pidToLatLong[attr] = obj[attr];
    }
  }
  return pidToLatLong;
}
