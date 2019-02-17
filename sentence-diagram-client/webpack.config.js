const path = require('path');

module.exports = {
  entry: './js/src/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'js', 'dist'),
    filename: 'bundle.js'
  }
};
