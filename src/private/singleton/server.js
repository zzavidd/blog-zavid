const assert = require('assert');

let IServer;

/**
 * Set the instance of the server.
 * @param {object} instance - The server instance.
 */
exports.setServer = (instance) => {
  IServer = instance;
};

/**
 * Retrieve the server singleton instance.
 * @returns {object} The server instance.
 */
exports.getServer = () => {
  assert.ok(IServer, 'Server has not been initialized.');
  return IServer;
};
