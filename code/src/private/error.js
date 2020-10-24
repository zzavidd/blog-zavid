const server = require('./singleton').getServer();

const { classes } = require('./lib');
const { ErrorBuilder } = classes;

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
    new ErrorBuilder(`No such ${entity} exists.`, 404);
  },
  NONEXISTENT_ID: (id, entity) => {
    return new ErrorBuilder(`There exists no ${entity} with ID '${id}'.`);
  }
};
