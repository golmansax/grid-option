#!/usr/bin/env node

var jsonfile = require('jsonfile')
var path = require('path');

var file = path.join(__dirname, 'california.json');

var obj = jsonfile.readFileSync(file);
var features = obj.features;

var bakersfieldFeatures = features.filter((feature) => feature.properties.CITY === 'Bakersfield');
console.log(`Found ${bakersfieldFeatures.length} hoods for Bakersfield`);

var outputFile = path.join(__dirname, 'bakersfield.json');
jsonfile.writeFileSync(outputFile, bakersfieldFeatures, {spaces: 2})
