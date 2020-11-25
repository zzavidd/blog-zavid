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
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }]
      }
    );

    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },
  typescript: {
    ignoreBuildErrors: true
  }
};
