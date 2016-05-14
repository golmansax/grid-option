var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var Promise = require('bluebird');

var sys = require('sys')
var exec = require('child_process').exec;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/grid';

function clearDBs() {
    return new Promise(function(resolve, reject) {
        var toClear = [];

        // Use connect method to connect to the Server
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log('Connection established to', url);

                // Get the documents collection
                var kern = db.collection('kern').drop();
                toClear.push(kern);

                var charlotte = db.collection('charlotte').drop();
                toClear.push(charlotte);

                Promise.all(toClear).then(function() {
                    db.close();
                    resolve("Dropping Kern and Charlotte collections.");
                });;
            }
        });



    });
}

clearDBs().then(function(str) {
    console.log(str);
});
