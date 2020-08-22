const server = require('./singleton/server').getServer();

/** Builds a post query with conditions. */
class ErrorBuilder {
  constructor(message, status) {
    this.error = new Error(message);
    if (status) this.error.status = status;
    return this.error;
  }
}

exports.debug = (err) => {
  throw new Error(err);
};

// eslint-disable-next-line no-unused-vars
exports.renderErrorPage = (err, req, res, next) => {
  console.error(err.toString());
  const { message, status } = err;
  const errorPage = status === 404 ? '/404' : '/_error';
  server.render(req, res, errorPage, { message });
};

exports.ERRORS = {
  NO_REVERIE: new ErrorBuilder('No such reverie exists.', 404),
  NO_PAGE: new ErrorBuilder('No such page exists.', 404)
};
