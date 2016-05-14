#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var obj = JSON.parse(fs.readFileSync(path.join(__dirname, 'california_neighborhoods.json', 'utf8'));


