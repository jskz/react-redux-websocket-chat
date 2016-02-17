'use strict'

var webpack = require('webpack')

module.exports = {
    entry: ['./client/index.js', './client/style.sass'],
    module: {
        loaders: [
            { test: /\.sass$/, loader: 'style!css!sass?indentedSyntax' },
            { test: /\.scss$/, loader: 'style!css!sass' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: __dirname + '/static'
    }
}
