require('dotenv').config();

module.exports = {
  webpack: function (config) {
    config.module.rules.push(
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]'
          }
        }
      },
      //  { test: /\.tsx?$/, loader: 'ts-loader' }
    );

    config.node = {
      fs: 'empty',
      child_process: 'empty',
      module: 'empty'
    };

    config.plugins = config.plugins || [];

    config.resolve.extensions.push('.scss', '.ts', '.tsx');
    return config;
  }
};
