const assert = require('assert');

let IApp;
let IKnex;
let IServer;

exports.setApp = (instance) => {
  IApp = instance;
};

exports.setKnex = (instance) => {
  IKnex = instance;
  console.info('Connected to database.');
};

exports.setServer = (instance) => {
  IServer = instance;
};

exports.getApp = () => {
  assert.ok(IApp, 'An application instance has not been initialized.');
  return IApp;
};

exports.getKnex = () => {
  assert.ok(IKnex, 'A Knex instance has not been initialized.');
  return IKnex;
};
exports.getServer = () => {
  assert.ok(IServer, 'An server instance has not been initialized.');
  return IServer;
};
