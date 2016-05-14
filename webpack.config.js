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
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: { presets: ['es2015'] },
      },
      { test: /\.json/, loader: 'json' },
    ],
  },
};
