module.exports = {
  entry: ["./src/main.js"],
  output: {
    path: __dirname + '/dist',
    filename: "map.js",
    libraryTarget: "var",
    library: "bindTo"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(json|geojson)$/, loader: 'json-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: "style!css" }
    ]
  }
};
