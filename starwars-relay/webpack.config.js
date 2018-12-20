const path = require('path');
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src', 'app.js'),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /\/node_modules\//,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  output: {
    filename: 'static/js/bundle.js',
    publicPath: '/'
  },
}