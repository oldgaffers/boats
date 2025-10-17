module.exports = {
  output: {
    chunkFormat: false
  },
  module: {
    rules: [
      {
     {test: /\.css$/, loader: 'css-loader'},
      {test: /\.svg$/, loader: 'file-loader'}
      },
    ],
  },
};
