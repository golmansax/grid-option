var path = require('path');
module.exports = {
  entry: {
    entry: "./client/entry.js",
  },
  output: {
    path: path.join(__dirname, 'public', 'dist'),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  module: {}
};
