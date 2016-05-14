var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var Promise = require('bluebird');

var sys = require('sys')
var exec = require('child_process').exec;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/grid';

function toPopulateBs() {
    return new Promise(function(resolve, reject) {
        var toPopulate = [];

        // executes `pwd`
        child = exec("mongoimport -d grid -c charlotte --type csv --file ../../data/SunCode_Charlotte_Rev.csv --headerline", function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

        toPopulate.push(child);

        // executes `pwd`
        child = exec("mongoimport -d grid -c kern --type csv --file ../../data/Kern_County_Solar_Customers.csv --headerline", function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

        toPopulate.push(child);

        Promise.all(toPopulate).then(function() {
            resolve("Populating Kern and Charlotte Databases");
        });;

    });
}

toPopulateBs().then(function(str) {
    console.log(str);
});
