import express from 'express'
import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const APP_PORT = 6002

// Serve the Relay app
const compiler = webpack({
  mode: 'development',
  entry: ['whatwg-fetch', path.resolve(__dirname, 'src', 'app.js')],
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
    filename: 'app.js',
    path: '/',
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: path.resolve(__dirname, 'public', 'build.info.html'),
    })
  ]
})
const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  publicPath: '/js/',
  stats: {colors: true},
})

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')))

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`)
})
