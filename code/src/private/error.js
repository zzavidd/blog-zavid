const server = require('./singleton').getServer();

const isDev = process.env.NODE_ENV !== 'production';

const PROD_ERR_MESSAGE = 'A problem occurred. Please try again later!';

exports.debug = (err) => {
  throw err;
};

// eslint-disable-next-line no-unused-vars
exports.renderErrorPage = (err, req, res, next) => {
  console.error(err.toString());
  const errorPage = err.status === 404 ? '/404' : '/_error';
  const message = isDev ? err.message : PROD_ERR_MESSAGE;
  server.render(req, res, errorPage, { message });
};

exports.ERRORS = {
  NO_ENTITY: (entity) => {
    const error = new Error(`No such ${entity} exists.`);
    error.status = 404;
    return error;
  },
  NONEXISTENT_ID: (id, entity) => {
    const error = new Error(`There exists no ${entity} with ID '${id}'.`);
    return error;
  }
};
