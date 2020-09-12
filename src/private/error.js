const server = require('./singleton').getServer();

const { ErrorBuilder } = require('../classes');

exports.debug = (err) => {
  throw err;
};

// eslint-disable-next-line no-unused-vars
exports.renderErrorPage = (err, req, res, next) => {
  console.error(err.toString());
  const { message, status } = err;
  const errorPage = status === 404 ? '/404' : '/_error';
  server.render(req, res, errorPage, { message });
};

exports = {
  NO_ENTITY: (entity) => {
    new ErrorBuilder(`No such ${entity} exists.`, 404);
  },
  NONEXISTENT_ID: (id, entity) => {
    return new ErrorBuilder(`There exists no ${entity} with ID '${id}'.`);
  }
};
