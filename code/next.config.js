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
      { test: /\.tsx?$/, loader: 'ts-loader' }
    );

    return config;
  },
  typescript: {
    ignoreBuildErrors: true
  }
};