const server = require('./singleton/server').getServer();

exports.debug = (err) => {
  throw new Error(err);
};

// eslint-disable-next-line no-unused-vars
exports.renderErrorPage = (err, req, res, next) => {
  if (err) console.error(err.toString());
  const message = err ? err.message : '';
  server.render(req, res, '/_error', { message });
};
