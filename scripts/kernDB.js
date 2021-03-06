//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var Promise = require('bluebird');
var getPidToLatLongList = require('./one-off/map_pid_to_lat_long.js');
var latLongHoodMap = require('./one-off/get_lat_long_hood_map.js');


//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/grid';
var pidToLatLongList = getPidToLatLongList();
//var latLongHoodMap = latLongHoodMap();
//console.log(latLongHoodMap);

module.exports = function() {
    
    return new Promise(function(resolve, reject) {
        // Use connect method to connect to the Server
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log('Connection established to', url);

                // Get the documents collection
                var collection = db.collection('kern');

                var resArr = [];

                collection.find().toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else if (result.length) {
                        //console.log('Found:', result); 
                        for (var i=0; i < result.length; i++) {
                            var curr = result[i];
                            var address = curr['addresses[0]'];
                            var addressStr = address['streetStart'] + " " + address['streetName'] + " " + address['streetSuffix']['text'] + " " + address['city'] + ", " + address['state']['text'];

                            var geoLocation = pidToLatLongList[curr['permit id']];
                            
                            resArr.push({
                                "address": addressStr,
                                "kw": curr['kw'],
                                "permitId": curr['permit id'],
                                "geoLocation": geoLocation
                            });
                        }
                    } else {
                        console.log('No document(s) found with defined "find" criteria!');
                    }
                    resolve(resArr);
                    db.close();
                });

            }
        });
    });
}
